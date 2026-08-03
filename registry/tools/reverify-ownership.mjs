#!/usr/bin/env node
// Periodic ownership re-verification. Re-checks that each domain-verified live
// capability's /.well-known/tracert.json still authorizes it — catching
// paste-then-yank. Run daily by .github/workflows/reverify.yml.
//
// - Wrappers (provenance unofficial / byok) are maintainer-vouched, not
//   domain-verified, so they are skipped.
// - A grace period avoids suspending over a transient blip: a capability is
//   auto-suspended (status: active -> suspended) only after FAIL_THRESHOLD
//   consecutive failing runs, and auto-restored (suspended -> active) as soon
//   as its file authorizes it again.
// - State (consecutive_failures, last_ok, last_checked, suspended) lives in
//   moderation/verification.json. Exit 0 always — a lapsed supplier file is a
//   moderation event, not a build failure.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { relative } from "node:path";
import { REGISTRY_ROOT, findManifestFiles, loadManifest } from "./lib.mjs";

const FAIL_THRESHOLD = Number(process.env.REVERIFY_FAIL_THRESHOLD ?? 3);
const STATE_PATH = `${REGISTRY_ROOT}/moderation/verification.json`;
const now = new Date().toISOString();

const stateDoc = existsSync(STATE_PATH)
  ? JSON.parse(readFileSync(STATE_PATH, "utf8"))
  : { $comment: "Ownership re-verification state.", capabilities: {} };
stateDoc.capabilities ??= {};
const caps = stateDoc.capabilities;

const suspended = [];
const restored = [];
const failing = [];
let changed = false;

for (const file of findManifestFiles()) {
  const m = loadManifest(file);
  const c = m.capability;
  const prov = c.provenance?.integration_status;
  if (prov === "unofficial" || prov === "byok") continue; // maintainer-vouched; no ownership file expected

  const st = (caps[c.id] ??= { consecutive_failures: 0, last_ok: null, last_checked: null, suspended: false });
  const before = JSON.stringify(st);
  st.last_checked = now;

  const res = await verifyOwnership(m.provider?.url, m.provider?.id, c.id);
  if (res.ok) {
    st.consecutive_failures = 0;
    st.last_ok = now;
    delete st.last_error;
    if (st.suspended) {
      if (setStatus(file, "suspended", "active")) { st.suspended = false; restored.push(c.id); }
    }
  } else {
    st.consecutive_failures += 1;
    st.last_error = res.message;
    failing.push(`${c.id} (${st.consecutive_failures}/${FAIL_THRESHOLD}): ${res.message}`);
    if (st.consecutive_failures >= FAIL_THRESHOLD && c.status === "active" && !st.suspended) {
      if (setStatus(file, "active", "suspended")) { st.suspended = true; suspended.push(c.id); }
    }
  }
  if (JSON.stringify(st) !== before) changed = true;
}

if (changed) writeFileSync(STATE_PATH, JSON.stringify(stateDoc, null, 2) + "\n");

console.log(
  `reverify: ${failing.length} failing, ${suspended.length} newly suspended, ${restored.length} restored.`,
);
for (const line of failing) console.log(`  FAIL ${line}`);
if (suspended.length) console.log(`  SUSPENDED: ${suspended.join(", ")}`);
if (restored.length) console.log(`  RESTORED: ${restored.join(", ")}`);
process.exit(0);

// Flip a single `status:` line in place (preserves comments/formatting).
function setStatus(file, from, to) {
  const src = readFileSync(file, "utf8");
  const re = new RegExp(`^(\\s*status:\\s*)${from}\\s*$`, "m");
  if (!re.test(src)) {
    console.log(`  (could not flip status ${from}->${to} in ${relative(REGISTRY_ROOT, file)})`);
    return false;
  }
  writeFileSync(file, src.replace(re, `$1${to}`));
  return true;
}

async function verifyOwnership(providerUrl, providerId, capabilityId) {
  if (!providerUrl) return { ok: false, message: "no provider.url" };
  let host;
  try {
    const u = new URL(providerUrl);
    if (u.protocol !== "https:") throw new Error();
    host = u.hostname;
  } catch {
    return { ok: false, message: "invalid provider.url" };
  }
  try {
    const res = await fetch(`https://${host}/.well-known/tracert.json`, {
      redirect: "error",
      headers: { Accept: "application/json", "User-Agent": "tracert-reverify" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { ok: false, message: `HTTP ${res.status}` };
    const doc = JSON.parse((await res.text()).slice(0, 65_536));
    if (String(doc.provider).toLowerCase() !== String(providerId).toLowerCase()) {
      return { ok: false, message: "provider mismatch" };
    }
    const list = Array.isArray(doc.capabilities) ? doc.capabilities.map(String) : [];
    if (!list.includes(capabilityId)) return { ok: false, message: "capability no longer authorized" };
    return { ok: true };
  } catch {
    return { ok: false, message: "file unreachable" };
  }
}
