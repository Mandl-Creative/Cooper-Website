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
import PersonaTestimonial from './PersonaTestimonial'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'

/* Signup, the plan comparison and the workspace all live in the product app,
   not in this marketing repo, so these stay absolute. */
const SIGNUP_URL = 'https://www.askcooper.ai/lite/signup'
const COMPARE_URL = 'https://www.askcooper.ai/lite/compare'
const LOGIN_URL = 'https://workspace.askcooper.ai/sign-in'

/* ── Cooper Lite lockup ──────────────────────────────────────── */

/**
 * Wordmark plus the LITE badge, the same lockup the nav carries. Shared so the
 * two never drift; the caller sizes it, since it appears both at nav scale and
 * inline inside a 13px pill.
 */
function CooperLiteLockup({
  logo = 'h-[20px]',
  badge = 'text-[10px] px-[7px] py-[3px]',
  gap = 'gap-[12px]',
  onDark = false,
}: {
  logo?: string
  badge?: string
  gap?: string
  onDark?: boolean
}) {
  return (
    <span className={`flex items-center ${gap}`}>
      <img
        src="/images/cooper-logo-full.svg"
        alt="Cooper"
        width={154}
        height={36}
        // The mark ships black; on the dark closing field it has to be knocked
        // back out to cream.
        className={`${logo} w-auto ${onDark ? 'brightness-0 invert' : 'brightness-0'}`}
      />
      <span
        className={`font-grotesk uppercase tracking-[.14em] text-accent-orange border border-accent-orange/35 rounded-[3px] ${badge}`}
      >
        Lite
      </span>
    </span>
  )
}

/* ── Nav ─────────────────────────────────────────────────────── */

function LiteNav() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-[20px] py-[16px] md:px-[40px] md:py-[22px]">
      <a href="/lite">
        <CooperLiteLockup />
      </a>

      <div className="flex items-center gap-[10px] md:gap-[30px]">
        <a href="#how" className="hidden md:inline text-[14px] text-dark-2/85 hover:text-dark-2">
          How it works
        </a>
        <a href="#work" className="hidden md:inline text-[14px] text-dark-2/85 hover:text-dark-2">
          What Cooper does
        </a>
        <a href="#pricing" className="hidden md:inline text-[14px] text-dark-2/85 hover:text-dark-2">
          Pricing
        </a>
        <a
          href={LOGIN_URL}
          className="whitespace-nowrap text-[14px] text-dark-2 border border-lite-line px-[12px] py-[8px] md:px-[16px]"
        >
          Log in
        </a>
        <a
          href={SIGNUP_URL}
          className="inline-flex items-center gap-[8px] whitespace-nowrap text-[14px] text-cream-light bg-dark-2 px-[13px] py-[9px] md:px-[17px]"
        >
          Get started <ArrowRight size={14} weight="bold" />
        </a>
      </div>
    </nav>
  )
}

/* ── Hero ────────────────────────────────────────────────────── */

