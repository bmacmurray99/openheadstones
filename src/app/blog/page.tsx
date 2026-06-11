import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import BlogSchema from '@/components/BlogSchema'

export function generateMetadata(): Metadata {
  const name = process.env.DISPLAY_NAME || 'Your Name'
  const blogActive = process.env.BLOG_ENABLED === 'true' && getAllPosts().length > 0
  return {
    title: `Blog — ${name}`,
    description: `Writing by ${name}`,
    ...(!blogActive && { robots: { index: false } }),
  }
}

export default function BlogPage() {
  const posts = getAllPosts()
  const name = process.env.DISPLAY_NAME || 'Your Name'
  const domain = process.env.SITE_DOMAIN || 'https://yourname.com'

  return (
    <>
    <BlogSchema type="index" siteName={name} domain={domain} />
    <div className="blog-page">
      <nav className="resume-nav">
        <a href="/">← {name}</a>
      </nav>
      <header className="blog-header">
        <h1>Blog</h1>
      </header>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug} className="post-item">
            <a href={`/blog/${post.slug}`} className="post-title">{post.title}</a>
            {post.date && <time className="post-date">{post.date}</time>}
            {post.description && <p className="post-description">{post.description}</p>}
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}
