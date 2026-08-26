import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { personas, getPersonaBySlug, allTestimonials } from '../data/personas'
import type { Feature } from '../data/personas'
import { getHeroImage, getFeatureImages, getStatsBand } from '../data/personaMedia'
import { vignettes } from './persona/vignettes'
import Navbar from './Navbar'
import PersonaTestimonial from './PersonaTestimonial'
import StableWidth from './StableWidth'
import Footer from './Footer'
import { useSeo } from '../lib/useSeo'
import { personaJsonLd } from '../lib/personaSchema'

function RevealOnScroll({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('revealed'), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="reveal-section" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* Count-up stat — animates the leading number from 0 when scrolled into view */
function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d[\d,]*)(.*)$/)
  const target = match ? parseInt(match[1].replace(/,/g, ''), 10) : 0
  const suffix = match ? match[2] : value
  const hasComma = match ? match[1].includes(',') : false
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !match) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // One frame later, not synchronously in the effect body — jumps straight
      // to the final value with no count-up animation.
      const raf = requestAnimationFrame(() => setDisplay(target))
      return () => cancelAnimationFrame(raf)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2600
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setDisplay(Math.round(eased * target))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, match])

  if (!match) return <span>{value}</span>
  const format = (n: number) => (hasComma ? n.toLocaleString('en-US') : String(n))
  // The band is right-anchored and sized by its content, so without a reserved
  // width the counting number drags the whole row sideways while it runs.
  return (
    <StableWidth ref={ref} final={`${format(target)}${suffix}`}>
      {format(display)}
      {suffix}
    </StableWidth>
  )
}

/* Feature row — text + full-bleed photo, alternating sides (Figma "Aqui C") */
function FeatureBlock({
  feature,
  index,
  image,
  vignette,
}: {
  feature: Feature
  index: number
  image: string
  vignette?: ReactNode
}) {
  const isReversed = index % 2 === 1

  const text = (
    <div className={isReversed ? 'lg:pl-[40px]' : 'lg:pr-[40px]'}>
      <h3 className="font-serif text-[36px] lg:text-[38px] leading-[1.1] tracking-[-0.4px] text-[#0a0a0a] mb-[24px]">
        {feature.title}
      </h3>
      <p className="font-sans text-[17.8px] leading-[1.5] text-[#6b6b6b] max-w-[440px]">
        {feature.description}
      </p>
    </div>
  )

  const photo = (
    // The box itself is the flex container that centers the vignette. On mobile
    // it uses min-h, so the card is vertically centered AND the box grows to fit
    // a taller card instead of clipping it; from sm up the height is fixed to the
    // original design values. The image/gradient are absolute so they full-bleed.
    <div className="relative flex items-center justify-center overflow-hidden bg-[#fbfbf9] min-h-[400px] sm:h-[460px] lg:h-[540px]">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: 'blur(3px)', transform: 'scale(1.04)' }}
      />
      {vignette && <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-black/10" />}
      {vignette && (
        <div className="relative z-10 flex w-full justify-center p-[20px]">
          <div className="w-full max-w-[460px]">{vignette}</div>
        </div>
      )}
    </div>
  )

  return (
    <RevealOnScroll delay={index * 80}>
      <div
        className={`grid grid-cols-1 items-start gap-[40px] lg:gap-[24px] ${
          isReversed ? 'lg:grid-cols-[minmax(0,1fr)_460px]' : 'lg:grid-cols-[460px_minmax(0,1fr)]'
        }`}
      >
        {/* DOM order is always text → image, so on mobile (single column) the
            image sits below the title + description every time. On lg the
            reversed rows swap sides via `order`, keeping the alternating layout. */}
        <div className={isReversed ? 'lg:order-2' : ''}>{text}</div>
        <div className={isReversed ? 'lg:order-1' : ''}>{photo}</div>
      </div>
    </RevealOnScroll>
  )
}

