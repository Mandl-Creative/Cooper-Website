import { applyBlur, move, setStyle } from '../motion/dom'
import type { ShellValues } from './shell.timeline'

export type ShellRefs = {
  card: HTMLDivElement | null
  cardFx: SVGFilterElement | null
  progress: HTMLSpanElement | null
  work: HTMLSpanElement | null
  done: HTMLSpanElement | null
  check: SVGPathElement | null
  dots: (HTMLElement | null)[]
}

export function emptyShellRefs(): ShellRefs {
  return { card: null, cardFx: null, progress: null, work: null, done: null, check: null, dots: [null, null, null] }
}

export function paintShell(v: ShellValues, s: ShellRefs): void {
  setStyle(s.card, 'transform', move(0, v.cardY))
  setStyle(s.card, 'opacity', v.cardOpacity === 1 ? '' : v.cardOpacity.toFixed(3))
  applyBlur(s.card, { y: v.cardBlurY }, s.cardFx)
  setStyle(s.progress, 'transform', `scaleX(${v.progress.toFixed(4)})`)
  setStyle(s.work, 'transform', move(0, v.workY))
  setStyle(s.work, 'opacity', v.workOpacity.toFixed(3))
  applyBlur(s.work, { round: v.workBlur, text: true })
  setStyle(s.done, 'transform', move(0, v.doneY))
  setStyle(s.done, 'opacity', v.doneOpacity.toFixed(3))
  applyBlur(s.done, { round: v.doneBlur, text: true })
  s.check?.setAttribute('stroke-dashoffset', v.check.toFixed(3))
  s.dots.forEach((d, j) => setStyle(d, 'opacity', v.dots[j].toFixed(3)))
}
