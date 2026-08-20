/* ──────────────────────────────────────────────────────────────
   Blog card + the art slot every card, the featured slot and the
   post header share.

   The art slot is the design problem this file exists to solve.
   Most posts will ship without a photograph — there is no
   illustrator on this, and a weekly cadence will not wait for one —
   so the fallback is not an edge case, it is the default state of
   the page.

   The first pass answered that with texture alone: a dashed rule
   over a cream field with the mark watermarked in. On a 360px card
   that reads as restraint. Blown up to the 740px featured slot it
   reads as a photograph that failed to load, and since it is the
   largest object on the index, the whole page inherits the failure.

   So the fallback is not texture. It is type.

   Every reference that survives without photography reaches the
   same conclusion: Mural sets a headline in giant type on a green
   field and that block IS the image; Wise does it with a logo on
   green; Homerun runs saturated colour cards with the title set
   large. The title is the only asset a post is guaranteed to have
   on the Thursday it ships, so the title is what the art is made
   of. Nothing to commission, nothing to wait for.

   The field colour rotates by track, which is what stops eight
   tiles reading as one repeated tile, and gives an index that is
   otherwise cream-on-cream something to hang on. Texture stays,
   moved behind the type where it belongs: Cooper's dashed rule
   from the Integrations connectors, the mark, and one orange tick.

   A real hero image, when a post has one, takes the field and
   keeps the type over a scrim, so the two kinds of card still
   belong to one system.
─────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { formatPostDate, trackById, type BlogPost, type BlogTrackId } from '../data/blog'

/* Where the dashed rules cross and where the mark sits, per track. Percentages
   so the composition holds at every tile size, from the 740px lead slot down to
   a 3-up card on a laptop. Kept off the lower-left corner, which is where the
   type now lives. */
const TILE_LAYOUT: Record<BlogTrackId, { x: number; y: number; markX: number; markY: number }> = {
  'state-of-insurance': { x: 74, y: 26, markX: 82, markY: 24 },
  engineering: { x: 26, y: 22, markX: 20, markY: 20 },
  'customer-success': { x: 78, y: 30, markX: 85, markY: 26 },
  'industry-insider': { x: 30, y: 28, markX: 24, markY: 24 },
}

/**
 * The field each track's art is drawn on.
 *
 * Four tracks, four fields, so the index has a rhythm rather than a repeat.
 * Two land dark and two land light, alternating as the tracks rotate through
 * the week, and `industry-insider` separates from `state-of-insurance` on its
 * rules rather than its ground: orange where the other is cream.
 *
 * Every pairing here clears WCAG AA. Cream-light on orange-deep is the tightest
 * at 4.78:1, which is why the deep orange is the one used and not the brighter
 * `accent-orange` the ticks and labels are drawn in.
 */
type Field = {
  bg: string
  title: string
  eyebrow: string
  rule: string
  grid: string
  tick: string
  markInvert: boolean
  /* Light fields need an edge. Cream sits one step off the cream-light the page
     is drawn on, which is enough for a wash but not enough for a block: in a row
     beside a dark and an orange tile it stops reading as a tile at all. The dark
     and orange fields draw their own edge and take nothing here. */
  edge?: string
}

const FIELD: Record<BlogTrackId, Field> = {
  'state-of-insurance': {
    bg: 'bg-dark',
    title: 'text-cream-light',
    eyebrow: 'text-cream-light/55',
    rule: 'rgba(255,252,241,0.20)',
    grid: 'rgba(255,252,241,0.055)',
    tick: '#d95611',
    markInvert: true,
  },
  engineering: {
    bg: 'bg-cream',
    title: 'text-dark',
    eyebrow: 'text-dark/50',
    rule: 'rgba(30,26,21,0.18)',
    grid: 'rgba(30,26,21,0.05)',
    tick: '#d95611',
    markInvert: false,
    edge: 'border border-dark/[0.12]',
  },
  'customer-success': {
    bg: 'bg-accent-orange-deep',
    title: 'text-cream-light',
    eyebrow: 'text-cream-light/70',
    rule: 'rgba(255,252,241,0.30)',
    grid: 'rgba(255,252,241,0.075)',
    tick: '#fffcf1',
    markInvert: true,
  },
  'industry-insider': {
    bg: 'bg-dark',
    title: 'text-cream-light',
    eyebrow: 'text-cream-light/55',
    rule: 'rgba(217,86,17,0.45)',
    grid: 'rgba(255,252,241,0.05)',
    tick: '#d95611',
    markInvert: true,
  },
}

