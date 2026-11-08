---
slug: vscode-extension-publishing
intent: Publish a VS Code extension for the first time so it installs in VS Code (Visual Studio Marketplace) and in VS Code forks that read Open VSX (Cursor, Windsurf/Devin Desktop, VSCodium, Gitpod/Ona).
summary: "Publish twice: VS Marketplace via vsce (PAT or GitHub OIDC) for VS Code; Open VSX via ovsx for Cursor, Windsurf/Devin, VSCodium, Gitpod. Global Azure PATs stop working 27 Jan 2027."
task_type: how-to
region: global
tags: vs code extension, publish extension, vsce, ovsx, open vsx, visual studio marketplace, cursor extensions, windsurf extensions, vscodium, gitpod, personal access token, trusted publishing, oidc, verified publisher, namespace claim, pre-release, vsix
hosts: code.visualstudio.com, devblogs.microsoft.com, developer.microsoft.com, aka.ms, cdn.vsassets.io, github.com, cursor.com, docs.windsurf.com, docs.devin.ai, ona.com, blogs.eclipse.org
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 35
---

# How to publish a VS Code extension to the Visual Studio Marketplace and Open VSX (so it installs in VS Code, Cursor, Windsurf, VSCodium and Gitpod)

## TL;DR — fastest path
- **Two registries, two publishes.** VS Code (and GitHub Codespaces) install from the Microsoft Visual Studio Marketplace. Cursor, Windsurf (now documented as "Devin Desktop"), VSCodium and Gitpod/Ona all read from Open VSX or a mirror of it. Publishing only to Microsoft leaves fork users without your extension. Build one `.vsix` with `vsce package`, then publish that same file to both registries.
- **Use the same ID on both registries.** Keep the `publisher` + `name` the same on both. Cursor's verification badge requires the same extension ID across marketplaces. Create your Open VSX namespace early: on Open VSX anyone can create an unclaimed namespace.
- **Marketplace auth is changing.** The classic route is an Azure DevOps PAT with scope Marketplace > Manage and organization "All accessible organizations", which makes it a *global* PAT. Microsoft's DevOps blog (updated 23 Oct 2026) says global PATs stop working on **27 Jan 2027**. The VS Code docs still say 1 Dec 2026. For anything long-lived, use GitHub Actions Trusted Publishing: `npx @vscode/vsce publish --oidc`.
- **Open VSX setup order:** Eclipse account (with the GitHub Username field filled in), then GitHub sign-in on open-vsx.org, then link the Eclipse account and sign the Publisher Agreement, then an access token, then `npx ovsx create-namespace <publisher>`, then `npx ovsx publish <file>.vsix`. Claiming verified namespace ownership is a separate public GitHub issue.
- **Both registries now scan before an extension goes live.** vsce blocks `.env` files and detected secrets at package time. Open VSX runs pre-publish secret, malware-pattern and name-similarity checks and quarantines anything suspicious. Neither registry publishes a review-time figure.
- **A human has to do:** Microsoft and Eclipse sign-ins, PAT and token creation, accepting both publisher agreements, the DNS TXT record for a verified publisher, and the public namespace-claim issue.

## Verify first
1. **Global PAT retirement date** — fetch devblogs.microsoft.com/devops/retirement-of-global-personal-access-tokens-in-azure-devops/ — expect the decommission date to be 27 Jan 2027 and global PAT creation not blocked — if not, re-explore *code.visualstudio.com* (auth options).
2. **Marketplace Trusted Publishing still GitHub-only** — fetch code.visualstudio.com/api/working-with-extensions/publishing-extension — expect a "Trusted Publishing" section with `vsce publish --oidc`, `id-token: write`, a 15-minute credential and the 48-hour private-repo rule — if not, re-explore *code.visualstudio.com*.
3. **Cursor still on Open VSX** — fetch cursor.com/docs/configuration/extensions — expect "Cursor uses the Open VSX extension registry for third-party extensions" — if not, re-explore *cursor.com* and the fork matrix.
4. **Open VSX publish steps unchanged** — fetch github.com/eclipse/openvsx/wiki/Publishing-Extensions — expect: Eclipse account, Publisher Agreement, access token, `ovsx create-namespace`, and a scanning section — if not, re-explore *Open VSX*.
5. **Marketplace ToU scope** — aka.ms/vsmarketplace-ToU redirects to a PDF that WebFetch returns as binary, so read the saved file with a PDF reader — expect "Last Updated September 2025" and clause 2b's "In-Scope Products and Services" list — if not, re-read the ToU.

