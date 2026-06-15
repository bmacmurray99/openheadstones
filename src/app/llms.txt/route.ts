export const dynamic = 'force-static'

import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const overridePath = join(process.cwd(), 'llms.txt')
  if (existsSync(overridePath)) {
    const content = readFileSync(overridePath, 'utf-8')
    return new NextResponse(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }

  const name = process.env.DISPLAY_NAME || 'Your Name'
  const headline = process.env.HEADLINE
  const bio = process.env.BIO
  const base = (process.env.SITE_DOMAIN || '').replace(/\/$/, '')

  const chatbotEnabled = process.env.CHATBOT_ENABLED === 'true'
  const webhookUrl = process.env.CHATBOT_WEBHOOK_URL
  const calendarUrl = process.env.CALENDAR_URL
  const linkedinUrl = process.env.LINKEDIN_URL
  const githubUrl = process.env.GITHUB_URL
  const twitterUrl = process.env.TWITTER_URL
  const blueskyUrl = process.env.BLUESKY_URL
  const mastodonUrl = process.env.MASTODON_URL
  const youtubeUrl = process.env.YOUTUBE_URL
  const website = process.env.WEBSITE

  const posts = getAllPosts()
  const hasBlog = posts.length > 0

  const resume = readFileSync(join(process.cwd(), 'public', 'resume.md'), 'utf-8')

  const lines: string[] = []

  // Header
  lines.push(`# ${name}${headline ? ` — ${headline}` : ''}`)
  if (bio) lines.push('', `> ${bio}`)

  // Pages
  lines.push('', '## Pages', '')
  lines.push(`- [Profile](${base}/): Professional profile${chatbotEnabled ? ' with AI assistant' : ''}`)
  lines.push(`- [Resume](${base}/resume): Full professional resume`)
  if (hasBlog) {
    lines.push(`- [Blog](${base}/blog): Writing and articles`)
    for (const post of posts) {
      lines.push(`  - [${post.title}](${base}/blog/${post.slug})${post.description ? ` — ${post.description}` : ''}`)
    }
  }

  // AI interaction
  if (chatbotEnabled && webhookUrl) {
    lines.push('', '## AI Assistant', '')
    lines.push(`An AI assistant is available at the profile page. It can answer questions about ${name}'s experience, skills, projects, and availability.`)
    lines.push('', `To interact programmatically, POST to the webhook with \`chatInput\` and \`sessionId\` as multipart/form-data.`)
    lines.push(`A WebMCP tool \`ask${name.replace(/\s+/g, '')}\` is also registered on the profile page for direct AI agent integration.`)
  }

  // Social / links
  const socialLinks = [
    linkedinUrl && `- LinkedIn: ${linkedinUrl}`,
    githubUrl && `- GitHub: ${githubUrl}`,
    twitterUrl && `- X: ${twitterUrl}`,
    blueskyUrl && `- Bluesky: ${blueskyUrl}`,
    mastodonUrl && `- Mastodon: ${mastodonUrl}`,
    youtubeUrl && `- YouTube: ${youtubeUrl}`,
    website && `- Website: ${website}`,
    calendarUrl && `- Book a meeting: ${calendarUrl}`,
  ].filter(Boolean)

  if (socialLinks.length > 0) {
    lines.push('', '## Links', '', ...(socialLinks as string[]))
  }

  // Resume content
  lines.push('', '---', '', resume)

  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
