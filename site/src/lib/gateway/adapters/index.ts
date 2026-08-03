// Reads-only adapter map for the PUBLIC hosted gateway. Only safe, no-side-
// effect reads run here. Write capabilities in the registry (directory
// submission, url shortening) are deliberately absent — tools.ts recognises
// them and returns a clear "run the local router" rejection rather than ever
// executing a write from a public URL.
import type { AdapterOutcome } from "../types";
import type { AdapterMode } from "./errors";
import { executeLatestRates } from "./exchangerate";
import { executeDefineWord } from "./dictionary";
import { executeCreateQrCode } from "./qr";

export type Adapter = (input: Record<string, unknown>, mode: AdapterMode) => Promise<AdapterOutcome>;

export const READ_ADAPTERS = new Map<string, Adapter>([
  ["exchangerate-api.latest-rates", executeLatestRates],
  ["free-dictionary.define-word", executeDefineWord],
  ["qr-server.create-qr-code", executeCreateQrCode],
]);

export function getReadAdapter(id: string): Adapter | undefined {
  return READ_ADAPTERS.get(id);
}
