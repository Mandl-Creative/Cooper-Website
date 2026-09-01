/* ──────────────────────────────────────────────────────────────
   Layout B — the gate as a panel that rises to meet the reader.

   The pattern Every and the New York Times use on a metered article:
   the reader gets a screenful of the real thing with nothing asked of
   them, and then, once they move, the page hands them the ask. No
   rail, no card floating over a blur, no button that opens something
   else. The page ends here and the panel is the end.

   Why it might beat layout A: nothing competes with the article on the
   way in, so the first screen is only the paper. The ask arrives after
   the reader has decided the writing is worth their address rather
   than before they have read a word of it. Whether that trade — a
   later ask, against a form that is never visible early — actually
   converts better is the question the A/B is asking.

   Fixed to the foot of the viewport rather than parked at the end of
   the article, because it has to arrive rather than be scrolled to.
   Neither layout renders a closing banner or a footer while the paper is
   locked, so there is nothing below the panel to scroll down to. The
   reader can still go back up and re-read; they just cannot go past.

   Layout C uses this too, in place of the card it had in its rail. Same
   panel, same fields; C simply keeps the cover in the rail on its own.

   ── Two shapes, not one.

   On a desktop viewport the panel is that band at the foot of the page:
   the article stays visible above it and the ask sits under it, which is
   the whole point of the layout. A phone has nowhere near the height for
   it. The form is four fields, a captcha, a button and a line of legal —
   a full screen on any phone made — so a band capped at 88vh only
   produced a band that happened to be the size of the screen, with the
   panel's own scroll fighting the page's behind it and the close button
   scrolling away with the content.

   So below sm it is what it already was in practice, built on purpose: a
   full-screen cover with its own scroll, the close button held above it,
   and the safe area accounted for at the foot. Reported by Hygor, Aug 3.
─────────────────────────────────────────────────────────────── */

import { useEffect, useState } from 'react'
import { LockSimple, X } from '@phosphor-icons/react'
import GateFields from './WhitePaperGateFields'
import { useWhitePaperGate, type GateVariant } from '../lib/whitePaperGate'

/* ── How far the reader has to move before the panel comes up.

   A share of the viewport, so they get roughly a screenful of the report to
   read before the ask arrives rather than having it jump up on the first
   flick — but capped by what the page can actually give them, which is the
   part that was missing and which stopped the panel appearing at all.

   The locked page is short. Everything below the gate is held back while it is
   up, so the document is the findings, the summary and a few hundred pixels of
   blur, and on a desktop window that is barely taller than the window itself.
   Measured on a 1280x1319 viewport: 791px of scroll asked for, 152px of scroll
   in existence. The trigger could not be reached, and the time fallback was
   armed only when the page could not scroll at all — which this page can, just
   not nearly far enough. So the ask never arrived. Reported by Hygor, Aug 3,
   from the live page.

   Capping at a share of the real scroll room fixes that without giving up what
   the share of the viewport was for: on a phone, where the report runs to more
   than a thousand pixels of scroll, the viewport figure is still the smaller of
   the two and nothing changes.

   Measured on every check rather than once at mount, because the page grows as
   images and fonts land and a number taken at hydration describes a shorter
   document than the reader is looking at. ── */
function scrollTrigger(): number {
  const room = document.documentElement.scrollHeight - window.innerHeight
  /* Nothing meaningful to scroll: leave it to the timer rather than return a
     trigger of nought, which the first check would clear instantly. */
  if (room < 80) return Infinity
  return Math.max(80, Math.min(Math.max(460, window.innerHeight * 0.6), room * 0.6))
}

/** Shown anyway after this long, for a page that cannot give the reader enough
    scroll to reach the trigger on their own. */
const FALLBACK_MS = 6500

