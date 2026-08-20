/**
 * The blog catalog — one list behind the index page, the post pages, the
 * prerender route list and the sitemap, so publishing a post is a content file
 * plus one entry here rather than an engineering change in four places.
 *
 * Mirrors the shape of src/data/resources.ts: types, then the data, with the
 * reasoning kept next to the thing it explains.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * 🔴 EVERY ENTRY IS A PREVIEW, NOT A PUBLICATION (Aug 2026)
 *
 * Six of the seven were the editorial calendar, dated forward. They have been
 * pulled back to past dates so the index has a full set of cards to lay out,
 * and their bodies in src/content/blog/ were written to fill the pages. Every
 * one of those carries a `PREVIEW` comment on its date.
 *
 * BEFORE THIS SHIPS, for each entry marked PREVIEW: restore the original date
 * and delete the body, or have the owner approve the copy. Merging as-is
 * publishes six posts nobody signed off on, under dates that are not the plan.
 * Only `automating-submissions` is genuinely live.
 *
 * The machinery underneath is unchanged and still correct. `publishedPosts`
 * cuts on date, so a future-dated entry has no card, no URL and no sitemap
 * line until the build on that day. Two switches, different meanings: a future
 * date means "not yet"; `draft: true` means "not ready", whatever the date.
 * ─────────────────────────────────────────────────────────────────────────
 */

/* The index page's own SEO strings live here rather than in the component so
   prerender.cjs can read them through the SSR entry's re-export. They used to
   be duplicated in the route list, which is the drift the persona and white
   paper modules both carry warnings about. */
export const BLOG_TITLE = 'Blog — Cooper'
export const BLOG_DESCRIPTION =
  'Notes from the people building AI for commercial insurance. Where the industry is heading, engineering deep dives, customer results, and conversations with people across the market. A new post every Thursday.'

export type BlogTrackId =
  | 'state-of-insurance'
  | 'engineering'
  | 'customer-success'
  | 'industry-insider'

/** Track metadata drives the hero legend, the card tags and (later) the filter
    chips from one place, so a renamed track cannot say two things on one page. */