/* Type and padding per slot. Explicit rather than fluid: the two sizes are far
   enough apart that one clamp between them under-sets the lead and over-sets
   the card. */
const SIZE = {
  lead: {
    frame: 'aspect-[16/9] md:aspect-[5/2]',
    pad: 'p-[26px] md:p-[38px]',
    /*
     * Sized in `cqw`: percent of THIS TILE's width, not the window's.
     *
     * Breakpoint steps cannot solve this slot, because its width does not grow
     * with the window. It widens while the lead is stacked, collapses at xl
     * when the schedule rail takes its 384px, then widens again. One `lg:` size
     * therefore has to serve a 900px block and a 716px one, and whichever it
     * suits, it leaves the other half empty. Measured, that was 40% void at 900
     * and 33% at 1180 while 1440 sat at 5%.
     *
     * A container unit removes the window from the question. At ~8.5% of the
     * tile's own width the line length lands near 23 characters at every size,
     * so the title always breaks to about the same number of lines and the ink
     * keeps the same share of the block. The clamp guards the two ends: a phone
     * would otherwise get 24px, and a very wide block 90px.
     */
    title: 'font-serif leading-[1.06] text-[clamp(28px,8.5cqw,80px)]',
    eyebrow: 'text-[11px] tracking-[0.14em]',
  },
  card: {
    frame: 'aspect-[16/9]',
    pad: 'p-[22px]',
    title: 'font-serif text-[19px] leading-[1.16] md:text-[20px]',
    eyebrow: 'text-[10.5px] tracking-[0.12em]',
  },
} as const

/**
 * The 16:9 slot at the top of a card, at the top of the lead block and under a
 * post's header.
 *
 * `title` sets the post's title into the field, which is what makes the slot art
 * rather than an empty frame. The card below then does NOT repeat it: the tile
 * carries the heading, the block under it carries meta, excerpt and byline. The
 * post page passes it off, because there the title is already the h1 directly
 * above and a second copy would just be a stutter.
 */
