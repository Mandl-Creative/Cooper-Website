Give two senior brokers the same submission and ask them to fill the same ACORD form. The two forms will not match. Both will be correct.

One writes the insured's operations as "light metal fabrication." The other writes "sheet metal fabrication and assembly." One lists a location as the mailing address, the other as the primary premises, and either will be accepted. Neither is wrong, and a scoring harness that expects one string will mark one of them a failure.

That breaks the standard evaluation loop, which assumes a reference answer exists.

## Why exact match fails here

Exact match punishes correct work and rewards a model that has learned the reference author's habits. Run it long enough and you optimise for imitating whoever produced your golden set, not for producing a form a carrier will accept.

It also fails silently in the other direction. Two strings can match perfectly and both be wrong, if the field was copied faithfully from a source that was already stale.

## What we score instead

Three things, and none of them is string equality.

**Acceptability.** Would a senior broker send this as written. Scored by brokers, on a sample, blind to whether a person or the system produced the form.

**Provenance.** For every populated field, can the system point at where the value came from. A correct value with no traceable source is a value that happened to be right, and we count it separately, because we cannot tell those two apart at scale any other way.

**Refusal quality.** What the system does when the source genuinely does not contain the answer. Leaving a field blank and flagging it is the correct behaviour, and a harness that only measures fill rate will score that as failure and train the habit out.

## The uncomfortable part

Acceptability needs humans, humans are slow, and that caps how fast this loop runs. We are not going to pretend otherwise by substituting a metric that is cheap and wrong.

So the automated scores gate the obvious regressions and the human panel decides whether a change ships. It is slower than a number that updates on every commit. It is measuring the thing we actually care about.
