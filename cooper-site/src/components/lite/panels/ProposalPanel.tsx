/* 05 · Draft client proposals. The JSX is the hold: the written page on the
   canvas, the page behind it at 2.5px of blur, the total in ochre and the
   glass "Ready to review" chip on the page's bottom edge.
   proposal.timeline.ts plays the rest. */

import { useRef } from 'react'
import { applyBlur, move, setStyle, setText } from '../motion/dom'
import { COVERAGES, PREMIUM, PROPOSAL_END, TITLE, money, proposalFrame, type ProposalGeo, type ProposalValues } from './proposal.timeline'
import { Shell } from './Shell'
import { emptyShellRefs, paintShell, type ShellRefs } from './shellPaint'
import type { PanelProps, SceneDef } from './types'
import { usePanelScene } from './usePanelScene'

type Refs = {
  shell: ShellRefs
  body: HTMLDivElement | null
  back: HTMLSpanElement | null
  page: HTMLDivElement | null
  title: HTMLSpanElement | null
  caret: HTMLSpanElement | null
  year: HTMLSpanElement | null
  rule: HTMLSpanElement | null
  prep: HTMLSpanElement | null
  lines: (HTMLDivElement | null)[]
  leaders: (HTMLSpanElement | null)[]
  amounts: (HTMLSpanElement | null)[]
  total: HTMLSpanElement | null
  chip: HTMLSpanElement | null
}

const makeRefs = (): Refs => ({
  shell: emptyShellRefs(),
  body: null,
  back: null,
  page: null,
  title: null,
  caret: null,
  year: null,
  rule: null,
  prep: null,
  lines: COVERAGES.map(() => null),
  leaders: COVERAGES.map(() => null),
  amounts: COVERAGES.map(() => null),
  total: null,
  chip: null,
})

const measure = (r: Refs): ProposalGeo => ({ bodyH: r.body?.clientHeight ?? 300 })

const op = (el: HTMLElement | null, v: number) => setStyle(el, 'opacity', v === 1 ? '' : v.toFixed(3))

function paint(v: ProposalValues, r: Refs): void {
  paintShell(v.shell, r.shell)
  setStyle(r.page, 'transform', move(0, v.pageY))
  applyBlur(r.page, { round: v.pageBlur, text: true })
  setStyle(
    r.page,
    'box-shadow',
    v.pageShadow === 1
      ? ''
      : `0 ${(10 * v.pageShadow).toFixed(1)}px ${(28 * v.pageShadow).toFixed(1)}px -12px rgba(29, 26, 23, ${(0.35 * v.pageShadow).toFixed(3)})`,
  )
  applyBlur(r.back, { round: v.backBlur })
  setText(r.title, v.title)
  setStyle(r.caret, 'opacity', v.caret ? '1' : '0')
  op(r.year, v.year)
  setStyle(r.rule, 'transform', v.rule === 1 ? '' : `scaleX(${v.rule.toFixed(4)})`)
  setStyle(r.prep, 'transform', move(0, v.prepY))
  op(r.prep, v.prepOpacity)
  v.lines.forEach((l, i) => {
    setStyle(r.lines[i], 'transform', move(l.x))
    op(r.lines[i], l.opacity)
    applyBlur(r.lines[i], { round: l.blur, text: true })
    setStyle(r.leaders[i], 'transform', l.leader === 1 ? '' : `scaleX(${l.leader.toFixed(4)})`)
    setText(r.amounts[i], l.amount)
  })
  setText(r.total, v.total)
  setStyle(r.chip, 'transform', v.chipScale === 1 ? '' : `scale(${v.chipScale.toFixed(4)})`)
  op(r.chip, v.chipOpacity)
}

const SCENE: SceneDef<Refs, ProposalGeo, ProposalValues> = { end: PROPOSAL_END, measure, frame: proposalFrame, paint }