function LiteHero() {
  return (
    <section
      className="
        grid grid-cols-1
        lg:grid-cols-[minmax(400px,37%)_1fr] lg:gap-[48px] lg:pl-[40px]
        lg:min-h-[660px] lg:flex-1
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
            the old price steps back to a footnote beside it. */}
        <div className="flex flex-wrap items-end gap-[14px] mb-[20px] lg:gap-[18px] lg:mb-[22px]">
          <p className="flex items-baseline font-serif font-normal text-[46px] leading-[.92] tracking-[-.02em] text-dark-2 lg:text-[clamp(42px,3.6vw,56px)]">
            <span className="text-[.52em] mr-[.06em]">$</span>99
            <span className="font-sans text-[15px] font-normal tracking-normal text-muted ml-[9px]">
              /month
            </span>
          </p>
          <p className="flex flex-col gap-[5px] pb-[5px]">
            <span className="text-[14px] text-muted-2 line-through">$499/month</span>
            <span className="font-grotesk text-[10px] uppercase tracking-[.15em] text-accent-orange">
              Introductory pricing
            </span>
          </p>
        </div>

        <a
          href={SIGNUP_URL}
          className="self-start mb-[16px] inline-flex items-center gap-[10px] bg-accent-orange px-[22px] py-[14px] text-[15px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep"
        >
          Get started <ArrowRight size={16} weight="bold" />
        </a>

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
            /* The LCP element on a page that takes paid traffic. */
            fetchPriority="high"
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
          <Icon size={20} weight="light" className="mb-[14px] text-muted-2" aria-hidden />
          <strong className="mb-[6px] block text-[14px] font-semibold text-dark-2">{title}</strong>
          <span className="text-[13.5px] leading-[1.5] text-muted">{body}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Section furniture ───────────────────────────────────────── */

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="mb-[44px]">
      <p className="font-grotesk mb-[14px] text-[11px] uppercase tracking-[.16em] text-accent-orange">
        {eyebrow}
      </p>
      <h2 className="max-w-[18ch] font-serif text-[clamp(30px,4.4vw,44px)] font-normal leading-[1.12] tracking-[-.015em] text-dark-2">
        {title}
      </h2>
      {lead && (
        <p className="mt-[18px] max-w-[62ch] text-[16px] leading-[1.6] text-muted">{lead}</p>
      )}
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
                  <Minus size={14} className="mt-[5px] shrink-0 text-muted-2" />
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
/* One store per query, built once and cached. The callbacks have to live
   outside render: fresh arrows on every render make useSyncExternalStore tear
   down and re-establish the matchMedia listener each time, and useRailLoop
   re-renders this page every 800ms for as long as the rail is on screen. */
const mediaStores = new Map<
  string,
  { subscribe: (onChange: () => void) => () => void; get: () => boolean }
>()

function mediaStore(query: string) {
  let store = mediaStores.get(query)
  if (!store) {
    store = {
      subscribe: (onChange: () => void) => {
        const mq = window.matchMedia(query)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
      },
      get: () => window.matchMedia(query).matches,
    }
    mediaStores.set(query, store)
  }
  return store
}

/* useSyncExternalStore rather than reading matchMedia during render: the server
   has no window, and a client whose answer differs would otherwise render a
   different first frame than the prerendered HTML. */
function useMediaQuery(query: string, onServer: boolean) {
  const store = mediaStore(query)
  return useSyncExternalStore(store.subscribe, store.get, () => onServer)
}

function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)', false)
}

/* The rail is `hidden ... lg:grid`. Without this its timers still fired on a
   phone, re-rendering the section every 800ms forever to animate something
   display:none had already removed. */
