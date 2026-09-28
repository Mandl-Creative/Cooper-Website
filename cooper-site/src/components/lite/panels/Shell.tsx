import type { ReactNode, RefObject } from 'react'
import { BlurFilter } from '../motion/BlurFilter'
import type { ShellRefs } from './shellPaint'

/**
 * The casing all six panels share, drawn in its finished state: the done
 * word with its check, the working word hidden, the progress rule at
 * `holdProgress`. That is the frame the server renders, the one a
 * reduced-motion reader sees, and the one the scene lands on.
 *
 * The status chip stacks both words in one grid cell, so it is as wide as
 * the longer of the two and never changes width while they swap.
 *
 * The outer box is the stage: 16:10 from `sm` up, content height below it.
 * It does not clip, so `overlay` (the cursor) can arrive from outside the
 * card; the plate around it clips.
 */
export function Shell({
  id,
  label,
  working,
  done,
  holdProgress,
  panelRef,
  footer,
  bodyClassName = '',
  overlay,
  children,
}: {
  id: string
  /** A node, so a panel can drop part of it on phones where the status chip needs the room. */
  label: ReactNode
  working: string
  done: string
  holdProgress: number
  panelRef: RefObject<{ shell: ShellRefs }>
  footer?: ReactNode
  bodyClassName?: string
  overlay?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="relative w-full sm:aspect-[16/10]">
      <div
        ref={(el) => { panelRef.current.shell.card = el }}
        className="flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-lite-line bg-cream-light shadow-[0_28px_70px_-14px_rgba(29,26,23,.5),0_2px_6px_rgba(29,26,23,.12)]"
      >
        <BlurFilter id={`lite-fx-${id}-card`} ref={(el) => { panelRef.current.shell.cardFx = el }} />
        <div className="relative flex h-[48px] shrink-0 items-center justify-between gap-[12px] border-b border-lite-line px-[16px] sm:px-[24px]">
          <span className="font-grotesk truncate text-[11px] uppercase tracking-[.12em] text-muted">{label}</span>
          <span className="grid h-[24px] shrink-0 items-center overflow-hidden rounded-full bg-lite-canvas px-[11px] text-[12.5px] font-medium [grid-template-areas:'s']">
            <span ref={(el) => { panelRef.current.shell.work = el }} className="flex items-center gap-[7px] text-muted opacity-0 [grid-area:s]">
              <span className="inline-flex gap-[3px]">
                {[0, 1, 2].map((j) => (
                  <i
                    key={j}
                    ref={(el) => {
                      panelRef.current.shell.dots[j] = el
                    }}
                    className="block size-[4px] rounded-full bg-muted"
                  />
                ))}
              </span>
              {working}
            </span>
            <span ref={(el) => { panelRef.current.shell.done = el }} className="flex items-center gap-[7px] text-dark-2 [grid-area:s]">
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                <path
                  ref={(el) => { panelRef.current.shell.check = el }}
                  d="M2.4 6.4 5 8.8 9.7 3.6"
                  fill="none"
                  stroke="#d95611"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="0"
                />
              </svg>
              {done}
            </span>
          </span>
          <span
            ref={(el) => { panelRef.current.shell.progress = el }}
            className="absolute bottom-[-1px] left-0 right-0 h-[2px] origin-left bg-accent-orange"
            style={{ transform: `scaleX(${holdProgress})` }}
          />
        </div>
        <div className={`relative flex min-h-0 flex-1 flex-col ${bodyClassName}`}>{children}</div>
        {/* Above the body, on the card's own colour, so anything rising through the body
            (05's page) comes up from behind the footer's edge instead of across it. */}
        {footer && (
          <div className="relative z-[1] flex shrink-0 items-center justify-between gap-[12px] border-t border-lite-line bg-cream-light px-[16px] py-[12px] text-[12.5px] text-muted sm:px-[24px]">
            {footer}
          </div>
        )}
      </div>
      {overlay}
    </div>
  )
}
