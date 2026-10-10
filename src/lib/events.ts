import { CLUBS, FILTER_CLUB_TILES } from '../data/seed'
import type { InstiEvent } from '../data/types'
import type { Filters } from '../store/useApp'

/** Items a student can see. Seeded submissions that mirror a feed item stay out of it. */
export function feedItems(events: InstiEvent[]) {
  return events.filter((e) => e.status === 'approved' && (e.placement === 'feed' || !e.feedRef))
}

/** Newest first, so an approved demo event shows at the front of its carousel. */
export function byType(events: InstiEvent[], type: InstiEvent['type']) {
  const items = feedItems(events).filter((e) => e.type === type)
  return [...items.filter((e) => e.placement === 'submission'), ...items.filter((e) => e.placement === 'feed')]
}

export function applyFilters(events: InstiEvent[], f: Filters) {
  const clubIds = [...new Set(f.clubTiles.map((i) => FILTER_CLUB_TILES[i]))]
  return events.filter((e) => {
    if (f.days.length && !f.days.some((d) => e.date.trim().startsWith(d))) return false
    if (clubIds.length && !clubIds.some((c) => e.clubs.includes(c))) return false
    return true
  })
}

export const clubMatches = (clubId: string, q: string) => {
  const c = CLUBS[clubId]
  const s = q.trim().toLowerCase()
  return !s || c.name.toLowerCase().includes(s) || c.tagline.toLowerCase().includes(s)
}

/** Blurb shown before "more..." on cards; seeded copy is verbatim, new events get a cut. */
export function blurb(e: InstiEvent, max = 110) {
  if (e.cardBlurb) return e.cardBlurb
  const d = e.description.replace(/\s+/g, ' ').trim()
  if (d.length <= max) return d + ' '
  return d.slice(0, d.lastIndexOf(' ', max)) + ' '
}

export const posterFor = (e: InstiEvent, kind: 'card' | 'status' | 'hero' | 'detail') => {
  if (e.uploadedPoster) return { src: e.uploadedPoster, cover: true }
  const pick = {
    card: e.cardPoster,
    status: e.statusPoster ?? e.cardPoster,
    hero: e.heroPoster ?? e.cardPoster,
    detail: e.detailPoster ?? e.cardPoster ?? e.statusPoster,
  }[kind]
  return { src: pick, cover: kind === 'detail' ? !!e.detailPoster : true }
}

export const dateLabel = (e: InstiEvent) => e.deadline ?? e.date
