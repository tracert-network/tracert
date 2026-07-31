// Submission API core: validate a manifest server-side, then have a bot open a
// same-repo-branch PR (no fork needed). Mirrors the ai-directory host-side fix
// for the fact that scoped agent tokens usually can't fork.
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { stringify as yamlStringify } from "yaml";
import manifestSchema from "@/generated/manifest.schema.json";

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats.default(ajv as never);
const validateManifest = ajv.compile(manifestSchema);

const SLUG = /^[a-z0-9][a-z0-9-]{1,62}$/;
const CAP_ID = /^[a-z0-9][a-z0-9-]*\.[a-z0-9][a-z0-9-]*$/;

export interface SubmissionBody {
  manifest?: Record<string, unknown>;
  input_schema?: object;
  output_schema?: object;
  submitted_by?: string;
}
export interface FieldError { code: string; message: string; field?: string }
export interface ValidFile { path: string; content: string }
export type Validated =
  | { ok: false; errors: FieldError[] }
  | { ok: true; providerId: string; name: string; capabilityId: string; files: ValidFile[] };

// Validate + normalize the submission. Runs before any GitHub call so an agent
// gets field-level feedback whether or not the endpoint is configured.
export function validateSubmission(body: SubmissionBody): Validated {
  const errors: FieldError[] = [];
  const manifest = body.manifest;
  if (!manifest || typeof manifest !== "object") {
    return { ok: false, errors: [{ code: "invalid_input", message: "body.manifest is required (the TRACE manifest as a JSON object)", field: "manifest" }] };
  }

  for (const key of ["input_schema", "output_schema"] as const) {
    const s = body[key];
    if (!s || typeof s !== "object") {
      errors.push({ code: "invalid_input", message: `body.${key} is required (a JSON Schema object)`, field: key });
      continue;
    }
    try {
      new Ajv2020({ strict: false }).compile(s);
    } catch (e) {
      errors.push({ code: "invalid_input", message: `${key} is not a compilable JSON Schema: ${String((e as Error).message).slice(0, 200)}`, field: key });
    }
  }

  const cap = manifest.capability as Record<string, unknown> | undefined;
  const provider = manifest.provider as Record<string, unknown> | undefined;
  const service = manifest.service as Record<string, unknown> | undefined;
  const providerId = provider?.id;
  const capabilityId = cap?.id;

  if (typeof providerId !== "string" || !SLUG.test(providerId)) {
    errors.push({ code: "invalid_input", message: "provider.id must be a lowercase-hyphen slug", field: "provider.id" });
  }
  let name = "";
  if (typeof capabilityId !== "string" || !CAP_ID.test(capabilityId)) {
    errors.push({ code: "invalid_input", message: "capability.id must be '<prefix>.<name>' (lowercase-hyphen)", field: "capability.id" });
  } else {
    const prefix = capabilityId.split(".")[0];
    name = capabilityId.split(".")[1];
    if (prefix !== providerId && prefix !== service?.id) {
      errors.push({ code: "invalid_input", message: `capability id prefix "${prefix}" must equal provider.id or service.id`, field: "capability.id" });
    }
    if (!SLUG.test(name)) errors.push({ code: "invalid_input", message: "capability name segment must be a slug", field: "capability.id" });
  }

  // Canonicalize the schema_ref paths so the writer controls where files land.
  if (name && cap) {
    if (cap.input && typeof cap.input === "object") (cap.input as Record<string, unknown>).schema_ref = `../schemas/${name}.input.schema.json`;
    if (cap.output && typeof cap.output === "object") (cap.output as Record<string, unknown>).schema_ref = `../schemas/${name}.output.schema.json`;
  }

  if (!validateManifest(manifest)) {
    for (const e of validateManifest.errors ?? []) {
      errors.push({ code: "invalid_input", message: `${e.instancePath || "$"} ${e.message}`, field: e.instancePath || undefined });
    }
  }

  const status = cap?.status;
  if (typeof status === "string" && status !== "draft") {
    const blob = JSON.stringify(manifest);
    if (/https:\/\/[a-z0-9.-]*\.example([/":]|$)/.test(blob)) errors.push({ code: "invalid_input", message: "manifest contains .example placeholder hosts but status is not draft — use real URLs" });
    if (/TODO/.test(blob)) errors.push({ code: "invalid_input", message: "manifest contains TODO markers but status is not draft" });
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    providerId: providerId as string,
    name,
    capabilityId: capabilityId as string,
    files: [
      { path: `registry/providers/${providerId}/capabilities/${name}.yaml`, content: yamlStringify(manifest) },
      { path: `registry/providers/${providerId}/schemas/${name}.input.schema.json`, content: JSON.stringify(body.input_schema, null, 2) + "\n" },
      { path: `registry/providers/${providerId}/schemas/${name}.output.schema.json`, content: JSON.stringify(body.output_schema, null, 2) + "\n" },
    ],
  };
}

// ---- GitHub operations (bot token) ----

export class GitHubError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

const GH = "https://api.github.com";
const repo = () => process.env.TRACERT_SUBMIT_REPO || "tracert-network/tracert";
const base = () => process.env.TRACERT_SUBMIT_BASE || "main";

async function gh(path: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(`${GH}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "tracert-submit",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(20_000),
  });
}

export async function capabilityExists(token: string, providerId: string, name: string): Promise<boolean> {
  const path = `/repos/${repo()}/contents/registry/providers/${providerId}/capabilities/${name}.yaml?ref=${base()}`;
  const res = await gh(path, token);
  return res.status === 200;
}

export async function createSubmissionPR(
  token: string,
  opts: { capabilityId: string; files: ValidFile[]; submittedBy?: string; branch: string },
): Promise<{ pr_url: string; pr_number: number; branch: string }> {
  const r = repo();
  const b = base();

  const refRes = await gh(`/repos/${r}/git/ref/heads/${b}`, token);
  if (!refRes.ok) throw new GitHubError(`could not read base ref (${refRes.status})`, refRes.status);
  const baseSha = ((await refRes.json()) as { object: { sha: string } }).object.sha;

  const brRes = await gh(`/repos/${r}/git/refs`, token, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${opts.branch}`, sha: baseSha }),
  });
  if (!brRes.ok) throw new GitHubError(`could not create branch (${brRes.status}): ${(await brRes.text()).slice(0, 200)}`, brRes.status);

  for (const f of opts.files) {
    const putRes = await gh(`/repos/${r}/contents/${f.path.split("/").map(encodeURIComponent).join("/")}`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: `Add ${opts.capabilityId}: ${f.path.split("/").pop()}`,
        content: Buffer.from(f.content, "utf8").toString("base64"),
        branch: opts.branch,
      }),
    });
    if (!putRes.ok) throw new GitHubError(`could not write ${f.path} (${putRes.status}): ${(await putRes.text()).slice(0, 200)}`, putRes.status);
  }

  const who = opts.submittedBy ? ` by \`${opts.submittedBy.replace(/[`\n\r]/g, "").slice(0, 64)}\`` : "";
  const prBody = [
    `Submitted via the Tracert registry submission API${who}.`,
    "",
    `Capability: \`${opts.capabilityId}\``,
    "",
    "CI re-validates this manifest against the TRACE schema; a maintainer reviews before merge.",
  ].join("\n");
  const prRes = await gh(`/repos/${r}/pulls`, token, {
    method: "POST",
    body: JSON.stringify({ title: `Add ${opts.capabilityId}`, head: opts.branch, base: b, body: prBody }),
  });
  if (!prRes.ok) throw new GitHubError(`could not open PR (${prRes.status}): ${(await prRes.text()).slice(0, 200)}`, prRes.status);
  const pr = (await prRes.json()) as { html_url: string; number: number };
  return { pr_url: pr.html_url, pr_number: pr.number, branch: opts.branch };
}
