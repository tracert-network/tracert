---
slug: agent-skill-directories
intent: Publish an AI agent skill (SKILL.md) or agent plugin to the public skill directories and plugin marketplaces where other people discover and install it.
task_type: research
region: global
tags: agent skills, SKILL.md, claude code plugin, plugin marketplace, marketplace.json, anthropic directory, clawhub, skills.sh, skillsmp, awesome-claude-skills, cursor marketplace, codex plugins, gemini cli extensions, awesome-copilot, agentskills.io, skill security, malicious skills
hosts: code.claude.com, claude.com, github.com, agentskills.io, docs.openclaw.ai, skills.sh, skillsmp.com, cursor.com, forum.cursor.com, cursor.directory, developers.openai.com, learn.chatgpt.com, geminicli.com, claudemarketplaces.com
summary: "One public repo with .claude-plugin/marketplace.json covers most skill directories; Anthropic's directory needs a paid plan and passes a security scan; ClawHub and skills.sh scan rules."
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 31
---

# How to publish a Claude Code skill or agent plugin to skill directories and marketplaces

Labels: **observed** = seen on the site's own page on 2026-11-07. **first-party claim** = the site's own docs or marketing, read 2026-11-07. **third-party** = a blog, list or search summary about it. Search-result summaries are marked "(via search)": the page itself was not opened. Pages were read through a summarising fetcher, so wording is paraphrased unless quoted.

## TL;DR — fastest path

- **Build one repo that works everywhere.** Write the skill to the Agent Skills spec (agentskills.io). Then wrap it as a Claude Code plugin in a **public GitHub repo** containing `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` (one entry, `"source": "./"`), `skills/<name>/SKILL.md`, a README of at least 40 words and a LICENSE. Run `claude plugin validate --strict .`. Once pushed, the repo is already a self-hosted marketplace (`claude plugin marketplace add owner/repo`), and crawler directories can pick it up (claudemarketplaces.com, and SkillsMP if the repo has 2+ stars).
- **Anthropic's directory (the highest-reach option)** reaches claude.ai, Cowork and Claude Code. A human with a **paid Claude plan** (Pro/Max/Ultra, or a Team/Enterprise Owner) submits a "Plugin bundle" at `claude.ai/directory/manage`. Every version gets automated validation and a security scan, and a person reviews a new listing. No listing fee is stated, and review time "isn't fixed" (first-party claim, 2026-11-07).
- **ClawHub (OpenClaw):** `npm i -g clawhub`, `clawhub login` (needs a GitHub account old enough to pass its upload gate), then `clawhub skill publish ./my-skill --slug my-skill --name "My Skill" --version 1.0.0` (first-party claim, 2026-11-07).
- **Other ecosystems, each with its own manifest:** Gemini CLI auto-lists a public repo that has the GitHub topic `gemini-cli-extension` and a root `gemini-extension.json` (crawled daily). Cursor uses the manual form at `cursor.com/marketplace/publish` (open source required, reviews take weeks). GitHub Copilot takes a PR to `github/awesome-copilot`. Codex/ChatGPT has a "Submit plugins" flow (not opened, so verify it).
- **Avoid what scanners flag.** Leave out "install this prerequisite" download steps, unpinned `npx`/`uvx` packages, hard-coded secrets, minified or compiled code and undisclosed network calls. These match the ClawHavoc malware pattern and trip the Anthropic, ClawHub and skills.sh scanners.

## Verify first

