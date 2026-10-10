import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { buildSeed } from '../data/seed'
import type { InstiEvent, Role } from '../data/types'

export type Day = 'Sun' | 'Sat' | 'Wed'

export type EventDraft = Pick<
  InstiEvent,
  | 'type' | 'title' | 'description' | 'moreDetails' | 'contact' | 'regards' | 'moreRegards'
  | 'instagram' | 'website' | 'date' | 'time' | 'venue' | 'clubs' | 'uploadedPoster'
>

export interface Filters {
  days: Day[]
  clubTiles: number[] // indexes of selected tiles in the filter grid
  search: string
}

interface AppState {
  role: Role
  events: InstiEvent[]
  /** what this viewer clicked; counts on the page are seed + these */
  reactions: Record<string, { interested?: boolean; going?: boolean }>
  filters: Filters
  setRole: (r: Role) => void
  toggleReaction: (id: string, kind: 'interested' | 'going') => void
  createEvent: (draft: EventDraft) => string
  updateEvent: (id: string, draft: EventDraft) => void
  approve: (id: string) => void
  reject: (id: string, comment: string) => void
  resend: (id: string) => void
  toggleDay: (d: Day) => void
  toggleClubTile: (i: number) => void
  setSearch: (s: string) => void
  resetDemo: () => void
}

const emptyFilters: Filters = { days: [], clubTiles: [], search: '' }

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      role: 'student',
      events: buildSeed(),
      reactions: {},
      filters: emptyFilters,
      setRole: (role) => set({ role }),
      toggleReaction: (id, kind) =>
        set((s) => {
          const cur = s.reactions[id] ?? {}
          return { reactions: { ...s.reactions, [id]: { ...cur, [kind]: !cur[kind] } } }
        }),
      createEvent: (draft) => {
        const role = get().role
        const id = `ev-${Date.now().toString(36)}`
        const ev: InstiEvent = {
          ...draft,
          id,
          placement: 'submission',
          interested: 0,
          going: 0,
          // GSec posts skip review (decision 3 in the plan); GSHA posts wait for approval.
          status: role === 'gsec' ? 'approved' : 'pending',
          createdBy: role === 'gsec' ? 'gsec' : 'gsha',
          createdAt: Date.now(),
        }
        set((s) => ({ events: [ev, ...s.events] }))
        return id
      },
      updateEvent: (id, draft) =>
        set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...draft } : e)) })),
      approve: (id) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, status: 'approved', rejectionComment: undefined } : e)),
        })),
      reject: (id, comment) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, status: 'rejected', rejectionComment: comment } : e)),
        })),
      resend: (id) =>
        set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, status: 'pending' } : e)) })),
      toggleDay: (d) =>
        set((s) => {
          const days = s.filters.days.includes(d) ? s.filters.days.filter((x) => x !== d) : [...s.filters.days, d]
          return { filters: { ...s.filters, days } }
        }),
      toggleClubTile: (i) =>
        set((s) => {
          const t = s.filters.clubTiles
          const clubTiles = t.includes(i) ? t.filter((x) => x !== i) : [...t, i]
          return { filters: { ...s.filters, clubTiles } }
        }),
      setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
      resetDemo: () => set({ events: buildSeed(), reactions: {}, filters: emptyFilters }),
    }),
    {
      name: 'insti-demo-v1',
      partialize: (s) => ({ role: s.role, events: s.events, reactions: s.reactions }),
    },
  ),
)

export const useEvent = (id: string | undefined) => useApp((s) => s.events.find((e) => e.id === id))
