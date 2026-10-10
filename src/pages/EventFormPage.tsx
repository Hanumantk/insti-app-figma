import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AppFrame } from '../components/AppFrame'
import { Footer } from '../components/Footer'
import { Y } from '../components/HomeChrome'
import { NavBar } from '../components/NavBar'
import { CLUBS } from '../data/seed'
import type { EventType, InstiEvent } from '../data/types'
import { A } from '../lib/assets'
import { posterFor } from '../lib/events'
import { useApp, useEvent, type EventDraft } from '../store/useApp'

const TYPES: { t: EventType; label: string }[] = [
  { t: 'event', label: 'Events ' },
  { t: 'competition', label: 'Competitions' },
  { t: 'announcement', label: 'Announcements' },
]
const CLUB_ORDER = ['culturals', 'pixels', 'rang']

export function EventFormPage() {
  const { id } = useParams()
  const role = useApp((s) => s.role)
  const existing = useEvent(id)
  if (role === 'student') return <Navigate to="/home" replace />
  if (id && !existing) return <Navigate to="/home" replace />
  return <EventForm key={id ?? 'new'} existing={existing} />
}

function draftFrom(e?: InstiEvent): EventDraft {
  return {
    type: e?.type ?? 'event',
    title: e?.title ?? '',
    description: e?.description ?? '',
    moreDetails: e?.moreDetails ?? '',
    contact: e?.contact ?? '',
    regards: e?.regards ?? '',
    moreRegards: e?.moreRegards ?? '',
    instagram: e?.instagram,
    website: e?.website,
    date: e?.deadline ?? e?.date ?? '',
    time: e?.time ?? '',
    venue: e?.venue ?? '',
    clubs: e?.clubs ?? [],
    uploadedPoster: e?.uploadedPoster,
  }
}

