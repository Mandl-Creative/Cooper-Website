/* 01 · Complete ACORDs. The JSX is the hold frame (ACORD 126 filled, pill on
   126, "Filled"); acords.timeline.ts plays everything before it. Sheet B sits
   in flow so the panel has a height below `sm`, where it is not 16:10; sheet
   A overlays it. The tab pill is placed in percent of three equal columns, so
   the server can draw it on 126 without measuring anything. */

import { useRef, type RefObject } from 'react'
import { BlurFilter } from '../motion/BlurFilter'
import { Cursor } from '../motion/Cursor'
import { CURSOR_TIP, applyBlur, move, setStyle, setText } from '../motion/dom'
import {
  ACORDS_END,
  FIELDS_A,
  FIELDS_B,
  FILLED_B,
  TABS,
  TOTAL_B,
  acordsFrame,
  type AcordsGeo,
  type AcordsValues,
  type Field,
  type SheetValues,
} from './acords.timeline'
import { Shell } from './Shell'
import { emptyShellRefs, paintShell, type ShellRefs } from './shellPaint'
import type { PanelProps, SceneDef } from './types'
import { usePanelScene } from './usePanelScene'

type FieldRefs = {
  wash: HTMLSpanElement | null
  text: HTMLSpanElement | null
  caret: HTMLSpanElement | null
  tag: HTMLSpanElement | null
  tagFx: SVGFilterElement | null
}
type Refs = {
  shell: ShellRefs
  cursor: SVGSVGElement | null
  pill: HTMLSpanElement | null
  tabs: (HTMLSpanElement | null)[]
  count: HTMLElement | null
  total: HTMLElement | null
  sheetA: HTMLDivElement | null
  sheetAFx: SVGFilterElement | null
  sheetB: HTMLDivElement | null
  sheetBFx: SVGFilterElement | null
  fieldsA: FieldRefs[]
  fieldsB: (HTMLDivElement | null)[]
}

const makeRefs = (): Refs => ({
  shell: emptyShellRefs(),
  cursor: null,
  pill: null,
  tabs: [null, null, null],
  count: null,
  total: null,
  sheetA: null,
  sheetAFx: null,
  sheetB: null,
  sheetBFx: null,
  fieldsA: FIELDS_A.map(() => ({ wash: null, text: null, caret: null, tag: null, tagFx: null })),
  fieldsB: FIELDS_B.map(() => null),
})

