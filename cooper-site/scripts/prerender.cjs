/*
 * Post-build prerender for the SPA: per-route meta AND static HTML.
 *
 * Social scrapers (Facebook, LinkedIn, Slack, X, iMessage) do NOT run JavaScript,
 * so per-route meta set by the app at runtime never reaches them. This script
 * bakes the correct <title>, description, canonical and Open Graph / Twitter tags
 * into a static HTML file per route, so scrapers get the right preview.
 *
 * It also renders each route's real markup (via the SSR bundle built from
 * src/entry-server.tsx into dist-ssr/) into <div id="root">, so the page paints
 * before the SPA bundle downloads — this is what keeps FCP/LCP fast on mobile.
 * main.tsx hydrates the markup when the data-prerendered stamp matches the URL;
 * client-only routes (e.g. /careers/:id) fall back to a clean client render.
 *
 * On CloudFront the static-site URL-rewrite function resolves /product/x to
 * product/x.html before the SPA catch-all (index.html) fallback applies —
 * the same effect as `cleanUrls: true` on Vercel.
 *
 * Runs from `npm run build`. Route copy must stay in sync with the useSeo() calls
 * in the components (Home keeps the meta already in index.html; only its body
 * is rendered in). ORIGIN defaults to production; a staging build can override
 * via SITE_ORIGIN.
 */
const fs = require('fs')
const path = require('path')

const DIST = path.resolve(__dirname, '..', 'dist')
const ORIGIN = process.env.SITE_ORIGIN || 'https://cooper-site-blush.vercel.app'
const DEFAULT_OG = `${ORIGIN}/images/og-default.jpg`

const personas = [
  ['retail-agencies', 'Retail Agencies', 'Producers sell, account managers serve, Cooper does the rest. The submissions, carrier supplements, renewals, and certificates are handled end to end, so your team stays ahead of the book.'],
  ['wholesale-brokers', 'Wholesale Brokers', 'Cooper triages submissions, matches each risk to the markets most likely to write it, and drafts the proposal. Your brokers place more business.'],
  ['mgas-insurers', 'MGA & Insurers', 'Cooper prices to your rating logic, refers what\'s outside appetite with the reason attached, and keeps every program audit-ready, so a lean team covers more programs.'],
  ['claims-tpas', 'Claims TPA', 'Cooper handles intake, coverage checks, and reporting, so your adjusters resolve the files that need real judgment faster.'],
  // Reinsurers is pulled pre-launch (fast-follow rebuild): route redirects, so no prerendered page.
]

/** path, title, description, ogImage */
const routes = [
  ...personas.map(([slug, name, subtitle]) => ({
    path: `/product/${slug}`,
    title: `Cooper for ${name} — AI for Insurance`,
    description: subtitle,
    ogImage: `${ORIGIN}/images/og/${slug}.jpg`,
  })),
  { path: '/about', title: 'About Cooper — AI for Insurance Professionals', description: "Cooper's mission, team, and why we're building AI for insurance professionals.", ogImage: DEFAULT_OG },
  { path: '/integrations', title: 'Integrations — Cooper', description: 'Cooper connects to the systems insurance teams already use: email, Excel, carrier portals, AMS/CRM, ACORD forms, and loss runs. See what connects, how the data moves, and how it stays secure.', ogImage: DEFAULT_OG },
  { path: '/lite', title: 'Cooper Lite — Get more accounts to market. Faster.', description: 'Cooper Lite helps small commercial insurance agencies get more accounts to market faster by completing ACORDs and market supplementals, summarizing loss runs, and assembling submission packages.', ogImage: DEFAULT_OG },
  { path: '/resources/roi-calculator', title: 'ROI Calculator — Cooper', description: 'Estimate what Cooper returns to your team. Tell us the shape of your book and see the hours, the cost avoided and the revenue the freed capacity buys, per month and over three years.', ogImage: DEFAULT_OG },
  { path: '/resources/white-paper', title: 'AI for Insurance Agents: How to Evaluate Tools — Cooper', description: 'Why the moment to adopt AI is now, and how to evaluate the tools that actually finish the job, from intake to renewal. A Cooper white paper for insurance agents and brokers.', ogImage: DEFAULT_OG },
  { path: '/demo', title: 'Request a Demo — Cooper', description: 'See Cooper in action with your own data. Book a personalized demo for your insurance team.', ogImage: DEFAULT_OG },
  { path: '/careers', title: 'Careers — Cooper', description: 'Join the team building AI for insurance professionals. See open roles at Cooper.', ogImage: DEFAULT_OG },
  // Legal / policy pages: prerender them so scrapers see the right meta, but
  // mark them noindex and keep them out of the sitemap — they can't rank for
  // anything meaningful and only bleed crawl budget from the pages that can.
  { path: '/privacy', title: 'Privacy Policy — Cooper', description: 'How Cooper collects, uses, shares, and protects your personal information.', ogImage: DEFAULT_OG, noindex: true },
  { path: '/cookie-policy', title: 'Cookie Policy — Cooper', description: 'How Cooper uses cookies and similar technologies on its website.', ogImage: DEFAULT_OG, noindex: true },
  { path: '/terms', title: 'Terms of Service — Cooper', description: 'The terms governing your use of Cooper and its services.', ogImage: DEFAULT_OG, noindex: true },
  { path: '/subprocessors', title: 'Subprocessors — Cooper', description: 'The third-party subprocessors Cooper uses to deliver its services.', ogImage: DEFAULT_OG, noindex: true },
  { path: '/master-services-agreement', title: 'Master Services Agreement — Cooper', description: "Cooper's Master Services Agreement governing the use of our platform.", ogImage: DEFAULT_OG, noindex: true },
  { path: '/master-services-agreement-hipaa', title: 'Master Services Agreement (HIPAA) — Cooper', description: "Cooper's Master Services Agreement for customers that receive or handle Protected Health Information.", ogImage: DEFAULT_OG, noindex: true },
  { path: '/data-processing-addendum', title: 'Data Processing Addendum — Cooper', description: "Cooper's Data Processing Addendum for data protection compliance.", ogImage: DEFAULT_OG, noindex: true },
]

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Replace a head tag matched by `re` with `replacement`; if absent, insert before </head>.
function swap(html, re, replacement) {
  return re.test(html) ? html.replace(re, replacement) : html.replace('</head>', `    ${replacement}\n  </head>`)
}

