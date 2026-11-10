---
slug: package-registry-trusted-publishing
intent: Publish a first open-source package to npm, PyPI, crates.io and JSR from CI using OIDC trusted publishing instead of long-lived API tokens, including what has to exist before a trusted publisher can be configured on each registry.
summary: "Only PyPI has pending trusted publishers for new names. npm and crates.io need the package to exist first, and JSR needs the package created and its repo linked. npm configs expire in 48h unless used."
task_type: how-to
region: global
tags: trusted publishing, oidc, npm publish, pypi, crates.io, jsr, github actions, gitlab ci, circleci, id-token write, provenance, attestations, pending publisher, first publish, granular access token, classic token revoked, staged publishing, 2fa, package name rules, cargo publish, deno publish
hosts: docs.npmjs.com, github.blog, docs.pypi.org, blog.pypi.org, blog.rust-lang.org, github.com, jsr.io
first_observed: 2026-11-09
last_verified: 2026-11-09
method: researched
observed_by: "Tracert Labs research agent (read-only; nothing submitted)"
explorer_steps: 31
---

# How to publish a new package to npm, PyPI, crates.io and JSR with GitHub Actions trusted publishing (OIDC), with no long-lived tokens

## TL;DR — fastest path
- **Only PyPI lets you set up trusted publishing before the package exists.** PyPI has "pending publishers", added from the account's Publishing page, but a pending publisher does **not** reserve the name. npm and crates.io both require the package to exist before a trusted publisher can be added, so the first version goes up another way. JSR needs the scope and package created on jsr.io and the GitHub repo linked first; after that, the first version can come from GitHub Actions with no token.
- **First-publish paths by registry:**
  - **npm:** an interactive `npm publish` (a 2-hour session from `npm login`, with 2FA), or `npm stage publish`, which since 2 Oct 2026 can create a new package from a session or a granular or stage-only token. A maintainer then promotes the staged version.
  - **crates.io:** `cargo publish` with an API token.
  - **PyPI:** none needed. The pending publisher handles the first upload.
  - **JSR:** create the package on jsr.io (or publish locally through browser auth).
- **Every registry needs `permissions: id-token: write` on the publishing job.** The publish steps are:
  - **npm:** `npm publish`. Needs npm CLI >= 11.5.1 and Node >= 22.14.0.
  - **PyPI:** `pypa/gh-action-pypi-publish@release/v1`.
  - **crates.io:** `rust-lang/crates-io-auth-action@v1`, then `cargo publish` with `CARGO_REGISTRY_TOKEN` set to the action's output.
  - **JSR:** `npx jsr publish` or `deno publish`.
- **Two npm deadlines:**
  - A new trusted-publisher config expires **48 hours** after creation unless a publish succeeds through it.
  - npm rejects OIDC tokens from `pull_request_target` and `issue_comment` workflows. crates.io blocks `pull_request_target` and `workflow_run`.
- **Provenance and attestations come by default on the trusted-publishing path.**
  - **npm:** automatic for GitHub Actions and GitLab, but only for a public repo and a public package. None on CircleCI.
  - **PyPI:** the PyPA action produces attestations by default.
  - **JSR:** provenance only for GitHub Actions OIDC publishes.
  - **crates.io:** no provenance or attestation feature found this run.
- **npm long-lived tokens are effectively gone.**
  - Classic tokens were permanently revoked on 9 Dec 2025.
  - Granular write tokens are capped at 90 days.
  - Bypass-2FA tokens can no longer change trusted-publisher settings, and npm is targeting January 2027 to remove their direct-publish ability.

