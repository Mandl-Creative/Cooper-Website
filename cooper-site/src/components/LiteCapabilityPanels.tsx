/* ──────────────────────────────────────────────────────────────
   Abstract capability panels for /lite.

   These replace six screenshots of the running product. The screenshots were
   the honest option and they were also the wrong one: they carried a real
   signed-in user, a real @askcooper.ai address on a file, a live inbox count
   and a folder someone had named as a joke, all of it published on a marketing
   page and none of it reviewable by the people whose names were in it. A
   screenshot also freezes: the day the product ships a new sidebar the page is
   quietly out of date, and nobody notices until a customer does.

   The first pass at replacing them gave all six the same body: a header strip
   over a stack of label-left value-right rows. It was consistent and it was
   dead. Six different kinds of work all looked like the same table, so flicking
   between capabilities showed the reader nothing.

   So each panel now takes the shape of the work it describes. Filling forms
   looks like a form. Summarising five years of losses looks like a chart.
   Assembling a package looks like a stack. Comparing three markets looks like
   three columns. Drafting a proposal looks like a page. Renewal work looks like
   a dated queue. What stays constant is the surface, the type scale, and the
   single ochre accent; what changes is the structure, because that is the part
   carrying the meaning.

   Every value is invented. `Ridgeline Millwork LLC` is not a client, and the
   markets are lettered rather than named so nothing here reads as a claim about
   which carriers Cooper does or does not place business with.
─────────────────────────────────────────────────────────────── */

import type { ReactNode } from 'react'

/* Surface and type. Constant across all six; only structure varies. */
const S = {
  card: 'flex h-full w-full flex-col overflow-hidden rounded-[6px] border border-lite-line bg-cream-light',
  head: 'flex shrink-0 items-center justify-between gap-[10px] border-b border-lite-line bg-lite-canvas px-[14px] py-[10px] sm:px-[16px] sm:py-[11px]',
  foot: 'flex shrink-0 items-center justify-between gap-[10px] border-t border-lite-line bg-lite-canvas px-[14px] py-[8px] sm:px-[16px] sm:py-[9px]',
  label: 'font-grotesk text-[9px] uppercase tracking-[.13em] text-muted sm:text-[9.5px]',
  stamp: 'font-grotesk shrink-0 text-[9px] uppercase tracking-[.13em] text-accent-orange sm:text-[9.5px]',
  body: 'font-sans text-[11px] leading-[1.3] text-dark-2 sm:text-[12px]',
  dim: 'font-sans text-[10.5px] leading-[1.3] text-muted sm:text-[11.5px]',
  micro: 'font-sans text-[9.5px] leading-[1.25] text-muted sm:text-[10px]',
} as const

const ACCOUNT = 'Ridgeline Millwork LLC'

function Shell({
  label,
  state,
  footer,
  children,
}: {
  label: string
  state: string
  footer: ReactNode
  children: ReactNode
}) {
  return (
    <div className={S.card}>
      <div className={S.head}>
        <span className={S.label}>{label}</span>
        <span className={S.stamp}>{state}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <div className={S.foot}>{footer}</div>
    </div>
  )
}

/* ── 01 · Complete ACORDs · a form ───────────────────────────── */

/**
 * Shaped like the thing itself: tabbed form sheets, fields in two columns, each
 * value sitting on a ruled line the way it does on a printed ACORD. The ochre
 * wash marks what Cooper wrote, which is the only claim this screen is making.
 */
const FORM_FIELDS: [string, string, boolean][] = [
  ['Named insured', ACCOUNT, true],
  ['FEIN', '84-2117905', true],
  ['Mailing address', '1420 Kiln Road, Bend OR', true],
  ['Business type', 'Millwork · Class 91340', true],
  ['Annual payroll', '$1,840,000', true],
  ['Effective date', '01 Jul 2026', false],
]

