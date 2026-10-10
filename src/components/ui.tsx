import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import type { Status } from '../data/types'
import { A } from '../lib/assets'

const pillTone: Record<Status, string> = {
  approved: 'bg-success-bg border-success text-success',
  rejected: 'bg-danger-bg border-danger text-danger',
  pending: 'bg-warning-bg border-warning text-warning',
}
const pillLabel: Record<Status, string> = { approved: 'Approved', rejected: 'Rejected', pending: 'Pending' }
const pillLabelLg: Record<Status, string> = {
  approved: 'Event Approved',
  rejected: 'Event Rejected',
  pending: 'Event Pending', // not designed in Figma; uses the card's pending colours
}

/** 112x32 card pill (65:378 / 65:379 / 66:455). */
export function StatusPill({ status }: { status: Status }) {
  return (
    <span className={`flex h-[32px] w-[112px] items-center justify-center rounded-[25px] border font-nm text-[16px] font-bold leading-[normal] ${pillTone[status]}`}>
      {pillLabel[status]}
    </span>
  )
}

/** 280x56 page pill (99:1148 / 99:1250). */
export function StatusPillLg({ status }: { status: Status }) {
  return (
    <span className={`flex h-[56px] w-[280px] items-center justify-center rounded-[30px] border font-nm text-[28px] font-bold leading-[normal] ${pillTone[status]}`}>
      {pillLabelLg[status]}
    </span>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement>

/** 76x32 filled Edit (49:11). */
export function EditButtonSm(p: BtnProps) {
  return (
    <button {...p} className={`relative h-[32px] w-[76px] rounded-[25px] border-[0.5px] border-primary-tint bg-primary ${p.className ?? ''}`}>
      <span className="absolute left-[17px] top-1/2 -translate-y-1/2 font-nm text-[16px] font-medium leading-[normal] text-white">Edit</span>
      <img alt="" src={A.pencil} className="absolute left-[53px] top-1/2 size-[9.8px] -translate-y-1/2" />
    </button>
  )
}

/** 76x32 outline Edit chip on GSec card posters (75:44). */
export function EditChip(p: BtnProps) {
  return (
    <button {...p} className={`relative h-[32px] w-[76px] rounded-[25px] border-[1.2px] border-primary bg-white ${p.className ?? ''}`}>
      <span className="absolute left-[17px] top-1/2 -translate-y-1/2 font-nm text-[16px] font-medium leading-[normal] text-primary">Edit</span>
      <img alt="" src={A.pencilBlue} className="absolute left-[53px] top-1/2 size-[9.8px] -translate-y-1/2" />
    </button>
  )
}

/** 120x56 Edit on event pages (99:1156). */
export function EditButtonLg(p: BtnProps) {
  return (
    <button {...p} className={`relative h-[56px] w-[120px] rounded-[30px] border-[0.5px] border-primary-tint bg-primary ${p.className ?? ''}`}>
      <span className="absolute left-[28px] top-1/2 -translate-y-1/2 font-nm text-[24px] font-medium leading-[normal] text-white">Edit</span>
      <img alt="" src={A.pencilLg} className="absolute left-[85px] top-1/2 size-[15.5px] -translate-y-1/2" />
    </button>
  )
}

/** 128x32 Approve / Reject on GSec cards (75:79 / 75:85). */
export function ApproveSm(p: BtnProps) {
  return (
    <button {...p} className={`relative h-[32px] w-[128px] rounded-[25px] border border-success bg-success-bg ${p.className ?? ''}`}>
      <span className="absolute left-[27px] top-1/2 -translate-y-1/2 font-nm text-[16px] font-bold leading-[normal] text-success">Approve</span>
      <img alt="" src={A.checkGreen} className="absolute left-[95px] top-[8px] size-[16px]" />
    </button>
  )
}
export function RejectSm(p: BtnProps) {
  return (
    <button {...p} className={`relative h-[32px] w-[128px] rounded-[25px] border border-danger bg-danger-bg ${p.className ?? ''}`}>
      <span className="absolute left-[35px] top-1/2 -translate-y-1/2 font-nm text-[16px] font-bold leading-[normal] text-danger">Reject</span>
      <img alt="" src={A.xRed} className="absolute left-[87px] top-[8px] size-[16px]" />
    </button>
  )
}

/** 204x56 Approve / Reject on the GSec event page (102:1645 / 102:1644). */
export function ApproveLg(p: BtnProps) {
  return (
    <button {...p} className={`relative h-[56px] w-[204px] rounded-[30px] border border-success bg-success-bg ${p.className ?? ''}`}>
      <span className="absolute left-[35px] top-1/2 -translate-y-1/2 font-nm text-[28px] font-bold leading-[normal] text-success">Approve</span>
      <img alt="" src={A.checkLg} className="absolute left-[154px] top-[18px] size-[24px]" />
    </button>
  )
}
export function RejectLg(p: BtnProps) {
  return (
    <button {...p} className={`relative h-[56px] w-[204px] rounded-[30px] border border-danger bg-danger-bg ${p.className ?? ''}`}>
      <span className="absolute left-[49px] top-1/2 -translate-y-1/2 whitespace-pre font-nm text-[28px] font-bold leading-[normal] text-danger">{'Reject '}</span>
      <img alt="" src={A.xRedLg} className="absolute left-[141px] top-[16px] size-[24px]" />
    </button>
  )
}

/** "Wed, 21 Jan | 6:00 PM" with the 1.5px vertical rule used on cards. */
export function DateTime({
  date, time, className = '', gapBefore, gapAfter, ruleH, ruleW = 1.5, textTop = 3,
}: {
  date: string; time: string; className?: string; gapBefore: number; gapAfter: number
  ruleH: number; ruleW?: number; textTop?: number
}) {
  // The container's top edge is the top of the vertical rule; text sits textTop px lower (as in Figma).
  return (
    <span className={`flex items-start whitespace-pre ${className}`}>
      <span style={{ paddingTop: textTop }}>{date}</span>
      {time && (
        <>
          <span className="shrink-0 rounded-full bg-ink" style={{ width: ruleW, height: ruleH, marginLeft: gapBefore, marginRight: gapAfter }} />
          <span style={{ paddingTop: textTop }}>{time}</span>
        </>
      )}
    </span>
  )
}

export function Badge({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span style={style} className={`absolute flex size-[24px] items-center justify-center rounded-full bg-badge pr-[2px] font-nm text-[16px] font-medium leading-none text-white ${className}`}>
      {children}
    </span>
  )
}

/** "more..." tail used by every card blurb. */
export const More = () => <span className="font-medium text-ink">more...</span>