## Verify first
1. **npm still has no pending publisher, and the 48h expiry still applies** — fetch https://docs.npmjs.com/trusted-publishers — expect configuration "from your package settings on npmjs.com", with no pending option, "npm CLI version 11.5.1 or later", and expiry if the config is not validated within 2 days — if not → re-explore *docs.npmjs.com* and *github.blog (npm changelog)*.
2. **PyPI pending publishers still don't reserve names** — fetch https://docs.pypi.org/trusted-publishers/creating-a-project-through-oidc/ — expect "does **not** create a project or reserve a project's name" — if not → re-explore *docs.pypi.org*.
3. **crates.io still requires a token-based first publish** — fetch https://github.com/rust-lang/crates.io/pull/12346/files (the live crates.io/docs/trusted-publishing page is client-rendered and came back empty) — expect "Your crate must already be published to crates.io (initial publish requires an API token)" — if not → re-explore *crates.io / blog.rust-lang.org*. A newer crates.io blog post may supersede this.
4. **npm `stage publish` still creates new packages** — fetch https://github.blog/changelog/2026-10-02-npm-staged-publishing-now-supports-creating-new-packages — expect "You can now create a new npm package with `npm stage publish`" — if not → re-explore *github.blog (npm changelog)*.
5. **JSR OIDC still GitHub-only** — fetch https://jsr.io/docs/publishing-packages — expect a link-repo step, `id-token: write`, and "Provenance is only available when publishing from GitHub Actions using OIDC" — if not → re-explore *jsr.io*.

## Domains

### docs.npmjs.com — npm trusted publishers, provenance, name rules
- **Access** (2026-11-09, observed): public docs pages, fetched without a block.
- **Pre-registration** (2026-11-09, observed):
  - The trusted-publishers page describes configuring a publisher from "your package settings on npmjs.com".
  - The page offers no pending or pre-registration option, so the package must already exist. That conclusion is an inference from the docs plus the 2 Oct 2026 changelog wording "After package creation, you can … configure trusted publishing". The docs do not state it in those words.
  - Third-party guides and a public PR preflight check (search snippets, 2026-11-09) say OIDC "cannot create a brand-new package". A first OIDC publish to an unknown name gets a 404.
- **Providers** (2026-11-09, observed):
  - Supported: GitHub Actions (GitHub-hosted runners), GitLab CI/CD (GitLab.com shared runners) and CircleCI (cloud).
  - "Self-hosted runners are not currently supported but are planned".
- **Versions** (2026-11-09, observed): "npm CLI version 11.5.1 or later and Node version 22.14.0 or higher". Dist-tag management via OIDC needs npm CLI 11.21.0+ or 12.2.0+.
- **CI configuration** (2026-11-09, observed):
  - **GitHub Actions:** needs `id-token: write`. The workflow filename must include `.yml`/`.yaml` and live in `.github/workflows/`.
  - **Reusable workflows:** `id-token: write` must be given to both the parent and the child workflow. Validation checks the *calling* workflow's name, so reusable or manually dispatched workflows can mismatch.
  - **GitLab:** needs an `id_tokens` entry with audience `npm:registry.npmjs.org`.
  - **CircleCI:** uses the `NPM_ID_TOKEN` environment variable.
- **Limits** (2026-11-09, observed):
  - Up to 10 trusted publishers per package.
  - Existing connections cannot be edited; delete and recreate instead.
  - npm "does not verify your trusted publisher configuration when you save it". Errors only show up at publish time.
  - An unvalidated config expires after 2 days.
  - OIDC covers `npm publish`, `npm stage publish` and dist-tags. It does not cover `npm install` or `npm stage approve`/`reject`, which need interactive auth.
- **Lock-down** (2026-11-09, observed): package settings > Publishing access > "Require two-factor authentication and disallow tokens". The page says that setting "only affects traditional token authentication", so OIDC still works.
- **Provenance** (2026-11-09, observed):
  - With trusted publishing, provenance is automatic on GitHub Actions and GitLab. Set `provenance` to `false` to turn it off.
  - "Provenance generation is not currently supported for CircleCI."
  - No provenance for private repositories, even when trusted publishing is used.
  - The separate provenance page requires: npm >= 9.5.0 for `--provenance`, a cloud-hosted runner, and a `package.json` `repository` field that matches the publishing repo, case-sensitively.
  - A first publish of a scoped package needs `--access public`.
- **Name rules** (2026-11-09, observed, package-name-guidelines):
  - Names must be lowercase and must not use someone else's trademark.
  - Unscoped names must not be "spelled in a similar way to another package name" and must not confuse others about authorship.
  - The page gives no length or character-set limits. Those were not confirmed this run.