## Domains

### code.visualstudio.com — the authoritative Marketplace publishing guide (vsce)
- **Access** (2026-11-07, observed): public page, fetched without a block.
- **Tooling** (2026-11-07, observed): install with `npm install -g @vscode/vsce` (requires Node.js). Main commands:
  - `vsce package` builds a `.vsix`.
  - `vsce publish` publishes, and prompts for a PAT if you have not run `vsce login`.
  - `vsce publish minor|major|patch|<semver>` bumps the version in package.json. In a git repo it also makes a commit and tag (`-m` sets the message).
  - `vsce publish --target <platform>` and `vsce package --target <platform>` build platform-specific packages (vsce >= 1.99.0; VS Code >= 1.61.0). Valid targets: win32-x64, win32-arm64, linux-x64, linux-arm64, linux-armhf, alpine-x64, alpine-arm64, darwin-x64, darwin-arm64, web.
- **Publisher creation** (2026-11-07, observed):
  - Go to marketplace.visualstudio.com/manage and sign in with the same Microsoft account that created the PAT.
  - Choose **Create publisher** and enter an ID and a Name. Both must be unique. The ID "cannot be changed once created".
  - Confirm with `vsce login <publisher id>`.
  - You need an Azure DevOps organization to create a PAT.
- **PAT** (2026-11-07, observed; the page now labels this method "Not Recommended"): create it in Azure DevOps under User settings > Personal access tokens > New Token.
  - Organization: **All accessible organizations**.
  - Scopes: Custom defined > Show all scopes > **Marketplace > Manage**.
  - Expiry: optional.
  - A 401 or 403 on publish usually means the scope is not "Marketplace (Manage)" or a single organization was picked instead of "All accessible organizations".
  - The page says global PATs are retired on 1 Dec 2026. The DevOps blog has since moved the date (see the devblogs.microsoft.com entry).
- **Trusted Publishing, GitHub Actions** (2026-11-07, observed):
  - Setup: on the publisher management page, open the publisher, choose Trusted Publishing and create a policy. The policy needs a name, the repo owner, the repo name, the workflow filename and an optional environment.
  - The workflow job needs `id-token: write` and `contents: read`, then runs `npx @vscode/vsce publish --oidc`.
  - "The Marketplace credential expires after 15 minutes." Each GitHub OIDC token can be exchanged only once.
  - For a private repo, "run the configured workflow within 48 hours after creating the policy."
  - Other CI providers are not supported for Trusted Publishing.
- **Azure Pipelines alternative** (2026-11-07, observed): use a Workload Identity Federation service connection and a user-assigned managed identity with the Reader role, then add that identity to the publisher as Contributor. Publish with `vsce publish --azure-credential` (vsce >= 2.26.1).
- **Required package.json and listing rules** (2026-11-07, observed):
  - `publisher` is required.
  - `name` must be unique on the Marketplace, and so must the display name.
  - `engines.vscode` is required.
  - `icon` must be a PNG of "at least 128x128px". SVG icons are not allowed.
  - `repository`: if it points to a public GitHub repo, vsce rewrites relative links, defaulting to the `main` branch.
  - `keywords`: 30 maximum. Exceeding it gives the error "You exceeded the number of allowed tags of 30".
  - `pricing` is `Free` or `Trial` (case-sensitive) and defaults to Free.
  - `sponsor` needs vsce >= 2.9.1.
  - vsce "will not publish extensions that contain user-provided SVG images". README and CHANGELOG images must resolve to HTTPS, and SVG badges are allowed only from trusted badge providers.
  - `.vscodeignore` uses globs. `devDependencies` are excluded automatically.
