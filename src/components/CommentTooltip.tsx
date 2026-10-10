import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * Dark "Comment" tooltip.
 * sm = 99:1289 card tooltip (320x116, 12px body) — opens 7px below / 2px right of the trigger.
 * lg = 232:1730 event-page tooltip (320x208, 16px body, optional "Resend for approval").
 * Opens on hover AND on click so it also works on touch.
 */
export function CommentTooltip({
  comment, trigger, size, className = '', style, forceOpen, onResend, offset,
}: {
  comment: string
  trigger: ReactNode
  size: 'sm' | 'lg'
  className?: string
  style?: CSSProperties
  forceOpen?: boolean
  onResend?: () => void
  offset?: { left: number; top: number }
}) {
  const [hover, setHover] = useState(false)
  const [pinned, setPinned] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const open = forceOpen || hover || pinned

  useEffect(() => {
    if (!pinned) return
    const close = (ev: MouseEvent) => { if (!ref.current?.contains(ev.target as Node)) setPinned(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [pinned])

  const pos = offset ?? (size === 'sm' ? { left: 2, top: 35 } : { left: 0, top: 56 })

  return (
    <div ref={ref} style={style} className={`z-20 ${className}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button
        type="button"
        aria-label="Show GSec comment"
        aria-expanded={open}
        onClick={(ev) => { ev.stopPropagation(); setPinned((p) => !p) }}
        className="block"
        data-testid="comment-trigger"
      >
        {trigger}
      </button>
      {open && (
        <div
          role="tooltip"
          onClick={(ev) => ev.stopPropagation()}
          className={`absolute w-[320px] rounded-[10px] bg-footer ${size === 'sm' ? 'h-[116px]' : 'h-[208px]'}`}
          style={pos}
          data-testid="comment-tooltip"
        >
          {size === 'sm' ? (
            <>
              <p className="absolute left-[20px] top-[20px] font-hn text-[16px] font-medium leading-[normal] text-tip-title">Comment</p>
              <p className="absolute left-[20px] top-[40px] w-[280px] font-hn text-[12px] font-normal leading-[14.4px] text-tip-body">{comment}</p>
            </>
          ) : (
            <>
              <p className="absolute left-[19px] top-[20px] whitespace-nowrap font-hn text-[20px] font-medium leading-[normal] text-tip-title">Comment</p>
              <p className="absolute left-[20px] top-[44px] h-[91px] w-[279px] overflow-hidden font-hn text-[16px] font-normal leading-[19.2px] text-tip-body">{comment}</p>
              {onResend && (
                <button
                  onClick={(ev) => { ev.stopPropagation(); setPinned(false); setHover(false); onResend() }}
                  className="absolute left-[104px] top-[151px] flex h-[32px] w-[196px] items-center justify-center rounded-[25px] border border-success bg-success font-nm text-[16px] font-bold leading-[normal] text-white"
                  data-testid="resend"
                >
                  Resend for approval
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