export default function WhitePaperGateSheet({
  onUnlock,
  /* Layouts B and C both end in this panel. They report separately so the A/B
     can tell which page around it converted, not just which form. */
  variant = 'sheet',
}: {
  onUnlock: (body: string) => void
  variant?: GateVariant
}) {
  const gate = useWhitePaperGate({ variant, onUnlock })
  const [shown, setShown] = useState(false)
  /* The reader has closed the panel with the X. It collapses to a small
     "Keep reading" tab so the paper below is theirs to read again, and the tab
     is how they bring the form back — a closed gate with no way back would just
     be a broken one. */
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const check = () => { if (window.scrollY > scrollTrigger()) setShown(true) }

    /* The initial check waits a frame rather than running here. Someone who
       reloads part-way down the page is already past the trigger, and setting
       the state synchronously would mean the hidden position never paints — the
       panel would be there rather than arrive, with no transition to animate
       from. One frame is enough for it to slide. */
    const raf = requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })

    /* Arm the fallback only where the page has little to read past: half a
       viewport of scroll or less, which on a desktop window is the whole of the
       locked page. Where there is a real scroll to make — every phone, and any
       window short enough that the report runs well past it — the reader's own
       scroll is what raises the panel, and a timer firing first would defeat the
       point of giving them room to read. */
    const room = document.documentElement.scrollHeight - window.innerHeight
    const timer = room < window.innerHeight * 0.5
      ? window.setTimeout(() => setShown(true), FALLBACK_MS)
      : undefined

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  const open = shown && !collapsed

  /* Escape collapses it, because below sm it covers the whole screen and
     anything that covers the whole screen is a dialog whether it says so or
     not. Only while it is up, so it cannot swallow the key beforehand. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCollapsed(true) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* The article does not stop, it dissolves into the panel. Fixed like the
          panel and sitting directly on top of it, so the fade tracks the page
          rather than a point in the document the reader has scrolled past. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-[59] h-[570px] bg-cream-light transition-opacity duration-700 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 62%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 62%)',
        }}
      />

      {/* The collapsed tab. Once the reader closes the panel it waits at the
          foot of the screen rather than vanishing, so the form is one tap away
          again. Only rendered after the panel has been shown at least once. */}
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="Keep reading the white paper"
        className={`fixed bottom-[18px] left-1/2 z-[60] inline-flex -translate-x-1/2 items-center gap-[7px] rounded-full border border-dark/[0.08] bg-dark px-[20px] py-[11px] font-grotesk text-[11px] font-medium uppercase tracking-[1.2px] text-cream-light shadow-[0_16px_40px_-16px_rgba(30,26,21,0.6)] transition-all duration-300 hover:scale-[1.03] ${
          shown && collapsed ? 'pointer-events-auto opacity-100' : 'pointer-events-none translate-y-[80px] opacity-0'
        }`}
      >
        <LockSimple size={13} weight="bold" /> Keep reading
      </button>

      <aside
        aria-label="Read the full white paper"
        className={`fixed inset-x-0 bottom-0 top-0 z-[60] flex flex-col bg-cream-light transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:top-auto sm:max-h-[88vh] sm:border-t sm:border-dark/[0.07] sm:shadow-[0_-30px_80px_-40px_rgba(30,26,21,0.4)] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Close the panel and hand the page back to the reader.

            In flow on a phone, so it stays put while the form scrolls under it;
            in the panel's own top-right corner from sm up, where the content is
            short enough that nothing can scroll past it.

            Inset on the phone is the panel's own 20px gutter rather than a
            tighter number of its own: at 14px it sat closer to the corner than
            anything else on the screen does and read as crowded into it. */}
        <div className="flex shrink-0 justify-end px-5 pt-[18px] sm:absolute sm:right-[18px] sm:top-[18px] sm:z-10 sm:p-0 md:right-[24px] md:top-[20px]">
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Close and keep reading the page"
            className="inline-flex size-[38px] items-center justify-center rounded-full border border-dark/[0.08] bg-cream-light/80 text-dark/55 transition-colors hover:bg-cream hover:text-dark sm:size-[34px]"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Centred in whatever height is left on a phone, rather than sitting
              against the close button with the slack at the foot. A no-op from
              sm up, where the panel is only as tall as its content. */}
          <div className="flex min-h-full flex-col justify-center">
            <div className="mx-auto w-full max-w-[1440px] px-5 pt-[6px] pb-[calc(28px+env(safe-area-inset-bottom))] sm:pt-[36px] sm:pb-[36px] md:px-10 lg:px-[62px] lg:pt-[44px] lg:pb-[44px]">
              <div className="mx-auto max-w-[560px] text-center">
                <span className="inline-flex items-center gap-[7px] font-grotesk text-[11px] font-medium uppercase tracking-[1.3px] text-accent-orange">
                  <LockSimple size={13} weight="bold" /> Keep reading
                </span>
                <h2 className="mx-auto mt-[10px] max-w-[440px] font-serif text-[25px] leading-[1.14] text-dark sm:mt-[11px] sm:text-[34px]">
                  The seven criteria, and the rest of the paper
                </h2>

                <div className="mt-[18px] sm:mt-[22px]">
                  <GateFields gate={gate} idPrefix="wps" submitLabel="Unlock to Read" columns>
                    <LockSimple size={15} weight="bold" />
                  </GateFields>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
