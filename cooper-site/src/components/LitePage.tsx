/* ──────────────────────────────────────────────────────────────
   Cooper Lite — the self-serve tier for agencies with up to 5 users.

   Ported from the v0 page engineering shipped on the live site, with a
   rebuilt hero. Abril's brief asked for four things the old hero worked
   against: ivory as the dominant surface (it was a full Deep Night field),
   a real application screen instead of abstract brand texture (it ran the
   reeded-glass signature, Cooper's most premium asset, on the entry tier),
   less marketing shouting (the $499 → $99 line appeared five times on one
   screen, twice above the fold), and transparent pricing read as a trust
   signal rather than a promo.

   Everything below the hero is a faithful port of what is live today,
   including the three dark sections. Lightening those is a separate
   proposal, not something to slip in with the hero.
─────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarBlank,
  Check,
  EnvelopeSimple,
  Files,
  Minus,
  Plus,
  ShieldCheck,
} from '@phosphor-icons/react'
import {
  ANCHOR_OFFSET,
  COMPARE_PATH,
  LiteFooter,
  CooperLiteLockup,
  LiteNav,
  SectionHead,
  SIGNUP_URL,
} from './lite/chrome'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'
import PersonaTestimonial from './PersonaTestimonial'
import {
  AcordsPanel,
  LossRunsPanel,
  PackagePanel,
  ProposalsPanel,
  QuotesPanel,
  ServicePanel,
} from './LiteCapabilityPanels'
import { allTestimonials } from '../data/personas'

/* ── Hero ────────────────────────────────────────────────────── */

function LiteHero() {
  return (
    <section
      className="
        grid grid-cols-1
        lg:grid-cols-[minmax(400px,37%)_1fr] lg:gap-[48px] lg:pl-[40px]
        lg:h-[calc(100svh-83px)] lg:min-h-[660px]
      "
    >
      <div className="flex flex-col px-[24px] pt-[28px] pb-[34px] lg:px-0 lg:py-[44px]">
        <div className="flex flex-col gap-[6px] mb-[20px] lg:flex-row lg:items-baseline lg:gap-[14px] lg:mb-[34px]">
          <span className="font-grotesk text-[11px] uppercase tracking-[.16em] whitespace-nowrap text-dark-2">
            Cooper Lite
          </span>
          <span className="text-[14px] text-muted">For commercial agencies with up to 5 users</span>
        </div>

        <h1 className="font-serif font-normal text-[clamp(34px,9vw,44px)] leading-[1.08] tracking-[-.015em] text-dark-2 lg:text-[clamp(40px,3.5vw,54px)] lg:max-w-[15ch]">
          Get more accounts to market. Faster.
        </h1>

        {/* The gap between the headline and the offer is the point: it is what
            makes the column read as editorial rather than as a pitch. */}
        <div className="hidden lg:block lg:flex-1 lg:min-h-[64px]" />

        <p className="mt-[22px] mb-[24px] text-[16px] leading-[1.6] text-muted lg:mt-0 lg:mb-[26px] lg:text-[17px] lg:max-w-[44ch]">
          Cooper reads the dec pages, loss runs, applications, and schedules, completes your ACORDs
          and market supplementals, and assembles the submission package. You review the work and
          send it to market.
        </p>

        {/* The brand book asks for key numbers at the typographic scale of a
            cover story, not a KPI widget, so the price is set in the serif and
            the old price steps back to a footnote beside it.

            The two columns hang from one shared baseline, the number's, which
            is why this is `items-baseline-last` and not `items-end`. `items-end`
            aligns boxes, and the number's box bottom is not its baseline: the
            .92 leading pulls the line box in tighter than the em, so the gap
            between baseline and box bottom is a function of the font size. With
            the size on a viewport clamp, that gap moves as the window moves,
            and no fixed padding on the footnote can answer it. Aligning the
            last baseline instead makes the label land on the number's baseline
            exactly, at every width. */}
        {/* The offer and its button are one block, sized by `w-fit` to whatever
            the price needs. That is what gives the button a right edge worth
            having: it stops exactly under the end of "Introductory pricing"
            instead of at whatever width the words "Get started" happen to be.
            The width has to be inherited rather than typed, because the price
            is on a viewport clamp and the footnote is translatable, so any
            number written here would be wrong at the next breakpoint or in the
            next language. On a narrow phone `fit-content` caps at the column,
            the price wraps, and the button goes full width, which is where a
            phone wants it anyway. */}
        <div className="self-start w-fit mb-[16px]">
          <div className="flex flex-wrap items-baseline-last gap-x-[22px] gap-y-[8px] mb-[20px] lg:gap-x-[28px] lg:mb-[22px]">
            <p className="flex items-baseline font-serif font-normal text-[46px] leading-[.92] tracking-[-.02em] text-dark-2 lg:text-[clamp(42px,3.6vw,56px)]">
              <span className="text-[.52em] mr-[.06em]">$</span>99
              <span className="font-sans text-[15px] font-normal tracking-normal text-muted ml-[9px]">
                /month
              </span>
            </p>
            {/* Tight enough that the old price and the label read as one footnote
                rather than as two loose lines beside the number. */}
            <p className="flex flex-col gap-[3px]">
              <span className="text-[14px] text-muted/70 line-through">$499/month</span>
              <span className="font-grotesk text-[10px] uppercase tracking-[.15em] text-accent-orange">
                Introductory pricing
              </span>
            </p>
          </div>

          <a
            href={SIGNUP_URL}
            className="flex w-full items-center justify-center gap-[10px] rounded-[4px] bg-accent-orange px-[22px] py-[14px] text-[15px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep"
          >
            Get started <ArrowRight size={16} weight="bold" />
          </a>
        </div>

        <p className="text-[13px] leading-[1.5] text-muted/85">
          Up to 5 users · Limited monthly usage · 7-day money-back guarantee
        </p>
      </div>

      <div className="relative h-[96vw] overflow-hidden bg-cream lg:h-auto">
        <picture>
          {/* The open framing is composed for a wide column; in a phone-width
              band the laptop shrinks to nothing, so narrow screens get a
              tighter crop of the same scene. */}
          <source media="(max-width: 1023px)" srcSet="/images/lite/hero-narrow.webp" />
          <img
            src="/images/lite/hero.webp"
            alt="Cooper open on a desk, completing ACORD forms from a set of account documents"
            className="absolute inset-0 h-full w-full object-cover object-[52%_50%] lg:object-[50%_52%]"
          />
        </picture>
      </div>
    </section>
  )
}

