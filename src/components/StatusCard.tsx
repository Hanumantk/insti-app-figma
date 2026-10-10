import { useNavigate } from 'react-router-dom'
import type { InstiEvent } from '../data/types'
import { A } from '../lib/assets'
import { dateLabel, posterFor } from '../lib/events'
import { useApp } from '../store/useApp'
import { CommentTooltip } from './CommentTooltip'
import { ApproveSm, DateTime, EditButtonSm, EditChip, RejectSm, StatusPill } from './ui'

/**
 * 320x640 card for the GSHA "Event status" grid (41:211) and the GSec
 * "Event Approvals" grid (49:184).
 */
export function StatusCard({
  e, variant, onReject, forceTooltip,
}: { e: InstiEvent; variant: 'creator' | 'approver'; onReject?: (id: string) => void; forceTooltip?: boolean }) {
  const nav = useNavigate()
  const approve = useApp((s) => s.approve)
  const poster = posterFor(e, 'status')
  const open = () => nav(`/event/${e.id}`)
  const edit = (ev: React.MouseEvent) => { ev.stopPropagation(); nav(`/event/${e.id}/edit`) }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(ev) => ev.key === 'Enter' && open()}
      className="relative z-0 h-[640px] w-[320px] cursor-pointer has-[[role=tooltip]]:z-20 rounded-[25px] border-[1.5px] border-black/15 bg-white drop-shadow-card"
      data-testid="status-card"
      data-status={e.status}
    >
      <div className={`absolute left-[7.5px] top-[7.5px] h-[392px] w-[302px] overflow-hidden rounded-t-[16px] ${poster.src ? "" : "bg-form-grey"}`}>
        {poster.src && <img alt="" src={poster.src} className="size-full object-cover" />}
        <span
          className="absolute bottom-0 left-0 h-[101px] w-full"
          style={{ backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(173,173,173,0.162) 39.904%, rgba(129,129,129,0.25) 68.75%, rgba(0,0,0,0.25) 100%)' }}
        />
      </div>
      {variant === 'approver' && <EditChip onClick={edit} className="!absolute left-[22.5px] top-[350.5px]" />}

      <p className="absolute left-[21.5px] top-[419.5px] w-[273px] font-nm text-[20px] font-medium leading-[normal] tracking-[0.6px] text-ink-title">{e.title}</p>

      {/* action row, y = 485 */}
      <div className="absolute left-[22.5px] top-[483.5px] h-[32px] w-[273px]" onClick={(ev) => ev.stopPropagation()}>
        {variant === 'creator' ? <CreatorRow e={e} onEdit={edit} forceTooltip={forceTooltip} /> : (
          e.status === 'pending' ? (
            <>
              <ApproveSm className="!absolute left-0 top-0" onClick={() => approve(e.id)} data-testid="card-approve" />
              <RejectSm className="!absolute left-[144px] top-0" onClick={() => onReject?.(e.id)} data-testid="card-reject" />
            </>
          ) : (
            <>
              <StatusPill status={e.status} />
              {e.status === 'rejected' && <img alt="Rejected" src={A.alertSm} className="absolute left-[124px] top-[4px] size-[24px]" />}
            </>
          )
        )}
      </div>

      <span className="absolute left-[38.5px] top-[539.5px] h-px w-[240px] bg-black/10" />
      <img alt="" src={A.calendarSm} className="absolute left-[22.5px] top-[555.5px] h-[22px] w-[20px]" />
      <DateTime
        date={dateLabel(e)}
        time={e.time}
        gapBefore={4.5}
        gapAfter={7.5}
        ruleH={20}
        ruleW={1}
        className="absolute left-[54.5px] top-[557.5px] h-[22px] font-hn text-[16px] font-normal leading-[normal] text-ink"
      />
      <img alt="" src={A.mappinSm} className="absolute left-[22.5px] top-[592.5px] h-[26px] w-[21px]" />
      <p className="absolute left-[55.5px] top-[597.5px] whitespace-nowrap font-hn text-[16px] font-normal leading-[normal] text-ink">{e.venue}</p>
    </div>
  )
}

function CreatorRow({ e, onEdit, forceTooltip }: { e: InstiEvent; onEdit: (ev: React.MouseEvent) => void; forceTooltip?: boolean }) {
  if (e.status !== 'rejected') {
    return (
      <>
        <StatusPill status={e.status} />
        <EditButtonSm onClick={onEdit} className="!absolute left-[128px] top-0" />
      </>
    )
  }
  return (
    <>
      <StatusPill status="rejected" />
      {e.rejectionComment ? (
        <CommentTooltip
          comment={e.rejectionComment}
          forceOpen={forceTooltip}
          className="absolute left-[122px] top-[2px]"
          trigger={<img alt="" src={A.chatDot} className="size-[28px]" />}
          size="sm"
        />
      ) : (
        <img alt="Rejected" src={A.alert} className="absolute left-[112px] top-0 h-[32px] w-[36px]" />
      )}
      <EditButtonSm onClick={onEdit} className="!absolute left-[196px] top-0" />
    </>
  )
}
