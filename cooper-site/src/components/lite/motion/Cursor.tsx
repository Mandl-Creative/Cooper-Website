import type { Ref } from 'react'

/**
 * The one cursor the panels use (01 and 04): a macOS arrow in dark-2 with a
 * white rim. Hidden at rest; the scene moves, turns and scales it around its
 * tip (CURSOR_TIP in dom.ts).
 */
export function Cursor({ ref }: { ref: Ref<SVGSVGElement> }) {
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 20 26"
      width="20"
      height="26"
      className="pointer-events-none absolute left-0 top-0 opacity-0"
      style={{ transformOrigin: '3px 2px' }}
    >
      <path
        d="M3 2 3 20.6 7.5 16.5 10.5 23.3 13.7 21.9 10.8 15.3 17 15.3Z"
        fill="#1d1a17"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
