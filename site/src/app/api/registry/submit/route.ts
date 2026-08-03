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
import { checkDenylist, checkRateLimit, manifestHosts, verifyOwnership } from "@/lib/verify";
import { timingSafeEqual } from "node:crypto";

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

// Maintainer path: an X-Tracert-Admin-Key header matching TRACERT_ADMIN_KEY
// (constant-time compare) authorizes a submission to skip ownership + rate
// limits. Used only by us, for wrappers we vouch for.
function isAdmin(req: Request): boolean {
  const provided = req.headers.get("x-tracert-admin-key") || "";
  const expected = process.env.TRACERT_ADMIN_KEY || "";
  if (expected.length === 0 || provided.length === 0) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
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
      manifest: "TRACE manifest as a JSON object (schema: https://tracert.site/schemas/manifest/v0.1); provider.url is required",
      input_schema: "JSON Schema for the capability input",
      output_schema: "JSON Schema for the capability output",
      submitted_by: "optional identifier for attribution",
    },
    ownership_required: {
      how: "Prove you control the provider.url domain: host a file at https://<provider.url-host>/.well-known/tracert.json",
      file: { provider: "<your provider id>", capabilities: ["<capability id you are publishing>", "…"] },
      why: "One static file (no DNS needed) authorizes exactly the capabilities you list. It's checked before any PR is opened.",
    },
    limits: "Rate-limited per provider and globally. Payloads over 256 KB are rejected.",
    admin_path: "Maintainers submit wrapper capabilities (provenance unofficial/byok, third-party provider) with an X-Tracert-Admin-Key header, which skips the ownership + rate-limit gates. Not available to the public.",
    behavior:
      "Validates server-side and verifies domain ownership; on success a Tracert bot opens a pull request from a same-repo branch (no fork needed). CI re-validates and, if it passes, the PR is squash-merged automatically — no human review queue. Returns 201 with pr_url.",
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

  // Abuse gates (cheap → expensive; the most common rejection, ownership,
  // returns clear instructions). These run before any external write.
  const manifest = body.manifest as Record<string, unknown>;
  const providerUrl = (manifest.provider as { url?: string } | undefined)?.url;

  // The denylist applies to everyone, admins included.
  const deny = await checkDenylist(result.providerId, manifestHosts(manifest), result.capabilityId);
  if (!deny.ok) return json(403, { error: { code: deny.code, message: deny.message } });

  // Maintainer/admin path: a valid admin key skips the ownership + rate-limit
  // gates. This is how we submit WRAPPER capabilities (provenance unofficial /
  // byok) where the provider is a third party whose domain we don't control.
  const admin = isAdmin(req);
  if (!admin) {
    const rl = await checkRateLimit(token, result.providerId);
    if (!rl.ok) return json(429, { error: { code: rl.code, message: rl.message } });

    const own = await verifyOwnership(providerUrl, result.providerId, result.capabilityId);
    if (!own.ok) return json(403, { error: { code: own.code, message: own.message }, ...(own.detail ?? {}) });
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
    return json(201, { ok: true, capability_id: result.capabilityId, ...pr, ...(admin ? { admin: true } : {}) });
  } catch (e) {
    const status = e instanceof GitHubError ? 502 : 500;
    return json(status, { error: { code: "submission_failed", message: e instanceof Error ? e.message : "unknown error" } });
  }
}
