import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnnouncementsPanel } from '../components/AnnouncementsPanel'
import { AppFrame } from '../components/AppFrame'
import { EventCard } from '../components/EventCard'
import { FilterPanel } from '../components/FilterPanel'
import { Footer } from '../components/Footer'
import { AnnouncementsButton, FloatingAdd, PageTabs, Y, type HomeTab } from '../components/HomeChrome'
import { NavBar } from '../components/NavBar'
import { RecommendedHero } from '../components/RecommendedHero'
import { RejectModal } from '../components/RejectModal'
import { StatusCard } from '../components/StatusCard'
import type { InstiEvent } from '../data/types'
import { A } from '../lib/assets'
import { applyFilters, byType, feedItems } from '../lib/events'
import { useApp } from '../store/useApp'

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()
  const role = useApp((s) => s.role)
  const events = useApp((s) => s.events)
  const filters = useApp((s) => s.filters)
  const reject = useApp((s) => s.reject)

  const requested = (params.get('tab') ?? 'recommended') as HomeTab
  const tab: HomeTab =
    (requested === 'status' && role === 'gsha') || (requested === 'approvals' && role === 'gsec') ? requested : 'recommended'
  const drawer = params.get('drawer')
  const [rejectId, setRejectId] = useState<string | null>(null)
  const modalTarget = rejectId ?? (params.get('modal') === 'reject' ? params.get('target') : null)

  const setParam = useCallback(
    (k: string, v: string | null) =>
      setParams((p) => {
        const n = new URLSearchParams(p)
        if (v === null) n.delete(k)
        else n.set(k, v)
        return n
      }),
    [setParams],
  )
  const closeDrawer = useCallback(() => setParam('drawer', null), [setParam])
  const closeModal = useCallback(() => {
    setRejectId(null)
    setParams((p) => {
      const n = new URLSearchParams(p)
      n.delete('modal')
      n.delete('target')
      return n
    })
  }, [setParams])

  const submissions = useMemo(() => events.filter((e) => e.placement === 'submission'), [events])
  const pendingCount = submissions.filter((e) => e.status === 'pending').length
  const announcements = useMemo(() => feedItems(events).filter((e) => e.type === 'announcement'), [events])

  return (
    <AppFrame>
      <NavBar />
      <main className="relative w-[1512px]" style={{ height: tab === 'recommended' ? Y(2646) : gridHeight(gridItems(tab, submissions).length) }}>
        <PageTabs role={role} active={tab} pendingCount={pendingCount} />
        <AnnouncementsButton onClick={() => setParam('drawer', 'announcements')} />
        {tab === 'recommended' ? (
          <Feed events={events} filters={filters} onFilter={() => setParam('drawer', 'filter')} />
        ) : (
          <Grid
            items={gridItems(tab, submissions)}
            variant={tab === 'status' ? 'creator' : 'approver'}
            onReject={setRejectId}
            forceTooltipId={params.get('tooltip')}
          />
        )}
      </main>
      <Footer />

      {role !== 'student' && tab === 'recommended' && <FloatingAdd onClick={() => nav('/event/new')} />}
      {drawer === 'filter' && <FilterPanel onClose={closeDrawer} />}
      {drawer === 'announcements' && <AnnouncementsPanel items={announcements} onClose={closeDrawer} />}
      {modalTarget && (
        <RejectModal
          onClose={closeModal}
          onSend={(c) => {
            reject(modalTarget, c)
            closeModal()
          }}
        />
      )}
    </AppFrame>
  )
}

/** GSHA sees only their own submissions; GSec reviews everything that was submitted. */
function gridItems(tab: HomeTab, submissions: InstiEvent[]) {
  return tab === 'status' ? submissions.filter((e) => e.createdBy === 'gsha') : submissions
}

/** 41:211: rows of 640px cards from y=256, 32px apart; footer 320px below the last row. */
const gridHeight = (n: number) => Y(256) + Math.max(1, Math.ceil(n / 4)) * 672 - 32 + 320

function Grid({
  items, variant, onReject, forceTooltipId,
}: { items: InstiEvent[]; variant: 'creator' | 'approver'; onReject: (id: string) => void; forceTooltipId: string | null }) {
  return (
    <div className="absolute grid w-[1352px] grid-cols-[repeat(4,320px)] justify-between gap-y-[32px]" style={{ left: 80, top: Y(256) }}>
      {items.map((e) => (
        <StatusCard key={e.id} e={e} variant={variant} onReject={onReject} forceTooltip={forceTooltipId === e.id} />
      ))}
    </div>
  )
}

function Feed({ events, filters, onFilter }: { events: InstiEvent[]; filters: ReturnType<typeof useApp.getState>['filters']; onFilter: () => void }) {
  const hero = feedItems(events).find((e) => e.recommended) ?? byType(events, 'event')[0]
  const evs = applyFilters(byType(events, 'event'), filters)
  const comps = byType(events, 'competition')
  return (
    <>
      {hero && <RecommendedHero e={hero} />}
      <SectionTitle top={720} label="Events" />
      <button onClick={onFilter} className="absolute h-[29px] w-[131px]" style={{ left: 1304, top: Y(731) }} data-testid="filter-by">
        <span className="absolute left-0 top-0 whitespace-nowrap font-nm text-[24px] font-bold leading-[normal] tracking-[0.48px] text-primary">Filter by</span>
        <img alt="" src={A.caretDownBlue} className="absolute left-[107px] top-[3.5px] size-[24px]" />
      </button>
      <Carousel top={795} items={evs} testId="events-row" />
      <SectionTitle top={1603} label="Competitions" />
      <Carousel top={1678} items={comps} testId="competitions-row" />
    </>
  )
}

function SectionTitle({ top, label }: { top: number; label: string }) {
  return (
    <h2 className="absolute whitespace-nowrap font-nm text-[36px] font-bold leading-[normal] tracking-[1.08px] text-ink-strong" style={{ left: 80, top: Y(top) }}>
      {label}
    </h2>
  )
}

/** Horizontal row that runs off the right edge (75:402 is 1432 wide from x=80). */
function Carousel({ top, items, testId }: { top: number; items: InstiEvent[]; testId: string }) {
  return (
    <div
      className="no-scrollbar absolute left-0 flex w-[1512px] gap-[24px] overflow-x-auto pb-[60px] pl-[80px] pr-[80px] pt-[20px]"
      style={{ top: Y(top) - 20 }}
      data-testid={testId}
    >
      {items.map((e) => (
        <EventCard key={e.id} e={e} />
      ))}
    </div>
  )
}