/* ── Trust bar ───────────────────────────────────────────────── */

/* Icons are deliberately muted rather than ochre. The brief asks for trust
   signals used *quietly*, and four orange marks straight under the hero's one
   orange button would spend the accent on the row that should reassure. */
const TRUST = [
  {
    Icon: Files,
    title: 'Hundreds of forms',
    body: 'Commercial ACORDs and market supplementals.',
  },
  {
    Icon: EnvelopeSimple,
    title: 'No AMS needed',
    body: 'Start with the email and files you already have.',
  },
  {
    Icon: CalendarBlank,
    title: 'Month-to-month',
    body: 'No setup fee. No annual contract. No sales call.',
  },
  {
    Icon: ShieldCheck,
    title: '7-day money-back guarantee',
    body: "Start with your next submission. If it's not right, we'll refund you.",
  },
]

function TrustBar() {
  return (
    <div className="grid grid-cols-1 border-y border-lite-line bg-cream-light sm:grid-cols-2 lg:grid-cols-4">
      {TRUST.map(({ Icon, title, body }) => (
        <div
          key={title}
          className="border-b border-lite-line px-[24px] py-[26px] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:px-[30px] lg:py-[30px] lg:last:border-r-0"
        >
          <Icon size={20} weight="light" className="mb-[14px] text-muted/70" aria-hidden />
          <strong className="mb-[6px] block text-[14px] font-semibold text-dark-2">{title}</strong>
          <span className="text-[13.5px] leading-[1.5] text-muted">{body}</span>
        </div>
      ))}
    </div>
  )
}

/* ── One commercial submission ───────────────────────────────── */

/* The two lists used to run five items each but described different things, so
   nothing lined up: the Cooper column opened with "Forward the email", a step
   the manual column has no counterpart for, and it folded the loss history and
   the supporting files into one line. Paired by task, each row is now one
   trade, which is the only way the contrast does any work. */
const TRADES: [string, string][] = [
  [
    'Read the account documents and pull out the details by hand.',
    'Forward the email. Cooper extracts the account data and traces each field back to its source.',
  ],
  [
    'Re-enter the same account data across ACORDs and market supplementals.',
    'Cooper completes the ACORDs and market supplementals from the account documents.',
  ],
  ['Review and summarize years of loss runs.', 'Cooper summarizes the loss history.'],
  [
    'Gather schedules, applications and supporting documents.',
    'Cooper organizes the supporting files.',
  ],
  [
    'Assemble and check the submission package before it goes to market.',
    'Cooper assembles the submission package for your review.',
  ],
]

/** One headline number plus its caption, at the typographic scale of a cover story. */
function Stat({ value, caption, accent }: { value: string; caption: string; accent?: boolean }) {
  return (
    <div>
      <p
        className={`font-serif font-normal text-[clamp(34px,4vw,46px)] leading-[1] tracking-[-.02em] ${
          accent ? 'text-accent-orange' : 'text-muted'
        }`}
      >
        {value}
      </p>
      <p className="mt-[8px] text-[13.5px] leading-[1.45] text-muted">{caption}</p>
    </div>
  )
}

