# Website Improvement Plan — نبض الذكاء (AI News Arabic)

## Top-Level Overview

**Goal:** Improve the "نبض الذكاء" Astro static website across four dimensions: bug fixes, UX/engagement, SEO/structured data, and performance. The site is an Arabic-language AI news aggregator using Astro 5, Tailwind CSS, Pagefind search, and a Gemini-powered daily ingest pipeline.

**Scope:** Frontend pages and components only. No changes to the ingest pipeline (`scripts/`), no new dependencies unless essential. All work is surgical edits to existing files.

**Approach:** Six independent sub-tasks, ordered from highest-impact/lowest-risk to lowest-impact. Each sub-task is self-contained and can be reviewed individually before moving to the next.

---

## Sub-Task 1 — Fix Critical Bugs

**Status:** [x] done

### Intent
Fix confirmed bugs that cause invalid HTML, broken markup, or silent failures that affect reliability.

### Expected Outcomes
- The HTML `DOCTYPE` declaration is valid and correctly spelled.
- The `toolsMentioned` field on article pages links to the corresponding tool detail pages (the field is currently rendered as plain unlinked text with no `/tools/[slug]` resolution).
- The `toolsMentioned` plain-text chips in `[...slug].astro` become clickable links when a matching tool slug exists.

### Todo List
1. In [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro:24), fix line 24: change `<!dnctype html>` → `<!DOCTYPE html>`.
2. In [`src/pages/news/[...slug].astro`](src/pages/news/[...slug].astro), at the frontmatter block, fetch the tools collection and build a `slug → tool` map.
3. In the `toolsMentioned` rendering section (~line 108–116), replace plain `<span>` chips with `<a href="/tools/[slug]">` when a matching tool name is found in the map; fall back to plain span if no match exists.

### Relevant Context
- [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro:24) — line 24 has the DOCTYPE typo.
- [`src/pages/news/[...slug].astro`](src/pages/news/[...slug].astro:108) — lines 108–116 render `toolsMentioned` as unlinked spans.
- [`src/content/config.ts`](src/content/config.ts) — tools collection schema; tool `name` field can be matched case-insensitively against `toolsMentioned` entries.

---

## Sub-Task 2 — Add Pagination to the News Archive

**Status:** [x] done

### Intent
The `/news` archive currently renders all articles in a single grid with no pagination. As the daily ingest adds ~10–20 articles per day, the page will grow unbounded. Adding static pagination keeps page weight constant and improves perceived performance.

### Expected Outcomes
- The `/news` page shows the first 18 articles.
- A pagination bar at the bottom links to `/news/2`, `/news/3`, etc.
- Each paginated page shows the correct slice of sorted articles with "Previous / Next" navigation.
- The `/news` URL remains canonical for page 1 (i.e., `/news` and `/news/1` both work).

### Todo List
1. Convert [`src/pages/news/index.astro`](src/pages/news/index.astro) to a paginated route by renaming/replacing it with `src/pages/news/[...page].astro` using Astro's built-in `paginate()` helper from `astro:content`.
2. Set page size to 18 (fills a 3-column grid evenly with 6 rows).
3. Add a pagination control component inline or as a new `Pagination.astro` component — renders page numbers, prev/next links, using the `page.url.prev` / `page.url.next` values from Astro's `paginate()`.
4. Ensure the first page (`/news`) does not redirect — Astro's `paginate()` supports a `params: { page: undefined }` entry for page 1 at the root path.
5. Apply consistent RTL-aware arrow directions on prev/next controls (since the site is `dir="rtl"`, "prev" is visually on the right).

### Relevant Context
- [`src/pages/news/index.astro`](src/pages/news/index.astro) — current archive, no pagination.
- Astro docs pattern: `export async function getStaticPaths({ paginate })` with `paginate(items, { pageSize })`.
- [`src/components/CategoryFilter.astro`](src/components/CategoryFilter.astro) — already present on this page, should remain above the grid.

---

## Sub-Task 3 — Add JSON-LD Structured Data (Article + WebSite schemas)

**Status:** [x] done

### Intent
The site has solid OG/Twitter meta tags but lacks JSON-LD structured data. Adding `Article` schema to news pages and `WebSite` schema with `SearchAction` to the homepage will improve Google rich result eligibility and Arabic search engine indexability.

### Expected Outcomes
- Every news article page (`/news/[slug]`) emits a valid JSON-LD `NewsArticle` object in `<head>`.
- The homepage (`/`) emits a `WebSite` JSON-LD object with a `SearchAction` pointing to `/search?q={search_term_string}` (Pagefind compatible).
- No changes to visible UI.

### Todo List
1. In [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro), add an optional `structuredData` prop (accepts a serialized JSON string).
2. When `structuredData` is provided, inject `<script type="application/ld+json">{structuredData}</script>` inside `<head>`, after the Twitter meta tags.
3. In [`src/pages/news/[...slug].astro`](src/pages/news/[...slug].astro), build a `NewsArticle` JSON-LD object using: `headline` (title), `description` (summary), `datePublished` (publishedAt ISO string), `publisher.name` (sourceName), `url` (canonical URL), `image` (if present), and pass it to the layout.
4. In [`src/pages/index.astro`](src/pages/index.astro), build a `WebSite` JSON-LD object with `name`, `url`, `description`, `inLanguage: "ar"`, and a `SearchAction` potentialAction.
5. Validate both schemas produce valid JSON (no Arabic quote characters breaking JSON syntax).

