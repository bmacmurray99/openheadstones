'use client'

import dynamic from 'next/dynamic'

const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false })
const WebMCPTools = dynamic(() => import('@/components/WebMCPTools'), { ssr: false })
const CalendarEmbed = dynamic(() => import('@/components/CalendarEmbed'), { ssr: false })

interface Props {
  displayName: string
  calendarUrl?: string
  chatbotEnabled: boolean
  chatbotWebhookUrl?: string
  toolName: string
  resumeContext: string
  gateEnabled?: boolean
  gateFormUrl?: string
}

export default function ProfileClientShell({
  displayName,
  calendarUrl,
  chatbotEnabled,
  chatbotWebhookUrl,
  toolName,
  resumeContext,
  gateEnabled,
  gateFormUrl,
}: Props) {
  const webhookUrl = chatbotWebhookUrl || ''
  const showChatbot = chatbotEnabled && !!webhookUrl

  return (
    <>
      {webhookUrl && (
        <WebMCPTools
          toolName={toolName}
          displayName={displayName}
          webhookUrl={webhookUrl}
          resumeContext={resumeContext}
        />
      )}

      {showChatbot && (
        <section className="chatbot-section">
          <h2>Chat with {displayName}</h2>
          <Chatbot
            personName={displayName}
            webhookUrl={webhookUrl}
            resumeContext={resumeContext}
            gateEnabled={gateEnabled}
            gateFormUrl={gateFormUrl}
          />
        </section>
      )}

      {calendarUrl && (
        <section className="calendar-section">
          <h2>Schedule a Meeting</h2>
          <CalendarEmbed url={calendarUrl} />
        </section>
      )}
    </>
  )
}
