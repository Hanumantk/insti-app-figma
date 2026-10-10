import { Link } from 'react-router-dom'
import type { Role } from '../data/types'
import { A } from '../lib/assets'
import { OverlayStage } from './AppFrame'
import { Badge } from './ui'

/** Page-relative Y → content-relative Y (content starts below the 96px sticky nav). */
export const Y = (figmaY: number) => figmaY - 96

export type HomeTab = 'recommended' | 'status' | 'approvals'

const second: Record<Role, { tab: HomeTab; label: string; left: number; underline: [number, number] } | null> = {
  student: null,
  gsha: { tab: 'status', label: 'Event status', left: 254, underline: [258, 96] },
  gsec: { tab: 'approvals', label: 'Event Approvals', left: 254, underline: [262, 125] },
}

/** Tabs row (75:359 / 1:237 / 75:109) with the 0.5px rule and the 1px active underline. */
export function PageTabs({ role, active, pendingCount }: { role: Role; active: HomeTab; pendingCount: number }) {
  const s = second[role]
  const onRec = active === 'recommended'
  const underline: [number, number] = onRec || !s ? [87, 120] : s.underline
  const tabClass = (on: boolean) =>
    `absolute whitespace-nowrap font-nm text-[20px] leading-[normal] ${on ? 'font-medium text-black' : 'font-normal text-ink-tab'}`
  return (
    <>
      <Link to="/home" className={tabClass(onRec)} style={{ left: 80, top: Y(152) }} data-testid="tab-recommended">
        Recommended
      </Link>
      {s && (
        <Link to={`/home?tab=${s.tab}`} className={tabClass(!onRec)} style={{ left: s.left, top: Y(onRec && s.tab === 'approvals' ? 151 : 152) }} data-testid={`tab-${s.tab}`}>
          {s.label}
        </Link>
      )}
      {s?.tab === 'approvals' && onRec && pendingCount > 0 && <Badge style={{ left: 392, top: Y(138) }}>{pendingCount}</Badge>}
      <span className="absolute h-[0.5px] w-[1336px] bg-black/15" style={{ left: 88, top: Y(200) - 0.25 }} />
      <span className="absolute h-px bg-black/80" style={{ left: underline[0], width: underline[1], top: Y(200) - 0.5 }} />
    </>
  )
}

/** Group 9 — "Announcements" button (208x48) with the red count badge. */
export function AnnouncementsButton({ onClick }: { onClick: () => void }) {
  return (
    <>
      <button
        onClick={onClick}
        className="absolute h-[48px] w-[208px] rounded-[30px] bg-primary"
        style={{ left: 1224, top: Y(140) }}
        data-testid="announcements-button"
      >
        <span className="absolute left-[9px] top-[8px] flex size-[33.919px] items-center justify-center">
          <img alt="" src={A.megaphone} className="size-[24px] rotate-[47.06deg]" />
        </span>
        <span className="absolute left-[47px] top-1/2 -translate-y-1/2 whitespace-nowrap font-nm text-[20px] font-medium leading-[normal] text-white">Announcements</span>
      </button>
      <Badge className="pointer-events-none" style={{ left: 1415, top: Y(132) }}>2</Badge>
    </>
  )
}

/** 232:2115 — 88px floating "+" (GSHA and GSec homes). Fixed at the same viewport spot as in Figma. */
export function FloatingAdd({ onClick }: { onClick: () => void }) {
  return (
    <OverlayStage className="pointer-events-none !z-20">
      <button
        aria-label="Add event"
        onClick={onClick}
        className="pointer-events-auto absolute left-[1344px] size-[88px]"
        style={{ bottom: 70 }}
        data-testid="fab-add"
      >
        <img alt="" src={A.fabAdd} className="size-full" />
      </button>
    </OverlayStage>
  )
}