### Relevant Context
- [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro) — Props interface and `<head>` block.
- [`src/pages/news/[...slug].astro`](src/pages/news/[...slug].astro:19) — all required fields already destructured on line 19.
- [`src/pages/index.astro`](src/pages/index.astro) — homepage, best place for WebSite schema.

---

## Sub-Task 4 — Improve Mobile Navigation (Hamburger Menu)

**Status:** [x] done

### Intent
The desktop nav is a rounded pill that is hidden on mobile (`hidden md:flex`). On mobile, no navigation links are visible — only the search button and newsletter CTA. Users on mobile have no way to navigate to `/news`, `/tools`, or `/about` without typing the URL. This is a critical UX gap.

### Expected Outcomes
- A hamburger menu button appears on mobile (left side of header, since layout is RTL).
- Tapping it reveals a dropdown/drawer with the same 4 nav links.
- Active link is highlighted consistently with the desktop style.
- Menu closes when a link is tapped.
- No new JavaScript framework — use a minimal `<details>` + `<summary>` pattern or a small inline `<script>` toggle.

### Todo List
1. In [`src/components/Header.astro`](src/components/Header.astro), add a hamburger `<button>` visible only on mobile (`md:hidden`), placed in the actions div or as a separate flex item.
2. Add a mobile nav drawer `<div>` below the main header bar, hidden by default (`hidden`), containing the same `navLinks` list.
3. Add a small inline `<script>` (vanilla JS, ~5 lines) that toggles a CSS class on the drawer when the button is clicked.
4. Style the mobile drawer consistently: `glass-card` styling, full-width below header, link items using the same active/hover classes as desktop.
5. Add `aria-expanded` attribute toggling on the button for accessibility.

### Relevant Context
- [`src/components/Header.astro`](src/components/Header.astro:30) — desktop nav starts at line 30 with `hidden md:flex`.
- [`src/components/Header.astro`](src/components/Header.astro:49) — actions div starts at line 49.
- Design system: `glass-card`, `neon-cyan` active style, RTL layout (`dir="rtl"`).

---

## Sub-Task 5 — Improve RSS Feed with Media RSS Extension

**Status:** [x] done

### Intent
The current RSS feed uses non-standard `customData` XML for images (`<sourceUrl>`, `<sourceName>`, `<category>`). RSS readers and feed aggregators use the standard `<media:content>` element (Media RSS namespace) for images. This improves compatibility with Feedly, Inoreader, and other Arabic RSS consumers.

### Expected Outcomes
- The RSS feed at `/rss.xml` includes the `xmlns:media` namespace declaration.
- Each item with an `image` field includes a `<media:content url="..." medium="image"/>` element.
- Each item includes `<media:title>` and `<media:description>` elements.
- Non-standard `<sourceUrl>` / `<sourceName>` / `<category>` custom tags are kept (backward compatible) or replaced with standard `<category>` RSS element.

### Todo List
1. In [`src/pages/rss.xml.ts`](src/pages/rss.xml.ts), update the `customData` field on the feed level to include `xmlns:media="http://search.yahoo.com/mrss/"` (note: in `@astrojs/rss`, the feed-level `customData` is the place for this).
2. For each item, replace or augment `customData` to include `<media:content url="${item.data.image}" medium="image"/>` when `image` is defined, plus `<media:title>`, `<media:description>`.
3. Replace the non-standard `<sourceUrl>` custom tag with the standard `<source url="...">` RSS 2.0 element where possible.
4. Replace the non-standard `<category>` custom tag with the proper RSS `<category>` element (supported natively in `@astrojs/rss` via the `categories` field on each item).

### Relevant Context
- [`src/pages/rss.xml.ts`](src/pages/rss.xml.ts) — current feed implementation, all items and custom data.
- `@astrojs/rss` supports `categories: string[]` per item natively.

---

## Sub-Task 6 — Add Privacy-Respecting Analytics (Umami or Plausible)

**Status:** [x] done

### Intent
The site has no analytics at all. Without metrics, there is no way to know which articles are most read, where traffic comes from, or whether the daily automation is driving engagement. Adding a lightweight, privacy-respecting, GDPR-compliant analytics script (Umami or Plausible) aligns with the site's "no ads, free, transparent" ethos.

### Expected Outcomes
- A single analytics `<script>` tag is injected in `<head>` in [`BaseLayout.astro`](src/layouts/BaseLayout.astro).
- The script is only injected when the `PUBLIC_ANALYTICS_URL` and `PUBLIC_ANALYTICS_SITE_ID` environment variables are set, so it is a no-op in local development.
- No cookie banner required (Plausible and Umami are cookieless).
- No visible UI changes.

### Todo List
1. In [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro), read `import.meta.env.PUBLIC_ANALYTICS_URL` and `import.meta.env.PUBLIC_ANALYTICS_SITE_ID` in the frontmatter.
2. Add a conditional `<script>` tag in `<head>` that renders only when both env vars are present — using the standard Plausible/Umami script format: `<script defer data-domain={siteId} src={analyticsUrl}></script>`.
3. Document the two env vars with a comment in the layout explaining which analytics provider they support.
4. Add the two env vars to the `.env.example` file (or create it if absent) with placeholder values and a comment.

### Relevant Context
- [`src/layouts/BaseLayout.astro`](src/layouts/BaseLayout.astro) — the single layout wrapping every page; the correct injection point.
- Plausible self-hosted script format: `<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>`
- Umami script format: `<script async src="..." data-website-id="..."></script>`
- Both are cookieless, require no consent banner, and are compatible with static Astro sites.
