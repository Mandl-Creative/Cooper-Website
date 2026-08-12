/* ──────────────────────────────────────────────────────────────
   Blog — /resources/blog

   Structured after Harvey, Glean and Gamma, which converge on the
   same three things: one distinguished lead post, a card of
   image + tag + date + title, and a finite page that ends on a
   capture slot rather than on nothing. Abridge is the counter-
   example — a wall of undifferentiated title-and-date rows that
   only survives on volume.

   Two deliberate departures, both because Cooper's archive will be
   thin by design for a quarter:

     · The hero states the three tracks and the weekly cadence.
       Every reference blog is an established publication where a
       short archive would read as neglect. Saying "three tracks,
       one post every Thursday" turns "there are only five posts"
       into "this launched five weeks ago and is on schedule".

     · The two existing resources are injected into the card grid
       rather than parked in a footer band. This fills the grid at
       low post counts and puts the conversion path inside the
       reading flow, which is the job the blog is actually here to
       do.

   No pagination, no search, no read time, no filter chips. See
   FILTER_MIN_POSTS in src/data/blog.ts for when chips earn their
   place.
─────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import Navbar from './Navbar'
import Footer from './Footer'
import Reveal from './Reveal'
import BlogPostCard, { PostMeta, PostTile } from './BlogPostCard'
import { BLOG_TRACKS, publishedPosts } from '../data/blog'
import { RESOURCES } from '../data/resources'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'

export const BLOG_TITLE = 'Blog — Cooper'
export const BLOG_DESCRIPTION =
  'Notes from the people building AI for commercial insurance. Engineering deep dives, where the industry is heading, and brokers on their own work. A new post every Thursday.'

const PAGE_PATH = '/resources/blog'

/* The two resources that ride in the card grid. Pulled from the same catalog
   that feeds the nav dropdown and the footer, so a retitle lands everywhere.
   Not the white paper: it is post one, and a page should not offer the same
   destination twice in one grid under two different framings. */
const GRID_RESOURCES = ['/resources/roi-calculator', '/integrations']
  .map((to) => RESOURCES.find((r) => r.to === to))
  .filter((r): r is (typeof RESOURCES)[number] => Boolean(r))

/** Where each resource card sits in the stream, once the featured post is out. */
const RESOURCE_SLOTS = [2, 6]

/**
 * How many resource cards to inject.
 *
 * Two, unless two would leave exactly one card alone on the final row. A lone
 * trailing card reads as a layout bug rather than as a deliberate slot, and at
 * five posts that is precisely what happens: 5 + 2 = 7, and 7 wraps to 3 + 3 + 1.
 * Dropping to one gives 6, which is two full rows.
 */
function resourceCount(posts: number, columns: number): number {
  const orphaned = (n: number) => (posts + n) % columns === 1
  if (!orphaned(2)) return 2
  if (!orphaned(1)) return 1
  return 2
}

