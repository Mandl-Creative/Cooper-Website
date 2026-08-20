/*
 * SSR entry used only at build time by scripts/prerender.cjs (via
 * `vite build --ssr`). Renders a route to static HTML so prerendered pages
 * paint before the SPA bundle loads; main.tsx hydrates the markup on the
 * client. react-dom/static's prerender waits for Suspense/lazy content, so
 * the lazy routes resolve before the HTML is emitted.
 */
/* eslint-disable react-refresh/only-export-components --
   This module is only ever loaded by `vite build --ssr` and scripts/prerender.cjs.
   It is never part of a Fast Refresh boundary, and exporting build-time data
   from it is the point: see the re-export below. */
import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App.tsx'

/*
 * Deliberate second job for this module: prerender.cjs is CommonJS and cannot
 * require a .ts file, so data-driven routes have historically been re-derived
 * by grepping the source (see how personas are handled). This module is already
 * imported by the build script as compiled ES, so re-exporting the blog list
 * hands it the real, typechecked array instead of a regex approximation.
 *
 * Keep this export. Removing it makes the build emit zero blog pages, which
 * prerender.cjs turns into a hard error rather than a silent omission.
 */
export { publishedPosts, BLOG_TITLE, BLOG_DESCRIPTION } from './data/blog'

export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return new Response(prelude).text()
}
