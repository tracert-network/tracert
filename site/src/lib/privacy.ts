// Facts the privacy page (/privacy) states that only the operator can supply.
// scripts/privacy.test.mjs fails while any of them is still a placeholder, so
// the page cannot ship half-filled.
export const PRIVACY = {
  /** The person or company responsible for tracert.site (the data controller). */
  controller: "TODO: name of the person or company that runs tracert.site",
  /** Where people send privacy requests. Not a public issue tracker. */
  contact: "TODO: privacy contact email",
  /** Google Analytics event-data retention (GA Admin → Data settings → Data retention), e.g. "2 months". */
  analyticsRetention: "TODO: GA event-data retention period",
  /** Date of the last change to what the page says (YYYY-MM-DD). */
  updated: "2026-11-24",
} as const;

export const PLACEHOLDER = /^TODO\b/;
