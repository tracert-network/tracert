// Quote issuance. Free capabilities get an exact zero quote so every receipt
// binds to explicit terms. In-memory within a serverless instance's lifetime.
import type { LoadedCapability, Quote } from "./types";
import { newId } from "./canonical";

const QUOTE_TTL_MS = 15 * 60 * 1000;
const quotes = new Map<string, Quote>();

export function issueQuote(cap: LoadedCapability): Quote {
  const c = cap.capability;
  if (!c.pricing.free) {
    throw new Error("paid quoting not implemented — Phase 3 payment adapter");
  }
  const quote: Quote = {
    id: newId("tr_quote"),
    capability_id: c.id,
    amount: "0",
    currency: "USD",
    expires_at: new Date(Date.now() + QUOTE_TTL_MS).toISOString(),
    payment_offers: [],
    note: "Free capability — no payment handshake; the quote exists so the receipt binds to explicit terms.",
  };
  quotes.set(quote.id, quote);
  return quote;
}

export function getQuoteById(id: string): Quote | undefined {
  return quotes.get(id);
}

export function quoteIsCurrent(q: Quote): boolean {
  return Date.parse(q.expires_at) > Date.now();
}
