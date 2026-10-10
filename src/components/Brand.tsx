import { A } from '../lib/assets'

/** Lotus mark as composed in Figma: a round backdrop image plus a cropped lotus layer. */
export function LotusMark({ size, withBackdrop = true }: { size: number; withBackdrop?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-full" style={{ width: size, height: size }}>
      {withBackdrop && <img alt="" src={A.logoBg} className="absolute inset-0 size-full rounded-full object-cover" />}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <img alt="" src={A.logoLotus} className="absolute left-[-18%] top-0 h-full w-[223.52%] max-w-none" />
      </div>
    </div>
  )
}

/** NavBar wordmark (75:605): 56px mark, "Insti" + "App" in DM Sans ExtraBold 36. */
export function NavWordmark() {
  return (
    <div className="relative h-[56px] w-[217px]">
      <div className="absolute left-0 top-0">
        <LotusMark size={56} />
      </div>
      <p className="absolute left-[59px] top-[4px] whitespace-nowrap font-dm text-[36px] font-extrabold leading-[normal] text-navy">Insti</p>
      <p className="absolute left-[143px] top-[4px] whitespace-nowrap font-dm text-[36px] font-extrabold leading-[normal] text-navy">App</p>
    </div>
  )
}
