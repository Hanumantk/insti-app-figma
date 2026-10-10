import { Link } from 'react-router-dom'
import { A } from '../lib/assets'
import { NavWordmark } from './Brand'

/** 75:581 — 1512x96 white bar. Only "Events" is a real destination in this prototype. */
export function NavBar() {
  return (
    <header className="sticky top-0 z-30 h-[96px] w-[1512px] bg-white shadow-nav">
      <Link to="/home" className="absolute left-[12px] top-[20px]" aria-label="Insti App home">
        <NavWordmark />
      </Link>
      <Link to="/home" className="absolute left-[416px] top-[28px] h-[40px] w-[95px]">
        <span className="absolute inset-0 rounded-[30px] bg-primary-tint" />
        <span className="absolute left-[18px] top-[8px] whitespace-nowrap font-nm text-[20px] font-bold leading-[normal] text-primary">Events</span>
      </Link>
      <NavText left={550} label="News" />
      <div className="absolute left-[656px] top-[36px] h-[24px] w-[78px]">
        <span className="absolute left-0 top-0 whitespace-nowrap font-nm text-[20px] font-medium leading-[normal] text-black">Blogs</span>
        <img alt="" src={A.caretDown} className="absolute left-[58px] top-[2px] size-[20px]" />
      </div>
      <NavText left={778} label="Communitites" />
      <NavText left={956} label="Map" />
      <img alt="Search" src={A.search} className="absolute left-[1051px] top-[32px] size-[32px]" />
      <div className="absolute left-[1364.5px] top-[27px] h-[35.624px] w-[36.499px]" aria-label="Notifications">
        <img alt="" src={A.bell} className="absolute left-0 top-[3.65px] h-[31.974px] w-[27px]" />
        <img alt="" src={A.badgeDot} className="absolute left-[16.5px] top-0 size-[20px]" />
        <span className="absolute left-[22.5px] top-px w-[7px] font-nm text-[14px] font-medium leading-[normal] text-white">3</span>
      </div>
      <img alt="Profile" src={A.navAvatar} className="absolute left-[1428px] top-[20px] h-[56px] w-[56px]" />
    </header>
  )
}

function NavText({ left, label }: { left: number; label: string }) {
  return (
    <span className="absolute top-[36px] whitespace-nowrap font-nm text-[20px] font-medium leading-[normal] text-black" style={{ left }}>
      {label}
    </span>
  )
}
