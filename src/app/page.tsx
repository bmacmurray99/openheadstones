import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'
import SchemaLD from '@/components/SchemaLD'
import ProfileClientShell from '@/components/ProfileClientShell'
import ResumeMarkdown from '@/components/ResumeMarkdown'
import { getAllPosts } from '@/lib/posts'
import { resolveImage } from '@/lib/resolve-image'

function env(key: string, fallback = '') {
  return process.env[key] || fallback
}

function toolName(name: string) {
  return `ask${name.replace(/\s+(.)/g, (_, c: string) => c.toUpperCase()).replace(/^\w/, (c: string) => c.toUpperCase())}`
}

export function generateMetadata(): Metadata {
  const name = env('DISPLAY_NAME', 'Your Name')
  const bio = env('BIO')
  const headline = env('HEADLINE')
  const domain = env('SITE_DOMAIN', 'https://yourname.com')
  const imageUrl = resolveImage(env('AVATAR_URL') || undefined, domain)
  return {
    title: name,
    description: bio || headline || `${name}'s professional profile`,
    openGraph: {
      title: name,
      description: bio || headline || undefined,
      type: 'profile',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default function ProfilePage() {
  const name = env('DISPLAY_NAME', 'Your Name')
  const headline = env('HEADLINE')
  const bio = env('BIO')
  const location = env('LOCATION')
  const website = env('WEBSITE')
  const linkedinUrl = env('LINKEDIN_URL')
  const githubUrl = env('GITHUB_URL')
  const twitterUrl = env('TWITTER_URL')
  const blueskyUrl = env('BLUESKY_URL')
  const mastodonUrl = env('MASTODON_URL')
  const youtubeUrl = env('YOUTUBE_URL')
  const calendarUrl = env('CALENDAR_URL')
  const avatarUrl = env('AVATAR_URL')
  const domain = env('SITE_DOMAIN', 'https://yourname.com')
  const blogEnabled = env('BLOG_ENABLED') === 'true'
  const hasBlog = blogEnabled && getAllPosts().length > 0
  const chatbotEnabled = env('CHATBOT_ENABLED') === 'true'
  const chatbotWebhookUrl = env('CHATBOT_WEBHOOK_URL')
  const chatbotGateEnabled = env('CHATBOT_GATE') === 'true'
  const chatbotGateFormUrl = env('CHATBOT_GATE_FORM_URL')
  const resumeMarkdown = readFileSync(join(process.cwd(), 'resume.md'), 'utf-8')
  const sendResumeContext = env('CHATBOT_SEND_RESUME_CONTEXT', 'true') !== 'false'
  const resumeContext = sendResumeContext ? resumeMarkdown : ''
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')

  return (
    <>
      <SchemaLD
        name={name}
        headline={headline || undefined}
        bio={bio || undefined}
        website={website || undefined}
        linkedinUrl={linkedinUrl || undefined}
        githubUrl={githubUrl || undefined}
        twitterUrl={twitterUrl || undefined}
        blueskyUrl={blueskyUrl || undefined}
        mastodonUrl={mastodonUrl || undefined}
        youtubeUrl={youtubeUrl || undefined}
        avatarUrl={avatarUrl || undefined}
        domain={domain}
      />

      <main id="main-content" className="profile-page">
        <header className="profile-hero">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={name} className="profile-avatar" fetchPriority="high" />
          ) : (
            <div className="profile-avatar-initials" aria-hidden="true">{initials}</div>
          )}
          <h1>{name}</h1>
          {headline && <p className="profile-headline">{headline}</p>}
          {location && <p className="profile-location">{location}</p>}
          <div className="profile-links">
            {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {githubUrl && <a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
            {twitterUrl && <a href={twitterUrl} target="_blank" rel="noopener noreferrer">X</a>}
            {blueskyUrl && <a href={blueskyUrl} target="_blank" rel="noopener noreferrer">Bluesky</a>}
            {mastodonUrl && <a href={mastodonUrl} target="_blank" rel="noopener noreferrer">Mastodon</a>}
            {youtubeUrl && <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</a>}
            {website && <a href={website} target="_blank" rel="noopener noreferrer">Website</a>}
            {chatbotEnabled && <a href="/resume">Resume</a>}
            {hasBlog && <a href="/blog">Blog</a>}
          </div>
        </header>

        <ProfileClientShell
          displayName={name}
          calendarUrl={calendarUrl || undefined}
          chatbotEnabled={chatbotEnabled}
          chatbotWebhookUrl={chatbotWebhookUrl || undefined}
          toolName={toolName(name)}
          resumeContext={resumeContext}
          gateEnabled={chatbotGateEnabled || undefined}
          gateFormUrl={chatbotGateFormUrl || undefined}
        />

        {!chatbotEnabled && (
          <section className="resume-inline">
            <ResumeMarkdown content={resumeMarkdown} />
          </section>
        )}
      </main>

      <footer className="profile-footer">
        <a href="https://github.com/headstones-app/headstones-open" className="powered-by">Headstones</a>
      </footer>
    </>
  )
}
