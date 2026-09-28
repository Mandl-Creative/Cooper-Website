/* 03 · Build submission packages. The JSX is the hold: the collated stack
   (gap 6), the 3px ochre spine, the glass "Ready to send" chip and 27 pages;
   package.timeline.ts plays the rest. */

import { useRef } from 'react'
import { BlurFilter } from '../motion/BlurFilter'
import { applyBlur, setStyle, setText } from '../motion/dom'
import { PACKAGE_END, ROWS, packageFrame, type PackageGeo, type PackageValues } from './package.timeline'
import { Shell } from './Shell'
import { emptyShellRefs, paintShell, type ShellRefs } from './shellPaint'
import type { PanelProps, SceneDef } from './types'
import { usePanelScene } from './usePanelScene'

type Refs = {
  shell: ShellRefs
  rows: (HTMLDivElement | null)[]
  rowFx: (SVGFilterElement | null)[]
  spine: HTMLSpanElement | null
  pages: HTMLElement | null
  chip: HTMLSpanElement | null
}

const makeRefs = (): Refs => ({
  shell: emptyShellRefs(),
  rows: ROWS.map(() => null),
  rowFx: ROWS.map(() => null),
  spine: null,
  pages: null,
  chip: null,
})

const measure = (r: Refs): PackageGeo => ({ rowW: r.rows[0]?.offsetWidth ?? 480 })

function paint(v: PackageValues, r: Refs): void {
  paintShell(v.shell, r.shell)
  v.rows.forEach((rv, i) => {
    const el = r.rows[i]
    setStyle(el, 'opacity', rv.opacity === 1 ? '' : rv.opacity.toFixed(3))
    setStyle(
      el,
      'transform',
      rv.x || rv.y || rv.rot
        ? `translate3d(${rv.x.toFixed(2)}px, ${rv.y.toFixed(2)}px, 0) rotate(${rv.rot.toFixed(2)}deg)`
        : '',
    )
    applyBlur(el, { x: rv.smear, text: true }, r.rowFx[i])
  })
  setStyle(
    r.spine,
    'transform',
    v.spine === 1 && v.spineWidth === 1 ? '' : `scale(${v.spineWidth.toFixed(4)}, ${v.spine.toFixed(4)})`,
  )
  setStyle(r.spine, 'background-color', v.spineColor)
  setText(r.pages, String(v.pages))
  setStyle(r.chip, 'transform', v.chipScale === 1 ? '' : `scaleX(${v.chipScale.toFixed(4)})`)
  setStyle(r.chip, 'opacity', v.chipOpacity === 1 ? '' : v.chipOpacity.toFixed(3))
}

const SCENE: SceneDef<Refs, PackageGeo, PackageValues> = { end: PACKAGE_END, measure, frame: packageFrame, paint }

export function PackagePanel({ bind }: PanelProps) {
  const panelRef = useRef<Refs>(makeRefs())
  usePanelScene(bind, panelRef, SCENE)

  return (
    <Shell
      id="package"
      label="Submission package"
      working="Assembling"
      done="Assembled"
      holdProgress={1}
      panelRef={panelRef}
      bodyClassName="bg-lite-canvas"
      footer={
        <>
          <span className="truncate">Ridgeline Millwork LLC</span>
          <span className="shrink-0 tabular-nums">
            <b ref={(el) => { panelRef.current.pages = el }} className="font-medium text-dark-2">
              27
            </b>{' '}
            pages
          </span>
        </>
      }
    >
      {ROWS.map((row, i) => (
        <BlurFilter key={row.name} id={`lite-fx-package-row-${i}`} ref={(el) => { panelRef.current.rowFx[i] = el }} />
      ))}
      <div className="px-[16px] pb-[12px] pt-[20px] sm:px-[24px]">
        <div className="relative pl-[18px]">
          {/* The spine runs exactly as far as the stack does; held at a fixed inset it hung past
              the sheets and stopped reading as a binding. */}
          <span
            ref={(el) => { panelRef.current.spine = el }}
            className="absolute bottom-0 left-[4px] top-0 w-[3px] origin-top rounded-full bg-accent-orange"
          />
          <div className="flex flex-col gap-[6px]">
            {ROWS.map((row, i) => (
              <div
                key={row.name}
                ref={(el) => { panelRef.current.rows[i] = el }}
                className="flex h-[40px] items-center gap-[10px] rounded-[6px] border border-lite-line bg-cream-light px-[12px] shadow-[0_1px_0_rgba(29,26,23,.05)]"
              >
                <span className="shrink-0 rounded-[4px] bg-lite-surface px-[6px] py-[2px] text-[11px] font-medium tracking-[.04em] text-muted">
                  {row.kind}
                </span>
                <span className="min-w-0 flex-1 truncate text-[14px] text-dark-2">{row.name}</span>
                <span className="shrink-0 text-[12.5px] tabular-nums text-muted">{row.meta}</span>
              </div>
            ))}
          </div>
        </div>
        <span
          ref={(el) => { panelRef.current.chip = el }}
          className="lite-glass mt-[12px] inline-flex h-[26px] origin-left items-center gap-[7px] rounded-full px-[11px] text-[12.5px] font-medium text-dark-2"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path d="M1.5 6 10.5 1.5 8 10.5 5.6 6.8Z" fill="none" stroke="#d95611" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          Ready to send
        </span>
      </div>
    </Shell>
  )
}
