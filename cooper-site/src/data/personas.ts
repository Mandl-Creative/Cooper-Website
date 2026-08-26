export interface Feature {
  title: string
  description: string
}

/** Optional two-audience split shown right under the hero (e.g. producers vs account managers). */
export interface RoleColumn {
  label: string
  title: string
  points: string[]
}

export interface TestimonialItem {
  quote: string
  author: string
  role: string
}

export interface Persona {
  slug: string
  name: string
  label: string
  headline: string
  /** Optional two-tier hero headline: lead line in ink, accent line in ocre. Falls back to `headline`. */
  headlineLead?: string
  headlineAccent?: string
  subtitle: string
  /** Optional two-audience split shown under the hero. */
  roleBalance?: RoleColumn[]
  /** Optional override for the closing demo band copy (falls back to the generic copy). */
  demoHeadline?: string
  demoSubtitle?: string
  features: Feature[]
  testimonialQuote: string
  testimonialAuthor: string
  testimonialRole: string
  /** Multiple testimonials for the per-persona editorial slider. */
  testimonials: TestimonialItem[]
  ctaText: string
}

export const personas: Persona[] = [
  {
    slug: 'retail-agencies',
    name: 'Retail Agencies',
    label: 'RETAIL AGENCIES',
    headline: 'The first quote back wins. Cooper makes it yours.',
    headlineLead: 'The first quote back wins.',
    headlineAccent: 'Cooper makes it yours.',
    subtitle:
      'Producers sell, account managers serve, Cooper does the rest. The submissions, carrier supplements, renewals, and certificates are handled end to end, so your team stays ahead of the book.',
    roleBalance: [
      {
        label: 'For producers',
        title: 'More time in front of clients',
        points: [
          'Walk into every meeting quote-ready',
          'Round-out and cross-sell openings surfaced',
          'Renewals prepped before the conversation',
        ],
      },
      {
        label: 'For account managers',
        title: 'The busywork, off your desk',
        points: [
          'No re-entry between AMS and carrier portals',
          'COIs and endorsements that check themselves',
          'Every renewal date tracked, nothing slips',
        ],
      },
    ],
    demoHeadline: 'Stop re-entering the same account ten times',
    demoSubtitle: 'See Cooper in action with your own data.',
    features: [
      {
        title: 'Stop re-entering the same data twice',
        description:
          'Cooper reads your dec pages, loss runs, and emails, then writes the details straight into Applied Epic, AMS360, HawkSoft, or whatever system you use, and into every carrier portal. You review instead of re-entering.',
      },
      {
        title: 'Walk into every meeting quote-ready',
        description:
          'Cooper builds submissions from what you already have on the account, spots coverage gaps worth a conversation, and fills each carrier\'s application automatically, so producers sell instead of prepping paperwork.',
      },
      {
        title: 'Never miss a renewal or a coverage change',
        description:
          'Cooper tracks every renewal date, reads the actual policy forms, and flags the sublimit or exclusion changes that matter. You get a plain-language comparison drafted and ready for your\u00a0client.',
      },
      {
        title: 'Certificates that check themselves',
        description:
          'Cooper verifies every COI and endorsement request against the bound policy before it goes out. Routine requests ship automatically. Only the real exceptions land on your desk.',
      },
    ],
    testimonialQuote:
      'We used to spend half the day re-entering data. Now our producers actually have time to sell.',
    testimonialAuthor: 'Agency Principal',
    testimonialRole: 'Regional P&C Agency',
    testimonials: [
      {
        quote: 'It has really opened the minds of our producers and a lot of our team who were previously very closed off to the idea of using AI.',
        author: '',
        role: 'Operations Director, Specialty Commercial Brokerage',
      },
      {
        quote: 'Cooper is literally a magic wand.',
        author: '',
        role: 'Claims Examiner, Boutique Claims TPA',
      },
      {
        quote: 'We now have the capacity to get submissions out same day. It used to be ‘we can’t do this today, we’ll get it out tomorrow morning.’ Now anything we get in a day, we can get out to market, which is huge.',
        author: '',
        role: 'Marketing Manager, Specialty Commercial Brokerage',
      },
      {
        quote: 'The coverage analysis is amazing, I absolutely love it. If we were to do that on our own, it would probably take five hours in itself.',
        author: '',
        role: 'Commercial Lines Account Manager, Independent Retail Agency',
      },
      {
        quote: 'I get a lot of documents from the producer, and now I can just forward them to Cooper instead of going into the system. I really like that a lot.',
        author: '',
        role: 'Account Manager, Independent Retail Agency',
      },
    ],
    ctaText: 'See how Cooper works for your agency',
  },
  {
    slug: 'wholesale-brokers',
    name: 'Wholesale Brokers',
    label: 'WHOLESALE BROKERS',
    headline: 'Every risk has an appetite. Cooper places it.',
    headlineLead: 'Every risk has an appetite.',
    headlineAccent: 'Cooper places it.',
    subtitle:
      'Cooper triages submissions, matches each risk to the markets most likely to write it, and drafts the submission. Your brokers place more business.',
    features: [
      {
        title: 'Know which submissions are worth your time',
        description:
          'Cooper reads every attachment, clears each risk against your book, and tells the retailer exactly what\'s missing. You see only complete, in-appetite submissions worth working.',
      },
      {
        title: 'Match risks to markets automatically',
        description:
          'Cooper learns from your carriers\' guidelines and your own quoting history, then points each risk at the markets most likely to write it competitively instantly with the reasoning shown.',
      },
      {
        title: 'Return quotes that win',
        description:
          'Cooper normalizes every carrier\'s quote into one clean comparison, drafts in your style, and gets them back to the retailer while the deal is still warm.',
      },
      {
        title: 'Placement and compliance, together',
        description:
          'Cooper issues the binder, files surplus-lines tax and stamping, and attaches the diligent-search affidavit, so placement and compliance happen in one step instead of two.',
      },
    ],
    testimonialQuote: '',
    testimonialAuthor: 'VP of Brokerage',
    testimonialRole: 'National Wholesale Broker',
    testimonials: [],
    ctaText: 'See how Cooper helps place risk',
  },
  {
    slug: 'mgas-insurers',
    name: 'MGA & Insurers',
    label: 'MGA & INSURERS',
    headline: 'Accuracy is your margin. Cooper protects it.',
    headlineLead: 'Accuracy is your margin.',
    headlineAccent: 'Cooper protects it.',
    subtitle:
      'Cooper prices to your rating logic, refers what\'s outside appetite with the reason attached, and keeps every program audit-ready, so a lean team covers more programs.',
    features: [
      {
        title: 'Underwrite by your guidelines, every time',
        description:
          'Cooper runs every submission against your underwriting guidelines, clears what\'s clean, and refers the rest with the reason attached, so the same standard applies on every account.',
      },
      {
        title: 'Price risks consistently at scale',
        description:
          'Cooper applies your rating logic the same way every time and benchmarks each account against similar risks, so pricing stays consistent no matter who is at the desk.',
      },
      {
        title: 'Catch leakage before the audit does',
        description:
          'Cooper checks that the right rates and forms were applied on every program and flags anything bound outside authority, so leakage surfaces with you, not with your carrier\'s audit.',
      },
      {
        title: 'Bordereaux that build themselves',
        description:
          'Cooper compiles each reporting period into the carrier\'s bordereaux format, reconciled against the bound policies, so the report goes out on time without the month-end scramble.',
      },
    ],
    testimonialQuote:
      'We doubled our program count without adding a single underwriter.',
    testimonialAuthor: 'Chief Underwriting Officer',
    testimonialRole: 'Specialty MGA',
    testimonials: [],
    ctaText: 'See how Cooper scales underwriting',
  },
  {
    slug: 'claims-tpas',
    name: 'Claims TPA',
    label: 'CLAIMS TPA',
    headline: 'Claims run on cycle time. Cooper keeps them moving.',
    headlineLead: 'Claims run on cycle time.',
    headlineAccent: 'Cooper keeps them moving.',
    subtitle:
      'Cooper handles intake, coverage checks, and reporting, so your adjusters resolve the files that need real judgment faster.',
    features: [
      {
        title: 'Every claim starts clean',
        description:
          'Cooper takes first notice of loss from phone, email, portal, or fax, matches it to the policy, and opens a structured claim file, acknowledged within SLA every time.',
      },
      {
        title: 'Coverage calls backed by the actual policy',
        description:
          'Cooper reads the specific policy against the facts of each loss, lays out limits, deductibles, and exclusions that apply, and shows the contract language, so adjusters make the right call,\u00a0fast.',
      },
      {
        title: 'Surface subrogation and recovery signals',
        description:
          'Cooper reads the file and flags possible subrogation, third-party involvement, and prior-loss patterns early, so recovery opportunities surface while they still matter. Cooper flags, the adjuster decides.',
      },
      {
        title: 'Reporting that\'s always ready',
        description:
          'Cooper keeps loss runs, large-loss reports, reserves, and diaries current, so the report a carrier or client asks for is ready on demand instead of cobbled together.',
      },
    ],
    testimonialQuote:
      'Our adjusters handle 40% more files and our SLA compliance has never been better.',
    testimonialAuthor: 'VP of Claims Operations',
    testimonialRole: 'National Claims TPA',
    testimonials: [],
    ctaText: 'See how Cooper helps adjust claims',
  },
  {
    slug: 'reinsurers',
    name: 'Reinsurers',
    label: 'REINSURERS',
    headline: 'Without wrangling a single bordereau, Cooper models your book.',
    headlineLead: 'Without wrangling a single bordereau,',
    headlineAccent: 'Cooper models your book.',
    subtitle:
      'Cooper cleans cedent data, tracks accumulation, enforces treaty terms, and assembles renewal files, so your team focuses on pricing and relationships.',
    features: [
      {
        title: 'Clean cedent data from day one',
        description:
          'Cooper maps every cedent\'s bordereaux into your standard schema, flags the gaps, and hands back a usable file, so you start on clean data instead of spending days fixing spreadsheets.',
      },
      {
        title: 'See concentration before it\'s a problem',
        description:
          'Cooper tracks accumulation by peril and region across the whole portfolio and alerts you when exposure crosses tolerance, so concentration is something you see coming, not something you discover after an event.',
      },
      {
        title: 'Hold cedents to the terms you negotiated',
        description:
          'Cooper checks ceded claims against the treaty wording, the event definition and hours clause, and flags anything ceded off-contract, so the terms you negotiated are the terms that get\u00a0applied.',
      },
      {
        title: 'Renewal season on prepared files',
        description:
          'Cooper assembles experience and exposure history for each renewing treaty, lines it up with your modeled output, and drafts the pricing view, so the season runs on prepared files, not\u00a0scrambles.',
      },
    ],
    testimonialQuote:
      'Renewal season used to mean three weeks of spreadsheet hell. Now we walk in prepared.',
    testimonialAuthor: 'Treaty Underwriter',
    testimonialRole: 'Global Reinsurer',
    testimonials: [],
    ctaText: 'See how Cooper prepares your renewals',
  },
]

export function getPersonaBySlug(slug: string): Persona | undefined {
  return personas.find((p) => p.slug === slug)
}

/**
 * Every real customer quote the site holds, pooled into one list.
 *
 * They are stored per persona because that is where they were collected, and
 * only retail-agencies carries any today. Pooling them here keeps that an
 * implementation detail: a quote added to any persona shows up everywhere the
 * slider runs, and the persona pages and Cooper Lite cannot drift apart into
 * two hand-maintained copies of the same five sentences.
 */
export const allTestimonials: TestimonialItem[] = personas.flatMap((p) => p.testimonials)
