# Headstones Open

Self-hosted AI resume profile. Add a `resume.md`, set some env vars, deploy anywhere.

---

## What you get

- Profile page at your domain with avatar, bio, and social links
- Full resume page rendered from `resume.md`
- AI chatbot backed by your resume (bring your own webhook)
- WebMCP tool so AI assistants can query your profile directly
- Schema.org `Person` structured data for AI discoverability
- `llms.txt`, `sitemap.xml`, and `robots.txt` generated from your config
- Static export — deploy to Netlify, Cloudflare Pages, GitHub Pages, Vercel, or any static host

---

## Quick start

```bash
git clone https://github.com/bmacmurray99/openheadstones
cd headstones-open
npm install

cp .env.example .env.local
# edit .env.local with your details

# edit resume.md with your resume content

npm run dev       # http://localhost:3000
npm run build     # outputs to out/
npm run preview   # serve the out/ directory locally
```

---

## Configuration

All configuration is done through environment variables. Copy `.env.example` to `.env.local` to get started.

### Identity

| Variable | Description |
|---|---|
| `DISPLAY_NAME` | Your full name |
| `HEADLINE` | Professional title or tagline |
| `BIO` | One or two sentence bio |
| `LOCATION` | City, Country |

### Links

| Variable | Description |
|---|---|
| `WEBSITE` | Personal website URL |
| `LINKEDIN_URL` | LinkedIn profile URL |
| `GITHUB_URL` | GitHub profile URL |
| `TWITTER_URL` | X (Twitter) profile URL |
| `BLUESKY_URL` | Bluesky profile URL |
| `MASTODON_URL` | Mastodon profile URL |
| `YOUTUBE_URL` | YouTube channel URL |
| `CALENDAR_URL` | Google Calendar appointment scheduling URL — renders a booking button |
| `AVATAR_URL` | Profile photo — a path from `/public` (e.g. `/avatar.jpg`) or any external image URL |

### Deployment

| Variable | Description |
|---|---|
| `SITE_DOMAIN` | Your full domain (e.g. `https://yourname.com`) — used in sitemaps and structured data |

### AI Chatbot

| Variable | Default | Description |
|---|---|---|
| `CHATBOT_ENABLED` | `false` | Set to `true` to show the chatbot on your profile |
| `CHATBOT_WEBHOOK_URL` | — | Webhook endpoint that receives chat messages |
| `CHATBOT_SEND_RESUME_CONTEXT` | `true` | Set to `false` if you run your own RAG pipeline and don't want `resume.md` sent with every request |
| `CHATBOT_GATE` | `false` | Set to `true` to require name + email before chatting |
| `CHATBOT_GATE_FORM_URL` | — | Optional webhook to receive gate form submissions (name, email, company) |

The chatbot sends a `multipart/form-data` POST with `chatInput`, `sessionId`, optionally `resumeContext`, and optionally `gateIdentity`. It expects a JSON response with an `output`, `response`, or `text` field.

#### Gate

Set `CHATBOT_GATE=true` to show an identification form before visitors can open the chat. The form collects:

| Field | Required |
|---|---|
| Name | Yes |
| Email | Yes |
| Company | No |

The visitor's name is sent to the chat webhook as `gateIdentity` with every message.

Set `CHATBOT_GATE_FORM_URL` to a webhook URL (e.g. n8n, Make, or a CRM endpoint) to receive the form submission as `multipart/form-data` with `name`, `email`, and `company` fields. The POST is fire-and-forget — a failed submission does not block the visitor from chatting.

---

## Blog

Set `BLOG_ENABLED=true` and create a `posts/` directory at the project root with Markdown files. Each file becomes a post at `/blog/[slug]`. A **Blog** link appears in your profile navigation when the flag is set and at least one post exists.

| Variable | Default | Description |
|---|---|---|
| `BLOG_ENABLED` | `false` | Set to `true` to enable the blog |

When the blog is disabled (or enabled but empty), `/blog` is excluded from `robots.txt` and carries a `noindex` meta tag.

Each post file supports optional frontmatter:

```markdown
---
title: My Post Title
date: 2026-04-10
description: A short summary shown in the post list.
image: /posts/my-post-cover.jpg
breadcrumb: Short Title
---

Post content in standard Markdown...
```

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Post title — shown in the list, post header, and page `<title>` |
| `date` | Recommended | Publication date in `YYYY-MM-DD` format |
| `description` | Recommended | Short summary shown in the post list and meta description |
| `image` | Recommended | Cover image — path from `/public` (e.g. `/posts/cover.jpg`) or any URL. Used in `og:image` and `BlogPosting` structured data. Falls back to `AVATAR_URL` if omitted. Google requires an image for rich result eligibility. |
| `breadcrumb` | No | Override the label shown in the breadcrumb trail. Defaults to `title`. Useful when the title is long. |

Filename becomes the URL slug: `posts/my-first-post.md` → `/blog/my-first-post`.

Place post images in `public/posts/` to keep them organized alongside the posts that reference them.

---

## Resume

Edit `resume.md` with standard Markdown. The file is used in three places:

- Rendered as HTML on the `/resume` page
- Sent as context with each chatbot message (if `CHATBOT_SEND_RESUME_CONTEXT=true`)
- Included in `llms.txt` for AI agent discovery

---

## Avatar

Place your photo in the `public/` directory and set `AVATAR_URL=/your-photo.jpg`. If no avatar is set, the profile page shows your initials.

---

## Deployment

The build outputs a fully static site to `out/`. Deploy that directory anywhere:

- **Netlify / Cloudflare Pages** — connect your repo, set build command to `npm run build`, output directory to `out`
- **GitHub Pages** — push `out/` or use a GitHub Action
- **Vercel** — set framework to Next.js; static export is handled automatically
- **Any static host** — just upload the `out/` directory

Set your environment variables in your host's dashboard. Variables are baked in at build time.

---

## Overriding generated files

`llms.txt` and `robots.txt` are generated automatically from your config. To supply your own version of either, place a file with that name in the project root:

```
llms.txt       # overrides the generated /llms.txt
robots.txt     # overrides the generated /robots.txt
```

If the file exists at build time it is used as-is; the generated version is ignored. The override files are picked up the same way as `resume.md` — no extra configuration needed.

---

## Chatbot webhook

The chatbot posts to `CHATBOT_WEBHOOK_URL` with:

```
POST <your-webhook-url>
Content-Type: multipart/form-data

chatInput      The user's message
sessionId      A random session identifier for conversation continuity
resumeContext  Full contents of resume.md (omitted if CHATBOT_SEND_RESUME_CONTEXT=false)
gateIdentity   Visitor's name from the gate form (omitted if CHATBOT_GATE=false)
```

Expected response:

```json
{ "output": "..." }
```

Any of `output`, `response`, or `text` fields are accepted. Compatible with n8n, Make, Zapier, and any custom webhook handler.

