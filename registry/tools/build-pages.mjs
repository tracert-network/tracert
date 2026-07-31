#!/usr/bin/env node
// Generates the canonical capability page for every manifest: one crawlable
// document per capability, produced entirely from structured data (no
// hand-written marketing). Markdown for the bootstrap; the same generator
// grows an HTML/SEO surface in Phase 2.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { relative } from "node:path";
import { REGISTRY_ROOT, findManifestFiles, loadManifest, resolveRef } from "./lib.mjs";

const outDir = `${REGISTRY_ROOT}/dist/pages`;
mkdirSync(outDir, { recursive: true });

// Live capability pages get written. Reference manifests (templates/, examples/)
// are also rendered — output discarded — so CI exercises this renderer over the
// full manifest shape even when the live registry is empty. An empty registry
// once let a data_policy shape migration reach main with this generator still
// calling .trim() on what became an object; rendering the examples every build
// closes that gap.
const live = findManifestFiles();
const reference = [
  ...findManifestFiles(REGISTRY_ROOT, "templates"),
  ...findManifestFiles(REGISTRY_ROOT, "examples"),
];

for (const file of live) {
  const m = loadManifest(file);
  writeFileSync(`${outDir}/${m.capability.id}.md`, renderPage(m, m.capability, file));
  console.log(`dist/pages/${m.capability.id}.md written`);
}
for (const file of reference) {
  const m = loadManifest(file);
  renderPage(m, m.capability, file); // exercise the renderer; output not shipped
}
console.log(`build-pages: ${live.length} live page(s); ${reference.length} reference manifest(s) render-checked.`);

function inlineSchema(manifestFile, ref) {
  const r = resolveRef(manifestFile, ref);
  if (r.kind === "url") return `_External schema: ${r.target}_`;
  if (!existsSync(r.target)) return `_Unresolved schema ref: ${ref}_`;
  return "```json\n" + readFileSync(r.target, "utf8").trim() + "\n```";
}

