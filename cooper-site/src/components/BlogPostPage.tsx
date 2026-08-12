/* ──────────────────────────────────────────────────────────────
   Blog post — /resources/blog/:slug

   Bodies are markdown in src/content/blog/<slug>.md, resolved by
   convention through one Vite glob. Adding a post is a .md file
   plus an entry in src/data/blog.ts: no component, no route, no
   prerender line.

   The renderer is LegalDocPage's class map retuned for editorial
   prose (wider measure, serif headings, larger body) plus a
   figure/caption renderer the legal pages have no use for. It is
   copied rather than shared because LegalDocPage's scale is
   deliberately dense and six legal routes depend on it.

   A post with no body yet renders a visible placeholder instead of
   an empty page, so an entry can be scheduled before it is written.
─────────────────────────────────────────────────────────────── */

import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from './Navbar'
import Footer from './Footer'
import Reveal from './Reveal'
import NotFoundPage from './NotFoundPage'
import BlogPostCard, { PostTile } from './BlogPostCard'
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
const pCls = 'font-sans text-[17px] leading-[1.7] text-dark/75 mb-[20px]'
const h2Cls = 'font-serif text-[26px] md:text-[30px] text-dark mt-[48px] mb-[18px]'
const h3Cls = 'font-sans font-semibold text-[17px] text-dark mt-[32px] mb-[12px]'
const listCls = 'font-sans text-[17px] leading-[1.7] text-dark/75 mb-[20px] pl-[24px] space-y-[8px]'

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

  const more = publishedPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-cream-light">
      <Navbar variant="light" />

      <article>
        <header className="bg-cream px-5 pb-[56px] pt-[140px] md:px-10 md:pt-[160px] lg:px-[62px]">
          <div className="mx-auto max-w-[820px]">
            <Reveal>
              <Link
                to="/resources/blog"
                className="font-grotesk text-[12px] font-medium uppercase tracking-[0.12em] text-accent-orange"
              >
                {track.label}
              </Link>
              <h1 className="pt-[16px] font-serif text-[34px] leading-[1.1] tracking-[-0.4px] text-dark md:text-[46px]">
                {post.title}
              </h1>
              <p className="pt-[18px] font-sans text-[17px] leading-[1.55] text-muted">
                {post.excerpt}
              </p>
              <p className="pt-[24px] font-grotesk text-[13px] text-dark">
                {post.author.name}
                <span className="text-muted"> · {post.author.role} · </span>
                <time dateTime={post.publishedAt} className="text-muted">
                  {formatPostDate(post.publishedAt)}
                </time>
              </p>
            </Reveal>
          </div>
        </header>

        <div className="px-5 md:px-10 lg:px-[62px]">
          <div className="mx-auto max-w-[820px] pt-[40px]">
            <PostTile post={post} eager />
          </div>
        </div>

        <div className="px-5 md:px-10 lg:px-[62px]">
          <div className="mx-auto max-w-[720px] py-[56px]">
            {body ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h2 className={h2Cls}>{children}</h2>,
                  h2: ({ children }) => <h2 className={h2Cls}>{children}</h2>,
                  h3: ({ children }) => <h3 className={h3Cls}>{children}</h3>,
                  h4: ({ children }) => <h3 className={h3Cls}>{children}</h3>,
                  p: ({ children }) => <p className={pCls}>{children}</p>,
                  ul: ({ children }) => <ul className={`${listCls} list-disc`}>{children}</ul>,
                  ol: ({ children }) => <ol className={`${listCls} list-decimal`}>{children}</ol>,
                  li: ({ children }) => <li>{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-medium text-dark">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="my-[28px] border-l-2 border-accent-orange/40 pl-[20px] font-serif text-[20px] leading-[1.5] text-dark/80">
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
                    <figure className="my-[32px]">
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
      </article>

      {more.length > 0 && (
        <section className="px-5 pb-[96px] md:px-10 lg:px-[62px]">
          <div className="mx-auto max-w-[1180px]">
            <h2 className="font-grotesk text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
              Keep reading
            </h2>
            <div className="mt-[24px] grid gap-x-[28px] gap-y-[48px] md:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <BlogPostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
