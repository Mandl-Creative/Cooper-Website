/* ──────────────────────────────────────────────────────────────
   Layout C — the report page, after Ramp's Business Spending Report.

   The third answer to the same question, and the one that argues least
   with the reader. A and B both withhold: A blurs the remainder behind
   a rail form, B cuts the page off and raises a panel. C withholds
   nothing but the paper itself. It gives the findings in full and in the
   open, and asks for an address only for the rest.

   The bet: a visitor who has read four real findings knows whether the
   paper is worth their address. A visitor with only blurred text is
   being asked to bet on writing they cannot read. The summary still
   trails off into blur, but by then it is a signal that there is more
   rather than the only thing on offer.

   The structure is Ramp's, near enough beat for beat:

     kicker      icon, "White Paper", a double slash, the edition
     headline    then a standfirst, then a rule
     findings    a labelled list, one specific icon per item
     summary     the public opening, trailing off into blur
     rail        the cover, standing in a lit scene
     gate        the panel from layout B, rising at the foot of the page

   The icons are the detail worth being careful about: each one has to
   mean its own line rather than decorate it, or the column turns into
   three identical bullets wearing different hats.
─────────────────────────────────────────────────────────────── */

import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  ArrowsLeftRight,
  FileText,
  Lightning,
  ListChecks,
  TrendUp,
  type Icon,
} from '@phosphor-icons/react'

/* One icon per finding, chosen to carry the sentence rather than sit beside it:
   work being done, a curve moving, a list to check against, two ends joined. */
const FINDINGS: { icon: Icon; lead: string; rest: string }[] = [
  {
    icon: Lightning,
    lead: 'AI has moved from chat assistants to completing essential work.',
    rest: ' Modern platforms complete submissions, fill ACORD forms and carrier supplements, drive live carrier portals and raters, compare quotes, and build proposals.',
  },
  {
    icon: TrendUp,
    lead: 'The adoption window favors agencies that move now.',
    rest: ' Adoption is wide but shallow. 68% of agencies plan to increase their AI use this year, yet only 8% have it embedded in daily workflows and 46% say they are not prepared to keep pace with technology.',
  },
  {
    icon: ListChecks,
    lead: 'Evaluate on seven criteria.',
    rest: ' End-to-end workflow coverage, measured accuracy, real portal and rater execution, security and data-use policies, integration with your systems, human oversight, and insurance-specific depth.',
  },
  {
    icon: ArrowsLeftRight,
    lead: 'End-to-end beats point solutions.',
    rest: ' Tools that automate one step leave the rest of the work where it was. Cooper covers the whole chain, intake, ACORD forms and carrier supplements, portal submission, quote comparison, proposals, and renewals, so an agency runs one platform instead of stitching several together.',
  },
]

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-[16px] font-serif text-[27px] leading-[1.18] text-dark text-balance">{children}</h2>
  )
}

/* ── The cover, standing in a lit scene rather than pasted flat on the page.
   The scene is two surfaces — a wall, and a floor meeting it in a line — with
   the cover's own shadow cast away from the light. All CSS, so it costs nothing
   and re-colours with the page.

   `compact` trims the scene's padding for the mobile placement, where the cover
   sits inline under the standfirst rather than filling a rail and does not need
   the same air around it. ── */
