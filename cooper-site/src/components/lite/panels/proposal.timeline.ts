/* 05 · Draft client proposals: the page arrives written.

   What leaves the agency is a document with the agency's name on it, so
   this is a page rather than a screen: a sheet on the canvas with a second
   one behind it, a letterhead rule, the coverage lines and the number the
   client actually reads. */

import { approach, approachSpeed, charsAt, clamp, ease, kf, typeSchedule } from '../motion/engine.ts'
import { shellFrame, type ShellValues } from './shell.timeline.ts'

export const TITLE = 'Insurance proposal'
export const COVERAGES: readonly { line: string; amount: number }[] = [
  { line: 'Property', amount: 9850 },
  { line: 'General liability', amount: 5400 },
  { line: 'Commercial auto', amount: 2180 },
  { line: 'Umbrella', amount: 970 },
]
export const PREMIUM = 18400
export const PROPOSAL_END = 136
const DONE = 126
const TYPE_AT = 18
const TITLE_TYPING = typeSchedule(TITLE, 5)

export const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

export type ProposalGeo = { bodyH: number }
export type LineValues = { x: number; opacity: number; blur: number; leader: number; amount: string }
export type ProposalValues = {
  shell: ShellValues
  pageY: number
  pageBlur: number
  pageShadow: number
  backBlur: number
  title: string
  caret: boolean
  year: number
  rule: number
  prepY: number
  prepOpacity: number
  lines: LineValues[]
  total: string
  chipScale: number
  chipOpacity: number
}

/** The sheet's offset as a fraction of the body height (the prompt's S5 curve). */
const RISE: [number, number][] = [
  [0, 0.7],
  [4, 0.38],
  [8, 0.2],
  [12, 0.1],
  [16, 0.05],
  [20, 0.02],
  [26, 0],
]

export function proposalFrame(f: number, geo: ProposalGeo): ProposalValues {
  const typed = f < TYPE_AT ? 0 : charsAt(TITLE_TYPING.times, f - TYPE_AT)
  const lines = COVERAGES.map((c, i): LineValues => {
    const s = 40 + 14 * i
    return {
      x: f < s ? -10 : approach(f, s, -10, 0, 0.2, 0.2),
      opacity: kf(f, [[s, 0], [s + 3, 1]]),
      blur: f < s ? 0 : Math.min(4, approachSpeed(f, s, -10, 0, 0.2, 0.2) * 1.8),
      leader: f < s + 3 ? 0 : approach(f, s + 3, 0, 1, 0.19, 0.002),
      amount: money(kf(f, [[s + 4, 0], [s + 16, c.amount, ease.out]])),
    }
  })
  return {
    shell: shellFrame(f, DONE, clamp(kf(f, [[18, 0], [100, 0.8], [120, 1]]))),
    pageY: kf(f, RISE) * geo.bodyH,
    pageBlur: kf(f, [[0, 2], [2, 3.8], [8, 1.5], [14, 0]]),
    pageShadow: kf(f, [[0, 0.2], [26, 1, ease.out]]),
    backBlur: kf(f, [[0, 0], [20, 2.5]]),
    title: TITLE.slice(0, typed),
    caret: f >= TYPE_AT && f < TYPE_AT + TITLE_TYPING.dur + 4,
    year: kf(f, [[30, 0], [34, 1]]),
    rule: f < 22 ? 0 : approach(f, 22, 0, 1, 0.17, 0.002),
    prepY: f < 30 ? 6 : approach(f, 30, 6, 0, 0.22, 0.2),
    prepOpacity: kf(f, [[30, 0], [33, 1]]),
    lines,
    total: money(kf(f, [[100, 0], [120, PREMIUM, ease.out]])),
    chipScale: kf(f, [[118, 0], [124, 1.03, ease.out], [130, 1, ease.inOut]]),
    chipOpacity: kf(f, [[118, 0], [121, 1]]),
  }
}
