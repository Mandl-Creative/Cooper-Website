/* Every price the comparison quotes, ported from the product app. Import from
   here rather than typing a figure into copy — when the introductory price
   ends, this file is the only edit.

   The one exception is the page's useSeo() description and its twin in
   scripts/prerender.cjs: those are read as plain string literals.

   Only the constants the comparison page and its chrome use are carried over.
   The signup funnel, the guarantee and the Lite FAQ live in the product app. */

export const SEATS = 5
export const SEAT_LIMIT = `Up to ${SEATS} users`

/* Numbers, not strings, so the saving is derived rather than typed twice. The
   pricing card sets the dollar sign in a smaller size, so `amount` is also
   exposed on its own. */
const AMOUNT = 99
const REGULAR = 499

export const PRICE = {
  amount: String(AMOUNT),
  now: `$${AMOUNT}`,
  was: `$${REGULAR}`,
  saving: `$${REGULAR - AMOUNT}`,
  /* Off the regular price, not off an existing bill — nobody was paying
     REGULAR before signing up. Rounded for copy, e.g. "80% off". */
  percentOff: `${Math.round(((REGULAR - AMOUNT) / REGULAR) * 100)}%`,
  per: 'month',
  note: 'Introductory pricing',
  cadence: 'Month-to-month',
  usage: 'Limited monthly usage',
}

export const OFFER_BAR = {
  product: 'Cooper Lite',
  was: `${PRICE.was}/${PRICE.per}`,
  now: `${PRICE.now}/${PRICE.per} for small agencies`,
  note: 'Introductory Pricing',
  link: 'See pricing',
}
