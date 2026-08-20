/* ──────────────────────────────────────────────────────────────
   Blog — /resources/blog

   The clean take, after Function Health's article index. Chosen
   over the earlier split-hero layout, which is deleted; anything
   at /resources/blog-b is the next candidate being compared
   against this, not a second blog.

   What makes that reference read as clean is not what it adds, it
   is what it leaves out. There is no featured slot, no excerpt, no
   byline, no read time, and no date. There is no card either: the
   picture sits straight on the page with nothing drawn around it.
   Every row is the same three columns of the same three parts,
   image, category, title, and the eye stops having to re-learn the
   layout on the way down.

   So this page is subtraction applied on purpose:

     · No lead post. A uniform grid all the way down, which is what
       makes the rhythm hold.

     · Cards carry a chip and a title. Nothing else. The excerpt,
       the author and the date all moved to the post page, which is
       where a reader who has decided to read will be.

     · No box. No border, no fill, no shadow. The rounded picture
       is the whole card, and the page ground shows through
       everywhere else.

   Two things it keeps from Cooper rather than from the reference:
   the title stays in the serif (the reference sets a bold sans,
   but Cooper's headings are serif everywhere else and the
   aesthetic is the layout, not the typeface), and scheduled posts
   stay in the grid, greyed and dateless-but-labelled.

   The one line that does not move: a scheduled card is a div, not
   an anchor. It has no URL, no prerendered route and no sitemap
   entry.
─────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Reveal from './Reveal'
import { PostTile } from './BlogPostCard'
import {
  BLOG_DESCRIPTION,
  BLOG_TITLE,
  BLOG_TRACKS,
  formatShortDate,
  publishedPosts,
  trackById,
  upcomingPosts,
  type BlogPost,
} from '../data/blog'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'

const PAGE_PATH = '/resources/blog'

/** The site's container, matched to the navbar so every band lines up. */
const SHELL = 'mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[62px]'

/* Squarer than the 16:9 the grid used before. The reference crops nearer to
   4:3, which gives a row of pictures more presence when the picture is the only
   thing carrying the card. */
const CROP = 'aspect-[4/3]'

