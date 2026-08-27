/* ──────────────────────────────────────────────────────────────
   The furniture every Cooper Lite page shares: the lockup, the nav and
   the footer.

   These started inside LitePage. Once /lite/compare and /lite/signup
   existed there were three places for one nav and one footer to drift, so
   they moved here. The pages own their content; this file owns the frame.
─────────────────────────────────────────────────────────────── */

import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'

/* Signup and the workspace ship from the product app. The signup route in
   this repo is a design proposal for that page, so every CTA keeps pointing
   at the real one. */
export const SIGNUP_URL = 'https://www.askcooper.ai/lite/signup'
export const LOGIN_URL = 'https://workspace.askcooper.ai/sign-in'
export const DEMO_PATH = '/demo'

/* The plan comparison is the one page of the three that is pure marketing,
   so it is routed here and linked internally. */
export const COMPARE_PATH = '/lite/compare'

/* The nav stays on screen, so anchors have to clear it. Measured, it renders
   71px on a phone and 83 to 86 from `md` up; 84 and 100 clear it at every
   width with a little air rather than stopping flush against it. */
export const ANCHOR_OFFSET = 'scroll-mt-[84px] md:scroll-mt-[100px]'

/* ── Cooper Lite lockup ──────────────────────────────────────── */

/**
 * Wordmark plus the LITE badge, the same lockup the nav carries. Shared so the
 * two never drift; the caller sizes it, since it appears both at nav scale and
 * inline inside a 13px pill.
 */
export function CooperLiteLockup({
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

const NAV_SECTIONS: [string, string][] = [
  ['How it works', '#how'],
  ['What Cooper does', '#work'],
  ['Pricing', '#pricing'],
]

/**
 * The nav follows the page down. It has to: the three links in it are the only
 * way back up a page this long, and `Get started` is the thing the page exists
 * to offer, so parking it above the fold and letting it scroll away means the
 * reader who is finally convinced, four sections in, has to scroll back to act.
 *
 * `sticky` and not `fixed`, unlike the enterprise navbar, because these pages
 * are plain columns: sticky keeps the nav in flow, so the hero starts
 * underneath it without anything having to be padded down by hand.
 *
 * The rule underneath used to appear only once the page had moved, on the
 * reasoning that a line at rest draws a box around nothing. It reads as a
 * missing edge instead, so it is always there now. It is a shadow rather than
 * a border so it costs no height, which matters: the hero is sized against the
 * nav with a `calc`.
 *
 * `onHome` is what the section links resolve against. On /lite they are plain
 * anchors; anywhere else the same labels have to carry the reader back to
 * /lite first, or they point at ids that are not on the page.
 */
export function LiteNav({ onHome = false }: { onHome?: boolean }) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-cream-light px-[20px] py-[16px] shadow-[0_1px_0_var(--color-lite-line)] md:px-[40px] md:py-[22px]">
      <Link to="/lite">
        <CooperLiteLockup />
      </Link>

      <div className="flex items-center gap-[10px] md:gap-[30px]">
        {NAV_SECTIONS.map(([label, hash]) =>
          onHome ? (
            <a
              key={label}
              href={hash}
              className="hidden md:inline text-[14px] text-dark-2/85 hover:text-dark-2"
            >
              {label}
            </a>
          ) : (
            <Link
              key={label}
              to={`/lite${hash}`}
              className="hidden md:inline text-[14px] text-dark-2/85 hover:text-dark-2"
            >
              {label}
            </Link>
          ),
        )}
        <a
          href={LOGIN_URL}
          className="whitespace-nowrap text-[14px] text-dark-2 border border-lite-line rounded-[4px] px-[12px] py-[8px] md:px-[16px]"
        >
          Log in
        </a>
        <a
          href={SIGNUP_URL}
          className="inline-flex items-center gap-[8px] whitespace-nowrap text-[14px] text-cream-light bg-dark-2 rounded-[4px] px-[13px] py-[9px] md:px-[17px]"
        >
          Get started <ArrowRight size={14} weight="bold" />
        </a>
      </div>
    </nav>
  )
}