- **Pre-release** (2026-11-07, observed): `vsce package --pre-release` / `vsce publish --pre-release`.
  - Only `major.minor.patch` versions work. "semver pre-release tags are **not supported**."
  - A pre-release and a release must not share a version number. The suggested convention is even minor numbers for releases and odd minor numbers for pre-releases.
  - Requires `engines.vscode` >= 1.63.0.
- **Verified publisher** (2026-11-07, observed):
  - Eligibility: at least one extension on the Marketplace for a minimum of 6 months, and a domain registered at least 6 months ago.
  - The domain must not be a subdomain, must allow DNS TXT changes, must serve HTTPS, and must return 200 to a HEAD request.
  - Steps: Details tab > Verified domain > Save > Verify, add the TXT record, then Verify again.
  - The Marketplace team responds "within 5 business days".
  - Renaming the publisher display name revokes the badge.
- **Gotchas** (2026-11-07, observed):
  - Removing an extension is irreversible and permanently reserves its name.
  - Deleted version numbers cannot be reused, and the latest version cannot be deleted.
  - Packages built on Windows lose POSIX executable bits.
  - Use npm or yarn v1 for dependencies.
  - The page states no size limit and no publish or scan time.

### devblogs.microsoft.com — global PAT retirement (affects Marketplace PATs)
- **Access** (2026-11-07, observed): public page, published 12 Dec 2025.
- **Rules** (2026-11-07, observed):
  - A 5 Mar update says global PAT creation will **not** be blocked on 15 Mar.
  - A 23 Oct update postpones decommissioning from 1 Dec 2026 to **27 Jan 2027**. "Tokens will stop working after this date."
  - Azure DevOps Server (on-prem) is unaffected.
  - The recommended replacement is short-lived Microsoft Entra-backed auth.
- **Gotchas** (2026-11-07, observed): the post does not mention the Visual Studio Marketplace or vsce. An agent should therefore treat the "All accessible organizations" Marketplace PAT as at risk after 27 Jan 2027 and prefer `--oidc` or `--azure-credential`. That conclusion is an inference, not something the post states.

### github.com/microsoft/vscode-vsce — vsce releases and README
- **Access** (2026-11-07, observed): public.
- **Facts** (2026-11-07, observed):
  - Latest release is v4.1.0, dated 28 Oct (the page shows no year), with pre-release v4.1.1-0 dated 30 Oct.
  - v4.0.0 (14 Sep) added "auth: support OIDC trusted publishing" and "Raise Node.js baseline to 22". The README says Node.js "at least `22.x.x`".
  - The `VSCE_PAT` env var avoids the OS credential store. On Linux, vsce uses `@napi-rs/keyring` with a kernel-keyring fallback.
- **Secret scanning** (first-party claim via search snippet of vsce 3.7.1 CLI source on unpkg, 2026-11-07): `vsce package` has the overrides `--allow-package-env-file` ("Allow packaging .env files"), `--allow-package-secrets <names>` (secret names come from the error message) and `--allow-package-all-secrets`. The README has no section on this; the flags appear only in CLI help and source.

### developer.microsoft.com — Marketplace security pipeline (blog, 11 Jun 2025)
- **Access** (2026-11-07, observed): public.
- **Rules** (first-party claim, 2026-11-07):
  - Every package gets an antivirus scan. If malware is found, the package "gets blocked right away".
  - Packages are rescanned "shortly after it's published", and each VS Code package also runs in a dynamic sandbox.
  - Names that impersonate popular publishers are auto-blocked.
  - Secret scanning and `.env` blocking had "recently released in the vsce tool" as of that post.
  - The post gives no time to availability.

