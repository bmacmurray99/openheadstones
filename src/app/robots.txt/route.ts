export const dynamic = 'force-static'

import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const overridePath = join(process.cwd(), 'robots.txt')
  if (existsSync(overridePath)) {
    const content = readFileSync(overridePath, 'utf-8')
    return new NextResponse(content, { headers: { 'Content-Type': 'text/plain' } })
  }

  const base = (process.env.SITE_DOMAIN || '').replace(/\/$/, '')
  const blogActive = process.env.BLOG_ENABLED === 'true' && getAllPosts().length > 0
  const disallow = blogActive ? '' : 'Disallow: /blog\n'
  const content = `User-agent: *\nAllow: /\n${disallow}\nSitemap: ${base}/sitemap.xml\n`
  return new NextResponse(content, { headers: { 'Content-Type': 'text/plain' } })
}