function renderPage(m, c, file) {
  const lines = [];
  const price = c.pricing.free
    ? "Free — no wallet, no account, no payment handshake."
    : c.pricing.mode === "fixed"
      ? `${c.pricing.amount.value} ${c.pricing.amount.currency} ${c.pricing.unit ?? "per invocation"} — offers: ${(c.pricing.payment_offers ?? []).join(", ")}`
      : `Quoted per invocation — offers: ${(c.pricing.payment_offers ?? []).join(", ")}`;

  lines.push(`# ${c.promise.trim()}`);
  lines.push("");
  lines.push(`**Capability** \`${c.id}\` v${c.version} · status **${c.status}** · provider **${m.provider.name}** (\`${m.provider.id}\`)`);
  lines.push("");
  if (c.status === "draft") {
    lines.push(`> ⚠️ Draft — being authored; not yet invocable. Fields may carry placeholders.`);
    lines.push("");
  }
  if (c.description) lines.push(c.description.trim(), "");
  if (c.tags?.length) lines.push(`Tags: ${c.tags.map((t) => `\`${t}\``).join(" ")}`, "");

  if (c.excludes?.length) {
    lines.push(`## Explicitly not promised`, "");
    for (const x of c.excludes) lines.push(`- ${x}`);
    lines.push("");
  }

  lines.push(`## Price`, "", price, "");
  if (c.pricing.refund_policy) lines.push(`Refunds: ${c.pricing.refund_policy}`, "");

  lines.push(`## Contract`, "");
  lines.push(`**Input** (${(c.input.media_types ?? []).join(", ") || "see schema"}${c.input.max_bytes ? `, max ${c.input.max_bytes} bytes` : ""})`, "");
  lines.push(inlineSchema(file, c.input.schema_ref), "");
  lines.push(`**Output** (${(c.output.media_types ?? []).join(", ") || "see schema"})`, "");
  lines.push(inlineSchema(file, c.output.schema_ref), "");

  if (c.errors?.length) {
    lines.push(`## Errors`, "", `| Code | Meaning | Retriable |`, `|---|---|---|`);
    for (const e of c.errors) lines.push(`| \`${e.code}\` | ${e.meaning} | ${e.retriable ? "yes" : "no"} |`);
    lines.push("");
  }

  lines.push(`## Invocation`, "");
  for (const i of c.interfaces) {
    if (i.type === "tracert_gateway") lines.push(`- **Tracert gateway**: \`POST ${i.endpoint}\``);
    if (i.type === "native_api") lines.push(`- **Native API**: ${i.endpoint ?? i.openapi_url ?? i.docs_url}`);
    if (i.type === "mcp") lines.push(`- **MCP**: ${i.server_url ?? i.install_url}`);
    if (i.type === "a2a") lines.push(`- **A2A Agent Card**: ${i.agent_card}`);
  }
  lines.push("");

  const ops = c.operations;
  lines.push(`## Operational facts`, "");
  if (ops.expected_latency_seconds) lines.push(`- Expected latency: p50 ${ops.expected_latency_seconds.p50}s${ops.expected_latency_seconds.p95 ? `, p95 ${ops.expected_latency_seconds.p95}s` : ""}`);
  if (ops.timeout_seconds) lines.push(`- Timeout: ${ops.timeout_seconds}s — executions always reach a terminal state`);
  lines.push(`- Idempotency: ${ops.idempotency}`);
  if (ops.rate_limits) lines.push(`- Rate limits: ${ops.rate_limits}`);
  if (ops.availability_endpoint) lines.push(`- Availability: ${ops.availability_endpoint}`);
  lines.push("");

  lines.push(`## Data handling`, "");
  lines.push(`- Input retention: ${retentionText(c.data_policy.input_retention)}`);
  lines.push(`- Training use: ${trainingText(c.data_policy.training_use)}`);
  if (c.data_policy.regions?.length) lines.push(`- Regions: ${c.data_policy.regions.join(", ")}`);
  if (c.data_policy.subprocessors?.length) lines.push(`- Subprocessors: ${c.data_policy.subprocessors.join(", ")}`);
  if (c.data_policy.notes) lines.push(`- Notes: ${c.data_policy.notes.trim()}`);
  lines.push("");

  if (c.evidence && Object.keys(c.evidence).length) {
    lines.push(`## Evidence`, "");
    if (c.evidence.public_examples) lines.push(`- Public examples: ${c.evidence.public_examples}`);
    if (c.evidence.recent_executions) lines.push(`- Recent executions: ${c.evidence.recent_executions}`);
    if (c.evidence.test_vectors) lines.push(`- Test vectors: \`${c.evidence.test_vectors}\``);
    if (c.evidence.repository) lines.push(`- Repository: ${c.evidence.repository}`);
    lines.push("");
  }

  lines.push(`## Provenance`, "");
  lines.push(`- Integration: **${c.provenance.integration_status}**${c.provenance.adapter_operator ? ` · adapter operated by \`${c.provenance.adapter_operator}\`` : ""}`);
  if (c.provenance.notes) lines.push(`- ${c.provenance.notes.trim()}`);
  lines.push("");
  lines.push(`---`, "", `_Generated from \`${relative(REGISTRY_ROOT, file)}\` — do not edit by hand._`);
  return lines.join("\n") + "\n";
}

// data_policy is structured (see manifest.schema.json). Render the enums human-readably.
function retentionText(r) {
  const base = {
    none: "not retained",
    ephemeral: "held only for the request",
    fixed_window: `deleted after ${r.max_hours}h`,
    indefinite: "retained indefinitely",
    undisclosed: "undisclosed",
  }[r.policy] ?? String(r.policy);
  return r.notes ? `${base} — ${r.notes}` : base;
}

function trainingText(t) {
  return {
    none: "not used for training",
    opt_out: "used for training unless the buyer opts out",
    opt_in: "used for training only if the buyer opts in",
    yes: "may be used for training",
    undisclosed: "undisclosed",
  }[t] ?? String(t);
}
