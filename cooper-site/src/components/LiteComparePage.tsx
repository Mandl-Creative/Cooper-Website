/* ──────────────────────────────────────────────────────────────
   Compare Cooper Lite and Cooper.

   Ported from the page engineering ships at askcooper.ai/lite/compare and
   redesigned against the same brief as /lite, so the two read as one site
   rather than as a landing page and a spec sheet.

   What the brief changed here:

   - The promo strip is gone. `$499 → $99` ran across the top of every Lite
     page; on /lite it now appears twice, and this page is one step further
     down the funnel, so it appears once, in the plan panel where a price
     belongs.
   - The Cooper panel was a Deep Night card sitting beside an ivory one, which
     made the choice look like a recommendation. Both panels are light now and
     the hierarchy is carried by the buttons, which is where a page that is
     honestly routing people should put it.
   - Ochre is spent on the two CTAs and the eyebrows, not on the headline, the
     ticks and the list markers as well.

   The comparison table is the reason this page exists, so it is the only
   thing on the page that gets a full-bleed treatment, and it is built to be
   read on a phone rather than scaled down to one.
─────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { ArrowRight, Check, Minus } from '@phosphor-icons/react'
import {
  COMPARE_PATH,
  CooperLiteLockup,
  DEMO_PATH,
  LiteFooter,
  LiteNav,
  SectionHead,
  SIGNUP_URL,
} from './lite/chrome'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'

/* ── Hero ────────────────────────────────────────────────────── */

function CompareHero() {
  return (
    <section className="border-b border-lite-line bg-cream-light px-[24px] pb-[64px] pt-[56px] md:px-[40px] lg:px-[62px] lg:pb-[84px] lg:pt-[76px]">
      <p className="font-grotesk mb-[16px] text-[11px] uppercase tracking-[.16em] text-accent-orange">
        Compare Lite and Cooper
      </p>
      {/* Headline and lede side by side, the same arrangement the closing block
          on /lite uses, so the top of the page reaches the right edge instead
          of trailing off into it. */}
      <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-[1fr_minmax(0,40%)] lg:items-end lg:gap-[64px]">
        <h1 className="max-w-[16ch] font-serif text-[clamp(34px,6vw,54px)] font-normal leading-[1.08] tracking-[-.02em] text-dark-2">
          Choose how you want Cooper to work.
        </h1>
        <p className="max-w-[52ch] text-[16px] leading-[1.6] text-muted lg:pb-[8px] lg:text-[17px]">
          Both do the same core insurance work. What differs is how far Cooper reaches into your
          agency, and how much of the setup you do yourself.
        </p>
      </div>
    </section>
  )
}

/* ── The two plans ───────────────────────────────────────────── */

/**
 * `price` is the slot a plan's headline number sits in. Cooper's is scoped
 * rather than listed, and leaving the slot empty on that side left a hole the
 * subgrid could not close, so it carries the word instead of a figure.
 */
const PLANS = [
  {
    key: 'lite',
    eyebrow: 'Cooper Lite',
    title: 'Start using Cooper today.',
    body: 'For commercial agencies with up to 5 users. Work from the email and files already on the account, with no implementation project.',
    price: '$99',
    priceSuffix: '/month',
    priceNote: '$499/month',
    priceTag: 'Introductory pricing',
    points: ['Up to 5 users', 'Limited monthly usage', 'Month-to-month'],
    cta: { label: 'Get started', href: SIGNUP_URL, internal: false, accent: true },
    surface: 'bg-cream-light border-accent-orange/35',
  },
  {
    key: 'cooper',
    eyebrow: 'Cooper',
    title: 'Built around your agency.',
    body: 'Connected to your AMS, raters and carrier portals, and configured for the way your team already works.',
    price: 'Custom',
    priceSuffix: null,
    priceNote: null,
    priceTag: 'Scoped with our team',
    points: ['Flexible users', 'Higher-volume workflows', 'Guided implementation'],
    cta: { label: 'Talk to us', href: DEMO_PATH, internal: true, accent: false },
    surface: 'bg-lite-surface border-lite-line',
  },
] as const

