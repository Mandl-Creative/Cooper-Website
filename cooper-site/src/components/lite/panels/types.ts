/* The contract between the section clock and a panel. The clock owns time;
   a panel owns what its frame looks like. */

export type Painter = (f: number) => void

/** What the section hands each panel: a slot for its painter, and the frame to start on. */
export type PanelBind = {
  register: (painter: Painter | null) => void
  frame: () => number
}

export type PanelProps = { bind: PanelBind }

/**
 * A panel scene. `frame` is pure (tested in Node); `paint` writes its values
 * onto the refs; `measure` reads static layout (positions the cursor aims at)
 * and runs again whenever the card resizes. `end` is the hold frame.
 */
export type SceneDef<Refs, Geo, Values> = {
  end: number
  measure: (refs: Refs) => Geo
  frame: (f: number, geo: Geo) => Values
  paint: (v: Values, refs: Refs) => void
}
