/* The casing every panel shares: the card enters already moving, the three
   activity dots breathe while Cooper works, and the status chip swaps its
   working word for the done word. The done word starts three frames before
   the working word has gone, under its blur, so the chip is never empty.
   Every value is exactly at rest from doneAt + 9 on, so a panel's END must be
   at least doneAt + 9 for its hold frame to match the static markup. */

import { approach, approachSpeed, clamp, ease, kf } from '../motion/engine.ts'

export type ShellValues = {
  cardY: number
  cardOpacity: number
  cardBlurY: number
  progress: number
  workY: number
  workOpacity: number
  workBlur: number
  doneY: number
  doneOpacity: number
  doneBlur: number
  /** stroke-dashoffset of the check: 1 hidden, 0 drawn. */
  check: number
  dots: [number, number, number]
}

export function shellFrame(f: number, doneAt: number, progress: number): ShellValues {
  const leave = clamp((f - (doneAt - 6)) / 6)
  const b0 = doneAt - 3
  const dot = (j: number) => 0.28 + 0.72 * (0.5 + 0.5 * Math.sin(2 * Math.PI * (f / 20 - j / 3)))
  return {
    cardY: approach(f, 0, 28, 0, 0.17),
    cardOpacity: kf(f, [[0, 0], [6, 1]]),
    cardBlurY: Math.min(6, approachSpeed(f, 0, 28, 0, 0.17) * 1.15),
    progress: clamp(progress),
    workY: -6 * ease.in(leave),
    workOpacity: 1 - leave,
    workBlur: 2.5 * ease.in(leave),
    doneY: f < b0 ? 6 : approach(f, b0, 6, 0, 0.22, 0.35),
    doneOpacity: kf(f, [[b0, 0], [b0 + 4, 1]]),
    doneBlur: f < b0 ? 0 : Math.min(2.5, approachSpeed(f, b0, 6, 0, 0.22, 0.35) * 1.6),
    check: kf(f, [[doneAt + 1, 1], [doneAt + 8, 0, ease.out]]),
    dots: [dot(0), dot(1), dot(2)],
  }
}
