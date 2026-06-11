import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'
import SchemaLD from '@/components/SchemaLD'
import ResumeMarkdown from '@/components/ResumeMarkdown'
import ProfileClientShell from '@/components/ProfileClientShell'
import { resolveImage } from '@/lib/resolve-image'

function env(key: string, fallback = '') {
  return process.env[key] || fallback
}

export function generateMetadata(): Metadata {
  const name = env('DISPLAY_NAME', 'Your Name')
  const headline = env('HEADLINE')
  const domain = env('SITE_DOMAIN', 'https://yourname.com')
  const imageUrl = resolveImage(env('AVATAR_URL') || undefined, domain)
  return {
    title: `${name} — Resume`,
    description: `Professional resume for ${name}${headline ? `, ${headline}` : ''}`,
    openGraph: {
      title: `${name} — Resume`,
      description: `Professional resume for ${name}${headline ? `, ${headline}` : ''}`,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default function ResumePage() {
  const name = env('DISPLAY_NAME', 'Your Name')
  const headline = env('HEADLINE')
  const location = env('LOCATION')
  const website = env('WEBSITE')
  const linkedinUrl = env('LINKEDIN_URL')
  const githubUrl = env('GITHUB_URL')
  const twitterUrl = env('TWITTER_URL')
  const blueskyUrl = env('BLUESKY_URL')
  const mastodonUrl = env('MASTODON_URL')
  const youtubeUrl = env('YOUTUBE_URL')
  const avatarUrl = env('AVATAR_URL')
  const calendarUrl = env('CALENDAR_URL')
  const domain = env('SITE_DOMAIN', 'https://yourname.com')

  const content = readFileSync(join(process.cwd(), 'resume.md'), 'utf-8')

  return (
    <>
      <SchemaLD
        name={name}
        headline={headline || undefined}
        website={website || undefined}
        linkedinUrl={linkedinUrl || undefined}
        githubUrl={githubUrl || undefined}
        twitterUrl={twitterUrl || undefined}
        blueskyUrl={blueskyUrl || undefined}
        mastodonUrl={mastodonUrl || undefined}
        youtubeUrl={youtubeUrl || undefined}
        avatarUrl={avatarUrl || undefined}
        domain={domain}
        pagePath="/resume"
        pageType="WebPage"
        pageTitle={`${name} — Resume`}
      />
      <div className="resume-page">
        <nav className="resume-nav">
          <a href="/">← {name}</a>
        </nav>
        <header className="resume-header">
          <h1>{name}</h1>
          {headline && <p className="resume-headline">{headline}</p>}
          <div className="resume-contact">
            {location && <span>{location}</span>}
            {website && <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>}
            {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {githubUrl && <a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
            {twitterUrl && <a href={twitterUrl} target="_blank" rel="noopener noreferrer">X</a>}
            {blueskyUrl && <a href={blueskyUrl} target="_blank" rel="noopener noreferrer">Bluesky</a>}
            {mastodonUrl && <a href={mastodonUrl} target="_blank" rel="noopener noreferrer">Mastodon</a>}
            {youtubeUrl && <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</a>}
          </div>
        </header>
        <ResumeMarkdown content={content} />
        {calendarUrl && (
          <ProfileClientShell
            displayName={name}
            calendarUrl={calendarUrl}
            chatbotEnabled={false}
            toolName=""
            resumeContext=""
          />
        )}
        <footer className="profile-footer">
          <a href="https://github.com/headstones-app/headstones-open" className="powered-by">Headstones</a>
        </footer>
      </div>
    </>
  )
}
