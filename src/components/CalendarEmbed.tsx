'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    calendar?: {
      schedulingButton?: {
        load: (options: {
          url: string
          color: string
          label: string
          target: HTMLElement
        }) => void
      }
    }
  }
}

let scriptsLoaded = false

export default function CalendarEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initButton = () => {
      const target = containerRef.current
      if (!target || !window.calendar?.schedulingButton) return
      if (target.innerHTML !== '') return
      window.calendar.schedulingButton.load({
        url,
        color: '#6366f1',
        label: 'Book a meeting',
        target,
      })
    }

    if (scriptsLoaded) {
      initButton()
      return
    }
    scriptsLoaded = true

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js'
    script.async = true
    script.onload = initButton
    document.head.appendChild(script)
  }, [url])

  return <div ref={containerRef} />
}
