import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import { useUtmCapture } from './hooks/use-utm-capture'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowCooperHelps from './components/HowCooperHelps'
import OnePlatform from './components/OnePlatform'
import Metrics from './components/Metrics'
import BuiltForEveryRole from './components/BuiltForEveryRole'
import Integrations from './components/Integrations'
import SecurityCompliance from './components/SecurityCompliance'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'

// Every non-home page is lazy so the home bundle doesn't carry react-markdown,
// libphonenumber, and the long-tail pages. Prerendering still emits full HTML
// for these routes (entry-server renders through Suspense), and React Router
// wraps navigations in startTransition, so lazy loads never flash a fallback.
const DemoPage = lazy(() => import('./components/DemoPage'))
const PersonaPage = lazy(() => import('./components/PersonaPage'))
const AboutPage = lazy(() => import('./components/AboutPage'))
const IntegrationsPage = lazy(() => import('./components/IntegrationsPage'))
const LitePage = lazy(() => import('./components/LitePage'))
const RoiCalculatorPage = lazy(() => import('./components/RoiCalculatorPage'))
const WhitePaperPage = lazy(() => import('./components/WhitePaperPage'))
const BlogIndexPage = lazy(() => import('./components/BlogIndexPage'))
const BlogPostPage = lazy(() => import('./components/BlogPostPage'))
const CareersPage = lazy(() => import('./components/CareersPage'))
const CareerRolePage = lazy(() => import('./components/CareerRolePage'))
const PrivacyPage = lazy(() => import('./components/PrivacyPage'))
const TermsPage = lazy(() => import('./components/TermsPage'))
const CookiePolicyPage = lazy(() => import('./components/CookiePolicyPage'))
const SubprocessorsPage = lazy(() => import('./components/SubprocessorsPage'))
const MasterServicesAgreementPage = lazy(() => import('./components/MasterServicesAgreementPage'))
const MasterServicesAgreementHipaaPage = lazy(() => import('./components/MasterServicesAgreementHipaaPage'))
const DataProcessingAddendumPage = lazy(() => import('./components/DataProcessingAddendumPage'))
const NotFoundPage = lazy(() => import('./components/NotFoundPage'))

// Reset scroll to the top on every route change so a new page never opens
// at the scroll height of the previous one. Honors #hash anchors when present.
function UtmCapture() {
  useUtmCapture()
  return null
}

// Redirect legacy /personas/:slug URLs to the new /product/:slug paths, so any
// previously shared or indexed links keep working after the rename.
function PersonaRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/product/${slug}`} replace />
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  // useLayoutEffect runs before paint, so the new page never flashes at the
  // previous scroll position.
  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    // Jump instantly to the top, bypassing the global `scroll-behavior: smooth`
    // (which would otherwise animate the page upward instead of starting there).
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    html.style.scrollBehavior = prev
  }, [pathname, hash])

  return null
}

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <RevealSection>
        <HowCooperHelps />
      </RevealSection>
      <RevealSection>
        <BuiltForEveryRole />
      </RevealSection>
      <RevealSection>
        <Metrics />
      </RevealSection>
      {/* Testimonial hidden until real customer stories are available */}
      {/* <RevealSection>
        <Testimonial />
      </RevealSection> */}
      <RevealSection>
        <OnePlatform />
      </RevealSection>

      {/* <RevealSection>
        <TeamSection />
      </RevealSection> */}
      <RevealSection>
        <Integrations />
      </RevealSection>
      <RevealSection>
        <FinalCTA />
      </RevealSection>
      <RevealSection>
        <SecurityCompliance />
      </RevealSection>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <UtmCapture />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          {/* Cooper Lite: the self-serve tier. Signup and the plan comparison
              live in the product app, so only the landing page is routed here. */}
          <Route path="/lite" element={<LitePage />} />
          <Route path="/resources/roi-calculator" element={<RoiCalculatorPage />} />
          <Route path="/resources/white-paper" element={<WhitePaperPage />} />
          {/* Index above the :slug route, matching the /product/* convention below. */}
          <Route path="/resources/blog" element={<BlogIndexPage />} />
          <Route path="/resources/blog/:slug" element={<BlogPostPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:roleId" element={<CareerRolePage />} />
          {/* Product / use-case pages (formerly /personas/*). Reinsurers is pulled
              pre-launch (fast-follow rebuild): redirected on direct URL. Keep the
              specific route above the :slug route. */}
          <Route path="/product/reinsurers" element={<Navigate to="/" replace />} />
          <Route path="/product/:slug" element={<PersonaPage />} />
          {/* Preserve previously shared /personas/* URLs by redirecting to /product/*. */}
          <Route path="/personas/reinsurers" element={<Navigate to="/" replace />} />
          <Route path="/personas/:slug" element={<PersonaRedirect />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/subprocessors" element={<SubprocessorsPage />} />
          <Route path="/master-services-agreement" element={<MasterServicesAgreementPage />} />
          <Route path="/master-services-agreement-hipaa" element={<MasterServicesAgreementHipaaPage />} />
          <Route path="/data-processing-addendum" element={<DataProcessingAddendumPage />} />
          {/* Catch-all: any unknown URL renders a lightweight on-brand 404 instead
              of a blank white page. Keep last so real routes win. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}
