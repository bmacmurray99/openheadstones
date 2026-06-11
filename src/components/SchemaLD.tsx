interface Props {
  name: string
  headline?: string
  bio?: string
  website?: string
  linkedinUrl?: string
  githubUrl?: string
  twitterUrl?: string
  blueskyUrl?: string
  mastodonUrl?: string
  youtubeUrl?: string
  avatarUrl?: string
  domain: string
  pagePath?: string
  pageType?: string
  pageTitle?: string
}

import { resolveImage } from '@/lib/resolve-image'

export default function SchemaLD({ name, headline, bio, website, linkedinUrl, githubUrl, twitterUrl, blueskyUrl, mastodonUrl, youtubeUrl, avatarUrl, domain, pagePath = '/', pageType = 'ProfilePage', pageTitle }: Props) {
  const base = domain.replace(/\/$/, '')
  const pageUrl = `${base}${pagePath === '/' ? '' : pagePath}`
  const pageId = `${pageUrl}#webpage`

  const imageUrl = resolveImage(avatarUrl, domain)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name,
        url: website || base,
        image: imageUrl,
        description: bio || headline || undefined,
        jobTitle: headline || undefined,
        sameAs: [linkedinUrl, githubUrl, twitterUrl, blueskyUrl, mastodonUrl, youtubeUrl, website].filter(Boolean),
        mainEntityOfPage: { '@id': pageId },
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        name,
        url: base,
      },
      {
        '@type': pageType,
        '@id': pageId,
        url: pageUrl,
        name: pageTitle || name,
        isPartOf: { '@id': `${base}/#website` },
        mainEntity: { '@id': `${base}/#person` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
