/* ──────────────────────────────────────────────────────────────
   Blog, version B — /resources/blog-b

   The candidate being compared against the live index, which is
   now the Function-style grid at /resources/blog. Reachable by
   link only: noindex, absent from the sitemap and from the nav.

   Picking a direction for a comparison only pays if it argues
   with the incumbent rather than restyling it. The grid's case is
   that a picture sells the post and every post deserves the same
   frame. So B takes the opposite side on all three of the axes
   that matters:

     · List, not grid. One post per row, full width, divided by a
       hairline. Scanning goes straight down a single column of
       titles rather than boustrophedon across three.

     · The words lead. Title AND excerpt on every row, which the
       grid deliberately dropped. On a blog whose whole promise is
       "benchmarks, and the numbers we are not proud of", the
       sentence under the title may be doing more selling than the
       photograph.

     · Art is a thumbnail. Small, right-hand, and skippable. Four
       posts fit above the fold here where the grid shows three,
       and a post that ships without art costs the row nothing.

   Left-aligned masthead and underlined tabs rather than a centred
   masthead and pills, so the two pages do not read as the same
   page with different cards.

   Unchanged from the live index, because it is not up for debate:
   a scheduled entry is a div, not an anchor. No URL, no route, no
   sitemap line.
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
  formatPostDate,
  formatShortDate,
  publishedPosts,
  trackById,
  upcomingPosts,
  type BlogPost,
} from '../data/blog'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'

const PAGE_PATH = '/resources/blog-b'

/** The site's container, matched to the navbar so every band lines up. */
const SHELL = 'mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[62px]'

/* A row is three columns at lg: a meta rail, the words, and the thumbnail.
   The rail is fixed so every date and track in the list starts on one line,
   which is most of what makes a list scan faster than a grid. */
const ROW = 'grid gap-x-[32px] gap-y-[14px] lg:grid-cols-[140px_minmax(0,1fr)_240px]'