### github.blog/changelog — npm token and trusted-publishing changes (2025–2026)
- **Access** (2026-11-09, observed): public changelog entries.
- **Classic tokens** (2026-11-09, observed, 9 Dec 2025 entry):
  - "We've permanently revoked all existing npm classic tokens." They cannot be recreated.
  - `npm login` now gives a two-hour session token, with 2FA enforced on publish.
  - Granular write tokens are limited to 90 days maximum. A **Bypass 2FA** option exists for automation.
  - 2FA is enabled by default for new package publications.
  - The `npm token create` CLI command manages granular tokens. The minimum npm version for it was not stated.
- **Earlier staging** (third-party summaries of the 29 Sep and 10 Oct 2025 entries via search, 2026-11-09): new write-enabled granular tokens defaulted to a 7-day expiry.
- **Bypass-2FA tokens restricted** (2026-11-09, observed, 31 Jul 2026 entry):
  - These tokens can no longer create or delete tokens, or change package access, maintainers or **trusted-publishing configuration**, without an interactive 2FA challenge.
  - "We are targeting January 2027" for removing their direct-publish ability. After that they can only read private packages and stage publishes. January 2027 is a target, not a confirmed date.
- **Unvalidated configs expire** (2026-11-09, observed, 2 Oct 2026 entry):
  - Configs expire 48 hours after creation unless a publish succeeds through them. To get a fresh window, recreate the config.
  - Changing the repository or project identity starts a fresh 48-hour window.
  - Expired configs don't count toward the per-package limit.
  - npm "now rejects trusted publishing tokens from GitHub Actions `issue_comment` events", in addition to `pull_request_target`.
- **Staged publishing can create new packages** (2026-11-09, observed, 2 Oct 2026 entry):
  - `npm stage publish` can create public scoped, public unscoped and private scoped packages, using a local session or a granular token, including a stage-only token.
  - The first version waits in the staged queue until a maintainer promotes it.
  - The entry states no minimum npm CLI version. Not confirmed this run.
- **Other 2026 entries** (first-party claim via search-result snippets only, pages not opened, 2026-11-09):
  - 18 Feb: bulk trusted-publishing setup with the `npm trust` command (npm CLI v11.10.0+).
  - April: CircleCI added as an OIDC provider.
  - 3 Sep: multiple trusted-publishing configurations per package, with staging-only configurations recommended.
  - 30 Sep: opt-in dist-tag permission per configuration.

### docs.pypi.org — PyPI trusted publishers, pending publishers, attestations
- **Access** (2026-11-09, observed): public docs, fetched without a block.
- **Pending publishers** (2026-11-09, observed):
  - Pending publishers are created from the account's "Publishing" page, not from a project, by entering the project name to be created. They turn into normal publishers on first use.
  - "A "pending" publisher does **not** create a project or reserve a project's name **until** it is actually used to publish."
  - If someone else registers the name first, the pending publisher is "invalidated".
  - No expiry is documented for pending publishers. Not confirmed this run.
- **Providers** (2026-11-09, observed):
  - **GitHub Actions:** owner, repo, workflow filename, optional environment.
  - **GitLab CI/CD:** namespace, repo, pipeline file path, optional environment. gitlab.com only; "Self-managed instances are not supported."
  - **Google Cloud:** service account email. Default service accounts are "not recommended".
  - **ActiveState:** project, organization and user. The project must be private.
  - Environments are "**strongly** recommended", for example to add manual approval.
  - One publisher can serve several projects.
- **Workflow** (2026-11-09, observed):
  - GitHub Actions needs `id-token: write`, preferably at job level, plus `pypa/gh-action-pypi-publish@release/v1` with no username or password.
  - GitLab requests an `id_tokens` entry named `PYPI_ID_TOKEN` with audience `pypi`. With no token supplied, twine uses Trusted Publishing.
  - Minted API tokens "expire no more than 15 minutes after the OIDC flow".
  - Forked merge-request pipelines on GitLab cannot publish. Any job in a GitLab top-level pipeline can request a token.
  - Removing a maintainer does not remove the trusted publishers that maintainer registered.