### aka.ms/vsmarketplace-ToU then cdn.vsassets.io — Marketplace Terms of Use (PDF)
- **Access** (2026-11-07, observed): the aka.ms link 301-redirects to a PDF, version path M264_20251020.18. WebFetch returns compressed binary, so the PDF has to be read with a PDF reader. The document header says "Last Updated September 2025".
- **Rules** (2026-11-07, observed):
  - "In-Scope Products and Services" means Visual Studio, Visual Studio Code, GitHub Codespaces, Azure DevOps, Azure DevOps Server and successors.
  - Clause 2b: "Marketplace Offerings are intended for use only with In-Scope Products and Services and you may not install, reverse-engineer, import or use Marketplace Offerings in products and services except for the In-Scope Products and Services."
  - Clause 3 separately bars using Microsoft- or GitHub-published offerings outside in-scope products.
  - Practical effect for publishers: forks cannot legitimately serve your extension from the Microsoft Marketplace, so publish it to Open VSX yourself.

### github.com/eclipse/openvsx (wiki + cli README) — authoritative Open VSX publishing guide
- **Access** (2026-11-07, observed): public wiki pages.
- **How** (2026-11-07, observed):
  1. Create an Eclipse account and fill in the **GitHub Username** field with exactly the GitHub account you will use on open-vsx.org.
  2. Sign in to open-vsx.org with GitHub, then go to avatar > Settings > "Log in with Eclipse".
  3. Choose "Show Publisher Agreement" and click Agree. This is not the Eclipse Contributor Agreement.
  4. Go to Settings > Access Tokens > Generate New Token. The token is shown once, has no expiry and works "until it is deleted". Use one token per environment.
  5. Run `npx ovsx create-namespace <publisher> -p <token>`. The namespace equals package.json `publisher`.
  6. Run `npx ovsx publish <file>.vsix -p <token>`, or `npx ovsx publish -p <token>` from source after `npm install`. Add `--yarn` if you use yarn. ovsx packages with vsce and runs `vscode:prepublish`.
- **CLI details** (2026-11-07, observed, cli/README):
  - Install with `npm install --global ovsx` or use `npx`.
  - The token comes from `--pat`/`-p` or `OVSX_PAT`.
  - `--packagePath <dir>` packages a different directory.
  - `ovsx unpublish` is irreversible and the version number stays reserved.
  - Tokens are stored in the OS credential manager, with a plaintext `~/.ovsx` fallback (discouraged).
  - The default timeout is 30 seconds (`OVSX_TIMEOUT`).
  - The README does not document `--pre-release`. Whether ovsx forwards the pre-release flag was **not verified** today.
- **Trusted publishing** (2026-11-07, observed, cli/README):
  - A namespace owner registers a trusted publisher in registry settings.
  - The workflow needs `id-token: write` and runs `npx ovsx publish --trusted-publishing`.
  - For private repos on first publish, pass `--registrationCode` / `OVSX_REGISTRATION_CODE`.
  - Tokens last a few minutes.
- **Trusted-publishing gotchas** (third-party, search snippets of GitHub PRs, 2026-11-07): a trusted publisher can reportedly only be registered for an extension that already has a version, so do the first publish with a token. Matching is reported to compare only the `workflow_ref` claim, so a reusable workflow called from another file is refused.
- **Namespaces** (2026-11-07, observed, wiki "Namespace-Access"):
  - Creating a namespace makes you a contributor, not an owner, so your extensions show as **unverified**, with a warning icon and banner.
  - To claim ownership, sign in to open-vsx.org and open a public issue in GitHub repo EclipseFdn/open-vsx.org. A `claim-namespace-ownership.yml` template exists there (observed in the directory listing; contents not read). Anyone can dispute a claim on the issue.
  - Owners manage members, and contributors can only publish. Bots should be contributors.
  - The wiki states neither the proof required for a claim nor a turnaround time.
- **Scanning** (2026-11-07, observed, wiki):
  - Secret detection can reject a publish. Suppress false positives inline with `// secret-detector:ignore`.
  - A hash blocklist checks against known-bad files.
  - Namespace-similarity checks guard against typosquatting.
- **Gotchas** (2026-11-07, observed): the wiki's linked GitHub issue template asks a third party to publish an extension; it is **not** the ownership-claim route.

