import { Link } from 'react-router-dom'
import CooperLogo from '../CooperLogo'
import { OFFER_BAR } from './plans'

/* The chrome the comparison page wears, ported from the product app. Only the
   two pieces that page uses are here; the Lite nav and the signup topbar stay
   in the product app, where the funnel lives. */

/* `linked` is off inside the funnel: the form only persists on submit, so a
   buyer who clicks See pricing mid-form loses everything typed. */
export function LiteAnnounce({ linked = true }: { linked?: boolean }) {
  return (
    <div className="bg-accent-orange-deep text-cream-light px-[20px] py-[10px] text-center">
      <p className="font-sans text-[13px] leading-[1.4] m-0">
        <strong className="font-medium">{OFFER_BAR.product}</strong> ·{' '}
        <s className="opacity-70 mr-[6px]">{OFFER_BAR.was}</s>
        <strong className="font-medium">{OFFER_BAR.now}</strong> · {OFFER_BAR.note}
        {linked && (
          <Link
            to="/lite#pricing"
            className="underline underline-offset-[3px] font-medium ml-[10px]"
          >
            {OFFER_BAR.link}
          </Link>
        )}
      </p>
    </div>
  )
}

/**
 * The product lockup the plan cards wear instead of a text eyebrow: the
 * wordmark, plus the LITE badge for the self-serve tier. LitePage carries its
 * own copy of this lockup at nav scale; keep the two in step.
 */
export function PlanLockup({
  lite = false,
  onDark = false,
}: {
  lite?: boolean
  onDark?: boolean
}) {
  return (
    <span className="flex items-center gap-[10px]">
      {/* The mark ships black, so the dark card knocks it out to cream. */}
      <img
        src="/images/cooper-logo-full.svg"
        alt="Cooper"
        width={154}
        height={36}
        className={`h-[22px] w-auto ${onDark ? 'brightness-0 invert' : 'brightness-0'}`}
      />
      {lite && (
        <span className="font-grotesk uppercase tracking-[.14em] text-accent-orange border border-accent-orange/35 rounded-[3px] text-[10px] px-[7px] py-[3px]">
          Lite
        </span>
      )}
    </span>
  )
}

export function LiteFooter() {
  return (
    <footer className="bg-dark-2 text-cream-light/60 px-5 md:px-10 lg:px-[62px]">
      <div className="max-w-[1360px] mx-auto min-h-[82px] py-[24px] md:py-0 flex items-start md:items-center gap-[14px] md:gap-[26px] flex-col md:flex-row font-sans text-[12px]">
        <Link to="/lite" aria-label="Cooper home">
          <CooperLogo />
        </Link>
        {/* Literal: the page is prerendered, so new Date() would mismatch on
            hydration across a year boundary. */}
        <span>© 2026 Cooper. All rights reserved.</span>
        <div className="md:ml-auto flex gap-[22px]">
          <button
            type="button"
            onClick={() => window.Cookiebot?.renew()}
            className="cursor-pointer hover:text-cream-light transition-colors"
          >
            Manage Cookies
          </button>
          <Link to="/privacy" className="hover:text-cream-light transition-colors">
            Privacy
          </Link>
          {/* The product app points this at /lite/terms, the Lite-specific
              terms that ship with the funnel. That page is not in this repo,
              so it resolves to the site's Terms of Service instead. */}
          <Link to="/terms" className="hover:text-cream-light transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
