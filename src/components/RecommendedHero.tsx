import { Link } from 'react-router-dom'
import type { InstiEvent } from '../data/types'
import { A } from '../lib/assets'
import { blurb, dateLabel, posterFor } from '../lib/events'
import { useApp } from '../store/useApp'
import { DateTime, More } from './ui'

/** 75:363 — Recommended hero card, 1352x400 at (80, 240). */
export function RecommendedHero({ e }: { e: InstiEvent }) {
  const poster = posterFor(e, 'hero')
  const mine = useApp((s) => s.reactions[e.id])
  const toggle = useApp((s) => s.toggleReaction)
  return (
    <div className="absolute left-[80px] top-[144px] h-[400px] w-[1352px]">
      <Link to={`/event/${e.id}`} className="absolute inset-0 rounded-[25px] border border-black/15 bg-white shadow-hero" aria-label={e.title} />
      <div className="pointer-events-none absolute left-[24px] top-[24px] h-[352px] w-[520px] overflow-hidden rounded-[14px] border-[0.5px] border-black/15 shadow-heroimg">
        {poster.src && (
          e.heroPoster && !e.uploadedPoster
            ? <img alt="" src={poster.src} className="absolute left-[-0.08%] top-[-23.24%] h-[146.25%] w-full max-w-none" />
            : <img alt="" src={poster.src} className="size-full object-cover" />
        )}
      </div>
      <div className="pointer-events-none">
        <p className="absolute left-[600px] top-[66px] w-[686px] whitespace-nowrap font-nm text-[28px] font-medium leading-[normal] tracking-[0.84px] text-ink-title">{e.title}</p>
        <p className="absolute left-[600px] top-[113px] h-[87px] w-[688px] font-hn text-[20px] font-normal leading-[23.4px] text-muted">
          {e.heroBlurb ?? blurb(e, 230)}
          <More />
        </p>
        <img alt="" src={A.calendar} className="absolute left-[600px] top-[225px] h-[26px] w-[24px]" />
        <DateTime
          date={dateLabel(e)}
          time={e.time}
          gapBefore={7}
          gapAfter={12}
          ruleH={24}
          className="absolute left-[636px] top-[228px] h-[27px] font-hn text-[20px] font-medium leading-[normal] text-ink"
        />
        <img alt="" src={A.mappin} className="absolute left-[891px] top-[225px] h-[30px] w-[24px]" />
        <p className="absolute left-[927px] top-[231px] whitespace-nowrap font-hn text-[20px] font-medium leading-[normal] text-ink">{e.venue}</p>
        <span className="absolute left-[601px] top-[272px] h-px w-[314px] bg-black/10" />
      </div>
      <PillToggle left={601} label="Interested" on={!!mine?.interested} onClick={() => toggle(e.id, 'interested')} />
      <PillToggle left={761} label="Going" on={!!mine?.going} onClick={() => toggle(e.id, 'going')} />
    </div>
  )
}

function PillToggle({ left, label, on, onClick }: { left: number; label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`absolute top-[293px] flex h-[34px] w-[128px] items-center justify-center rounded-[20px] border-[1.5px] border-primary pb-[3px] font-nm text-[18px] font-medium leading-[normal] text-primary ${on ? 'bg-primary-tint' : 'bg-white'}`}
      style={{ left }}
    >
      {label}
    </button>
  )
}
