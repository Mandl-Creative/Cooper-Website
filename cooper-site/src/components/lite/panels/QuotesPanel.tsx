/* 04 · Compare quotes. The JSX is the hold: three aligned columns, market
   B's deductible underlined, the glass note under it. quotes.timeline.ts
   plays the rest. The note hangs from a zero-width box centred on market
   B's column, so it can be wider than the column and still sit centred
   under it without measuring anything. */

import { useRef } from 'react'
import { BlurFilter } from '../motion/BlurFilter'
import { Cursor } from '../motion/Cursor'
import { CURSOR_TIP, applyBlur, move, offsetWithin, setStyle, setText } from '../motion/dom'
import { MARKETS, NOTE, QUOTES_END, ROW_LABELS, money, quotesFrame, type QuotesGeo, type QuotesValues } from './quotes.timeline'
import { Shell } from './Shell'
import { emptyShellRefs, paintShell, type ShellRefs } from './shellPaint'
import type { PanelProps, SceneDef } from './types'
import { usePanelScene } from './usePanelScene'

type Refs = {
  shell: ShellRefs
  cursor: SVGSVGElement | null
  box: HTMLDivElement | null
  raw: (HTMLDivElement | null)[]
  rawFx: (SVGFilterElement | null)[]
  cols: (HTMLDivElement | null)[]
  premiums: (HTMLParagraphElement | null)[]
  rowsA: (HTMLDivElement | null)[]
  dedB: HTMLSpanElement | null
  underline: HTMLSpanElement | null
  guides: (HTMLSpanElement | null)[]
  note: HTMLSpanElement | null
  leader: HTMLSpanElement | null
}

const makeRefs = (): Refs => ({
  shell: emptyShellRefs(),
  cursor: null,
  box: null,
  raw: MARKETS.map(() => null),
  rawFx: MARKETS.map(() => null),
  cols: MARKETS.map(() => null),
  premiums: MARKETS.map(() => null),
  rowsA: ROW_LABELS.map(() => null),
  dedB: null,
  underline: null,
  guides: [null, null],
  note: null,
  leader: null,
})

/** Layout positions (offsetWithin), so measuring mid-scene, with the columns still rising, is exact. */
function measure(r: Refs): QuotesGeo {
  const { card } = r.shell
  const stage = card?.parentElement
  const box = r.box
  const ded = r.dedB
  if (!card || !stage || !box || !ded) return { guides: [0, 0], drop: 40, start: { x: 0, y: 0 }, target: { x: 0, y: 0 } }
  const rowBottom = (i: number) => {
    const row = r.rowsA[i]
    return row ? offsetWithin(row, box).y + row.offsetHeight : 0
  }
  const d = offsetWithin(ded, stage)
  return {
    guides: [rowBottom(0), rowBottom(3)],
    drop: box.clientHeight * 0.14,
    start: { x: card.offsetLeft - 80, y: card.offsetTop + card.offsetHeight + 110 },
    target: { x: d.x + ded.offsetWidth * 0.5, y: d.y + ded.offsetHeight * 0.6 },
  }
}

function paint(v: QuotesValues, r: Refs): void {
  paintShell(v.shell, r.shell)
  v.raw.forEach((d, i) => {
    setStyle(r.raw[i], 'opacity', d.opacity.toFixed(3))
    setStyle(r.raw[i], 'transform', move(0, d.y))
    applyBlur(r.raw[i], { x: d.blurX, y: d.blurY }, r.rawFx[i])
  })
  v.cols.forEach((c, i) => {
    setStyle(r.cols[i], 'transform', move(0, c.y))
    setStyle(r.cols[i], 'opacity', c.opacity === 1 ? '' : c.opacity.toFixed(3))
    applyBlur(r.cols[i], { round: c.blur, text: true })
    setText(r.premiums[i], v.premiums[i])
  })
  v.guides.forEach((g, i) => {
    setStyle(r.guides[i], 'top', `${g.top.toFixed(1)}px`)
    setStyle(r.guides[i], 'transform', `scaleX(${g.scale.toFixed(4)})`)
    setStyle(r.guides[i], 'opacity', g.opacity.toFixed(3))
    applyBlur(r.guides[i], { round: g.blur })
  })
  setStyle(r.underline, 'transform', v.underline === 1 ? '' : `scaleX(${v.underline.toFixed(4)})`)
  setStyle(r.note, 'transform', v.note.scale === 1 ? '' : `scale(${v.note.scale.toFixed(4)})`)
  setStyle(r.note, 'opacity', v.note.opacity === 1 ? '' : v.note.opacity.toFixed(3))
  setStyle(r.leader, 'transform', v.leader === 1 ? '' : `scaleY(${v.leader.toFixed(4)})`)
  const c = v.cursor
  setStyle(r.cursor, 'opacity', c.opacity.toFixed(3))
  setStyle(
    r.cursor,
    'transform',
    c.opacity
      ? `translate3d(${(c.x - CURSOR_TIP.x).toFixed(2)}px, ${(c.y - CURSOR_TIP.y).toFixed(2)}px, 0) rotate(${c.rot.toFixed(2)}deg) scale(${c.scale.toFixed(3)})`
      : '',
  )
  applyBlur(r.cursor, { round: c.blur, extra: c.opacity ? 'drop-shadow(0 2px 3px rgba(29, 26, 23, .35))' : undefined })
}