export default function BlogIndexPageB() {
  useSeo({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    canonicalPath: PAGE_PATH,
    jsonLd: pageJsonLd({ name: 'Blog', path: PAGE_PATH, description: BLOG_DESCRIPTION }),
  })

  const [track, setTrack] = useState<string | null>(null)
  const match = (p: BlogPost) => track === null || p.track === track

  const published = publishedPosts.filter(match)
  const upcoming = upcomingPosts.filter(match)
  const empty = published.length === 0 && upcoming.length === 0

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* ── Masthead ──────────────────────────────────────────────
          Left, not centred. A list runs down the left edge, and a
          centred title over it leaves the page hanging off two
          different axes. */}
      <header className="pt-[128px] md:pt-[150px] lg:pt-[168px]">
        <div className={SHELL}>
          <Reveal>
            <h1 className="max-w-[860px] font-serif text-[38px] leading-[1.1] tracking-[-0.5px] text-dark md:text-[52px]">
              Notes from the people{' '}
              <span
                className="inline-block"
                style={{ borderBottom: '1.5px dashed rgba(217,86,17,0.55)', paddingBottom: '4px' }}
              >
                building AI
              </span>{' '}
              for insurance
            </h1>
            <p className="max-w-[560px] pt-[20px] font-sans text-[16.5px] leading-[1.6] text-muted">
              Four tracks, one post every Thursday. Benchmarks and engineering notes, where the
              industry is heading, and brokers on their own work.
            </p>
          </Reveal>
        </div>
      </header>

      {/* ── Filter ────────────────────────────────────────────────
          An underlined tab row sitting on the rule the list starts
          from, so the control and the list share one edge. */}
      <nav aria-label="Filter posts by track" className="pt-[44px]">
        <div className={SHELL}>
          <Reveal>
            <div className="flex flex-wrap gap-x-[26px] gap-y-[4px] border-b border-dark/[0.10]">
              {[{ id: null, label: 'All' }, ...BLOG_TRACKS.map((t) => ({ id: t.id, label: t.label }))].map(
                (tab) => {
                  const active = track === tab.id
                  return (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setTrack(tab.id)}
                      aria-pressed={active}
                      className={`-mb-px cursor-pointer border-b-2 pb-[12px] font-grotesk text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 ${
                        active
                          ? 'border-accent-orange text-dark'
                          : 'border-transparent text-muted hover:text-dark'
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

      {/* ── The list ──────────────────────────────────────────── */}
      <section className="pb-[8px]">
        <div className={SHELL}>
          {empty ? (
            <Reveal>
              <p className="py-[72px] text-center font-sans text-[16px] text-muted">
                Nothing in this track yet. The first one is on the calendar.
              </p>
            </Reveal>
          ) : (
            <Reveal>
              <ul>
                {published.map((post, i) => (
                  <li key={post.slug}>
                    <PublishedRow post={post} eager={i === 0} />
                  </li>
                ))}
                {upcoming.map((post) => (
                  <li key={post.slug}>
                    <ScheduledRow post={post} />
                  </li>
                ))}
              </ul>
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

/** A published post: one row, words in the middle, thumbnail on the right. */
function PublishedRow({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  return (
    <Link
      to={`/resources/blog/${post.slug}`}
      className={`group ${ROW} border-t border-dark/[0.10] py-[26px] transition-colors duration-200 hover:bg-cream/50`}
    >
      <div className="font-grotesk text-[11px] font-medium uppercase tracking-[0.1em] lg:pt-[6px]">
        <time dateTime={post.publishedAt} className="block text-dark">
          {formatPostDate(post.publishedAt)}
        </time>
        <span className="block pt-[4px] text-muted">{trackById(post.track).label}</span>
      </div>

      <div className="min-w-0">
        <h2 className="relative inline-block font-serif text-[24px] leading-[1.24] text-dark md:text-[27px]">
          {post.title}
          <span className="absolute -bottom-[2px] left-0 right-0 border-b border-dashed border-dark/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </h2>
        <p className="max-w-[620px] pt-[10px] font-sans text-[15.5px] leading-[1.6] text-muted">
          {post.excerpt}
        </p>
      </div>

      {/* Small, and last in the DOM as well as on the page: the row reads
          perfectly well on a post that never got art. */}
      <div className="lg:pt-[4px]">
        <PostTile post={post} eager={eager} ratio="aspect-[16/10]" />
      </div>
    </Link>
  )
}

/**
 * A scheduled post.
 *
 * Not an anchor, and stripped of everything that would promise a destination:
 * no hover, no underline, no cursor, no href. The thumbnail is desaturated so
 * every track lands on the same neutral, and the date says when it arrives.
 */
function ScheduledRow({ post }: { post: BlogPost }) {
  return (
    <div className={`${ROW} border-t border-dark/[0.10] py-[26px]`} aria-label={`Scheduled: ${post.title}`}>
      <div className="font-grotesk text-[11px] font-medium uppercase tracking-[0.1em] lg:pt-[6px]">
        <span className="block text-accent-orange">Coming {formatShortDate(post.publishedAt)}</span>
        <span className="block pt-[4px] text-muted/70">{trackById(post.track).label}</span>
      </div>

      <div className="min-w-0">
        {/* /65 rather than a lighter tint: at this size WCAG still wants the
            full 4.5:1, and the greyed thumbnail already says "not yet". */}
        <h2 className="font-serif text-[24px] leading-[1.24] text-dark/65 md:text-[27px]">
          {post.title}
        </h2>
        {/* The excerpt runs here too. Holding it back left the row a title
            floating over a hundred pixels of nothing, because the thumbnail
            sets the height either way, and it broke the even rhythm that is
            the reason to choose a list. The grey date and the desaturated
            picture already carry "not published". */}
        <p className="max-w-[620px] pt-[10px] font-sans text-[15.5px] leading-[1.6] text-muted/75">
          {post.excerpt}
        </p>
      </div>

      <div className="opacity-40 grayscale lg:pt-[4px]">
        <PostTile post={post} ratio="aspect-[16/10]" />
      </div>
    </div>
  )
}
