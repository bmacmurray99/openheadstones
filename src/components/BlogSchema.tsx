import { resolveImage } from '@/lib/resolve-image'

interface BaseProps {
  siteName: string
  domain: string
}

interface BlogIndexProps extends BaseProps {
  type: 'index'
}

interface BlogPostProps extends BaseProps {
  type: 'post'
  title: string
  date: string
  description?: string
  slug: string
  authorName: string
  authorImageUrl?: string
  breadcrumbLabel?: string
}

type Props = BlogIndexProps | BlogPostProps

export default function BlogSchema(props: Props) {
  const base = props.domain.replace(/\/$/, '')

  const website = {
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: props.siteName,
    url: base,
  }

  let graph: object[]

  if (props.type === 'index') {
    const pageUrl = `${base}/blog`
    graph = [
      website,
      {
        '@type': 'Blog',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `Blog — ${props.siteName}`,
        isPartOf: { '@id': `${base}/#website` },
      },
    ]
  } else {
    const pageUrl = `${base}/blog/${props.slug}`
    const pageId = `${pageUrl}#webpage`
    const postId = `${pageUrl}#blogposting`

    const imageUrl = resolveImage(props.authorImageUrl, props.domain)

    graph = [
      website,
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: props.authorName, item: base },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${base}/blog` },
          { '@type': 'ListItem', position: 3, name: props.breadcrumbLabel || props.title, item: pageUrl },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: pageUrl,
        name: props.title,
        isPartOf: { '@id': `${base}/#website` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        mainEntity: { '@id': postId },
      },
      {
        '@type': 'BlogPosting',
        '@id': postId,
        headline: props.title,
        description: props.description || undefined,
        image: imageUrl,
        datePublished: props.date || undefined,
        dateModified: props.date || undefined,
        url: pageUrl,
        mainEntityOfPage: { '@id': pageId },
        author: {
          '@type': 'Person',
          '@id': `${base}/#person`,
          name: props.authorName,
          url: base,
        },
        publisher: {
          '@type': 'Person',
          '@id': `${base}/#person`,
          name: props.authorName,
          url: base,
        },
      },
    ]
  }

  const schema = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
