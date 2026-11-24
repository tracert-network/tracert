"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// One first-party ping per page view, client-side navigations included, so the
// site can tell browsers that run JavaScript from scripts that only claim to be
// browsers. No cookies, no storage, no identifiers: the server hashes what it
// already sees (src/app/api/pv/route.ts, described on /privacy). Replaces
// Google's gtag.js, which set _ga cookies.
export function PageBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    const body = JSON.stringify({ path: pathname });
    if (navigator.sendBeacon?.("/api/pv", body)) return;
    void fetch("/api/pv", { method: "POST", body, keepalive: true }).catch(() => {});
  }, [pathname]);
  return null;
}
