import { useLayoutEffect, type RefObject } from 'react'
import type { ShellRefs } from './shellPaint'
import type { PanelBind, SceneDef } from './types'

/**
 * Wires one panel to the section clock. On the client, before the browser
 * paints, it measures the static layout, paints the frame the clock is on
 * (frame 0 for a panel that is about to play, so it never shows its finished
 * state first), and hands the clock its painter. The server skips this and
 * renders the JSX, which is the hold frame. Layout is measured again, and the
 * frame repainted, whenever the card resizes and once the web fonts have loaded.
 *
 * `scene` must be a module-level constant and `panelRef` a useRef, so the
 * effect runs once per mount.
 */
export function usePanelScene<Refs extends { shell: ShellRefs }, Geo, Values>(
  bind: PanelBind,
  panelRef: RefObject<Refs>,
  scene: SceneDef<Refs, Geo, Values>,
): void {
  useLayoutEffect(() => {
    const r = panelRef.current
    let geo = scene.measure(r)
    const painter = (f: number) => scene.paint(scene.frame(f, geo), r)
    painter(bind.frame())
    bind.register(painter)
    const remeasure = () => {
      geo = scene.measure(r)
      painter(bind.frame())
    }
    const ro = new ResizeObserver(remeasure)
    if (r.shell.card) ro.observe(r.shell.card)
    // Web fonts can land after the first measure and move rows without resizing
    // the 16:10 card, which the observer would never see.
    let alive = true
    document.fonts?.ready.then(() => {
      if (alive) remeasure()
    })
    return () => {
      alive = false
      ro.disconnect()
      bind.register(null)
    }
  }, [bind, panelRef, scene])
}
