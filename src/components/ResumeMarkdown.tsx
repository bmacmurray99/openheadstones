'use client'

import './ResumeMarkdown.css'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ClickableImage from './ClickableImage'

export default function ResumeMarkdown({ content }: { content: string }) {
  return (
    <div className="resume-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{ img: ({ src, alt }) => <ClickableImage src={src as string | undefined} alt={alt} /> }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
