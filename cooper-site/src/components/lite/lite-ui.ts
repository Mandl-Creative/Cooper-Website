/* Shared by the Lite pages, ported from the product app so the comparison page
   here and the one in production stay one design.

   Sizes are baked into each variant rather than appended at the call site: two
   competing `min-h-[…]` utilities are resolved by CSS source order, not by the
   order they are written. */

/* The page gutter: 32px, 40px, then centred at 1360px. */
export const WRAP =
  'w-[calc(100%-32px)] sm:w-[calc(100%-40px)] lg:w-[min(1360px,calc(100%-80px))] mx-auto'

const EYEBROW_BASE =
  'font-grotesk text-[11px] leading-none uppercase tracking-[.16em]'
export const EYEBROW = `${EYEBROW_BASE} text-accent-orange`
/* Copper goes muddy on espresso; the dark bands use the lighter ocre. */
export const EYEBROW_ON_DARK = `${EYEBROW_BASE} text-[#f0a06e]`

/* Geometry and weight taken from /lite: 4px corners, medium weight, never
   bold. The page these came from used square, bold buttons, which read as a
   different product sitting next to the Lite landing page. */
const BUTTON =
  'inline-flex items-center justify-center gap-[8px] font-sans font-medium rounded-[4px] border transition-all whitespace-nowrap cursor-pointer'
const REGULAR = 'text-[15px] min-h-[48px] px-[22px] py-[14px]'
const COMPACT = 'text-[14px] min-h-[42px] px-[17px] py-[11px]'
/* Hover deepens rather than darkens to black, so the orange stays the brand's. */
const FILLED =
  'border-transparent bg-accent-orange text-white hover:bg-accent-orange-deep'
const OUTLINED = 'border-lite-line text-dark hover:border-dark/40'
const INK =
  'border-transparent bg-dark-2 text-cream-light hover:bg-[#0f0d0b]'
/* The secondary of a pair: present, but never competing with the CTA beside it. */
const QUIET = 'border-lite-line text-muted hover:text-dark hover:border-dark/35'

export const BUTTON_PRIMARY = `${BUTTON} ${REGULAR} ${FILLED}`
export const BUTTON_PRIMARY_COMPACT = `${BUTTON} ${COMPACT} ${FILLED}`
export const BUTTON_DARK = `${BUTTON} ${REGULAR} ${INK}`
export const BUTTON_DARK_COMPACT = `${BUTTON} ${COMPACT} ${INK}`
export const BUTTON_OUTLINE = `${BUTTON} ${REGULAR} ${OUTLINED}`
export const BUTTON_OUTLINE_COMPACT = `${BUTTON} ${COMPACT} ${OUTLINED}`
export const BUTTON_QUIET_COMPACT = `${BUTTON} ${COMPACT} ${QUIET}`
export const BUTTON_ON_DARK = `${BUTTON} ${REGULAR} border-cream-light/30 text-cream-light hover:border-cream-light`
