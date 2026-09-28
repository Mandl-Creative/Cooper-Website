/* 02 · Summarize loss runs. The JSX is the hold (the finished chart);
   lossRuns.timeline.ts plays the rest. The plot has a fixed 170px below
   `sm`: bars are a fraction of it, and a fraction only resolves against a
   definite height (from `sm` up the 16:10 stage provides one). The clear
   year's axis caption reads "Clear" rather than a dash. */

import { useRef } from 'react'
import { BlurFilter } from '../motion/BlurFilter'
import { applyBlur, move, setStyle, setText } from '../motion/dom'
import { LOSS_END, TOTAL, YEARS, caption, lossFrame, money, target, type LossGeo, type LossValues } from './lossRuns.timeline'
import { Shell } from './Shell'
import { emptyShellRefs, paintShell, type ShellRefs } from './shellPaint'
import type { PanelProps, SceneDef } from './types'
import { usePanelScene } from './usePanelScene'

type Refs = {
  shell: ShellRefs
  total: HTMLSpanElement | null
  sub: HTMLParagraphElement | null
  plot: HTMLDivElement | null
  axis: HTMLDivElement | null
  docs: (HTMLDivElement | null)[]
  docFx: (SVGFilterElement | null)[]
  bars: (HTMLDivElement | null)[]
  barFx: (SVGFilterElement | null)[]
  labels: (HTMLSpanElement | null)[]
  wipe: HTMLDivElement | null
  tick: HTMLSpanElement | null
}

const DOCS = [0, 1, 2]
const DOC_LINES = ['92%', '78%', '88%', '64%', '84%', '70%']
const PEAK_INDEX = YEARS.findIndex((y) => y.yy === '23')

const makeRefs = (): Refs => ({
  shell: emptyShellRefs(),
  total: null,
  sub: null,
  plot: null,
  axis: null,
  docs: DOCS.map(() => null),
  docFx: DOCS.map(() => null),
  bars: YEARS.map(() => null),
  barFx: YEARS.map(() => null),
  labels: YEARS.map(() => null),
  wipe: null,
  tick: null,
})

/** The bars are a fraction of the plot's content box; the top padding is room for the peak's label. */
const measure = (r: Refs): LossGeo => ({
  plotH: r.plot ? r.plot.clientHeight - parseFloat(getComputedStyle(r.plot).paddingTop) : 0,
})

function paint(v: LossValues, r: Refs): void {
  paintShell(v.shell, r.shell)
  setText(r.total, v.total)
  setStyle(r.sub, 'transform', move(0, v.subY))
  setStyle(r.sub, 'opacity', v.subOpacity === 1 ? '' : v.subOpacity.toFixed(3))
  v.docs.forEach((d, i) => {
    const el = r.docs[i]
    setStyle(el, 'opacity', d.opacity.toFixed(3))
    setStyle(
      el,
      'transform',
      d.opacity ? `translate3d(${d.x.toFixed(2)}px, 0, 0) rotate(${d.rot}deg) scaleY(${d.scaleY.toFixed(4)})` : '',
    )
    applyBlur(el, { x: d.blurX, y: d.blurY }, r.docFx[i])
  })
  setStyle(r.axis, 'transform', v.axis === 1 ? '' : `scaleX(${v.axis.toFixed(4)})`)
  v.bars.forEach((b, i) => {
    setStyle(r.bars[i], 'transform', b.scale === 1 ? '' : `scaleY(${b.scale.toFixed(4)})`)
    applyBlur(r.bars[i], { y: b.blurY }, r.barFx[i])
    setText(r.labels[i], b.label)
    setStyle(r.labels[i], 'transform', move(0, b.drop))
    setStyle(r.labels[i], 'opacity', b.labelOpacity === 1 ? '' : b.labelOpacity.toFixed(3))
  })
  setStyle(r.wipe, 'transform', v.wipe === 1 ? '' : `scaleY(${v.wipe.toFixed(4)})`)
  setStyle(r.tick, 'transform', v.tick === 1 ? '' : `scaleX(${v.tick.toFixed(4)})`)
}

const SCENE: SceneDef<Refs, LossGeo, LossValues> = { end: LOSS_END, measure, frame: lossFrame, paint }

