---
slug: podcast-directory-submission
intent: Get a podcast that already has a public RSS feed (from any host) listed in the major podcast apps and directories, with the right feed metadata and ownership verification for each.
summary: "Do Apple first: Overcast, Goodpods and Castbox pull from it. Spotify and YouTube verify by a code sent to the feed's email (others reportedly too). Cover art 1400-3000px square. Google Podcasts is gone."
task_type: how-to
region: global
tags: submit podcast, podcast directories, rss feed, apple podcasts connect, spotify for creators, youtube podcasts rss, youtube music podcasts, amazon music for podcasters, audible podcasts, pocket casts, overcast, podcast index, iheartradio, deezer, goodpods, castbox, podcast artwork size, itunes:explicit, itunes:category, google podcasts shutdown
hosts: podcasters.apple.com, help.apple.com, support.spotify.com, providersupport.spotify.com, support.google.com, podcasters.amazon.com, pocketcasts.com, support.pocketcasts.com, overcast.fm, podcastindex.org, podnews.net, www.iheart.com
first_observed: 2026-11-07
last_verified: 2026-11-07
method: researched
observed_by: Tracert Labs research agent (read-only; nothing submitted)
explorer_steps: 33
---

# How to submit a podcast RSS feed to Apple Podcasts, Spotify, YouTube, Amazon and other podcast apps