function render(template, route) {
  const url = `${ORIGIN}${route.path}`
  const t = esc(route.title)
  const d = esc(route.description)
  let html = template
  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
  html = swap(html, /<meta\s+name="description"[\s\S]*?\/?>/, `<meta name="description" content="${d}" />`)
  html = swap(html, /<link\s+rel="canonical"[^>]*\/?>/, `<link rel="canonical" href="${url}" />`)
  html = swap(html, /<meta\s+property="og:title"[^>]*\/?>/, `<meta property="og:title" content="${t}" />`)
  html = swap(html, /<meta\s+property="og:description"[\s\S]*?\/?>/, `<meta property="og:description" content="${d}" />`)
  html = swap(html, /<meta\s+property="og:url"[^>]*\/?>/, `<meta property="og:url" content="${url}" />`)
  html = swap(html, /<meta\s+property="og:image"[^>]*\/?>/, `<meta property="og:image" content="${route.ogImage}" />`)
  html = swap(html, /<meta\s+name="twitter:title"[^>]*\/?>/, `<meta name="twitter:title" content="${t}" />`)
  html = swap(html, /<meta\s+name="twitter:description"[\s\S]*?\/?>/, `<meta name="twitter:description" content="${d}" />`)
  html = swap(html, /<meta\s+name="twitter:image"[^>]*\/?>/, `<meta name="twitter:image" content="${route.ogImage}" />`)
  if (route.noindex) {
    html = swap(html, /<meta\s+name="robots"[^>]*\/?>/, `<meta name="robots" content="noindex, follow" />`)
  }
  return html
}

function injectBody(html, routePath, body) {
  const marker = '<div id="root"></div>'
  if (!html.includes(marker)) throw new Error(`#root marker not found while prerendering ${routePath}`)
  return html.replace(marker, `<div id="root" data-prerendered="${routePath}">${body}</div>`)
}

// Inline the entry stylesheet into the HTML. It's the only render-blocking
// request left (~15 KB gzipped); inlining removes a full round trip from
// FCP/LCP on every page. Lazy-route styles are unaffected (Vite injects them
// on chunk load).
function inlineEntryCss(html) {
  const link = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
  if (!link) throw new Error('entry stylesheet <link> not found in dist/index.html')
  const css = fs.readFileSync(path.join(DIST, link[1]), 'utf8')
  return html.replace(link[0], `<style>${css}</style>`)
}

async function main() {
  const { render: renderBody } = await import('../dist-ssr/entry-server.js')
  const template = inlineEntryCss(fs.readFileSync(path.join(DIST, 'index.html'), 'utf8'))

  for (const route of routes) {
    const outFile = path.join(DIST, `${route.path.replace(/^\//, '')}.html`)
    fs.mkdirSync(path.dirname(outFile), { recursive: true })
    fs.writeFileSync(outFile, injectBody(render(template, route), route.path, await renderBody(route.path)))
  }

  // Home: meta already lives in index.html; render just the body in.
  fs.writeFileSync(path.join(DIST, 'index.html'), injectBody(template, '/', await renderBody('/')))

  // Sitemap is generated from the same route list so it can't drift from the
  // prerendered pages (it did when it was a hand-maintained file in public/).
  // Rules:
  //   - noindex routes are excluded (Search Console flags noindex URLs in a
  //     sitemap as an error).
  //   - Every entry carries <lastmod> — Google uses it as a real crawl hint
  //     (changefreq / priority are ignored). Build time is a fine proxy
  //     because these are static pages that only change on deploy.
  const lastmod = new Date().toISOString().slice(0, 10)
  const sitemapPaths = ['/', ...routes.filter((r) => !r.noindex).map((r) => r.path)]
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapPaths.map((p) => `  <url>\n    <loc>${ORIGIN}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`),
    '</urlset>',
    '',
  ].join('\n')
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap)

  // robots.txt is generated for the same reason the sitemap is: as a static
  // file in public/ it pointed at a different domain than the sitemap it
  // advertises, so crawlers were sent to a Sitemap: URL this deploy never
  // serves. Deriving it from ORIGIN keeps the two in lockstep per environment.
  const robots = [`User-agent: *`, `Allow: /`, ``, `Sitemap: ${ORIGIN}/sitemap.xml`, ``].join('\n')
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots)

  console.log(`prerendered ${routes.length + 1} routes + sitemap.xml + robots.txt`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
