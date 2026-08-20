/* ──────────────────────────────────────────────────────────────
   Blog post — /resources/blog/:slug

   Bodies are markdown in src/content/blog/<slug>.md, resolved by
   convention through one Vite glob. Adding a post is a .md file
   plus an entry in src/data/blog.ts: no component, no route, no
   prerender line.

   Laid out after Every, which solves the problem Cooper has: no
   named author on most posts. Every does not hide that. It gives
   the byline slot its own column, puts the publication's own mark
   in it, and writes "BY EVERY STAFF" over the column name. The
   house becomes the author, deliberately, instead of a missing
   face being papered over.

   Three columns, and each one earns its width:

     · Left, the byline. Cooper's mark, the author, and the track
       under it the way Every prints the column name. On a post
       with a real name (Shashank on the engineering track) the
       same block just carries the name instead.

     · Centre, the article. Title, standfirst, then one meta line
       with the date and the read time, and the share row opposite
       it.

     · Right, "On this page". Built from the H2s in the markdown,
       so a post gets a table of contents by being written, not by
       anyone maintaining a list. It highlights the section you are
       in and disappears entirely on a post with fewer than two.

   The action row is Every's, and everything in it does something.
   Listen reads the post with the browser's own speech synthesis,
   so it needs no audio file and no backend, and it is simply not
   rendered where the API is missing. Copy link, X, LinkedIn and
   Facebook are real shares. Likes and comments are the two things
   from the reference that are NOT here: both need a backend, and a
   counter that never moves is worse than no counter.

   "Updated <date>" prints only for a post that carries `updatedAt`.
   Filling that line with the publish date would turn a real signal
   into furniture.

   The renderer is LegalDocPage's class map retuned for editorial
   prose (wider measure, serif headings, larger body) plus a
   figure/caption renderer the legal pages have no use for. It is
   copied rather than shared because LegalDocPage's scale is
   deliberately dense and six legal routes depend on it.

   A post with no body yet renders a visible placeholder instead of
   an empty page, so an entry can be scheduled before it is written.
─────────────────────────────────────────────────────────────── */

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Check,
  FacebookLogo,
  Headphones,
  LinkSimple,
  LinkedinLogo,
  XLogo,
} from '@phosphor-icons/react'
import Navbar from './Navbar'
import Footer from './Footer'
import Reveal from './Reveal'
import NotFoundPage from './NotFoundPage'
import BlogPostCard from './BlogPostCard'
import { formatPostDate, publishedPosts, trackById, type BlogPost } from '../data/blog'
import { useSeo } from '../lib/useSeo'
import { pageJsonLd } from '../lib/pageSchema'

/* Eager is right at this volume: a handful of posts is a few tens of KB inside
   an already-lazy route chunk, and it guarantees the bodies exist during the
   SSR prerender pass. Revisit around 25 posts. */
const BODIES = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const bodyFor = (slug: string): string | undefined => BODIES[`../content/blog/${slug}.md`]

const linkCls =
  'text-accent-orange underline decoration-accent-orange/30 hover:decoration-accent-orange transition-colors break-words'
const pCls = 'font-sans text-[17px] leading-[1.75] text-dark/75 mb-[22px]'
const h2Cls = 'font-serif text-[27px] md:text-[31px] text-dark mt-[52px] mb-[18px] scroll-mt-[120px]'
const h3Cls = 'font-sans font-semibold text-[17px] text-dark mt-[32px] mb-[12px]'
const listCls = 'font-sans text-[17px] leading-[1.75] text-dark/75 mb-[22px] pl-[24px] space-y-[8px]'

/** Heading text to an id. Shared by the table of contents and the h2 renderer,
    so the anchor a link points at is the anchor the heading gets. */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

/** The H2s, in order. Read straight from the markdown source rather than from
    the DOM, so the list exists during the SSR pass and not only after hydrate. */
function headingsOf(body: string | undefined): { id: string; text: string }[] {
  if (!body) return []
  return body
    .split('\n')
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, '').trim())
    .map((text) => ({ id: slugify(text), text }))
}

/** Words over 200wpm, rounded up. The number is an expectation, not a promise,
    so it is deliberately coarse. */
const readTime = (body: string | undefined) =>
  Math.max(1, Math.ceil((body ?? '').trim().split(/\s+/).length / 200))

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = publishedPosts.find((p) => p.slug === slug)

  if (!post) return <NotFoundPage />

  return <BlogPost post={post} />
}

