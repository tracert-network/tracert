// The privacy page (/privacy) states facts only the operator can supply, kept in
// src/lib/privacy.ts. This fails while any is still a placeholder, so the page
// can't ship half-filled. Run: npm test.
import assert from "node:assert/strict";
import { test } from "node:test";
import { PLACEHOLDER, PRIVACY } from "../src/lib/privacy.ts";

test("privacy page facts are filled in", () => {
  for (const [field, value] of Object.entries(PRIVACY)) {
    assert.doesNotMatch(value, PLACEHOLDER, `src/lib/privacy.ts: ${field} is still a placeholder`);
    assert.ok(value.trim().length > 0, `${field} is empty`);
  }
});

test("privacy contact is an email address, not a public tracker", () => {
  assert.match(PRIVACY.contact, /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i);
});

test("updated is a real date", () => {
  assert.match(PRIVACY.updated, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!Number.isNaN(Date.parse(PRIVACY.updated)));
});