function PlanCta({
  label,
  href,
  internal,
  accent,
}: {
  label: string
  href: string
  internal: boolean
  accent: boolean
}) {
  const className = `mt-[26px] inline-flex w-full items-center justify-center gap-[10px] rounded-[6px] px-[26px] py-[14px] text-[15px] font-medium transition-colors duration-200 ${
    accent
      ? 'bg-accent-orange text-white hover:bg-accent-orange-deep'
      : 'border border-dark-2/25 text-dark-2 hover:border-dark-2/50'
  }`
  const inner = (
    <>
      {label} <ArrowRight size={16} weight="bold" />
    </>
  )
  return internal ? (
    <Link to={href} className={className}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={className}>
      {inner}
    </a>
  )
}

function Plans() {
  return (
    <section className="bg-lite-canvas px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[96px]">
      <SectionHead
        eyebrow="Plans"
        title="Two ways to use Cooper."
        lead="Same core insurance work. Different ways to put Cooper to work."
      />

      {/* Subgrid so the two panels align row for row: body, price, points and
          button all sit level even though the copy in each is a different
          length. Where subgrid is missing the panels simply size themselves. */}
      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_1fr_auto]">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`border px-[24px] py-[30px] ${plan.surface} lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:px-[36px] lg:py-[36px]`}
          >
            <p className="font-grotesk text-[10px] uppercase tracking-[.15em] text-accent-orange">
              {plan.eyebrow}
            </p>

            <h3 className="mt-[14px] font-serif text-[clamp(24px,2.8vw,32px)] font-normal leading-[1.15] tracking-[-.015em] text-dark-2">
              {plan.title}
            </h3>

            <p className="mt-[14px] max-w-[46ch] text-[15px] leading-[1.6] text-muted">
              {plan.body}
            </p>

            <div className="mt-[26px]">
              <p className="flex flex-wrap items-end gap-x-[14px] gap-y-[8px]">
                <span className="flex items-baseline font-serif text-[clamp(38px,4.4vw,52px)] font-normal leading-[.92] tracking-[-.03em] text-dark-2">
                  {plan.price}
                  {plan.priceSuffix && (
                    <span className="ml-[9px] font-sans text-[15px] font-normal tracking-normal text-muted">
                      {plan.priceSuffix}
                    </span>
                  )}
                </span>
                <span className="flex flex-col gap-[5px] pb-[5px]">
                  {plan.priceNote && (
                    <span className="text-[14px] text-muted/70 line-through">{plan.priceNote}</span>
                  )}
                  <span className="font-grotesk text-[10px] uppercase tracking-[.15em] text-accent-orange">
                    {plan.priceTag}
                  </span>
                </span>
              </p>

              <ul className="mt-[26px] border-t border-lite-line/80">
                {plan.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-[12px] border-b border-lite-line/80 py-[12px] text-[14.5px] text-dark-2"
                  >
                    <span
                      aria-hidden
                      className="h-[4px] w-[4px] shrink-0 rounded-full bg-muted/45"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <PlanCta {...plan.cta} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Where to start ──────────────────────────────────────────── */

const START = [
  {
    title: 'Start with Lite if:',
    items: [
      'Your agency has 5 users or fewer',
      'You want to get started yourself',
      'Email and files are enough for your workflow',
      'You don’t need AMS, rater, or carrier portal integrations',
    ],
  },
  {
    title: 'Talk to us about Cooper if:',
    items: [
      'You want Cooper connected to your AMS, raters, or carrier portals',
      'You want workflows configured around how your team works',
      'More than 5 users or multiple teams will use Cooper',
      'You need higher usage, implementation support, or additional security controls',
    ],
  },
]

function WhereToStart() {
  return (
    <section className="bg-cream-light px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[96px]">
      <SectionHead
        eyebrow="Where to start"
        title="Where should you start?"
        lead="Choose on how Cooper needs to fit into your agency, not just on the size of your team."
      />

      <div className="grid grid-cols-1 gap-[10px] border-t border-lite-line lg:grid-cols-2 lg:gap-[64px]">
        {START.map((col) => (
          <div key={col.title} className="pt-[30px]">
            <h3 className="mb-[6px] text-[15px] font-semibold text-dark-2">{col.title}</h3>
            <ul>
              {col.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-[14px] border-b border-lite-line/70 py-[15px] text-[14.5px] leading-[1.5] text-muted last:border-b-0"
                >
                  <span aria-hidden className="mt-[9px] h-[4px] w-[4px] shrink-0 rounded-full bg-accent-orange" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── The full comparison ─────────────────────────────────────── */

/** `true` renders as included, `false` as not included, a string as itself. */
type Cell = string | boolean

const TABLE: { group: string; rows: [string, Cell, Cell][] }[] = [
  {
    group: 'Getting started and support',
    rows: [
      ['Setup', 'Self-serve', 'Guided implementation'],
      ['Users', 'Up to 5 users', 'Flexible'],
      ['Usage', 'Limited monthly usage', 'Higher-volume workflows'],
      ['Support', 'Standard support', 'Dedicated Cooper team'],
    ],
  },
  {
    group: 'Insurance work',
    rows: [
      ['ACORDs and market supplementals', true, true],
      ['Loss runs and summaries', true, true],
      ['Submission packages', true, true],
      ['Quote comparison and proposals', true, true],
      ['COIs, endorsements and renewals', true, true],
    ],
  },
  {
    group: 'Integrations and workflows',
    rows: [
      ['Email and uploaded files', true, true],
      ['AMS integrations', false, true],
      ['Carrier portals and raters', false, true],
      ['Workflows across systems', false, true],
      ['Workflow configuration', 'Standard Lite workflows', 'Configured for your agency'],
    ],
  },
  {
    group: 'Security and governance',
    rows: [
      ['Client data used to train models', 'Never', 'Never'],
      ['SOC 2 Type II', false, true],
      ['HIPAA', false, true],
      ['RBAC and audit logs', false, true],
      ['Additional governance controls', false, true],
    ],
  },
]

/**
 * A tick and a dash are the two states, and both need a word beside them: an
 * icon alone in a cell is the one thing a screen reader cannot read out, and
 * it is also what makes a comparison table look like a chart of ticks.
 */
function Value({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="flex items-center gap-[9px] text-dark-2">
        <Check size={14} weight="bold" className="shrink-0 text-accent-orange" aria-hidden />
        Included
      </span>
    )
  }
  if (value === false) {
    // Held back from the tick, but not so far back that it stops being read:
    // at muted/70 this row came in under 4.5:1 on the cream cell.
    return (
      <span className="flex items-center gap-[9px] text-muted/85">
        <Minus size={14} className="shrink-0 text-muted/55" aria-hidden />
        Not included
      </span>
    )
  }
  return <span className="text-dark-2">{value}</span>
}

/* Below md the table lays itself out as a stack of blocks, one per capability,
   so nothing is squeezed into a 90px column on a phone. `display: block` drops
   the implicit table semantics, so every element carries its role explicitly
   and the header labels each cell repeats are hidden from md up. */
const CELL =
  'px-[18px] py-[14px] text-[14px] leading-[1.5] max-md:flex max-md:items-baseline max-md:justify-between max-md:gap-[20px] max-md:px-0 max-md:py-[7px]'

function ComparisonTable() {
  return (
    <section className="bg-lite-canvas px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[96px]">
      <SectionHead
        eyebrow="Full comparison"
        title="See what’s included."
        lead="Both handle the same core insurance work. Cooper adds the integrations, configuration, controls and support that make it part of your agency’s workflow."
      />

      <div className="border border-lite-line bg-cream-light max-md:border-0 max-md:bg-transparent">
        <table role="table" className="w-full border-collapse text-left max-md:block">
          <thead role="rowgroup" className="max-md:hidden">
            <tr role="row" className="border-b border-lite-line">
              <th
                role="columnheader"
                scope="col"
                className="w-[40%] px-[18px] py-[20px] align-bottom font-grotesk text-[10px] font-normal uppercase tracking-[.14em] text-muted"
              >
                Capability
              </th>
              <th
                role="columnheader"
                scope="col"
                className="w-[30%] border-l border-lite-line px-[18px] py-[20px] align-bottom"
              >
                <CooperLiteLockup
                  logo="h-[15px]"
                  badge="text-[8px] px-[5px] py-[1px]"
                  gap="gap-[8px]"
                />
                <span className="mt-[8px] block text-[12.5px] font-normal text-muted">
                  Self-serve, up to 5 users · $99/month
                </span>
              </th>
              <th
                role="columnheader"
                scope="col"
                className="w-[30%] border-l border-lite-line px-[18px] py-[20px] align-bottom"
              >
                <img
                  src="/images/cooper-logo-full.svg"
                  alt="Cooper"
                  width={154}
                  height={36}
                  className="h-[15px] w-auto brightness-0"
                />
                <span className="mt-[8px] block text-[12.5px] font-normal text-muted">
                  Connected to your systems and workflows
                </span>
              </th>
            </tr>
          </thead>

          {TABLE.map(({ group, rows }, g) => (
            <tbody role="rowgroup" key={group} className="max-md:block">
              <tr role="row" className="max-md:block">
                <th
                  role="columnheader"
                  scope="colgroup"
                  colSpan={3}
                  className={`border-y border-lite-line bg-lite-surface px-[18px] py-[10px] font-grotesk text-[10px] font-normal uppercase tracking-[.14em] text-accent-orange max-md:block max-md:border-x-0 max-md:border-t-0 max-md:bg-transparent max-md:px-0 max-md:pb-[6px] max-md:pt-0 ${
                    g > 0 ? 'max-md:mt-[34px]' : ''
                  }`}
                >
                  {group}
                </th>
              </tr>
              {rows.map(([label, lite, cooper]) => (
                <tr
                  role="row"
                  key={label}
                  className="border-b border-lite-line/70 last:border-b-0 max-md:block max-md:border-b max-md:py-[14px]"
                >
                  <th
                    role="rowheader"
                    scope="row"
                    className={`${CELL} font-normal text-dark-2 max-md:mb-[8px] max-md:block max-md:font-medium`}
                  >
                    {label}
                  </th>
                  <td role="cell" className={`${CELL} border-l border-lite-line/70 max-md:border-l-0`}>
                    <span aria-hidden className="hidden shrink-0 text-muted max-md:inline">
                      Cooper Lite
                    </span>
                    <Value value={lite} />
                  </td>
                  <td role="cell" className={`${CELL} border-l border-lite-line/70 max-md:border-l-0`}>
                    <span aria-hidden className="hidden shrink-0 text-muted max-md:inline">
                      Cooper
                    </span>
                    <Value value={cooper} />
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <p className="mt-[26px] max-w-[76ch] text-[14.5px] leading-[1.6] text-muted">
        <strong className="font-semibold text-dark-2">In short:</strong> start with Lite if you want
        to use Cooper yourself. Choose Cooper when you want it connected to the way your agency
        works.
      </p>
    </section>
  )
}

/* ── What Cooper adds ────────────────────────────────────────── */

const COOPER_ADDS = [
  {
    tag: 'Integrations',
    title: 'Connect your systems.',
    body: 'AMS, raters, carrier portals, email, and systems of record.',
  },
  {
    tag: 'Workflows',
    title: 'Configure your workflows.',
    body: 'Fit Cooper around your team’s processes and rules.',
  },
  {
    tag: 'Governance',
    title: 'Add the controls you need.',
    body: 'SOC 2 Type II, HIPAA, RBAC, audit logs, and additional governance controls.',
  },
  {
    tag: 'Implementation',
    title: 'Roll out with Cooper.',
    body: 'Our team helps configure, implement, and support Cooper for your agency.',
  },
]

function WhatCooperAdds() {
  return (
    <section className="bg-cream-light px-[24px] py-[76px] md:px-[40px] lg:px-[62px] lg:py-[96px]">
      <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-[minmax(0,34%)_1fr] lg:gap-[64px]">
        <div>
          <p className="font-grotesk mb-[14px] text-[11px] uppercase tracking-[.16em] text-accent-orange">
            Cooper
          </p>
          <h2 className="max-w-[14ch] font-serif text-[clamp(28px,4vw,42px)] font-normal leading-[1.12] tracking-[-.015em] text-dark-2">
            Build Cooper into your workflow.
          </h2>
          <Link
            to={DEMO_PATH}
            className="mt-[24px] inline-flex items-center gap-[9px] text-[14.5px] font-medium text-accent-orange"
          >
            Talk to us <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 border-t border-lite-line sm:grid-cols-2 sm:gap-x-[48px]">
          {COOPER_ADDS.map((item) => (
            <div key={item.tag} className="border-b border-lite-line py-[24px]">
              <p className="font-grotesk mb-[10px] text-[10px] uppercase tracking-[.14em] text-muted">
                {item.tag}
              </p>
              <h3 className="mb-[8px] text-[16px] font-semibold text-dark-2">{item.title}</h3>
              <p className="max-w-[42ch] text-[14px] leading-[1.55] text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Closing ─────────────────────────────────────────────────── */

/* The page ends on the one dark block the brand book allows, and it carries
   both doors rather than picking one: a comparison page that closes on a
   single CTA has spent the whole page pretending to be neutral. */
function CompareClosing() {
  return (
    <section className="bg-dark-2 px-[24px] pt-[76px] text-cream-light md:px-[40px] lg:px-[62px] lg:pt-[96px]">
      <div className="grid grid-cols-1 gap-[44px] lg:grid-cols-2 lg:gap-[64px]">
        <div className="lg:border-r lg:border-cream-light/12 lg:pr-[64px]">
          <p className="font-grotesk mb-[14px] text-[11px] uppercase tracking-[.16em] text-accent-orange">
            Cooper Lite
          </p>
          <h2 className="max-w-[14ch] font-serif text-[clamp(26px,3.4vw,36px)] font-normal leading-[1.14] tracking-[-.015em]">
            Ready to get started?
          </h2>
          <p className="mt-[14px] max-w-[46ch] text-[15px] leading-[1.6] text-cream-light/70">
            Up to 5 users. Self-serve, month-to-month, and no implementation project.
          </p>
          <a
            href={SIGNUP_URL}
            className="mt-[26px] inline-flex items-center gap-[10px] rounded-full bg-accent-orange px-[28px] py-[15px] text-[15px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep"
          >
            Get started <ArrowRight size={16} weight="bold" />
          </a>
        </div>

        <div>
          <p className="font-grotesk mb-[14px] text-[11px] uppercase tracking-[.16em] text-accent-orange">
            Cooper
          </p>
          <h2 className="max-w-[16ch] font-serif text-[clamp(26px,3.4vw,36px)] font-normal leading-[1.14] tracking-[-.015em]">
            Want Cooper built around your agency?
          </h2>
          <p className="mt-[14px] max-w-[46ch] text-[15px] leading-[1.6] text-cream-light/70">
            See how Cooper connects to your systems, your workflows, and your team.
          </p>
          <Link
            to={DEMO_PATH}
            className="mt-[26px] inline-flex items-center gap-[10px] rounded-full border border-cream-light/25 px-[28px] py-[15px] text-[15px] font-medium text-cream-light transition-colors duration-200 hover:border-cream-light/50"
          >
            Talk to us <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Page ────────────────────────────────────────────────────── */

export default function LiteComparePage() {
  useSeo({
    title: 'Compare Cooper Lite and Cooper — Cooper',
    description:
      'See how Cooper Lite and Cooper differ across setup, users, usage, integrations, workflow configuration, support, security and governance, and find out which one to start with.',
    canonicalPath: COMPARE_PATH,
    jsonLd: pageJsonLd({
      name: 'Compare Cooper Lite and Cooper',
      path: COMPARE_PATH,
      description:
        'A side-by-side comparison of Cooper Lite, the self-serve tier for agencies with up to 5 users, and Cooper, connected to your systems and workflows.',
    }),
  })

  return (
    <div className="min-h-screen bg-cream-light">
      <LiteNav />
      <CompareHero />
      <Plans />
      <WhereToStart />
      <ComparisonTable />
      <WhatCooperAdds />
      <CompareClosing />
      <LiteFooter />
    </div>
  )
}
