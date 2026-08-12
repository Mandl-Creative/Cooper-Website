/**
 * The blog catalog — one list behind the index page, the post pages, the
 * prerender route list and the sitemap, so publishing a post is a content file
 * plus one entry here rather than an engineering change in four places.
 *
 * Mirrors the shape of src/data/resources.ts: types, then the data, with the
 * reasoning kept next to the thing it explains.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * SCAFFOLDING NOTICE (Aug 2026)
 *
 * The five entries below are the planned schedule, not written posts. Every
 * one of them still needs a body in src/content/blog/, a 16:9 hero image and
 * a 1200x630 OG card. They are here so the index page has something real to
 * lay out against, and so the editorial plan lives in the repo rather than
 * only in a spreadsheet.
 *
 * Before this merges to main, either write the posts or flip `draft` to true
 * on every entry that is not finished. A draft is excluded from the index,
 * the prerendered routes and the sitemap, so it has no URL at all.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type BlogTrackId = 'engineering' | 'state-of-insurance' | 'industry-insider'

/** Track metadata drives the hero legend, the card tags and (later) the filter
    chips from one place, so a renamed track cannot say two things on one page. */
export interface BlogTrack {
  id: BlogTrackId
  /** Card tag and legend heading, e.g. "Engineering". */
  label: string
  /** One line for the hero legend. */
  blurb: string
  /** Fill for the card's fallback tile when a hero image is missing. Existing
      palette tokens only — the blog does not introduce new colours. */
  tint: 'accent-orange' | 'dark' | 'muted'
}

export interface BlogAuthor {
  name: string
  /** Shown beside the name. Never abbreviated on the card. */
  role: string
}

export interface BlogPost {
  /** URL segment. Lowercase, hyphenated, never changed after publish. */
  slug: string
  track: BlogTrackId
  /** On-page H1 and card title. Sentence case, no trailing period. */
  title: string
  /** Card and featured standfirst, 1-2 sentences. Read by a human mid-scroll,
      so it is deliberately not the meta description. */
  excerpt: string
  author: BlogAuthor
  /** ISO 'YYYY-MM-DD'. Thursdays. Drives sort order and the <time> element. */
  publishedAt: string
  /** Root-relative 16:9 image. Omit and the card falls back to a typographic
      tile — see BlogPostCard. Missing art must never block a Thursday. */
  heroImage?: string
  heroImageAlt?: string
  /** Document title. Keep the "— Cooper" suffix the other routes use. */
  seoTitle: string
  /** SERP snippet. Wants keywords; the excerpt wants readability. */
  seoDescription: string
  /** Written but not live: no index entry, no route, no sitemap line. */
  draft?: boolean
}

export const BLOG_TRACKS: BlogTrack[] = [
  {
    id: 'engineering',
    label: 'Engineering',
    blurb: 'How Cooper is built, and how we measure whether it works.',
    tint: 'accent-orange',
  },
  {
    id: 'state-of-insurance',
    label: 'State of Insurance',
    blurb: 'Where commercial insurance and AI are actually heading.',
    tint: 'dark',
  },
  {
    id: 'industry-insider',
    label: 'Industry Insider',
    blurb: 'Brokers on their own work, in their own words.',
    tint: 'muted',
  },
]

export const trackById = (id: BlogTrackId): BlogTrack =>
  BLOG_TRACKS.find((t) => t.id === id) ?? BLOG_TRACKS[0]

/* Authors are named only where the owner has confirmed. Attributing a post to
   someone who has not agreed to write it is how a schedule quietly becomes a
   fiction, so everything unconfirmed carries the house byline until it isn't. */
const HOUSE: BlogAuthor = { name: 'Cooper', role: 'Team' }