export function ProposalPanel({ bind }: PanelProps) {
  const panelRef = useRef<Refs>(makeRefs())
  usePanelScene(bind, panelRef, SCENE)

  return (
    <Shell
      id="proposal"
      label="Client proposal"
      working="Drafting"
      done="Drafted"
      holdProgress={1}
      panelRef={panelRef}
      bodyClassName="bg-lite-canvas"
      footer={
        <>
          <span>Agency template · 6 pages</span>
          <span className="hidden sm:inline">Ridgeline Millwork LLC</span>
        </>
      }
    >
      <div ref={(el) => { panelRef.current.body = el }} className="relative flex min-h-0 flex-1 justify-center px-[16px] pb-[24px] pt-[16px] sm:px-[24px]">
        {/* The page behind: just enough of it to say there is more than one. */}
        <span
          ref={(el) => { panelRef.current.back = el }}
          aria-hidden
          className="absolute bottom-[30px] top-[10px] hidden w-[72%] translate-x-[14px] -translate-y-[4px] rounded-[4px] border border-lite-line bg-cream-light/80 blur-[2.5px] sm:block"
        />
        <div
          ref={(el) => { panelRef.current.page = el }}
          className="relative flex w-full flex-col rounded-[4px] border border-lite-line bg-cream-light px-[16px] pb-[18px] pt-[14px] shadow-[0_10px_28px_-12px_rgba(29,26,23,.35)] sm:w-[78%] sm:px-[20px]"
        >
          <div className="flex items-baseline justify-between gap-[8px]">
            <span className="flex min-w-0 items-center gap-[8px]">
              <span aria-hidden className="grid size-[16px] shrink-0 place-items-center rounded-[3px] bg-dark-2">
                <span className="block size-[6px] rounded-full bg-cream-light" />
              </span>
              <span className="truncate font-serif text-[18px] leading-none text-dark-2">
                <span ref={(el) => { panelRef.current.title = el }}>{TITLE}</span>
                <span
                  ref={(el) => { panelRef.current.caret = el }}
                  className="ml-px inline-block h-[16px] w-[1.5px] translate-y-[2px] bg-dark-2 opacity-0"
                />
              </span>
            </span>
            <span ref={(el) => { panelRef.current.year = el }} className="hidden shrink-0 text-[12.5px] tabular-nums text-muted sm:inline">
              2026–27
            </span>
          </div>
          <span ref={(el) => { panelRef.current.rule = el }} className="mt-[8px] block h-[2px] origin-left bg-dark-2" />
          <span ref={(el) => { panelRef.current.prep = el }} className="mt-[8px] block truncate text-[12.5px] text-muted">
            Prepared for Ridgeline Millwork LLC
          </span>
          <div className="mt-[14px] flex flex-col gap-[10px]">
            {COVERAGES.map((c, i) => (
              <div key={c.line} ref={(el) => { panelRef.current.lines[i] = el }} className="flex items-baseline gap-[8px]">
                <span className="shrink-0 text-[14px] text-muted">{c.line}</span>
                <span ref={(el) => { panelRef.current.leaders[i] = el }} className="h-px min-w-[12px] flex-1 origin-left bg-lite-line" />
                <span ref={(el) => { panelRef.current.amounts[i] = el }} className="shrink-0 text-[14px] tabular-nums text-dark-2">
                  {money(c.amount)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-[14px] flex items-baseline justify-between gap-[8px] border-t border-dark-2/25 pt-[10px]">
            <span className="text-[12.5px] text-muted">Annual premium</span>
            <span ref={(el) => { panelRef.current.total = el }} className="font-serif text-[26px] leading-none tabular-nums text-accent-orange">
              {money(PREMIUM)}
            </span>
          </div>
          <span
            ref={(el) => { panelRef.current.chip = el }}
            className="lite-glass absolute bottom-[-13px] right-[16px] inline-flex h-[26px] items-center gap-[7px] rounded-full px-[11px] text-[12.5px] font-medium text-dark-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M2.4 6.4 5 8.8 9.7 3.6" fill="none" stroke="#d95611" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ready to review
          </span>
        </div>
      </div>
    </Shell>
  )
}