export function LossRunsPanel({ bind }: PanelProps) {
  const panelRef = useRef<Refs>(makeRefs())
  usePanelScene(bind, panelRef, SCENE)

  return (
    <Shell
      id="loss"
      label={
        <>
          Loss history<span className="hidden sm:inline"> · 5 years</span>
        </>
      }
      working="Reading" done="Summarized" holdProgress={1} panelRef={panelRef}>
      {DOCS.map((i) => (
        <BlurFilter key={`d${i}`} id={`lite-fx-loss-doc-${i}`} ref={(el) => { panelRef.current.docFx[i] = el }} />
      ))}
      {YEARS.map((y, i) => (
        <BlurFilter key={`b${y.yy}`} id={`lite-fx-loss-bar-${i}`} ref={(el) => { panelRef.current.barFx[i] = el }} />
      ))}
      <div className="flex min-h-0 flex-1 flex-col px-[16px] pb-[16px] pt-[18px] sm:px-[24px] sm:pb-[20px]">
        <div className="shrink-0">
          <p className="font-serif text-[26px] leading-none tabular-nums text-dark-2">
            <span ref={(el) => { panelRef.current.total = el }}>{money(TOTAL)}</span>{' '}
            <span className="font-sans text-[14px] text-muted">incurred</span>
          </p>
          <p ref={(el) => { panelRef.current.sub = el }} className="mt-[8px] text-[12.5px] text-muted">
            8 claims · 1 clear year
          </p>
        </div>

        <div className="relative mt-[16px] flex h-[170px] shrink-0 flex-col sm:h-auto sm:min-h-0 sm:flex-1">
          <div ref={(el) => { panelRef.current.plot = el }} className="relative flex min-h-0 flex-1 items-end gap-[8px] pt-[20px] sm:gap-[12px]">
            {/* The loss runs the summary is made from: abstract paper, no carrier names. */}
            {DOCS.map((i) => (
              <div
                key={i}
                ref={(el) => { panelRef.current.docs[i] = el }}
                className="absolute bottom-0 left-[27%] z-[1] h-[78%] w-[46%] origin-bottom rounded-[4px] border border-lite-line bg-cream-light p-[10px] opacity-0 shadow-[0_8px_18px_-10px_rgba(29,26,23,.35)]"
              >
                <span className="block h-[6px] w-[42%] rounded-full bg-dark-2/60" />
                <span className="mt-[6px] block h-[4px] w-[28%] rounded-full bg-lite-line" />
                <span className="mt-[12px] flex flex-col gap-[7px]">
                  {DOC_LINES.map((w) => (
                    <span key={w} className="block h-[4px] rounded-full bg-lite-line" style={{ width: w }} />
                  ))}
                </span>
              </div>
            ))}

            {YEARS.map((y, i) => {
              const peak = i === PEAK_INDEX
              return (
                <div key={y.yy} className="relative flex h-full flex-1 flex-col justify-end">
                  {y.value === 0 ? (
                    <span ref={(el) => { panelRef.current.tick = el }} className="block h-[2px] w-full origin-left rounded-full bg-dark-2/25" />
                  ) : (
                    <div
                      ref={(el) => { panelRef.current.bars[i] = el }}
                      className="relative w-full origin-bottom rounded-t-[2px] bg-dark-2/25"
                      style={{ height: `${target(y) * 100}%` }}
                    >
                      {peak && (
                        <div ref={(el) => { panelRef.current.wipe = el }} className="absolute inset-0 origin-bottom rounded-t-[2px] bg-accent-orange" />
                      )}
                    </div>
                  )}
                  <span
                    ref={(el) => { panelRef.current.labels[i] = el }}
                    className={`absolute inset-x-0 text-center text-[12.5px] leading-none tabular-nums ${peak ? 'text-accent-orange-deep' : 'text-muted'}`}
                    style={{ bottom: `calc(${target(y) * 100}% + 6px)` }}
                  >
                    {caption(y.value)}
                  </span>
                </div>
              )
            })}
          </div>
          <div ref={(el) => { panelRef.current.axis = el }} className="h-px w-full shrink-0 bg-lite-line" />
          <div className="mt-[8px] flex shrink-0 gap-[8px] sm:gap-[12px]">
            {YEARS.map((y) => (
              <div key={y.yy} className="flex flex-1 flex-col items-center gap-[3px]">
                <span className="text-[12.5px] leading-none tabular-nums text-muted">&rsquo;{y.yy}</span>
                <span className="text-[11px] leading-none text-muted">{y.claims === 0 ? 'Clear' : `${y.claims} clm`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}
