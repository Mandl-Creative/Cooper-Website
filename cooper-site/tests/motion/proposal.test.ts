import { test } from 'node:test'
import assert from 'node:assert/strict'
import { COVERAGES, PROPOSAL_END, TITLE, money, proposalFrame } from '../../src/components/lite/panels/proposal.timeline.ts'

const GEO = { bodyH: 300 }

test('frame 0: the page is low, blurred and unwritten', () => {
  const v = proposalFrame(0, GEO)
  assert.ok(Math.abs(v.pageY - 210) < 1e-9)
  assert.ok(v.pageBlur > 1.5)
  assert.equal(v.title, '')
  assert.ok(v.lines.every((l) => l.opacity === 0))
  assert.equal(v.total, '$0')
})

test('the hold is the static page', () => {
  const v = proposalFrame(PROPOSAL_END, GEO)
  assert.equal(v.pageY, 0)
  assert.equal(v.pageBlur, 0)
  assert.equal(v.pageShadow, 1)
  assert.equal(v.backBlur, 2.5)
  assert.equal(v.title, TITLE)
  assert.equal(v.caret, false)
  assert.equal(v.rule, 1)
  assert.equal(v.prepY, 0)
  assert.equal(v.prepOpacity, 1)
  v.lines.forEach((l, i) => {
    assert.deepEqual({ x: l.x, opacity: l.opacity, blur: l.blur, leader: l.leader }, { x: 0, opacity: 1, blur: 0, leader: 1 })
    assert.equal(l.amount, money(COVERAGES[i].amount))
  })
  assert.equal(v.total, '$18,400')
  assert.deepEqual({ s: v.chipScale, o: v.chipOpacity }, { s: 1, o: 1 })
  assert.equal(v.shell.doneOpacity, 1)
})

test('the page lands on the prompt curve', () => {
  const near = (a: number, b: number) => Math.abs(a - b) < 1e-9
  assert.ok(near(proposalFrame(4, GEO).pageY, 0.38 * 300))
  assert.ok(near(proposalFrame(12, GEO).pageY, 0.1 * 300))
  assert.ok(near(proposalFrame(26, GEO).pageY, 0))
})

test('lines arrive in order and the chip overshoots 3% at most', () => {
  COVERAGES.forEach((_, i) => {
    const v = proposalFrame(40 + 14 * i + 1, GEO)
    assert.ok(v.lines[i].opacity > 0)
    if (i + 1 < COVERAGES.length) assert.equal(v.lines[i + 1].opacity, 0)
  })
  let max = 0
  for (let f = 0; f <= PROPOSAL_END; f += 0.25) max = Math.max(max, proposalFrame(f, GEO).chipScale)
  assert.ok(max <= 1.03 + 1e-9 && max > 1)
})

test('deterministic', () => {
  assert.deepEqual(proposalFrame(61.5, GEO), proposalFrame(61.5, GEO))
})
