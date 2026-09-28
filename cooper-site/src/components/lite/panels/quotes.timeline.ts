/* 04 · Compare quotes: three different PDFs become one comparison.

   A comparison read across rows is a table; read down columns it is a
   comparison. Premium leads because it is what gets looked at first. The
   rows have a fixed height so the three columns line up by construction,
   and the hairline guides that draw across them during the story are there
   to show it. The accent marks the insight (what market B's lower premium
   costs), not a recommendation. */

import { approach, approachSpeed, clamp, ease, kf } from '../motion/engine.ts'
import { shellFrame, type ShellValues } from './shell.timeline.ts'

export type Market = { name: string; premium: number; rows: readonly [string, string, string, string] }
export const MARKETS: readonly Market[] = [
  { name: 'Market A', premium: 18400, rows: ['$2M', '$4M', '$250k', '$10,000'] },
  { name: 'Market B', premium: 14900, rows: ['$1M', '$2M', 'Excluded', '$25,000'] },
  { name: 'Market C', premium: 21150, rows: ['$2M', '$4M', '$500k', '$5,000'] },
]
/** [full label, short label for phones] */
export const ROW_LABELS: readonly (readonly [string, string])[] = [
  ['Each occurrence', 'Occurrence'],
  ['Aggregate', 'Aggregate'],
  ['Flood sublimit', 'Flood'],
  ['Deductible', 'Deductible'],
]
export const NOTE = 'Lowest premium, highest deductible.'
export const QUOTES_END = 150
const DONE = 132
const CURSOR_IN = 96
export const HOVER = 118
const CURSOR_OUT = 136

export const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

type Pt = { x: number; y: number }
/** guides: y of the two guide rows inside the columns box; drop: how far above its slot a raw document starts. */
export type QuotesGeo = { guides: [number, number]; drop: number; start: Pt; target: Pt }
export type QuotesValues = {
  shell: ShellValues
  raw: { y: number; opacity: number; blurX: number; blurY: number }[]
  cols: { y: number; opacity: number; blur: number }[]
  guides: { top: number; scale: number; opacity: number; blur: number }[]
  premiums: string[]
  underline: number
  note: { scale: number; opacity: number }
  leader: number
  cursor: { x: number; y: number; rot: number; scale: number; opacity: number; blur: number }
}

export function quotesFrame(f: number, geo: QuotesGeo): QuotesValues {
  const raw = MARKETS.map((_, i) => {
    const s = 8 + 5 * i
    const dissolve = ease.in(clamp((f - (40 + 3 * i)) / 12))
    const fall = Math.min(8, approachSpeed(f, s, -geo.drop, 0, 0.17) * 0.9)
    return {
      y: approach(f, s, -geo.drop, 0, 0.17),
      opacity: f < s ? 0 : kf(f, [[s, 0], [s + 2, 1]]) * (1 - clamp((f - (48 + 3 * i)) / 4)),
      blurX: 8 * dissolve,
      blurY: Math.max(8 * dissolve, fall),
    }
  })
  const cols = MARKETS.map((_, i) => {
    const s = 44 + 3 * i
    return {
      y: f < s ? 12 : approach(f, s, 12, 0, 0.2, 0.2),
      opacity: kf(f, [[s, 0], [s + 3, 1]]),
      blur: f < s ? 0 : Math.min(4, approachSpeed(f, s, 12, 0, 0.2, 0.2) * 1.2),
    }
  })
  const leave = ease.in(clamp((f - 62) / 8))
  const guides = [0, 1].map((g) => {
    const s = 50 + 4 * g
    return {
      top: geo.guides[g],
      scale: f < s ? 0 : approach(f, s, 0, 1, 0.19, 0.002),
      opacity: f < s ? 0 : 1 - leave,
      blur: 3 * leave,
    }
  })
  return {
    shell: shellFrame(f, DONE, kf(f, [[8, 0], [64, 0.6], [100, 1]])),
    raw,
    cols,
    guides,
    premiums: MARKETS.map((m, i) => money(kf(f, [[60 + 4 * i, 0], [92 + 4 * i, m.premium, ease.out]]))),
    underline: kf(f, [[HOVER, 0], [HOVER + 8, 1, ease.out]]),
    note: { scale: kf(f, [[120, 0], [126, 1.03, ease.out], [132, 1, ease.inOut]]), opacity: kf(f, [[120, 0], [123, 1]]) },
    leader: kf(f, [[124, 0], [132, 1, ease.out]]),
    cursor: cursorFrame(f, geo),
  }
}

function cursorFrame(f: number, geo: QuotesGeo): QuotesValues['cursor'] {
  if (f < CURSOR_IN || f > 149) return { x: geo.target.x, y: geo.target.y, rot: 0, scale: 1, opacity: 0, blur: 0 }
  const k = 0.2
  const { start: a, target: b } = geo
  let x = approach(f, CURSOR_IN, a.x, b.x, k, 0.1)
  let y = approach(f, CURSOR_IN, a.y, b.y, k, 0.1)
  const sp = Math.hypot(approachSpeed(f, CURSOR_IN, a.x, b.x, k, 0.1), approachSpeed(f, CURSOR_IN, a.y, b.y, k, 0.1))
  const sp0 = Math.max(1e-6, Math.hypot(a.x - b.x, a.y - b.y) * -Math.log(1 - k))
  // Coming from the left, it leans the other way from 01's.
  let rot = 10 * (sp / sp0)
  const scale = f < HOVER ? 1 : approach(f, HOVER, 1, 1.22, 0.3, 0.002)
  let blur = Math.min(3, sp * 0.06)
  let opacity = kf(f, [[CURSOR_IN, 0], [CURSOR_IN + 3, 1]])
  if (f > HOVER) {
    x += 0.3 * (f - HOVER)
    y += 0.15 * (f - HOVER)
  }
  if (f >= CURSOR_OUT) {
    const u = clamp((f - CURSOR_OUT) / 12)
    x -= 150 * ease.in(u)
    y += 120 * ease.in(u)
    blur += 4 * ease.in(u)
    rot -= 10 * ease.in(u)
    opacity *= 1 - clamp((f - 143) / 6)
  }
  return { x, y, rot, scale, opacity, blur }
}
