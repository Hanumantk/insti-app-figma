import { useEffect, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LotusMark } from '../components/Brand'
import { A } from '../lib/assets'

/**
 * 1512x982 stage shared by the Loading (1:118) and Log in (1:3) frames.
 * The squiggle groups are rotated + mirrored in Figma; their relativeTransform is applied as-is.
 */
function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-page">
      <div className="relative h-[982px] w-[1512px] shrink-0 overflow-hidden bg-page" style={{ zoom: 'var(--z)' as unknown as number }}>
        <img
          alt=""
          src={A.squiggleLeft}
          className="absolute left-0 top-0 h-[580.309px] w-[730.454px] max-w-none origin-top-left"
          style={{ transform: 'matrix(-0.9690, -0.2470, -0.2470, 0.9690, 544.291, 523.735)' }}
        />
        <img
          alt=""
          src={A.squiggleRight}
          className="absolute left-0 top-0 h-[522.825px] w-[505.962px] max-w-none origin-top-left"
          style={{ transform: 'matrix(-0.5900, 0.8070, 0.8070, 0.5900, 1377.5, -229)' }}
        />
        {children}
      </div>
    </div>
  )
}

/** 1:118 — shown for ~800ms between log in and home. */
export function LoadingPage() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const next = params.get('next') ?? '/login'
  const hold = params.get('hold') === '1' // QA: keep the frame on screen
  useEffect(() => {
    if (hold) return
    const t = setTimeout(() => nav(next, { replace: true }), 800)
    return () => clearTimeout(t)
  }, [nav, next, hold])

  return (
    <Stage>
      <div className="absolute left-[656px] top-[354px]">
        <LotusMark size={200} withBackdrop={false} />
      </div>
      <p className="absolute left-[655px] top-[508px] whitespace-nowrap font-dm text-[48px] font-extrabold leading-[normal] text-navy">Insti</p>
      <p className="absolute left-[758px] top-[508px] whitespace-nowrap font-dm text-[48px] font-extrabold leading-[normal] text-navy">App</p>
    </Stage>
  )
}

/** 1:3 — every button continues as the role picked in the demo switcher. */
export function LoginPage() {
  const nav = useNavigate()
  const go = () => nav('/loading?next=/home')
  return (
    <Stage>
      <div className="absolute left-[544px] top-[167px] h-[648px] w-[424px] rounded-[30px] bg-white shadow-login" />
      <h1 className="absolute left-[643px] top-[275px] whitespace-nowrap font-nm text-[44px] font-bold leading-[normal] text-ink-strong">Get started</h1>
      <p className="absolute left-[576px] top-[340px] h-[69px] w-[360px] text-center font-nm text-[24px] font-normal leading-[36px] text-[rgba(78,78,78,0.8)]">
        All Things<span className="text-login-link"> Insti </span>- right at your fingertips.
      </p>
      <LoginButton top={487} filled onClick={go} testId="login-sso">Log In via SSO</LoginButton>
      <LoginButton top={575} filled onClick={go} testId="login-alumnus">Log In as an alumnus</LoginButton>
      <span className="absolute left-[592px] top-[670.5px] h-px w-[144px] bg-[#A3A3A3]/80" />
      <span className="absolute left-[768px] top-[670.5px] h-px w-[152px] bg-[#A3A3A3]/80" />
      <p className="absolute left-[752.5px] top-[659px] -translate-x-1/2 whitespace-nowrap text-center font-nm text-[20px] font-medium leading-[18px] text-tip-placeholder">or</p>
      <LoginButton top={711} onClick={go} testId="login-guest">Continue as guest</LoginButton>
    </Stage>
  )
}

function LoginButton({ top, filled, onClick, children, testId }: { top: number; filled?: boolean; onClick: () => void; children: ReactNode; testId: string }) {
  return (
    <button
      onClick={onClick}
      className={`absolute left-[576px] flex h-[56px] w-[360px] items-center justify-center rounded-[30px] font-nm text-[20px] font-medium leading-[18px] ${filled ? 'bg-primary text-white' : 'border-2 border-primary bg-white text-primary'}`}
      style={{ top }}
      data-testid={testId}
    >
      {children}
    </button>
  )
}