export function AcordsPanel() {
  return (
    <Shell
      label="Commercial application"
      state="Filled"
      footer={
        <>
          <span className={S.micro}>Sourced from 4 uploaded documents</span>
          <span className={S.stamp}>38 of 41 fields</span>
        </>
      }
    >
      {/* Tab strip: three forms, one open. */}
      <div className="flex shrink-0 items-end gap-[3px] border-b border-lite-line px-[10px] pt-[8px] sm:px-[12px]">
        {['ACORD 125', 'ACORD 126', 'ACORD 140'].map((t, i) => (
          <span
            key={t}
            className={`font-grotesk rounded-t-[4px] border border-b-0 px-[8px] py-[4px] text-[8.5px] tracking-[.06em] sm:text-[9px] ${
              i === 0
                ? '-mb-px border-lite-line bg-cream-light text-dark-2'
                : 'border-transparent bg-lite-canvas text-muted'
            }`}
          >
            {t}
          </span>
        ))}
      </div>

      {/* `auto-rows-fr` so the four field rows split the card evenly. Centring
          them instead left a third of the sheet blank top and bottom, which on
          a form reads as a form that was not finished. */}
      <div className="grid flex-1 auto-rows-fr grid-cols-2 items-center gap-x-[14px] px-[14px] py-[8px] sm:gap-x-[20px] sm:px-[16px]">
        {FORM_FIELDS.map(([label, value, filled], i) => (
          <div
            key={label}
            /* The address needs the full width; everything else pairs up. */
            className={i === 2 ? 'col-span-2' : ''}
          >
            <span className={`${S.micro} block`}>{label}</span>
            <span
              className={`mt-[2px] block truncate border-b px-[3px] pb-[3px] ${S.body} ${
                filled ? 'border-accent-orange/35 bg-accent-orange/[.07]' : 'border-lite-line'
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </Shell>
  )
}

/* ── 02 · Summarize loss runs · a chart ──────────────────────── */

/**
 * "Summarize" is the verb, so the panel is a summary, not the table it was
 * made from. Bars are scaled off the largest year rather than a round ceiling,
 * so 2023 reads as the outlier it is, and the clear year gets a baseline tick
 * instead of nothing, because a missing bar and a zero bar look the same.
 */
const LOSS_YEARS: [string, number, string, number][] = [
  ['21', 14200, '$14.2k', 2],
  ['22', 0, 'None', 0],
  ['23', 61900, '$61.9k', 3],
  ['24', 8400, '$8.4k', 1],
  ['25', 23700, '$23.7k', 2],
]
const LOSS_PEAK = 61900

export function LossRunsPanel() {
  return (
    <Shell
      label="Loss history · 5 years"
      state="Summarized"
      footer={
        <>
          <span className={S.micro}>8 claims · 1 clear year</span>
          <span className="font-grotesk text-[10.5px] tabular-nums text-accent-orange sm:text-[11px]">
            $108,200 incurred
          </span>
        </>
      }
    >
      {/* The plot is its own flex-1 box and the bars are a percentage of it,
          so the tallest year reaches the top of the chart instead of the top of
          whatever height the labels happened to leave over. */}
      <div className="flex flex-1 flex-col px-[14px] pb-[8px] pt-[12px] sm:px-[18px]">
        {/* The height here is load-bearing, not padding, and it has to be a
            height rather than a `min-height`. Each bar is a percentage of its
            column, the column is `h-full` of this box, and a percentage only
            resolves against a definite height. From `sm` up the panel is locked
            to 16:10, so `flex-1` is definite and the chain holds. Below `sm`
            the panel is auto-height: `flex-1` resolves to content, `h-full`
            resolves to auto, and every bar computed to zero. The chart rendered
            as five captions floating over an empty strip. Hence the fixed
            116px there and `flex-1` only from `sm`. */}
        <div className="flex h-[116px] items-end gap-[6px] sm:h-auto sm:flex-1 sm:gap-[10px]">
          {LOSS_YEARS.map(([year, value, caption, claims]) => {
            const pct = value === 0 ? 0 : Math.max((value / LOSS_PEAK) * 100, 7)
            const peak = value === LOSS_PEAK
            return (
              <div key={year} className="flex h-full flex-1 flex-col justify-end gap-[4px]">
                <span
                  className={`text-center font-sans text-[9px] leading-none sm:text-[10px] ${
                    peak ? 'text-accent-orange' : 'text-muted'
                  }`}
                  data-claims={claims}
                >
                  {caption}
                </span>
                <div
                  className={`w-full rounded-t-[2px] ${peak ? 'bg-accent-orange' : 'bg-dark-2/30'}`}
                  style={{ height: `${pct}%`, minHeight: value === 0 ? '2px' : undefined }}
                />
              </div>
            )
          })}
        </div>
        {/* The axis, ruled off from the plot. */}
        <div className="mt-[6px] flex shrink-0 gap-[6px] border-t border-lite-line pt-[5px] sm:gap-[10px]">
          {LOSS_YEARS.map(([year, , , claims]) => (
            <div key={year} className="flex flex-1 flex-col items-center gap-[2px]">
              <span className="font-sans text-[9.5px] tabular-nums leading-none text-muted sm:text-[10.5px]">
                &rsquo;{year}
              </span>
              <span className={`${S.micro} leading-none`}>{claims === 0 ? '—' : `${claims} clm`}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ── 03 · Build submission packages · a stack ────────────────── */

/**
 * A package is a set of things bound into one thing, so the panel is a stack:
 * sheets stepped back behind a spine, not a checklist. The step is what says
 * "several", the spine is what says "one".
 */
const PACKAGE: [string, string, string][] = [
  ['PDF', 'ACORD 125 · 126 · 140', '11 pp'],
  ['XLS', 'Statement of values', '4 loc'],
  ['PDF', 'Loss summary', '5 yr'],
  ['PDF', 'Expiring dec pages', '6 pp'],
  ['DOC', 'Account narrative', '1 p'],
]

export function PackagePanel() {
  return (
    <Shell
      label="Submission package"
      state="Assembled"
      footer={
        <>
          <span className={S.micro}>{ACCOUNT} · 27 pages</span>
          <span className={S.stamp}>Ready to send</span>
        </>
      }
    >
      <div className="relative flex flex-1 px-[14px] py-[10px] sm:px-[18px]">
        {/* The spine runs exactly as far as the stack does. Held at a fixed
            inset it hung past the sheets top and bottom and stopped reading as
            a binding. */}
        <span
          aria-hidden
          className="absolute inset-y-[10px] left-[15px] w-[2px] rounded-full bg-accent-orange sm:left-[19px]"
        />
        <div className="flex w-full flex-col justify-between gap-[4px] pl-[14px] sm:pl-[18px]">
          {PACKAGE.map(([kind, name, meta], i) => (
            <div
              key={name}
              className="flex items-center gap-[8px] rounded-[3px] border border-lite-line bg-cream-light px-[8px] py-[5px] shadow-[0_1px_0_rgba(29,26,23,.05)] sm:px-[10px] sm:py-[6px]"
              /* Each sheet steps in a little further than the one above it, so
                 the group reads as collated rather than as a list. */
              style={{ marginLeft: `${i * 7}px` }}
            >
              <span className="font-grotesk shrink-0 rounded-[2px] bg-lite-canvas px-[4px] py-[1px] text-[8px] tracking-[.06em] text-muted sm:text-[8.5px]">
                {kind}
              </span>
              <span className={`${S.body} min-w-0 flex-1 truncate`}>{name}</span>
              <span className={`${S.micro} shrink-0 tabular-nums`}>{meta}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ── 04 · Compare quotes · columns ───────────────────────────── */

/**
 * A comparison read across rows is a table; read down columns it is a
 * comparison. Premium leads because it is what gets looked at first, and the
 * middle column is marked not because it is cheapest but because the footnote
 * has something to say about what that price costs elsewhere.
 */
const MARKETS: [string, string, string, string, boolean][] = [
  ['Market A', '$18,400', '$2M / $4M', '$10,000', false],
  ['Market B', '$14,900', '$1M / $2M', '$25,000', true],
  ['Market C', '$21,150', '$2M / $4M', '$5,000', false],
]

export function QuotesPanel() {
  return (
    <Shell
      label="Quote comparison"
      state="Normalized"
      footer={<span className={S.micro}>Market B buys its lower premium with a higher deductible</span>}
    >
      <div className="grid flex-1 grid-cols-3 divide-x divide-lite-line">
        {MARKETS.map(([name, premium, limit, deductible, flagged]) => (
          <div
            key={name}
            className={`flex flex-col justify-between gap-[7px] px-[8px] py-[12px] sm:gap-[9px] sm:px-[12px] sm:py-[16px] ${
              flagged ? 'bg-accent-orange/[.06]' : ''
            }`}
          >
            <span className={`${S.label} truncate`}>{name}</span>
            <span
              className={`font-serif text-[19px] leading-none tabular-nums sm:text-[23px] ${
                flagged ? 'text-accent-orange' : 'text-dark-2'
              }`}
            >
              {premium}
            </span>
            <span className="flex flex-col gap-[4px] border-t border-lite-line pt-[7px]">
              <span className="flex items-baseline justify-between gap-[6px]">
                <span className={S.micro}>Limit</span>
                <span className={`${S.dim} tabular-nums`}>{limit}</span>
              </span>
              <span className="flex items-baseline justify-between gap-[6px]">
                <span className={S.micro}>Deduct.</span>
                <span className={`${S.dim} tabular-nums`}>{deductible}</span>
              </span>
            </span>
          </div>
        ))}
      </div>
    </Shell>
  )
}

/* ── 05 · Draft client proposals · a page ────────────────────── */

/**
 * What leaves the agency is a document with the agency's name on it, so this is
 * a page rather than a screen: a sheet inset on the canvas with a second one
 * behind it, a letterhead rule, the coverage lines, and the number the client
 * actually reads.
 */
const COVERAGES: [string, string][] = [
  ['Property', '$9,850'],
  ['General liability', '$5,400'],
  ['Commercial auto', '$2,180'],
  ['Umbrella', '$970'],
]

export function ProposalsPanel() {
  return (
    <Shell
      label="Client proposal"
      state="Drafted"
      footer={
        <>
          <span className={S.micro}>Agency template · 6 pages</span>
          <span className={S.stamp}>Ready to review</span>
        </>
      }
    >
      <div className="relative flex flex-1 items-center justify-center bg-lite-canvas/60 px-[16px] py-[12px]">
        {/* The page behind, just enough of it to say there is more than one. */}
        <span
          aria-hidden
          className="absolute h-[80%] w-[62%] translate-x-[10px] translate-y-[-6px] rounded-[2px] border border-lite-line bg-cream-light/70"
        />
        <div className="relative flex h-full w-[70%] min-w-0 flex-col rounded-[2px] border border-lite-line bg-cream-light px-[12px] py-[10px] shadow-[0_2px_10px_-4px_rgba(29,26,23,.25)] sm:px-[16px] sm:py-[12px]">
          <div className="flex items-baseline justify-between gap-[8px] border-b-2 border-dark-2 pb-[5px]">
            <span className="font-serif text-[11px] leading-none text-dark-2 sm:text-[13px]">
              Insurance proposal
            </span>
            <span className={S.micro}>2026 – 27</span>
          </div>
          <span className={`${S.micro} mt-[6px] truncate`}>Prepared for {ACCOUNT}</span>

          <div className="mt-[8px] flex flex-1 flex-col justify-evenly gap-[4px]">
            {COVERAGES.map(([line, amount]) => (
              <div key={line} className="flex items-baseline justify-between gap-[8px]">
                <span className={`${S.dim} min-w-0 truncate`}>{line}</span>
                <span aria-hidden className="h-px min-w-[8px] flex-1 bg-lite-line" />
                <span className={`${S.body} shrink-0 tabular-nums`}>{amount}</span>
              </div>
            ))}
          </div>

          <div className="mt-[6px] flex items-baseline justify-between gap-[8px] border-t border-dark-2/25 pt-[6px]">
            <span className={S.micro}>Annual premium</span>
            <span className="font-serif text-[13px] leading-none tabular-nums text-accent-orange sm:text-[15px]">
              $18,400
            </span>
          </div>
        </div>
      </div>
    </Shell>
  )
}

/* ── 06 · Service and renewal · a dated queue ────────────────── */

/**
 * Service work is not a document, it is a calendar. So this one is a run of
 * dates: what is already out, what is waiting, and the renewal the whole thing
 * is walking toward. The rule underneath is the year, and the marker is filled
 * for work that is done.
 */
const QUEUE: [string, string, 'done' | 'now' | 'next'][] = [
  ['12 May', 'Certificate issued · Northgate', 'done'],
  ['28 May', 'Additional insured endorsement', 'done'],
  ['09 Jun', 'Renewal exposures confirmed', 'now'],
  ['01 Jul', 'Renewal effective', 'next'],
]

export function ServicePanel() {
  return (
    <Shell
      label="Service and renewal"
      state="Prepared"
      footer={
        <>
          <span className={S.micro}>{ACCOUNT}</span>
          <span className={S.stamp}>2 open · 22 days out</span>
        </>
      }
    >
      <div className="flex flex-1 flex-col justify-between px-[14px] py-[12px] sm:px-[18px] sm:py-[16px]">
        {QUEUE.map(([date, task, state], i) => (
          <div key={task} className="flex items-stretch gap-[10px]">
            <span className={`${S.micro} w-[38px] shrink-0 pt-[7px] tabular-nums sm:w-[42px]`}>
              {date}
            </span>
            {/* Marker plus the rule that joins it to the next one. */}
            <span aria-hidden className="relative flex w-[9px] shrink-0 justify-center">
              {i < QUEUE.length - 1 && (
                <span className="absolute bottom-0 top-[14px] w-px bg-lite-line" />
              )}
              <span
                className={`mt-[8px] h-[7px] w-[7px] shrink-0 rounded-full border ${
                  state === 'done'
                    ? 'border-accent-orange bg-accent-orange'
                    : state === 'now'
                      ? 'border-accent-orange bg-cream-light'
                      : 'border-lite-line bg-cream-light'
                }`}
              />
            </span>
            <span className="flex min-w-0 flex-1 items-center justify-between gap-[8px] border-b border-lite-line/70 pb-[7px] pt-[4px] last:border-b-0">
              <span className={`${state === 'next' ? S.dim : S.body} min-w-0 truncate`}>{task}</span>
              {state === 'now' && <span className={`${S.stamp} shrink-0`}>In progress</span>}
            </span>
          </div>
        ))}
      </div>
    </Shell>
  )
}