/* Split so the hooks below never run on the not-found branch. */
function BlogPost({ post }: { post: BlogPost }) {
  const path = `/resources/blog/${post.slug}`
  const track = trackById(post.track)
  const body = bodyFor(post.slug)

  useSeo({
    title: post.seoTitle,
    description: post.seoDescription,
    canonicalPath: path,
    image: post.heroImage,
    jsonLd: pageJsonLd({ name: post.title, path, description: post.seoDescription }),
  })

  const headings = useMemo(() => headingsOf(body), [body])
  const more = publishedPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      <article>
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-[62px]">
          {/* ── Art, first ────────────────────────────────────────
              Every opens on the picture and puts the title under it.
              Where a post has no art the article simply starts, which
              is better than a large empty box between the reader and
              the first sentence. */}
          {post.heroImage && (
            <Reveal>
              <img
                src={post.heroImage}
                alt={post.heroImageAlt ?? ''}
                width={1600}
                height={900}
                loading="eager"
                className="mt-[104px] aspect-[16/9] w-full rounded-[14px] object-cover md:mt-[116px]"
              />
            </Reveal>
          )}

          {/* ── Three columns ─────────────────────────────────────
              Byline, article, contents. Stacks to one column below xl,
              where the rails would be too narrow to hold anything. */}
          <div
            className={`grid gap-x-[48px] gap-y-[36px] pb-[64px] xl:grid-cols-[190px_minmax(0,1fr)_210px] ${
              post.heroImage ? 'pt-[40px]' : 'pt-[132px] md:pt-[150px]'
            }`}
          >
            {/* ── Byline ──────────────────────────────────────── */}
            <Reveal>
              {/* Not sticky. The byline is a fact about the post, stated once
                  at the top; only the contents rail on the right has a reason
                  to travel, because only it tracks where the reader is. */}
              <div className="flex items-center gap-[12px]">
                <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-cream">
                  {/* brightness(0) alone, the way CooperLogo's dark variant and
                      the navbar do it. The 0.65 opacity that was here mixed 35%
                      of the cream circle back through the mark and landed it on
                      a washed grey rather than on the brand's dark. */}
                  <img
                    src="/images/cooper-icon.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-[19px] w-[19px]"
                    style={{ filter: 'brightness(0)' }}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block font-grotesk text-[11.5px] font-medium uppercase tracking-[0.1em] text-dark">
                    By {post.author.name}
                  </span>
                  <Link
                    to="/resources/blog"
                    className="block font-grotesk text-[11.5px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-accent-orange"
                  >
                    {track.label}
                  </Link>
                </span>
              </div>
            </Reveal>

            {/* ── The article ───────────────────────────────────
                One measure for the whole column. The body was capped
                narrower than the heading above it, which left the
                title, the rule and the share row all ending on a
                different line from the prose and the right edge
                looking accidental. */}
            <div className="min-w-0 max-w-[720px]">
              <Reveal>
                <h1 className="font-serif text-[34px] leading-[1.12] tracking-[-0.4px] text-dark md:text-[44px]">
                  {post.title}
                </h1>
                {/* /70, not /60: at 21px this is still below the size WCAG
                    treats as large text, so it needs the full 4.5:1. */}
                <p className="pt-[18px] font-serif text-[19px] leading-[1.5] text-dark/70 md:text-[21px]">
                  {post.excerpt}
                </p>

                {/* Meta left, actions right, on one line where there is room. */}
                <div className="mt-[26px] flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[14px] border-b border-dark/[0.08] pb-[22px]">
                  <div>
                    <p className="font-sans text-[15.5px] text-dark">
                      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                      <span className="px-[7px] text-muted">·</span>
                      {readTime(body)} min read
                    </p>
                    {/* Only for posts actually revised. An "Updated" line that
                        repeats the publish date says nothing and costs trust. */}
                    {post.updatedAt && (
                      <p className="pt-[2px] font-sans text-[15.5px] text-muted">
                        Updated{' '}
                        <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
                      </p>
                    )}
                  </div>
                  <ActionRow title={post.title} path={path} body={body} />
                </div>
              </Reveal>

              <div className="pt-[34px]">
                {body ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <H2>{children}</H2>,
                      h2: ({ children }) => <H2>{children}</H2>,
                      h3: ({ children }) => <h3 className={h3Cls}>{children}</h3>,
                      h4: ({ children }) => <h3 className={h3Cls}>{children}</h3>,
                      p: ({ children }) => <p className={pCls}>{children}</p>,
                      ul: ({ children }) => <ul className={`${listCls} list-disc`}>{children}</ul>,
                      ol: ({ children }) => (
                        <ol className={`${listCls} list-decimal`}>{children}</ol>
                      ),
                      li: ({ children }) => <li>{children}</li>,
                      strong: ({ children }) => (
                        <strong className="font-medium text-dark">{children}</strong>
                      ),
                      em: ({ children }) => <em className="italic">{children}</em>,
                      blockquote: ({ children }) => (
                        <blockquote className="my-[30px] border-l-2 border-accent-orange/40 pl-[22px] font-serif text-[21px] leading-[1.5] text-dark/80">
                          {children}
                        </blockquote>
                      ),
                      a: ({ href, children }) => (
                        <a href={href} className={linkCls}>
                          {children}
                        </a>
                      ),
                      /* Charts. The markdown title attribute becomes the caption,
                         so a caption lives next to its chart in the content file:

                           ![Alt text](/images/blog/<slug>/chart-1.webp "Takeaway. Source: …")

                         Note for authors: rehype-raw is deliberately not enabled,
                         so raw HTML in a post is rendered as visible text, not as
                         markup. That includes HTML comments — there is no way to
                         leave a hidden note in a .md file here. */
                      img: ({ src, alt, title }) => (
                        <figure className="my-[34px]">
                          <img
                            src={typeof src === 'string' ? src : undefined}
                            alt={alt ?? ''}
                            loading="lazy"
                            className="w-full rounded-[12px]"
                          />
                          {title && (
                            <figcaption className="pt-[10px] font-sans text-[13.5px] leading-[1.5] text-muted">
                              {title}
                            </figcaption>
                          )}
                        </figure>
                      ),
                    }}
                  >
                    {body}
                  </ReactMarkdown>
                ) : (
                  <div className="rounded-[16px] border border-dashed border-dark/20 bg-cream/40 p-[28px]">
                    <p className="font-grotesk text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
                      Not written yet
                    </p>
                    <p className="pt-[10px] font-sans text-[15px] leading-[1.6] text-muted">
                      This post is scheduled, not drafted. The body will render from{' '}
                      <code className="font-grotesk text-[13.5px] text-dark">
                        src/content/blog/{post.slug}.md
                      </code>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── On this page ────────────────────────────────── */}
            <OnThisPage headings={headings} />
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="px-5 pb-[24px] md:px-10 lg:px-[62px]">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex items-center gap-[16px]">
              <h2 className="shrink-0 font-grotesk text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
                Keep reading
              </h2>
              <span className="h-px flex-1 border-t border-dashed border-dark/15" />
            </div>
            <div className="mt-[28px] grid gap-x-[28px] gap-y-[52px] md:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <BlogPostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The site's closing banner. A post that ends on the footer wastes the
          one moment the reader is most convinced. */}
      <Reveal>
        <section className="bg-cream-light">
          <div className="mx-auto max-w-[1440px] px-5 py-[64px] md:px-10 lg:px-[62px]">
            <div className="relative h-auto overflow-hidden rounded-[30px] lg:h-[420px]">
              <img
                src="/images/about/careers-cta-bg.png"
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="relative z-10 flex h-full flex-col items-start gap-8 px-5 py-12 md:px-10 lg:flex-row lg:items-center lg:gap-0 lg:px-[72px] lg:py-0">
                <div className="flex-1">
                  <span className="mb-[16px] block font-grotesk text-[11px] font-medium uppercase tracking-[1.4px] text-cream-light">
                    Get started
                  </span>
                  <h2 className="mb-[36px] font-serif text-[36px] leading-[1.15] text-white md:text-[34px] lg:text-[42px]">
                    See Cooper run on your own submissions
                  </h2>
                  <Link
                    to="/demo"
                    className="inline-block w-fit rounded-[6px] bg-white px-[28px] py-[12px] font-sans text-[15px] font-medium text-dark no-underline transition-all duration-200 hover:scale-[1.03] hover:bg-cream"
                  >
                    Request a Demo
                  </Link>
                </div>
                <div className="flex w-full flex-1 lg:justify-end">
                  <p className="max-w-full font-sans text-[15px] leading-[24.75px] text-white/80 lg:max-w-[380px]">
                    Bring a real submission. We'll run it end to end and show you where the hours
                    go.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Footer />
    </div>
  )
}

