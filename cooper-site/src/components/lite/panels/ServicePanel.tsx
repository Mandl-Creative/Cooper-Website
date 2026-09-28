/* 06 · Prepare service and renewal work. The JSX is the hold: 22 days to
   renewal, the rail continuous from the first dot to the last, the item in
   progress on a soft surface with its ring pulsing (CSS, so the frame clock
   can stop; the engine only fades the ring's wrapper in, because a running
   CSS animation would override an inline opacity on the ring itself).
   service.timeline.ts plays the rest. */

import { useRef } from 'react'
import { applyBlur, move, setStyle, setText } from '../motion/dom'
import { QUEUE, SERVICE_END, serviceFrame, type ServiceGeo, type ServiceValues } from './service.timeline'
import { Shell } from './Shell'
import { emptyShellRefs, paintShell, type ShellRefs } from './shellPaint'
import type { PanelProps, SceneDef } from './types'
import { usePanelScene } from './usePanelScene'

type Refs = {
  shell: ShellRefs
  days: HTMLSpanElement | null
  rail: HTMLSpanElement | null
  done: HTMLSpanElement | null
  dates: (HTMLSpanElement | null)[]
  texts: (HTMLSpanElement | null)[]
  dots: (HTMLSpanElement | null)[]
  ring: HTMLSpanElement | null
  surface: HTMLSpanElement | null
  chip: HTMLSpanElement | null
  cert: HTMLSpanElement | null
}

const makeRefs = (): Refs => ({
  shell: emptyShellRefs(),
  days: null,
  rail: null,
  done: null,
  dates: QUEUE.map(() => null),
  texts: QUEUE.map(() => null),
  dots: QUEUE.map(() => null),
  ring: null,
  surface: null,
  chip: null,
  cert: null,
})

const op = (el: HTMLElement | null, v: number) => setStyle(el, 'opacity', v === 1 ? '' : v.toFixed(3))

function paint(v: ServiceValues, r: Refs): void {
  paintShell(v.shell, r.shell)
  setText(r.days, String(v.days))
  setStyle(r.rail, 'transform', v.rail === 1 ? '' : `scaleY(${v.rail.toFixed(4)})`)
  setStyle(r.done, 'transform', v.done === 1 ? '' : `scaleY(${v.done.toFixed(4)})`)
  v.items.forEach((it, i) => {
    for (const el of [r.dates[i], r.texts[i]]) {
      setStyle(el, 'transform', move(it.x))
      op(el, it.opacity)
      applyBlur(el, { round: it.blur, text: true })
    }
    setStyle(r.dots[i], 'transform', it.dot === 1 ? '' : `scale(${it.dot.toFixed(4)})`)
  })
  setStyle(r.cert, 'transform', v.cert.opacity ? `translate3d(${v.cert.x.toFixed(2)}px, 0, 0) scale(${v.cert.scale.toFixed(4)})` : '')
  setStyle(r.cert, 'opacity', v.cert.opacity.toFixed(3))
  applyBlur(r.cert, { round: v.cert.blur, text: true })
  op(r.surface, v.live)
  op(r.chip, v.live)
  op(r.ring, v.live)
}

const SCENE: SceneDef<Refs, ServiceGeo, ServiceValues> = {
  end: SERVICE_END,
  measure: () => ({}),
  frame: (f) => serviceFrame(f),
  paint,
}

