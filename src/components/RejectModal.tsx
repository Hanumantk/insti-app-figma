import { useEffect, useRef, useState } from 'react'
import { OverlayStage } from './AppFrame'
import { BlurBackdrop } from './AnnouncementsPanel'

/** 103:1783 — dark 320x208 "Comment" dialog asking for the rejection reason. */
export function RejectModal({ onSend, onClose }: { onSend: (comment: string) => void; onClose: () => void }) {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    ref.current?.focus()
    const onKey = (ev: KeyboardEvent) => ev.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const send = () => {
    const c = text.trim()
    if (!c) return ref.current?.focus()
    onSend(c)
  }

  return (
    <OverlayStage className="z-50">
      <BlurBackdrop onClick={onClose} label="Close" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Reason for rejecting this event"
        className="absolute left-[596px] top-1/2 h-[208px] w-[320px] -translate-y-[90px] rounded-[10px] bg-footer"
        data-testid="reject-modal"
      >
        <p className="absolute left-[19px] top-[20px] whitespace-nowrap font-hn text-[20px] font-medium leading-[normal] text-tip-title">Comment</p>
        <textarea
          ref={ref}
          value={text}
          onChange={(ev) => setText(ev.target.value)}
          placeholder="The reason of rejecting this event ?"
          className="absolute left-[20px] top-[44px] h-[91px] w-[280px] font-hn text-[16px] font-normal leading-[19.2px] text-tip-body placeholder:text-tip-placeholder"
          data-testid="reject-text"
        />
        <button
          onClick={send}
          className="absolute left-[212px] top-[151px] flex h-[32px] w-[88px] items-center justify-center rounded-[25px] border border-primary bg-primary font-nm text-[16px] font-bold leading-[normal] text-white"
          data-testid="reject-send"
        >
          Send
        </button>
      </div>
    </OverlayStage>
  )
}
