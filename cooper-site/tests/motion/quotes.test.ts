import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HOVER, MARKETS, QUOTES_END, money, quotesFrame } from '../../src/components/lite/panels/quotes.timeline.ts'

const GEO = { guides: [120, 216] as [number, number], drop: 40, start: { x: -80, y: 510 }, target: { x: 330, y: 230 } }

test('frame 0: nothing has arrived', () => {
  const v = quotesFrame(0, GEO)
  assert.ok(v.raw.every((d) => d.opacity === 0))
  assert.ok(v.cols.every((c) => c.opacity === 0))
  assert.ok(v.premiums.every((p) => p === '$0'))
})

test('the hold is the static comparison', () => {
  const v = quotesFrame(QUOTES_END, GEO)
  assert.ok(v.raw.every((d) => d.opacity === 0))
  assert.ok(v.cols.every((c) => c.y === 0 && c.opacity === 1 && c.blur === 0))
  assert.ok(v.guides.every((g) => g.opacity === 0))
  assert.deepEqual(v.premiums, MARKETS.map((m) => money(m.premium)))
  assert.equal(v.underline, 1)
  assert.deepEqual(v.note, { scale: 1, opacity: 1 })
  assert.equal(v.leader, 1)
  assert.equal(v.cursor.opacity, 0)
  assert.equal(v.shell.doneOpacity, 1)
})

test('each column is always showing something once its document has landed', () => {
  MARKETS.forEach((_, i) => {
    for (let f = 8 + 5 * i + 2; f <= QUOTES_END; f += 0.25) {
      const v = quotesFrame(f, GEO)
      assert.ok(v.raw[i].opacity + v.cols[i].opacity >= 0.5 - 1e-9, `column ${i} empty at f${f}`)
    }
  })
})

test('the cursor is on the deductible when it hovers, and the note overshoots 3% at most', () => {
  const v = quotesFrame(HOVER + 4, GEO)
  assert.ok(Math.hypot(v.cursor.x - GEO.target.x, v.cursor.y - GEO.target.y) < 3)
  let max = 0
  for (let f = 0; f <= QUOTES_END; f += 0.25) max = Math.max(max, quotesFrame(f, GEO).note.scale)
  assert.ok(max <= 1.03 + 1e-9 && max > 1)
})

test('premiums only count up', () => {
  const n = (s: string) => Number(s.replace(/[$,]/g, ''))
  let prev = [0, 0, 0]
  for (let f = 0; f <= QUOTES_END; f += 0.5) {
    const now = quotesFrame(f, GEO).premiums.map(n)
    now.forEach((p, i) => assert.ok(p >= prev[i]))
    prev = now
  }
})

test('deterministic', () => {
  assert.deepEqual(quotesFrame(101.5, GEO), quotesFrame(101.5, GEO))
})
