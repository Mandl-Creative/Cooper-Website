/* ──────────────────────────────────────────────────────────────
   Writing a frame onto the DOM. The timelines say what each node looks like
   at frame f; these helpers put it there without touching what did not
   change. Nothing here runs at import time, so the tests can load it in
   Node.

   Blur: a CSS blur() for round blur, an SVG feGaussianBlur (one <filter>
   per smeared node, see BlurFilter.tsx) for a directional smear. Under a
   quarter pixel nothing is visible, so the property is removed rather than
   left at blur(0). Safari keeps a blurred GPU layer after a filter animation
   and never repaints text sharp, so there it never blurs text and never
   smears; the same test index.css uses to strip its blur keyframes.
─────────────────────────────────────────────────────────────── */

export const REST = 0.25

export type BlurSpec = { round?: number; x?: number; y?: number; text?: boolean; extra?: string }

export function blurFilterValue(b: BlurSpec, svgId: string | null, safari: boolean): string {
  const round = b.round ?? 0
  const smear = Math.max(b.x ?? 0, b.y ?? 0)
  const parts: string[] = []
  if (smear >= REST) {
    if (svgId && !safari) parts.push(`url(#${svgId})`)
  } else if (round >= REST && !(safari && b.text)) {
    parts.push(`blur(${round.toFixed(2)}px)`)
  }
  if (b.extra) parts.push(b.extra)
  return parts.join(' ')
}

let safariCache: boolean | undefined
export function isSafari(): boolean {
  if (safariCache === undefined) {
    safariCache = typeof CSS !== 'undefined' && CSS.supports('background', '-webkit-named-image(i)')
  }
  return safariCache
}

type Styled = HTMLElement | SVGElement

export function applyBlur(el: Styled | null, b: BlurSpec, filter?: SVGFilterElement | null): void {
  if (!el) return
  const value = blurFilterValue(b, filter?.id ?? null, isSafari())
  if (value.startsWith('url(') && filter) {
    filter.firstElementChild?.setAttribute('stdDeviation', `${(b.x ?? 0).toFixed(2)} ${(b.y ?? 0).toFixed(2)}`)
  }
  if (el.style.filter !== value) el.style.filter = value
}

export function setText(el: Element | null, text: string): void {
  if (el && el.textContent !== text) el.textContent = text
}

export function setStyle(el: Styled | null, prop: string, value: string): void {
  if (el && el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value)
}

/** translate3d for inline transforms; empty at rest so the node sits exactly where layout put it. */
export function move(x: number, y = 0): string {
  return x || y ? `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)` : ''
}

/** Where the tip of the Cursor arrow sits inside its 20×26 box; it rotates and scales around it. */
export const CURSOR_TIP = { x: 3, y: 2 } as const

/**
 * Where `el` sits inside `ancestor` in layout terms, summing offsetLeft/Top up
 * the offsetParent chain. Unlike getBoundingClientRect it ignores transforms,
 * so a panel can be measured mid-scene (a ResizeObserver or the fonts landing
 * while a column is still rising) and still get its resting position.
 * `ancestor` must be positioned and must contain `el`.
 */
export function offsetWithin(el: HTMLElement, ancestor: HTMLElement): { x: number; y: number } {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}
