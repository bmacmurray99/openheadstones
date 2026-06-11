export const dynamic = 'force-static'

import { NextResponse } from 'next/server'

export async function GET() {
  const base = (process.env.SITE_DOMAIN || '').replace(/\/$/, '')
  const now = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><lastmod>${now}</lastmod><priority>1.0</priority></url>
  <url><loc>${base}/resume</loc><lastmod>${now}</lastmod><priority>0.8</priority></url>
</urlset>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