/* ── Section furniture ───────────────────────────────────────── */

export function SectionHead({
  eyebrow,
  title,
  lead,
  dark = false,
}: {
  eyebrow: string
  title: string
  lead?: string
  dark?: boolean
}) {
  return (
    <div className="mb-[44px]">
      <p className="font-grotesk text-[11px] uppercase tracking-[.16em] mb-[14px] text-accent-orange">
        {eyebrow}
      </p>
      <h2
        className={`font-serif font-normal text-[clamp(30px,4.4vw,44px)] leading-[1.12] tracking-[-.015em] max-w-[18ch] ${
          dark ? 'text-cream-light' : 'text-dark-2'
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-[18px] max-w-[62ch] text-[16px] leading-[1.6] ${
            dark ? 'text-cream-light/70' : 'text-muted'
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  )
}

/* ── Footer ──────────────────────────────────────────────────── */

/* Everything here already exists in this repo. The live Lite footer links two
   of these six legal documents, which is thin for a page that takes a card. */
const footerColumns = (onHome: boolean) => [
  {
    label: 'Cooper Lite',
    links: [
      ['How it works', onHome ? '#how' : '/lite#how'],
      ['What Cooper does', onHome ? '#work' : '/lite#work'],
      ['Pricing', onHome ? '#pricing' : '/lite#pricing'],
      ['Questions', onHome ? '#faq' : '/lite#faq'],
      ['Compare Lite and Cooper', COMPARE_PATH],
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
  // Internal routes go through the router; the workspace lives outside this
  // site and has to leave it. A bare hash is an anchor on the current page,
  // which the router would treat as a route change.
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

function CookieButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.Cookiebot?.renew()}
      className={`text-left transition-colors duration-200 hover:text-cream-light/80 ${className}`}
    >
      Manage Cookies
    </button>
  )
}

/**
 * The dark foot of every Lite page.
 *
 * `slim` drops the three link columns. Checkout is the one page where a footer
 * full of ways to leave is working against the page, so signup gets the
 * lockup, the copyright and the two documents it has to link, and nothing
 * else.
 *
 * The band sits directly under a dark closing section on /lite and
 * /lite/compare, so its own top padding is the gap between the two; `pt` lets
 * a page with no closing block open the space itself.
 */
export function LiteFooter({
  onHome = false,
  slim = false,
  pt = 'pt-[80px]',
}: {
  onHome?: boolean
  slim?: boolean
  pt?: string
}) {
  return (
    <footer
      className={`bg-dark-2 px-[24px] text-cream-light md:px-[40px] lg:px-[62px] ${slim ? 'pt-[34px]' : pt}`}
    >
      {!slim && (
        <div className="grid grid-cols-1 gap-[36px] border-t border-cream-light/12 pt-[46px] sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,auto))] lg:gap-[64px]">
          <div>
            <CooperLiteLockup onDark logo="h-[19px]" badge="text-[9px] px-[6px] py-[2px]" />
          </div>
          {footerColumns(onHome).map((col) => (
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
      )}

      <div
        className={`flex flex-col gap-[10px] py-[26px] text-[13px] text-cream-light/45 sm:flex-row sm:items-center sm:justify-between ${
          slim ? '' : 'mt-[46px] border-t border-cream-light/12'
        }`}
      >
        {slim ? (
          <>
            <CooperLiteLockup onDark logo="h-[17px]" badge="text-[8px] px-[5px] py-[2px]" />
            <div className="flex flex-wrap items-center gap-x-[22px] gap-y-[8px]">
              <span>© 2026 Cooper. All rights reserved.</span>
              <CookieButton />
              <FooterLink label="Privacy" href="/privacy" />
              <FooterLink label="Terms" href="/terms" />
            </div>
          </>
        ) : (
          <>
            <span>© 2026 Cooper. All rights reserved.</span>
            <CookieButton className="sm:text-right" />
          </>
        )}
      </div>
    </footer>
  )
}
