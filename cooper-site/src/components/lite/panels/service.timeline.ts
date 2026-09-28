/* 06 · Prepare service and renewal work: a run of dates, walked.

   Service work is not a document, it is a calendar. So this one is a run of
   dates: what is already out, what is in progress, and the renewal the whole
   thing walks toward. Filled dot = done, ringed dot = now, hollow = next. */

import { approach, approachSpeed, clamp, ease, kf, type Key } from '../motion/engine.ts'
import { shellFrame, type ShellValues } from './shell.timeline.ts'

export type QueueItem = { date: string; task: string; state: 'done' | 'now' | 'next' }
export const QUEUE: readonly QueueItem[] = [
  { date: '12 May', task: 'Certificate issued · Northgate', state: 'done' },
  { date: '28 May', task: 'Additional insured endorsement', state: 'done' },
  { date: '09 Jun', task: 'Renewal exposures confirmed', state: 'now' },
  { date: '01 Jul', task: 'Renewal effective', state: 'next' },
]
export const SERVICE_END = 136
const DONE = 124
/** Frame each item arrives; the rail's tip reaches its dot on the same frame. */
export const ITEM_AT = [8, 14, 20, 26]
const RAIL: Key[] = ITEM_AT.map((f, i): Key => [f, i / (ITEM_AT.length - 1), ease.out])

export type ServiceGeo = Record<string, never>
export type ServiceValues = {
  shell: ShellValues
  rail: number
  done: number
  items: { x: number; opacity: number; blur: number; dot: number }[]
  cert: { x: number; scale: number; opacity: number; blur: number }
  live: number
  days: number
}

export function serviceFrame(f: number): ServiceValues {
  const items = QUEUE.map((_, i) => {
    const s = ITEM_AT[i]
    return {
      x: f < s ? 24 : approach(f, s, 24, 0, 0.2, 0.2),
      opacity: kf(f, [[s, 0], [s + 3, 1]]),
      blur: f < s ? 0 : Math.min(3, approachSpeed(f, s, 24, 0, 0.2, 0.2) * 0.6),
      dot: kf(f, [[s, 0], [s + 5, 1.03, ease.out], [s + 8, 1, ease.inOut]]),
    }
  })
  const tuck = ease.in(clamp((f - 96) / 10))
  return {
    shell: shellFrame(f, DONE, kf(f, [[8, 0], [60, 0.5], [124, 1]])),
    rail: kf(f, RAIL),
    done: kf(f, [[30, 0], [54, 1, ease.out]]),
    items,
    cert: {
      x: -20 * tuck,
      scale: kf(f, [[60, 0], [72, 1.03, ease.out], [84, 1, ease.inOut], [96, 1], [106, 0.9, ease.in]]),
      opacity: kf(f, [[60, 0], [63, 1], [102, 1], [106, 0]]),
      blur: 5 * tuck,
    },
    live: kf(f, [[96, 0], [104, 1, ease.out]]),
    days: Math.round(kf(f, [[96, 60], [124, 22, ease.out]])),
  }
}