export default function PersonaPage() {
  const { slug } = useParams<{ slug: string }>()
  const persona = getPersonaBySlug(slug || '')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Per-page SEO: unique title/description/canonical + product structured data.
  // Called unconditionally (before the 404 early-return) to satisfy the rules of
  // hooks; the not-found case is marked noindex so Google drops dead slugs.
  useSeo({
    title: persona
      ? `Cooper for ${persona.name} — AI for Insurance`
      : 'Page not found — Cooper',
    description: persona?.subtitle,
    canonicalPath: persona ? `/product/${persona.slug}` : undefined,
    // Per-product Open Graph image (dedicated 1200×630 art per persona,
    // generated by scripts/og/generate.cjs).
    image: persona ? `/images/og/${persona.slug}.jpg` : undefined,
    noindex: !persona,
    jsonLd: persona ? personaJsonLd(persona) : undefined,
  })

  if (!persona) {
    return (
      <div className="min-h-screen bg-cream-light">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] pt-[120px] md:pt-[160px] lg:pt-[200px] pb-[80px] lg:pb-[120px] text-center">
          <h1 className="font-serif text-[28px] md:text-[40px] lg:text-[48px] text-dark mb-[16px]">Page not found</h1>
          <p className="font-sans text-[17px] text-dark/60 mb-[32px]">
            The persona you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="font-sans font-medium text-[16px] text-cream-light bg-accent-orange-deep rounded-[8px] px-[28px] py-[14px] no-underline hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // Reinsurers is pulled from nav/grid pre-launch (fast-follow rebuild), so it
  // never appears in the cross-persona navigation even though its data remains.
  const otherPersonas = personas.filter((p) => p.slug !== persona.slug && p.slug !== 'reinsurers')
  const heroImage = getHeroImage(persona.slug)
  const featureImages = getFeatureImages(persona.slug)
  const stats = getStatsBand(persona.slug)
  const vigs = vignettes[persona.slug]

  const personaIcons: Record<string, ReactNode> = {
    'retail-agencies': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    'wholesale-brokers': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
      </svg>
    ),
    'mgas-insurers': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    'claims-tpas': (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    reinsurers: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  }

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      {/* ── Hero ── */}
      <section className="bg-cream-light">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[60px] pt-[110px] md:pt-[130px] lg:pt-[150px]">
          <div className="flex flex-col gap-[60px]">
            {/* text row */}
            <div className="grid grid-cols-1 items-start gap-[40px] lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-[80px]">
              <div className="flex flex-col gap-[32px]">
                <div className="flex flex-col gap-[24px]">
                  <div className="animate-fade-in flex items-center gap-[6px]" style={{ animationDelay: '0.15s' }}>
                    <Link to="/" className="font-sans text-[13px] text-[#68655e] no-underline hover:text-dark transition-colors">
                      HOME
                    </Link>
                    <span className="font-sans text-[13px] text-[#68655e]">/</span>
                    <span className="font-grotesk text-[13px] font-medium uppercase tracking-[1.3px] text-accent-orange">
                      {persona.label}
                    </span>
                  </div>
                  <h1
                    className="animate-fade-in font-serif text-[28px] md:text-[38px] lg:text-[46px] leading-[1.08] tracking-[-1px] text-[#0a0a0a] max-w-[620px]"
                    style={{ animationDelay: '0.3s' }}
                  >
                    {persona.headlineAccent ? (
                      <>
                        {(persona.headlineLead ?? '').split('. ').map((part, i, arr) => (
                          <span key={i} className="block">
                            {part}{i < arr.length - 1 ? '.' : ''}
                          </span>
                        ))}
                        {persona.headlineAccent?.includes('does the rest.') ? (
                          <>
                            <span className="block lg:inline">
                              <span
                                className="animate-headline-accent inline-block"
                                style={{ animationDelay: '1.5s' }}
                              >
                                Cooper does
                              </span>
                            </span>
                            {' '}
                            <span className="block lg:inline">
                              <span
                                className="animate-headline-accent inline-block"
                                style={{ animationDelay: '1.5s' }}
                              >
                                the rest.
                              </span>
                            </span>
                          </>
                        ) : (
                          <span
                            className="animate-headline-accent inline box-decoration-clone"
                            style={{ animationDelay: '1.5s' }}
                          >
                            {persona.headlineAccent}
                          </span>
                        )}
                      </>
                    ) : (
                      persona.headline
                    )}
                  </h1>
                </div>
                <div className="animate-fade-in flex flex-col items-stretch gap-[12px] sm:flex-row sm:flex-wrap sm:items-center" style={{ animationDelay: '0.45s' }}>
                  <Link
                    to="/demo"
                    className="inline-flex w-full items-center justify-center rounded-[8px] bg-[#1e1a15] px-[32px] py-[14px] text-center font-sans text-[16px] font-medium text-cream-light no-underline transition-opacity hover:opacity-90 sm:w-fit sm:justify-start sm:text-left"
                  >
                    {persona.ctaText}
                  </Link>
                </div>
              </div>
              <p
                className="animate-fade-in font-sans text-[18px] leading-[1.6] text-dark/60 lg:pt-[44px]"
                style={{ animationDelay: '0.6s' }}
              >
                {persona.subtitle}
              </p>
            </div>

            {/* hero image */}
            <div className="animate-fade-in aspect-[16/9] w-full overflow-hidden bg-[#fbfbf9]" style={{ animationDelay: '0.5s' }}>
              <img
                src={heroImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ── */}
      <RevealOnScroll>
        <section className="bg-cream-light">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[60px] pb-[80px] pt-[64px]">
            <div className="flex flex-col flex-wrap gap-[48px] sm:flex-row sm:justify-end sm:gap-[56px]">
              {stats.map((s) => {
                // Word values (e.g. "Same day") render smaller so they stay on one
                // line; a fixed-height, bottom-aligned box keeps every label level
                // regardless of the value's font size.
                const isText = !/^\d/.test(s.value)
                // A prefixed stat (e.g. "<15 min") right-aligns its value + label so
                // the unit and the label end at the same point instead of bleeding past.
                // Only from sm up, where the band itself is right-anchored; on mobile
                // the band stacks left-aligned, so right-aligning one stat would split
                // the two metrics onto opposite edges (they must stay left, like retail).
                const rightAlign = Boolean(s.prefix)
                return (
                <div key={s.label} className={isText ? '' : 'max-w-[300px]'}>
                  <div className={`flex items-end h-[44px] sm:h-[72px] lg:h-[88px] font-serif leading-[0.95] tracking-[-2px] text-[#0d1016] sm:tracking-[-2.64px] ${isText ? 'whitespace-nowrap text-[30px] sm:text-[46px] lg:text-[56px]' : 'text-[44px] sm:text-[72px] lg:text-[88px]'} ${rightAlign ? 'sm:justify-end' : ''}`}>
                    {s.prefix && (
                      <span className="mr-[3px] text-[30px] sm:text-[46px] lg:text-[56px] leading-[1.1]">{s.prefix}</span>
                    )}
                    <CountUp value={s.value} />
                    {s.unit && (
                      <span className="ml-[5px] text-[18px] sm:text-[26px] lg:text-[32px] leading-[1.2]">{s.unit}</span>
                    )}
                  </div>
                  <p className={`mt-[14px] font-sans text-[15px] leading-[1.4] text-[#6b6b6b] ${rightAlign ? 'sm:text-right' : ''}`}>{s.label}</p>
                </div>
                )
              })}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* ── Role balance strip (optional, e.g. Retail: producers vs account managers) ── */}
      {persona.roleBalance && (
        <RevealOnScroll>
          <section className="bg-cream-light">
            <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[60px] pb-[80px]">
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
                {persona.roleBalance.map((col) => (
                  <div
                    key={col.label}
                    className="rounded-[16px] border border-dark/[0.1] bg-cream-light/60 p-[32px]"
                  >
                    <div className="mb-[12px] font-grotesk text-[11px] font-medium uppercase tracking-[1.4px] text-accent-orange">
                      {col.label}
                    </div>
                    <h3 className="mb-[20px] font-serif text-[24px] leading-[1.15] text-[#0a0a0a]">
                      {col.title}
                    </h3>
                    <ul className="flex flex-col gap-[12px]">
                      {col.points.map((point) => (
                        <li key={point} className="flex items-start gap-[10px] font-sans text-[15px] leading-[1.5] text-dark/70">
                          <span className="mt-[2px] font-semibold text-accent-orange">›</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealOnScroll>
      )}

      {/* ── Feature sections ── */}
      <section id="features" className="scroll-mt-[100px] bg-cream-light pb-[100px]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-[120px] px-5 md:px-10 lg:px-[60px]">
          {persona.features.map((feature, index) => (
            <FeatureBlock
              key={index}
              feature={feature}
              index={index}
              image={featureImages[index % featureImages.length]}
              vignette={vigs?.[index]}
            />
          ))}
        </div>
      </section>

      {/* Testimonial — same pooled list on every persona page */}
      <RevealOnScroll>
        <PersonaTestimonial testimonials={allTestimonials} />
      </RevealOnScroll>

      {/* CTA Section */}
      <RevealOnScroll>
        <section className="relative overflow-hidden py-[120px]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[#1e1a15]" />
            <img
              src="/images/persona/persona-retail-1.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(30,26,21,0.3) 0%, rgba(30,26,21,0.7) 100%)' }} />
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] text-center">
            <h2 className="font-serif text-[36px] lg:text-[38px] leading-[1.2] text-cream-light mb-[16px]">
              {persona.demoHeadline ?? 'Ready to see Cooper in action?'}
            </h2>
            <p className="font-sans text-[17px] leading-[1.6] text-cream-light/60 max-w-[460px] mx-auto mb-[32px]">
              {persona.demoSubtitle ?? `No generic demo. We show you how Cooper works for ${persona.name}, with your own data.`}
            </p>
            <Link
              to="/demo"
              className="inline-block font-sans font-medium text-[16px] text-dark bg-cream-light rounded-[8px] px-[32px] py-[14px] no-underline hover:opacity-90 transition-opacity cursor-pointer"
            >
              Request a Demo
            </Link>
          </div>
        </section>
      </RevealOnScroll>

      {/* Other Personas Navigation */}
      <RevealOnScroll>
        <section className="bg-cream-light py-[100px]">
          <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px]">
            <p className="font-grotesk font-medium text-[12px] tracking-[1.2px] uppercase text-dark/40 mb-[40px]">
              Built for every role
            </p>
            <div className="flex flex-col">
              {otherPersonas.map((p, i) => (
                <Link
                  key={p.slug}
                  to={`/product/${p.slug}`}
                  className={`group flex items-center justify-between py-[24px] no-underline transition-colors ${
                    i < otherPersonas.length - 1 ? 'border-b border-dark/[0.08]' : ''
                  }`}
                >
                  <div className="flex items-center gap-[20px]">
                    <div className="w-[48px] h-[48px] rounded-[12px] bg-dark/[0.05] flex items-center justify-center text-dark/40 group-hover:text-accent-orange group-hover:bg-accent-orange/[0.08] transition-colors shrink-0">
                      {personaIcons[p.slug]}
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-serif text-[22px] md:text-[28px] leading-[1.3] text-dark group-hover:text-accent-orange transition-colors">
                        {p.name}
                      </span>
                      <span className="font-sans text-[15px] text-dark/40 group-hover:text-dark/60 transition-colors">
                        {p.subtitle.split(' — ')[0].split('.')[0]}.
                      </span>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-dark/20 group-hover:text-accent-orange transition-colors shrink-0 ml-[24px]">
                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <Footer />
    </div>
  )
}
