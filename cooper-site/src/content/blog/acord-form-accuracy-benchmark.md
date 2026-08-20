Every model card reports a benchmark. Almost none of them tell you whether a tool can finish a submission.

The public numbers measure reading comprehension, reasoning and general document QA. Those are real capabilities, and they are not the job. The job is taking a broker's messy intake and producing an ACORD 125 that a carrier will accept without a follow-up email. So we built our own harness and ran it on real work.

## What we measure

Three tasks, all drawn from submissions brokers actually sent.

**Field-level accuracy on ACORD forms.** Not "did the model produce a plausible form" but "is each field the value a senior broker would have typed." We score per field, because a form that is 90 percent right and wrong on the loss history is not 90 percent useful. It is a rework.

**Loss-run extraction.** Carrier loss runs arrive as scans, as spreadsheets, and as PDFs that are really screenshots of spreadsheets. We measure whether the claim count, the paid and reserved amounts and the dates come out right across all three.

**Carrier portal completion.** Whether the submission can be filed end to end without a person taking over halfway.

## The numbers we are not proud of

Field-level accuracy on the common ACORD forms sits where we want it. Loss-run extraction from clean digital sources does too.

Scanned loss runs are the problem. Where the source is a photocopy of a fax, accuracy drops enough that we do not let it through without review, and we say so in the product rather than hiding it behind a confidence score nobody reads. A tool that is quietly wrong on loss history is worse than no tool, because it moves the error later into the process where it costs more to find.

Carrier portals are the other honest gap. Some are stable and scriptable. Some change their markup without notice, and every change is a silent failure until someone notices a submission did not land.

## Why we publish this

Because the alternative is a marketing number, and a marketing number is worth nothing to a broker deciding whether to trust software with a renewal. If you are evaluating any tool in this category, ask for field-level accuracy on your own forms, ask what happens on a scanned loss run, and ask what the failure looks like when the portal changes.

We will keep publishing these as the harness grows.