export default function BlogIndexPage() {
  useSeo({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    canonicalPath: PAGE_PATH,
    jsonLd: pageJsonLd({ name: 'Blog', path: PAGE_PATH, description: BLOG_DESCRIPTION }),
  })

  const [featured, ...rest] = publishedPosts

  /* Interleave posts and resource cards into one stream, so the grid never has
     to reason about two lists. Slots past the end simply append. */
  const stream: Array<
    { kind: 'post'; key: string; post: (typeof publishedPosts)[number] } | { kind: 'resource'; key: string; resource: (typeof GRID_RESOURCES)[number] }
  > = rest.map((post) => ({ kind: 'post' as const, key: post.slug, post }))

  /* Below five items a three-column grid leaves an orphan in a nearly empty
     row, which reads as broken. Two columns keeps it composed. */
  const cols = rest.length + 2 <= 4 ? 2 : 3
  const columns = cols === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'

  GRID_RESOURCES.slice(0, resourceCount(rest.length, cols)).forEach((resource, i) => {
    const at = Math.min(RESOURCE_SLOTS[i] ?? stream.length, stream.length)
    stream.splice(at + i, 0, { kind: 'resource', key: resource.to, resource })
  })

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* ── Hero + track legend ────────────────────────────────── */}
      <section className="bg-cream px-5 pb-[64px] pt-[140px] md:px-10 md:pt-[160px] lg:px-[62px]">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <p className="font-grotesk text-[12px] font-medium uppercase tracking-[0.14em] text-accent-orange">
              Blog
            </p>
            <h1 className="max-w-[820px] pt-[16px] font-serif text-[38px] leading-[1.08] tracking-[-0.5px] text-dark md:text-[52px] lg:text-[58px]">
              Notes from the people building AI for insurance
            </h1>
            <p className="max-w-[620px] pt-[20px] font-sans text-[17px] leading-[1.55] text-muted">
              Three tracks, one post every Thursday.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-[48px] grid gap-[16px] md:grid-cols-3">
              {BLOG_TRACKS.map((track) => (
                <div
                  key={track.id}
                  className="rounded-[16px] border border-dark/10 bg-cream-light/60 p-[22px]"
                >
                  <h2 className="font-grotesk text-[12px] font-medium uppercase tracking-[0.12em] text-accent-orange">
                    {track.label}
                  </h2>
                  <p className="pt-[10px] font-sans text-[14.5px] leading-[1.5] text-muted">
                    {track.blurb}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Featured ───────────────────────────────────────────── */}
      {featured && (
        <section className="px-5 pt-[72px] md:px-10 lg:px-[62px]">
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <h2 className="font-grotesk text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
                Latest
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <article className="group mt-[20px]">
                <Link
                  to={`/resources/blog/${featured.slug}`}
                  className="grid gap-[28px] lg:grid-cols-2 lg:items-center lg:gap-[48px]"
                >
                  <PostTile post={featured} eager />
                  <div>
                    <PostMeta post={featured} />
                    <h3 className="pt-[12px] font-serif text-[28px] leading-[1.12] text-dark group-hover:text-accent-orange md:text-[36px]">
                      {featured.title}
                    </h3>
                    <p className="max-w-[520px] pt-[14px] font-sans text-[16px] leading-[1.55] text-muted">
                      {featured.excerpt}
                    </p>
                    <p className="pt-[18px] font-grotesk text-[13px] text-dark">
                      {featured.author.name}
                      <span className="text-muted"> · {featured.author.role}</span>
                    </p>
                    <span className="mt-[18px] inline-flex items-center gap-[8px] font-grotesk text-[14px] font-medium text-accent-orange">
                      Read the post
                      <ArrowRight size={16} weight="regular" />
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── The grid ───────────────────────────────────────────── */}
      {stream.length > 0 && (
        <section className="px-5 pt-[72px] md:px-10 lg:px-[62px]">
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <h2 className="font-grotesk text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
                All posts
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <div className={`mt-[24px] grid gap-x-[28px] gap-y-[48px] md:grid-cols-2 ${columns}`}>
                {stream.map((item) =>
                  item.kind === 'post' ? (
                    <BlogPostCard key={item.key} post={item.post} />
                  ) : (
                    <ResourceCard key={item.key} resource={item.resource} />
                  ),
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Close ──────────────────────────────────────────────── */}
      <section className="mt-[96px] bg-dark px-5 py-[80px] md:px-10 lg:px-[62px]">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-[28px] lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-[620px] font-serif text-[30px] leading-[1.14] text-cream-light md:text-[38px]">
            See Cooper run on your own submissions
          </h2>
          <Link
            to="/demo"
            className="inline-flex shrink-0 items-center gap-[10px] rounded-full bg-accent-orange px-[28px] py-[14px] font-grotesk text-[15px] font-medium text-cream-light transition-colors hover:bg-accent-orange-deep"
          >
            Request a Demo
            <ArrowRight size={16} weight="regular" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/** A resource sitting in the post grid. Flat fill and an icon rather than a
    photograph, so it reads as furniture and never as a post missing its art. */
function ResourceCard({ resource }: { resource: (typeof RESOURCES)[number] }) {
  const Icon = resource.icon

  return (
    <article className="group h-full">
      <Link to={resource.to} className="flex h-full flex-col">
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-[12px] border border-dark/10 bg-cream">
          <Icon size={40} weight="thin" className="text-accent-orange" />
        </div>

        <div className="pt-[16px]">
          <p className="font-grotesk text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            From Cooper
          </p>
          <h3 className="pt-[8px] font-serif text-[22px] leading-[1.18] text-dark group-hover:text-accent-orange md:text-[24px]">
            {resource.title}
          </h3>
          <p className="pt-[8px] font-sans text-[15px] leading-[1.5] text-muted">{resource.desc}</p>
        </div>
      </Link>
    </article>
  )
}
