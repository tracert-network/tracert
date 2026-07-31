// POST /api/registry/submit — no-fork capability submission.
//
// An agent POSTs { manifest, input_schema, output_schema, submitted_by? }. The
// endpoint validates server-side (same TRACE schema the registry enforces), then
// a Tracert bot opens a pull request from a SAME-REPO branch — no fork, which
// scoped agent tokens usually can't do. It never merges; CI + a maintainer gate.
//
// Gated: without TRACERT_SUBMIT_TOKEN it returns 503 not_configured (safe to
// deploy dark). Validation still runs, so agents can iterate before it's live.
import {
  capabilityExists,
  createSubmissionPR,
  GitHubError,
  validateSubmission,
  type SubmissionBody,
} from "@/lib/submit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 256 * 1024;
const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(status: number, obj: unknown): Response {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS });
}

export function GET(): Response {
  return json(200, {
    endpoint: "https://tracert.site/api/registry/submit",
    method: "POST",
    enabled: Boolean(process.env.TRACERT_SUBMIT_TOKEN),
    body: {
      manifest: "TRACE manifest as a JSON object (schema: https://tracert.site/schemas/manifest/v0.1)",
      input_schema: "JSON Schema for the capability input",
      output_schema: "JSON Schema for the capability output",
      submitted_by: "optional identifier for attribution",
    },
    behavior:
      "Validates server-side; on success a Tracert bot opens a pull request from a same-repo branch (no fork needed). CI re-validates and, if it passes, the PR is squash-merged automatically — no human review queue. Returns 201 with pr_url.",
    guide: "https://github.com/tracert-network/tracert/blob/main/registry/CONTRIBUTING.md",
  });
}

export async function POST(req: Request): Promise<Response> {
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return json(415, { error: { code: "unsupported_media_type", message: "Content-Type must be application/json" } });
  }
  const raw = await req.text();
  if (raw.length > MAX_BYTES) {
    return json(413, { error: { code: "payload_too_large", message: `body exceeds ${MAX_BYTES} bytes` } });
  }
  let body: SubmissionBody;
  try {
    body = JSON.parse(raw) as SubmissionBody;
  } catch {
    return json(400, { error: { code: "invalid_json", message: "request body is not valid JSON" } });
  }

  const result = validateSubmission(body);
  if (!result.ok) {
    return json(400, { error: { code: "invalid_input", message: "submission failed validation" }, errors: result.errors });
  }

  const token = process.env.TRACERT_SUBMIT_TOKEN;
  if (!token) {
    return json(503, {
      error: {
        code: "not_configured",
        message:
          "Your submission is valid, but the submission API is not configured on this deployment yet. Open a pull request manually (see the guide), or try again later.",
      },
      guide: "https://github.com/tracert-network/tracert/blob/main/registry/CONTRIBUTING.md",
    });
  }

  try {
    if (await capabilityExists(token, result.providerId, result.name)) {
      return json(409, {
        error: { code: "already_exists", message: `Capability ${result.capabilityId} already exists — open a PR to update it instead.` },
      });
    }
    const branch = `submit/${result.providerId}-${result.name}-${Date.now().toString(36)}`;
    const pr = await createSubmissionPR(token, {
      capabilityId: result.capabilityId,
      files: result.files,
      submittedBy: typeof body.submitted_by === "string" ? body.submitted_by : undefined,
      branch,
    });
    return json(201, { ok: true, capability_id: result.capabilityId, ...pr });
  } catch (e) {
    const status = e instanceof GitHubError ? 502 : 500;
    return json(status, { error: { code: "submission_failed", message: e instanceof Error ? e.message : "unknown error" } });
  }
}
