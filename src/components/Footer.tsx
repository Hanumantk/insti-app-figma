import { A } from '../lib/assets'
import { LotusMark } from './Brand'

/** 75:560 — 1512x466 dark footer, identical on every page. */
export function Footer() {
  return (
    <footer className="relative h-[466px] w-[1512px] bg-footer">
      {/* 75:559: a stray 34px white rule on the footer's top edge in every frame */}
      <span className="absolute left-[696px] top-[-0.5px] h-px w-[34px] bg-white" />
      <div className="absolute left-[80px] top-[113px]">
        <LotusMark size={48} />
      </div>
      <p className="absolute left-[136px] top-[119px] whitespace-nowrap font-dm text-[28px] font-extrabold leading-[normal] text-white">Insti</p>
      <p className="absolute left-[196px] top-[119px] whitespace-nowrap font-dm text-[28px] font-extrabold leading-[normal] text-white">App</p>
      <FooterLink left={464} top={122} icon={A.chatFooter} iconTop={1} textTop={3} label="FAQs" />
      <FooterLink left={661} top={122} icon={A.checkFat} iconTop={2} textTop={4} label="Achievements" />
      <FooterLink left={925} top={124} icon={A.link} iconTop={2} textTop={4} label="Quick links" />
      <img alt="QR code" src={A.qr} className="absolute left-[1230px] top-[40px] size-[200px] rounded-[20px] object-cover" />
      <span className="absolute left-[80px] top-[279.5px] h-px w-[1350px] bg-footer-rule" />
      <p className="absolute left-[80px] top-[312px] w-[184px] font-hn text-[18px] font-bold leading-[21.6px] text-footer-text">Terms &amp; Conditions</p>
      <p className="absolute left-[80px] top-[342px] h-[59px] w-[1150px] font-hn text-[18px] font-normal leading-[21.6px] text-footer-text">
        By using this website, you agree to our terms, including proper use of the site and respect for all intellectual property. We are not responsible for inaccuracies, external links, or any damages arising from site use. Any personal information you provide will be handled as per our privacy practices. Continued use of the website indicates acceptance of any updates to these terms. For queries, contact us at the provided email.
      </p>
    </footer>
  )
}

function FooterLink(p: { left: number; top: number; icon: string; iconTop: number; textTop: number; label: string }) {
  return (
    <div className="absolute h-[32px]" style={{ left: p.left, top: p.top }}>
      <img alt="" src={p.icon} className="absolute left-0 size-[28px]" style={{ top: p.iconTop }} />
      <span className="absolute left-[36px] whitespace-nowrap font-nm text-[20px] font-medium leading-[normal] text-footer-link" style={{ top: p.textTop }}>
        {p.label}
      </span>
    </div>
  )
}