export function ServicePanel({ bind }: PanelProps) {
  const panelRef = useRef<Refs>(makeRefs())
  usePanelScene(bind, panelRef, SCENE)

  return (
    <Shell
      id="service"
      label="Service and renewal"
      working="Preparing"
      done="Prepared"
      holdProgress={1}
      panelRef={panelRef}
      footer={
        <>
          <span>Ridgeline Millwork LLC</span>
          <span className="hidden sm:inline">Renewal 01 Jul 2026</span>
        </>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col px-[16px] pb-[16px] pt-[18px] sm:px-[24px]">
        <div className="flex items-baseline justify-between gap-[12px]">
          <p className="font-serif text-[26px] leading-none tabular-nums text-dark-2">
            <span ref={(el) => { panelRef.current.days = el }}>22</span>{' '}
            <span className="font-sans text-[14px] text-muted">days to renewal</span>
          </p>
          <span className="shrink-0 text-[12.5px] text-muted">2 open</span>
        </div>

        <div className="relative mt-[18px]">
          {/* One rail from the first dot's centre to the last's; the ochre run is the work already out. */}
          <span
            ref={(el) => { panelRef.current.rail = el }}
            className="absolute bottom-[20px] left-[71.5px] top-[20px] w-px origin-top bg-lite-line sm:bottom-[22px] sm:top-[22px]"
          />
          <span
            ref={(el) => { panelRef.current.done = el }}
            className="absolute left-[71.5px] top-[20px] h-[80px] w-px origin-top bg-accent-orange sm:top-[22px] sm:h-[88px]"
          />
          {QUEUE.map((it, i) => {
            const now = it.state === 'now'
            return (
              <div key={it.task} className="relative flex h-[40px] items-center gap-[8px] sm:h-[44px]">
                {now && (
                  <span
                    ref={(el) => { panelRef.current.surface = el }}
                    className="absolute inset-y-[2px] left-[-8px] right-[-8px] rounded-[6px] bg-lite-surface"
                  />
                )}
                <span
                  ref={(el) => { panelRef.current.dates[i] = el }}
                  className="relative w-[56px] shrink-0 text-[12.5px] tabular-nums text-muted"
                >
                  {it.date}
                </span>
                <span className="relative flex w-[16px] shrink-0 justify-center">
                  <span
                    ref={(el) => { panelRef.current.dots[i] = el }}
                    className={`block size-[9px] rounded-full border ${
                      it.state === 'done'
                        ? 'border-accent-orange bg-accent-orange'
                        : now
                          ? 'border-accent-orange bg-cream-light'
                          : 'border-lite-line bg-cream-light'
                    }`}
                  />
                  {now && (
                    <span ref={(el) => { panelRef.current.ring = el }} className="absolute inset-0 flex items-center justify-center">
                      <span className="lite-live-ring block size-[9px] rounded-full border border-accent-orange" />
                    </span>
                  )}
                </span>
                <span
                  ref={(el) => { panelRef.current.texts[i] = el }}
                  className="relative flex min-w-0 flex-1 items-center justify-between gap-[8px]"
                >
                  <span className={`truncate text-[14px] ${it.state === 'next' ? 'text-muted' : 'text-dark-2'}`}>{it.task}</span>
                  {now && (
                    /* Ink, not ochre: 11px ochre-deep on the row's surface is 4.2:1, under AA. The
                       word carries the state on phones too ("Now"), so it is never colour alone. */
                    <span
                      ref={(el) => { panelRef.current.chip = el }}
                      className="inline-flex shrink-0 items-center gap-[5px] text-[11px] font-medium uppercase tracking-[.08em] text-dark-2"
                    >
                      <span aria-hidden className="block size-[5px] rounded-full bg-accent-orange" />
                      <span className="sm:hidden">Now</span>
                      <span className="hidden sm:inline">In progress</span>
                    </span>
                  )}
                </span>
                {i === 0 && (
                  <span
                    ref={(el) => { panelRef.current.cert = el }}
                    className="lite-glass absolute right-0 top-[-8px] z-[2] flex w-max origin-right flex-col gap-[2px] whitespace-nowrap rounded-[8px] px-[12px] py-[8px] opacity-0 sm:left-[58%] sm:right-auto sm:origin-left"
                  >
                    <span className="text-[12.5px] font-medium text-dark-2">Certificate of insurance</span>
                    <span className="text-[11px] text-muted">Holder: Northgate · GL $2M / $4M</span>
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Shell>
  )
}
