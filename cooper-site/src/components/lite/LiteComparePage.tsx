import { ArrowRight, Check } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useSeo } from '../../lib/useSeo'
import CooperLogo from '../CooperLogo'
import { LiteAnnounce, LiteFooter, PlanLockup } from './LiteChrome'
import {
  BUTTON_DARK_COMPACT,
  BUTTON_ON_DARK,
  BUTTON_OUTLINE,
  BUTTON_OUTLINE_COMPACT,
  BUTTON_PRIMARY,
  BUTTON_PRIMARY_COMPACT,
  EYEBROW,
} from './lite-ui'
import { PRICE, SEATS, SEAT_LIMIT } from './plans'

/* Signup lives in the product app, not in this marketing repo, so every Get
   started goes out to it absolutely. Same URL LitePage uses. */
const SIGNUP_URL = 'https://www.askcooper.ai/lite/signup'

/* Header and rows share one track definition, so a column edge cannot drift. */
const ROW =
  'grid grid-cols-[1.45fr_1fr_1fr] gap-x-[14px] md:gap-x-[28px]'

/* `same` de-emphasises a row, so the ones that differ read as different. */
type Cell = { text: string; mark?: 'yes' | 'no'; same?: boolean }

const INCLUDED: Cell = { text: 'Included', mark: 'yes', same: true }
const NOT_IN_LITE: Cell = { text: 'Not included', mark: 'no' }
const IN_COOPER: Cell = { text: 'Included', mark: 'yes' }

const COMPARISON: {
  section: string
  rows: { feature: string; lite: Cell; cooper: Cell }[]
}[] = [
  {
    section: 'Getting started & support',
    rows: [
      {
        feature: 'Setup',
        lite: { text: 'Self-serve' },
        cooper: { text: 'Guided implementation' },
      },
      {
        feature: 'Users',
        lite: { text: SEAT_LIMIT },
        cooper: { text: 'Flexible' },
      },
      {
        feature: 'Usage',
        lite: { text: 'Limited monthly usage' },
        cooper: { text: 'Higher-volume workflows' },
      },
      {
        feature: 'Support',
        lite: { text: 'Standard support' },
        cooper: { text: 'Dedicated Cooper team' },
      },
    ],
  },
  {
    section: 'Insurance work',
    rows: [
      {
        feature: 'ACORDs & market supplementals',
        lite: INCLUDED,
        cooper: INCLUDED,
      },
      { feature: 'Loss runs & summaries', lite: INCLUDED, cooper: INCLUDED },
      { feature: 'Submission packages', lite: INCLUDED, cooper: INCLUDED },
      {
        feature: 'Quote comparison & proposals',
        lite: INCLUDED,
        cooper: INCLUDED,
      },
      {
        feature: 'COIs, endorsements & renewals',
        lite: INCLUDED,
        cooper: INCLUDED,
      },
    ],
  },
  {
    section: 'Integrations & workflows',
    rows: [
      { feature: 'Email & uploaded files', lite: INCLUDED, cooper: INCLUDED },
      { feature: 'AMS integrations', lite: NOT_IN_LITE, cooper: IN_COOPER },
      {
        feature: 'Carrier portals & raters',
        lite: NOT_IN_LITE,
        cooper: IN_COOPER,
      },
      {
        feature: 'Workflows across systems',
        lite: NOT_IN_LITE,
        cooper: IN_COOPER,
      },
      {
        feature: 'Workflow configuration',
        lite: { text: 'Standard Lite workflows' },
        cooper: { text: 'Configured for your agency' },
      },
    ],
  },
  {
    section: 'Security & governance',
    rows: [
      {
        feature: 'Client data used to train models',
        lite: { text: 'Never', same: true },
        cooper: { text: 'Never', same: true },
      },
      { feature: 'SOC 2 Type II', lite: NOT_IN_LITE, cooper: IN_COOPER },
      { feature: 'HIPAA', lite: NOT_IN_LITE, cooper: IN_COOPER },
      { feature: 'RBAC & audit logs', lite: NOT_IN_LITE, cooper: IN_COOPER },
      {
        feature: 'Additional governance controls',
        lite: NOT_IN_LITE,
        cooper: IN_COOPER,
      },
    ],
  },
]

