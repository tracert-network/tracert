// QR transform — fetch the image bytes and commit to their sha256. The request
// URL re-renders identical bytes, so both the artifact and the commitment are
// reproducible.
import { createHash } from "node:crypto";
import type { AdapterOutcome } from "../types";
import type { AdapterMode } from "./errors";
import { AdapterFailure } from "./errors";
import { nowIso } from "../canonical";

const ENDPOINT = "https://api.qrserver.com/v1/create-qr-code/";

function mediaTypeFor(format: string): string {
  if (format === "svg") return "image/svg+xml";
  if (format === "eps") return "application/postscript";
  return `image/${format}`;
}

export async function executeCreateQrCode(
  input: Record<string, unknown>,
  mode: AdapterMode,
): Promise<AdapterOutcome> {
  const data = String(input.data ?? "");
  const size = String(input.size ?? "200x200");
  const format = String(input.format ?? "png");
  const url = `${ENDPOINT}?data=${encodeURIComponent(data)}&size=${encodeURIComponent(size)}&format=${encodeURIComponent(format)}`;
  const declaredType = mediaTypeFor(format);

  if (mode === "simulated") {
    return {
      output: { request_url: url, media_type: declaredType, byte_length: 0, image_sha256: "sha256:" + "0".repeat(64) },
      artifacts: [{ type: "url", url, media_type: declaredType, note: "SIMULATED — bytes not fetched" }],
      evidence: [{ type: "simulated_execution", note: "image bytes were not fetched.", observed_at: nowIso() }],
    };
  }

  let res: Response;
  try {
    res = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(12_000) });
  } catch (e) {
    throw new AdapterFailure([{ code: "unavailable", message: `QR endpoint unreachable: ${String(e)}` }]);
  }
  if (!res.ok) {
    const code = res.status === 400 ? "invalid_input" : "unavailable";
    throw new AdapterFailure(
      [{ code, message: `QR endpoint returned ${res.status}` }],
      [{ type: "http_observation", url, observed_status: res.status, observed_at: nowIso() }],
    );
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  const imageSha = "sha256:" + createHash("sha256").update(bytes).digest("hex");
  const contentType = (res.headers.get("content-type") ?? declaredType).split(";")[0].trim();

  return {
    output: { request_url: url, media_type: contentType, byte_length: bytes.length, image_sha256: imageSha },
    artifacts: [
      { type: "url", url, media_type: contentType, note: "QR image — deterministic; re-GET to reproduce" },
      { type: "hash", sha256: imageSha, media_type: contentType, note: "sha256 of the QR image bytes" },
    ],
    evidence: [
      { type: "http_observation", url, observed_status: res.status, observed_at: nowIso(), hash: imageSha, note: `${bytes.length} bytes ${contentType}` },
    ],
  };
}
