import { after } from "next/server";
import { beaconPath, callerFromHeaders, sendServerEvents } from "@/lib/analytics";

// First-party page-view ping from app/page-beacon.tsx. The event goes through
// the same server-side analytics as every other request (hashed daily ID, no
// IP address sent), so browsers get no cookies and run no third-party script.
// The proxy skips this path so a ping isn't also counted as a request.
export async function POST(request: Request) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return new Response(null, { status: 204 });
  const path = beaconPath((await request.text()).slice(0, 500));
  if (path) {
    const caller = callerFromHeaders(request.headers);
    const send = () => sendServerEvents(caller, [{ name: "js_page_view", params: { endpoint_type: "page", path } }]);
    try {
      after(send);
    } catch {
      void send();
    }
  }
  return new Response(null, { status: 204 });
}
