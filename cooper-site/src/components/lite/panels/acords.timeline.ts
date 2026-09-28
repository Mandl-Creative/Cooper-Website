/* 01 · Complete ACORDs: a form that fills itself.

   The card lands; Cooper types the six fields of ACORD 125 in reading order,
   each one washed in ochre just ahead of the text and tagged with the
   document it came from; the counter climbs to 38 of 41. A cursor glides in,
   presses ACORD 126, the sheet leaves left in a smear and ACORD 126 arrives
   already filled. The hold is ACORD 126, 22 of 24 fields, "Filled".

   Rules learned in the prototype: one caret at a time; sheet B starts two
   frames before sheet A is cut, under its smear, so the panel never flashes
   empty; the tags are gone before the cursor presses. */

import { approach, approachSpeed, charsAt, clamp, ease, kf, mix, typeSchedule, type Key } from '../motion/engine.ts'
import { shellFrame, type ShellValues } from './shell.timeline.ts'

export type Field = { label: string; value: string; src?: string; wide?: boolean; phone: boolean }

export const FIELDS_A: readonly Field[] = [
  { label: 'Named insured', value: 'Ridgeline Millwork LLC', src: 'Broker email', phone: true },
  { label: 'FEIN', value: '84-2117905', src: 'Dec page · p.1', phone: true },
  { label: 'Mailing address', value: '1420 Kiln Road, Bend OR', src: 'Dec page · p.1', wide: true, phone: true },
  { label: 'Business type', value: 'Millwork · Class 91340', src: 'Expiring policy', phone: false },
  { label: 'Annual payroll', value: '$1,840,000', src: 'Payroll report', phone: true },
  { label: 'Effective date', value: '01 Jul 2026', src: 'Broker email', phone: false },
]
export const FIELDS_B: readonly Field[] = [
  { label: 'Each occurrence', value: '$1,000,000', phone: true },
  { label: 'General aggregate', value: '$2,000,000', phone: true },
  { label: 'Coverage', value: 'Commercial general liability · Occurrence', wide: true, phone: true },
  { label: 'Products · completed ops', value: '$2,000,000', phone: false },
  { label: 'Personal and adv. injury', value: '$1,000,000', phone: false },
  { label: 'Class code', value: '91340 · Millwork', phone: true },
]
export const TABS = ['ACORD 125', 'ACORD 126', 'ACORD 140'] as const
const COUNTS_A = [7, 12, 19, 26, 33, 38]
export const TOTAL_A = 41
export const FILLED_B = 22
export const TOTAL_B = 24

export const ACORDS_END = 165
const FIRST = 14
const CURSOR_IN = 110
const HOVER = 128
export const PRESS = 136
export const CLICK = 140
export const B_IN = 146
export const CUT = 148
const CURSOR_OUT = 148
const DONE = 156
const RIDE = 14

type Pt = { x: number; y: number }
export type AcordsGeo = { start: Pt; target: Pt }

export type FieldValues = {
  wash: number
  text: string
  caret: boolean
  tagX: number
  tagOpacity: number
  tagBlur: number
  tagSmear: number
}
export type SheetValues = { visible: boolean; x: number; opacity: number; smear: number }
export type AcordsValues = {
  shell: ShellValues
  sheetA: SheetValues
  fieldsA: FieldValues[]
  sheetB: SheetValues
  fieldsB: { y: number; opacity: number }[]
  count: number
  total: number
  /** Pill position in tabs: 0 = ACORD 125, 1 = ACORD 126. */
  pill: number
  tabColor: [string, string, string]
  hover: number
  cursor: { x: number; y: number; rot: number; scale: number; opacity: number; blur: number }
}

/* Each field starts when the one before it is about 70% typed. */
const SCHEDULE = (() => {
  let s = FIRST
  return FIELDS_A.map((fd, i) => {
    const t = typeSchedule(fd.value, i + 1)
    const item = { s, times: t.times, e: s + t.dur }
    s += Math.max(10, Math.round(0.7 * t.dur))
    return item
  })
})()

const COUNT_TABLE: Key[] = (() => {
  const rows: Key[] = [[SCHEDULE[0].s, 0]]
  SCHEDULE.map((S, i) => [S.e, COUNTS_A[i]] as const)
    .sort((a, b) => a[0] - b[0])
    .forEach(([fr, v]) => rows.push([Math.max(fr, rows[rows.length - 1][0] + 1), v, ease.out]))
  return rows
})()

const INK = '#1d1a17'
const MUTED = '#4d4c48'