/** An H2 that carries the id its table-of-contents entry points at. */
function H2({ children }: { children?: React.ReactNode }) {
  const text = typeof children === 'string' ? children : String(children)
  return (
    <h2 id={slugify(text)} className={h2Cls}>
      {children}
    </h2>
  )
}

/**
 * On this page.
 *
 * Hidden below two headings, because a contents list with one entry is a label
 * pretending to be navigation, and hidden below xl, where the rail has no room.
 * The active entry is found with an observer rather than by scroll maths, so it
 * stays right when a heading is jumped to rather than scrolled past.
 */
function OnThisPage({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (headings.length < 2) return
    const nodes = headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => Boolean(n))
    if (!nodes.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const onScreen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (onScreen[0]) setActive(onScreen[0].target.id)
      },
      /* A band across the upper third: a heading counts as "current" once it
         reaches the top of the reading area, not when it first appears. */
      { rootMargin: '-110px 0px -66% 0px', threshold: 0 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [headings])

  if (headings.length < 2) return <div aria-hidden="true" />

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-[112px]">
        <p className="font-grotesk text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
          On this page
        </p>
        <ul className="mt-[14px] border-l border-dark/[0.10]">
          {headings.map((h) => {
            const on = active === h.id
            return (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={`-ml-px block border-l py-[7px] pl-[14px] font-sans text-[13.5px] leading-[1.45] transition-colors duration-200 ${
                    on
                      ? 'border-accent-orange text-dark'
                      : 'border-transparent text-muted hover:text-dark'
                  }`}
                >
                  {h.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

/**
 * The best English voice the machine actually has.
 *
 * Left to itself the browser picks its default, and on macOS the default pool
 * is mostly novelty and legacy voices: Bad News, Boing, Cellos, Jester, Organ,
 * Trinoids, plus the old robotic Fred and Albert. Landing on one of those is
 * what makes the feature sound like a toy.
 *
 * So this is an allow-list in preference order, never a blocklist.
 *
 * Apple's Premium and Enhanced Siri voices come first, ahead of Chrome's
 * Google voice, because they are the more natural of the two when they are
 * present. They usually are not: macOS ships none of them by default and the
 * reader has to download one under Accessibility, so the Google voice is what
 * most machines will actually land on. Ordering for the better outcome costs
 * nothing on the machines that do not have it.
 *
 * Returning undefined is a valid answer and simply leaves the browser default.
 */
function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const en = voices.filter((v) => v.lang.startsWith('en'))
  if (!en.length) return undefined

  const KNOWN_GOOD = ['Ava', 'Samantha', 'Allison', 'Serena', 'Daniel', 'Karen', 'Alex']

  return (
    en.find((v) => /premium/i.test(v.name)) ??
    en.find((v) => /enhanced|siri/i.test(v.name)) ??
    en.find((v) => /neural|natural/i.test(v.name)) ??
    en.find((v) => /^google us english/i.test(v.name)) ??
    en.find((v) => /^google uk english/i.test(v.name)) ??
    KNOWN_GOOD.map((n) => en.find((v) => v.name.startsWith(n))).find(Boolean) ??
    en.find((v) => v.lang === 'en-US' && !v.localService) ??
    undefined
  )
}

/** getVoices() is empty until the list loads, and the event fires once. */
function voicesReady(): Promise<SpeechSynthesisVoice[]> {
  const now = window.speechSynthesis.getVoices()
  if (now.length) return Promise.resolve(now)
  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices())
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true })
    /* The event does not fire at all in some builds. Do not hang on it. */
    window.setTimeout(done, 1200)
  })
}

