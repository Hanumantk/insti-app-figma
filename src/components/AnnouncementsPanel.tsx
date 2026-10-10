import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { InstiEvent } from '../data/types'
import { A } from '../lib/assets'
import { dateLabel, posterFor } from '../lib/events'
import { OverlayStage } from './AppFrame'
import { DateTime } from './ui'

/** Shared blurred dim used by the Announcements drawer (110:2360) and reject modal (103:1793). */
export function BlurBackdrop({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="absolute inset-0 cursor-default backdrop-blur-[4px]"
      style={{ background: 'radial-gradient(ellipse 886px 575px at 756px 160px, rgba(0,0,0,0.5) 0%, rgba(102,102,102,0.5) 100%)' }}
    />
  )
}

/** 110:2365 — 718px right drawer, #F4F8FF, white 96px header with a back arrow. */
export function AnnouncementsPanel({ items, onClose }: { items: InstiEvent[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => ev.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <OverlayStage className="z-50">
      <BlurBackdrop onClick={onClose} label="Close announcements" />
      <aside className="no-scrollbar absolute left-[794px] top-0 h-full w-[718px] overflow-y-auto bg-page" data-testid="announcements-panel">
        <div className="sticky top-0 z-10 h-[96px] w-[718px] bg-white shadow-nav">
          <button aria-label="Back" onClick={onClose} className="absolute left-[36px] top-[32px] size-[40px]" data-testid="announcements-back">
            <img alt="" src={A.arrowLeft} className="size-full" />
          </button>
          <p className="absolute left-[100px] top-[29px] whitespace-nowrap font-nm text-[36px] font-bold leading-[35px] tracking-[0.72px] text-black">Announcements</p>
        </div>
        <div className="relative" style={{ height: 152 - 96 + items.length * 376 - 80 + 40 }}>
          {items.map((e, i) => (
            <div key={e.id}>
              {i > 0 && <span className="absolute left-[58px] h-px w-[616px] bg-black/15" style={{ top: 488 - 96 + (i - 1) * 376 - 0.5 }} />}
              <AnnouncementItem e={e} top={152 - 96 + i * 376} />
            </div>
          ))}
        </div>
      </aside>
    </OverlayStage>
  )
}

function AnnouncementItem({ e, top }: { e: InstiEvent; top: number }) {
  const poster = posterFor(e, 'detail')
  const [greeting, ...rest] = e.description.split('\n')
  return (
    <Link to={`/event/${e.id}`} className="absolute left-[40px] block h-[296px] w-[638px]" style={{ top }}>
      <div className="absolute left-0 top-0 h-[296px] w-[237px] overflow-hidden rounded-[15px]">
        {poster.src && <img alt="" src={poster.src} className="size-full object-cover" />}
      </div>
      <p className="absolute left-[280px] top-[23px] w-[371px] font-nm text-[28px] font-medium leading-[normal] tracking-[0.84px] text-black">{e.title}</p>
      <div className="absolute left-[278px] top-[68px] h-[81px] w-[360px] overflow-hidden font-hn text-[18px] font-normal leading-[21.6px] text-muted">
        <p>{greeting}</p>
        {rest.length > 0 && <p>{rest.join(' ')}</p>}
      </div>
      <span className="absolute left-[280px] top-[168.5px] h-px w-[356px] bg-black/10" />
      <img alt="" src={A.calendar} className="absolute left-[278px] top-[189px] h-[26px] w-[24px]" />
      <DateTime
        date={dateLabel(e)}
        time={e.time}
        gapBefore={7}
        gapAfter={12}
        ruleH={24}
        className="absolute left-[314px] top-[191px] h-[27px] font-hn text-[20px] font-medium leading-[normal] text-ink"
      />
      <img alt="" src={A.mappin} className="absolute left-[278px] top-[239px] h-[30px] w-[24px]" />
      <p className="absolute left-[314px] top-[246px] whitespace-nowrap font-hn text-[20px] font-medium leading-[normal] text-ink">{e.venue}</p>
    </Link>
  )
}