function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)', true)
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
  const desktop = useIsDesktop()
  const { step, snap } = useRailLoop(onScreen && desktop)

  return (
    <section
      id="how"
      className="scroll-mt-[74px] bg-lite-canvas px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[100px]"
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
            className="inline-flex shrink-0 items-center gap-[8px] self-start bg-accent-orange px-[18px] py-[11px] text-[14px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep sm:self-auto"
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
              <p className="mt-[18px] text-[13.5px] text-muted-2">{s.cost}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── What Cooper does ────────────────────────────────────────── */

/**
 * `shot` is a real screen from the Cooper product, not a mock, and `plate` is
 * the reeded-glass texture behind it. Each capability gets its own plate so the
 * panel visibly changes even where two screens look alike, while all six stay
 * the same brand texture.
 */
const CAPABILITIES = [
  {
    n: '01',
    stage: 'Submission',
    title: 'Complete ACORDs and market supplementals',
    body: 'Cooper uses information already in the account to complete hundreds of commercial ACORD forms and market supplemental applications.',
    shot: '/images/lite/cap-acords.webp',
    plate: '/images/lite/plate-a.webp',
    alt: 'Completed ACORD 125, 126 and 140 forms filed against their accounts in Cooper',
  },
  {
    n: '02',
    stage: 'Submission',
    title: 'Summarize loss runs',
    body: 'Turn years of loss runs into a structured loss history you can review and use in the submission.',
    shot: '/images/lite/cap-lossruns.webp',
    plate: '/images/lite/plate-b.webp',
    alt: 'A multi-year loss run open in Cooper beside the account it belongs to',
  },
  {
    n: '03',
    stage: 'Submission',
    title: 'Build submission packages',
    body: 'Organize completed forms, the account summary, and supporting documents into a clean submission package ready to send to market.',
    shot: '/images/lite/cap-package.webp',
    plate: '/images/lite/plate-c.webp',
    alt: 'An assembled submission package in Cooper: completed forms, schedules and supporting documents',
  },
  {
    n: '04',
    stage: 'Quotes',
    title: 'Compare quotes',
    body: 'Normalize carrier quotes side by side so limits, deductibles, and coverage differences are easier to review.',
    shot: '/images/lite/cap-quotes.webp',
    plate: '/images/lite/plate-d.webp',
    alt: 'A carrier quote open in Cooper from a quote comparison session',
  },
  {
    n: '05',
    stage: 'Proposals',
    title: 'Draft client proposals',
    body: 'Turn selected quote options into an agency-branded proposal without re-entering the details.',
    shot: '/images/lite/cap-proposals.webp',
    plate: '/images/lite/plate-e.webp',
    alt: 'A renewal proposal open in Cooper, with its coverage summary and annual premium',
  },
  {
    n: '06',
    stage: 'Service',
    title: 'Prepare service and renewal work',
    body: 'Use information already on the account to prepare certificates, endorsements, and renewal work.',
    shot: '/images/lite/cap-service.webp',
    plate: '/images/lite/plate-f.webp',
    alt: 'A certificate of insurance open in Cooper against the account it was prepared for',
  },
]

function WhatCooperDoes() {
  const [active, setActive] = useState(0)
  const current = CAPABILITIES[active]

  return (
    <section
      id="work"
      className="scroll-mt-[74px] bg-cream-light px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[100px]"
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
                  on
                    ? 'border-b-transparent bg-lite-surface px-[20px] py-[18px]'
                    : 'px-[20px] py-[18px] hover:bg-lite-surface/50'
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
                  <span className="mt-[8px] block text-[14px] leading-[1.55] text-muted">
                    {cap.body}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* The plate is the brand book's reeded-glass texture, generated for this
            use. Keeping it as a CSS background rather than baking it into each
            screenshot means swapping a screen is a file drop.

            Six plates, one per capability, not the single shared file an older
            version of this comment claimed: plate-a through plate-f, about
            390KB together. Each is fetched on the first click of its tab, so
            that click shows a moment of bare bg-dark-2 behind the screenshot.
            Worth deciding whether the six are earning that over one shared
            texture, but that is a content call, not a fix. */}
        <div
          className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-dark-2 bg-cover bg-center p-[18px] sm:p-[42px] lg:min-h-[520px] lg:p-[56px]"
          style={{ backgroundImage: `url(${current.plate})` }}
        >
          <img
            key={current.shot}
            src={current.shot}
            alt={current.alt}
            loading="lazy"
            className="w-full rounded-[6px] shadow-[0_28px_70px_-14px_rgba(29,26,23,.5)] animate-fade-in"
          />
        </div>
      </div>
    </section>
  )
}

/* ── Fit test ────────────────────────────────────────────────── */

/**
 * The section this replaces repeated the trust bar almost verbatim: two of its
 * three columns restated "hundreds of forms" and "no AMS needed". The one fact
 * only it carried was which lines Cooper writes, so that became the first
 * criterion here.
 *
 * Every statement is one the page already stands behind, including the last,
 * which is the honest disqualifier currently buried in the FAQ as a negative.
 * A reader who cannot tick it should be on Cooper, not Lite, and saying so
 * costs nothing and buys a lot.
 */
const FIT = [
  'We write commercial P&C: property, general liability, workers’ comp, commercial auto, cyber or E&S.',
  'Five or fewer people would use it.',
  'Our submissions start from emailed documents: dec pages, loss runs, applications and schedules.',
  'We re-key the same account data across ACORDs and market supplementals.',
  'We have no AMS, or we would rather not connect one to get started.',
  'We want to start on our own, without an implementation project.',
  'We are happy to review Cooper’s work before it goes to market.',
  'We do not need SOC 2 Type II, HIPAA, RBAC or full audit logs today.',
]