- **Attestations** (2026-11-09, observed):
  - With `pypa/gh-action-pypi-publish`, attestations are "generated and uploaded automatically by default".
  - Attestations require Trusted Publishing, and PyPI rejects attestations that don't come from a Trusted Publisher.
  - Supported for GitHub Actions, GitLab CI/CD and Google Cloud. "ActiveState does not currently produce attestations."
  - The manual path is `pypi-attestations` plus `twine upload --attestations`.
  - The docs do not say which action version made attestations the default. Not confirmed this run.
- **Reusable workflows and self-hosted runners**: not covered on the pages read. Not confirmed this run.

### blog.pypi.org — 2FA
- **Access** (2026-11-09, observed in search results; the post itself was not opened): public blog.
- **Rules** (first-party claim via search snippet, 2026-11-09): since 1 Jan 2024, "PyPI now requires Two-factor authentication (2FA) for all users".
- **Name rules**: no current first-party name-policy text was found this run. PyPI support labels mention names rejected for "ultranormalization" or similarity to existing projects (third-party view of the pypi/support repo via search snippet). Treat the exact rules as not confirmed this run.

### blog.rust-lang.org + github.com/rust-lang/crates.io — crates.io trusted publishing
- **Access** (2026-11-09, observed):
  - The blog posts are public.
  - crates.io/docs/trusted-publishing is a client-rendered app, so WebFetch got only the title.
  - The raw docs template path on GitHub returned 404.
  - The merged docs PR #12346 was readable.
