import { Link } from 'react-router-dom'
import type { InstiEvent } from '../data/types'
import { A } from '../lib/assets'
import { blurb, dateLabel, posterFor } from '../lib/events'
import { DateTime, More } from './ui'

/** 435x728 feed card (75:403 … 75:542). */
export function EventCard({ e }: { e: InstiEvent }) {
  const poster = posterFor(e, 'card')
  return (
    <Link
      to={`/event/${e.id}`}
      className="relative block h-[728px] w-[435px] shrink-0 rounded-[25px] border-[1.5px] border-black/15 bg-white drop-shadow-card"
      data-testid="event-card"
    >
      <div className={`absolute left-[8.5px] top-[8.5px] h-[391px] w-[415.169px] overflow-hidden rounded-t-[16px] ${poster.src ? "" : "bg-form-grey"}`}>
        {poster.src && <img alt="" src={poster.src} className="size-full object-cover" />}
      </div>
      <span className="absolute left-[8.5px] top-[400.5px] h-px w-[415px] bg-black/15" />
      <div className="absolute left-[30.5px] top-[423.5px] flex h-[160px] w-[371px] flex-col gap-[20px] overflow-hidden">
        <p className="font-nm text-[28px] font-medium leading-[normal] tracking-[0.84px] text-ink-title">{e.title}</p>
        <p className="w-[370px] font-hn text-[18px] font-normal leading-[21.6px] text-muted">
          {blurb(e)}
          <More />
        </p>
      </div>
      <span className="absolute left-[38.5px] top-[603.5px] h-px w-[356px] bg-black/10" />
      <img alt="" src={A.calendar} className="absolute left-[30.5px] top-[624.5px] h-[26px] w-[24px]" />
      <DateTime
        date={dateLabel(e)}
        time={e.time}
        gapBefore={8}
        gapAfter={12}
        ruleH={24}
        className="absolute left-[66.5px] top-[627.5px] h-[27px] font-hn text-[20px] font-medium leading-[normal] text-ink"
      />
      <img alt="" src={A.mappin} className="absolute left-[30.5px] top-[668.5px] h-[30px] w-[24px]" />
      <p className="absolute left-[66.5px] top-[675.5px] whitespace-nowrap font-hn text-[20px] font-medium leading-[normal] text-ink">{e.venue}</p>
    </Link>
  )
}
