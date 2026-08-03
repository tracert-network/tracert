// Abuse gates for the submission API: domain-ownership proof, rate limiting and
// a denylist. The submission API is the ONLY path that reaches auto-merge (it
// alone creates same-repo submit/* branches; fork PRs never get the merge
// secret), so gating here gates auto-merge.
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const WELL_KNOWN = "/.well-known/tracert.json";
const REPO = () => process.env.TRACERT_SUBMIT_REPO || "tracert-network/tracert";
const BASE = () => process.env.TRACERT_SUBMIT_BASE || "main";

export interface GateResult {
  ok: boolean;
  code?: string;
  message?: string;
  detail?: Record<string, unknown>;
}

// ---- Ownership: prove control of the provider domain by hosting a file ----

export async function verifyOwnership(
  providerUrl: string | undefined,
  providerId: string,
  capabilityId: string,
): Promise<GateResult> {
  if (!providerUrl) {
    return { ok: false, code: "ownership_required", message: "provider.url is required so we can verify you control the domain." };
  }
  let host: string;
  try {
    const u = new URL(providerUrl);
    if (u.protocol !== "https:") throw new Error("not https");
    host = u.hostname;
  } catch {
    return { ok: false, code: "ownership_required", message: "provider.url must be a valid https URL." };
  }

  const wellKnownUrl = `https://${host}${WELL_KNOWN}`;
  const instructions =
    `Host a file at ${wellKnownUrl} containing ` +
    `{"provider":"${providerId}","capabilities":["${capabilityId}"]} to prove you control ${host}, then resubmit.`;

  const safe = await safeFetchJson(wellKnownUrl);
  if (!safe.ok) {
    return { ok: false, code: "ownership_required", message: `Could not verify domain ownership: ${safe.message}. ${instructions}`, detail: { well_known: wellKnownUrl } };
  }
  const doc = safe.json as { provider?: unknown; capabilities?: unknown };
  if (typeof doc?.provider !== "string" || doc.provider.toLowerCase() !== providerId.toLowerCase()) {
    return { ok: false, code: "ownership_mismatch", message: `${wellKnownUrl} does not declare provider "${providerId}". ${instructions}`, detail: { well_known: wellKnownUrl } };
  }
  const caps = Array.isArray(doc.capabilities) ? doc.capabilities.map(String) : [];
  if (!caps.includes(capabilityId)) {
    return { ok: false, code: "ownership_mismatch", message: `${wellKnownUrl} does not authorize capability "${capabilityId}". Add it to the "capabilities" array and resubmit.`, detail: { well_known: wellKnownUrl } };
  }
  return { ok: true, detail: { verified_domain: host } };
}

// GET a JSON document with SSRF protections: https only, no redirects, resolve
// the host and refuse private/reserved IPs, cap time and size.
async function safeFetchJson(url: string): Promise<{ ok: true; json: unknown } | { ok: false; message: string }> {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return { ok: false, message: "invalid URL" };
  }
  try {
    const addrs = await lookup(host, { all: true });
    if (addrs.length === 0) return { ok: false, message: "domain does not resolve" };
    for (const a of addrs) {
      if (isPrivateAddress(a.address)) return { ok: false, message: "domain resolves to a private or reserved address" };
    }
  } catch {
    return { ok: false, message: "domain does not resolve" };
  }
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "error",
      headers: { Accept: "application/json", "User-Agent": "tracert-ownership-check" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return { ok: false, message: "the file could not be fetched (not found, timeout, or a redirect)" };
  }
  if (!res.ok) return { ok: false, message: `the file returned HTTP ${res.status}` };
  const text = (await res.text()).slice(0, 64 * 1024);
  try {
    return { ok: true, json: JSON.parse(text) };
  } catch {
    return { ok: false, message: "the file is not valid JSON" };
  }
}

