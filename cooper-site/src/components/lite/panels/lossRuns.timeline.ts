/* 02 · Summarize loss runs: five years become one chart.

   "Summarize" is the verb, so the panel is the summary and not the table it
   was made from. Bars are scaled off the largest year, so 2023 reads as the
   outlier it is; the clear year gets a baseline tick instead of nothing,
   because a missing bar and a zero bar look the same. Bars rise by scaleY
   from the bottom (never by height, which would reflow the labels). */

import { approach, approachSpeed, clamp, ease, kf } from '../motion/engine.ts'
import { shellFrame, type ShellValues } from './shell.timeline.ts'

export type Year = { yy: string; value: number; claims: number }
export const YEARS: readonly Year[] = [
  { yy: '21', value: 14200, claims: 2 },
  { yy: '22', value: 0, claims: 0 },
  { yy: '23', value: 61900, claims: 3 },
  { yy: '24', value: 8400, claims: 1 },
  { yy: '25', value: 23700, claims: 2 },
]
export const PEAK = 61900
export const TOTAL = 108200
export const LOSS_END = 124
const DONE = 104
const WIPE = 94
/** Rise order and speed: the peak last and slower. */
const RISE: Record<string, { s: number; k: number }> = {
  '21': { s: 52, k: 0.15 },
  '22': { s: 58, k: 0.25 },
  '24': { s: 64, k: 0.15 },
  '25': { s: 70, k: 0.15 },
  '23': { s: 76, k: 0.12 },
}
const DOC_ROT = [-3, 1, 4]

/** Height as a fraction of the plot, with a floor so a small year still reads as a bar. */
export const target = (y: Year) => (y.value === 0 ? 0 : Math.max(y.value / PEAK, 0.07))
export const caption = (value: number) => (value === 0 ? 'None' : `$${(value / 1000).toFixed(1)}k`)
export const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

export type LossGeo = { plotH: number }
export type DocValues = { x: number; rot: number; scaleY: number; opacity: number; blurX: number; blurY: number }
export type BarValues = { scale: number; drop: number; label: string; labelOpacity: number; blurY: number }
export type LossValues = {
  shell: ShellValues
  total: string
  subY: number
  subOpacity: number
  docs: DocValues[]
  axis: number
  bars: BarValues[]
  wipe: number
  tick: number
}

export function lossFrame(f: number, geo: LossGeo): LossValues {
  const squash = ease.in(clamp((f - 40) / 16)) // f40 → f56, accelerating into the baseline
  const docs = DOC_ROT.map((rot, i): DocValues => {
    const s = 6 + 4 * i
    const landed = s + 14
    return {
      x: approach(f, s, -160, 0, 0.17) + 0.3 * Math.max(0, f - landed) * (1 - squash),
      rot,
      scaleY: 1 - 0.98 * squash,
      opacity: f < s ? 0 : kf(f, [[s, 0], [s + 3, 1], [52, 1], [56, 0]]),
      blurX: Math.min(6, approachSpeed(f, s, -160, 0, 0.17) * 0.25),
      blurY: 6 * squash,
    }
  })

  const bars = YEARS.map((y): BarValues => {
    const t = target(y)
    const { s, k } = RISE[y.yy]
    const frac = t === 0 || f < s ? 0 : approach(f, s, 0, 1, k, 0.003)
    const speed = t === 0 || f < s ? 0 : approachSpeed(f, s, 0, 1, k, 0.003) * t * geo.plotH
    return {
      scale: frac,
      drop: t === 0 ? 0 : (1 - frac) * t * geo.plotH,
      label: caption(y.value * frac),
      labelOpacity: f < s ? 0 : kf(f, [[s, 0], [s + 3, 1]]),
      blurY: Math.min(5, speed * 0.35),
    }
  })
  const risen = bars.filter((_, i) => YEARS[i].value > 0)
  const progress = risen.reduce((a, b) => a + b.scale, 0) / risen.length

  return {
    shell: shellFrame(f, DONE, progress),
    total: money(kf(f, [[70, 0], [108, TOTAL, ease.out]])),
    subY: f < 96 ? 8 : approach(f, 96, 8, 0, 0.2, 0.2),
    subOpacity: kf(f, [[96, 0], [99, 1]]),
    docs,
    axis: f < 44 ? 0 : approach(f, 44, 0, 1, 0.19, 0.002),
    bars,
    wipe: kf(f, [[WIPE, 0], [WIPE + 6, 1, ease.out]]),
    tick: f < RISE['22'].s ? 0 : approach(f, RISE['22'].s, 0, 1, 0.25, 0.002),
  }
}
