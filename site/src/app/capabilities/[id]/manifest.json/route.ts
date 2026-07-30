import { allCapabilities, getCapability } from "@/lib/registry";

export const dynamic = "force-static";

export function generateStaticParams() {
  return allCapabilities().map(({ manifest }) => ({ id: manifest.capability.id }));
}

// The canonical machine form of one capability's TRACE Manifest. Body is the
// manifest object alone (no wrapper) so verifiers can hash it directly.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cap = getCapability(id);
  if (!cap) return new Response("unknown capability", { status: 404 });
  return Response.json(cap.manifest, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      "X-Tracert-Manifest-Hash": cap.manifestHash,
    },
  });
}