function isPrivateAddress(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const p = ip.split(".").map(Number);
    if (p[0] === 10) return true;
    if (p[0] === 127) return true;
    if (p[0] === 0) return true;
    if (p[0] === 169 && p[1] === 254) return true;
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
    if (p[0] === 192 && p[1] === 168) return true;
    if (p[0] === 192 && p[1] === 0 && p[2] === 0) return true;
    if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true; // CGNAT
    if (p[0] === 198 && (p[1] === 18 || p[1] === 19)) return true;
    if (p[0] >= 224) return true; // multicast + reserved
    return false;
  }
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return true;
  if (lower.startsWith("fe80") || lower.startsWith("fc") || lower.startsWith("fd")) return true; // link-local + ULA
  const m = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(lower); // v4-mapped
  if (m) return isPrivateAddress(m[1]);
  return false;
}

// ---- Rate limiting: count recent submission PRs (no external store) ----

export async function checkRateLimit(token: string, providerId: string): Promise<GateResult> {
  const globalPerHour = Number(process.env.TRACERT_SUBMIT_RATE_GLOBAL_PER_HOUR ?? 30);
  const providerPerDay = Number(process.env.TRACERT_SUBMIT_RATE_PROVIDER_PER_DAY ?? 10);
  let prs: { headRefName: string; created: number }[];
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO()}/pulls?state=all&per_page=100&sort=created&direction=desc`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "tracert-submit" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return { ok: true }; // fail open — ownership is the primary gate
    const raw = (await res.json()) as { head?: { ref?: string }; created_at?: string }[];
    prs = raw.map((p) => ({ headRefName: p.head?.ref ?? "", created: Date.parse(p.created_at ?? "") || 0 }));
  } catch {
    return { ok: true };
  }
  const now = Date.now();
  const submits = prs.filter((p) => p.headRefName.startsWith("submit/"));
  const globalRecent = submits.filter((p) => now - p.created < 3_600_000).length;
  if (globalRecent >= globalPerHour) {
    return { ok: false, code: "rate_limited", message: `Too many submissions in the last hour (limit ${globalPerHour}). Try again later.` };
  }
  const provRecent = submits.filter((p) => p.headRefName.startsWith(`submit/${providerId}-`) && now - p.created < 86_400_000).length;
  if (provRecent >= providerPerDay) {
    return { ok: false, code: "rate_limited", message: `Provider "${providerId}" has reached the daily submission limit (${providerPerDay}).` };
  }
  return { ok: true };
}

// ---- Denylist: early rejection (CI's validator is the authoritative gate) ----

export async function checkDenylist(providerId: string, hosts: string[], capabilityId: string): Promise<GateResult> {
  let dl: { providers?: string[]; domains?: string[]; capabilities?: string[] };
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${REPO()}/${BASE()}/registry/moderation/denylist.json`, {
      headers: { "User-Agent": "tracert-submit" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { ok: true }; // CI enforces the denylist regardless
    dl = (await res.json()) as typeof dl;
  } catch {
    return { ok: true };
  }
  const lc = (a?: string[]) => new Set((a ?? []).map((s) => s.toLowerCase()));
  if (lc(dl.providers).has(providerId.toLowerCase())) return blocked(`provider "${providerId}"`);
  if (lc(dl.capabilities).has(capabilityId.toLowerCase())) return blocked(`capability "${capabilityId}"`);
  const denyDomains = (dl.domains ?? []).map((s) => s.toLowerCase());
  for (const host of hosts.map((h) => h.toLowerCase())) {
    for (const d of denyDomains) {
      if (host === d || host.endsWith("." + d)) return blocked(`domain "${host}"`);
    }
  }
  return { ok: true };
}

function blocked(what: string): GateResult {
  return { ok: false, code: "denylisted", message: `This submission is blocked: ${what} is on the moderation denylist.` };
}

// Collect https hosts referenced by a manifest (for denylist domain matching).
export function manifestHosts(manifest: Record<string, unknown>): string[] {
  const hosts = new Set<string>();
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      const m = /^https:\/\/([^/:]+)/i.exec(v);
      if (m) hosts.add(m[1].toLowerCase());
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(manifest);
  return [...hosts];
}
