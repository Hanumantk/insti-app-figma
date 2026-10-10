import { CLUBS, FILTER_CLUB_TILES } from '../data/seed'
import { A } from '../lib/assets'
import { clubMatches } from '../lib/events'
import { useApp, type Day } from '../store/useApp'
import { OverlayStage } from './AppFrame'

const DAYS: { d: Day; left: number }[] = [
  { d: 'Sun', left: 24 },
  { d: 'Sat', left: 120 },
  { d: 'Wed', left: 216 },
]

/** 143:874 — "Filter by" drawer: 400x846 panel at (1088, 116) over a light dim below the nav. */
export function FilterPanel({ onClose }: { onClose: () => void }) {
  const f = useApp((s) => s.filters)
  const toggleDay = useApp((s) => s.toggleDay)
  const toggleClubTile = useApp((s) => s.toggleClubTile)
  const setSearch = useApp((s) => s.setSearch)

  const tiles = FILTER_CLUB_TILES.map((id, i) => ({ id, i })).filter((t) => clubMatches(t.id, f.search))

  return (
    <OverlayStage>
      {/* 143:562 backdrop: 0,96 → bottom, linear black→#666 at 20% alpha, 50% fill opacity */}
      <button
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-x-0 bottom-0 top-[96px] cursor-default"
        style={{ background: 'linear-gradient(270deg, rgba(0,0,0,0.1), rgba(102,102,102,0.1))' }}
      />
      <aside className="no-scrollbar absolute left-[1088px] top-[116px] h-[846px] max-h-[calc(100%-136px)] w-[400px] overflow-y-auto rounded-[5px] bg-white shadow-filter" data-testid="filter-panel">
        <div className="absolute left-[24px] top-[27px] h-[29px] w-[131px]">
          <p className="absolute left-0 top-0 whitespace-nowrap font-nm text-[24px] font-bold leading-[normal] tracking-[0.48px] text-primary">Filter by</p>
          <img alt="" src={A.caretDownBlue2} className="absolute left-[107px] top-[3.5px] size-[24px]" />
        </div>
        <button aria-label="Close" onClick={onClose} className="absolute left-[352px] top-[31px] size-[24px]" data-testid="filter-close">
          <img alt="" src={A.x} className="size-full" />
        </button>
        <span className="absolute left-[8px] top-[71.5px] h-px w-[384px] bg-black/10" />

        {/* search */}
        <div className="absolute left-[24px] top-[90px] h-[40px] w-[352px] rounded-[5px] border border-primary bg-[#fbfbfb]" />
        <input
          value={f.search}
          onChange={(ev) => setSearch(ev.target.value)}
          placeholder="Search clubs..."
          className="absolute left-[46px] top-[91px] h-[38px] w-[270px] pt-[3px] font-hn text-[18px] font-normal leading-[21.6px] text-ink placeholder:text-[rgba(112,112,112,0.4)]"
        />
        <span className="absolute left-[324.5px] top-[98px] h-[23px] w-px bg-[#BEC3C9]/80" />
        <img alt="" src={A.searchBlue} className="absolute left-[337px] top-[98px] size-[24px]" />

        <p className="absolute left-[24px] top-[154px] font-hn text-[16px] font-medium leading-[normal] text-ink-strong">Day and date</p>
        {DAYS.map(({ d, left }) => {
          const on = f.days.includes(d)
          return (
            <button
              key={d}
              onClick={() => toggleDay(d)}
              aria-pressed={on}
              className={`absolute top-[186px] flex h-[32px] w-[80px] items-center justify-center rounded-[5px] border-2 bg-white pt-[2px] font-hn text-[16px] font-medium leading-[21.6px] ${on ? 'border-primary text-primary' : 'border-[rgba(137,137,137,0.6)] text-muted-3'}`}
              style={{ left }}
              data-testid={`day-${d}`}
            >
              {d}
            </button>
          )
        })}
        <p className="absolute left-[1px] top-[250px] flex h-[30px] w-[78px] items-center justify-center pt-[2px] font-hn text-[16px] font-medium leading-[21.6px] text-silver">Date</p>
        <span className="absolute left-[70.5px] top-[253px] h-[23px] w-px bg-muted-3" />
        <p className="absolute left-[71px] top-[250px] flex h-[30px] w-[78px] items-center justify-center pt-[2px] font-hn text-[16px] font-medium leading-[21.6px] text-silver">Month</p>

        <p className="absolute left-[24px] top-[304px] font-hn text-[16px] font-medium leading-[normal] text-ink-strong">Time</p>
        <p className="absolute left-[25px] top-[336px] w-[100px] font-hn text-[20px] font-medium leading-[21.6px] text-silver">
          <span className="text-muted-3">00</span>:00 PM
        </p>

        <p className="absolute left-[24px] top-[386px] font-hn text-[16px] font-medium leading-[normal] text-ink-strong">Clubs</p>
        {tiles.map(({ id, i }, k) => {
          const c = CLUBS[id]
          const on = f.clubTiles.includes(i)
          return (
            <button
              key={i}
              onClick={() => toggleClubTile(i)}
              aria-pressed={on}
              className={`absolute h-[48px] w-[168px] rounded-[12px] border bg-white shadow-tile ${on ? 'border-primary' : 'border-[0.5px] border-silver'}`}
              style={{ left: k % 2 ? 208 : 24, top: 422 + Math.floor(k / 2) * 64 }}
              data-testid="club-tile"
            >
              <img alt="" src={c.logo} className="absolute left-[7.5px] top-[7.5px] size-[32px] rounded-[5px] object-cover" />
              <span className="absolute left-[47.5px] top-[10.5px] whitespace-pre font-hn text-[12px] font-medium leading-[normal] text-ink">{c.name}</span>
              <span className="absolute left-[47.5px] top-[26.5px] whitespace-nowrap font-hn text-[12px] font-normal leading-[normal] text-muted">{c.tagline}</span>
            </button>
          )
        })}
      </aside>
    </OverlayStage>
  )
}
