'use client'

import './Chatbot.css'
import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  personName: string
  webhookUrl: string
  resumeContext: string
  gateEnabled?: boolean
  gateFormUrl?: string
}

export default function Chatbot({ personName, webhookUrl, resumeContext, gateEnabled, gateFormUrl }: Props) {
  const [gateCleared, setGateCleared] = useState(!gateEnabled)
  const [gateName, setGateName] = useState('')
  const [gateEmail, setGateEmail] = useState('')
  const [gateCompany, setGateCompany] = useState('')
  const [gateError, setGateError] = useState('')
  const [visitorIdentity, setVisitorIdentity] = useState('')

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm ${personName}'s AI assistant. Ask me anything about their experience, skills, or background.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `hs-${Math.random().toString(36).slice(2)}`)
  const messagesAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesAreaRef.current && messages.length > 1) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGateError('')

    if (!gateName.trim()) { setGateError('Please enter your name.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gateEmail)) {
      setGateError('Please enter a valid email address.')
      return
    }

    setVisitorIdentity(gateName.trim())

    if (gateFormUrl) {
      const body = new FormData()
      body.append('name', gateName.trim())
      body.append('email', gateEmail.trim())
      if (gateCompany.trim()) body.append('company', gateCompany.trim())
      fetch(gateFormUrl, { method: 'POST', body }).catch(() => {})
    }

    setGateCleared(true)
  }

  const send = async (text: string) => {
    if (!text.trim()) return
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('chatInput', text)
      formData.append('sessionId', sessionId)
      if (resumeContext) formData.append('resumeContext', resumeContext)
      if (visitorIdentity) formData.append('gateIdentity', visitorIdentity)

      const res = await fetch(webhookUrl, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Request failed')

      const data = await res.json()
      let reply: string = data.output ?? data.response ?? data.text ?? JSON.stringify(data)
      reply = reply.replace(/\\n/g, '\n').replace(/\n(?!\n)/g, '\n\n')

      const imageRegex = /(?<![!\[]\()https?:\/\/[^\s)]+?\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s)]+)?(?!\))/gi
      reply = reply.replace(imageRegex, (url: string) => `![Image](${url})`)

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!gateCleared && gateEnabled) {
    return (
      <div className="chatbot-container chatbot-gate">
        <form className="gate-form" onSubmit={handleGateSubmit}>
          <p className="gate-prompt">Introduce yourself to chat with {personName}&apos;s AI assistant.</p>

          <label className="gate-label" htmlFor="gate-name">Name <span className="gate-required">*</span></label>
          <input
            id="gate-name"
            type="text"
            value={gateName}
            onChange={(e) => setGateName(e.target.value)}
            placeholder="Jane Smith"
            className="gate-input"
            autoFocus
          />

          <label className="gate-label" htmlFor="gate-email">Email <span className="gate-required">*</span></label>
          <input
            id="gate-email"
            type="email"
            value={gateEmail}
            onChange={(e) => setGateEmail(e.target.value)}
            placeholder="you@example.com"
            className="gate-input"
          />

          <label className="gate-label" htmlFor="gate-company">Company <span className="gate-optional">(optional)</span></label>
          <input
            id="gate-company"
            type="text"
            value={gateCompany}
            onChange={(e) => setGateCompany(e.target.value)}
            placeholder="Acme Corp"
            className="gate-input"
          />

          {gateError && <p className="gate-error">{gateError}</p>}
          <button type="submit" className="gate-button">Start chatting</button>
        </form>
      </div>
    )
  }

  return (
    <div className="chatbot-container">
      <div className="messages-area" ref={messagesAreaRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.role === 'assistant' ? (
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
      </div>

      <form
        className="chat-input-area"
        onSubmit={(e) => { e.preventDefault(); send(input) }}
      >
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${personName} anything...`}
            className="chat-input"
            disabled={loading}
          />
          <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