## TL;DR — fastest path
- **Fix the feed once, then submit everywhere.** Use one 3000x3000 square JPG/PNG (RGB, no transparency), a valid ISO 639 `<language>`, one `itunes:category`, `itunes:explicit` set to true/false, at least one episode, and an `itunes:owner`/`itunes:email` address you can read. Spotify and YouTube send ownership codes to the feed's email (their help pages), and Deezer, Castbox, Amazon and iHeart reportedly do too (third-party guides). (Apple, observed 2026-11-07. Email-verification sources are listed per domain below.)
- **Apple Podcasts Connect comes first.** Overcast has no separate submission and picks up Apple-listed shows in about 1–2 days (observed). Goodpods (according to Spotify's help centre) and Castbox, Listen Notes, Player FM and Podchaser (third-party) also pull from Apple. Siri uses Apple's directory (third-party).
- **Then submit separately** to Spotify for Creators (creators.spotify.com: "Find an existing show" → "Somewhere else"), YouTube Studio (RSS ingestion, about 98 countries), Amazon Music for Podcasters (one submission also covers Audible, third-party), Pocket Casts, iHeartRadio and Deezer. Get into Podcast Index through your host, or through Podnews, which says it adds missing shows itself.
- **Google Podcasts is shut down** (US 2024-04-02; outside the US 2024-06-24, third-party). There is no Google directory to submit to any more. YouTube / YouTube Music RSS ingestion replaces it.
- **Needs a human:** creating accounts on each platform, reading the verification codes sent to the feed email, accepting terms or rights declarations, and iHeart's reCAPTCHA.

## Verify first
1. **Overcast still needs no separate submission** — fetch overcast.fm/podcasterinfo — expect "no separate submission process" and about 1–2 days after the Apple listing — if not → re-explore the overcast.fm section.
2. **Apple's RSS artwork range is still 1400–3000 px square, PNG/JPG, no alpha** — fetch podcasters.apple.com/support/5514-show-cover-template — expect 1400x1400 to 3000x3000 for RSS submissions — if not → re-explore the podcasters.apple.com and help.apple.com sections.
3. **Spotify still verifies with a code sent to the RSS email** — fetch support.spotify.com/us/creators/article/claiming-your-podcast-on-spotify-for-creators/ — expect an 8-digit code sent to the feed's email — if not → re-explore the support.spotify.com section.
4. **YouTube RSS ingestion covers the creator's country** — fetch support.google.com/youtube/answer/14106258 — expect the country in the list (it had about 98 countries/regions, incl. US, UK, CA, DE, FR, IN, JP, BR) — if not → this route goes through manual upload instead (not researched).
5. **Amazon flow and timing** — podcasters.amazon.com returned only a JS shell to a plain fetch. Check it in a real browser or on a host's help page — expect "add RSS feed → verification email → review" — if not → re-explore the podcasters.amazon.com section.

## Domains

### podcasters.apple.com / help.apple.com (Apple Podcasts Connect) — required first stop; feeds many other apps
- **Access** (2026-11-07, observed): the support pages loaded fine. Podcasts Connect itself is behind a sign-in (not opened).
- **Account** (2026-11-07, observed): "To submit a podcast you must have an Apple Podcasts Connect account." The pages read did not cover Apple Account or two-factor details.
- **Feed rules** (2026-11-07, observed, support/823-podcast-requirements):
  - RSS 2.0, public (not password-protected), with the XML declaration in UTF-8 and the itunes namespace.
  - At least one episode.
  - RFC 2822 dates.
  - Each episode needs a unique `<enclosure>` (url, length, type) and a GUID that never changes.
  - ASCII-only file names and URLs.
  - The host must support HTTP HEAD and byte-range requests.
- **Required channel tags** (2026-11-07, observed, help.apple.com "A Podcaster's Guide to RSS"):
  - `<title>`: keyword stuffing can get a show removed.
  - `<description>`: up to 4000 bytes, CDATA for HTML.
  - `<itunes:image>`: 1400x1400 to 3000x3000 px, JPEG or PNG, 72 dpi, RGB, no alpha channel.
  - `<language>`: ISO 639. Invalid codes fail validation.
  - `<itunes:category>`: only the first category and subcategory count. Escape `&` as `&amp;`.
  - `<itunes:explicit>`: true or false.
  - Recommended: `<itunes:author>` and `<link>`.
  - Required episode tags: `<title>`, `<enclosure>`, `<guid>`.
  - `<itunes:applepodcastsverify>` / `<podcast:txt purpose="applepodcastsverify">` is used to prove ownership when moving a show between Connect accounts.
- **Artwork** (2026-11-07, observed, support/5514-show-cover-template):
  - Square, 3000x3000 preferred; 1400–3000 px accepted for RSS submissions.
  - PNG or JPG, no transparency or alpha channel.
  - No Apple logos or Apple hardware imagery; the artwork may be rejected if it has them.
- **How** (2026-11-07, observed, support/897-submit-a-show):
  1. In Podcasts Connect, choose + → New Show → add a show with an RSS feed, and paste the feed URL.
  2. Set optional access restriction, review the Show Information, declare Content Rights, and add contact info.
  3. Set Availability: countries, distribution, transcripts, release timing and show claiming.
  4. Save, then Publish.
  - Feed warnings must be resolved before you can publish. "All shows must pass technical validations and a review process."
- **Review time:** no current official figure was found. A 2018 Apple holiday notice gave a "regular timeframe of five business days" (first-party claim, dated 2018). Third-party estimates run from minutes or 24–48 h up to 2 weeks.
- **Gotchas:** the support/896 artwork page is only an overview; the specs are on support/5514. Apple's RSS guide, as fetched, did not cover `itunes:owner` / `itunes:email`. Add it anyway, because other platforms verify through it.

### support.spotify.com (Spotify for Creators) — separate submission; verify by an 8-digit code to the feed email
- **Access** (2026-11-07, observed): the help pages loaded. creators.spotify.com is behind a sign-in (not opened).
- **Account** (2026-11-07, observed): any Spotify account, which can be created for free. Each team member needs their own Spotify account.
- **How** (2026-11-07, observed):
  1. Log in at creators.spotify.com and choose "Find an existing show" → "Somewhere else". If you already manage a show, use the account menu → "Add a new show".
  2. Paste the RSS feed URL (or the Spotify show URL).
  3. Spotify emails an 8-digit code to the email address in the RSS feed. Enter that code.
- **Rules** (2026-11-07, observed):
  - A show can be claimed only once. Otherwise the existing admin must invite you.
  - A "missing elements" error means asking your host to fill in fields such as cover art, title and description.
  - The full requirements are in "Podcast Delivery Specification v1.10", a PDF linked from providersupport.spotify.com. Its contents were not extracted.
- **Timing:** not stated on the pages read.
- **Gotchas:** host guides report "no email found" / "no author found" errors when those feed fields are empty (third-party). Third-party Spotify artwork figures were contradictory, so don't rely on them.

### support.google.com (YouTube / YouTube Music RSS ingestion) — separate submission; replaces Google Podcasts
- **Access** (2026-11-07, observed): help pages loaded.
- **Eligibility** (2026-11-07, observed): "RSS ingestion is available in select countries/regions." Page 14106258 lists about 98 countries/regions, including the US, UK, Canada, Germany, France, India, Japan, Brazil and most of the EU. The location "comes from the Channel Owner".
- **How** (2026-11-07, observed, answer 13525207):
  1. For an existing podcast: YouTube Studio → Content → Podcasts → Details → RSS settings → "Connect to RSS feed". A separate article covers new channels (not opened). A third-party report gives the path Create → New podcast → Submit RSS feed.
  2. Enter the verification code that YouTube emails to the address in the RSS feed.
- **Behaviour** (2026-11-07, observed):
  - YouTube makes a static-image video from the show art for each selected episode.
  - On the first submission, episodes upload as private; the page recommends waiting until all have uploaded before going public.
  - Default visibility for new episodes is configurable. New feed episodes upload automatically.
  - Episodes appear only on YouTube and YouTube Music.
- **Rules / gotchas** (2026-11-07, observed):
  - Branded content, sponsorships and endorsements must be declared.
  - No HTML or "<" ">" in titles or descriptions.
  - Show-detail changes in the feed are not applied automatically.
  - Changed audio needs "Re-upload from RSS feed", which creates a new video and sets the old one to private.
  - An episode deleted on YouTube re-uploads unless it is also removed from the feed.
- **Timing:** not stated.

### podcasters.amazon.com (Amazon Music + Audible) — separate submission; site not readable without JS
- **Access** (2026-11-07, observed): the plain fetch returned only the title "Amazon Music for Podcasters", with no content (JS-rendered). Blocker for automated reading.
- **How** (third-party, host help pages via search, 2026-11-07):
  1. Sign in with an Amazon account and paste the RSS URL.
  2. Amazon sends a verification email to the feed's address.
  3. Choose the show's primary country.
  - At least one published episode is needed.
- **Audible** (third-party): no separate Audible submission; shows accepted by Amazon Music also become available on Audible.
- **Timing** (third-party): "within 24 hours" to 24–48 h.
- **Echo** (third-party, Podnews): Echo's podcast directory uses Amazon Music.

### pocketcasts.com / support.pocketcasts.com — separate submission (or add via in-app search)
- **Access** (2026-11-07, observed): pocketcasts.com/submit returned **HTTP 403**. The support knowledge base loaded.
- **How** (2026-11-07, observed, support KB): use either the search bar in the apps or the Pocket Casts Submission Form. Both accept an RSS feed URL or an Apple Podcasts link.
- **Rules** (2026-11-07, observed): a feed with `itunes:block` set to Yes counts as private and won't appear in public search.
- **Timing:** officially "can take a little while". Third-party: up to 12 h (Springcast), 24 h to 2–3 days (Ausha).
- **Account:** not stated.

### overcast.fm — no submission; inherits from Apple
- **Access** (2026-11-07, observed): podcasterinfo page loaded.
- **Rules** (2026-11-07, observed):
  - "There's no separate submission process"; Apple's directory acts as Overcast's filter.
  - A show typically appears in Overcast search 1–2 days after its Apple listing. Missing shows can be added manually at overcast.fm/add.
  - Feeds behind HTTP Basic Auth, with `<itunes:block>`, or not known to be in Apple are excluded from search and recommendations.
  - Don't block crawl1–crawl6.overcast.fm. A ping API triggers an immediate crawl.
  - Link format: overcast.fm/itunes followed by the Apple ID.

### podcastindex.org — get in via host or Podnews; powers many independent apps
- **Access** (2026-11-07, observed): podcastindex.org/add returned **HTTP 403**. Blocker.
- **How** (third-party): paste the RSS URL on the Add Feed page. Podnews (podnews.net) says it adds missing shows to the Index itself when you search for the show there. Many hosts submit automatically. The API also supports adding by Apple ID (GitHub issue, third-party).
- **Role** (third-party, Podnews): powers many podcast apps and is used by more as a backup to the Apple API. No confirmed list of apps was found.

### www.iheart.com (iHeartRadio) — separate submission; human-only steps
- **Access** (2026-11-07, observed): iheart.com/content/submit-your-podcast returned **HTTP 403**. Blocker.
- **How** (third-party, host guides):
  1. Create or sign in to an iHeart account and choose "Add Your Podcast".
  2. Paste the RSS feed and pass a reCAPTCHA, then use "Verify Podcast RSS".
  3. Review the show details and accept the terms.
  - Needs at least one episode and a unique title. The feed email should be visible.
  - Some hosts (e.g. Buzzsprout, RSS.com) submit on the creator's behalf.
- **Timing** (third-party): a few days to a few weeks.

### Deezer (podcasters.deezer.com, not opened) — separate submission
- **How** (third-party, host guides): go to podcasters.deezer.com → "Publish My Podcast", paste the RSS URL, and enter the verification code sent to the feed email.
- **Rules** (third-party):
  - No M4A/AAC support (Podnews), so use MP3.
  - Deezer stops checking a feed 180 days after the last episode (Podnews, Tecnoblog).
  - 1400x1400 cover art (Tecnoblog).
- **Countries:** not found.

### Goodpods and Castbox — automatic from Apple; claim optional
- **Goodpods** (Spotify help-centre article about Goodpods, search snippet, 2026-11-07): automatically lists most shows that have been added to Apple Podcasts. A show not on Apple yet must be submitted there first.
- **Castbox** (third-party: Springcast, Podnews): shows submitted to Apple appear automatically, and suggesting a show via castbox.fm/help.html speeds it up. To claim (third-party, Buzzsprout): Castbox Creator Studio → Channels → "Claim Ownership", paste the RSS feed and the feed's email, then click the confirmation link. Claiming doesn't change hosting.

### podnews.net — best third-party overview (updated 2026-04-06)
- **Access** (2026-11-07, observed): loaded.
- **Other directories it lists, each needing its own submission:** Podcast Addict (podcastaddict.com/submit), TuneIn (broadcasters.tunein.com; used by Alexa and some Teslas), Pandora (US only, about 24 h; SiriusXM after Pandora), JioSaavn (yourcast.jiosaavn.com).
- **Pull from Apple:** Listen Notes, Player FM and Podchaser pull from Apple, and also take submissions.
- **Not mentioned:** the article does not mention the Google Podcasts shutdown.

## Dead ends
- **podcasters.apple.com/support/896-artwork-requirements:** an overview of placements only. The specs are on support/5514.
- **providersupport.spotify.com/article/podcast-delivery-specification-1-9:** a landing page that only links to the v1.10 PDF. No requirements are readable on the page itself.
- **podcasters.amazon.com:** JS-only shell to a plain fetch, with no requirements or timing readable.
- **Third-party "Spotify cover art" figures** (a podgorilla.pages.dev guide): contradict themselves (1400 min vs 3000 min, <512KB). Unreliable.
- **"Google Podcasts Manager":** no current information found. The Google Podcasts app shut down in 2024 (US 2024-04-02, rest of world 2024-06-24, subscription migration to July 2024; third-party: TechCrunch, Wikipedia, Android Authority).

## Prep checklist
- Public RSS 2.0 feed: UTF-8, itunes namespace, no password or Basic Auth, no `itunes:block` set to Yes.
- At least one published episode with a unique `<enclosure>` (url, length, type) and a permanent `<guid>`. Use MP3 (Deezer reportedly rejects M4A).
- Show art: square, 3000x3000 (1400 minimum), JPG/PNG, RGB, no alpha, no Apple logos.
- `<title>` without keyword stuffing; `<description>` of 4000 bytes or less; `<language>` as an ISO 639 code; one `itunes:category` (only the first counts); `itunes:explicit` true/false; `itunes:author`; `<link>`.
- `itunes:owner` / `itunes:email` set to an inbox you can read when submitting. This address is public in the feed; some hosts let you add it only temporarily.
- Host supports HTTP HEAD and byte-range requests, and ASCII-only file names.
- For YouTube: no HTML or angle brackets in titles or descriptions, sponsorships declared, and the channel's country is in the eligible list.
- Order: Apple → Spotify → YouTube → Amazon → Podcast Index (via host or Podnews) → Pocket Casts → iHeartRadio → Deezer → Podcast Addict, TuneIn and the rest as wanted.

## Needs a human
- **Accounts:** creating or signing in to the Apple Account / Podcasts Connect, Spotify, Google/YouTube channel, Amazon, iHeart, Deezer and Castbox accounts.
- **Verification:** reading the codes or confirmation links sent to the feed email (Spotify and YouTube per their help pages; Deezer, Castbox, Amazon and iHeart per third-party guides).
- **Declarations:** Apple's Content Rights declaration, and accepting platform terms (iHeart, Amazon, YouTube).
- **iHeart's reCAPTCHA.**
- **YouTube:** fixing the channel's country if it's wrong.

## Changelog
- 2026-11-07 — created (research run, nothing submitted). Blockers: 403 on pocketcasts.com/submit, podcastindex.org/add and iheart.com submit page; podcasters.amazon.com is JS-only.
- 2026-11-08 — reviewed (independent): re-confirmed Apple's artwork spec (3000x3000, 1400–3000 px for RSS, PNG/JPG, no transparency) and Spotify's 8-digit feed-email code; email verification for Deezer, Castbox and Amazon relabelled as third-party in the summary, TL;DR and Needs a human.
