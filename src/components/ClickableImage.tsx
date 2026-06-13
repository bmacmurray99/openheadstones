'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import './ClickableImage.css'

interface Props {
  src?: string
  alt?: string
}

export default function ClickableImage({ src, alt }: Props) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!src) return null

  return (
    <>
      <img
        src={src}
        alt={alt ?? ''}
        className="clickable-image"
        onClick={() => setOpen(true)}
      />
      {open && createPortal(
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={alt || 'Image lightbox'}
          onClick={close}
        >
          <button
            ref={closeRef}
            className="lightbox-close"
            onClick={close}
            aria-label="Close image"
          >
            ✕
          </button>
          <img
            src={src}
            alt={alt ?? ''}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  )
}
