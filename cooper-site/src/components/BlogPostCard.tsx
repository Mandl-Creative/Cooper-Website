import { Link } from 'react-router-dom'
import { formatPostDate, trackById, type BlogPost } from '../data/blog'

/* Fallback fills, keyed to the track. Existing palette tokens only — Tailwind
   needs the literal class string at build time, so these cannot be composed
   from the tint value at runtime. */
const TINT_CLASS: Record<string, string> = {
  'accent-orange': 'bg-accent-orange text-cream-light',
  dark: 'bg-dark text-cream-light',
  muted: 'bg-muted text-cream-light',
}

/**
 * The 16:9 slot at the top of a card.
 *
 * A post without art renders a typographic tile rather than a broken image or
 * a collapsed box. Hero images are the thing most likely to slip on a weekly
 * deadline, and a missing one should cost the post its illustration, not its
 * place on the page.
 */
export function PostTile({ post, eager = false }: { post: BlogPost; eager?: boolean }) {
  const track = trackById(post.track)

  if (post.heroImage) {
    return (
      <img
        src={post.heroImage}
        alt={post.heroImageAlt ?? ''}
        width={1600}
        height={900}
        loading={eager ? 'eager' : 'lazy'}
        className="aspect-[16/9] w-full rounded-[12px] object-cover"
      />
    )
  }

  return (
    <div
      className={`flex aspect-[16/9] w-full items-end rounded-[12px] p-[20px] ${TINT_CLASS[track.tint]}`}
      aria-hidden="true"
    >
      <span className="font-grotesk text-[11px] font-medium uppercase tracking-[0.12em] opacity-80">
        {track.label}
      </span>
    </div>
  )
}

/** Track name and date, the two things every card in the grid carries. */
export function PostMeta({ post, tone = 'muted' }: { post: BlogPost; tone?: 'muted' | 'light' }) {
  return (
    <p
      className={`font-grotesk text-[11px] font-medium uppercase tracking-[0.12em] ${
        tone === 'light' ? 'text-cream-light/70' : 'text-muted'
      }`}
    >
      {trackById(post.track).label}
      <span className="px-[6px]">·</span>
      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
    </p>
  )
}

/** One post in the index grid. Also used by the "Keep reading" rail. */
export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group h-full">
      <Link to={`/resources/blog/${post.slug}`} className="flex h-full flex-col">
        <PostTile post={post} />

        <div className="pt-[16px]">
          <PostMeta post={post} />

          <h3 className="pt-[8px] font-serif text-[22px] leading-[1.18] text-dark group-hover:text-accent-orange md:text-[24px]">
            {post.title}
          </h3>

          <p className="pt-[8px] text-[15px] leading-[1.5] text-muted">{post.excerpt}</p>

          <p className="pt-[12px] font-grotesk text-[13px] text-dark">
            {post.author.name}
            <span className="text-muted"> · {post.author.role}</span>
          </p>
        </div>
      </Link>
    </article>
  )
}