function CoverScene({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[16px] bg-gradient-to-b from-[#efe9dc] to-[#e7e0d1] ${
        compact ? 'px-[30px] pb-[30px] pt-[28px]' : 'px-[46px] pb-[46px] pt-[44px]'
      }`}
    >
      {/* The floor line, sitting behind the cover's lower third, which is what
          puts it in the room instead of in front of a backdrop. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-b from-[#f5f0e4] to-[#ebe4d5]"
      />
      {/* Compact caps the book's width and centres it, so the scene can fill the
          column's width while the cover itself does not grow taller with it. The
          spine overlays sit on this wrapper, so capping it keeps them on the
          book's own edge rather than the card's. */}
      <div className={`relative ${compact ? 'mx-auto max-w-[248px]' : ''}`}>
        <img
          src="/images/white-paper-cover.jpg"
          alt="The AI Advantage for Insurance Agents, a Cooper white paper"
          width={900}
          height={1244}
          className="block w-full rounded-l-[2px] rounded-r-[10px] shadow-[14px_26px_36px_-16px_rgba(30,26,21,0.42)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[8%] rounded-l-[2px] bg-gradient-to-r from-black/22 via-black/[0.05] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-black/25"
        />
      </div>
    </div>
  )
}

export default function WhitePaperReport({
  body,
  lockedSummary,
  mdComponents,
}: {
  /** The paper's markdown once unlocked, or null. */
  body: string | null
  /** The public opening plus its blurred tail, shown while locked. */
  lockedSummary: ReactNode
  mdComponents: Record<string, unknown>
}) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-[72px] pt-[104px] md:px-10 lg:px-[62px]">
      <div className="grid gap-[44px] lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-[64px]">
        {/* ─────────── the article ─────────── */}
        <div className="max-w-[720px]">
          <div className="flex animate-fade-blur-in items-center gap-[8px] font-sans text-[14px] text-dark/45">
            <FileText size={16} weight="regular" className="text-dark shrink-0" />
            <span className="font-medium text-dark">White Paper</span>
            <span aria-hidden>//</span>
            <span>July 2026</span>
          </div>

          <h1
            className="mt-[14px] animate-fade-blur-in font-serif text-[38px] leading-[1.1] tracking-[-1px] text-dark md:text-[50px]"
            style={{ animationDelay: '0.05s' }}
          >
            The AI Advantage for Insurance Agents
          </h1>
          <p
            className="mt-[18px] max-w-[560px] animate-fade-blur-in font-sans text-[17px] leading-[1.5] text-dark/55"
            style={{ animationDelay: '0.08s' }}
          >
            Why the moment to adopt is now, and how to evaluate tools that actually finish
            the job.
          </p>

          {/* Who the paper is for, stated rather than left to be inferred: the
              workflows below are the commercial submission chain, which is a
              brokerage's week rather than a personal-lines agent's. */}
          <p
            className="mt-[12px] max-w-[560px] animate-fade-blur-in font-sans text-[13px] italic leading-[1.5] text-dark/45 text-pretty"
            style={{ animationDelay: '0.09s' }}
          >
            Written for commercial P&amp;C agencies and brokerages running submissions from
            intake to renewal.
          </p>

          {/* The cover, on mobile only: right under the standfirst and at a
              smaller size, so it introduces the paper without taking up a whole
              screen at the foot of a long scroll. From lg up it lives in the
              sticky rail instead. */}
          <div
            className="mt-[28px] w-full animate-fade-blur-in lg:hidden"
            style={{ animationDelay: '0.1s' }}
          >
            <CoverScene compact />
          </div>

          <hr className="my-[36px] border-dark/[0.12]" />

          <p className="mb-[22px] font-sans text-[14.5px] font-medium text-dark">Key findings</p>
          <ul className="flex flex-col gap-[18px]">
            {FINDINGS.map(({ icon: Glyph, lead, rest }) => (
              <li key={lead} className="flex gap-[16px]">
                {/* Nudged to sit on the first line rather than above it. */}
                <Glyph size={19} weight="regular" className="mt-[3px] shrink-0 text-dark" />
                <p className="font-sans text-[15.5px] leading-[1.55] text-dark/70 text-pretty">
                  <span className="font-medium text-dark">{lead}</span>
                  {rest}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-[52px]">
            {/* The heading only while locked: the paper's own "## Executive
                summary" carries it once unlocked, and rendering both stacked
                two headings on top of each other. */}
            {!body && <SectionTitle>Executive summary</SectionTitle>}
            {/* While locked this is the public opening. Once the gate is passed
                the whole paper renders here instead, so the reader carries on
                down the page they were already reading rather than being sent
                somewhere new. */}
            {body ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {body}
              </ReactMarkdown>
            ) : (
              lockedSummary
            )}
          </div>

        </div>

        {/* ─────────── the rail ───────────

            The cover, and only the cover. The form that used to sit under it is
            now the panel that rises from the foot of the page — the same one
            layout B ends on. A form in the rail and a panel at the bottom would
            be two asks competing, and the panel is the one that arrives at the
            moment the reader has read enough to answer it.

            The cover stays after the gate is passed. It is the thing the reader
            just asked for, and having it vanish at the moment they get it reads
            as the page taking something away. ─── */}
        {/* Below lg the cover moves up under the standfirst (above), so the rail
            is desktop-only — otherwise it would render a second, full-size cover
            at the foot of the mobile scroll. */}
        <div className="hidden lg:sticky lg:top-[96px] lg:block">
          <CoverScene />
        </div>
      </div>
    </div>
  )
}