export function PostTile({
  post,
  eager = false,
  title = false,
  size = 'card',
  ratio,
}: {
  post: BlogPost
  eager?: boolean
  title?: boolean
  size?: 'lead' | 'card'
  /** Overrides the slot's own ratio floor. For layouts that set the title
      outside the tile and want a different crop than the grid's 16:9. */
  ratio?: string
}) {
  const track = trackById(post.track)
  const field = FIELD[track.id] ?? FIELD['state-of-insurance']
  const layout = TILE_LAYOUT[track.id] ?? TILE_LAYOUT['state-of-insurance']
  const s = SIZE[size]
  const photo = Boolean(post.heroImage)

  return (
    /*
     * The ratio is a floor, and getting that right took three tries.
     *
     * A bare `aspect-[16/9]` derives the height from the width and then lets a
     * long title overflow into the clip, cutting off the art's own subject.
     * Fixed min-heights stop that but stop tracking the width too, so the slot
     * goes square at one breakpoint and letterboxed at the next. And
     * `min-h-fit` simply does not win against `aspect-ratio` here: it looked
     * fixed only because the widths it was tried at happened to fit anyway.
     *
     * So: a grid with one cell, and two children stacked in it. One is an empty
     * 16:9 spacer, the other is the content. A grid row takes the height of its
     * tallest occupant, which makes the ratio a genuine minimum and the content
     * a genuine override, with no clipping either way. Both children are
     * `col-start-1 row-start-1`, which is what puts them in the same cell.
     */
    <div
      /* `grid-cols-1` is load-bearing, not decoration. Tailwind compiles it to
         `minmax(0, 1fr)`, and without that the column is `auto`, which takes a
         min-content floor from its items. The spacer's width then resolves off
         the row height through its own ratio, and the tile blew out to 618px
         inside a 350px phone. `min-w-0` stops the same thing happening one level
         up, where the tile is itself an item in the lead column. */
      className={`@container relative grid w-full min-w-0 grid-cols-1 overflow-hidden rounded-[12px] ${
        photo ? 'bg-dark' : `${field.bg} ${field.edge ?? ''}`
      }`}
    >
      {photo ? (
        <>
          <img
            src={post.heroImage}
            alt={post.heroImageAlt ?? ''}
            width={1600}
            height={900}
            loading={eager ? 'eager' : 'lazy'}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Two scrims, not one.
              The covers are art-directed with their subject and their brightest
              light on the right and shadow held on the left, so a purely
              bottom-weighted scrim leaves the middle of a long headline crossing
              the bright glass. Adding a left-weighted pass darkens the corner
              the type actually occupies and leaves the right side of the picture
              alone, which is the half worth seeing. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(20,17,13,0.88) 0%, rgba(20,17,13,0.52) 45%, rgba(20,17,13,0.14) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(20,17,13,0.72) 0%, rgba(20,17,13,0.34) 48%, rgba(20,17,13,0) 78%)',
            }}
          />
        </>
      ) : (
        <>
          {/* Graph field. 40px cells, drawn as two hairline gradients so there
              is no extra element and nothing to keep in sync at other widths. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, ${field.grid} 1px, transparent 1px), linear-gradient(to bottom, ${field.grid} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* The Cooper mark, watermarked. brightness(0) flattens the source to
              black first, so invert() can take it to cream on a dark or orange
              field — the same two-step the FinalCTA icon uses. */}
          <img
            src="/images/cooper-icon.svg"
            alt=""
            aria-hidden="true"
            className="absolute w-[17%] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${layout.markX}%`,
              top: `${layout.markY}%`,
              /* Pulled back now that the type fills the field. Texture that
                 competed with an empty block has to recede behind a full one. */
              opacity: field.markInvert ? 0.11 : 0.085,
              filter: field.markInvert ? 'brightness(0) invert(1)' : 'brightness(0)',
            }}
          />

          {/* The dashed cross, Cooper's connector rule, giving each track its
              own crossing point rather than its own shape. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 border-t border-dashed"
            style={{ top: `${layout.y}%`, borderColor: field.rule }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 border-l border-dashed"
            style={{ left: `${layout.x}%`, borderColor: field.rule }}
          />
          <div
            aria-hidden="true"
            className="absolute h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${layout.x}%`,
              top: `${layout.y}%`,
              backgroundColor: field.tick,
            }}
          />
        </>
      )}

      {/* The floor. Empty, and sharing its cell with the content below. */}
      <div aria-hidden="true" className={`col-start-1 row-start-1 ${ratio ?? s.frame}`} />

      <div
        className={`relative col-start-1 row-start-1 flex flex-col justify-between gap-[20px] ${s.pad}`}
      >
        <p
          className={`font-grotesk font-medium uppercase ${s.eyebrow} ${
            photo ? 'text-cream-light/70' : field.eyebrow
          }`}
        >
          {track.label}
        </p>

        {title && (
          <h3 className={`${s.title} ${photo ? 'text-cream-light' : field.title}`}>
            <span className="relative inline">
              {post.title}
              {/* The site's link signature, kept inside the field so the whole
                  tile reads as the thing you are about to click. */}
              <span className="absolute -bottom-[3px] left-0 right-0 border-b border-dashed border-current opacity-0 transition-opacity duration-200 group-hover:opacity-40" />
            </span>
          </h3>
        )}
      </div>
    </div>
  )
}

/** The date, under a tile that is already carrying the track.

    It used to carry both, which was right when the tile said nothing. Now that
    every tile names its own track in the field, printing it again one line
    below is a stutter, and the date is the only thing left that the art cannot
    say for itself. */
export function PostMeta({ post, tone = 'muted' }: { post: BlogPost; tone?: 'muted' | 'light' }) {
  return (
    <p
      className={`font-grotesk text-[11px] font-medium uppercase tracking-[0.12em] ${
        tone === 'light' ? 'text-cream-light/70' : 'text-muted'
      }`}
    >
      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
    </p>
  )
}

/** One post in the index grid. Also used by the "Keep reading" rail. */
export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group h-full">
      <Link to={`/resources/blog/${post.slug}`} className="flex h-full flex-col">
        <PostTile post={post} title />

        {/* No title here: the tile above is carrying it. What is left is the
            things a title cannot say. */}
        <div className="pt-[16px]">
          <PostMeta post={post} />
          <p className="pt-[10px] font-sans text-[15px] leading-[1.55] text-muted">{post.excerpt}</p>
          <p className="pt-[14px] font-grotesk text-[12.5px] text-dark">
            {post.author.name}
            <span className="text-muted"> / {post.author.role}</span>
          </p>
        </div>
      </Link>
    </article>
  )
}