/** Authoring order. Append; the sort below handles display order. */
export const BLOG_POSTS: BlogPost[] = [
  /* Post one, and the only entry with a body. It is the worked example: a real
     .md in src/content/blog/, a real byline, real SEO strings. Copy its shape.

     It introduces the paper rather than reprinting it. The paper itself is
     gated and lives outside src/ in api/_white-paper-body.ts; scripts/
     assert-gate.cjs fails the build if any withheld sentence reaches dist/.
     So a post may describe the paper and link to it, never quote it. */
  {
    slug: 'automating-submissions',
    track: 'state-of-insurance',
    title: "Your competitors are automating submissions. Here's how to get there first",
    excerpt:
      'Where a broker week actually goes, why drafting is not the same as finishing, and the seven questions worth asking any tool that claims to take the work back.',
    author: HOUSE,
    publishedAt: '2026-08-13',
    seoTitle: 'AI for Insurance Agents: How to Evaluate Tools — Cooper',
    seoDescription:
      'Why the moment to adopt AI is now, and how to evaluate the tools that actually finish the job, from intake to renewal. A Cooper white paper for insurance agents and brokers.',
  },
  {
    slug: 'acord-form-accuracy-benchmark',
    track: 'engineering',
    title: 'How accurate is AI at filling ACORD forms? We benchmarked it',
    excerpt:
      'Generic AI benchmarks say nothing about whether a tool can finish a submission. Here is what we measure instead, on real broker work, including the numbers we are not proud of.',
    author: { name: 'Shashank', role: 'Engineering' },
    publishedAt: '2026-09-03',
    seoTitle: 'AI ACORD Form Accuracy: A Benchmark — Cooper',
    seoDescription:
      'We benchmarked AI accuracy on ACORD form filling, loss-run extraction and carrier portal completion, on real broker submissions. Full results and method.',
  },
  {
    slug: 'commercial-submission-time-breakdown',
    track: 'state-of-insurance',
    title: 'How long does a commercial submission actually take?',
    excerpt:
      'We followed one submission from intake to quote and timed every stage. The bottleneck is not underwriting judgement, it is the mechanical work stacked around it.',
    author: HOUSE,
    publishedAt: '2026-09-10',
    seoTitle: 'The Commercial Insurance Submission Process, Timed — Cooper',
    seoDescription:
      'A stage-by-stage time breakdown of one commercial P&C submission: intake, loss runs, ACORD forms, carrier portals and quote comparison. Where the hours actually go.',
  },
  {
    slug: 'industry-insider-renewal-prep',
    track: 'industry-insider',
    title: 'How one agency cut renewal prep from three hours to fifteen minutes',
    excerpt:
      'A commercial broker on what their week looked like before, what they handed over first, and the part they still do by hand.',
    author: HOUSE,
    publishedAt: '2026-09-17',
    seoTitle: 'Insurance Agency AI Case Study: Renewal Prep — Cooper',
    seoDescription:
      'A commercial insurance agency on automating renewal preparation with AI: what changed, what did not, and what they would tell another broker considering it.',
  },
  {
    slug: 'evals-when-two-answers-are-right',
    track: 'engineering',
    title: 'Building evals for work where two answers are both right',
    excerpt:
      'Two brokers fill the same ACORD form differently and both are correct. That breaks most evaluation harnesses. Here is how we score it anyway.',
    author: HOUSE,
    publishedAt: '2026-09-24',
    seoTitle: 'Evaluating Insurance AI When There Is No Single Right Answer — Cooper',
    seoDescription:
      'Most insurance tasks have more than one correct output, which breaks conventional AI evals. How Cooper builds evaluation harnesses for ambiguous document work.',
  },
  {
    slug: 'carrier-portal-automation-2026',
    track: 'state-of-insurance',
    title: 'Carrier portal automation: what actually works in 2026',
    excerpt:
      'A tool that drafts a submission but cannot file it has moved the work, not removed it. An honest look at the last mile, including which portals still resist it.',
    author: HOUSE,
    publishedAt: '2026-10-01',
    seoTitle: 'Carrier Portal Automation in 2026: What Works — Cooper',
    seoDescription:
      'Automating carrier portal submissions is where broker time is won or lost. What works today, what does not, and how to evaluate a tool that claims to do it.',
  },
]

/** The list every consumer reads: index page, post pages, prerender, sitemap. */
export const publishedPosts: BlogPost[] = BLOG_POSTS.filter((p) => !p.draft).sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
)

/* Track filter chips stay hidden until there are roughly three posts per track.
   Filtering a five-post index down to one card is a worse experience than not
   offering the control, and the track is already legible on every card. */
export const FILTER_MIN_POSTS = 9

/** Long-form date for cards and post headers, e.g. "3 Sep 2026". */
export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
