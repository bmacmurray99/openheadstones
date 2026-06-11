'use client'

import { useEffect } from 'react'

interface Props {
  toolName: string
  displayName: string
  webhookUrl: string
  resumeContext: string
}

let activeController: AbortController | null = null

export default function WebMCPTools({ toolName, displayName, webhookUrl, resumeContext }: Props) {
  useEffect(() => {
    const mc = (document as unknown as { modelContext?: { registerTool?: unknown } }).modelContext
      ?? (navigator as unknown as { modelContext?: { registerTool?: unknown } }).modelContext
    if (!mc || typeof (mc as { registerTool?: unknown }).registerTool !== 'function') return

    activeController?.abort()
    activeController = new AbortController()

    const registry = mc as {
      registerTool: (def: object, opts: { signal: AbortSignal }) => void
    }

    try {
      registry.registerTool(
        {
          name: toolName,
          title: `Ask ${displayName}`,
          description: `Ask ${displayName}'s AI assistant about their professional background, skills, experience, projects, or availability.`,
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: `The question to ask ${displayName}'s AI assistant`,
              },
            },
            required: ['query'],
          },
          annotations: {
            readOnlyHint: true,
            untrustedContentHint: false,
          },
          async execute({ query }: { query: string }) {
            const formData = new FormData()
            formData.append('chatInput', String(query))
            formData.append('sessionId', `hs-webmcp-${toolName}`)
            if (resumeContext) formData.append('resumeContext', resumeContext)

            const response = await fetch(webhookUrl, { method: 'POST', body: formData })
            if (!response.ok) throw new Error('Request failed')

            const data = await response.json()
            const text = data.output ?? data.response ?? data.text ?? JSON.stringify(data)
            return { content: [{ type: 'text', text }] }
          },
        },
        { signal: activeController.signal }
      )
    } catch {
      activeController = null
    }

    return () => {
      activeController?.abort()
      activeController = null
    }
  }, [toolName, displayName, webhookUrl, resumeContext])

  return null
}