/** Layout, not state: measured against the card's layout box, so the card's own entrance transform cancels out. */
function measure(r: Refs): AcordsGeo {
  const card = r.shell.card
  const tab = r.tabs[1]
  if (!card || !tab) return { start: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
  const c = card.getBoundingClientRect()
  const t = tab.getBoundingClientRect()
  return {
    start: { x: card.offsetLeft + card.offsetWidth + 90, y: card.offsetTop + card.offsetHeight + 110 },
    target: {
      x: card.offsetLeft + t.left - c.left + t.width * 0.56,
      y: card.offsetTop + t.top - c.top + t.height * 0.64,
    },
  }
}

const pillTransform = (t: number) => `translate3d(calc(${t} * (100% + 2px)), 0, 0)`

function paintSheet(el: HTMLDivElement | null, fx: SVGFilterElement | null, s: SheetValues) {
  setStyle(el, 'visibility', s.visible ? 'visible' : 'hidden')
  setStyle(el, 'transform', move(s.x))
  setStyle(el, 'opacity', s.opacity === 1 ? '' : s.opacity.toFixed(3))
  applyBlur(el, { x: s.smear, text: true }, fx)
}

function paint(v: AcordsValues, r: Refs): void {
  paintShell(v.shell, r.shell)
  paintSheet(r.sheetA, r.sheetAFx, v.sheetA)
  paintSheet(r.sheetB, r.sheetBFx, v.sheetB)
  v.fieldsA.forEach((fv, i) => {
    const n = r.fieldsA[i]
    setStyle(n.wash, 'transform', fv.wash === 1 ? '' : `scaleX(${fv.wash.toFixed(4)})`)
    setText(n.text, fv.text)
    setStyle(n.caret, 'opacity', fv.caret ? '1' : '0')
    setStyle(n.tag, 'transform', move(fv.tagX))
    setStyle(n.tag, 'opacity', fv.tagOpacity.toFixed(3))
    applyBlur(n.tag, { round: fv.tagBlur, x: fv.tagSmear, text: true }, n.tagFx)
  })
  v.fieldsB.forEach((fv, j) => {
    setStyle(r.fieldsB[j], 'transform', move(0, fv.y))
    setStyle(r.fieldsB[j], 'opacity', fv.opacity === 1 ? '' : fv.opacity.toFixed(3))
  })
  setText(r.count, String(v.count))
  setText(r.total, String(v.total))
  setStyle(r.pill, 'transform', pillTransform(Number(v.pill.toFixed(4))))
  r.tabs.forEach((t, i) => setStyle(t, 'color', v.tabColor[i]))
  setStyle(r.tabs[1], 'background-color', v.hover ? `rgba(29, 26, 23, ${(0.06 * v.hover).toFixed(3)})` : '')
  const c = v.cursor
  setStyle(r.cursor, 'opacity', c.opacity.toFixed(3))
  setStyle(
    r.cursor,
    'transform',
    c.opacity
      ? `translate3d(${(c.x - CURSOR_TIP.x).toFixed(2)}px, ${(c.y - CURSOR_TIP.y).toFixed(2)}px, 0) rotate(${c.rot.toFixed(2)}deg) scale(${c.scale.toFixed(3)})`
      : '',
  )
  applyBlur(r.cursor, { round: c.blur, extra: c.opacity ? 'drop-shadow(0 2px 3px rgba(29, 26, 23, .35))' : undefined })
}

const SCENE: SceneDef<Refs, AcordsGeo, AcordsValues> = { end: ACORDS_END, measure, frame: acordsFrame, paint }

const fieldClass = (fd: Field) => `${fd.wide ? 'sm:col-span-2' : ''} ${fd.phone ? '' : 'hidden sm:block'}`
const sheetClass =
  'grid grid-cols-1 content-start gap-x-[24px] gap-y-[12px] px-[16px] pb-[16px] pt-[16px] sm:grid-cols-2 sm:px-[24px] sm:pb-0'
const WASH =
  'absolute inset-x-0 bottom-[-1px] top-0 origin-left rounded-t-[3px] border-b border-accent-orange/40 bg-accent-orange/[.07]'

function DocIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" aria-hidden className="shrink-0">
      <path d="M3 1.5h4.6L10 3.9v7.6H3z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7.4 1.6v2.5H10" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function FieldA({ fd, i, panelRef }: { fd: Field; i: number; panelRef: RefObject<Refs> }) {
  const slot = () => panelRef.current.fieldsA[i]
  return (
    <div className={fieldClass(fd)}>
      <span className="mb-[4px] block text-[11px] font-medium leading-[14px] text-muted">{fd.label}</span>
      <span className="relative flex h-[30px] items-center border-b border-lite-line px-[8px]">
        <span ref={(el) => { slot().wash = el }} className={WASH} />
        <span className="relative flex items-center whitespace-nowrap text-[14px] text-dark-2">
          <span ref={(el) => { slot().text = el }}>{fd.value}</span>
          <span ref={(el) => { slot().caret = el }} className="ml-px inline-block h-[16px] w-[1.5px] bg-dark-2 opacity-0" />
        </span>
        <BlurFilter id={`lite-fx-acords-tag-${i}`} ref={(el) => { slot().tagFx = el }} />
        <span
          ref={(el) => { slot().tag = el }}
          className="lite-glass absolute right-[5px] top-[5px] inline-flex h-[20px] items-center gap-[5px] whitespace-nowrap rounded-full pl-[7px] pr-[9px] text-[11px] font-medium text-muted opacity-0"
        >
          <DocIcon size={10} />
          {fd.src}
        </span>
      </span>
    </div>
  )
}

export function AcordsPanel({ bind }: PanelProps) {
  const panelRef = useRef<Refs>(makeRefs())
  usePanelScene(bind, panelRef, SCENE)

  return (
    <Shell
      id="acords"
      label="Commercial application"
      working="Filling"
      done="Filled"
      holdProgress={FILLED_B / TOTAL_B}
      panelRef={panelRef}
      overlay={<Cursor ref={(el) => { panelRef.current.cursor = el }} />}
      footer={
        <>
          <span className="inline-flex items-center gap-[7px]">
            <DocIcon size={13} />
            Sourced from 4 documents in the account
          </span>
          <span className="hidden sm:inline">Ridgeline Millwork LLC</span>
        </>
      }
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-[12px] gap-y-[8px] px-[16px] pt-[16px] sm:px-[24px]">
        <span className="relative inline-grid grid-cols-3 gap-[2px] rounded-[7px] bg-lite-canvas p-[3px]">
          <span
            ref={(el) => { panelRef.current.pill = el }}
            className="absolute bottom-[3px] left-[3px] top-[3px] w-[calc((100%-10px)/3)] rounded-[5px] bg-cream-light shadow-[0_1px_2px_rgba(29,26,23,.12),0_0_0_1px_rgba(29,26,23,.06)]"
            style={{ transform: pillTransform(1) }}
          />
          {TABS.map((t, i) => (
            <span
              key={t}
              ref={(el) => { panelRef.current.tabs[i] = el }}
              className={`relative z-[1] h-[26px] whitespace-nowrap rounded-[5px] px-[12px] text-center text-[12.5px] font-medium leading-[26px] tabular-nums ${i === 1 ? 'text-dark-2' : 'text-muted'}`}
            >
              {t}
            </span>
          ))}
        </span>
        <span className="text-[12.5px] tabular-nums text-muted">
          <b ref={(el) => { panelRef.current.count = el }} className="inline-block min-w-[2ch] text-right font-medium text-dark-2">
            {FILLED_B}
          </b>{' '}
          of <span ref={(el) => { panelRef.current.total = el }}>{TOTAL_B}</span> fields
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        <BlurFilter id="lite-fx-acords-a" ref={(el) => { panelRef.current.sheetAFx = el }} />
        <BlurFilter id="lite-fx-acords-b" ref={(el) => { panelRef.current.sheetBFx = el }} />
        <div ref={(el) => { panelRef.current.sheetB = el }} className={`relative ${sheetClass}`}>
          {FIELDS_B.map((fd, j) => (
            <div key={fd.label} ref={(el) => { panelRef.current.fieldsB[j] = el }} className={fieldClass(fd)}>
              <span className="mb-[4px] block text-[11px] font-medium leading-[14px] text-muted">{fd.label}</span>
              <span className="relative flex h-[30px] items-center border-b border-lite-line px-[8px]">
                <span className={WASH} />
                <span className="relative truncate text-[14px] text-dark-2">{fd.value}</span>
              </span>
            </div>
          ))}
        </div>
        <div ref={(el) => { panelRef.current.sheetA = el }} className={`invisible absolute inset-0 ${sheetClass}`}>
          {FIELDS_A.map((fd, i) => (
            <FieldA key={fd.label} fd={fd} i={i} panelRef={panelRef} />
          ))}
        </div>
      </div>
    </Shell>
  )
}