1. **The Anthropic portal and plan rule still hold.** Fetch `https://claude.com/docs/directory/publish.md`. Expect "Pro, Max, Ultra, Team, or Enterprise. Free accounts can't submit" and the portal at `claude.ai/directory/manage`. If not, re-explore the claude.com section in Domains.
2. **Gemini gallery topic and crawl.** Fetch `https://geminicli.com/docs/extensions/releasing.md`. Expect topic `gemini-cli-extension` (singular) and "crawls tagged repositories daily". If not, re-explore geminicli.com.
3. **ClawHub publish command.** Fetch `https://docs.openclaw.ai/tools/clawhub`. Expect `clawhub skill publish <path>` and a GitHub account-age gate. If not, re-explore docs.openclaw.ai.
4. **Codex/ChatGPT third-party submission is open.** Fetch `https://learn.chatgpt.com/docs/plugins` and follow its "Submit plugins" link. Expect an OpenAI Platform submission flow with review materials and test cases. If not, re-explore learn.chatgpt.com (third-party blogs from April 2026 said there was no self-serve option).
5. **How a skill gets onto the skills.sh leaderboard.** Fetch `https://github.com/vercel-labs/skills` (README). Expect a statement of whether an `npx skills add owner/repo` install auto-lists a skill. This was **not confirmed** on 2026-11-07. If it is unclear, treat skills.sh as telemetry-ranked with no submission form.

## Domains

### claude.com / claude.ai (Anthropic's directory) — highest reach; a human with a paid plan submits; automated plus human review

- **Access:** 2026-11-07. The docs pages opened fine. The portal itself (`claude.ai/directory/manage`) was not opened, since it needs sign-in.
- **Offers:** One listing appears in claude.ai, Cowork and Claude Code. Claude Code loads it as `<name>@synced`. There's no separate submission for "Claude Marketplace" (claude.com/marketplace); it routes to this directory (first-party claim). Usage tab shows installs, versions, runs and error rates (first-party claim).
- **How:**
  - Submit a "Plugin bundle" in the portal. The steps are Source (repo URL or `owner/repo`, optional plugin path and branch/tag) → Validate → Listing details (read from plugin.json and README) → Data handling questions → Compliance (contact email plus 4 acknowledgements) → Review and submit. Updates arrive by GitHub push webhook or scheduled check (first-party claim).
  - "Skills aren't a submission type on their own. Put them in a bundle." However, the checklist also says a folder with no `plugin.json` but at least one `skills/<name>/SKILL.md` "passes with a note and is listed for Claude Code only" (both first-party claims, 2026-11-07, in slight tension).
