import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import type { Role } from '../data/types'
import { useApp } from '../store/useApp'

const ROLES: { r: Role; label: string }[] = [
  { r: 'student', label: 'Student' },
  { r: 'gsha', label: 'GSHA' },
  { r: 'gsec', label: 'GSec' },
]

/**
 * Demo control — deliberately NOT part of the Figma design (neutral dark pill, 12px).
 * Hidden with ?demo=0 for clean screenshots.
 */
export function RoleSwitcher() {
  const [params] = useSearchParams()
  const { pathname, search } = useLocation()
  const nav = useNavigate()
  const role = useApp((s) => s.role)
  const setRole = useApp((s) => s.setRole)
  const resetDemo = useApp((s) => s.resetDemo)

  if (params.get('demo') === '0') return null

  const pick = (r: Role) => {
    setRole(r)
    const tab = params.get('tab')
    const onForm = pathname === '/event/new' || pathname.endsWith('/edit')
    if (r === 'student' && onForm) return nav('/home')
    if (pathname === '/home' && tab) {
      const ok = (tab === 'status' && r === 'gsha') || (tab === 'approvals' && r === 'gsec')
      if (!ok) return nav('/home')
    }
    nav(pathname + search, { replace: true })
  }

  return (
    <div
      className="fixed bottom-[16px] left-[16px] z-[100] flex items-center gap-[2px] rounded-full bg-[#111]/90 p-[4px] font-[system-ui,sans-serif] text-[12px] leading-none text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] backdrop-blur"
      role="group"
      aria-label="Demo role"
      data-testid="role-switcher"
    >
      <span className="px-[8px] text-white/50">View as</span>
      {ROLES.map(({ r, label }) => (
        <button
          key={r}
          onClick={() => pick(r)}
          aria-pressed={role === r}
          className={`rounded-full px-[10px] py-[6px] ${role === r ? 'bg-white text-[#111]' : 'text-white/80 hover:bg-white/10'}`}
          data-testid={`role-${r}`}
        >
          {label}
        </button>
      ))}
      <span className="mx-[4px] h-[14px] w-px bg-white/20" />
      <button
        onClick={() => { if (confirm('Reset the demo data to the Figma seed?')) resetDemo() }}
        className="rounded-full px-[10px] py-[6px] text-white/60 hover:bg-white/10"
        title="Reset demo data"
      >
        Reset
      </button>
    </div>
  )
}
