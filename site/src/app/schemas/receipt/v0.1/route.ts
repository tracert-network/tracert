import { registrySchema } from "@/lib/registry";

export const dynamic = "force-static";

// This URL is the schema's own $id — it must serve exactly the registry copy.
export function GET() {
  return new Response(JSON.stringify(registrySchema("receipt"), null, 2), {
    headers: {
      "Content-Type": "application/schema+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
