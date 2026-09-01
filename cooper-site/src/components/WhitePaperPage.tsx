/* ──────────────────────────────────────────────────────────────
   White Paper — "The AI Advantage for Insurance Agents."

   Layout: an article column with a form rail beside it, after the
   reference set for gated papers (Figma's Forrester report, Sprout
   Social, Mural, Deel).
     1. Key takeaways box (the exec-summary bullets) at the top of the
        article column.
     2. The gate form in the rail, sticky, in view the whole way down.
     3. The executive summary, then the paper behind the gate, with a
        second CTA over the blur for the reader who has scrolled past
        the rail on a phone.
     4. A closing CTA banner (matches the Integrations / Careers banner).

   Gutters are the navbar's 62px rather than the 85px this page used, so
   the rail's right edge lands on the same margin as Request a Demo and
   the hero's eyebrow lines up under the logo.

   Gated per Amar, Jul 31, superseding the ungated Jul 21 decision: the
   visitor leaves a name, work email, company and phone before the body
   opens, same fields as the demo form.

   What "gated" means here is worth being precise about, because the
   first pass at it was not a gate. It rendered the whole paper and put
   `blur-[6px]` over it, so the text sat in the client bundle and, since
   the route is prerendered, in the static HTML too — 3,900 words that
   `curl` returned with no JavaScript and no form. Deleting one class in
   devtools was the entire bypass.

   So the split is now physical rather than visual:

     · the executive summary lives in src/content/white-paper-preview.md,
       ships to the browser, and stays indexable — it is the teaser;
     · the rest lives in api/_white-paper-body.ts, which only the
       serverless function imports, and arrives over the wire after
       api/white-paper.ts has seen the upstream lead call succeed;
     · the locked state renders a skeleton, not the paper. There is no
       hidden text to reveal, so there is nothing a devtools user can do
       that a form-filler could not.

   scripts/assert-gate.cjs fails the build if the body ever turns up in
   dist/ again.
─────────────────────────────────────────────────────────────── */

import { useState, useSyncExternalStore } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import { LockSimple } from '@phosphor-icons/react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhitePaperGateForm from './WhitePaperGateForm'
import WhitePaperGateModal from './WhitePaperGateModal'
import WhitePaperGateSheet from './WhitePaperGateSheet'
import WhitePaperReport from './WhitePaperReport'
import { useSeo } from '../lib/useSeo'
import { SITE_ORIGIN, absoluteUrl } from '../lib/site'
import preview from '../content/white-paper-preview.md?raw'

/* The teaser, split for rendering by hand rather than through the markdown
   renderer. It is one heading and its prose — assert-gate holds it to being a
   verbatim excerpt of the paper's opening — and rendering it directly is what
   lets the final paragraph carry the blur onto its own last line instead of
   closing and handing over to a separate blurred block underneath. */