export default function BlogIndexPage() {
  useSeo({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    canonicalPath: PAGE_PATH,
    jsonLd: pageJsonLd({ name: 'Blog', path: PAGE_PATH, description: BLOG_DESCRIPTION }),
  })

  /* `null` is "All". Filtering happens in the browser over a handful of posts,
     so there is nothing to paginate and nothing to fetch. */
  const [track, setTrack] = useState<string | null>(null)
  const match = (p: BlogPost) => track === null || p.track === track

  const published = publishedPosts.filter(match)
  const upcoming = upcomingPosts.filter(match)
  const empty = published.length === 0 && upcoming.length === 0

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* ── Masthead ──────────────────────────────────────────────
          Centred, serif, and carrying one line under it. The
          reference runs title-only, but it is an established
          archive; a blog in its first month still has to say what
          it is and how often it arrives. */}
      <header className="pb-[40px] pt-[128px] md:pb-[48px] md:pt-[150px] lg:pt-[168px]">
        <div className={SHELL}>
          <Reveal>
            <div className="mx-auto max-w-[760px] text-center">
              <h1 className="font-serif text-[38px] leading-[1.1] tracking-[-0.5px] text-dark md:text-[52px]">
                Notes from the people{' '}
                <span
                  className="inline-block"
                  style={{ borderBottom: '1.5px dashed rgba(217,86,17,0.55)', paddingBottom: '4px' }}
                >
                  building AI
                </span>{' '}
                for insurance
              </h1>
              <p className="mx-auto max-w-[540px] pt-[20px] font-sans text-[16px] leading-[1.6] text-muted">
                Four tracks, one post every Thursday.
              </p>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── Filter ────────────────────────────────────────────────
          Outlined pills with one filled active state, the shape the
          reference uses and the shape readers already know. */}
      <nav aria-label="Filter posts by track" className="pb-[44px]">
        <div className={SHELL}>
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[10px]">
              <span className="font-sans text-[14px] text-muted">Filter by:</span>
              {[{ id: null, label: 'All' }, ...BLOG_TRACKS.map((t) => ({ id: t.id, label: t.label }))].map(
                (tab) => {
                  const active = track === tab.id
                  return (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setTrack(tab.id)}
                      aria-pressed={active}
                      className={`cursor-pointer rounded-full border px-[18px] py-[8px] font-sans text-[14px] transition-colors duration-200 ${
                        active
                          ? 'border-dark bg-dark text-cream-light'
                          : 'border-dark/15 bg-transparent text-dark hover:border-dark/35'
                      }`}
                    >
                      {tab.label}
                    </button>
                  )
                },
              )}
            </div>
          </Reveal>
        </div>
      </nav>

      {/* ── The grid ──────────────────────────────────────────────
          One uniform run, published then scheduled. No lead slot,
          no dividers, nothing drawn around a card. */}
      <section className="pb-[24px]">
        <div className={SHELL}>
          {empty ? (
            <Reveal>
              <p className="py-[72px] text-center font-sans text-[16px] text-muted">
                Nothing in this track yet. The first one is on the calendar.
              </p>
            </Reveal>
          ) : (
            <Reveal>
              <div className="grid gap-x-[30px] gap-y-[56px] sm:grid-cols-2 lg:grid-cols-3">
                {published.map((post, i) => (
                  <PublishedCard key={post.slug} post={post} eager={i < 3} />
                ))}
                {upcoming.map((post) => (
                  <ScheduledCard key={post.slug} post={post} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Close ─────────────────────────────────────────────── */}
      <Reveal>
        <section className="bg-cream-light">
          <div className="mx-auto max-w-[1440px] px-5 py-[64px] md:px-10 lg:px-[62px]">
            <div className="relative h-auto overflow-hidden rounded-[30px] lg:h-[420px]">
              <img
                src="/images/about/careers-cta-bg.png"
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="relative z-10 flex h-full flex-col items-start gap-8 px-5 py-12 md:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-[72px] lg:py-0">
                <div className="flex-1">
                  <span className="mb-[16px] block font-grotesk text-[11px] font-medium uppercase tracking-[1.4px] text-cream-light">
                    Get started
                  </span>
                  <h2 className="mb-[36px] font-serif text-[36px] leading-[1.15] text-white md:text-[34px] lg:text-[42px]">
                    See Cooper run on your own submissions
                  </h2>
                  <Link
                    to="/demo"
                    className="inline-block w-fit rounded-[6px] bg-white px-[28px] py-[12px] font-sans text-[15px] font-medium text-dark no-underline transition-all duration-200 hover:scale-[1.03] hover:bg-cream"
                  >
                    Request a Demo
                  </Link>
                </div>
                <div className="flex w-full flex-1 lg:justify-end">
                  <p className="max-w-full font-sans text-[15px] leading-[24.75px] text-white/80 lg:max-w-[380px]">
                    Bring a real submission. We'll run it end to end and show you where the hours
                    go.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Footer />
    </div>
  )
}

/** The quiet category label under every picture. Neutral, not accented: on a
    page this bare an orange chip on every card becomes the loudest thing. */
function Chip({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`inline-block rounded-[5px] px-[8px] py-[4px] font-grotesk text-[10.5px] font-medium uppercase tracking-[0.1em] ${
        muted ? 'bg-dark/[0.05] text-muted/70' : 'bg-dark/[0.06] text-muted'
      }`}
    >
      {children}
    </span>
  )
}

/** A published post: picture, chip, title. Nothing else on the card. */
function PublishedCard({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  return (
    <article className="group">
      <Link to={`/resources/blog/${post.slug}`} className="block">
        <PostTile post={post} eager={eager} ratio={CROP} />
        {/* The chip needs its own block. Both it and the heading are
            inline-block, so a short title sits up beside the chip instead of
            under it. Long titles wrap and hide it, which is why it only shows
            on the shortest card. */}
        <div className="pt-[16px]">
          <div>
            <Chip>{trackById(post.track).label}</Chip>
          </div>
          <h2 className="relative inline-block pt-[12px] font-serif text-[22px] leading-[1.24] text-dark md:text-[23px]">
            {post.title}
            <span className="absolute -bottom-[2px] left-0 right-0 border-b border-dashed border-dark/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </h2>
        </div>
      </Link>
    </article>
  )
}

/**
 * A scheduled post.
 *
 * Not an anchor, and given nothing that would promise a destination: no hover,
 * no underline, no cursor, no href. The picture is desaturated and dimmed so
 * every track lands on the same neutral rather than four faded colours, and the
 * date says when it arrives.
 */
function ScheduledCard({ post }: { post: BlogPost }) {
  return (
    <article aria-label={`Scheduled: ${post.title}`}>
      <div className="opacity-40 grayscale">
        <PostTile post={post} ratio={CROP} />
      </div>
      <div className="pt-[16px]">
        <span className="flex flex-wrap items-center gap-[8px]">
          <Chip muted>{trackById(post.track).label}</Chip>
          <span className="font-grotesk text-[10.5px] font-medium uppercase tracking-[0.1em] text-accent-orange">
            Coming {formatShortDate(post.publishedAt)}
          </span>
        </span>
        {/* /65, not /50. At 22px this is not "large text" under WCAG, so it
            needs the full 4.5:1 and the lighter tint did not reach it. The
            greyed picture already carries the "not yet" without the title
            having to be hard to read. */}
        <h2 className="pt-[12px] font-serif text-[22px] leading-[1.24] text-dark/65 md:text-[23px]">
          {post.title}
        </h2>
      </div>
    </article>
  )
}

