import { useCallback, useState, type CSSProperties, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AppFrame } from '../components/AppFrame'
import { CommentTooltip } from '../components/CommentTooltip'
import { Footer } from '../components/Footer'
import { Y } from '../components/HomeChrome'
import { NavBar } from '../components/NavBar'
import { RejectModal } from '../components/RejectModal'
import { ApproveLg, EditButtonLg, RejectLg, StatusPillLg } from '../components/ui'
import { CLUBS } from '../data/seed'
import type { InstiEvent } from '../data/types'
import { A } from '../lib/assets'
import { dateLabel, posterFor } from '../lib/events'
import { useApp, useEvent } from '../store/useApp'

export function EventPage() {
  const { id } = useParams()
  const e = useEvent(id)
  if (!e) return <Navigate to="/home" replace />
  return <EventView e={e} />
}

function EventView({ e }: { e: InstiEvent }) {
  const role = useApp((s) => s.role)
  const reactions = useApp((s) => s.reactions[e.id])
  const toggle = useApp((s) => s.toggleReaction)
  const [params, setParams] = useSearchParams()
  const [rejecting, setRejecting] = useState(false)
  const reject = useApp((s) => s.reject)
  const nav = useNavigate()

  const closeModal = useCallback(() => {
    setRejecting(false)
    setParams((p) => {
      const n = new URLSearchParams(p)
      n.delete('modal')
      return n
    })
  }, [setParams])

  const poster = posterFor(e, 'detail')
  const hasDetails = !!(e.moreDetails || e.contact || e.regards || e.moreRegards || e.instagram !== undefined || e.website !== undefined)
  const clubs = e.clubs.map((c) => CLUBS[c]).filter(Boolean)

  // Vertical rhythm of 82:620: details card at 1113 (h993), clubs at 2162 (h110), footer at 2648.
  const detailsTop = 1113
  const detailsBottom = hasDetails ? detailsTop + 993 : detailsTop - 56 + 0
  const clubsTop = detailsBottom + 56
  const clubsBottom = clubs.length ? clubsTop + 110 : clubsTop - 56
  const footerTop = Math.max(clubsBottom + 376, 1073 + 200)

  return (
    <AppFrame>
      <NavBar />
      <main className="relative w-[1512px]" style={{ height: Y(footerTop) }}>
        {/* poster 82:870 */}
        <div className={`absolute h-[777px] w-[549px] overflow-hidden rounded-[25px] border border-black/10 shadow-poster ${poster.src ? "bg-white" : "bg-form-grey"}`} style={{ left: 142, top: Y(200) }}>
          {poster.src && <img alt="" src={poster.src} className={`size-full ${poster.cover ? 'object-cover' : 'object-contain'}`} />}
        </div>

        <HeaderActions e={e} role={role} onReject={() => setRejecting(true)} forceTooltip={params.get('tooltip') === 'open'} />

        <div className="absolute flex h-[465px] w-[599px] flex-col gap-[32px] overflow-hidden" style={{ left: 771, top: Y(312) }}>
          <h1 className="font-nm text-[40px] font-bold leading-[normal] tracking-[1.2px] text-ink-strong">{e.title}</h1>
          <p className="whitespace-pre-line font-hn text-[24px] font-normal leading-[28.8px] tracking-[0.72px] text-ink-body">{e.description}</p>
        </div>

        <InfoRow top={793} icon={A.tileCalendar} label="Date and time" labelTop={8}>
          <span className="absolute left-[92.5px] top-[32px] flex h-[32px] items-start whitespace-pre">
            <span className="pt-[2px] font-hn text-[28px] font-medium leading-[normal] text-ink">{dateLabel(e)}</span>
            {e.time && (
              <>
                <span className="ml-[7px] mr-[10.5px] h-[32px] w-[1.5px] shrink-0 rounded-full bg-ink" />
                <span className="-mt-px font-hn text-[32px] font-medium leading-[normal] text-ink">{e.time}</span>
              </>
            )}
          </span>
        </InfoRow>
        <InfoRow top={913} icon={A.tileMappin} label="Venue" labelTop={9}>
          <span className="absolute left-[92px] top-[33px] whitespace-nowrap font-hn text-[28px] font-medium leading-[normal] text-ink">{e.venue}</span>
        </InfoRow>

        <CountButton left={142} label="Interested" labelLeft={43} countLeft={195} count={e.interested + (reactions?.interested ? 1 : 0)} on={!!reactions?.interested} onClick={() => toggle(e.id, 'interested')} testId="interested" />
        <CountButton left={435} label="Going" labelLeft={71} countLeft={166} count={e.going + (reactions?.going ? 1 : 0)} on={!!reactions?.going} onClick={() => toggle(e.id, 'going')} testId="going" />

        {hasDetails && <MoreDetails e={e} top={detailsTop} />}

        {clubs.length > 0 && (
          <div className="absolute flex items-start" style={{ left: 142, top: Y(clubsTop) }}>
            {clubs.map((c, i) => (
              <div
                key={c.id}
                className={`relative w-[316px] rounded-[12px] bg-white shadow-club ${i === 0 ? 'h-[110px]' : 'h-[96px]'}`}
                style={{ marginLeft: i === 0 ? 0 : i === 1 ? 18 : 16 }}
              >
                <img alt="" src={c.logo} className="absolute left-[16px] top-[16px] size-[64px] rounded-[5px] object-cover" />
                <p className="absolute left-[96px] top-[25px] whitespace-pre font-hn text-[24px] font-medium leading-[normal] text-ink">{c.name}</p>
                <p className="absolute left-[96px] top-[59px] w-[208px] font-hn text-[16px] font-medium leading-[normal] text-muted">{c.tagline}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />

      {(rejecting || params.get('modal') === 'reject') && role === 'gsec' && (
        <RejectModal
          onClose={closeModal}
          onSend={(c) => {
            reject(e.id, c)
            closeModal()
            nav('/home?tab=approvals')
          }}
        />
      )}
    </AppFrame>
  )
}

function HeaderActions({ e, role, onReject, forceTooltip }: { e: InstiEvent; role: string; onReject: () => void; forceTooltip: boolean }) {
  const nav = useNavigate()
  const approve = useApp((s) => s.approve)
  const resend = useApp((s) => s.resend)
  const edit = () => nav(`/event/${e.id}/edit`)
  const share = (
    <button aria-label="Share" className="absolute size-[64px]" style={{ left: 1306, top: Y(200) }} onClick={() => navigator.clipboard?.writeText(location.href)}>
      <img alt="" src={A.share} className="size-full" />
    </button>
  )

  if (role === 'gsec') {
    // 102:1506 — shown for any status, as in Figma
    return (
      <>
        <ApproveLg className="!absolute" style={{ left: 771, top: Y(204) }} onClick={() => { approve(e.id); nav('/home?tab=approvals') }} data-testid="page-approve" />
        <RejectLg className="!absolute" style={{ left: 991, top: Y(204) }} onClick={onReject} data-testid="page-reject" />
        <EditButtonLg className="!absolute" style={{ left: 1250, top: Y(204) }} onClick={edit} data-testid="page-edit" />
      </>
    )
  }
  if (role === 'gsha' && e.createdBy === 'gsha') {
    return (
      <>
        <div className="absolute" style={{ left: 771, top: Y(204) }} data-testid="page-status">
          <StatusPillLg status={e.status} />
        </div>
        {e.status === 'rejected' && e.rejectionComment && (
          <CommentTooltip
            comment={e.rejectionComment}
            size="lg"
            forceOpen={forceTooltip}
            onResend={() => resend(e.id)}
            className="absolute"
            style={{ left: 1067, top: Y(212) }}
            trigger={<img alt="" src={A.chatDotLg} className="size-[40px]" />}
            offset={{ left: 0, top: 56 }}
          />
        )}
        <EditButtonLg className="!absolute" style={{ left: 1154, top: Y(204) }} onClick={edit} data-testid="page-edit" />
        {share}
      </>
    )
  }
  return share
}

function InfoRow({ top, icon, label, labelTop, children }: { top: number; icon: string; label: string; labelTop: number; children: ReactNode }) {
  return (
    <div className="absolute h-[64px] w-[400px]" style={{ left: 770, top: Y(top) }}>
      <span className="absolute left-0 top-0 size-[64px] rounded-[10px] bg-primary-tint" />
      <img alt="" src={icon} className="absolute left-[0.5px] top-0 size-[64px]" />
      <p className="absolute left-[92.5px] whitespace-nowrap font-hn text-[16px] font-medium leading-[normal] text-muted" style={{ top: labelTop }}>{label}</p>
      {children}
    </div>
  )
}

function CountButton(p: { left: number; label: string; labelLeft: number; countLeft: number; count: number; on: boolean; onClick: () => void; testId: string }) {
  return (
    <button
      onClick={p.onClick}
      aria-pressed={p.on}
      className={`absolute h-[56px] w-[256px] rounded-[15px] border-[1.5px] border-primary ${p.on ? 'bg-primary-tint' : 'bg-white'}`}
      style={{ left: p.left, top: Y(1017) }}
      data-testid={p.testId}
    >
      <span className="absolute top-[8.5px] whitespace-nowrap font-nm text-[28px] font-bold leading-[normal] tracking-[0.56px] text-primary" style={{ left: p.labelLeft - 1.5 }}>{p.label}</span>
      <span className="absolute top-[8.5px] whitespace-nowrap font-nm text-[28px] font-bold leading-[normal] text-primary" style={{ left: p.countLeft - 1.5 }} data-testid={`${p.testId}-count`}>{p.count}</span>
    </button>
  )
}

/** Renders "**x**" as Helvetica Neue Medium; keeps blank lines. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <p key={i} className="min-h-[28.8px]">
          {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
            part.startsWith('**') ? <span key={j} className="font-medium">{part.slice(2, -2)}</span> : <span key={j}>{part}</span>,
          )}
        </p>
      ))}
    </>
  )
}

/** 99:997 — 1228x993 "More details" card. Each block keeps its Figma slot height. */
function MoreDetails({ e, top }: { e: InstiEvent; top: number }) {
  const body = 'font-hn text-[24px] font-normal leading-[28.8px] tracking-[0.72px] text-ink-body'
  return (
    <section className="absolute w-[1228px] rounded-[20px] border border-black/15" style={{ left: 142, top: Y(top), minHeight: 993 }}>
      <h2 className="absolute left-[33px] top-[25px] w-[244px] font-nm text-[32px] font-bold leading-[normal] tracking-[0.96px] text-ink-strong">More details</h2>
      <div className="relative flex flex-col pb-[34px] pl-[33px] pr-[33px] pt-[85px]">
        <div className={body} style={slot(280, e.moreDetails)}>{e.moreDetails && <Rich text={e.moreDetails} />}</div>
        <div className="relative mt-[56px] h-[64px]">
          {e.contact && (
            <>
              <span className="absolute left-0 top-0 size-[64px] rounded-[10px] bg-primary-tint" />
              <img alt="" src={A.tilePhone} className="absolute left-0 top-0 size-[64px]" />
              <p className="absolute left-[92px] top-[11px] font-hn text-[16px] font-medium leading-[normal] text-muted">Contact</p>
              <p className="absolute left-[92px] top-[35px] w-[547px] font-hn text-[24px] font-medium leading-[normal] text-ink">{e.contact}</p>
            </>
          )}
        </div>
        <div className={`mt-[40px] whitespace-pre-line ${body}`} style={slot(107, e.regards)}>{e.regards}</div>
        <span className="mt-[44px] h-px w-[1160px] bg-black/15" />
        <div className={`mt-[43px] whitespace-pre-line ${body}`} style={slot(165, e.moreRegards)}>{e.moreRegards}</div>
        <div className="mt-[24px] flex h-[48px] gap-[24px]">
          {e.instagram !== undefined && <SocialTile icon={A.instagram} href={e.instagram} />}
          {e.website !== undefined && <SocialTile icon={A.flowerLotus} href={e.website} />}
        </div>
      </div>
    </section>
  )
}

function SocialTile({ icon, href }: { icon: string; href?: string }) {
  const tile = (
    <span className="relative block size-[48px] rounded-[10px] bg-primary-tint">
      <img alt="" src={icon} className="absolute left-[8px] top-[8px] size-[32px]" />
    </span>
  )
  return href ? <a href={href} target="_blank" rel="noreferrer">{tile}</a> : tile
}

/**
 * Figma's text boxes have fixed heights (280 / 107 / 165) and let the last line
 * overflow a few px into the gap below. Keep that for copy that roughly fits; let
 * longer, user-entered copy grow the slot instead of overlapping the next block.
 */
function slot(h: number, text?: string): CSSProperties {
  const lines = (text ?? '').split('\n').reduce((n, l) => n + Math.max(1, Math.ceil(l.length / 95)), 0)
  return lines * 28.8 <= h + 29 ? { height: h } : { minHeight: h }
}