- **Requirements (first-party claim, 2026-11-07):**
  - GitHub repo, public before go-live. A private repo is allowed while validating, if the Claude GitHub App is installed and you consent to uploading the source.
  - GitHub account connected on claude.ai, with push access to the repo.
  - README of at least 40 words (words in code blocks don't count) and a `LICENSE` file or a `license` field. Missing either blocks submission.
  - `name`: lowercase letters, digits and hyphens, at most 64 characters. Reserved words (`claude`, `anthropic`, `official`, `plugin`, `mcp`, `test`) can't be the whole name, and look-alikes or brand names are held for a reviewer.
  - Repo under 50 MiB archived and 256 MiB unpacked, with fewer than 10,000 files.
  - Non-image files over 256 KiB, more than 512 files, or binaries are held for a reviewer.
  - No `.DS_Store` files (blocking).
  - Packages run with `npx`/`uvx` must be pinned to exact versions (blocking), and even pinned ones are held for a reviewer.
  - No real credentials anywhere; use `userConfig` with `sensitive: true`.
  - Readable source, not minified.
- **Safety:**
  - The security scan looks for undisclosed behaviour, "such as sending data elsewhere, running hidden code, or changing Claude's permission settings".
  - If a first submission fails the scan, it is rejected.
  - Listings must comply with the Anthropic Software Directory Terms and Policy.
  - Limits: 10 submissions per org per 24 hours, and the first org to submit a repo folder owns the listing (first-party claim).
- **Gotchas:**
  - `claude-plugins-official` (the built-in marketplace) "doesn't take submissions through the directory portal". It is reached only through an Anthropic partner contact (first-party claim).
  - The old Console form (`platform.claude.com/plugins/submit`) "is no longer supported" (first-party claim), but search-engine summaries still cite it and a `claude.ai/admin-settings/...` URL (third-party, via search). Ignore those.
  - Desktop-extension (MCPB) listings are deprecated.
  - Contact: `directory@anthropic.com`.

### code.claude.com (self-hosted Claude Code marketplace) — free, instant, no review; the base layer for everything else

- **Access:** 2026-11-07, docs opened fine (first-party claim).
- **Offers:** Anyone who can clone the repo can install by name and receive updates. "Once the file is in the repository, the plugin is published, with no submission form."
- **How:**
  - `.claude-plugin/marketplace.json` needs `name`, `owner` and `plugins[]`; each entry needs `name` and `source`.
  - Sources can be relative path, `github`, `git-subdir`, `url`, `archive`, `npm` or `command`.
  - Users add and install with `claude plugin marketplace add owner/repo`, then `claude plugin install <name>@<marketplace>`. Alternatively, `/plugin install <name> --marketplace owner/repo` does both (Claude Code v2.1.275 or later).
  - Validate with `claude plugin validate --strict .`.
  - Tag releases with `claude plugin tag --push`.
- **Gotchas:**
  - Reserved marketplace names (e.g. `claude-plugins-official`) are refused when added.
  - The entry name must equal the `plugin.json` name.
  - A plugin's name is permanent; use `displayName` or the `renames` map instead.
  - If `version` is set but not bumped, users keep the old copy.
  - Auto-update is off by default for third-party marketplaces.

### agentskills.io — the cross-agent SKILL.md standard (not a registry)

- **Access:** 2026-11-07, opened fine.
- **Offers:** An open spec, "originally developed by Anthropic" and adopted by many agent products (first-party claim). A client showcase exists at `agentskills.io/clients.md` (not opened). It lists no registry for publishing.
- **How:** `SKILL.md` frontmatter (first-party claim, 2026-11-07):
  - Required: `name` (1–64 characters, `a-z0-9-`, no leading, trailing or double hyphens, **must match the parent directory name**) and `description` (1–1024 characters, saying what the skill does and when to use it).
  - Optional: `license`, `compatibility` (at most 500 characters), `metadata` (string map) and `allowed-tools` (experimental).
  - Keep `SKILL.md` under 500 lines / about 5,000 tokens, and put extra files in `scripts/`, `references/` and `assets/`.
  - Validate with `skills-ref validate ./my-skill`.

### github.com/anthropics/skills — Anthropic's own example skills; not a community listing venue

- **Access:** 2026-11-07, observed. About 189k stars and 22.2k forks, with 1.1k PRs shown. No CONTRIBUTING file was visible in the file list.
- **Offers:** Example and document skills, installable with `/plugin marketplace add anthropics/skills` then `/plugin install document-skills@anthropic-agent-skills`. The repo also holds `spec/` and `template/` folders (observed).
- **Gotchas:** No stated policy on accepting third-party skills (observed: absent). Use `template/` as a layout reference only.

### docs.openclaw.ai / ClawHub — open upload via CLI; scan-gated; had the largest known malware incident

- **Access:** 2026-11-07. The docs opened fine. `clawhub.ai` itself was not opened.
- **How (first-party claim, 2026-11-07):**
  - Install the CLI: `npm i -g clawhub` (or pnpm).
  - Sign in: `clawhub login`, then check with `clawhub whoami`.
  - Publish: `clawhub skill publish <path>`. Flags: `--slug`, `--name`, `--version` (semver), `--changelog`, `--tags` (default `latest`).
  - Requirements: a folder with `SKILL.md`, plus "a GitHub account old enough to pass the upload gate". The minimum age isn't stated.
  - No cost is stated.
- **Safety (first-party claim):** Automated checks run on publish, and public pages show the latest scan state. Releases held or blocked by the scan are removed from public surfaces. Signed-in users can report skills; moderators hide content and ban accounts.
- **Incidents (third-party):**
  - **ClawHavoc**, early February 2026: Koi Security audited 2,857 ClawHub skills and flagged 341 as malicious, 335 of them from one campaign. The lure was a fake "prerequisite" install step (a password-protected ZIP on Windows, a pasted shell command on macOS). The payload was mostly Atomic macOS Stealer, and some skills hid reverse shells (eSecurityPlanet and others, via search).
  - Later counts differ: Antiy CERT reported 1,184 malicious packages as of 5 February 2026 (via search).
  - **Response**, about 8 February 2026: a VirusTotal partnership. Each skill is hashed with SHA-256 and checked; unknown bundles go to VirusTotal Code Insight. Verdicts are benign (approved), suspicious (warning) or malicious (blocked), and all skills are rescanned daily. Maintainers said it is "not a silver bullet" against concealed prompt injection (The Hacker News, via search).
  - **Snyk ToxicSkills:** Snyk scanned 3,984 skills from ClawHub and skills.sh as of 5 February 2026. It found 76 confirmed malicious, 13.4% with a CRITICAL issue and 36.8% with any issue; 91% of the malicious ones combined prompt injection with malware (Snyk vendor blog, via search).

### skills.sh (Vercel) — telemetry-ranked leaderboard; no submission form found

- **Access:** 2026-11-07. `skills.sh/docs` opened fine.
- **Offers:** A leaderboard ranked by "anonymous telemetry data collected from the `skills` CLI". Install with `npx skills add <owner>/<repo>`. The site's navigation lists Claude Code, Cursor, Codex, Copilot, Windsurf, Gemini, Cline, AMP, Antigravity and OpenClaw (first-party claim).
- **How:** The docs describe no submission process (observed: absent). Likely route, **unverified**: put the skill in a public GitHub repo, and installs through the CLI surface it. Check the `vercel-labs/skills` README.
- **Safety:**
  - "Routine security audits" run, and issues go to security.vercel.com (first-party claim).
  - The Vercel changelog (via search) says audits come from Gen, Socket and Snyk and cover 60,000+ skills. Flagged-malicious skills are hidden from the leaderboard and search, and direct links show a warning.
  - Vercel "cannot guarantee the quality or security of every skill listed" (first-party claim).

### skillsmp.com — GitHub auto-crawler; blocked for us

- **Access:** 2026-11-07, `/about` returned **HTTP 403** (blocker).
- **Offers (first-party claim via search snippet of its FAQ, not opened):** A scraper syncs with GitHub regularly and filters out repos with fewer than 2 stars.
- **Third-party:** It indexes public repos with a valid SKILL.md, with no registration or submission. Catalog size claims conflict, from 35,530 shown on the site to "1.9M" in blogs (via search).
- **How:** Public repo, valid `SKILL.md`, 2+ stars, then wait for the crawl (inference from the above; unverified).

### claudemarketplaces.com — independent crawler directory with a submit form

- **Access:** 2026-11-07, observed.
  - Describes itself as independent and "Not affiliated with Anthropic".
  - Counts shown: 23,388 skills, 12,592 MCP servers and 3,147 marketplaces.
  - Sponsor slots cost $500–1,200 per month.
- **How (first-party claim):** Crawlers discover listings and refresh installs and stars, an editor reviews listings manually, and sweeps remove spam. A `/submit` form exists (not opened). Browsing is free.
- **Gotchas:** It mentions no security scanning (observed: absent).

### cursor.com / forum.cursor.com — manually reviewed, open-source-only marketplace; slow

- **Access:** 2026-11-07. Help page and forum thread opened fine.
- **Requirements (first-party claim, help page):**
  - Every plugin and every update is reviewed manually, with no auto-update from source.
  - All marketplace plugins must be open source. Plugins are mostly markdown plus skill files, "no binaries".
  - Plugins with security issues are removed immediately. Security reports go to security-reports@cursor.com.
  - Cursor works with "a small group of trusted partners" and plans to open listing more broadly later.
- **How:**
  - A Cursor staff member on the forum (thread dated 2026-10-14, observed) says submissions go through the `cursor.com/marketplace/publish` form into a manual queue. There is no automatic receipt; a "Thanks for applying" screen means it was received.
  - Don't resubmit, because it creates duplicates. Staff can't give a timeline.
  - The submitter had waited from 2026-09-24 and emailed marketplace-publishing@cursor.com with no reply (observed, user post).
  - Another staff reply says review is "usually a couple of weeks, sometimes longer" (third-party, via search).
  - The forum reply's checklist covered a manifest, MCP config, skills, license and logo (observed).
  - The manifest is reportedly `.cursor-plugin/plugin.json`, which is unverified.
- **Gotchas:** Forum posts conflict on whether **cursor.directory** (a community site) is now the main place to list or a separate queue (third-party, via search).

### cursor.directory — community Cursor directory; blocked for us

- **Access:** 2026-11-07, **HTTP 429** (blocker). The submission method was not verified.

### learn.chatgpt.com (Codex / ChatGPT plugins) — shared catalog; a submission flow exists but was not opened

- **Access:** 2026-11-07. `developers.openai.com/codex/plugins` redirected (308) to `learn.chatgpt.com/docs/plugins`, which opened fine.
- **Offers (first-party claim):**
  - "ChatGPT and Codex use the same public plugin catalog."
  - The Plugins Directory has tabs for OpenAI, your workspace and Personal. Workspace admins can import and sync a GitHub marketplace.
  - A "Submit plugins" guide describes the "OpenAI Platform submission flow, required permissions, review materials, MCP checks, and test case requirements" (not opened).
  - The fetcher also reported a "Submit a Claude Code plugin" item in the navigation (observed but unclear; verify).
- **Third-party (April 2026 blogs, via search):**
  - Manifest at `.codex-plugin/plugin.json`.
  - Marketplace files at `~/.agents/plugins/marketplace.json` or `$REPO_ROOT/.agents/plugins/marketplace.json`.
  - "No self-serve marketplace submission" at that time, which is probably stale given the first-party page above.
  - Community list: `hashgraph-online/awesome-codex-plugins` takes PRs.

### geminicli.com — automatic gallery via GitHub topic

- **Access:** 2026-11-07, opened fine.
- **How (first-party claim):**
  - The gallery is at `geminicli.com/extensions/browse/`.
  - "You don't need to submit an issue or email us."
  - Requirements: a public GitHub repo, the topic **`gemini-cli-extension`** in its About section, and `gemini-extension.json` at the repo root (or at the root of the release archive).
  - Tagged repos are crawled daily and listed if they pass validation; the criteria aren't stated.
  - Users install with `gemini extensions install <repo-uri> [--ref=...]`.
- **Gotchas:**
  - A GitHub topic page found by search uses the plural `gemini-cli-extensions`; the first-party docs say singular.
  - No manual review or security process is described (observed: absent). The page doesn't say whether extensions can bundle SKILL.md skills.

### github.com/github/awesome-copilot — GitHub-org community collection that is also a Copilot CLI marketplace

- **Access:** 2026-11-07, observed: 40.9k stars, MIT licence.
- **Offers:** It lists agents, instructions, skills, plugins and hooks. Users install with `copilot plugin install <plugin-name>@awesome-copilot`; older CLIs first need `copilot plugin marketplace add github/awesome-copilot` (first-party claim).
- **How:** By PR, following CONTRIBUTING.md and AGENTS.md (not read). The required layout was not verified.
- **Safety:** The only rule seen was "Please inspect any agent and its documentation before installing" (observed). SECURITY.md exists.

### github.com/ComposioHQ/awesome-claude-skills — awesome list; PR, but may be collaborator-only

- **Access:** 2026-11-07, observed: CONTRIBUTING.md read, 1.7k PRs and 208 issues.
- **How (first-party claim):**
  - Fork, create a branch named like `add-skill-name`, and add a lowercase hyphenated folder with `SKILL.md` (`name` plus a one-sentence `description`).
  - Add a one-line README entry, alphabetically within one of 5 categories, with no emojis.
  - PR title: "Add [Skill Name] skill".
  - The skill should solve a real problem, be tested on Claude.ai, Claude Code or the API, and confirm before destructive operations.
- **Gotchas:** The page showed "Only collaborators can create PRs" (observed). Outside PRs may be closed, so check before preparing one. No security review is described.

## Dead ends

- **anthropics/skills:** This is Anthropic's demo and document skills. It has no visible contribution policy, so it isn't a place to list your skill (2026-11-07).
- **claude-plugins-official:** Not reachable through the public portal; partner contact only (first-party claim, 2026-11-07).
- **Claude Console plugin form (`platform.claude.com/plugins/submit`) and `claude.ai/admin-settings/directory/submissions/plugins/new`:** Search summaries still cite them. The Console form "is no longer supported" (first-party claim); use `claude.ai/directory/manage`.
- **claude.com/marketplace:** No separate submission; it routes to the directory (first-party claim).
- **Desktop extensions (MCPB) in Anthropic's directory:** Deprecated (first-party claim).
- **skills.sh/docs:** Has no submission or listing rules. Only ranking and audit notes.
- **Search for claude-plugins.dev:** Returned nothing about that site; it was not explored.
- **Third-party "Codex has no self-serve submission" claims (April 2026):** Probably outdated; the first-party docs now link a submission flow.

**Blockers hit on 2026-11-07:**
- skillsmp.com/about returned HTTP 403.
- cursor.directory returned HTTP 429.
- developers.openai.com/codex/plugins returned 308 to learn.chatgpt.com (followed).
- Not opened because they need a login: claude.ai/directory/manage, cursor.com/marketplace/publish, clawhub.ai upload.

## Prep checklist

- [ ] The skill folder name equals the `name` in frontmatter: lowercase, hyphens, at most 64 characters, no reserved or brand words, distinctive.
- [ ] `description` (at most 1024 characters) states what the skill does **and when to use it**. `SKILL.md` is under 500 lines, with long material moved to `references/`.
- [ ] Public GitHub repo with `.claude-plugin/plugin.json` (`name`, `description`, `author`, `version`, `homepage`, `repository`, `license`) and `.claude-plugin/marketplace.json` (unique marketplace name; entry `"source": "./"`).
- [ ] `README.md` of at least 40 words outside code blocks, in the plugin folder. It discloses everything the plugin runs, sends or fetches.
- [ ] `LICENSE` file. Cursor and Anthropic's directory both effectively require open source.
- [ ] No secrets, no `.DS_Store`, no binaries, no minified code, no symlinks, submodules or LFS, and every file under 256 KiB.
- [ ] Every `npx`/`uvx` package pinned to an exact version. No "download and run this prerequisite" steps (the ClawHavoc pattern).
- [ ] `claude plugin validate --strict .` and `skills-ref validate ./skills/<name>` both pass.
- [ ] Optional manifests for other ecosystems: `gemini-extension.json` plus the topic `gemini-cli-extension`, `.codex-plugin/plugin.json` (unverified), and the Cursor plugin manifest (unverified path).
- [ ] At least 2 GitHub stars if you want SKILL.md crawlers such as SkillsMP to index the repo.

## Needs a human

- **Anthropic directory:** claude.ai sign-in on a paid plan (Pro/Max/Ultra, or Team/Enterprise Owner or Directory role). Connecting GitHub and installing the Claude GitHub App for private repos. Answering the data-handling questions and selecting the 4 compliance acknowledgements, which accepts terms. Setting up the GitHub webhook needs repo admin.
- **ClawHub:** `clawhub login` with a GitHub account old enough to pass its gate.
- **Cursor:** Submitting the `cursor.com/marketplace/publish` form, plus any follow-up email.
- **Codex/ChatGPT:** Signing in and submitting through the OpenAI Platform flow, after the requirements are verified.
- **PRs to awesome lists** (awesome-copilot, awesome-claude-skills, awesome-codex-plugins): opening a PR publishes public content and needs the user's explicit OK.
- **Paid placement:** claudemarketplaces.com sponsor slots ($500–1,200 per month) are a purchase decision.

## Changelog

- 2026-11-07 — created (research run, no submissions).