### blogs.eclipse.org — Open VSX pre-publish checks ("Strengthening supply-chain security in Open VSX", 28 Jan 2026)
- **Access** (2026-11-07, observed): public.
- **Rules** (first-party claim, 2026-11-07):
  - Planned checks cover namespace or name impersonation, accidentally published secrets, and "known malicious patterns".
  - Suspicious uploads are quarantined "for review instead of publishing them immediately", with human review for edge cases.
  - Monitoring was to start in February and enforcement "in March". The year is implied to be 2026.
  - No quarantine or review duration is given.
- **Related** (third-party, search snippets, Oct 2026): security researchers reported a fail-open bug in Open VSX's new scanner. The same reports describe new extensions being held inactive until all scanners approve them. Expect a short, undocumented delay before a new version is visible.

### cursor.com — Cursor reads Open VSX through its own proxy
- **Access** (2026-11-07, observed): public docs page.
- **Rules** (2026-11-07, observed):
  - "Cursor uses the Open VSX extension registry for third-party extensions", served through Cursor's proxy.
  - Cursor runs malware and supply-chain analysis "Before an extension is shown in search or served as a download". Extensions that fail are blocked.
  - Admins can set a "Marketplace Install Cooldown (hours)", default 0, and can restrict installs to allowlisted publishers.
  - Some Microsoft-only extensions are replaced by Anysphere builds. The same ID can point to different code on each marketplace.
- **Verification badge** (2026-11-07, observed):
  1. Link your Open VSX listing from a website on your own domain (a GitHub README does not count).
  2. Set the Open VSX "homepage" to that website.
  3. Use the same extension ID as on other marketplaces.
  4. Post in the Cursor forum's Extension Verification category.
- **Gotchas** (third-party, Cursor forum titles via search, 2026-11-07): users report newly published Open VSX extensions that do not install yet, and stale versions served by Cursor's mirror.

### docs.windsurf.com then docs.devin.ai — Windsurf is now documented as "Devin Desktop"
- **Access** (2026-11-07, observed): docs.windsurf.com/windsurf/advanced 307-redirects to docs.devin.ai/desktop/advanced.
- **Rules** (2026-11-07, observed):
  - "By default, Devin Desktop downloads extensions from an Open VSX mirror."
  - `devin.marketplaceExtensionGalleryServiceURL` defaults to `https://marketplace.windsurf.com/vscode/gallery`, and `devin.marketplaceGalleryItemURL` defaults to `https://marketplace.windsurf.com/vscode/item`.
  - Publish to Open VSX and it should reach Windsurf through that mirror. The mirror's sync latency is not documented.

### github.com/VSCodium/vscodium (docs/extensions.md) — VSCodium defaults to open-vsx.org
- **Access** (2026-11-07, observed): public. docs/index.md is only a table of contents.
- **Rules** (2026-11-07, observed):
  - `product.json` points to open-vsx.org by default.
  - The page cites the Marketplace terms: "Marketplace Offerings are intended for use only with Visual Studio Products and Services". That is older ToU wording; the current ToU says "In-Scope Products and Services".
  - Users can switch registries with `VSCODE_GALLERY_SERVICE_URL`, `VSCODE_GALLERY_ITEM_URL` and `VSCODE_GALLERY_EXTENSION_URL_TEMPLATE`, or with a custom `product.json`.
  - Authors either publish to Open VSX themselves or open a PR to `open-vsx/publish-extensions` so the @open-vsx bot republishes the extension. The bot's copies are removed once you claim the namespace.

### ona.com (formerly Gitpod) — VS Code Browser uses an Open VSX mirror
- **Access** (2026-11-07, observed): public, under the `/docs/classic/` path.
- **Rules** (2026-11-07, observed):
  - Ona runs "a self-hosted mirror of the public Open VSX instance".
  - "Any extensions published to Open VSX are immediately reflected in the Gitpod OpenVSX mirror."
  - "VS Code Browser is prohibited from accessing the Microsoft VS Code Extensions marketplace". Users who need Microsoft-marketplace extensions must use VS Code Desktop.