/* Each column ends in the action it argues for. Without them the section
   convinces a reader and then leaves them to scroll back up to act. */
const FIT = [
  {
    title: 'Start with Lite if:',
    points: [
      `Your agency has ${SEATS} users or fewer`,
      'You want to get started yourself',
      'Email and files are enough for your workflow',
      "You don't need AMS, rater, or carrier portal integrations",
    ],
    cta: { label: 'Get started', href: SIGNUP_URL, style: BUTTON_PRIMARY },
  },
  {
    title: 'Talk to us about Cooper if:',
    points: [
      'You want Cooper connected to your AMS, raters, or carrier portals',
      'You want workflows configured around how your team works',
      `More than ${SEATS} users or multiple teams will use Cooper`,
      'You need higher usage, implementation support, or additional security controls',
    ],
    cta: { label: 'Talk to us', href: '/demo', style: BUTTON_OUTLINE },
  },
]

export default function LiteComparePage() {
  useSeo({
    title: 'Compare Cooper Lite and Cooper',
    description:
      'Cooper Lite is self-serve for agencies of five users or fewer. Cooper connects to your AMS, raters and carrier portals with guided implementation.',
    canonicalPath: '/lite/compare',
  })

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <LiteAnnounce />

      <nav className="sticky top-0 z-[100] bg-cream-light/97 backdrop-blur-[14px] border-b border-dark/15 px-5 md:px-10 lg:px-[62px] h-[74px] flex items-center">
        <div className="max-w-[1360px] w-full mx-auto flex items-center gap-[18px] md:gap-[28px]">
          <Link to="/lite" aria-label="Cooper home">
            <CooperLogo dark />
          </Link>
          <div className="hidden md:block pl-[26px] border-l border-dark/20 font-grotesk text-[11px] uppercase tracking-[.16em] text-muted">
            Compare Lite &amp; Cooper
          </div>
          <div className="ml-auto flex items-center gap-[10px]">
            <Link to="/demo" className={BUTTON_OUTLINE_COMPACT}>
              Talk to us
            </Link>
            <a href={SIGNUP_URL} className={BUTTON_DARK_COMPACT}>
              Get started <ArrowRight size={15} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>
      </nav>

      {/* Headline and both plans in one band, so the first screen of a page
          called Compare already compares. The two used to be separate: a hero
          that only restated the nav, then the plans below the fold. */}
      <header className="border-b border-dark/20 px-5 md:px-10 lg:px-[62px] pt-[60px] md:pt-[88px] pb-[56px] md:pb-[80px]">
        <div className="max-w-[1360px] mx-auto">
          {/* No eyebrow here: the nav already carries Compare Lite & Cooper, and
              the headline said it a third time. */}
          {/* Headline and the sentence that answers it share a baseline, so the
              answer is read as part of the title rather than as body copy. */}
          <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-[22px] lg:gap-[64px] items-end mb-[44px] md:mb-[56px]">
            <h1 className="font-serif font-normal text-[38px] md:text-[46px] lg:text-[54px] leading-[1.08] tracking-[-.015em] text-dark">
              Choose how you want
              {/* Only from lg, where the first line actually fits: forced below
                  that, the break leaves "want" alone on a line of its own. */}
              <br className="hidden lg:block" />{' '}
              <span className="text-accent-orange-deep">Cooper to work.</span>
            </h1>
            <p className="font-sans text-[16px] md:text-[17px] leading-[1.6] text-muted max-w-[42ch] m-0">
              Same core insurance work, two ways to put it to work. Lite if it's your
              team and your inbox. Cooper if it has to reach your AMS,
              raters and carrier portals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 border border-dark/20 bg-cream-light">
            <article className="min-h-[410px] p-[28px] md:p-[42px] flex flex-col shadow-[inset_0_3px_0_var(--color-accent-orange-deep)]">
              <div className="mb-[28px]">
                <PlanLockup lite />
              </div>
              <h3 className="font-serif font-normal text-[26px] lg:text-[30px] leading-[1.15] tracking-[-.01em] text-dark mb-[14px]">
                Start using Cooper today.
              </h3>
              <p className="font-sans text-[15px] leading-[1.6] text-muted max-w-[56ch] mb-[28px]">
                For commercial agencies with up to {SEATS} users. Work from the
                email and files already on the account, no implementation
                needed.
              </p>
              {/* The figure leads on its own line; what it replaces and why sit
                  under it as one quiet line. Three competing sizes on a single
                  baseline left the old price floating and the unit stranded. */}
              <div className="mt-[4px] flex items-baseline gap-[7px]">
                <span className="font-serif leading-none text-dark text-[46px]">
                  {/* The serif's dollar sign is nearly cap height, so it swamps
                      the digits at full size. */}
                  <span className="text-[.42em] align-[.85em] mr-[3px]">$</span>
                  {PRICE.amount}
                </span>
                <span className="font-sans text-[14px] text-muted">
                  /{PRICE.per}
                </span>
              </div>
              <div className="mt-[12px] flex items-center gap-[10px] flex-wrap font-sans text-[13px] text-muted">
                <s className="text-dark/40">
                  {PRICE.was}/{PRICE.per}
                </s>
                <span aria-hidden="true" className="text-dark/20">
                  ·
                </span>
                <span className="font-grotesk text-[10px] uppercase tracking-[.15em] text-accent-orange">
                  {PRICE.note}
                </span>
              </div>
              <PlanMeta items={[SEAT_LIMIT, PRICE.usage, PRICE.cadence]} />
              <div className="mt-auto pt-[32px] flex gap-[10px] flex-wrap items-center">
                <a href={SIGNUP_URL} className={BUTTON_PRIMARY}>
                  Get started <ArrowRight size={15} weight="bold" aria-hidden="true" />
                </a>
              </div>
            </article>

            <article className="min-h-[410px] p-[28px] md:p-[42px] flex flex-col bg-dark-2 text-cream-light border-t md:border-t-0 md:border-l border-dark/20">
              <div className="mb-[28px]">
                <PlanLockup onDark />
              </div>
              <h3 className="font-serif font-normal text-[26px] lg:text-[30px] leading-[1.15] tracking-[-.01em] mb-[14px]">
                Built around your agency.
              </h3>
              <p className="font-sans text-[15px] leading-[1.6] text-cream-light/65 max-w-[56ch] mb-[28px]">
                Connected to your AMS, raters and carrier portals, configured
                for the way your team already works.
              </p>
              <PlanMeta
                dark
                pushDown
                items={[
                  'Flexible users',
                  'Higher-volume workflows',
                  'Guided implementation',
                ]}
              />
              <div className="pt-[32px] flex gap-[10px] flex-wrap items-center">
                <Link to="/demo" className={BUTTON_PRIMARY}>
                  Talk to us <ArrowRight size={15} weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </header>

      <section className="bg-lite-canvas border-b border-dark/20 px-5 md:px-10 lg:px-[62px] py-[64px] md:py-[96px]">
        <div className="max-w-[1360px] mx-auto">
          <div className="max-w-[880px] mb-[36px]">
            <div className={`${EYEBROW} mb-[20px]`}>Where to start</div>
            <h2 className="font-serif font-normal text-[32px] md:text-[38px] lg:text-[44px] leading-[1.1] tracking-[-.015em] text-dark">
              Where should you start?
            </h2>
            <p className="font-sans text-[16px] leading-[1.6] text-muted max-w-[680px] mt-[16px]">
              Choose based on how Cooper needs to fit into your agency, not just
              team size.
            </p>
          </div>
          <div className="grid md:grid-cols-2 border-y border-dark/20">
            {FIT.map((col, i) => (
              <div
                key={col.title}
                className={`flex flex-col px-[24px] md:px-[40px] py-[38px] ${
                  i > 0 ? 'border-t md:border-t-0 md:border-l border-dark/20' : ''
                }`}
              >
                <h3 className="font-sans font-semibold text-[19px] text-dark mb-[24px]">
                  {col.title}
                </h3>
                <ul className="list-none p-0 m-0">
                  {col.points.map((point, j) => (
                    <li
                      key={point}
                      className={`flex gap-[12px] py-[12px] font-sans text-[14px] leading-[1.45] text-dark/75 ${
                        j > 0 ? 'border-t border-dark/10' : ''
                      }`}
                    >
                      {/* Drawn, not typed: the text glyph came in hairline
                          thin and sat off the first line. Deliberately not the
                          orange tick the table uses for Included, since these
                          are conditions rather than features. */}
                      <Check
                        size={15}
                        weight="bold"
                        aria-hidden="true"
                        className="mt-[2px] shrink-0 text-dark/60"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-[32px]">
                  {col.cta.href.startsWith('/') ? (
                    <Link to={col.cta.href} className={col.cta.style}>
                      {col.cta.label}{' '}
                      <ArrowRight size={15} weight="bold" aria-hidden="true" />
                    </Link>
                  ) : (
                    <a href={col.cta.href} className={col.cta.style}>
                      {col.cta.label}{' '}
                      <ArrowRight size={15} weight="bold" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No box, no shaded cells: the table is a typographic matrix on the
          page ground, ruled by hairlines. Boxing it made a data grid out of
          what should read as a document. */}
      <section
        id="comparison"
        className="bg-cream-light border-b border-dark/20 px-5 md:px-10 lg:px-[62px] py-[64px] md:py-[100px]"
      >
        <div className="max-w-[1360px] mx-auto">
          <SectionIntro
            label="Full comparison"
            heading="See what's included."
            copy="Both handle the same core insurance work. Cooper adds the integrations, configuration, controls, and support to make it part of your agency's workflow."
          />

          <div className="border-t border-dark/20">
            {/* Each column carries its own action, full width of the column.
                The table runs nineteen rows, and a reader who decides halfway
                down should not have to scroll past the end of it to act. */}
            <div className={`${ROW} sticky top-[74px] z-20 bg-cream-light border-b border-dark/20 pt-[24px] pb-[22px]`}>
              <div className="flex items-end font-sans text-[13px] text-muted">
                Capability
              </div>
              <div className="flex flex-col">
                <div className="font-sans font-medium text-[17px] md:text-[19px] leading-none text-dark">
                  Cooper Lite
                </div>
                <div className="font-sans text-[12px] md:text-[13px] text-muted mt-[8px]">
                  Self-serve · {SEAT_LIMIT.toLowerCase()}
                </div>
                <div className="font-sans text-[13px] text-dark mt-[4px]">
                  <s className="text-dark/40">{PRICE.was}</s>{' '}
                  <b className="font-medium">
                    {PRICE.now}/{PRICE.per}
                  </b>
                </div>
                <div className="hidden md:block mt-[16px]">
                  <a
                    href={SIGNUP_URL}
                    className={`${BUTTON_PRIMARY_COMPACT} w-full`}
                  >
                    Get started
                  </a>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-sans font-medium text-[17px] md:text-[19px] leading-none text-dark">
                  Cooper
                </div>
                <div className="font-sans text-[12px] md:text-[13px] text-muted mt-[8px]">
                  Connected to your systems &amp; workflows
                </div>
                {/* Lite's column carries a price line this one does not, so the
                    two buttons would otherwise sit on different baselines. */}
                <div className="mt-auto" />
                <div className="hidden md:block mt-[16px]">
                  <Link to="/demo" className={`${BUTTON_OUTLINE_COMPACT} w-full`}>
                    Talk to us
                  </Link>
                </div>
              </div>
            </div>

            {COMPARISON.map((group) => (
              <div key={group.section}>
                <div className="font-grotesk text-[11px] uppercase tracking-[.16em] text-muted pt-[38px] pb-[16px] border-b border-dark/20">
                  {group.section}
                </div>
                {group.rows.map((row) => (
                  <div
                    key={row.feature}
                    className={`${ROW} border-b border-dark/10 py-[18px] md:py-[20px]`}
                  >
                    <div className="font-sans font-medium text-[14px] md:text-[15px] leading-[1.45] text-dark">
                      {row.feature}
                    </div>
                    <TableCell cell={row.lite} />
                    <TableCell cell={row.cooper} />
                  </div>
                ))}
              </div>
            ))}

            <p className="font-sans text-[14px] leading-[1.6] text-muted pt-[26px] m-0 max-w-[76ch]">
              <strong className="text-dark font-medium">In short:</strong> Start
              with Lite if you want to use Cooper yourself. Choose Cooper when
              you want it connected to the way your agency works.
            </p>
          </div>
        </div>
      </section>

      {/* The house close: a dark field, eyebrow, serif headline, one lede and
          a dominant action. Home, Integrations, the ROI method block and /lite
          all end this way; a pair of hairline columns on cream ended this page
          in a pattern the site does not use anywhere else. The band runs into
          the footer, which is the same espresso, exactly as /lite does. */}
      <section className="bg-dark-2 text-cream-light px-5 md:px-10 lg:px-[62px] pt-[72px] md:pt-[96px] pb-[64px] md:pb-[80px]">
        <div className="max-w-[1360px] mx-auto">
          <p className="font-grotesk text-[11px] uppercase tracking-[.16em] text-accent-orange mb-[16px]">
            Get started
          </p>
          {/* Headline and lede side by side, so the top of the block reaches the
              right edge instead of trailing off into it. */}
          <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-[1fr_minmax(0,42%)] lg:items-end lg:gap-[64px]">
            <h2 className="max-w-[18ch] font-serif font-normal text-[clamp(30px,4.6vw,46px)] leading-[1.12] tracking-[-.015em]">
              Start with Lite today, or build Cooper into your agency.
            </h2>
            <p className="max-w-[52ch] font-sans text-[15.5px] leading-[1.6] text-cream-light/70 lg:pb-[6px]">
              Lite is self-serve and starts with the next submission in your
              inbox. Cooper connects to your AMS, raters and carrier portals,
              configured for the way your team already works.
            </p>
          </div>

          {/* The actions span the field rather than sitting in a corner of it.
              On a full-bleed dark block, the empty two thirds beside a small
              button read as a mistake rather than as space. */}
          <div className="mt-[38px] flex flex-wrap items-center gap-[14px]">
            <a href={SIGNUP_URL} className={BUTTON_PRIMARY}>
              Get started <ArrowRight size={15} weight="bold" aria-hidden="true" />
            </a>
            <Link to="/demo" className={BUTTON_ON_DARK}>
              Talk to us about Cooper{' '}
              <ArrowRight size={15} weight="bold" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-[22px] font-sans text-[13px] text-cream-light/55">
            {PRICE.now}/{PRICE.per} {PRICE.note.toLowerCase()} · {SEAT_LIMIT} ·{' '}
            {PRICE.usage}
          </p>
        </div>
      </section>

      <LiteFooter />
    </div>
  )
}

function SectionIntro({
  label,
  heading,
  copy,
}: {
  label: string
  heading: string
  copy: string
}) {
  return (
    <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-[24px] lg:gap-[80px] items-end mb-[42px]">
      <div>
        <div className={EYEBROW}>{label}</div>
        <h2 className="font-serif font-normal text-[32px] md:text-[38px] lg:text-[44px] leading-[1.1] tracking-[-.015em] text-dark mt-[18px]">
          {heading}
        </h2>
      </div>
      <p className="font-sans text-[16px] md:text-[17px] leading-[1.6] text-muted max-w-[740px] m-0">
        {copy}
      </p>
    </div>
  )
}

/* `pushDown` sends the row to the bottom of the card: the Cooper card carries
   no price block, so without it the rule sits higher than Lite's. */
function PlanMeta({
  items,
  dark,
  pushDown,
}: {
  items: string[]
  dark?: boolean
  pushDown?: boolean
}) {
  return (
    <div
      className={`${pushDown ? 'mt-auto' : 'mt-[24px]'} pt-[22px] border-t flex gap-x-[18px] gap-y-[10px] flex-wrap font-sans text-[13px] ${
        dark
          ? 'border-cream-light/15 text-cream-light/65'
          : 'border-dark/20 text-muted'
      }`}
    >
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )
}

function TableCell({ cell }: { cell: Cell }) {
  if (cell.mark) {
    return (
      <div className="flex items-start">
        {cell.mark === 'yes' ? (
          <Check
            size={16}
            weight="bold"
            aria-hidden="true"
            className="mt-[1px] text-accent-orange"
          />
        ) : (
          <span aria-hidden="true" className="text-dark/25 leading-none">
            —
          </span>
        )}
        {/* The glyph is the whole cell now, so the reading stays in the text
            layer for anyone not looking at it. */}
        <span className="sr-only">{cell.text}</span>
      </div>
    )
  }
  return (
    <div className="font-sans text-[14px] md:text-[15px] leading-[1.45] text-muted">
      {cell.text}
    </div>
  )
}
