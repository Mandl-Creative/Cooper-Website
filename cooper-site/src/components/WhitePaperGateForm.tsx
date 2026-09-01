/* ──────────────────────────────────────────────────────────────
   Layout A — the gate as a card in the rail beside the paper.

   Reference pattern, checked against how the category actually does it
   (Figma's Forrester TEI report, Mural, ClickUp, Deel, Intercom,
   Sprout Social): the form sits on the page beside the headline rather
   than behind a button. It costs the visitor no click to see what is
   being asked, and four ordinary fields fit in a card.

   Layout A carries a second way in — the card over the blurred
   remainder opens WhitePaperGateModal — because a reader who has
   scrolled that far has left this one behind and should not have to
   hunt back up the page for it.

   Everything except the frame comes from WhitePaperGateFields.
─────────────────────────────────────────────────────────────── */

import { LockSimple } from '@phosphor-icons/react'
import GateFields from './WhitePaperGateFields'
import { useWhitePaperGate } from '../lib/whitePaperGate'

export default function WhitePaperGateForm({ onUnlock }: { onUnlock: (body: string) => void }) {
  const gate = useWhitePaperGate({ variant: 'rail', onUnlock })

  return (
    <div className="rounded-[20px] border border-dark/[0.09] bg-white/60 p-[24px] md:p-[26px]">
      <span className="inline-flex items-center gap-[7px] font-grotesk text-[11px] font-medium uppercase tracking-[1.3px] text-accent-orange">
        <LockSimple size={13} weight="bold" /> Full paper
      </span>
      <h2 className="mt-[10px] font-serif text-[24px] leading-[1.15] text-dark">
        Get the full paper
      </h2>
      <p className="mt-[9px] font-sans text-[14px] leading-[1.55] text-dark/55">
        We read the surveys, traced every figure back to its primary source, and sat
        with the agencies doing this work.
      </p>

      <div className="mt-[20px]">
        <GateFields gate={gate} idPrefix="wpf" submitLabel="Unlock to Read" />
      </div>
    </div>
  )
}
