/* ──────────────────────────────────────────────────────────────
   PersonaTestimonial — Harvey-style editorial quote slider. Narrow
   meta column (author / role) on the left, a large serif pull-quote
   on the right, and a segmented progress bar that auto-advances.
   Takes its testimonials via props.

   Named for the persona pages it was built for; Cooper Lite runs it
   too, which is why the section shell is overridable. The two class
   props exist because the two pages sit on different surfaces and
   different gutters: Lite uses 24/40/62 where the persona pages use
   20/40/60, and a 4px step between one section and the next is the
   kind of thing that reads as sloppy on a phone. Everything the
   component is actually for, the timing, the reduced-motion opt-out
   and the progress bar, stays identical for both.
─────────────────────────────────────────────────────────────── */
import { useState, useEffect, useCallback, useRef } from 'react'
import type { TestimonialItem } from '../data/personas'

const DURATION = 9000

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduce(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduce
}

export default function PersonaTestimonial({
  testimonials,
  sectionClassName = 'bg-cream-light py-[120px]',
  containerClassName = 'mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[60px]',
}: {
  testimonials: TestimonialItem[]
  /** Surface and vertical rhythm. Defaults to the persona pages'. */
  sectionClassName?: string
  /** Measure and gutters. Defaults to the persona pages'. */
  containerClassName?: string
}) {
  const reduce = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const rafRef = useRef<number>(0)
  const startRef = useRef(0)
  // Mirrors `progress` so the effect can resume mid-bar without depending on
  // the state value.
  const progressRef = useRef(0)

  const multiple = testimonials.length > 1

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
    setAnimKey((k) => k + 1)
    setProgress(0)
    progressRef.current = 0
  }, [testimonials.length])

  const goTo = (idx: number) => {
    if (idx === active) return
    setActive(idx)
    setAnimKey((k) => k + 1)
    setProgress(0)
    progressRef.current = 0
    setPaused(true)
    window.setTimeout(() => setPaused(false), DURATION)
  }

  useEffect(() => {
    if (!multiple || paused || reduce) return
    startRef.current = performance.now() - (progressRef.current / 100) * DURATION
    const tick = () => {
      const elapsed = performance.now() - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      progressRef.current = pct
      setProgress(pct)
      if (pct >= 100) goNext()
      else rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [paused, active, goNext, multiple, reduce])

  // After all hooks so the hook order is stable when the list is empty.
  if (!testimonials.length) return null
  const t = testimonials[active]
  const clean = t.quote.replace(/^[“"]|[”"]$/g, '').trim()

  return (
    <section className={sectionClassName}>
      <div className={containerClassName}>
        <div className="grid grid-cols-1 items-start gap-[40px] lg:grid-cols-[260px_1fr] lg:gap-[80px]">
          {/* Fixed label — never changes */}
          <div className="lg:pt-[8px]">
            <p className="font-grotesk text-[16px] font-medium uppercase tracking-[1.6px] text-dark/40">
              What they say about Cooper
            </p>
          </div>

          {/* Quote + attribution — fades in fresh on each change */}
          <div key={`quote-${animKey}`} className="animate-fade-in min-h-[200px] lg:min-h-[260px]" style={{ animationDelay: '0.08s' }}>
            <blockquote className="font-serif text-[36px] leading-[1.2] text-dark sm:text-[38px] lg:text-[40px] lg:leading-[1.24]">
              &ldquo;{clean}&rdquo;
            </blockquote>
            {(t.author || t.role) && (
              <p className="mt-[20px] font-grotesk font-semibold text-[16px] tracking-[1.45px] uppercase text-accent-orange">
                {t.author && <span>{t.author}</span>}
                {t.author && t.role && <span className="mx-[6px] opacity-40">·</span>}
                {t.role && <span>{t.role}</span>}
              </p>
            )}
          </div>
        </div>

        {/* segmented progress bar (only when more than one) */}
        {multiple && (
          <div className="mt-10 md:mt-14 lg:mt-[72px] flex gap-[8px]">
            {testimonials.map((_, i) => {
              const fill = i < active ? 100 : i === active ? progress : 0
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="group relative h-[18px] flex-1 cursor-pointer"
                >
                  <span className="absolute inset-x-0 top-[8px] h-[2px] bg-dark/15" />
                  <span
                    className="absolute left-0 top-[8px] h-[2px] bg-dark"
                    style={{
                      width: `${fill}%`,
                      transition: i === active ? 'none' : 'width 0.3s ease',
                    }}
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
