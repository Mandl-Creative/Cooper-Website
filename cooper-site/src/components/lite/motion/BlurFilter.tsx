import type { Ref } from 'react'

/**
 * One SVG filter for one directional smear (feGaussianBlur with separate x
 * and y deviation; applyBlur sets it per frame). The region is generous so a
 * card's shadow is not clipped while it smears; sRGB so the smear does not
 * shift the colours. `id` must be unique on the page.
 */
export function BlurFilter({ id, ref }: { id: string; ref: Ref<SVGFilterElement> }) {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter ref={ref} id={id} x="-20%" y="-45%" width="140%" height="190%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="0 0" />
      </filter>
    </svg>
  )
}