### Other forks (third-party, 2026-11-07)
- Google Antigravity and Trae are reported to use Open VSX (security-press coverage from January 2026 of a recommended-extension namespace-squatting issue on Open VSX).
- Kiro's registry was **not confirmed** this run.

## Dead ends
- WebSearch for `"--allow-package-secrets" vsce` returned only unrelated secret-scanner projects. The search for `"allow-package-env-file" vsce` found the flags (2026-11-07).
- The vsce README has no secret-scanning section. The flags are only in CLI source and help (2026-11-07).
- VSCodium `docs/index.md` is a table of contents only; go straight to `docs/extensions.md` (2026-11-07).
- An older guessed ToU PDF URL (version path M190_20210811) is stale. Use aka.ms/vsmarketplace-ToU instead, which currently resolves to version path M264_20251020.18 (2026-11-07).
- WebFetch cannot read the ToU PDF (FlateDecode binary). Read the saved file with a PDF reader instead (2026-11-07).
- The GitHub issue template linked from the Open VSX publishing wiki asks a third party to publish an extension; it is not the namespace claim (2026-11-07).
- No official source states how long a new Marketplace version stays in "verifying" or how long an Open VSX quarantine lasts. Searches returned only security-incident coverage (2026-11-07).

## Blockers
- github.com/EclipseFdn/open-vsx.org/issues/new/choose redirects to the GitHub sign-in wall, so the template chooser could not be viewed. The repo's `.github/ISSUE_TEMPLATE` directory listing is public (2026-11-07).
- marketplace.visualstudio.com/manage and open-vsx.org account pages are sign-in gated. They were not attempted (2026-11-07).

## Prep checklist
- package.json fields:
  - `name`: unique.
  - `displayName`: unique on the Marketplace.
  - `version`: `major.minor.patch`.
  - `publisher`: the same string as the Marketplace publisher ID and the Open VSX namespace.
  - `engines.vscode`: >= 1.63.0 if you will ship pre-releases.
  - `icon`: PNG, at least 128x128.
  - `repository`: a public GitHub URL makes vsce rewrite relative README links.
  - `keywords`: 30 or fewer.
  - Also set `categories`, a `homepage` on your own domain (needed for the Cursor badge) and `license`.
- README and CHANGELOG: HTTPS image URLs only, no SVGs except trusted badges.
- `.vscodeignore`: exclude sources, tests and any `.env`. vsce refuses `.env` and detected secrets unless overridden.
- Node.js 22+ for vsce 4.x.
- Decide auth:
  - **Marketplace**: GitHub Actions OIDC (`vsce publish --oidc`) is preferred. A PAT works until 27 Jan 2027 (DevOps blog).
  - **Open VSX**: token for the first publish, then trusted publishing (`ovsx publish --trusted-publishing`).
- Version discipline: the same version on both registries. Never reuse a deleted version number, and keep pre-release and release numbers distinct.
- Platform-specific builds: add `--target`, plus one untargeted fallback package.

## Needs a human
- Microsoft account sign-in, Azure DevOps organization creation, PAT creation (Marketplace > Manage, All accessible organizations), and creating the Marketplace publisher at marketplace.visualstudio.com/manage. The publisher ID is permanent.
- Eclipse Foundation account registration (with the GitHub Username field), GitHub OAuth on open-vsx.org, and accepting the Open VSX Publisher Agreement and the Microsoft Marketplace Publisher Agreement.
- Storing `VSCE_PAT` / `OVSX_PAT` as CI secrets, or creating the Trusted Publishing policy on each registry.
- The public GitHub issue claiming the Open VSX namespace.
- The DNS TXT record for the Marketplace verified-publisher badge (eligible only after 6 months).
- The Cursor forum post for its verification badge.

## Changelog
- 2026-11-07 — created (research run, nothing submitted).
- 2026-11-07 — reviewed (independent): no changes (spot-checked global PAT decommission date 27 Jan 2027 on devblogs and Marketplace Trusted Publishing via `vsce publish --oidc` plus the 1 Dec 2026 date on code.visualstudio.com).
