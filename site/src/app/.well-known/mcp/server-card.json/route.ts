// MCP server card (see src/lib/discovery/server-card.ts).
import { CARD_HEADERS, serverCard } from "@/lib/discovery/server-card";

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(serverCard(), null, 2), { headers: CARD_HEADERS });
}