/** 107:1820 / 232:2597 — the form mirrors the event page layout field for field. */
function EventForm({ existing }: { existing?: InstiEvent }) {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const role = useApp((s) => s.role)
  const createEvent = useApp((s) => s.createEvent)
  const updateEvent = useApp((s) => s.updateEvent)
  const [d, setD] = useState<EventDraft>(() => draftFrom(existing))
  const [typeChosen, setTypeChosen] = useState(!!existing)
  const [menu, setMenu] = useState(params.get('select') === 'open')
  const titleRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const set = <K extends keyof EventDraft>(k: K, v: EventDraft[K]) => setD((x) => ({ ...x, [k]: v }))

  const existingPoster = existing && !d.uploadedPoster ? posterFor(existing, 'detail') : null
  const posterSrc = d.uploadedPoster ?? existingPoster?.src

  const submit = () => {
    if (!d.title.trim()) return titleRef.current?.focus()
    const clean: EventDraft = {
      ...d,
      title: d.title.trim(),
      description: d.description.trim(),
      moreDetails: d.moreDetails?.trim() || undefined,
      contact: d.contact?.trim() || undefined,
      regards: d.regards?.trim() || undefined,
      moreRegards: d.moreRegards?.trim() || undefined,
      instagram: d.instagram?.trim() ? d.instagram.trim() : existing?.instagram,
      website: d.website?.trim() ? d.website.trim() : existing?.website,
    }
    if (existing) {
      updateEvent(existing.id, clean)
      nav(`/event/${existing.id}`)
    } else {
      const nid = createEvent(clean)
      nav(role === 'gsha' ? '/home?tab=status' : `/event/${nid}`)
    }
  }

  const onFile = async (f?: File) => {
    if (!f) return
    set('uploadedPoster', await downscale(f, 549, 777))
  }

  const addClub = () => {
    const next = CLUB_ORDER.find((c) => !d.clubs.includes(c))
    if (next) set('clubs', [...d.clubs, next])
  }

  return (
    <AppFrame>
      <NavBar />
      <main className="relative w-[1512px]" style={{ height: Y(2648) }}>
        {/* poster upload, 107:1843 */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute h-[777px] w-[549px] overflow-hidden rounded-[25px] border border-form-grey bg-form-grey shadow-poster"
          style={{ left: 142, top: Y(200) }}
          data-testid="poster-upload"
        >
          {posterSrc ? (
            <img alt="" src={posterSrc} className={`size-full ${existingPoster && !existingPoster.cover ? 'bg-white object-contain' : 'object-cover'}`} />
          ) : (
            <>
              <img alt="" src={A.imageSquare} className="absolute left-[213px] top-[305px] size-[120px]" />
              <span className="absolute left-[173px] top-[433px] whitespace-nowrap font-nm text-[32px] font-medium leading-[normal] tracking-[0.96px] text-muted-2">Add an image</span>
            </>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(ev) => onFile(ev.target.files?.[0])} />

        <TypeSelect
          value={typeChosen ? d.type : null}
          open={menu}
          setOpen={setMenu}
          onPick={(t) => { set('type', t); setTypeChosen(true); setMenu(false) }}
        />

        <Label left={773} top={312}>Title</Label>
        <input
          ref={titleRef}
          value={d.title}
          onChange={(ev) => set('title', ev.target.value)}
          placeholder="Event name"
          className="absolute h-[48px] w-[599px] font-nm text-[40px] font-medium leading-[normal] tracking-[1.2px] text-ink-strong placeholder:text-muted-2"
          style={{ left: 771, top: Y(327) }}
          data-testid="f-title"
        />
        <Label left={773} top={439}>Description</Label>
        <textarea
          value={d.description}
          onChange={(ev) => set('description', ev.target.value)}
          placeholder="What event is about ?"
          className="absolute h-[280px] w-[599px] font-hn text-[24px] font-medium leading-[28.8px] tracking-[0.72px] text-ink-body placeholder:text-muted-2"
          style={{ left: 773, top: Y(462) }}
          data-testid="f-description"
        />
        <Rule left={770} top={742} width={602} />

        {/* 107:1848 date & time */}
        <FormTile left={770} top={793} icon={A.formTileCalendar} />
        <Label left={862.5} top={801} size16>Date and time</Label>
        <input
          value={d.date}
          onChange={(ev) => set('date', ev.target.value)}
          placeholder="Day"
          className="absolute h-[34px] w-[160px] font-hn text-[28px] font-medium leading-[normal] text-ink placeholder:text-muted-2"
          style={{ left: 862.5, top: Y(825) }}
          data-testid="f-date"
        />
        <span className="absolute h-[32px] w-[1.5px] rounded-full bg-ink" style={{ left: 1034.75, top: Y(821) }} />
        <input
          value={d.time}
          onChange={(ev) => set('time', ev.target.value)}
          placeholder="Time"
          className="absolute h-[38px] w-[180px] font-hn text-[32px] font-medium leading-[normal] text-ink placeholder:text-muted-2"
          style={{ left: 1046.5, top: Y(822) }}
          data-testid="f-time"
        />

        {/* 107:1858 venue */}
        <FormTile left={770} top={913} icon={A.formTileMappin} />
        <Label left={862.5} top={922} size16>Venue</Label>
        <input
          value={d.venue}
          onChange={(ev) => set('venue', ev.target.value)}
          placeholder="Music Room H-8"
          className="absolute h-[34px] w-[440px] font-hn text-[28px] font-medium leading-[normal] text-ink placeholder:text-muted-2"
          style={{ left: 862, top: Y(946) }}
          data-testid="f-venue"
        />

        {/* 107:1865 more details */}
        <section className="absolute h-[993px] w-[1228px] rounded-[20px] border border-black/15" style={{ left: 142, top: Y(1113) }}>
          <p className="absolute left-[33px] top-[50px] w-[244px] font-nm text-[16px] font-medium leading-[normal] tracking-[0.48px] text-ink-strong">More details</p>
          <textarea
            value={d.moreDetails}
            onChange={(ev) => set('moreDetails', ev.target.value)}
            placeholder="Details about the event like what is it or about ? also if any rules/note..."
            className="absolute left-[33px] top-[85px] h-[280px] w-[1160px] font-hn text-[24px] font-medium leading-[28.8px] tracking-[0.72px] text-ink-body placeholder:text-muted-2"
          />
          <span className="absolute left-[33px] top-[378px] h-px w-[1160px] bg-black/15" />
          <div className="absolute left-[33px] top-[421px] h-[64px] w-[639px]">
            <span className="absolute left-0 top-0 size-[64px] rounded-[10px] bg-form-grey" />
            <img alt="" src={A.formTilePhone} className="absolute left-0 top-0 size-[64px]" />
            <p className="absolute left-[92px] top-[11px] font-hn text-[16px] font-medium leading-[normal] text-ink-strong">Contact</p>
            <input
              value={d.contact}
              onChange={(ev) => set('contact', ev.target.value)}
              placeholder="Contact with number"
              className="absolute left-[92px] top-[33px] h-[30px] w-[547px] font-hn text-[24px] font-medium leading-[normal] text-ink placeholder:text-muted-2"
            />
          </div>
          <p className="absolute left-[33px] top-[525px] font-hn text-[16px] font-normal leading-[28.8px] tracking-[0.72px] text-ink-strong">Thanks and Regards</p>
          <textarea
            value={d.regards}
            onChange={(ev) => set('regards', ev.target.value)}
            placeholder="Add"
            className="absolute left-[33px] top-[553.8px] h-[115px] w-[1160px] font-hn text-[24px] font-medium leading-[28.8px] tracking-[0.72px] text-ink-body placeholder:text-muted-2"
          />
          <span className="absolute left-[33px] top-[676px] h-px w-[1160px] bg-black/15" />
          <p className="absolute left-[33px] top-[720px] font-hn text-[16px] font-normal leading-[28.8px] tracking-[0.48px] text-ink-strong">More Regards</p>
          <textarea
            value={d.moreRegards}
            onChange={(ev) => set('moreRegards', ev.target.value)}
            placeholder="Add"
            className="absolute left-[33px] top-[748.8px] h-[125px] w-[1160px] font-hn text-[24px] font-medium leading-[28.8px] tracking-[0.72px] text-ink-body placeholder:text-muted-2"
          />
          <span className="absolute left-[33px] top-[885px] h-px w-[1160px] bg-black/15" />
          <SocialInput left={33} icon={A.formInstagram} value={d.instagram ?? ''} onChange={(v) => set('instagram', v)} inputLeft={93} />
          <SocialInput left={172} icon={A.formLotus} value={d.website ?? ''} onChange={(v) => set('website', v)} inputLeft={232} />
        </section>

        {/* clubs row + submit */}
        <div className="absolute flex items-start" style={{ left: 142, top: Y(2162) }}>
          {d.clubs.map((cid) => {
            const c = CLUBS[cid]
            return (
              <button
                key={cid}
                type="button"
                title="Remove club"
                onClick={() => set('clubs', d.clubs.filter((x) => x !== cid))}
                className="relative mr-[16px] h-[96px] w-[316px] rounded-[12px] bg-white shadow-club"
              >
                <img alt="" src={c.logo} className="absolute left-[16px] top-[16px] size-[64px] rounded-[5px] object-cover" />
                <span className="absolute left-[96px] top-[25px] whitespace-pre font-hn text-[24px] font-medium leading-[normal] text-ink">{c.name}</span>
                <span className="absolute left-[96px] top-[59px] font-hn text-[16px] font-medium leading-[normal] text-muted">{c.tagline}</span>
              </button>
            )
          })}
          <button type="button" onClick={addClub} className="relative ml-[3px] h-[96px] w-[316px] rounded-[12px] bg-white shadow-club" data-testid="add-club">
            <span className="absolute left-[16px] top-[16px] size-[64px] rounded-[5px] bg-form-grey" />
            <span className="absolute left-[96px] top-[39px] whitespace-nowrap font-hn text-[24px] font-medium leading-[normal] text-muted-2">Add clubs</span>
          </button>
          <button type="button" onClick={addClub} aria-label="Add club" className="relative ml-[8px] h-[96px] w-[96px] rounded-[12px] bg-white shadow-club">
            <span className="absolute left-[19px] top-[1px] h-[95px] w-[58px] font-hn text-[96px] font-medium leading-[normal] text-muted-2">+</span>
          </button>
        </div>
        <button
          type="button"
          onClick={submit}
          className="absolute flex h-[64px] w-[293px] items-center justify-center rounded-[29px] border-[1.5px] border-primary bg-primary pb-[3px] font-nm text-[32px] font-bold leading-[normal] tracking-[0.64px] text-white"
          style={{ left: 1075, top: Y(2178) }}
          data-testid="f-submit"
        >
          Submit
        </button>
      </main>
      <Footer />
    </AppFrame>
  )
}

function TypeSelect({
  value, open, setOpen, onPick,
}: { value: EventType | null; open: boolean; setOpen: (o: boolean) => void; onPick: (t: EventType) => void }) {
  const label = value ? TYPES.find((x) => x.t === value)!.label.trim() : 'Select'
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="absolute flex items-start gap-[17px]"
        style={{ right: 1512 - 1432, top: Y(196) }}
        data-testid="f-type"
      >
        <span className="whitespace-nowrap font-nm text-[24px] font-bold leading-[normal] tracking-[0.48px] text-primary">{label}</span>
        <img alt="" src={A.caretDownBlue} className={`mt-[3.5px] size-[24px] ${open ? '-scale-y-100' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-10 h-[124px] w-[160px] rounded-[10px] bg-white" style={{ left: 1272, top: Y(235) }} role="listbox">
          {TYPES.map((x, i) => (
            <button
              key={x.t}
              type="button"
              role="option"
              aria-selected={value === x.t}
              onClick={() => onPick(x.t)}
              className={`absolute left-[20px] whitespace-pre font-nm text-[16px] leading-[normal] tracking-[0.32px] text-ink-strong ${value === x.t ? 'font-bold' : 'font-medium'}`}
              style={{ top: 13 + i * 39 }}
              data-testid={`f-type-${x.t}`}
            >
              {x.label}
            </button>
          ))}
          <span className="absolute left-[23px] top-[41.5px] h-px w-[114px] bg-black/15" />
          <span className="absolute left-[23px] top-[81.5px] h-px w-[114px] bg-black/15" />
        </div>
      )}
    </>
  )
}

function Label({ left, top, children, size16 }: { left: number; top: number; children: ReactNode; size16?: boolean }) {
  return (
    <p
      className={`absolute whitespace-nowrap leading-[normal] text-ink-strong ${size16 ? 'font-hn text-[16px] font-medium' : 'font-nm text-[16px] font-medium tracking-[0.48px]'}`}
      style={{ left, top: Y(top) }}
    >
      {children}
    </p>
  )
}

function Rule({ left, top, width }: { left: number; top: number; width: number }) {
  return <span className="absolute h-px bg-black/15" style={{ left, top: Y(top) - 0.5, width } as CSSProperties} />
}

function FormTile({ left, top, icon }: { left: number; top: number; icon: string }) {
  return (
    <div className="absolute size-[64px]" style={{ left, top: Y(top) }}>
      <span className="absolute left-0 top-0 size-[64px] rounded-[10px] bg-form-grey" />
      <img alt="" src={icon} className="absolute left-[0.5px] top-0 size-[64px]" />
    </div>
  )
}

function SocialInput({ left, icon, value, onChange, inputLeft }: { left: number; icon: string; value: string; onChange: (v: string) => void; inputLeft: number }) {
  return (
    <>
      <span className="absolute top-[909px] size-[48px] rounded-[10px] bg-form-grey" style={{ left }}>
        <img alt="" src={icon} className="absolute left-[8px] top-[8px] size-[32px]" />
      </span>
      <input
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        placeholder="Add"
        className="absolute top-[920px] h-[29px] w-[70px] font-hn text-[24px] font-medium leading-[28.8px] tracking-[0.72px] text-ink placeholder:text-muted-2 focus:w-[260px]"
        style={{ left: inputLeft }}
      />
    </>
  )
}

/** Cover-crop an uploaded image to the poster frame so it fits in localStorage. */
function downscale(file: File, w: number, h: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const s = Math.max(w / img.width, h / img.height)
      const dw = img.width * s
      const dh = img.height * s
      c.getContext('2d')!.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
      URL.revokeObjectURL(img.src)
      resolve(c.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
