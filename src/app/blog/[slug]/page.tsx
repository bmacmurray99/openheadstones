import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPost } from '@/lib/posts'
import ResumeMarkdown from '@/components/ResumeMarkdown'
import BlogSchema from '@/components/BlogSchema'
import { resolveImage } from '@/lib/resolve-image'

export function generateStaticParams() {
  if (process.env.BLOG_ENABLED !== 'true') return []
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const domain = process.env.SITE_DOMAIN || 'https://yourname.com'
  const imageUrl = resolveImage(post.image || process.env.AVATAR_URL, domain)
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (process.env.BLOG_ENABLED !== 'true') notFound()
  const post = getPost(slug)
  if (!post) notFound()

  const name = process.env.DISPLAY_NAME || 'Your Name'
  const domain = process.env.SITE_DOMAIN || 'https://yourname.com'
  const avatarUrl = process.env.AVATAR_URL || undefined

  return (
    <>
    <BlogSchema
      type="post"
      siteName={name}
      domain={domain}
      title={post.title}
      date={post.date}
      description={post.description}
      slug={post.slug}
      authorName={name}
      authorImageUrl={post.image || avatarUrl}
      breadcrumbLabel={post.breadcrumb}
    />
    <main id="main-content" className="post-page">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li><a href="/">{name}</a></li>
          <li><a href="/blog">Blog</a></li>
          <li aria-current="page">{post.breadcrumb || post.title}</li>
        </ol>
      </nav>
      <article>
        <header className="post-header">
          <h1>{post.title}</h1>
          {post.date && <time className="post-date">{post.date}</time>}
        </header>
        <div className="post-content">
          <ResumeMarkdown content={post.content} />
        </div>
      </article>
      <footer className="profile-footer">
        <a href="https://github.com/headstones-app/headstones-open" className="powered-by">Headstones</a>
      </footer>
    </main>
    </>
  )
}