export function acordsFrame(f: number, geo: AcordsGeo): AcordsValues {
  const inB = f >= B_IN
  const nB = inB ? approach(f, B_IN, 0, FILLED_B, 0.25, 0.3) : 0
  const count = inB ? Math.round(nB) : Math.round(kf(f, COUNT_TABLE))
  const total = inB ? TOTAL_B : TOTAL_A
  const shell = shellFrame(f, DONE, (inB ? nB : kf(f, COUNT_TABLE)) / total)

  const outU = clamp((f - CLICK) / (CUT - CLICK))
  const sheetA: SheetValues = {
    visible: f < CUT,
    x: -38 * ease.in(outU),
    opacity: 1 - clamp((f - (CUT - 4)) / 4),
    smear: 8 * ease.in(outU),
  }
  const newest = SCHEDULE.reduce((acc, S, i) => (f >= S.s ? i : acc), -1)
  const fieldsA = FIELDS_A.map((fd, i): FieldValues => {
    const S = SCHEDULE[i]
    const te = S.e
    let tagX = 16
    let tagOpacity = 0
    let tagBlur = 0
    let tagSmear = 0
    if (f >= te && f < te + RIDE) {
      tagX = approach(f, te, 16, 0, 0.2)
      tagOpacity = kf(f, [[te, 0], [te + 3, 1]])
      tagBlur = Math.min(4, approachSpeed(f, te, 16, 0, 0.2) * 1.2)
    } else if (f >= te + RIDE) {
      const u = clamp((f - te - RIDE) / 8)
      tagX = 40 * ease.in(u)
      tagSmear = 5 * ease.in(u)
      tagOpacity = 1 - clamp((f - te - RIDE - 4) / 4)
    }
    return {
      wash: f < S.s - 2 ? 0 : approach(f, S.s - 2, 0, 1, 0.19, 0.002),
      text: fd.value.slice(0, f < S.s ? 0 : charsAt(S.times, f - S.s)),
      caret: i === newest && f < S.e + 4,
      tagX,
      tagOpacity,
      tagBlur,
      tagSmear,
    }
  })

  const sheetB: SheetValues = inB
    ? {
        visible: true,
        // k and eps chosen so the sheet is exactly at rest by the hold (f165).
        x: approach(f, B_IN, 38, 0, 0.22, 0.4),
        opacity: kf(f, [[B_IN, 0], [B_IN + 2, 1]]),
        smear: Math.min(8, approachSpeed(f, B_IN, 38, 0, 0.22, 0.4) * 1.1),
      }
    : { visible: false, x: 38, opacity: 0, smear: 0 }
  const fieldsB = FIELDS_B.map((_, j) => {
    const s = B_IN + j
    return { y: approach(f, s, 6, 0, 0.22, 0.3), opacity: kf(f, [[s, 0], [s + 2, 1]]) }
  })

  const sel = f < CLICK ? 0 : approach(f, CLICK, 0, 1, 0.3, 0.002)
  const hover = f < HOVER || f >= CLICK ? 0 : approach(f, HOVER, 0, 1, 0.3, 0.002)
  const pill = f < CLICK ? 0 : approach(f, CLICK, 0, 1, 0.25, 0.002)

  return {
    shell,
    sheetA,
    fieldsA,
    sheetB,
    fieldsB,
    count,
    total,
    pill,
    tabColor: [mix(INK, MUTED, sel), mix(MUTED, INK, Math.max(hover * 0.7, sel)), MUTED],
    hover,
    cursor: cursorFrame(f, geo),
  }
}

function cursorFrame(f: number, geo: AcordsGeo): AcordsValues['cursor'] {
  if (f < CURSOR_IN || f > 163) return { x: geo.target.x, y: geo.target.y, rot: 0, scale: 1, opacity: 0, blur: 0 }
  const k = 0.2
  const { start: a, target: b } = geo
  let x = approach(f, CURSOR_IN, a.x, b.x, k, 0.1)
  let y = approach(f, CURSOR_IN, a.y, b.y, k, 0.1)
  const sp = Math.hypot(approachSpeed(f, CURSOR_IN, a.x, b.x, k, 0.1), approachSpeed(f, CURSOR_IN, a.y, b.y, k, 0.1))
  const sp0 = Math.max(1e-6, Math.hypot(a.x - b.x, a.y - b.y) * -Math.log(1 - k))
  let rot = -14 * (sp / sp0) // leans into the move, straightens as it slows
  let scale = f < HOVER ? 1 : approach(f, HOVER, 1, 1.22, 0.3, 0.002)
  scale *= kf(f, [[PRESS, 1], [PRESS + 2, 0.85, ease.out], [CLICK + 1, 1, ease.out]])
  let blur = Math.min(3, sp * 0.06)
  let opacity = kf(f, [[CURSOR_IN, 0], [CURSOR_IN + 3, 1]])
  if (f > CLICK) {
    // Never frozen: a slow drift after the click.
    x += 0.35 * (f - CLICK)
    y += 0.2 * (f - CLICK)
  }
  if (f >= CURSOR_OUT) {
    const u = clamp((f - CURSOR_OUT) / 14)
    x += 160 * ease.in(u)
    y += 120 * ease.in(u)
    blur += 4 * ease.in(u)
    rot += 10 * ease.in(u)
    opacity *= 1 - clamp((f - 156) / 6)
  }
  return { x, y, rot, scale, opacity, blur }
}
