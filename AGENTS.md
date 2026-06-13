# openheadstones — Technical Reference for AI Agents

## What this project is

openheadstones is a self-hosted, single-user AI resume profile site. The owner deploys it once, configures it via environment variables, and it generates a static site with:

- A public profile page with avatar, bio, and social links
- An optional AI chatbot backed by a webhook (e.g. n8n)
- An optional calendar booking embed (e.g. Google Calendar)
- An optional Markdown blog
- A `/resume` page (only when chatbot is enabled)
- Schema.org structured data + `llms.txt` for AI discoverability
- A generated `robots.txt` and `sitemap.xml`

All pages are statically exported (`output: 'export'` in `next.config.ts`). There is no database, no auth, and no server runtime. Feature flags are baked in at build time via environment variables.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript (strict) |
| Styling | Vanilla CSS, split by feature (see CSS Architecture below) |
| Blog | File-based Markdown (`posts/` directory, custom frontmatter parser) |
| Resume | Single `resume.md` file at project root |
| Output | `out/` directory — deployable to any static host |

---

## Project layout

```
openheadstones/
  resume.md                         Single resume file (Markdown)
  posts/                            Blog posts (Markdown with frontmatter)
  public/
    avatar.svg                      Default avatar (replace with AVATAR_URL env var)
    llms.txt                        AI discoverability descriptor
  src/
    app/
      layout.tsx                    Root layout — skip link, globals.css import
      globals.css                   Base styles only (reset, profile page, shared nav)
      page.tsx                      Homepage — profile hero, chatbot/calendar shell, inline resume
      resume/
        page.tsx                    Resume page (only rendered when CHATBOT_ENABLED=true)
        resume.css                  Resume page styles (imported here, not in globals)
      blog/
        layout.tsx                  Blog layout — imports blog.css for all blog routes
        blog.css                    Blog + post page styles
        page.tsx                    Blog listing
        [slug]/page.tsx             Individual post
      robots.txt/route.ts           Dynamic robots.txt (respects BLOG_ENABLED + post count)
      sitemap.xml/route.ts          Sitemap
      llms.txt/route.ts             llms.txt route
    components/
      ProfileClientShell.tsx        'use client' — dynamic() wrapper for chatbot + calendar
      Chatbot.tsx                   'use client' — chat UI; imports Chatbot.css
      Chatbot.css                   Chatbot UI styles (only loads when chatbot renders)
      CalendarEmbed.tsx             'use client' — Google Calendar embed
      WebMCPTools.tsx               'use client' — WebMCP tool registration
      ResumeMarkdown.tsx            'use client' — Markdown renderer; imports ResumeMarkdown.css
      ResumeMarkdown.css            resume-markdown styles (used on homepage, /resume, blog posts)
      SchemaLD.tsx                  Server — Schema.org JSON-LD
      BlogSchema.tsx                Server — Blog/Article JSON-LD
    lib/
      posts.ts                      getAllPosts(), getPost(slug) — reads from posts/ directory
      resolve-image.ts              Resolves AVATAR_URL (absolute or relative)
```

---

## Feature flags

All flags follow the opt-in pattern (`=== 'true'`). Missing or any other value means disabled.

| Variable | Effect when `true` |
|---|---|
| `CHATBOT_ENABLED` | Shows chatbot on homepage; enables `/resume` page |
| `BLOG_ENABLED` | Shows blog link on homepage; enables `/blog` and `/blog/[slug]`; requires posts in `posts/` |

### Rules for feature-gated code

- **Homepage nav links**: Only render `<a href="/resume">` when `CHATBOT_ENABLED=true`. Only render `<a href="/blog">` when `BLOG_ENABLED=true` AND posts exist.
- **Page guards**: `resume/page.tsx` calls `notFound()` if chatbot is disabled. `blog/[slug]/page.tsx` calls `notFound()` if blog is disabled.
- **`generateStaticParams`**: `blog/[slug]` returns `[]` if `BLOG_ENABLED !== 'true'`, preventing static generation of post pages.
- **robots.txt**: Disallows `/blog` when blog is inactive (disabled or no posts).

---

## CSS architecture

Styles are split by feature so only the CSS needed for a given route is loaded.

| File | Loaded on |
|---|---|
| `globals.css` | Every page (base reset, profile page, skip link, shared nav) |
| `Chatbot.css` | Pages that render the Chatbot component (chatbot enabled only) |
| `ResumeMarkdown.css` | Homepage, `/resume`, blog posts (via ResumeMarkdown component) |
| `resume/resume.css` | `/resume` route only |
| `blog/blog.css` | `/blog` and `/blog/*` routes (via blog layout) |

**Do not add feature-specific styles to `globals.css`.** Add them to the appropriate feature CSS file.

---

## Blog system

Posts are `.md` files in the `posts/` directory at the project root.

**Frontmatter fields** (parsed by `src/lib/posts.ts` — no external library):

```markdown
---
title: My Post Title
date: 2025-01-15
description: Optional summary shown on the listing page
image: /path/to/image.jpg   # optional, used for OG image
breadcrumb: Short Label      # optional, shown in breadcrumb instead of title
---

Post content here...
```

- `getAllPosts()` returns posts sorted newest-first, skipping drafts (no `date` field)
- `getPost(slug)` returns the full post including `content`
- Slug is derived from the filename (without `.md`)

---

## Accessibility conventions

Every page must have:
- A `<main id="main-content">` as the primary content wrapper
- The skip link in `layout.tsx` targets `#main-content` on every page
- `<nav>` elements with multiple instances on a page must have `aria-label`

---

## Critical rules

### 1. Static export — no server APIs
There is no server runtime. Do not add API routes that require a Node.js server. `route.ts` files must export `export const dynamic = 'force-static'`.

### 2. Environment variables are build-time
Feature flags are evaluated at build time. Changing an env var requires a rebuild. Do not use `useState` or client-side env var checks to toggle features.

### 3. Blog requires both flag AND posts
`BLOG_ENABLED=true` alone is not enough — the blog link only appears if there are also posts in the `posts/` directory. Check both conditions anywhere blog activation is evaluated:
```ts
const blogActive = process.env.BLOG_ENABLED === 'true' && getAllPosts().length > 0
```

### 4. `notFound()` for disabled pages
When a feature flag is off, the corresponding page returns `notFound()` (not a redirect). This produces a 404 at the route, which crawlers will not index.

### 5. After any change
`npm run build` must pass with zero errors before committing. This project uses Turbopack.

---

## Environment variables

```
# Identity
DISPLAY_NAME          Your full name
HEADLINE              One-line professional headline
BIO                   Short bio shown on homepage
LOCATION              City, Country
WEBSITE               Personal website URL
AVATAR_URL            Avatar image URL (absolute) or path (relative to public/)

# Social links
LINKEDIN_URL
GITHUB_URL
TWITTER_URL
BLUESKY_URL
MASTODON_URL
YOUTUBE_URL

# Site
SITE_DOMAIN           Full URL e.g. https://yourname.com (used in sitemap + OG tags)

# Chatbot (optional)
CHATBOT_ENABLED       Set to true to enable chatbot and /resume page
CHATBOT_WEBHOOK_URL   n8n (or other) webhook endpoint
CHATBOT_SEND_RESUME_CONTEXT  Default true; set to false to omit resume from chat context
CHATBOT_GATE          Set to true to require name/email before chatting
CHATBOT_GATE_FORM_URL Optional form endpoint to receive gate submissions

# Calendar (optional)
CALENDAR_URL          Google Calendar scheduling URL

# Blog (optional)
BLOG_ENABLED          Set to true to enable blog (also requires posts/ directory with .md files)
```
