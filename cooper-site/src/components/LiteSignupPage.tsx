/* ──────────────────────────────────────────────────────────────
   Create your Cooper Lite account — step one.

   ⚠ This route is a design proposal, not a working signup.

   The real signup ships from the product app and takes a card in step two,
   and it is the only one that can create an account. So this page validates,
   and then says plainly that it cannot go further and sends the reader to the
   real one. It is noindex, it is not in the sitemap, and nothing on the site
   links to it — every "Get started" on /lite and /lite/compare still points at
   www.askcooper.ai/lite/signup. It exists so the layout, the field set and the
   copy can be reviewed on a preview before engineering ports them.

   What the brief changed from the live page:

   - The `$499 → $99` promo strip across the top is gone. The price already
     appears in the summary panel, twice over with the old price beside it.
   - The ochre "You save $400 every month" band is gone with it. It was the
     largest field of colour on a checkout screen and it restated the two
     numbers directly above it. What it was doing, reassuring the buyer, is
     done by the guarantee and the two assurances at the foot of the panel.
   - The footer is the slim one. A checkout page is the one place on the site
     where a footer full of ways to leave works against the page.
─────────────────────────────────────────────────────────────── */

import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { ArrowRight, ArrowUpRight, CaretDown, Check } from '@phosphor-icons/react'
import { CooperLiteLockup, LiteFooter, SIGNUP_URL } from './lite/chrome'
import { useSeo } from '../lib/useSeo'

/* ── Field data ──────────────────────────────────────────────── */

/* Ordered by how often an agency picks them, not alphabetically: the four
   markets Cooper actually sells into sit at the top. */
const CALLING_CODES: [string, string, string][] = [
  ['US', '🇺🇸', '+1'],
  ['CA', '🇨🇦', '+1'],
  ['GB', '🇬🇧', '+44'],
  ['AU', '🇦🇺', '+61'],
]

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
]

const HEARD_FROM = [
  'A search engine',
  'A colleague or another agency',
  'LinkedIn',
  'An industry event or association',
  'A carrier or wholesaler',
  'An email from Cooper',
  'Somewhere else',
]

const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com',
  'proton.me', 'pm.me', 'zoho.com', 'yandex.com', 'yandex.ru',
  'mail.com', 'gmx.com', 'gmx.net', 'inbox.com',
])

function isWorkEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  return !PERSONAL_EMAIL_DOMAINS.has(domain)
}

/* ── Field furniture ─────────────────────────────────────────── */

/* One border, one radius, one focus colour for every control on the page,
   including the two that are not <input>s. Kept in one string because a
   checkout form is where a 1px difference between two fields is visible. */
const CONTROL =
  'w-full rounded-[6px] border bg-cream-light px-[14px] py-[12px] text-[16px] text-dark-2 outline-none transition-colors placeholder:text-muted/55 md:text-[15px]'
const CONTROL_IDLE = 'border-lite-line focus:border-accent-orange'
const CONTROL_ERROR = 'border-accent-red'