const TEASER_BLOCKS = preview.trim().split(/\n{2,}/)
const TEASER_HEADING = TEASER_BLOCKS[0].replace(/^#+\s+/, '')
const TEASER_PARAGRAPHS = TEASER_BLOCKS.slice(1)

/* ── Where an unlocked paper lives between renders.

   Session-scoped, so a refresh part-way through a ten minute read does not ask
   the reader to fill the form again. It is a convenience for someone who has
   already converted, never the thing keeping anyone out: an empty cache costs a
   form, and a forged one buys markdown the server would have handed over anyway.

   Read through useSyncExternalStore rather than an effect. The page is
   prerendered, so the HTML always says "locked"; reading storage during render
   would contradict that HTML at hydration, and reading it in an effect would
   flash the locked state at a returning reader. getServerSnapshot answers null
   for the prerender, getSnapshot answers the cache once the browser takes over,
   and React handles the switch. ── */
const CACHE_KEY = 'cooper_white_paper_body'

/* ── Which gate layout the visitor gets.

   A — the form in a rail beside the paper, with a card over the blurred
       remainder that opens the same form as a modal.
   B — no rail and no card. A screenful of the paper with nothing asked, then
       the page dissolving into a panel that rises from the bottom, the way a
       metered article on Every or the New York Times ends.

   C — no withholding on the page at all. Findings, a summary and a statement
       of what the paper covers, all in the open, with the cover and the form
       in a rail beside them. Ramp's report page. It lives in
       WhitePaperReport.tsx, because it shares a hero with neither of the
       others.

   C is what /resources/white-paper serves. It was picked over the other two
   after all three were built and looked at, and it is also the one that gives
   the most away for free, which makes it the one search engines can read.

   A and B stay reachable at ?gate=a and ?gate=b rather than being deleted:
   they are the comparison the choice was made against, and every lead already
   carries which of the three converted it, so a real split test is a bucketing
   decision away rather than a rebuild. If they are not wanted, deleting them is
   this constant, three components and their branches.

   Resolved through useSyncExternalStore because the URL is not readable while
   prerendering: getServerSnapshot answers with the default, and the browser
   corrects it after hydration rather than contradicting the markup during
   it. ── */
export type GateLayout = 'a' | 'b' | 'c'

const LAYOUTS: GateLayout[] = ['a', 'b', 'c']
const DEFAULT_LAYOUT: GateLayout = 'c'

const noopSubscribe = () => () => {}

function readLayout(): GateLayout {
  try {
    const v = new URLSearchParams(window.location.search).get('gate') as GateLayout | null
    return v && LAYOUTS.includes(v) ? v : DEFAULT_LAYOUT
  } catch {
    return DEFAULT_LAYOUT
  }
}

/* Survives sessionStorage being unavailable (Safari private mode throws on
   write), so an unlock still holds for the rest of the visit. */
let memoryCache: string | null = null
const listeners = new Set<() => void>()

function subscribeToCache(onChange: () => void): () => void {
  listeners.add(onChange)
  return () => { listeners.delete(onChange) }
}

function readCache(): string | null {
  if (memoryCache !== null) return memoryCache
  try { return sessionStorage.getItem(CACHE_KEY) } catch { return null }
}

function writeCache(body: string): void {
  memoryCache = body
  try { sessionStorage.setItem(CACHE_KEY, body) } catch { /* memory is enough */ }
  listeners.forEach((l) => l())
}

/* ── Markdown body styling (mirrors LegalDocPage, tuned for long-form reading) ── */
const linkCls =
  'text-accent-orange underline decoration-accent-orange/30 hover:decoration-accent-orange transition-colors break-words'
/* text-pretty on the prose and text-balance on the headings: both stop a line
   from breaking with a single word stranded on the next one, which this paper
   was doing repeatedly. The browser does the work, so it keeps holding as the
   copy is edited rather than needing sentences hand-tuned to a width. */
const pCls = 'font-sans text-[16px] leading-[1.75] text-dark/70 mb-[18px] text-pretty'
const h2Cls = 'font-serif text-[26px] md:text-[30px] leading-[1.2] text-dark mt-[52px] mb-[20px] text-balance'
const h3Cls = 'font-sans font-semibold text-[17px] text-dark mb-[12px] mt-[32px] text-balance'
const listCls = 'font-sans text-[16px] leading-[1.75] text-dark/70 mb-[18px] pl-[22px] space-y-[8px] text-pretty'

/* ── The exec-summary bullets, kept out of the markdown so they can be
   rendered as a highlighted box at the top (and reused for the SEO
   description / answer engines). Each is a bold lead-in + the rest. ── */
const TAKEAWAYS: { lead: string; rest: string }[] = [
  {
    lead: 'AI has moved from chat assistants to completing essential work:',
    rest: ' modern platforms complete submissions, fill ACORD forms and carrier supplements, drive live carrier portals and raters, compare quotes, and build proposals.',
  },
  {
    lead: 'The adoption window favors agencies that move now.',
    rest: ' Adoption is wide but shallow. 68% of agencies plan to increase their AI use this year, yet only 8% have it embedded in daily workflows and 46% say they are not prepared to keep pace with technology.',
  },
  {
    lead: 'Evaluate on seven criteria:',
    rest: ' end-to-end workflow coverage, measured accuracy, real portal and rater execution, security and data-use policies, integration with your systems, human oversight, and insurance-specific depth.',
  },
  {
    lead: 'End-to-end beats point solutions.',
    rest: ' Tools that automate one step leave the rest of the work where it was. Cooper covers the whole chain, intake, ACORD forms and carrier supplements, portal submission, quote comparison, proposals, and renewals, so an agency runs one platform instead of stitching several together.',
  },
]

/* ── The takeaways, as layout B shows them: in the hero, under the standfirst,
   with no card around them and no "Key takeaways" label above them.

   Measurements from the Figma (node 5776:16): 16px between items, 16px from
   bullet to text, a 12px mark, 15px type at 1.5. Layout A keeps the boxed
   version — it is the control, and moving its furniture would make the two
   arms differ in more than the one thing the test is about.

   The bullet is Cooper's own mark, exported from the design rather than
   redrawn: at 12px it is a simplified silhouette of the logo, not the full
   glyph in public/images/cooper-icon.svg, whose inner cutouts turn to mud at
   this size. ── */
function Takeaways() {
  return (
    <ul
      className="flex animate-fade-blur-in flex-col gap-[16px]"
      style={{ animationDelay: '0.1s' }}
    >
      {TAKEAWAYS.map((t) => (
        <li key={t.lead} className="flex gap-[16px]">
          <img
            src="/images/cooper-bullet.svg"
            alt=""
            aria-hidden
            /* Nudged down to sit on the first line rather than above it: the
               mark is 12px against a 22.5px line, so half the difference.
               Driven to cream by filter rather than by shipping a second file
               of the same shape — this list only ever renders on the dark
               hero. */
            className="mt-[5px] size-[12px] shrink-0 brightness-0 invert"
          />
          <p className="font-sans text-[15px] leading-[1.5] text-cream-light/65">
            <span className="font-medium text-cream-light">{t.lead}</span>
            {/* Condensed on mobile: the lead sentence carries the point, and the
                full clause is there from sm up. */}
            <span className="hidden sm:inline">{t.rest}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}

/* ── The paper's cover.

   Every comparable page shows the document itself beside the headline —
   AngelList, Webflow, Mural, Figma's Forrester report, Ramp — and the absence
   of it was the structural gap in the feedback.

   Shown as a printed object, because a gated download reads as more substantial
   when it looks like a thing that exists.

   The object is CSS, not photography — which is how Webflow does it, and their
   markup is the argument for it: their asset is a flat 1300×1920 cover and the
   book is an `.ebook-cover` wrapper with an `.ebook-cover_overlay` on top,
   carrying the rounding, the gutter shading and the shadow.

   A photographed mockup would have been easier to make and worse to own. It
   bakes in a backdrop, so it only composites on the one page colour it was lit
   for and every other background needs a re-render. It bakes in an angle, and
   this one has to be square on. It bakes in a resolution. And swapping the
   artwork later means re-shooting rather than replacing a file.

   Flat artwork plus CSS has none of that: the image is the cover and nothing
   else, and the object is markup.

   The gutter is two overlays rather than one. A single dark gradient reads as a
   smudge; a hard hairline at the very edge plus a soft falloff beside it reads
   as a spine, because that is what the eye is actually looking for — the fold,
   and then the page curving away from it.

   The artwork is the designed cover, typography and all. Nothing here draws on
   top of it — the earlier version set the type in markup because the artwork it
   had was AI-generated and came back in a typeface the site does not own. This
   one is set in Cooper's own faces already, so overlaying anything would be
   drawing a second title over the real one. ── */
function PaperCover() {
  return (
    <div className="relative">
      <img
        src="/images/white-paper-cover.jpg"
        alt="The AI Advantage for Insurance Agents, a Cooper white paper"
        width={900}
        height={1244}
        /* Square on the bound edge, rounded on the fore edge. That asymmetry is
           most of what says "book"; it does the work the shading would
           otherwise have to do heavily. */
        className="block w-full rounded-l-[3px] rounded-r-[18px] shadow-[0_28px_50px_-26px_rgba(0,0,0,0.55)]"
      />
      {/* The page curving away from the fold. Deliberately faint — the point is
          that it should not be noticed as an effect, only as depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[9%] rounded-l-[3px] bg-gradient-to-r from-black/25 via-black/[0.06] to-transparent"
      />
      {/* The fold itself: one hairline. Two overlays rather than one gradient,
          because a single dark ramp reads as a smudge, while a hard edge with a
          soft falloff beside it reads as a spine. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] rounded-l-[3px] bg-black/25"
      />
    </div>
  )
}

/* ── FAQ, mirrored from the paper's FAQ section, used for FAQPage JSON-LD
   (eligible for the FAQ rich result and read by answer engines). ── */
const FAQ: { q: string; a: string }[] = [
  {
    q: 'What can AI actually do for an insurance agency today?',
    a: 'Production-ready AI platforms read intake documents (dec pages, loss runs, applications), fill ACORD forms and carrier supplements, submit risks through live carrier portals and raters in parallel, normalize quotes into side-by-side comparisons, generate client proposals, and monitor renewals. The best tools, like Cooper, cover this entire chain rather than a single step.',
  },
  {
    q: 'Will AI replace insurance agents?',
    a: 'No. Coverage advice, carrier relationships, negotiation, and client trust remain human work, and that specialist judgment is the hardest thing in the industry to hire for. AI removes the busywork around it so the specialists you already have spend their time there, which is why it reads as leverage on scarce expertise rather than as a substitute for producers.',
  },
  {
    q: 'What should an agency look for when evaluating AI tools?',
    a: 'Seven things: end-to-end workflow coverage; measured real-world accuracy on your own documents; execution inside carrier portals and raters, not just filled PDFs; security and data-use commitments (SOC 2 Type II, HIPAA, no training on your data); integration with your existing AMS and templates; human review points before anything reaches a carrier or an insured; and insurance-specific depth.',
  },
  {
    q: 'How is Cooper different from other insurance AI tools?',
    a: 'Cooper completes the end-to-end workflow, from intake to renewal, rather than automating one step. It fills forms with 99.2% form-fill accuracy, drives live carrier portals and raters to market a risk across every carrier in parallel, flags coverage differences and silent downgrades across quotes, delivers proposals in your agency\'s templates, and reaches first quote 4x faster. It has processed more than $180M in premiums to date.',
  },
  {
    q: 'Is client data safe with an AI platform like Cooper?',
    a: 'Look for independent attestation. Cooper is SOC 2 Type II certified, HIPAA compliant, and contractually commits to no model training on customer data. Those are the three commitments any agency should require of any AI vendor.',
  },
]

const PAGE_PATH = '/resources/white-paper'
export const PAGE_TITLE = 'AI for Insurance Agents: How to Evaluate Tools'
export const PAGE_DESC =
  'Why the moment to adopt AI is now, and how to evaluate the tools that actually finish the job. A Cooper white paper for insurance agents and brokers.'

function jsonLd() {
  const url = absoluteUrl(PAGE_PATH)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: 'The AI Advantage for Insurance Agents',
        description: PAGE_DESC,
        url,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        author: { '@type': 'Organization', name: 'Cooper', url: `${SITE_ORIGIN}/` },
        publisher: { '@type': 'Organization', name: 'Cooper', url: `${SITE_ORIGIN}/` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        /* Google's paywalled-content markup. Declaring the gate is what keeps
           serving different HTML to crawlers than to readers from being read as
           cloaking; the selector names the region that is not free. */
        isAccessibleForFree: false,
        hasPart: {
          '@type': 'WebPageElement',
          isAccessibleForFree: false,
          cssSelector: '.wp-gated',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'White Paper', item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }
}

/* ── One renderer for both halves of the paper, so the gated body cannot come
   back looking different from the summary above it. ── */
const mdComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => <h2 className={h2Cls}>{children}</h2>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 className={h2Cls}>{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 className={h3Cls}>{children}</h3>,
  h4: ({ children }: { children?: React.ReactNode }) => <h3 className={h3Cls}>{children}</h3>,
  p: ({ children }: { children?: React.ReactNode }) => <p className={pCls}>{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className={`${listCls} list-disc`}>{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className={`${listCls} list-decimal`}>{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-medium text-dark">{children}</strong>,
  em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} className={linkCls} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  hr: () => <hr className="my-[36px] border-dark/[0.08]" />,
}

/* ── The locked state.

   Shapes rather than prose, and the distinction is the whole point: none of
   this carries text, so the blur is decoration over nothing instead of a
   curtain over something. Un-blurring it in devtools yields grey rectangles.

   The first pass drew each line as one solid bar, which is why it looked
   cheap — a solid bar blurs into a smear, and a stack of smears reads as
   "content is loading". Blurred writing does not look like that. What the eye
   recognises is the rhythm of words: short runs of ink separated by gaps, of
   uneven length, with the gaps landing in different places on every line. So
   each line here is a row of word-shaped segments, and at 7px of blur they
   melt into something that reads as a page of out-of-focus text.

   The rest of the realism is in the irregularity — headings shorter than body
   lines, paragraphs of different depths, an indented run standing in for a
   list, an occasional denser segment where bold type would sit, and last lines
   that stop short. Every width is hard-coded rather than generated: this
   renders during prerender and again in the browser, and anything random would
   differ between the two and tear at hydration. ── */

/* ── Deterministic pseudo-random.

   The ghost text needs word widths that look unplanned, and it renders twice:
   once into static HTML at build time, once in the browser at hydration. Math
   .random() would hand out different widths to the two and React would find the
   markup it was given disagreeing with the markup it wanted. A seeded generator
   gives the same sequence every time it is run, so both passes agree. ── */
function makeRng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = makeRng(20260731)

/* Word widths in em, so they are sized by the font they sit in rather than by
   the column. English word lengths cluster low with a long tail, which is what
   the cube does — mostly short words, occasionally a long one. */
const words = (count: number, min = 1.2, span = 5.2): number[] =>
  Array.from({ length: count }, () => min + Math.pow(rng(), 3) * span)

type Block = { heading?: number[]; body: number[]; indent?: boolean }

/* Word counts, not line counts. Letting the words wrap on their own is what
   makes the right margin ragged and the last line of each paragraph short,
   which is what real prose does and what an earlier pass — lines laid out by
   hand, each ending near the same place — could not manage.

   The first two blocks carry no heading: the withheld text resumes mid-sentence
   from where the teaser stops, so a heading there would claim a new section
   starts exactly where the reader was cut off. */
const SKELETON: Block[] = [
  { body: words(34) },
  { body: words(71) },
  { heading: words(5, 2.4, 4.4), body: words(63) },
  { indent: true, body: words(29) },
  { heading: words(4, 2.4, 4.4), body: words(78) },
  { heading: words(6, 2.4, 4.4), body: words(58) },
]

const TAIL_WORDS = words(16)

/* ── A run of word-shaped spans that flows and wraps exactly as text does.

   One component for the tail on the teaser's last line and for the paragraphs
   below it, because they have to be indistinguishable. They were not before:
   the block underneath was built from percentage-width bars, taller and far
   wider than a word, and a wide bar keeps its shape under a blur where a word
   dissolves. That is what still looked cut — a band with edges, sitting under a
   line of properly dissolved text.

   Sized in em and placed inline, so each span is the size of the word it stands
   in for, in the font it would have been set in. Height is x-height, which is
   where the ink of lowercase text actually sits. ── */
function GhostWords({
  widths,
  ink = 'bg-dark/[0.17]',
  height = '0.52em',
}: {
  widths: number[]
  ink?: string
  height?: string
}) {
  return (
    <>
      {widths.map((w, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span
            className={`inline-block rounded-[2px] align-baseline ${ink}`}
            style={{ width: `${w}em`, height }}
          />
        </span>
      ))}
    </>
  )
}

/* The blur carried onto the teaser's own last line. Without it the visible text
   ends, the paragraph closes, and the blur begins as a separate block below,
   which reads as "here is some other, blurry thing" rather than as a sentence
   the reader was cut off part-way through. */
function GhostTail() {
  return (
    <span aria-hidden className="select-none blur-[6px]">
      {' '}
      <GhostWords widths={TAIL_WORDS} />
    </span>
  )
}

/**
 * The paper, dissolving.
 *
 * `onOpen` is what layout A adds: a card over the blur that opens the modal.
 * Layout B passes nothing, because in B the ask is the panel below and a second
 * one floating here would be the thing B exists to remove. Without the card the
 * block is also much shorter — it is a few seconds of "there is more here"
 * before the panel, not a page the reader is meant to sit in front of.
 */
function LockedPaper({ onOpen }: { onOpen?: () => void }) {
  const height = onOpen
    ? 'h-[720px] sm:h-[880px] lg:h-[1020px]'
    : 'h-[300px] sm:h-[360px] lg:h-[420px]'
  return <LockedPaperInner onOpen={onOpen} height={height} />
}

function LockedPaperInner({ onOpen, height }: { onOpen?: () => void; height: string }) {
  return (
    <div className="wp-gated relative">
      {/* Bleed: the blur needs somewhere to spread. Held inside the column, the
          ink stops dead on the column edge and the softness has nowhere to go,
          which is what made the block look trimmed with scissors. The negative
          margin gives it 28px of air on each side and the padding puts the
          content back where it was — and it is also what makes the clip below
          safe, since the clip box now sits wider than any ink inside it.

          Fixed height rather than however tall the ghost words happen to run.
          Left to itself the block is a different height at every width — one
          column of text wraps to far more lines on a phone than on a desktop —
          so the card could not be positioned against it. Overflow is clipped
          where the mask has already faded the ink to nothing, so the cut lands
          on pixels that are transparent anyway. */}
      {/* The bleed is smaller on mobile than the page's own side gutter (px-5 =
          20px on the report layout), so it never pushes past the viewport edge
          and adds a few px of horizontal scroll. It widens to 28px from sm up,
          where the gutters are wider and the extra room is safe. */}
      <div
        aria-hidden
        className={`-mx-[14px] select-none overflow-hidden px-[14px] blur-[6px] sm:-mx-[28px] sm:px-[28px] ${height}`}
        style={{
          /* Fades out rather than stopping, so the page reads as continuing
             past the bottom of the blur instead of ending there. */
          maskImage: 'linear-gradient(to bottom, black 0%, black 62%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 62%, transparent 100%)',
        }}
      >
        {SKELETON.map((block, i) => (
          <div key={i} className={block.indent ? 'pl-[24px]' : undefined}>
            {block.heading && (
              /* Set in the heading's own class, so its ghost words are the size
                 of heading words and inherit the section rhythm above them. */
              <div className={h2Cls}>
                <GhostWords widths={block.heading} ink="bg-dark/[0.22]" height="0.6em" />
              </div>
            )}
            <p className={pCls}>
              <GhostWords widths={block.body} />
            </p>
          </div>
        ))}
      </div>

      {/* The ask, sitting on the blur. Centred against the block rather than
          pinned a fixed distance from its top: at 64px down it sat in the upper
          third with most of the blur below it, which read as the card having
          been dropped on the page rather than as the page continuing behind it.

          46% rather than 50% because the mask thins the ink towards the bottom,
          so the visual weight of the blur sits above the geometric middle and
          the card has to sit a little high to look centred in it. */}
      {onOpen && (
        <div className="absolute inset-x-0 top-[46%] flex -translate-y-1/2 justify-center px-[12px]">
          <div className="w-full max-w-[430px] rounded-[20px] border border-dark/10 bg-cream-light/95 px-[26px] py-[30px] text-center shadow-[0_30px_80px_-34px_rgba(30,26,21,0.5)] backdrop-blur-[3px] sm:px-[36px] sm:py-[34px]">
            <span className="inline-flex items-center gap-[7px] font-grotesk text-[11px] font-medium uppercase tracking-[1.3px] text-accent-orange">
              <LockSimple size={13} weight="bold" /> The rest of the paper
            </span>
            {/* Capped so the line breaks land where they read well; the long
                version orphaned its last word on a line of its own. */}
            <h2 className="mx-auto mt-[12px] max-w-[300px] font-serif text-[25px] leading-[1.16] text-dark sm:text-[27px]">
              Seven criteria and the numbers behind them
            </h2>
            <p className="mx-auto mt-[11px] max-w-[290px] font-sans text-[14.5px] leading-[1.55] text-dark/55">
              Ten more minutes of reading, free. We just ask who you are first.
            </p>
            <button
              type="button"
              onClick={onOpen}
              className="mt-[22px] inline-flex w-full items-center justify-center gap-[8px] rounded-[7px] bg-dark px-[24px] py-[13px] font-sans text-[15px] font-medium text-cream-light transition-all duration-200 hover:scale-[1.02]"
            >
              <LockSimple size={15} weight="bold" /> Unlock to Read
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function WhitePaperPage() {
  /* null while locked; the markdown the server sent once it is not. */
  const body = useSyncExternalStore(subscribeToCache, readCache, () => null)
  const layout = useSyncExternalStore(noopSubscribe, readLayout, (): GateLayout => DEFAULT_LAYOUT)
  const [gateOpen, setGateOpen] = useState(false)

  /* B and C both end in the rising panel, and while it is up the page below is
     held back so there is nothing to scroll past the ask into. */
  const sheetGate = layout !== 'a' && !body

  /* The public opening for layout C's Summary: the same prose the other two
     show, cut off the same way — the last sentence carrying on out of focus,
     then a short stretch of ghost paragraphs fading out.

     C asks for the address in the rail, so this passes no `onOpen` and the
     blurred block renders without a card over it. Without the blur the summary
     simply stopped, and a summary that stops reads as the whole of it; the
     point of the tail is that the reader can see the sentence continuing. */
  const lockedSummary = (
    <>
      {TEASER_PARAGRAPHS.map((para, i) => (
        <p key={i} className={pCls}>
          {para}
          {i === TEASER_PARAGRAPHS.length - 1 && <GhostTail />}
        </p>
      ))}
      <LockedPaper />
    </>
  )

  function handleUnlock(markdown: string) {
    writeCache(markdown)
    setGateOpen(false)
  }

  useSeo({
    title: PAGE_TITLE,
    description: PAGE_DESC,
    canonicalPath: PAGE_PATH,
    jsonLd: jsonLd(),
  })

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {layout === 'c' ? (
        <WhitePaperReport
          body={body}
          lockedSummary={lockedSummary}
          mdComponents={mdComponents}
        />
      ) : (
        <>
      {/* ══════════════ HERO ══════════════

          Layout B's hero is dark; A keeps the cream it has always had, because
          A is the control and the two arms should differ in the gate, not in
          everything. On the dark ground the orange cover stops being one warm
          object on a warm field and becomes the only lit thing on the screen,
          which is the whole reason to show a cover at all. ══════════════ */}
      <section className={`pt-[120px] pb-[56px] ${layout === 'b' ? 'bg-dark' : 'bg-cream'}`}>
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[62px]">
          {/* Layout B centres a 1216px block — the 860px text column, a gutter,
              and the 300px cover — rather than centring the text column alone.
              Centring the text and hanging the cover off its right would push
              the type off centre; this way the pair reads as centred and the
              text column's left edge still lines up with the body below it,
              which uses the same 1216px block with the right column empty.

              Below lg the grid stacks, so the cover lands after the takeaways
              rather than above the headline, where a placeholder would take the
              whole first screen of a phone. */}
          <div className={layout === 'b' ? 'mx-auto max-w-[1216px]' : ''}>
          <div
            className={
              layout === 'b'
                ? 'grid gap-[36px] lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-[56px]'
                : ''
            }
          >
          <div className="max-w-[860px]">
            {/* ── The kicker.

                Layout A keeps the plain uppercase eyebrow it has always had —
                it is the control, and changing its furniture would leave the
                two arms differing in more than the one thing under test.

                B gets a pill instead, which is what the category does on every
                comparable page: Eventbrite's trends report, AngelList's data
                report, Maze, Faire, Sketch. A pill reads as a label on the
                thing; loose uppercase text reads as the first line of it. The
                mark inside is Cooper's own, the same asset the takeaway bullets
                use. ── */}
            {layout === 'a' ? (
              <span className="mb-[14px] block animate-fade-blur-in font-grotesk text-[11px] font-medium uppercase tracking-[1.4px] text-accent-orange">
                White Paper
              </span>
            ) : (
              <span className="mb-[18px] inline-flex animate-fade-blur-in items-center gap-[7px] rounded-full border border-cream-light/20 bg-cream-light/[0.07] py-[5px] pl-[9px] pr-[12px] font-grotesk text-[11px] font-medium uppercase tracking-[1.2px] text-cream-light/80">
                <img src="/images/cooper-bullet.svg" alt="" aria-hidden className="size-[11px]" />
                White Paper
              </span>
            )}
            <h1
              className={`mb-[20px] animate-fade-blur-in font-serif text-[40px] leading-[1.08] tracking-[-1px] md:text-[54px] ${
                layout === 'b' ? 'text-cream-light' : 'text-dark'
              }`}
              style={{ animationDelay: '0.05s' }}
            >
              The AI Advantage for Insurance Agents
            </h1>
            <p
              className={`mb-[20px] max-w-[680px] animate-fade-blur-in font-sans text-[17px] leading-[1.55] ${
                layout === 'b' ? 'text-cream-light/60' : 'text-dark/60'
              }`}
              style={{ animationDelay: '0.08s' }}
            >
              Why the moment to adopt is now, and how to evaluate tools that actually finish the job.
            </p>

            {/* Who the paper is for, stated rather than left to be inferred. */}
            <p
              className={`mb-[20px] max-w-[680px] animate-fade-blur-in font-sans text-[13px] italic leading-[1.5] text-pretty ${
                layout === 'b' ? 'text-cream-light/45' : 'text-dark/45'
              }`}
              style={{ animationDelay: '0.09s' }}
            >
              Written for commercial P&amp;C agencies and brokerages running submissions from intake to renewal.
            </p>

            {/* ── The dateline.

                A carries date and reading time. B adds the publisher, and puts
                the line above the takeaways rather than below them: on
                AngelList, Wise, Eventbrite, Faire and Sketch this metadata sits
                directly under the standfirst, where it answers "what is this,
                how long, who says so" before the argument starts rather than
                trailing after it.

                Separator is the middot the rest of the site uses. ── */}
            <div
              className={`flex flex-wrap items-center gap-[10px] animate-fade-blur-in font-grotesk text-[12px] font-medium uppercase tracking-[1.2px] ${
                layout === 'b' ? 'text-cream-light/45' : 'text-dark/40'
              }`}
              style={{ animationDelay: '0.1s' }}
            >
              <span>July 2026</span>
              <span className={layout === 'b' ? 'text-cream-light/25' : 'text-dark/20'}>•</span>
              <span>10 min read</span>
              {layout === 'b' && (
                <>
                  <span className={layout === 'b' ? 'text-cream-light/25' : 'text-dark/20'}>•</span>
                  <span>Published by Cooper</span>
                </>
              )}
            </div>

            {layout === 'b' && (
              <div className="mt-[28px]">
                <Takeaways />
              </div>
            )}
          </div>

          {layout === 'b' && (
            <div
              className="w-[188px] max-w-full animate-fade-blur-in sm:w-[224px] lg:w-full"
              style={{ animationDelay: '0.14s' }}
            >
              <PaperCover />
            </div>
          )}
          </div>
          </div>
        </div>
      </section>

      {/* ══════════════ BODY ══════════════

          Article column plus a form rail, at the full container width so the
          rail's right edge lands on the same margin as the navbar's Request a
          Demo button. The pair used to sit inside a 1040px article, which left
          a band of dead cream down the right and made this page read narrower
          than every other one on the site.

          Three grid children rather than a row of two and prose underneath.
          That earlier shape meant the takeaways and the form formed a row whose
          height the form set, so the summary began below the taller of the two
          and a gap of empty page opened under the takeaways. Here the article
          is one continuous column and the rail spans both of its rows, which
          also gives `sticky` something to travel through: a grid item's
          containing block is its grid area, so a rail spanning row 1 to row 2
          follows the reader down the article. Spanning with items-start rather
          than stretching is what leaves that travel available.

          On mobile the grid collapses to source order — takeaways, form,
          summary, paper — so the ask still lands on the first screen. ══════ */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[62px] py-[56px] lg:py-[72px]">
        {/* Layout B drops the rail, so the grid goes with it: one column at the
            hero's own measure, and nothing beside the paper competing with it
            on the first screen. That is the whole of B's bet. */}
        <div
          className={
            layout === 'a'
              ? /* The rail column stays reserved once the paper opens and the
                   form goes away, so unlocking does not reflow the text the
                   reader is in the middle of. */
                'grid gap-[20px] lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-[48px] lg:gap-y-0'
              : /* Same 1216px block the hero uses, with nothing in the right
                   column, so the prose starts on the same left edge as the
                   headline above it. */
                'mx-auto max-w-[1216px]'
          }
        >
          {/* Layout B moved these into the hero, so the body opens straight on
              the executive summary. */}
          {layout === 'a' && (
            <div className="rounded-[20px] border border-dark/[0.09] bg-white/50 p-[24px] md:p-[32px] lg:col-start-1 lg:row-start-1">
              <p className="mb-[20px] font-grotesk text-[12px] font-medium uppercase tracking-[1.6px] text-accent-orange">
                Key takeaways
              </p>
              <ul className="space-y-[12px]">
                {TAKEAWAYS.map((t) => (
                  <li key={t.lead} className="flex gap-[12px]">
                    <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-accent-orange" />
                    <p className="font-sans text-[15px] leading-[1.5] text-dark/70">
                      <span className="font-medium text-dark">{t.lead}</span>
                      {/* Condensed on mobile: the lead sentence carries the point,
                          and the full clause is there from sm up. */}
                      <span className="hidden sm:inline">{t.rest}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hidden once the paper is open: a form following the reader down
              text they have already unlocked is just noise. */}
          {layout === 'a' && !body && (
            <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-[96px]">
              <WhitePaperGateForm onUnlock={handleUnlock} />
            </div>
          )}

          {/* The teaser is replaced by the paper rather than continued into it.
              The withheld text picks up mid-paragraph — "They go to re-keying
              data from dec pages…" — so appending it would leave the reader
              with a paragraph broken in half by a paragraph break. The server
              sends the paper whole, including the opening the teaser quoted,
              and the reader sees one or the other, never both.

              The first heading drops its own 52px top margin, which is spacing
              meant to separate one section of the paper from the previous one
              and has nothing to separate it from here. Left in, it stacked with
              the row gap and pushed the summary clear of the takeaways it
              belongs with. */}
          <article className={`lg:col-start-1 lg:row-start-2 ${layout === 'b' ? 'max-w-[860px]' : ''}`}>
            {/* The top margin only exists to separate the summary from the
                takeaways card above it, which layout B does not have — there
                the section's own padding is the whole gap. */}
            <div
              className={`[&>h2:first-child]:mt-0 ${layout === 'a' ? 'mt-[24px] lg:mt-[32px]' : ''}`}
            >
              {body ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {body}
                </ReactMarkdown>
              ) : (
                <>
                  <h2 className={h2Cls}>{TEASER_HEADING}</h2>
                  {TEASER_PARAGRAPHS.map((para, i) => (
                    <p key={i} className={pCls}>
                      {para}
                      {/* The sentence carries on, out of focus, from where it
                          was cut. Only the last paragraph gets it. */}
                      {i === TEASER_PARAGRAPHS.length - 1 && <GhostTail />}
                    </p>
                  ))}
                </>
              )}
            </div>

            {!body && (
              <LockedPaper onOpen={layout === 'a' ? () => setGateOpen(true) : undefined} />
            )}
          </article>
        </div>
      </div>

      {layout === 'a' && gateOpen && (
        <WhitePaperGateModal onClose={() => setGateOpen(false)} onUnlock={handleUnlock} />
      )}
        </>
      )}

      {/* The ask for B and C alike: fixed to the foot of the viewport, so it
          arrives on the reader's first scroll rather than waiting to be
          scrolled to. Outside the layout branch because both end on it. */}
      {sheetGate && (
        <WhitePaperGateSheet onUnlock={handleUnlock} variant={layout === 'c' ? 'report' : 'sheet'} />
      )}

      {/* ══════════════ CLOSING CTA — contained rounded card
          (same treatment as the Integrations / Careers banner)

          Both this and the footer are held back while layout B's panel is up.
          A gate the reader can scroll straight past is not a gate, and a demo
          banner sitting below it is a second, easier ask that costs nothing —
          which is exactly how a metered page leaks the audience it just
          stopped. Everything comes back the moment the paper opens. ═════════ */}
      {!sheetGate && (
        <>
      <section className="bg-cream-light">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[62px] py-[48px]">
          <div className="relative h-auto overflow-hidden rounded-[30px] lg:h-[420px]">
            <img
              src="/images/about/careers-cta-bg.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative z-10 flex h-full flex-col items-start gap-8 px-5 py-12 md:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-[72px] lg:py-0">
              <div className="flex-1">
                <span className="mb-[16px] block animate-fade-blur-in font-grotesk text-[11px] font-medium uppercase tracking-[1.4px] text-cream-light">
                  Get started
                </span>
                <h2
                  className="mb-[36px] animate-fade-blur-in font-serif text-[36px] leading-[1.15] text-white lg:text-[42px]"
                  style={{ animationDelay: '0.1s' }}
                >
                  See what end-to-end looks like on your book
                </h2>
                <Link
                  to="/demo"
                  className="inline-block w-fit animate-fade-blur-in rounded-[6px] bg-white px-[28px] py-[12px] font-sans text-[15px] font-medium text-dark no-underline transition-all duration-200 hover:scale-[1.03] hover:bg-cream"
                  style={{ animationDelay: '0.25s' }}
                >
                  Request a Demo
                </Link>
              </div>
              <div className="flex w-full flex-1 lg:justify-end">
                <p
                  className="max-w-full animate-fade-blur-in font-sans text-[15px] leading-[24.75px] text-white/80 lg:max-w-[380px]"
                  style={{ animationDelay: '0.2s' }}
                >
                  We'll run one of your real submissions through Cooper in a live walkthrough, intake to renewal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
        </>
      )}
    </div>
  )
}