const BANDS = [
  {
    range: '0 – 3',
    title: 'Cooper, not Lite',
    body: 'Lite is built for a narrow shape of agency. At this score you would be working against it. Cooper covers the integrations, volume and governance Lite leaves out.',
    cta: { label: 'Compare Lite and Cooper', href: COMPARE_URL },
  },
  {
    range: '4 – 6',
    title: 'Likely a fit',
    body: 'Most of Lite would land. Start with one submission and see, and the 7-day money-back guarantee covers you if it does not.',
    cta: { label: 'Get started', href: SIGNUP_URL },
  },
  {
    range: '7 – 8',
    title: 'Strong fit',
    body: 'This is exactly the agency Lite was built for. Forward the next submission in your inbox and Cooper will prepare it.',
    cta: { label: 'Get started', href: SIGNUP_URL },
  },
]

const bandFor = (score: number) => (score <= 3 ? 0 : score <= 6 ? 1 : 2)

function FitTest() {
  const [ticked, setTicked] = useState<boolean[]>(() => FIT.map(() => false))
  const score = ticked.filter(Boolean).length
  // The panel stays out until the reader commits to a first tick, so the
  // section opens as one calm card rather than a scored quiz.
  const scoring = score > 0
  const band = bandFor(score)

  return (
    <section className="bg-lite-surface px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[96px]">
      <div className="mx-auto mb-[40px] max-w-[640px] text-center">
        <span className="font-grotesk inline-block rounded-full bg-accent-orange/10 px-[14px] py-[6px] text-[10px] uppercase tracking-[.15em] text-accent-orange">
          60-second fit test
        </span>
        <h2 className="mt-[18px] font-serif text-[clamp(28px,3.8vw,42px)] font-normal leading-[1.12] tracking-[-.015em] text-dark-2">
          Is Cooper Lite right for your agency?
        </h2>
        <p className="mt-[14px] text-[15px] leading-[1.6] text-muted">
          Tick what is true. Nothing is sent anywhere, the score is worked out on this page.
        </p>
      </div>

      {/* The tray widens and the panel slides in from zero width, which is what
          moves the checklist off centre without it ever jumping. */}
      <div
        className={`mx-auto rounded-[14px] bg-lite-canvas p-[8px] transition-[max-width] duration-500 ease-out ${
          scoring ? 'max-w-[1060px]' : 'max-w-[680px]'
        }`}
      >
        <div className="flex flex-col lg:flex-row">
          <ul className="flex-1 rounded-[10px] bg-cream-light px-[20px] py-[6px] sm:px-[28px]">
            {FIT.map((line, i) => (
              <li key={line} className="border-b border-lite-line/70 last:border-b-0">
                <label className="flex cursor-pointer items-start gap-[14px] py-[16px]">
                  <input
                    type="checkbox"
                    checked={ticked[i]}
                    onChange={() =>
                      setTicked((prev) => prev.map((v, j) => (j === i ? !v : v)))
                    }
                    className="mt-[2px] h-[18px] w-[18px] shrink-0 cursor-pointer accent-dark-2"
                  />
                  <span
                    className={`text-[14.5px] leading-[1.5] transition-colors duration-200 ${
                      ticked[i] ? 'text-accent-orange' : 'text-dark-2'
                    }`}
                  >
                    {line}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <div
            aria-live="polite"
            /* Collapsed here is visual only: max-height, opacity and width leave
               the contents in the accessibility tree and in the tab order, so
               before the first tick a keyboard user landed on an invisible
               "Get started". `inert` is what actually takes it out. */
            inert={!scoring}
            className={`overflow-hidden transition-[max-height,width,opacity] duration-500 ease-out ${
              scoring
                ? 'max-h-[900px] opacity-100 lg:w-[42%]'
                : 'max-h-0 opacity-0 lg:w-0'
            }`}
          >
            <div className="px-[8px] pb-[10px] pt-[24px] sm:px-[26px] lg:pt-[12px]">
              {BANDS.map((b, i) => {
                const on = i === band
                return (
                  <div
                    key={b.range}
                    className={`border-l-2 py-[16px] pl-[18px] transition-colors duration-300 ${
                      on ? 'border-accent-orange' : 'border-lite-line'
                    }`}
                  >
                    <span
                      className={`font-grotesk inline-block rounded-[4px] border px-[8px] py-[2px] text-[10px] tabular-nums transition-colors duration-300 ${
                        on
                          ? 'border-accent-orange/40 text-accent-orange'
                          : 'border-lite-line text-muted'
                      }`}
                    >
                      {b.range}
                    </span>
                    <h3
                      className={`mt-[8px] font-serif text-[22px] leading-[1.2] transition-colors duration-300 ${
                        on ? 'text-dark-2' : 'text-muted-2'
                      }`}
                    >
                      {b.title}
                    </h3>
                    {on && (
                      <p className="mt-[8px] text-[14px] leading-[1.55] text-muted">{b.body}</p>
                    )}
                  </div>
                )
              })}

              <a
                href={BANDS[band].cta.href}
                className="mt-[18px] flex items-center justify-center gap-[10px] bg-dark-2 px-[22px] py-[14px] text-[15px] font-medium text-cream-light transition-colors duration-200 hover:bg-black"
              >
                {BANDS[band].cta.label} <ArrowRight size={16} weight="bold" />
              </a>
              <p className="mt-[10px] text-center text-[12.5px] text-muted">
                {score} of {FIT.length} ticked
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Testimonial ─────────────────────────────────────────────── */

/**
 * The same editorial quote slider the persona pages use, so Lite reads as part
 * of the site rather than as its own small product. One quote here, which
 * means the component drops its progress bar on its own.
 *
 * The attribution is a role, not a person: everything the page can honestly say
 * about this customer today is "a principal at a three-person retail agency".
 * An invented name would be worse than none.
 */
const LITE_TESTIMONIALS = [
  {
    quote:
      'I\u2019m a three-person shop competing against agencies with twenty. Cooper is the reason I can quote the same account in a morning instead of a week.',
    author: '',
    role: 'Principal, 3-person retail P&C agency',
  },
]

function Testimonial() {
  /* The shared default band is cream-light, which is also Pricing's, directly
     below. Cream keeps the two sections from reading as one. */
  return (
    <PersonaTestimonial
      testimonials={LITE_TESTIMONIALS}
      sectionClassName="bg-cream py-[76px] lg:py-[96px]"
      containerClassName="px-[24px] md:px-[40px] lg:px-[62px]"
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
      className="scroll-mt-[74px] bg-cream-light px-[24px] py-[84px] md:px-[40px] lg:px-[62px] lg:py-[110px]"
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
          <span className="text-[14px] text-muted-2 line-through">$499/month</span>
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
            className="inline-flex items-center gap-[10px] bg-accent-orange px-[34px] py-[15px] text-[15px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep"
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
/* One flat list, in the order a reader actually asks these: can we start, what
   does it do, what happens to our data, what does it cost, what if it is wrong
   for us, and when do we outgrow it. The four category headings that used to
   split this were a tier of structure seven questions do not need. */
const FAQ: [string, string][] = [
  [
    'Do I need an AMS to use Cooper Lite?',
    'No. Cooper Lite works from your inbox and files. You don\u2019t need an AMS to get started.',
  ],
  [
    'Does Lite submit into carrier portals for me?',
    'No. Lite prepares the completed submission package for you to review and send. Automated carrier portal entry, raters, and AMS integrations are available with Cooper.',
  ],
  [
    'Is my client data used to train models?',
    'No. Your submissions, client information, and carrier data are not used to train models.',
  ],
  [
    'Why is Cooper Lite $99 if the regular price is $499?',
    'Cooper Lite is normally $499/month. While the self-serve product is new, we\u2019re offering small agencies an introductory price of $99/month. If the price changes in the future, we\u2019ll let you know before it affects your account.',
  ],
  [
    'Are there usage limits?',
    'Yes. Cooper Lite is designed for the workload of a small agency and includes monthly usage limits. Specific limits will be published before they apply to your account.',
  ],
  [
    'What if Cooper Lite isn\u2019t right for us?',
    'If Cooper Lite isn\u2019t right for your agency, tell us within 7 days of your first payment and we\u2019ll refund it in full.',
  ],
  [
    'When should we use Cooper instead of Lite?',
    'Cooper is built for organizations that need it deployed across teams and systems, with AMS integrations, carrier portals and raters, higher-volume workflows, guided implementation, dedicated support, and additional security and governance.',
  ],
]

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
        {/* Open used to recolour the question to accent-orange, which was wrong
            twice over: 3.56:1 on this canvas, so the one question you had opened
            was the least legible text on the page; and orange is this page's
            action colour, so an already-open question read as a link. Weight and
            the icon carry the state now, and neither is colour alone. */}
        <span
          className={`text-[16px] leading-[1.45] text-dark-2 ${open ? 'font-medium' : ''}`}
        >
          {q}
        </span>
        {open ? (
          <Minus size={14} className="shrink-0 text-dark-2" />
        ) : (
          <Plus size={14} className="shrink-0 text-muted" />
        )}
      </button>
      {open && (
        <p className="max-w-[68ch] pb-[20px] pr-[34px] text-[14.5px] leading-[1.6] text-muted-2">
          {a}
        </p>
      )}
    </div>
  )
}

function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-[74px] bg-lite-canvas px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[96px]"
    >
      <div className="grid grid-cols-1 gap-[36px] lg:grid-cols-[minmax(0,340px)_minmax(0,760px)] lg:justify-between lg:gap-[72px]">
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
            <a
              href={COMPARE_URL}
              className="mt-[12px] inline-flex items-center gap-[8px] text-[13.5px] font-medium text-accent-orange"
            >
              Compare Lite and Cooper <ArrowRight size={14} weight="bold" />
            </a>
          </div>
        </div>

        {/* Capped in the track, not with a max-width on a free 1fr: uncapped, at a
            1840px viewport the list ran 1304px, which put answers near 200
            characters a line and parked every +/- about 1300px from the question
            it belongs to. Capping inside a 1fr left the slack hanging off the
            right edge instead, so the track carries the cap and justify-between
            pins the list to the right margin. */}
        <div className="border-t border-lite-line">
          {FAQ.map(([q, a], i) => (
            // The first question opens by default, so the pattern is legible
            // without the reader having to try it.
            <FaqItem key={q} q={q} a={a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Closing ─────────────────────────────────────────────────── */

/* Everything here already exists in this repo. The live Lite footer links two
   of these six legal documents, which is thin for a page that takes a card. */
const FOOTER = [
  {
    label: 'Cooper Lite',
    links: [
      ['How it works', '#how'],
      ['What Cooper does', '#work'],
      ['Pricing', '#pricing'],
      ['Questions', '#faq'],
      ['Compare Lite and Cooper', COMPARE_URL],
    ] as [string, string][],
  },
  {
    label: 'Legal',
    links: [
      ['Privacy Policy', '/privacy'],
      ['Terms of Service', '/terms'],
      ['Cookie Policy', '/cookie-policy'],
      ['Data Processing Addendum', '/data-processing-addendum'],
      ['Subprocessors', '/subprocessors'],
      ['Master Services Agreement', '/master-services-agreement'],
    ] as [string, string][],
  },
  {
    label: 'Cooper',
    links: [
      ['Cooper for organizations', '/'],
      ['Integrations', '/integrations'],
      ['About', '/about'],
      ['Careers', '/careers'],
      ['Log in', LOGIN_URL],
    ] as [string, string][],
  },
]

function FooterLink({ label, href }: { label: string; href: string }) {
  const className =
    'text-[13.5px] leading-[1.5] text-cream-light/60 transition-colors duration-200 hover:text-cream-light'
  // Internal routes go through the router; the product app and the plan
  // comparison live outside this site and have to leave it.
  return href.startsWith('/') ? (
    <Link to={href} className={className}>
      {label}
    </Link>
  ) : (
    <a href={href} className={className}>
      {label}
    </a>
  )
}

function Closing() {
  return (
    <section className="bg-dark-2 px-[24px] pt-[84px] text-cream-light md:px-[40px] lg:px-[62px] lg:pt-[104px]">
      <p className="font-grotesk mb-[16px] text-[11px] uppercase tracking-[.16em] text-accent-orange">
        Get started
      </p>
      {/* Headline and lede sit side by side rather than stacked, so the top of
          the block reaches the right edge instead of trailing off into it. */}
      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-[1fr_minmax(0,42%)] lg:items-end lg:gap-[64px]">
        <h2 className="max-w-[16ch] font-serif text-[clamp(30px,4.6vw,46px)] font-normal leading-[1.12] tracking-[-.015em]">
          Start with the next submission in your inbox.
        </h2>
        <p className="max-w-[52ch] text-[15.5px] leading-[1.6] text-cream-light/70 lg:pb-[6px]">
          Forward the email or upload the files. Cooper prepares the ACORDs, market supplementals,
          loss summary, and submission package. You review and send it to market.
        </p>
      </div>

      {/* Two clusters with air between them: the primary on the left edge, the
          two secondaries on the right edge, and the middle left empty.

          The right track is `minmax(0,42%)`, the same track the lede above sits
          in, so the pair starts on the lede's left edge instead of 194px inside
          it. A percentage track resolves against the grid's content box rather
          than against what the gaps leave, so 42% here lands on exactly the
          same x as 42% up there even though the two rows gap differently.

          The two flexible tracks left of it split the remainder, which puts the
          primary and the empty middle at roughly a third each. Equal thirds for
          all three do not survive the labels: a third shared by two buttons is
          a sixth, and "Compare Lite and Cooper" needs about 243px at this size.

          The breakpoint is 1400 rather than xl. Measured: the labels sit on one
          line down to 1400, where each button is 262px, and wrap to two at 1360
          where they are 254px. xl would put the row on screen at 1280, where a
          button is 237px and both labels break. Below 1400 the three stack. Row
          heights come from the grid, so the shorter secondaries stretch to the
          primary without matched padding. */}
      <div className="mt-[38px] grid grid-cols-1 gap-[12px] min-[1400px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,42%)]">
        <a
          href={SIGNUP_URL}
          className="flex items-center justify-center gap-[12px] bg-accent-orange px-[32px] py-[22px] text-[17px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep"
        >
          Get started <ArrowRight size={18} weight="bold" />
        </a>

        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2 min-[1400px]:col-start-3">
          {(
            [
              ['Compare Lite and Cooper', COMPARE_URL],
              ['Log in to your workspace', LOGIN_URL],
            ] as [string, string][]
          ).map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="flex items-center justify-center gap-[10px] border border-cream-light/20 px-[24px] py-[18px] text-[15px] text-cream-light/85 transition-colors duration-200 hover:border-cream-light/45 hover:text-cream-light"
            >
              {label} <ArrowRight size={15} weight="bold" />
            </a>
          ))}
        </div>
      </div>

      <p className="mt-[20px] text-center text-[13px] text-cream-light/55">
        $99/month introductory pricing · Up to 5 users · Limited monthly usage · 7-day money-back
        guarantee
      </p>

      <div className="mt-[80px] grid grid-cols-1 gap-[36px] border-t border-cream-light/12 pt-[46px] sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,auto))] lg:gap-[64px]">
        <div>
          <CooperLiteLockup onDark logo="h-[19px]" badge="text-[9px] px-[6px] py-[2px]" />
        </div>
        {FOOTER.map((col) => (
          <div key={col.label}>
            <p className="font-grotesk mb-[14px] text-[10px] uppercase tracking-[.14em] text-cream-light/40">
              {col.label}
            </p>
            <ul className="flex flex-col gap-[9px]">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <FooterLink label={label} href={href} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-[46px] flex flex-col gap-[10px] border-t border-cream-light/12 py-[26px] text-[13px] text-cream-light/45 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Cooper. All rights reserved.</span>
        <button
          type="button"
          onClick={() => window.Cookiebot?.renew()}
          className="text-left transition-colors duration-200 hover:text-cream-light/80 sm:text-right"
        >
          Manage Cookies
        </button>
      </div>
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
      {/* Nav and hero are one column of exactly one screen, so the hero takes
          whatever the nav leaves instead of subtracting a literal from it. The
          literal was 79px, the nav measures 83, and scroll-mt in this file says
          74: three numbers for one height, none of them right. */}
      <div className="lg:flex lg:h-[100svh] lg:flex-col">
        <LiteNav />
        <LiteHero />
      </div>
      <TrustBar />
      <Comparison />
      <HowItWorks />
      <WhatCooperDoes />
      <FitTest />
      <Testimonial />
      <Pricing />
      <Faq />
      <Closing />
    </div>
  )
}
