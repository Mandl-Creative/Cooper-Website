/* ──────────────────────────────────────────────────────────────
   Capability panels for /lite.

   These replaced six screenshots of the running product. The screenshots
   carried a real signed-in user, a real @askcooper.ai address on a file, a
   live inbox count and a folder someone had named as a joke, all of it on a
   public marketing page; and a screenshot freezes, so the day the product
   ships a new sidebar the page is quietly out of date.

   Each panel takes the shape of the work it describes (a form, a chart, a
   stack, three columns, a page, a dated queue) and now plays a short scene of
   Cooper doing the verb in its title, ending on its finished screen. That
   finished screen is the JSX: it is what the server renders and what a
   reader who asked for reduced motion sees. The scenes live in lite/panels/
   (a pure `*.timeline.ts` per panel, tested in Node under tests/motion, and
   the component that paints it); the clock that decides which one plays, the
   hand-off between them and the tour lives in lite/motion/. The rules they
   follow: everything enters already moving, blur follows speed, nothing
   crossfades at rest, no Math.random, ochre only on what Cooper produced.

   Every value is invented. Ridgeline Millwork LLC is not a client, and the
   markets are lettered rather than named so nothing here reads as a claim
   about which carriers Cooper does or does not place business with.
─────────────────────────────────────────────────────────────── */

export { AcordsPanel } from './lite/panels/AcordsPanel'
export { LossRunsPanel } from './lite/panels/LossRunsPanel'
export { PackagePanel } from './lite/panels/PackagePanel'
export { QuotesPanel } from './lite/panels/QuotesPanel'
export { ProposalPanel as ProposalsPanel } from './lite/panels/ProposalPanel'
export { ServicePanel } from './lite/panels/ServicePanel'
