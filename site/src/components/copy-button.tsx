"use client";

import { useState } from "react";

/** Copies `text` to the clipboard; the label confirms for two seconds. */
export function CopyButton({ text, label = "Copy", className = "btn" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked (permissions, insecure context): the text is on the page to select by hand.
        }
      }}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
