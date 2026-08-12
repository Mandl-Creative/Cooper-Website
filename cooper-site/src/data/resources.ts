import type { ComponentType } from 'react'
import { Plugs, FileText, Calculator, Article } from '@phosphor-icons/react'

/**
 * The Resources catalog — one list behind the Resources nav dropdown and the
 * footer column, so a new resource is added once and appears in both.
 *
 * There is no /resources hub page; each entry is its own route.
 */
export interface Resource {
  to: string
  title: string
  /** One line, shown under the title in the nav dropdown. */
  desc: string
  icon: ComponentType<{ size?: number; weight?: 'thin' | 'light' | 'regular'; className?: string }>
}

/* The ROI calculator was held back from production by #72 and published here.
   The draft gate is gone from all four places it lived: this list, the route
   and the dynamic import in App.tsx, and the prerender list. It now ships like
   any other resource, with a prerendered page and an entry in the sitemap.

   Its figures come from Akhilesh's brief rather than from measured customer
   results, and the page says so in "The method". Read the source note at the
   top of src/data/cooperEffect.ts before touching any number on it. */
const roiCalculator: Resource = {
  to: '/resources/roi-calculator',
  title: 'ROI Calculator',
  desc: 'Size the hours and revenue Cooper returns to your team.',
  icon: Calculator,
}

export const RESOURCES: Resource[] = [
  {
    to: '/resources/blog',
    title: 'Blog',
    desc: 'Engineering, industry and broker stories. A new post every Thursday.',
    icon: Article,
  },
  {
    to: '/integrations',
    title: 'Integrations',
    desc: 'Every system Cooper connects to, and how the data moves.',
    icon: Plugs,
  },
  roiCalculator,
  {
    to: '/resources/white-paper',
    title: 'White Paper',
    desc: 'How AI is changing the commercial submission workflow.',
    icon: FileText,
  },
]
