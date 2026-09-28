/* 03 · Build submission packages: loose files become one package.

   A package is a set of things bound into one thing, so the panel is a stack
   on a spine, not a checklist. The step of the fan says "several" while the
   files land; the spine turning ochre says "one" once they are bound. */

import { approach, approachSpeed, clamp, ease, kf, mix, type Key } from '../motion/engine.ts'
import { shellFrame, type ShellValues } from './shell.timeline.ts'

export type Row = { kind: string; name: string; meta: string; pages: number }
export const ROWS: readonly Row[] = [
  { kind: 'PDF', name: 'ACORD 125 · 126 · 140', meta: '11 pp', pages: 11 },
  { kind: 'XLS', name: 'Statement of values', meta: '4 loc', pages: 4 },
  { kind: 'PDF', name: 'Loss summary', meta: '5 yr', pages: 5 },
  { kind: 'PDF', name: 'Expiring dec pages', meta: '6 pp', pages: 6 },
  { kind: 'DOC', name: 'Account narrative', meta: '1 p', pages: 1 },
]
export const PACKAGE_END = 136
const DONE = 126
const FAN = [1, 0.7, 0.5, 0.9, 0.3]
const TILT = [-1, 0.7, -0.5, 0.9, -0.3]
const start = (i: number) => 8 + 14 * i
const LINE = '#d4d4c9'
const OCHRE = '#d95611'

const SPINE: Key[] = [[start(0), 0], ...ROWS.map((_, i): Key => [start(i) + 10, (i + 1) / ROWS.length, ease.out])]
const PAGES: Key[] = (() => {
  let sum = 0
  return [[start(0) + 6, 0], ...ROWS.map((r, i): Key => [start(i) + 10, (sum += r.pages), ease.out])]
})()

export type PackageGeo = { rowW: number }
export type RowValues = { x: number; y: number; rot: number; opacity: number; smear: number }
export type PackageValues = {
  shell: ShellValues
  rows: RowValues[]
  spine: number
  spineWidth: number
  spineColor: string
  pages: number
  chipScale: number
  chipOpacity: number
}

export function packageFrame(f: number, geo: PackageGeo): PackageValues {
  const collate = ease.inOut(clamp((f - 92) / 20))
  const from = geo.rowW * 1.1
  const rows = ROWS.map((_, i): RowValues => {
    const s = start(i)
    return {
      x: approach(f, s, from, 0, 0.18) + 6 * FAN[i] * i * (1 - collate),
      y: 2 * i * (1 - collate),
      rot: TILT[i] * (1 - collate),
      opacity: kf(f, [[s, 0], [s + 2, 1]]),
      smear: Math.min(10, approachSpeed(f, s, from, 0, 0.18) * 0.12),
    }
  })
  const bind = kf(f, [[100, 0], [112, 1, ease.out]])
  const spine = kf(f, SPINE)
  return {
    shell: shellFrame(f, DONE, spine),
    rows,
    spine,
    spineWidth: 2 / 3 + bind / 3,
    spineColor: mix(LINE, OCHRE, bind),
    pages: Math.round(kf(f, PAGES)),
    chipScale: kf(f, [[112, 0], [122, 1.03, ease.out], [132, 1, ease.inOut]]),
    chipOpacity: kf(f, [[112, 0], [115, 1]]),
  }
}