function Field({
  id,
  label,
  optional = false,
  error,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-[7px] block text-[13.5px] font-medium text-dark-2">
        {label}
        {optional && <span className="ml-[6px] font-normal text-muted/70">optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-[6px] text-[12.5px] text-accent-red">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * A filtering select. Fifty states in a native menu is a long scroll, and the
 * live page filters, so this does too: the closed control is a text input, it
 * narrows the list as you type, and it is driven from the keyboard.
 *
 * The value is only ever one of `options` — typing something the list does not
 * contain leaves the field empty rather than accepting free text, which is the
 * whole reason for a select.
 */
function SearchSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
  invalid,
}: {
  id: string
  options: string[]
  value: string
  onChange: (v: string) => void
  placeholder: string
  invalid?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)
  const listId = `${id}-list`

  // While the menu is shut the input shows the chosen value; while it is open
  // it shows what has been typed, so the filter is visible as it is typed.
  const shown = open ? query : value
  const matches = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  function commit(option: string) {
    onChange(option)
    setQuery('')
    setOpen(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') return setOpen(false)
    if (e.key === 'Tab') return setOpen(false)
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      e.preventDefault()
      setOpen(true)
      setActive(0)
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (matches[active]) commit(matches[active])
    }
  }

  return (
    <div ref={wrap} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? `${id}-opt-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-err` : undefined}
        value={shown}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={`${CONTROL} pr-[38px] ${invalid ? CONTROL_ERROR : CONTROL_IDLE}`}
      />
      <CaretDown
        size={14}
        aria-hidden
        className={`pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-muted transition-transform duration-200 ${
          open ? 'rotate-180' : ''
        }`}
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-[228px] overflow-y-auto rounded-[6px] border border-lite-line bg-cream-light py-[4px] shadow-[0_18px_40px_-18px_rgba(29,26,23,.35)]"
        >
          {matches.length === 0 && (
            <li className="px-[14px] py-[10px] text-[14px] text-muted">No matches</li>
          )}
          {matches.map((option, i) => (
            <li
              key={option}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={option === value}
              // onMouseDown, not onClick: the input's blur would close the menu
              // out from under the pointer before a click ever landed.
              onMouseDown={(e) => {
                e.preventDefault()
                commit(option)
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-[14px] py-[9px] text-[14.5px] ${
                i === active ? 'bg-lite-surface text-dark-2' : 'text-dark-2'
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── Header ──────────────────────────────────────────────────── */

/* Checkout gets its own header rather than the site nav. Every link in the nav
   is a way out of a form the reader has started filling in; what belongs here
   is where they are and how much is left. It sticks and carries the same rule
   the nav does, so the step count stays with the reader down a long form. */
function SignupHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-lite-canvas px-[20px] py-[16px] shadow-[0_1px_0_var(--color-lite-line)] md:px-[40px] md:py-[20px]">
      <Link to="/lite">
        <CooperLiteLockup />
      </Link>

      {/* Two numbered steps and their labels do not fit beside the lockup on a
          phone, so narrow screens get the count and wide screens get the
          stepper. */}
      <p className="text-[13px] text-muted md:hidden">
        Step <span className="font-medium text-dark-2">1</span> of 2
      </p>

      <ol className="hidden items-center text-[13px] md:flex md:gap-[16px]">
        {[
          ['1', 'Your details'],
          ['2', 'Payment'],
        ].map(([n, label], i) => (
          <li key={label} className="flex items-center gap-[16px]">
            {i > 0 && <span aria-hidden className="h-px w-[28px] bg-lite-line" />}
            <span className="flex items-center gap-[9px]">
              <span
                className={`flex h-[20px] w-[20px] items-center justify-center rounded-full text-[11px] font-medium ${
                  i === 0
                    ? 'bg-accent-orange text-white'
                    : 'border border-lite-line text-muted'
                }`}
              >
                {n}
              </span>
              <span className={i === 0 ? 'font-medium text-dark-2' : 'text-muted'}>{label}</span>
            </span>
          </li>
        ))}
      </ol>
    </header>
  )
}

/* ── Plan summary ────────────────────────────────────────────── */

const SUMMARY_ROWS: [string, string][] = [
  ['Users', 'Up to 5 users'],
  ['Monthly usage', 'Limited'],
  ['Due today', '$99'],
]

const ASSURANCES = ['No setup fee', 'Month-to-month']

function PlanSummary() {
  return (
    <aside
      aria-label="Cooper Lite plan summary"
      className="border border-lite-line bg-cream-light px-[24px] py-[28px] lg:px-[30px]"
    >
      <p className="font-grotesk text-[10px] uppercase tracking-[.15em] text-accent-orange">
        Cooper Lite
      </p>

      <p className="mt-[16px] flex items-baseline font-serif font-normal leading-[.9] tracking-[-.03em] text-dark-2">
        <span className="text-[26px]">$</span>
        <span className="text-[52px]">99</span>
        <span className="ml-[10px] font-sans text-[15px] font-normal tracking-normal text-muted">
          /month
        </span>
      </p>

      <p className="mt-[14px] flex flex-wrap items-center gap-x-[12px] gap-y-[4px]">
        <span className="text-[14px] text-muted/70 line-through">$499/month</span>
        <span className="font-grotesk text-[10px] uppercase tracking-[.15em] text-accent-orange">
          Introductory pricing
        </span>
      </p>

      <p className="mt-[18px] text-[14px] leading-[1.6] text-muted">
        Self-serve for commercial insurance agencies with up to 5 users.
      </p>

      <dl className="mt-[24px] border-t border-lite-line">
        {SUMMARY_ROWS.map(([term, value], i) => (
          <div
            key={term}
            className="flex items-baseline justify-between gap-[16px] border-b border-lite-line py-[13px] text-[14px]"
          >
            <dt className="text-muted">{term}</dt>
            <dd
              className={
                i === SUMMARY_ROWS.length - 1 ? 'font-semibold text-dark-2' : 'text-dark-2'
              }
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-[20px] text-[13.5px] leading-[1.55] text-muted">
        <strong className="font-semibold text-dark-2">7-day money-back guarantee.</strong> Start
        with your next submission. If it’s not right, we’ll refund you.
      </p>

      <ul className="mt-[20px] flex flex-wrap gap-x-[22px] gap-y-[8px] border-t border-lite-line pt-[18px] text-[13.5px] text-muted">
        {ASSURANCES.map((a) => (
          <li key={a} className="flex items-center gap-[8px]">
            <Check size={13} weight="bold" className="text-accent-orange" aria-hidden />
            {a}
          </li>
        ))}
      </ul>
    </aside>
  )
}

/* ── Form ────────────────────────────────────────────────────── */

type Errors = Partial<Record<'name' | 'email' | 'agency' | 'phone' | 'state', string>>

function SignupForm() {
  const uid = useId()
  const id = (field: string) => `${uid}-${field}`

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agency, setAgency] = useState('')
  const [country, setCountry] = useState('US')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState('')
  const [heard, setHeard] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [handedOff, setHandedOff] = useState(false)

  const dial = CALLING_CODES.find(([code]) => code === country)

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = 'Please enter your name.'
    if (!email.trim()) next.email = 'Please enter your work email.'
    else if (!isWorkEmail(email)) next.email = 'Please use your work email address.'
    if (!agency.trim()) next.agency = 'Please enter your agency name.'
    if (!phone.trim()) next.phone = 'Please enter a mobile number.'
    else if (!isValidPhoneNumber(phone, country as 'US')) {
      next.phone = 'Please enter a valid mobile number.'
    }
    if (!state) next.state = 'Please choose your headquarters state.'
    return next
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      // Move the reader to the first thing that needs fixing rather than
      // leaving them at the button with the errors above the fold.
      const first = (['name', 'email', 'agency', 'phone', 'state'] as const).find((k) => next[k])
      if (first) document.getElementById(id(first))?.focus()
      return
    }
    setHandedOff(true)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-x-[20px] gap-y-[18px] sm:grid-cols-2">
        <Field id={id('name')} label="Full name" error={errors.name}>
          <input
            id={id('name')}
            type="text"
            autoComplete="name"
            placeholder="Jane Whitfield"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id('name')}-err` : undefined}
            className={`${CONTROL} ${errors.name ? CONTROL_ERROR : CONTROL_IDLE}`}
          />
        </Field>

        <Field id={id('email')} label="Work email" error={errors.email}>
          <input
            id={id('email')}
            type="email"
            autoComplete="email"
            placeholder="jane@youragency.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${id('email')}-err` : undefined}
            className={`${CONTROL} ${errors.email ? CONTROL_ERROR : CONTROL_IDLE}`}
          />
        </Field>

        <Field id={id('agency')} label="Agency name" error={errors.agency}>
          <input
            id={id('agency')}
            type="text"
            autoComplete="organization"
            placeholder="Whitfield Insurance Group"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            aria-invalid={Boolean(errors.agency)}
            aria-describedby={errors.agency ? `${id('agency')}-err` : undefined}
            className={`${CONTROL} ${errors.agency ? CONTROL_ERROR : CONTROL_IDLE}`}
          />
        </Field>

        <Field id={id('phone')} label="Mobile phone" error={errors.phone}>
          <div className="flex gap-[8px]">
            <div className="relative shrink-0">
              <select
                aria-label="Country calling code"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`${CONTROL} ${CONTROL_IDLE} w-[104px] appearance-none pr-[30px]`}
              >
                {CALLING_CODES.map(([code, flag, dialCode]) => (
                  <option key={code} value={code}>
                    {flag} {dialCode}
                  </option>
                ))}
              </select>
              <CaretDown
                size={13}
                aria-hidden
                className="pointer-events-none absolute right-[11px] top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
            <input
              id={id('phone')}
              type="tel"
              autoComplete="tel-national"
              placeholder="(555) 018-2245"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${id('phone')}-err` : undefined}
              className={`${CONTROL} ${errors.phone ? CONTROL_ERROR : CONTROL_IDLE}`}
            />
          </div>
          {dial && <span className="sr-only">Calling code {dial[2]}</span>}
        </Field>

        <Field id={id('state')} label="Headquarters state" error={errors.state}>
          <SearchSelect
            id={id('state')}
            options={STATES}
            value={state}
            onChange={setState}
            placeholder="Search for a state"
            invalid={Boolean(errors.state)}
          />
        </Field>

        <Field id={id('heard')} label="How did you hear about us?" optional>
          <SearchSelect
            id={id('heard')}
            options={HEARD_FROM}
            value={heard}
            onChange={setHeard}
            placeholder="Select"
          />
        </Field>
      </div>

      {handedOff ? (
        /* The one thing this route cannot do. Saying so here, in the place the
           button was, is the only honest end to a form on a preview. */
        <div
          role="status"
          className="mt-[26px] border border-accent-orange/35 bg-lite-surface px-[20px] py-[20px]"
        >
          <p className="text-[14.5px] font-semibold text-dark-2">
            This is a design preview, so it stops here.
          </p>
          <p className="mt-[8px] text-[14px] leading-[1.6] text-muted">
            Your details look good. Accounts and payment are handled in the Cooper app, so finish
            signing up there.
          </p>
          <a
            href={SIGNUP_URL}
            className="mt-[16px] inline-flex items-center gap-[10px] rounded-[6px] bg-accent-orange px-[24px] py-[13px] text-[15px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep"
          >
            Continue on askcooper.ai <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>
      ) : (
        <button
          type="submit"
          className="mt-[26px] flex w-full items-center justify-center gap-[10px] rounded-[6px] bg-accent-orange px-[28px] py-[15px] text-[15.5px] font-medium text-white transition-colors duration-200 hover:bg-accent-orange-deep"
        >
          Continue to payment <ArrowRight size={16} weight="bold" />
        </button>
      )}

      <p className="mt-[14px] text-center text-[12.5px] leading-[1.5] text-muted">
        By continuing you agree to our{' '}
        <Link to="/terms" className="underline decoration-lite-line underline-offset-[4px]">
          Terms
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="underline decoration-lite-line underline-offset-[4px]">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}

/* ── Page ────────────────────────────────────────────────────── */

export default function LiteSignupPage() {
  useSeo({
    title: 'Create your Cooper Lite account',
    description:
      'Create your Cooper Lite account. A few details about your agency, then payment. $99/month introductory pricing for commercial agencies with up to 5 users.',
    // No canonical: the page that should rank for this is the real signup in
    // the product app, and this one is a proposal for it.
    noindex: true,
  })

  return (
    <div className="flex min-h-screen flex-col bg-lite-canvas">
      <SignupHeader />

      <main className="flex-1 px-[24px] py-[48px] md:px-[40px] lg:px-[62px] lg:py-[64px]">
        {/* The summary leads on a phone: what it costs and what is included is
            what the reader is deciding on, and six fields above it would push
            it under the fold. On a wide screen it sits alongside, where it
            stays in view for the whole form. */}
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-[36px] lg:grid-cols-[1fr_minmax(300px,378px)] lg:gap-[56px]">
          <div className="order-2 lg:order-1">
            <h1 className="max-w-[16ch] font-serif text-[clamp(30px,4.4vw,42px)] font-normal leading-[1.1] tracking-[-.02em] text-dark-2">
              Create your Cooper Lite account.
            </h1>
            <p className="mt-[12px] mb-[30px] text-[15.5px] leading-[1.6] text-muted">
              A few details about your agency, then payment.
            </p>
            <SignupForm />
          </div>

          <div className="order-1 lg:order-2">
            <PlanSummary />
          </div>
        </div>
      </main>

      <LiteFooter slim />
    </div>
  )
}