/**
 * Sentence-sized chunks.
 *
 * Chrome cuts a remote voice off after roughly fifteen seconds, which silently
 * truncates any article read as one utterance. Queueing many short ones instead
 * keeps the whole post audible, and breaking on sentence ends rather than on a
 * character count is what stops the join sounding like a stutter.
 */
function chunk(text: string, max = 200): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text]
  const out: string[] = []
  let buf = ''
  for (const s of sentences) {
    if ((buf + s).length > max && buf) {
      out.push(buf.trim())
      buf = s
    } else {
      buf += s
    }
  }
  if (buf.trim()) out.push(buf.trim())
  return out
}

/** Markdown to something worth reading aloud: headings keep their sentence,
    links keep their text, and the syntax around both goes. */
function speakable(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Listen, then copy link, X, LinkedIn, Facebook.
 *
 * Listen is real. It reads the post with the browser's own speech synthesis,
 * which needs no audio file and no backend, and the button is simply not
 * rendered where the API is missing. The alternative was a button that looks
 * like the reference and does nothing, which is worse than not having one.
 */
function ActionRow({ title, path, body }: { title: string; path: string; body?: string }) {
  const [copied, setCopied] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  /* A capability check, not state. The server snapshot is false so the
     prerendered HTML never contains a button the page cannot honour, and the
     client snapshot is read during hydration rather than set from an effect,
     which is what keeps the two passes agreeing. */
  const hasSpeech = useSyncExternalStore(
    () => () => {},
    () => 'speechSynthesis' in window,
    () => false,
  )
  const canSpeak = hasSpeech && Boolean(body)

  /* Stop reading if the reader leaves the post. Speech outlives the route. */
  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  const toggleSpeech = async () => {
    if (!body) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    setSpeaking(true)
    const voice = pickVoice(await voicesReady())
    const parts = chunk(`${title}. ${speakable(body)}`)

    window.speechSynthesis.cancel()
    parts.forEach((part, i) => {
      const u = new SpeechSynthesisUtterance(part)
      if (voice) u.voice = voice
      /* Just under conversational pace. The neural voices read a shade fast
         for prose at 1, and dropping the pitch would undo the naturalness the
         voice choice just bought. */
      u.rate = 0.96
      u.pitch = 1
      if (i === parts.length - 1) u.onend = () => setSpeaking(false)
      u.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(u)
    })

    /* Some environments accept the utterance and never speak it, and never
       fire `end` or `error` either: a machine with no audio device does
       exactly this. Without a check the button sits on "Stop" forever, which
       reads as a hung control. So confirm shortly after that speech really
       started, and put the label back if it did not. */
    window.setTimeout(() => {
      const live = window.speechSynthesis.speaking || window.speechSynthesis.pending
      if (!live) setSpeaking(false)
    }, 700)
  }

  const href = () =>
    typeof window === 'undefined' ? `https://askcooper.ai${path}` : window.location.href

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(href())
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* Clipboard is permission-gated and refuses in some contexts. Claiming
         success there would be a lie, so the button just does not change. */
      setCopied(false)
    }
  }

  const ring = 'border border-dark/[0.14] transition-colors duration-200 hover:border-dark/35'
  const round = `grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-dark ${ring}`

  /* Built on click rather than on render, because the canonical URL is only
     known in the browser and a prerendered href would share the wrong page. */
  const shareTo = (build: (u: string) => string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.href = build(window.location.href)
  }

  return (
    <div className="flex items-center gap-[8px]">
      {canSpeak && (
        <button
          type="button"
          onClick={toggleSpeech}
          aria-pressed={speaking}
          className={`flex h-[38px] cursor-pointer items-center gap-[8px] rounded-full px-[18px] font-sans text-[14.5px] font-medium text-dark ${ring}`}
        >
          <Headphones size={16} weight="fill" />
          {speaking ? 'Stop' : 'Listen'}
        </button>
      )}

      <button
        type="button"
        onClick={copy}
        className={`${round} cursor-pointer`}
        aria-label={copied ? 'Link copied' : 'Copy link to this post'}
      >
        {copied ? (
          <Check size={15} weight="bold" className="text-accent-orange" />
        ) : (
          <LinkSimple size={15} weight="bold" />
        )}
      </button>

      <a
        href={`https://askcooper.ai${path}`}
        target="_blank"
        rel="noopener noreferrer"
        className={round}
        aria-label="Share this post on X"
        onClick={shareTo(
          (u) =>
            `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(u)}`,
        )}
      >
        <XLogo size={15} weight="bold" />
      </a>

      <a
        href={`https://askcooper.ai${path}`}
        target="_blank"
        rel="noopener noreferrer"
        className={round}
        aria-label="Share this post on LinkedIn"
        onClick={shareTo(
          (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
        )}
      >
        <LinkedinLogo size={15} weight="bold" />
      </a>

      <a
        href={`https://askcooper.ai${path}`}
        target="_blank"
        rel="noopener noreferrer"
        className={round}
        aria-label="Share this post on Facebook"
        onClick={shareTo((u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`)}
      >
        <FacebookLogo size={15} weight="bold" />
      </a>
    </div>
  )
}