const SCENE: SceneDef<Refs, QuotesGeo, QuotesValues> = { end: QUOTES_END, measure, frame: quotesFrame, paint }

/* Three different raw layouts, abstract paper with no carrier names. */
function RawDoc({ variant }: { variant: number }) {
  if (variant === 0)
    return (
      <>
        <span className="block h-[6px] w-[48%] rounded-full bg-dark-2/60" />
        <span className="mt-[10px] flex flex-col gap-[6px]">
          {['90%', '76%', '84%', '60%', '88%', '70%', '80%'].map((w) => (
            <span key={w} className="block h-[4px] rounded-full bg-lite-line" style={{ width: w }} />
          ))}
        </span>
      </>
    )
  if (variant === 1)
    return (
      <span className="grid grid-cols-3 gap-[5px]">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={`block h-[14px] rounded-[2px] ${i < 3 ? 'bg-dark-2/35' : 'bg-lite-line'}`} />
        ))}
      </span>
    )
  return (
    <span className="grid grid-cols-2 gap-x-[8px] gap-y-[5px]">
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} className="block h-[3px] rounded-full bg-lite-line" style={{ width: `${60 + ((i * 37) % 40)}%` }} />
      ))}
    </span>
  )
}

export function QuotesPanel({ bind }: PanelProps) {
  const panelRef = useRef<Refs>(makeRefs())
  usePanelScene(bind, panelRef, SCENE)

  return (
    <Shell
      id="quotes"
      label="Quote comparison"
      working="Normalizing"
      done="Normalized"
      holdProgress={1}
      panelRef={panelRef}
      overlay={<Cursor ref={(el) => { panelRef.current.cursor = el }} />}
    >
      {MARKETS.map((m, i) => (
        <BlurFilter key={m.name} id={`lite-fx-quotes-raw-${i}`} ref={(el) => { panelRef.current.rawFx[i] = el }} />
      ))}
      <div ref={(el) => { panelRef.current.box = el }} className="relative grid min-h-0 flex-1 grid-cols-3 divide-x divide-lite-line">
        {MARKETS.map((m, i) => (
          <div key={m.name} className="relative min-w-0 px-[10px] pb-[56px] pt-[20px] sm:px-[16px]">
            <div
              ref={(el) => { panelRef.current.raw[i] = el }}
              className="absolute inset-x-[8px] top-[12px] h-[62%] rounded-[4px] border border-lite-line bg-cream-light p-[10px] opacity-0 shadow-[0_8px_18px_-10px_rgba(29,26,23,.35)]"
            >
              <RawDoc variant={i} />
            </div>
            <div ref={(el) => { panelRef.current.cols[i] = el }} className="relative">
              <p className="truncate text-[11px] font-medium uppercase tracking-[.08em] text-muted">{m.name}</p>
              <p
                ref={(el) => { panelRef.current.premiums[i] = el }}
                className="mt-[10px] font-serif text-[20px] leading-none tabular-nums text-dark-2 sm:text-[26px]"
              >
                {money(m.premium)}
              </p>
              <div className="mt-[16px] border-t border-lite-line">
                {ROW_LABELS.map(([full, short], row) => {
                  const ded = row === 3 && i === 1
                  return (
                    <div
                      key={full}
                      ref={i === 0 ? (el) => { panelRef.current.rowsA[row] = el } : undefined}
                      className="flex h-[40px] flex-col justify-center border-b border-lite-line/70 sm:h-[34px] sm:flex-row sm:items-center sm:justify-between sm:gap-[8px]"
                    >
                      <span className="truncate text-[11px] text-muted sm:text-[12.5px]">
                        <span className="sm:hidden">{short}</span>
                        <span className="hidden sm:inline">{full}</span>
                      </span>
                      <span
                        ref={ded ? (el) => { panelRef.current.dedB = el } : undefined}
                        className="relative shrink-0 text-[12.5px] tabular-nums text-dark-2 sm:text-[14px]"
                      >
                        {m.rows[row]}
                        {ded && (
                          <span
                            ref={(el) => { panelRef.current.underline = el }}
                            className="absolute inset-x-0 bottom-[-3px] h-[2px] origin-left rounded-full bg-accent-orange"
                          />
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
              {i === 1 && (
                <span className="absolute left-1/2 top-[calc(100%+18px)] flex w-0 justify-center">
                  <span
                    ref={(el) => { panelRef.current.leader = el }}
                    className="absolute bottom-full left-0 h-[14px] w-px origin-bottom bg-dark-2/40"
                  />
                  <span
                    ref={(el) => { panelRef.current.note = el }}
                    className="lite-glass inline-flex h-[28px] shrink-0 origin-top items-center gap-[7px] whitespace-nowrap rounded-full px-[12px] text-[12.5px] font-medium text-dark-2"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                      <circle cx="6" cy="6" r="5" fill="none" stroke="#d95611" strokeWidth="1.3" />
                      <path d="M6 5.2v3.3M6 3.4v.1" stroke="#d95611" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    {NOTE}
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
        {[0, 1].map((g) => (
          <span
            key={g}
            ref={(el) => { panelRef.current.guides[g] = el }}
            className="pointer-events-none absolute inset-x-[10px] top-0 h-px origin-left bg-accent-orange/60 opacity-0"
          />
        ))}
      </div>
    </Shell>
  )
}
