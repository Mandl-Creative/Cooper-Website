/**
 * The white paper, whole.
 *
 * This file is the reason the gate is real. It lives under api/, is imported
 * only by api/white-paper.ts, and is therefore compiled into the serverless
 * function and nowhere else. Nothing under cooper-site/src may import it: the
 * moment something does, the paper is back in the client bundle and in the
 * prerendered HTML, which is exactly the hole this replaced.
 *
 * It holds the complete paper rather than only the withheld part, so that
 * unlocking swaps the teaser for the real thing instead of splicing a
 * continuation onto a half-finished paragraph. The reader never sees both.
 *
 * The first two sentences also live in
 * cooper-site/src/content/white-paper-preview.md, which is the public teaser.
 * That duplication is deliberate and checked: scripts/assert-gate.cjs fails the
 * build if the teaser stops being a verbatim prefix of this text, so editing
 * the opening in one place and not the other cannot ship quietly. The same
 * script fails the build if any of the withheld text reaches dist/.
 */

export const WHITE_PAPER_BODY = `## Executive summary

Independent agents and brokers win business on relationships, advice, and speed. However, most agency hours go to re-entering data from dec pages and loss runs, filling the same ACORD forms and carrier supplements again and again, logging into a dozen carrier portals and raters per risk, and reformatting mismatched quotes into a client-ready proposal. The work is essential, but doing it by hand is a choice.

AI tools built specifically for insurance now handle this work end to end. This paper makes the case for why agencies should immediately adopt these tools, lays out a practical seven-point framework for choosing among them, and explains where Cooper, an AI platform that completes the entire insurance workflow from intake to renewal, fits in that landscape.

## Why insurance needs to look at AI now

### Speed decides who wins the account

The first agent back with a competitive quote frequently wins the account, so cycle time affects revenue directly. Clients now hold the whole relationship to that standard: in a survey of more than 600 policyholders, 83% expected a response within one business day and more than a third expected one within the hour, while only 21% said they received proactive outreach from their agent at all. Every day a submission sits in a queue is a day the client is shopping.

AI compresses that cycle from both ends: intake documents become structured data in minutes rather than days, and one risk can be marketed across every appointed carrier in parallel instead of portal by portal. Cooper customers reach first quote 4x faster.

### The industry has crossed the adoption threshold

AI in the independent agency channel is no longer experimental, but it is nowhere near finished. The Big "I" Agents Council for Technology found in February 2026 that 68% of agencies plan to increase their AI use over the next twelve months, while only about 8% have it embedded in daily workflows and 31% use no AI tools at all. Operational efficiency (60%) and staff productivity (52%) were the reasons agencies gave.

Readiness is the sharper number. Vertafore's survey of more than 1,300 independent agency professionals heading into 2026 found 46% saying their agency was only somewhat prepared, or not prepared at all, to keep pace with technology and market change. Among agencies with six or fewer staff, that rose to 55%.

The carrier side of the transaction is moving too. In a Deloitte survey of 200 US insurance executives fielded in mid-2024, 76% said their organization had already implemented generative AI in one or more business functions, and 70% of the property and casualty respondents said the same. Carriers are using AI to triage submissions and process claims, which means the counterparties agents deal with every day increasingly expect clean, fast, structured data on the other side of the transaction. An agency that puts AI to work now is ahead of most of its competitors, where time will aggressively compound their advantage.

### The shortage is in specialized talent

The constraint is not headcount in general. The Jacobson Group and Aon's Q1 2026 labor market study, now in its seventeenth year, found 93% of insurers planning to increase or maintain staff over the next twelve months, with the share planning to hold steady at a fifteen-year high and turnover continuing to fall. Agencies are not emptying out.

What is scarce is the specialist. The person who can read a loss run and know which prior claim will worry an underwriter, who knows which supplemental a given carrier wants for a given class code, who spots a silent coverage downgrade buried in a quote that otherwise looks cheaper. That judgment is built over years on the desk, and it is exactly what retires with an experienced CSR or account manager. Aon and Jacobson report the same pattern: hiring is stable overall, and filling specialized roles remains hard.

That nuance is the whole argument for where AI belongs. The work that requires it (coverage judgment, carrier negotiation, the client conversation) is the work you cannot hire your way out of quickly. The work that does not (data entry, form population, portal and rater navigation, quote normalization) is most of the week. Removing the second so your specialists spend their time on the first is the only lever that scales without a hire, and it is why a tool without insurance-specific depth misses the point: a system that cannot tell a downgrade from a formatting difference just hands the same judgment back to the person who was already short on time.

## What AI can do for Insurance Agents

The practical question is which hours of your team's week a tool gives back. Mapped against the standard commercial workflow, mature AI platforms now cover:

- **Intake and submission prep.** Reading dec pages, loss runs, applications, and schedules; extracting exposures and prior losses; and populating ACORD forms and carrier supplements automatically.
- **Marketing the risk.** Driving live carrier portals, not just generating PDFs, and submitting one risk across every market in parallel, eliminating the most repetitive data entry in the agency.
- **Quote comparison and proposals.** Normalizing mismatched carrier quotes into one clean comparison, flagging coverage differences and silent downgrades, and generating client-ready proposals in the agency's own templates.
- **Renewals and servicing.** Monitoring the book so renewals never slip, pre-filling renewal applications from current-term data, and handling servicing paperwork that otherwise interrupts producers. Liberty Mutual's 2026 study of 1,149 agency principals and staff found retention ranked ahead of every other priority, including new business, with the average agency holding 84% of its book.

Note: this list represents days of a team's busy work that AI can condense into minutes, and it drives the evaluation criteria below.

## How to evaluate an AI tool for your agency: 7 criteria

### 1. End-to-end workflow coverage

Ask first: when the tool finishes, is the job done? A point solution that only extracts data from documents still leaves your team to fill forms, work portals and raters, and build proposals, so the bottleneck moves rather than clears. Map any tool you evaluate against the complete chain: intake, ACORD and supplemental forms, carrier portal submission, quote comparison, proposal, renewal. A submission that enters the system should leave it as a client-ready deliverable. Fewer hand-offs also means fewer places for errors and E&O exposure.

### 2. Measured accuracy, not demo accuracy

Every vendor demos well on clean documents. Ask for accuracy figures on real-world inputs: scanned loss runs, handwritten supplements, inconsistent dec pages. Ask how accuracy is measured and monitored in production. Insist on three things from any vendor: a number, the method behind it, and the ability to verify it on your own book during a pilot.

### 3. Real execution in carrier portals and raters

Much of an agency's manual labor lives inside carrier portals and raters, so a tool that stops at generating a filled PDF leaves the hardest part of the job undone. Verify the platform can actually operate the portals and raters you submit through, including logging in, navigating, entering data, and submitting, and ask how it handles portal changes over time.

### 4. Security, compliance, and data use

You are handling clients' financial, health, and loss information. Minimum bar: SOC 2 Type II certification, HIPAA compliance where relevant, and a contractual commitment that your data is never used to train the vendor's models. Ask also about data retention, access controls, and audit logging, and ask for the SOC 2 report itself.

### 5. Integrates with your existing systems

The tool should meet your workflow where it lives (your AMS, your document sources, your proposal templates) rather than forcing a rip-and-replace. Output that arrives in your own templates gets used, and output that needs reformatting first usually does not.

### 6. Human oversight where it matters

The goal is a reliable AI coworker with clear review points: the ability to see what was extracted, correct it, and approve before anything reaches a carrier or an insured, and for the system to learn from those corrections. The AI does the assembly work, and your producers stay accountable for the advice.

### 7. Insurance-specific depth

Generic AI assistants can draft an email, but they cannot tell a silent coverage downgrade from a formatting difference, or know which supplemental a carrier requires for a given class code. Prefer vendors whose entire product and roadmap is insurance. The feature list shows it: ACORD form submission, underwriting guideline checks, and claims intake are built only by insurance-native teams.

## Where Cooper fits

Cooper is an AI coworker for the entire insurance workflow, from intake to renewal. Send it the documents you already receive: dec pages, loss runs, applications.

From there it works the submission the way your team would. It pulls exposures and prior losses into the right fields, then fills the ACORD forms and carrier supplements automatically. It markets the risk across every carrier in parallel by driving live portals and raters. It normalizes the quotes that come back into one comparison, with coverage differences and silent downgrades flagged. It produces the proposal in your agency's template. Renewals are monitored so none slip.

The results Cooper reports: 99.2% form-fill accuracy, 4x faster time to first quote, and more than $180M in premiums processed, with SOC 2 Type II certification, HIPAA compliance, and no model training on customer data. Against the seven criteria above, Cooper is built to finish the workflow rather than to speed up one step of it.

## Getting started: a low-risk path

- **Pick one painful line of business**, often small commercial or a supplement-heavy niche, and baseline it: hours per submission, days to first quote, touches per renewal.
- **Run a bounded pilot on live submissions** with your own documents and carriers, and verify accuracy and cycle time against the baseline.
- **Keep humans in the loop** with a named owner reviewing outputs during the pilot, then widen autonomy as trust is earned.
- **Expand by workflow, not by tool.** Because an end-to-end platform covers adjacent steps natively, growth means turning on renewals or proposals, not procuring and stitching another vendor.

The technology is in production today, and the result is checkable against the same three numbers you baselined at the start: hours per submission, days to first quote, touches per renewal. Run the pilot, measure it, and decide from there.

## Frequently asked questions

### What can AI actually do for an insurance agency today?

Production-ready AI platforms read intake documents (dec pages, loss runs, applications), fill ACORD forms and carrier supplements, submit risks through live carrier portals and raters in parallel, normalize quotes into side-by-side comparisons, generate client proposals, and monitor renewals. The best tools, like Cooper, cover this entire chain rather than a single step.

### Will AI replace insurance agents?

No. Coverage advice, carrier relationships, negotiation, and client trust remain human work, and that specialist judgment is the hardest thing in the industry to hire for. AI removes the busywork around it so the specialists you already have spend their time there, which is why it reads as leverage on scarce expertise rather than as a substitute for producers.

### What should an agency look for when evaluating AI tools?

Seven things:

- **End-to-end workflow coverage**, so the job is finished rather than moved.
- **Measured real-world accuracy**, on your documents, not the demo set.
- **Execution inside carrier portals and raters**, not just filled PDFs.
- **Security and data-use commitments**: SOC 2 Type II, HIPAA, no training on your data.
- **Integration with your existing AMS and templates.**
- **Human review points** before anything reaches a carrier or an insured.
- **Insurance-specific depth**, built by a team that only does insurance.

### How is Cooper different from other insurance AI tools?

Cooper completes the end-to-end workflow, from intake to renewal, rather than automating one step. It fills forms with **99.2% form-fill accuracy**, drives live carrier portals and raters to market a risk across every carrier in parallel, flags coverage differences and silent downgrades across quotes, delivers proposals in your agency's templates, and reaches first quote **4x faster**. It has processed **more than $180M in premiums** to date.

### Is client data safe with an AI platform like Cooper?

Look for independent attestation. Cooper is SOC 2 Type II certified, HIPAA compliant, and contractually commits to no model training on customer data. Those are the three commitments any agency should require of any AI vendor.

## Sources

1. Big "I" Agents Council for Technology, "2026 TECH Trends Report," released February 19, 2026. National email survey of independent agency members. 68% plan to increase AI use (38% very likely, 30% somewhat likely); 8% embed AI in daily workflows; 31% use no AI tools; efficiency 60%, staff productivity 52%. https://www.independentagent.com/technology-trends-report/
2. Vertafore, "2026 Agency Trends Outlook," February 6, 2026. Survey of 1,300+ US independent agency professionals. 46% only somewhat or not at all prepared to keep pace with technology and market change, rising to 55% at agencies with six or fewer staff. https://www.vertafore.com/resources/ebooks-whitepapers/2026-agency-trends-outlook
3. The Jacobson Group and Aon, "Q1 2026 US Insurance Labor Market Study," seventeenth year. 93% of carriers plan to increase or maintain staff over the next twelve months; the share planning to maintain is at a fifteen-year high; turnover continues to decline while specialized roles remain difficult to fill. https://www.jacobsononline.com/insights/insurance-labor-market-study/
4. Liberty Mutual, "2026 Independent Agency Growth Study." Survey of 1,149 US independent agency principals and staff, fielded online December 2025. 98% rank retention as very important, ahead of new business; average agency retention 84%. https://www.agentforthefuture.com/topics/all-reports/2026-independent-agency-growth-study/
5. Vertafore, consumer survey of 600+ policyholders, published 2025. 83% expect a response within one business day, more than a third within an hour; 21% report receiving proactive outreach. https://www.vertafore.com/resources/policyholder-expectations-independent-agents-2026
6. Deloitte Center for Financial Services, "Are insurers truly ready to scale gen AI?", April 4, 2025. Survey of 200 US insurance executives (100 life and annuity, 100 property and casualty), fielded June 2024. 76% overall, 70% among P&C respondents. https://www.deloitte.com/us/en/insights/industry/financial-services/scaling-gen-ai-insurance.html
7. Cooper product and performance claims: askcooper.ai.
`
