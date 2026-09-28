/* ──────────────────────────────────────────────────────────────
   The section clock, wired to the browser. The rules live in clock.ts, a
   pure reducer tested in Node; this file feeds it events and paints what
   it decides.

   - requestAnimationFrame runs only while something moves, and stops at a
     hold, so an idle section costs nothing.
   - An IntersectionObserver on the plate (never on a moving child) says
     whether the section is on screen: at least 30% of the plate visible.
   - prefers-reduced-motion, hover and focus.
   - In dev, ?cap=<1-6>&f=<frame> freezes a panel on a frame for stills.

   It paints three things: the active panel (through the painter the panel
   registered), the outgoing panel's exit (a 10px rise while its blur ramps
   to 7px, cut at the peak) and the tour bar under the active list item.
   The clock is a plain object with methods rather than React state, so a
   frame never re-renders the section; React only hears about it when the
   active panel, the outgoing panel or the tour changes.
─────────────────────────────────────────────────────────────── */

import { useLayoutEffect, useState } from 'react'
import type { PanelBind, Painter } from '../panels/types'
import { EXIT_FRAMES, clockReducer, initialClock, isRunning, tourProgress, type ClockEvent, type ClockState } from './clock'
import { applyBlur, move, setStyle } from './dom'
import { FPS, clamp, ease } from './engine'

export type SectionView = {
  active: number
  outgoing: number | null
  /** The tour is still running, so the list shows its progress bar. */
  touring: boolean
}

function viewOf(s: ClockState): SectionView {
  return { active: s.active, outgoing: s.outgoing?.index ?? null, touring: s.tour === 'on' && !s.reduced }
}

function sameView(a: SectionView, b: SectionView): boolean {
  return a.active === b.active && a.outgoing === b.outgoing && a.touring === b.touring
}

function visibleShare(node: Element): number {
  const r = node.getBoundingClientRect()
  if (r.height <= 0) return 0
  return clamp((Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)) / r.height)
}

function createClock(ends: readonly number[], onView: (v: SectionView) => void) {
  let state = initialClock(ends)
  let view = viewOf(state)
  const painters: (Painter | null)[] = ends.map(() => null)
  let plate: HTMLElement | null = null
  let exit: HTMLElement | null = null
  let bar: HTMLElement | null = null
  let raf = 0
  let last = 0

  const paint = () => {
    painters[state.active]?.(state.f)
    const out = state.outgoing
    if (exit && out) {
      const u = ease.in(clamp(out.f / EXIT_FRAMES))
      setStyle(exit, 'transform', move(0, -10 * u))
      applyBlur(exit, { round: 7 * u, text: true })
      setStyle(exit, 'opacity', clamp(1 - (out.f - (EXIT_FRAMES - 2)) / 2).toFixed(3))
    }
    if (bar) setStyle(bar, 'transform', `scaleX(${(tourProgress(state) ?? 0).toFixed(4)})`)
  }

  const loop = (now: number) => {
    raf = 0
    const df = last ? ((now - last) / 1000) * FPS : 0
    last = now
    dispatch({ type: 'tick', df })
  }

  const dispatch = (e: ClockEvent) => {
    state = clockReducer(state, e)
    const next = viewOf(state)
    if (!sameView(view, next)) {
      view = next
      onView(next)
    }
    paint()
    if (isRunning(state)) {
      if (!raf) raf = requestAnimationFrame(loop)
    } else {
      last = 0
    }
  }

  const binds: PanelBind[] = ends.map((_, i) => ({
    register: (p) => {
      painters[i] = p
    },
    frame: () => (i === state.active ? state.f : state.ends[i]),
  }))

  // Everything returned is created once, so the ref callbacks keep their
  // identity across renders and React never detaches them mid-exit.
  return {
    binds,
    dispatch,
    plate: () => plate,
    select: (index: number) => dispatch({ type: 'select', index, byUser: true }),
    hover: (on: boolean) => dispatch({ type: 'hover', on }),
    focus: (on: boolean) => dispatch({ type: 'focus', on }),
    attachPlate: (node: HTMLElement | null) => {
      plate = node
    },
    /** React 19 ref with cleanup: a panel that stops leaving sheds the exit styles. */
    attachExit: (node: HTMLElement | null) => {
      exit = node
      if (node) paint()
      return () => {
        if (!node) return
        node.style.transform = ''
        node.style.filter = ''
        node.style.opacity = ''
        if (exit === node) exit = null
      }
    },
    attachBar: (node: HTMLElement | null) => {
      bar = node
      if (node) paint()
    },
    stop: () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      last = 0
    },
  }
}

export function useSectionClock(ends: readonly number[]) {
  const [view, setView] = useState<SectionView>(() => viewOf(initialClock(ends)))
  const [clock] = useState(() => createClock(ends, setView))

  useLayoutEffect(() => {
    const plate = clock.plate()
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    // The tour runs only in the two-column layout: below it the list sits above the plate,
    // panels differ in height, and every step would move the page under the reader.
    const wide = window.matchMedia('(min-width: 1024px)')
    clock.dispatch({
      type: 'hydrate',
      onScreen: plate ? visibleShare(plate) >= 0.3 : false,
      reduced: motion.matches,
      wide: wide.matches,
    })

    // Dev only: ?cap=<1-6>&f=<frame> opens frozen on a frame, and
    // window.__liteSeek(cap, f) lets the capture tool step frames without a reload.
    const devWindow = window as unknown as { __liteSeek?: (cap: number, f: number) => void }
    if (import.meta.env.DEV) {
      const seek = (cap: number, f: number) => {
        const index = clamp(cap - 1, 0, ends.length - 1)
        clock.dispatch({ type: 'seek', index, f })
      }
      devWindow.__liteSeek = seek
      const q = new URLSearchParams(window.location.search)
      if (q.has('cap') || q.has('f')) {
        const cap = Number(q.get('cap') ?? 1)
        seek(cap, Number(q.get('f') ?? ends[clamp(cap - 1, 0, ends.length - 1)]))
      }
    }

    const onMotion = () => clock.dispatch({ type: 'reduced', on: motion.matches })
    motion.addEventListener('change', onMotion)
    const onWide = () => clock.dispatch({ type: 'wide', on: wide.matches })
    wide.addEventListener('change', onWide)
    const io = new IntersectionObserver(
      ([entry]) => clock.dispatch({ type: 'visible', onScreen: entry.intersectionRatio >= 0.3 }),
      { threshold: [0, 0.3] },
    )
    if (plate) io.observe(plate)
    return () => {
      motion.removeEventListener('change', onMotion)
      wide.removeEventListener('change', onWide)
      io.disconnect()
      clock.stop()
      delete devWindow.__liteSeek
    }
  }, [clock, ends])

  return {
    view,
    binds: clock.binds,
    select: clock.select,
    hover: clock.hover,
    focus: clock.focus,
    attachPlate: clock.attachPlate,
    attachExit: clock.attachExit,
    attachBar: clock.attachBar,
  }
}
