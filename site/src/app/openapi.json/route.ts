// OpenAPI 3.1 for the plain-HTTP surface (see src/lib/discovery/openapi.ts).
import { CARD_HEADERS } from "@/lib/discovery/server-card";
import { openapiDoc } from "@/lib/discovery/openapi";

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(openapiDoc(), null, 2), { headers: CARD_HEADERS });
}
