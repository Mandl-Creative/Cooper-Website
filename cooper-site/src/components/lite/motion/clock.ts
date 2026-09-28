/* ──────────────────────────────────────────────────────────────
   Section clock for the capability panels, as a pure reducer.

   One clock for the whole section decides which panel is drawn at which
   frame. It is a reducer so the rules can be tested in Node without a
   browser; useSectionClock wires it to requestAnimationFrame, an
   IntersectionObserver, prefers-reduced-motion and hover.

   hold     the finished screen. SSR, no JS, reduced motion, a section that
            was already on screen when the page hydrated, and every panel
            once it has played.
   armed    frame 0 while nobody can see the section, waiting to be seen.
   playing  frames advancing.
   paused   the section left the screen mid-play; resumes where it stopped.
   frozen   dev only (?cap=&f=): a still for review.

   The tour: while the section is on screen and nobody is hovering, a panel
   rests TOUR_HOLD frames on its result and the next one starts. The first
   click on any capability stops it for good; reduced motion never runs it.
─────────────────────────────────────────────────────────────── */

import { clamp } from './engine.ts'

export const TOUR_HOLD = 75 // 2.5 s on the result before the tour moves on
export const EXIT_FRAMES = 7 // the outgoing panel's rise and blur ramp
export const MAX_STEP = 4 // a tick never advances more than this, e.g. after a background tab

export type Mode = 'hold' | 'armed' | 'playing' | 'paused' | 'frozen'

export type ClockState = {
  mode: Mode
  active: number
  f: number
  count: number
  ends: readonly number[]
  onScreen: boolean
  reduced: boolean
  /** The pointer is over the capability list. */
  pointer: boolean
  /** Keyboard focus is somewhere inside the section. */
  focus: boolean
  tour: 'on' | 'stopped'
  /** Frames spent on the active panel's result, counting toward the tour. */
  rest: number
  /** The panel leaving, and how many frames into its exit it is. */
  outgoing: { index: number; f: number } | null
}

export type ClockEvent =
  /** `wide` is false below the two-column layout; there the tour would move the page under the reader. */
  | { type: 'hydrate'; onScreen: boolean; reduced: boolean; wide?: boolean }
  | { type: 'wide'; on: boolean }
  | { type: 'visible'; onScreen: boolean }
  | { type: 'reduced'; on: boolean }
  | { type: 'hover'; on: boolean }
  | { type: 'focus'; on: boolean }
  | { type: 'select'; index: number; byUser: boolean }
  | { type: 'tick'; df: number }
  | { type: 'seek'; index: number; f: number }

export function initialClock(ends: readonly number[]): ClockState {
  return {
    mode: 'hold',
    active: 0,
    f: ends[0],
    count: ends.length,
    ends,
    onScreen: false,
    reduced: false,
    pointer: false,
    focus: false,
    tour: 'on',
    rest: 0,
    outgoing: null,
  }
}

function tourCounting(s: ClockState): boolean {
  return s.tour === 'on' && s.onScreen && !s.pointer && !s.focus && !s.reduced
}

function select(s: ClockState, index: number, byUser: boolean): ClockState {
  const tour = byUser ? 'stopped' : s.tour
  if (index === s.active) return { ...s, tour }
  // While the panel that is leaving is still mostly on screen, a second pick keeps it
  // leaving and only swaps what arrives; picking the leaving panel itself cancels its exit.
  const out = s.outgoing
  if (out && out.f < EXIT_FRAMES - 2 && !s.reduced) {
    if (index === out.index) return { ...s, tour, active: index, f: s.ends[index], mode: 'hold', rest: 0, outgoing: null }
    return { ...s, tour, active: index, f: 0, rest: 0, mode: s.onScreen ? 'playing' : 'armed' }
  }
  if (s.reduced) {
    return { ...s, tour, active: index, f: s.ends[index], mode: 'hold', rest: 0, outgoing: null }
  }
  return {
    ...s,
    tour,
    active: index,
    f: 0,
    rest: 0,
    mode: s.onScreen ? 'playing' : 'armed',
    // At most one panel leaves at a time: a second click replaces it.
    outgoing: { index: s.active, f: 0 },
  }
}

export function clockReducer(s: ClockState, e: ClockEvent): ClockState {
  switch (e.type) {
    case 'hydrate': {
      if (e.reduced) {
        return { ...s, reduced: true, onScreen: e.onScreen, mode: 'hold', f: s.ends[s.active], tour: 'stopped' }
      }
      const tour = e.wide === false ? 'stopped' : s.tour
      if (e.onScreen) return { ...s, tour, onScreen: true, mode: 'hold', f: s.ends[s.active] }
      return { ...s, tour, onScreen: false, mode: 'armed', f: 0 }
    }
    case 'wide':
      return e.on ? s : { ...s, tour: 'stopped' }
    case 'visible': {
      if (s.mode === 'frozen') return { ...s, onScreen: e.onScreen }
      if (e.onScreen) {
        const wakes = s.mode === 'armed' || s.mode === 'paused'
        return { ...s, onScreen: true, mode: wakes ? 'playing' : s.mode }
      }
      return { ...s, onScreen: false, mode: s.mode === 'playing' ? 'paused' : s.mode }
    }
    case 'reduced': {
      if (!e.on) return { ...s, reduced: false }
      return { ...s, reduced: true, mode: 'hold', f: s.ends[s.active], tour: 'stopped', outgoing: null, rest: 0 }
    }
    case 'hover':
      return { ...s, pointer: e.on }
    case 'focus':
      return { ...s, focus: e.on }
    case 'select':
      return s.mode === 'frozen' ? s : select(s, e.index, e.byUser)
    case 'seek':
      return {
        ...s,
        mode: 'frozen',
        active: e.index,
        f: clamp(e.f, 0, s.ends[e.index]),
        outgoing: null,
        tour: 'stopped',
        rest: 0,
      }
    case 'tick': {
      if (s.mode === 'frozen') return s
      const d = Math.min(Math.max(e.df, 0), MAX_STEP)
      let next = s
      if (s.outgoing) {
        const of = s.outgoing.f + d
        next = { ...next, outgoing: of >= EXIT_FRAMES ? null : { index: s.outgoing.index, f: of } }
      }
      if (next.mode === 'playing') {
        const end = next.ends[next.active]
        const f = Math.min(next.f + d, end)
        return f >= end ? { ...next, f: end, mode: 'hold', rest: 0 } : { ...next, f }
      }
      if (next.mode === 'hold' && tourCounting(next)) {
        const rest = next.rest + d
        if (rest >= TOUR_HOLD) return select({ ...next, rest }, (next.active + 1) % next.count, false)
        return { ...next, rest }
      }
      return next
    }
  }
}

/** Whether the rAF loop has anything to do. */
export function isRunning(s: ClockState): boolean {
  if (s.mode === 'frozen') return false
  return s.mode === 'playing' || s.outgoing !== null || (s.mode === 'hold' && tourCounting(s))
}

/** 0..1 across the active panel and its rest, for the list indicator; null when there is no tour. */
export function tourProgress(s: ClockState): number | null {
  if (s.tour !== 'on' || s.reduced) return null
  const end = s.ends[s.active]
  const elapsed = s.mode === 'hold' ? end + s.rest : s.f
  return clamp(elapsed / (end + TOUR_HOLD))
}