function Comparison() {
  return (
    <section className="bg-lite-canvas px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[100px]">
      <SectionHead
        eyebrow="One commercial submission"
        title="Turn hours of submission prep into a review step."
        lead="Cooper handles the document reading, data extraction, form completion, loss summary, and package assembly. Your team reviews the work and gets the account to market."
      />

      {/* Two real columns so each can carry its own surface, border and label,
          sharing one row track via subgrid so paired lines always sit level.
          Where subgrid is missing the columns simply size themselves. */}
      <div className="grid grid-cols-1 gap-[44px] pt-[16px] lg:grid-cols-2 lg:gap-[20px] lg:grid-rows-[auto_repeat(5,auto)]">
        {(
          [
            {
              label: 'Without Cooper',
              stats: [
                ['3–4 hrs', 'of manual prep, per submission'],
                ['5 steps', 'your team works through by hand'],
              ],
              surface: 'bg-lite-surface border-lite-line',
              accent: false,
              index: 0,
            },
            {
              label: 'With Cooper Lite',
              stats: [
                ['<20 min', 'to review the work and send it to market'],
                ['1 step', 'your team checks the finished package'],
              ],
              surface: 'bg-cream-light border-accent-orange/35',
              accent: true,
              index: 1,
            },
          ] as const
        ).map((col) => (
          <div
            key={col.label}
            className={`relative border ${col.surface} px-[24px] pb-[28px] pt-[42px] lg:row-span-6 lg:grid lg:grid-rows-subgrid lg:px-[34px] lg:pb-[34px]`}
          >
            {/* The label straddles the top border, so the card reads as one object
                rather than a heading stacked on a box. */}
            <span
              className={`absolute left-[24px] top-0 flex -translate-y-1/2 items-center gap-[7px] rounded-full border px-[14px] py-[5px] text-[13px] font-medium text-dark-2 lg:left-1/2 lg:-translate-x-1/2 ${col.surface}`}
            >
              {col.accent ? (
                <>
                  With
                  <CooperLiteLockup
                    logo="h-[13px]"
                    badge="text-[8px] px-[5px] py-[1px]"
                    gap="gap-[7px]"
                  />
                </>
              ) : (
                col.label
              )}
            </span>

            <div className="flex flex-col gap-[26px] pb-[26px] sm:flex-row sm:gap-[40px] lg:pb-[30px]">
              {col.stats.map(([value, caption]) => (
                <Stat key={value} value={value} caption={caption} accent={col.accent} />
              ))}
            </div>

            {TRADES.map((row) => (
              <div
                key={row[col.index]}
                className="flex gap-[12px] border-t border-lite-line/70 py-[14px] text-[14.5px] leading-[1.55] last:pb-0"
              >
                {col.accent ? (
                  <Check size={14} weight="bold" className="mt-[5px] shrink-0 text-accent-orange" />
                ) : (
                  <Minus size={14} className="mt-[5px] shrink-0 text-muted/60" />
                )}
                <span className={col.accent ? 'text-dark-2' : 'text-muted'}>{row[col.index]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── How it works ────────────────────────────────────────────── */

/**
 * `cost` is what the step asks of the reader, in the slot a project timeline
 * would use for a duration. Cooper only publishes a figure for the whole
 * submission, not per step, so inventing "2 minutes" here would be a number we
 * cannot stand behind. Swap these for real per-step timings the day we have
 * them; nothing else needs to change.
 */
const STEPS = [
  {
    n: '01',
    tag: 'Send',
    cost: 'A forwarded email',
    title: 'Send the account',
    body: 'Forward the client email or upload the dec pages, loss runs, applications, schedules, and other account documents.',
  },
  {
    n: '02',
    tag: 'Prepare',
    cost: 'No work from your team',
    title: 'Cooper prepares the submission',
    body: 'Cooper structures the account, completes supported ACORDs and market supplementals, summarizes the loss history, and assembles the submission package.',
  },
  {
    n: '03',
    tag: 'Review',
    cost: 'Under 20 minutes, end to end',
    title: 'Review and send to market',
    body: 'Check the completed work, make any edits, and send it to market. When quotes come in, bring them to Cooper for comparison and proposal drafting.',
  },
]

/** Rail timing, in ms. One segment fills, then the next, then the whole thing
 *  rests full before dropping back and running again. */
const SEGMENT = 800
const HOLD = 1500
const RESET = 90

/** True while the returned ref is on screen; false again once it leaves. */
function useOnScreen<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.3,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, visible] as const
}

/**
 * Walks the rail 0 → 3, rests, then drops back to 0 and repeats.
 *
 * `snap` is true only for the frame that resets, so the rail empties instantly
 * instead of un-drawing itself backwards. The loop is paused while the section
 * is off screen, and skipped entirely for readers who asked for less motion,
 * who get the finished rail.
 */
function usePrefersReducedMotion() {
  // useSyncExternalStore rather than reading matchMedia during render: the
  // server has no window, and a client that does prefer reduced motion would
  // otherwise render a different first frame than the prerendered HTML.
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}

function useRailLoop(active: boolean) {
  const [running, setStep] = useState(0)
  const [snap, setSnap] = useState(false)
  const still = usePrefersReducedMotion()
  // Derived, not stored: setting state from an effect just to hold a constant
  // costs an extra render and trips react-hooks/set-state-in-effect.
  const step = still ? 3 : running

  useEffect(() => {
    if (still) return
    if (!active) return

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    const later = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (!cancelled) fn()
      }, ms)
    }

    const advance = (i: number) => {
      if (i <= 3) {
        setSnap(false)
        setStep(i)
        later(() => advance(i + 1), SEGMENT)
        return
      }
      later(() => {
        setSnap(true)
        setStep(0)
        later(() => advance(1), RESET)
      }, HOLD)
    }

    advance(1)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [active, still])

  return { step, snap }
}

function HowItWorks() {
  const [ref, onScreen] = useOnScreen<HTMLDivElement>()
  const { step, snap } = useRailLoop(onScreen)

  return (
    <section
      id="how"
      className={`${ANCHOR_OFFSET} bg-lite-canvas px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[100px]`}
    >
      <SectionHead
        eyebrow="How it works"
        title="Start with what you already have."
        lead="No AMS needed. No implementation project. No template setup. Give Cooper the same email and files you use today."
      />

      <div
        ref={ref}
        className="border border-lite-line bg-cream-light px-[24px] py-[30px] md:px-[36px] md:py-[38px]"
      >
        <div className="mb-[30px] flex flex-col gap-[18px] sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[19px] font-semibold leading-[1.3] text-dark-2">
            Three steps, starting from your inbox
          </h3>
          <a
            href={SIGNUP_URL}
            className="inline-flex shrink-0 items-center gap-[8px] self-start rounded-[4px] bg-accent-orange px-[18px] py-[11px] text-[14px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep sm:self-auto"
          >
            Get started <ArrowRight size={14} weight="bold" />
          </a>
        </div>

        {/* One grid for the rail and one for the copy, sharing the same three
            tracks, so every dot lands exactly on its column's left edge. */}
        <div className="hidden grid-cols-3 lg:grid" aria-hidden>
          {STEPS.map((s, i) => {
            const filled = step > i
            return (
              <div key={s.n} className="relative h-px bg-lite-line">
                <span
                  className="absolute inset-0 origin-left bg-dark-2 ease-linear"
                  style={{
                    transform: filled ? 'scaleX(1)' : 'scaleX(0)',
                    transitionProperty: 'transform',
                    transitionDuration: snap ? '0ms' : `${SEGMENT}ms`,
                  }}
                />
                {/* The dot lights the instant the fill reaches it, which is the
                    moment its own segment starts drawing. */}
                <span
                  className="absolute -top-[3px] left-0 h-[7px] w-[7px] rounded-full"
                  style={{
                    backgroundColor: filled ? 'var(--color-dark-2)' : 'var(--color-lite-line)',
                    transitionProperty: 'background-color',
                    transitionDuration: snap ? '0ms' : '200ms',
                  }}
                />
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-3 lg:gap-0 lg:pt-[24px]">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t border-lite-line pt-[20px] lg:border-t-0 lg:pt-0 lg:pr-[32px]">
              <span className="mb-[16px] inline-flex items-stretch overflow-hidden rounded-[4px] border border-lite-line text-[13px] font-medium text-dark-2">
                <span className="border-r border-lite-line px-[9px] py-[4px] tabular-nums">
                  {s.n}
                </span>
                <span className="px-[10px] py-[4px]">{s.tag}</span>
              </span>
              <h4 className="mb-[8px] text-[16px] font-semibold leading-[1.3] text-dark-2">
                {s.title}
              </h4>
              <p className="text-[14.5px] leading-[1.6] text-muted">{s.body}</p>
              <p className="mt-[18px] text-[13.5px] text-muted/75">{s.cost}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── What Cooper does ────────────────────────────────────────── */

/**
 * `Panel` is an abstract screen drawn in code, not a capture of the running
 * product, and `plate` is the reeded-glass texture behind it. Each capability
 * gets its own plate so the panel visibly changes even where two screens have
 * the same shape, while all six stay the same brand texture. See
 * LiteCapabilityPanels.tsx for why these are drawn rather than photographed.
 */
const CAPABILITIES = [
  {
    n: '01',
    stage: 'Submission',
    title: 'Complete ACORDs and market supplementals',
    body: 'Cooper uses information already in the account to complete hundreds of commercial ACORD forms and market supplemental applications.',
    Panel: AcordsPanel,
    plate: '/images/lite/plate-a.webp',
    alt: 'A completed commercial application, its fields filled from the account',
  },
  {
    n: '02',
    stage: 'Submission',
    title: 'Summarize loss runs',
    body: 'Turn years of loss runs into a structured loss history you can review and use in the submission.',
    Panel: LossRunsPanel,
    plate: '/images/lite/plate-b.webp',
    alt: 'A five-year loss history summarized into claim counts and incurred amounts',
  },
  {
    n: '03',
    stage: 'Submission',
    title: 'Build submission packages',
    body: 'Organize completed forms, the account summary, and supporting documents into a clean submission package ready to send to market.',
    Panel: PackagePanel,
    plate: '/images/lite/plate-c.webp',
    alt: 'An assembled submission package: forms, statement of values, loss summary and narrative',
  },
  {
    n: '04',
    stage: 'Quotes',
    title: 'Compare quotes',
    body: 'Normalize carrier quotes side by side so limits, deductibles, and coverage differences are easier to review.',
    Panel: QuotesPanel,
    plate: '/images/lite/plate-d.webp',
    alt: 'Three market quotes normalized side by side on limit, deductible and premium',
  },
  {
    n: '05',
    stage: 'Proposals',
    title: 'Draft client proposals',
    body: 'Turn selected quote options into an agency-branded proposal without re-entering the details.',
    Panel: ProposalsPanel,
    plate: '/images/lite/plate-e.webp',
    alt: 'A client proposal draft listing each coverage line and the annual premium',
  },
  {
    n: '06',
    stage: 'Service',
    title: 'Prepare service and renewal work',
    body: 'Use information already on the account to prepare certificates, endorsements, and renewal work.',
    Panel: ServicePanel,
    plate: '/images/lite/plate-f.webp',
    alt: 'A prepared certificate of insurance showing the insured, the holder and the limits',
  },
]

function WhatCooperDoes() {
  const [active, setActive] = useState(0)
  const current = CAPABILITIES[active]

  return (
    <section
      id="work"
      className={`${ANCHOR_OFFSET} bg-cream-light px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[100px]`}
    >
      <SectionHead
        eyebrow="What Cooper does"
        title="Keep the account moving after submission."
        lead="The same account information carries into quote comparison, proposals, service, and renewal work without re-entering it each time."
      />

      <div className="grid grid-cols-1 gap-[26px] lg:grid-cols-[minmax(300px,31%)_1fr] lg:gap-[40px]">
        <div className="flex flex-col">
          {CAPABILITIES.map((cap, i) => {
            const on = i === active
            return (
              <button
                key={cap.n}
                type="button"
                onClick={() => setActive(i)}
                aria-current={on}
                className={`border-b border-lite-line text-left transition-colors duration-200 last:border-b-0 ${
                  on ? 'border-b-transparent bg-lite-surface px-[20px] py-[18px]' : 'px-[20px] py-[16px] hover:bg-lite-surface/50'
                }`}
              >
                <span className="mb-[6px] flex items-center gap-[9px]">
                  <span className="font-grotesk text-[11px] tabular-nums text-accent-orange">
                    {cap.n}
                  </span>
                  <span className="font-grotesk text-[10px] uppercase tracking-[.14em] text-muted">
                    {cap.stage}
                  </span>
                </span>
                <span className="block font-serif text-[19px] leading-[1.25] text-dark-2">
                  {cap.title}
                </span>
                {/* Only the open row carries its description, so the column stays a
                    list of titles rather than six paragraphs competing at once. */}
                {on && (
                  /* The six descriptions run 2 to 4 lines depending on which one
                     is open and how wide the window is, and this column is what
                     sets the height of the whole row, so picking a different
                     capability used to move everything below the section by
                     about 21px. The screenshots hid it by being tall enough to
                     win the row; the drawn panel is not, so the slot gets
                     reserved instead. 6.2em is four lines at this leading, and
                     three is enough once the column is wide. */
                  <span className="mt-[8px] block text-[14px] leading-[1.55] text-muted lg:min-h-[6.2em] 2xl:min-h-[4.65em]">
                    {cap.body}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* The plate is the brand book's reeded-glass texture, generated for this
            use. Keeping it as a CSS background rather than baking it into the
            panel means one file serves all six. */}
        <div
          className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-dark-2 bg-cover bg-center p-[18px] transition-[background-image] duration-300 sm:p-[42px] lg:min-h-[520px] lg:p-[56px]"
          style={{ backgroundImage: `url(${current.plate})` }}
        >
          {/* 16:10 from `sm` up, the ratio the screenshots held. The six panels
              do not carry the same number of rows, so without a ratio to sit in
              the plate would resize under the reader every time they picked a
              different capability.

              Below `sm` the ratio comes off, because a phone-width card at
              16:10 is 191px tall and the content needs 293, so the last rows
              were being clipped. Letting height follow content there costs
              nothing: measured at 320 to 430 the six panels want within 2px of
              each other, so there is no jump left to prevent.

              `role`/`aria-label` because this is a picture of a screen, not a
              table anyone should be made to navigate: a screen reader gets the
              one sentence that describes it and moves on. */}
          <div
            key={current.title}
            role="img"
            aria-label={current.alt}
            className="animate-fade-in w-full max-w-[640px] shadow-[0_28px_70px_-14px_rgba(29,26,23,.5)] sm:aspect-[16/10]"
          >
            <current.Panel />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Testimonial ─────────────────────────────────────────────── */

/**
 * This used to be a single quote with no attribution, sitting next to a
 * decorative disc. It read as something written in-house, because that is what
 * an unattributed quote reads as, and it was the one thing on the page marked
 * as needing a human before launch.
 *
 * It now runs the same slider and the same five customer quotes the persona
 * pages show. Each one carries the role and the shape of agency that said it,
 * which is the attribution the section was missing, and reusing the component
 * means Lite inherits the auto-advance, the progress bar and the
 * reduced-motion opt-out rather than reimplementing any of them.
 *
 * Two editorial calls are left open in the section below: whether the Claims
 * TPA quote belongs on a page sold to retail agencies, and which quote should
 * lead.
 */
function Testimonial() {
  return (
    <PersonaTestimonial
      testimonials={allTestimonials}
      /* `bg-cream` keeps this page's rhythm: what Cooper does above and the
         pricing below both sit on cream-light, so the quote is the one warm
         band between two paler ones. The persona pages keep their own
         default. */
      sectionClassName="bg-cream py-[76px] lg:py-[96px]"
      containerClassName="mx-auto max-w-[1440px] px-[24px] md:px-[40px] lg:px-[62px]"
    />
  )
}

/* ── Pricing ─────────────────────────────────────────────────── */

/* What the plan does. These are capabilities the page has already shown in
   full, three sections earlier, so here they only need to confirm. */
const PLAN = [
  'Up to 5 users',
  'Limited monthly usage',
  'Hundreds of ACORDs and market supplementals',
  'Loss run summaries',
  'Submission package assembly',
  'Quote comparison',
  'Agency-branded proposals',
  'Service and renewal preparation',
]

/* What protects the buyer. Pulled out of the list above, where they sat as
   items nine to twelve of twelve and read as features rather than as reasons
   it is safe to click. */
const ASSURANCES = [
  'No setup fee',
  'Month-to-month',
  '7-day money-back guarantee',
  'Client data never used to train models',
]

function Pricing() {
  return (
    <section
      id="pricing"
      className={`${ANCHOR_OFFSET} bg-cream-light px-[24px] py-[84px] md:px-[40px] lg:px-[62px] lg:py-[110px]`}
    >
      {/* No card. The bordered box made the price one more thing inside a
          container; without it the price is the section, which is what a page
          with a single plan should say. */}
      <div className="mx-auto max-w-[860px] text-center">
        <p className="font-grotesk text-[11px] uppercase tracking-[.16em] text-accent-orange">
          Cooper Lite
        </p>

        <p className="mt-[26px] flex items-baseline justify-center font-serif font-normal leading-[.86] tracking-[-.055em] text-dark-2">
          <span className="text-[clamp(34px,4vw,54px)]">$</span>
          {/* Mincho sets numerals wide; without the extra negative tracking the
              two nines read as separate objects at this size. */}
          <span className="text-[clamp(72px,9vw,124px)] tracking-[-.085em]">99</span>
          <span className="ml-[14px] font-sans text-[17px] font-normal tracking-normal text-muted">
            /month
          </span>
        </p>

        <p className="mt-[20px] flex flex-wrap items-center justify-center gap-x-[12px] gap-y-[4px]">
          <span className="text-[14px] text-muted/70 line-through">$499/month</span>
          <span className="font-grotesk text-[10px] uppercase tracking-[.15em] text-accent-orange">
            Introductory pricing
          </span>
        </p>

        <p className="mx-auto mt-[24px] max-w-[54ch] text-[16px] leading-[1.6] text-muted">
          Self-serve for commercial insurance agencies with up to 5 users.
        </p>

        {/* Hairline rules and round markers instead of a filled panel and twelve
            ochre ticks. The ticks were the busiest thing on the page and the
            accent is worth more spent on the one button below. */}
        <ul className="mx-auto mt-[52px] grid max-w-[720px] grid-cols-1 gap-x-[48px] gap-y-[14px] border-y border-lite-line py-[30px] text-left sm:grid-cols-2">
          {PLAN.map((f) => (
            <li key={f} className="flex gap-[12px] text-[14.5px] leading-[1.5] text-dark-2">
              <span
                aria-hidden
                className="mt-[8px] h-[4px] w-[4px] shrink-0 rounded-full bg-muted/45"
              />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-[38px] flex flex-col items-center justify-center gap-[18px] sm:flex-row sm:gap-[28px]">
          <a
            href={SIGNUP_URL}
            className="inline-flex items-center gap-[10px] rounded-full bg-accent-orange px-[34px] py-[15px] text-[15px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep"
          >
            Get started <ArrowRight size={16} weight="bold" />
          </a>
          <a
            href="#faq"
            className="text-[14.5px] text-muted underline decoration-lite-line underline-offset-[5px] transition-colors duration-200 hover:text-dark-2"
          >
            Read the FAQs
          </a>
        </div>

        <ul className="mt-[26px] flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[6px] text-[13px] text-muted">
          {ASSURANCES.map((a, i) => (
            <li key={a} className="flex items-center gap-[10px]">
              {i > 0 && <span aria-hidden className="text-muted/40">·</span>}
              {a}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────── */

/**
 * Order matters more than layout here. The live page opened with the discount
 * question, so the first thing a reader met at the point of deciding was a
 * justification of the promotion. The two questions that actually decide a
 * self-serve purchase are whether it works without an AMS and what happens to
 * client data, so those lead now and pricing follows.
 *
 * "Which security and compliance features are not in Lite?" is gone: it says
 * in the negative what the fit test now says in the positive, and repeating it
 * here put a list of what Lite lacks directly in the path to checkout.
 */
const FAQ_GROUPS: { label: string; items: [string, string][] }[] = [
  {
    label: 'How it works',
    items: [
      [
        'Do I need an AMS to use Cooper Lite?',
        'No. Cooper Lite works from your inbox and files. You don’t need an AMS to get started.',
      ],
      [
        'Does Lite submit into carrier portals for me?',
        'No. Lite prepares the completed submission package for you to review and send. Automated carrier portal entry, raters, and AMS integrations are available with Cooper.',
      ],
    ],
  },
  {
    label: 'Your data',
    items: [
      [
        'Is my client data used to train models?',
        'No. Your submissions, client information, and carrier data are not used to train models.',
      ],
    ],
  },
  {
    label: 'Pricing and billing',
    items: [
      [
        'Why is Cooper Lite $99 if the regular price is $499?',
        'Cooper Lite is normally $499/month. While the self-serve product is new, we’re offering small agencies an introductory price of $99/month. If the price changes in the future, we’ll let you know before it affects your account.',
      ],
      [
        'Are there usage limits?',
        'Yes. Cooper Lite is designed for the workload of a small agency and includes monthly usage limits. Specific limits will be published before they apply to your account.',
      ],
      [
        'What if Cooper Lite isn’t right for us?',
        'If Cooper Lite isn’t right for your agency, tell us within 7 days of your first payment and we’ll refund it in full.',
      ],
    ],
  },
  {
    label: 'Lite or Cooper',
    items: [
      [
        'When should we use Cooper instead of Lite?',
        'Cooper is built for organizations that need it deployed across teams and systems, with AMS integrations, carrier portals and raters, higher-volume workflows, guided implementation, dedicated support, and additional security and governance.',
      ],
    ],
  },
]

/**
 * The question and the answer used to be 15px and 14.5px, both at weight 400.
 * Half a pixel of size and no difference in weight is not a hierarchy, so the
 * two read as one undifferentiated block and a reader could not scan the
 * questions, which is the only thing a FAQ is for.
 *
 * The question now carries all three levers at once: 17px against the answer's
 * 15px, semibold against regular, and ink against grey. 17 and 15 are sizes the
 * page already uses, so this collapses the 14.5px one-off rather than adding a
 * value.
 *
 * The open question is no longer set in ochre. Measured, #d95611 on this
 * section's canvas is 3.56:1, and WCAG AA wants 4.5:1 for text this size. It
 * was the least readable line in the section and it was the one being read. The
 * open state is carried by the icon flipping from + to − and by the answer
 * appearing, which is shape and content rather than colour, so nothing is lost
 * for a reader who cannot separate the two hues either.
 */
function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-lite-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-[20px] py-[18px] text-left"
      >
        <span className="text-[17px] font-semibold leading-[1.4] text-dark-2">{q}</span>
        {open ? (
          <Minus size={16} className="shrink-0 text-accent-orange" />
        ) : (
          <Plus size={16} className="shrink-0 text-muted" />
        )}
      </button>
      {/* Uncapped, this column ran to 86 characters a line; comfortable reading
          tops out around 75. 62ch is not a new number, it is the measure the
          section leads on this page already use, and it lands the longest
          answer at exactly 75. */}
      {open && (
        <p className="max-w-[62ch] pb-[20px] pr-[34px] text-[15px] leading-[1.6] text-muted">{a}</p>
      )}
    </div>
  )
}

function Faq() {
  let n = 0
  return (
    <section
      id="faq"
      className={`${ANCHOR_OFFSET} bg-lite-canvas px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[96px]`}
    >
      {/* The gap steps rather than sitting on one number. The left column is
          capped at 340px and its text fills that cap, so whatever the gap is
          is the entire distance between two dense blocks of text; at 72px they
          read as one. 120px is the comfortable distance, but it cannot be the
          only value: at 1024 it squeezes the question column to 440px and
          "Why is Cooper Lite $99 if the regular price is $499?" wraps to two
          lines. 96px is the widest that holds every question on one line at
          that width, so it takes lg and 120 waits for xl. */}
      <div className="grid grid-cols-1 gap-[36px] lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-x-[96px] xl:gap-x-[120px]">
        <div>
          <p className="font-grotesk mb-[14px] text-[11px] uppercase tracking-[.16em] text-accent-orange">
            Before you start
          </p>
          <h2 className="font-serif text-[clamp(30px,3.8vw,42px)] font-normal leading-[1.12] tracking-[-.015em] text-dark-2">
            A few things to know.
          </h2>
          <p className="mt-[18px] text-[15px] leading-[1.6] text-muted">
            Cooper Lite is built for small agencies that want to start on their own, without an
            implementation project.
          </p>

          <div className="mt-[30px] border-t border-lite-line pt-[22px]">
            <strong className="mb-[6px] block text-[14px] font-semibold text-dark-2">
              Need Cooper across your organization?
            </strong>
            {/* Block, not inline: as a span the link below joined the end of this
                sentence instead of starting its own line. */}
            <p className="text-[13.5px] leading-[1.5] text-muted">
              See how Lite and Cooper differ across integrations, volume, implementation, support,
              security, and governance.
            </p>
            <Link
              to={COMPARE_PATH}
              className="mt-[12px] inline-flex items-center gap-[8px] text-[13.5px] font-medium text-accent-orange"
            >
              Compare Lite and Cooper <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>

        {/* One unbroken list. The group labels are gone, and the gaps that
            separated the groups went with them: a 26px break with nothing
            naming it is just an unexplained hole in a list of seven. The
            grouping stays in the data because it is what puts the questions in
            funnel order, how it works, then data, then price, then when to buy
            Cooper instead, which is the order to read them in whether or not
            anything is labelled. */}
        <div className="border-t border-lite-line">
          {FAQ_GROUPS.flatMap((group) => group.items).map(([q, a]) => (
            // The first question opens by default, so the pattern is legible
            // without the reader having to try it.
            <FaqItem key={q} q={q} a={a} defaultOpen={n++ === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Closing ─────────────────────────────────────────────────── */

function Closing() {
  return (
    <section className="bg-dark-2 px-[24px] pt-[84px] text-cream-light md:px-[40px] lg:px-[62px] lg:pt-[104px]">
      <p className="font-grotesk mb-[16px] text-[11px] uppercase tracking-[.16em] text-accent-orange">
        Get started
      </p>
      {/* Two columns: the headline and the button that answers it on the left,
          the explanation on the right. The right column's second row is empty
          now that Compare and Log in have gone, and that is what keeps the
          button off the full width of a dark field, where it read as a banner.

          Placement is explicit rather than implied by source order, because the
          two do not agree. Reading order has to be headline, then what happens,
          then the button; column order has to put the button under the headline.
          Writing `col-start` and `row-start` lets the DOM stay in the order a
          phone and a screen reader want, and the grid do something else from
          `lg` up. */}
      <div className="grid grid-cols-1 gap-y-[28px] lg:grid-cols-[1fr_minmax(0,42%)] lg:items-end lg:gap-x-[64px] lg:gap-y-[38px]">
        <h2 className="max-w-[16ch] font-serif text-[clamp(30px,4.6vw,46px)] font-normal leading-[1.12] tracking-[-.015em] lg:col-start-1 lg:row-start-1">
          Start with the next submission in your inbox.
        </h2>

        <p className="max-w-[52ch] text-[15.5px] leading-[1.6] text-cream-light/70 lg:col-start-2 lg:row-start-1 lg:pb-[6px]">
          Forward the email or upload the files. Cooper prepares the ACORDs, market supplementals,
          loss summary, and submission package. You review and send it to market.
        </p>

        <div className="lg:col-start-1 lg:row-start-2">
          <a
            href={SIGNUP_URL}
            className="flex items-center justify-center gap-[12px] rounded-full bg-accent-orange px-[32px] py-[22px] text-[17px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep"
          >
            Get started <ArrowRight size={18} weight="bold" />
          </a>
          {/* The terms belong to this button, so they sit under it rather than
              centred under the whole block, which is where the hero puts them
              too. */}
          <p className="mt-[14px] text-[13px] leading-[1.5] text-cream-light/55">
            $99/month introductory pricing · Up to 5 users · Limited monthly usage · 7-day
            money-back guarantee
          </p>
        </div>
      </div>

      {/* The footer is its own dark band under this one, so the section ends
          on the terms line and the space between them is the footer's. */}
    </section>
  )
}

/* ── Page ────────────────────────────────────────────────────── */

export default function LitePage() {
  useSeo({
    title: 'Cooper Lite — Get more accounts to market. Faster.',
    description:
      'Cooper Lite helps small commercial insurance agencies get more accounts to market faster by completing ACORDs and market supplementals, summarizing loss runs, and assembling submission packages.',
    canonicalPath: '/lite',
    jsonLd: pageJsonLd({
      name: 'Cooper Lite',
      path: '/lite',
      description: 'Self-serve Cooper for commercial insurance agencies with up to 5 users.',
    }),
  })

  return (
    <div className="min-h-screen bg-cream-light">
      <LiteNav onHome />
      <LiteHero />
      <TrustBar />
      <Comparison />
      <HowItWorks />
      <WhatCooperDoes />
      <Testimonial />
      <Pricing />
      <Faq />
      <Closing />
      <LiteFooter onHome />
    </div>
  )
}
