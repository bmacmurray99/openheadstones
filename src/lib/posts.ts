import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

export interface PostMeta {
  slug: string
  title: string
  date: string
  description?: string
  image?: string
  breadcrumb?: string
}

export interface Post extends PostMeta {
  content: string
}

const POSTS_DIR = join(process.cwd(), 'posts')

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw.trim() }
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    data[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }
  return { data, content: match[2].trim() }
}

export function getAllPosts(): PostMeta[] {
  if (!existsSync(POSTS_DIR)) return []
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '')
      const raw = readFileSync(join(POSTS_DIR, filename), 'utf-8')
      const { data } = parseFrontmatter(raw)
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        description: data.description || undefined,
        image: data.image || undefined,
        breadcrumb: data.breadcrumb || undefined,
      }
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPost(slug: string): Post | null {
  const filePath = join(POSTS_DIR, `${slug}.md`)
  if (!existsSync(filePath)) return null
  const raw = readFileSync(filePath, 'utf-8')
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    description: data.description || undefined,
    image: data.image || undefined,
    breadcrumb: data.breadcrumb || undefined,
    content,
  }
}