export interface BlogTrack {
  id: BlogTrackId
  /** Card tag and legend heading, e.g. "Engineering". */
  label: string
  /** One line for the hero legend. */
  blurb: string
  /** Roughly what share of posts this track should carry. Editorial guidance,
      not enforced anywhere — it exists so the mix is written down. */
  share: string
  /** Fill for the card's fallback tile when a hero image is missing. Existing
      palette tokens only — the blog does not introduce new colours. */
  tint: 'accent-orange' | 'accent-orange-deep' | 'dark' | 'muted'
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
  /** ISO 'YYYY-MM-DD'. Set only when a live post is materially revised: the
      post page prints "Updated <date>" under the byline when it is present and
      prints nothing when it is not. Never set it to the publish date to fill
      the line, which turns a real signal into decoration. */
  updatedAt?: string
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

/* Four tracks, in rotation order. Customer success and industry insider began
   as one bucket and were split on 12 Aug: a customer describing results with
   Cooper and an industry figure describing the market are different pitches to
   a reader, and the second is far easier to get a yes on. Keeping them separate
   means a quiet quarter for customer references does not also stop the
   interview track. */
export const BLOG_TRACKS: BlogTrack[] = [
  {
    id: 'state-of-insurance',
    label: 'State of Insurance',
    blurb: 'Where commercial insurance and AI are actually heading.',
    share: '50%',
    tint: 'dark',
  },
  {
    id: 'engineering',
    label: 'Engineering',
    blurb: 'How Cooper is built, and how we measure whether it works.',
    share: '30%',
    tint: 'accent-orange',
  },
  {
    id: 'customer-success',
    label: 'Customer Success',
    blurb: 'What changed for teams already running Cooper.',
    share: '10%',
    tint: 'muted',
  },
  {
    id: 'industry-insider',
    label: 'Industry Insider',
    blurb: 'Conversations with people across the insurance world.',
    share: '10%',
    tint: 'accent-orange-deep',
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
    heroImage: '/images/blog/automating-submissions.webp',
    heroImageAlt:
      'A broker working at an oak desk beside a city window at golden hour, seen from behind, with light breaking through a fluted glass panel.',
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
    /* PREVIEW: pulled back from 2026-09-03 so the index has more than one card
       to lay out. Restore the date and delete the body before this ships. */
    publishedAt: '2026-08-06',
    heroImage: '/images/blog/acord-form-accuracy-benchmark.webp',
    heroImageAlt:
      'Warm light refracted into vertical amber bands through a panel of fluted glass.',
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
    /* PREVIEW: pulled back from 2026-09-10. Restore before shipping. */
    publishedAt: '2026-07-16',
    heroImage: '/images/blog/commercial-submission-time-breakdown.webp',
    heroImageAlt:
      'A wristwatch left face-up beside a fanned stack of paper on an oak desk, late golden-hour light throwing long shadows across the grain.',
    seoTitle: 'The Commercial Insurance Submission Process, Timed — Cooper',
    seoDescription:
      'A stage-by-stage time breakdown of one commercial P&C submission: intake, loss runs, ACORD forms, carrier portals and quote comparison. Where the hours actually go.',
  },
  /* Customer success, not industry insider: this is a Cooper customer on their
     own results. Industry insider is someone in the market who need not be a
     customer at all. */
  {
    slug: 'agency-renewal-prep-case-study',
    track: 'customer-success',
    title: 'How one agency cut renewal prep from three hours to fifteen minutes',
    excerpt:
      'A commercial broker on what their week looked like before, what they handed over first, and the part they still do by hand.',
    author: HOUSE,
    /* PREVIEW: pulled back from 2026-09-17. Restore before shipping. */
    publishedAt: '2026-07-30',
    heroImage: '/images/blog/agency-renewal-prep-case-study.webp',
    heroImageAlt:
      'Two colleagues standing at an oak table looking at a laptop together, seen from behind, in late golden-hour light.',
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
    /* PREVIEW: pulled back from 2026-09-24. Restore before shipping. */
    publishedAt: '2026-07-09',
    heroImage: '/images/blog/evals-when-two-answers-are-right.webp',
    heroImageAlt:
      'Two nearly identical printed sheets side by side on an oak desk, warm light from a fluted glass panel falling across the right-hand one.',
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
    /* PREVIEW: pulled back from 2026-10-01. Restore before shipping. */
    publishedAt: '2026-07-02',
    heroImage: '/images/blog/carrier-portal-automation-2026.webp',
    heroImageAlt:
      'A two-monitor workstation seen from behind at sunset, screens glowing warm against a city window.',
    seoTitle: 'Carrier Portal Automation in 2026: What Works — Cooper',
    seoDescription:
      'Automating carrier portal submissions is where broker time is won or lost. What works today, what does not, and how to evaluate a tool that claims to do it.',
  },
  /* Opens the industry insider track. Rochelle is the first approach, and the
     reason the track is worth having: she has a network to tap well beyond her
     own interview, and none of it depends on someone being a Cooper customer. */
  {
    slug: 'industry-insider-rochelle',
    track: 'industry-insider',
    title: 'Industry Insider: what the last five years changed about placing risk',
    excerpt:
      'The first in a series of conversations with people across the insurance world about how the work is actually shifting, and what they think is noise.',
    author: HOUSE,
    /* PREVIEW: pulled back from 2026-10-08. Restore before shipping. */
    publishedAt: '2026-07-23',
    heroImage: '/images/blog/industry-insider-rochelle.webp',
    heroImageAlt:
      'A figure in silhouette at a floor-to-ceiling window holding a coffee cup, city skyline behind them at sunset.',
    seoTitle: 'Industry Insider: How Placing Risk Is Changing — Cooper',
    seoDescription:
      'A conversation about how commercial insurance distribution is changing, what technology has actually altered day to day, and what has not moved at all.',
  },
]

/*
 * A future date is a schedule, not a publication.
 *
 * Without this, an entry dated three Thursdays out is live the moment it is
 * committed, and because the index sorts newest first it takes the featured
 * slot — so the loudest thing on the page becomes the post furthest from being
 * written. That is the state this file shipped in, and it is why the schedule
 * below can sit in the repo at all: an entry earns its URL on its own morning,
 * and until then it has no index card, no route, no sitemap line.
 *
 * Evaluated at build, not in the browser. Every consumer that matters here —
 * the prerender pass, the sitemap, the SSR HTML — runs once per deploy, so the
 * cut is the deploy's date. A post dated Thursday goes live on Thursday's
 * build, which is what `draft: true` would otherwise have to be flipped by hand
 * to do. Drafts still work, and still mean "not ready", regardless of date.
 */
const today = new Date().toISOString().slice(0, 10)

/** The list every consumer reads: index page, post pages, prerender, sitemap. */
export const publishedPosts: BlogPost[] = BLOG_POSTS.filter(
  (p) => !p.draft && p.publishedAt <= today,
).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

/** Everything on the calendar that has not come up yet, soonest first. Drives
    the index's "what's coming" rail, which is what keeps a one-post archive
    reading as a schedule rather than as an empty page. */
export const upcomingPosts: BlogPost[] = BLOG_POSTS.filter(
  (p) => !p.draft && p.publishedAt > today,
).sort((a, b) => a.publishedAt.localeCompare(b.publishedAt))

/* Track filter chips stay hidden until there are roughly three posts per track.
   Filtering a five-post index down to one card is a worse experience than not
   offering the control, and the track is already legible on every card. */
export const FILTER_MIN_POSTS = 9

/* Parsed as UTC and formatted as UTC, so a reader west of Greenwich is not
   shown the day before the one in the file. */
const asUtc = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** Long-form date for cards and post headers, e.g. "Sep 3, 2026".
    en-US: the readership is US brokers, and it is the locale every other
    formatted value on the site uses (see the ROI calculator). */
export function formatPostDate(iso: string): string {
  return asUtc(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Day and month only, for the schedule rail where the year is a given. */
export function formatShortDate(iso: string): string {
  return asUtc(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