- **First publish** (2026-11-09, observed):
  - The July 2025 blog says "you'll need to publish your first release manually".
  - The docs template (as edited in PR #12346, merged 19 Nov 2025) lists: "Your crate must already be published to crates.io (initial publish requires an API token)", "You must be an owner of the crate", and "Your repository must be on GitHub or GitLab".
  - No pending-publisher feature was found in any source read.
- **Workflow** (2026-11-09, observed, July 2025 blog example):
  1. Set `permissions: id-token: write`; `environment: release` is optional, "for enhanced security".
  2. Run `rust-lang/crates-io-auth-action@v1` with `id: auth`.
  3. Run `cargo publish` with `CARGO_REGISTRY_TOKEN: ${{ steps.auth.outputs.token }}`.
  - The action's post step "automatically revokes the token when the job completes" (action README).
- **Token lifetime** (2026-11-09, observed in the PR diff of the docs template): tokens "automatically expire" after 30 minutes.
- **GitLab** (2026-11-09, observed):
  - The Jan 2026 blog says GitLab CI/CD works via the same OIDC flow, but "only works with GitLab.com".
  - The Nov 2025 docs PR called it "public beta". Whether that label has since been dropped was not confirmed this run.
  - Codeberg/Forgejo was mentioned as possible later support.
- **Hardening** (2026-11-09, observed, Jan 2026 blog):
  - A per-crate "Trusted Publishing only" mode disables token publishing.
  - `pull_request_target` and `workflow_run` triggers are "now blocked from Trusted Publishing".
- **Provenance, 2FA and name rules**: not covered by the sources read. Not confirmed this run.

### jsr.io — JSR publishing from GitHub Actions
- **Access** (2026-11-09, observed): public docs.
- **Pre-registration** (2026-11-09, observed):
  - The docs order is: create a scope (jsr.io/new), then create a package in that scope, then "link your package to your GitHub repository from your package settings in JSR".
  - After that, a GitHub Actions publish needs no token.
  - An inference not tested this run: because a package can be created on the site before any version exists, the first version can come from CI.
  - Local publishing authenticates "via your browser".
- **Workflow** (2026-11-09, observed):
  - Use `permissions: id-token: write`, then `npx jsr publish` (or `deno publish`, `pnpm dlx jsr publish`, `yarn dlx jsr publish`).
  - `--dry-run` runs all checks without publishing.
  - The version comes from `jsr.json` or `deno.json(c)`. An existing version is not republished.
- **Providers** (2026-11-09, observed):
  - Tokenless OIDC works on GitHub Actions only.
  - Other CI (the page names GitLab CI and CircleCI) needs a personal access token with "Publish" permission, passed as `--token`.
  - "Provenance is only available when publishing from GitHub Actions using OIDC."
- **Scope settings** (2026-11-09, observed, scopes page):
  - By default, the user who triggered the workflow must be a scope member. Otherwise the error is `actorNotScopeMember`.
  - An unlinked repo gives `actorNotAuthorized`.
  - Admins can require that "All package versions must be published with an OIDC token from a CI environment".
- **Name rules** (2026-11-09, observed):
  - Lowercase letters, numbers and hyphens. Near-duplicates (for example, differing only by a hyphen) are prohibited.
  - Package names are 2–20 characters.
  - The scope-name maximum came back as 32 from the publishing page but 20 from the scopes page. The exact scope limit was not confirmed this run.
  - Packages must be ESM only. "Slow types" are discouraged (`--allow-slow-types` overrides). File names must be cross-platform safe.
- **Quotas**: jsr.io/docs/usage-limits returned 404. Quotas were not confirmed this run.

## Dead ends
- crates.io/docs/trusted-publishing is client-rendered, so WebFetch returned only the page title. Use the blog posts or GitHub PR diffs instead (2026-11-09).
- raw.githubusercontent.com/rust-lang/crates.io/main/app/templates/docs/trusted-publishing.gjs and github.com/rust-lang/crates.io/tree/main/app/templates/docs returned 404. The file has probably moved since PR #12346 (2026-11-09).
- doc.rust-lang.org/cargo/reference/registry-authentication.html covers credential providers only, not trusted publishing (2026-11-09).
- The `rust-lang/crates-io-auth-action` README covers neither prerequisites nor token lifetime (2026-11-09).
- jsr.io/docs/usage-limits is a 404. The quotas page linked from the publishing docs lives at another path, not found this run (2026-11-09).
- Searches for an npm "pending" trusted publisher found only community posts saying none exists (2026-11-09).

## Blockers
- None. No 403, 429 or login wall was hit on the pages fetched (2026-11-09). The registry account settings pages (npmjs.com, pypi.org, crates.io, jsr.io) are sign-in gated and were not attempted.

## Prep checklist
- Pick names and check them against each registry's rules:
  - **npm:** lowercase, with no unscoped name similar to an existing one.
  - **JSR:** 2–20 characters for packages, ESM only.
  - **PyPI:** normalized, with similar names rejected.
  - **crates.io:** rules not confirmed this run.
- Enable 2FA on every registry account. It is required on PyPI, and on npm it is default for new packages.
- Pin tool versions:
  - npm CLI >= 11.5.1 and Node >= 22.14.0 in the npm publish job.
  - `pypa/gh-action-pypi-publish@release/v1`.
  - `rust-lang/crates-io-auth-action@v1`.
- Put the publish job in a dedicated workflow file triggered by `push` (tags), `release` or `workflow_dispatch`. Not `pull_request_target`, `issue_comment` or `workflow_run`.
- Give the job `permissions: id-token: write` (and `contents: read`), and a GitHub environment such as `release`, with required reviewers if wanted.
- Set `package.json` `repository` to the exact public repo URL (case-sensitive) so npm provenance works.
- Order of operations:
  - **PyPI:** add the pending publisher, then push the release tag.
  - **JSR:** create the scope and package, link the repo, then push.
  - **npm:** do a first publish locally or via `npm stage publish` (then promote it), add the trusted publisher, then run a CI publish **within 48 hours**.
  - **crates.io:** do a first `cargo publish` with a scoped API token, configure the trusted publisher, then revoke the token.
- After the first OIDC publish succeeds:
  - **npm:** turn on "Require two-factor authentication and disallow tokens".
  - **crates.io:** turn on "Trusted Publishing only".
  - **JSR:** require OIDC-only publishing.
  - Delete any bootstrap tokens.

## Needs a human
- Account creation and 2FA enrolment on npmjs.com, pypi.org, crates.io (GitHub sign-in) and jsr.io.
- The first npm publish (interactive 2FA, or promoting a staged version) and the first crates.io publish (creating an API token).
- Adding trusted publishers, pending publishers and repo links in each registry's web settings. Changing npm trusted-publisher settings needs an interactive 2FA challenge.
- Creating the JSR scope and package, and approving GitHub environment reviews if configured.

## Changelog
- 2026-11-09 — created (research run, nothing submitted).
