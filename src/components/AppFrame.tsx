import { useLayoutEffect, type ReactNode } from 'react'

export const CANVAS_W = 1512

/**
 * Every Figma frame is 1512 wide. The layout is never re-flowed: wider viewports
 * centre the canvas, narrower ones scale it down with CSS zoom.
 */
export function useCanvasZoom() {
  useLayoutEffect(() => {
    const apply = () => {
      const z = Math.min(1, document.documentElement.clientWidth / CANVAS_W)
      document.documentElement.style.setProperty('--z', String(z))
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])
}

export function AppFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen w-full bg-page">
      <div
        className={`relative mx-auto w-[1512px] bg-page ${className}`}
        style={{ zoom: 'var(--z)' as unknown as number }}
      >
        {children}
      </div>
    </div>
  )
}

/** Fixed layer aligned to the 1512 canvas (render inside AppFrame — it inherits the canvas zoom). */
export function OverlayStage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`fixed inset-0 z-40 ${className}`}>
      <div className="relative mx-auto h-full w-[1512px]">{children}</div>
    </div>
  )
}
