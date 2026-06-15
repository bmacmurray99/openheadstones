# About This Site

This site is built on **openheadstones** — an open-source personal website framework designed for professionals who want a high-performance, AI-ready profile with minimal overhead.

## Technology

Headstones prioritizes simplicity and performance, so everything is rendered into static HTML pages using NextJS  to build a personal resume website dynamically. React is used only where interactivity is required; everything else is pre-rendered at build time.

Styling uses vanilla CSS, split by feature so only the styles needed for the current page are loaded.

## Performance

The site is optimised for Core Web Vitals (CrUX). Lighthouse scores consistently near 100 across performance, accessibility, best practices, and SEO.

## AI Accessibility

The site is built to be as readable to AI agents as it is to humans:

- `llms.txt` served at `/llms.txt` — a structured plain-text summary of the site owner for AI discovery
- `resume.md` served at `/resume.md` — the full resume in Markdown for direct access by crawlers and agents
- Schema.org `Person` and `BlogPosting` structured data embedded as JSON-LD on every relevant page
- WebMCP tool registration — AI assistants with WebMCP support can query the owner's AI chatbot directly from the browser without user input
- The chatbot gate exposes an `identify` WebMCP tool so AI agents can introduce themselves and unlock the chat programmatically

## Features

- Profile page with avatar, bio, headline, location, and social links
- AI chatbot backed by a webhook (n8n, Make, or any HTTP endpoint) with optional resume context
- Visitor gate form — collects name, email, and company before the chat opens
- Calendar booking embed for scheduling
- Markdown blog with per-post Open Graph images, breadcrumbs, and structured data
- Resume page rendered from a single Markdown file
- Auto-generated `sitemap.xml`, `robots.txt`, and `llms.txt`

## Configuration

Everything is configured through environment variables and plain Markdown files.
