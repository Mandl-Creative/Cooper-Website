import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shellFrame } from '../../src/components/lite/panels/shell.timeline.ts'

test('the card enters already moving and lands', () => {
  const a = shellFrame(0, 156, 0)
  assert.equal(a.cardOpacity, 0)
  assert.equal(a.cardY, 28)
  assert.ok(a.cardBlurY > 5.9 && a.cardBlurY <= 6)
  const z = shellFrame(165, 156, 1)
  assert.equal(z.cardY, 0)
  assert.equal(z.cardOpacity, 1)
  assert.equal(z.cardBlurY, 0)
})

test('the status chip is never empty while it swaps', () => {
  for (let f = 140; f <= 170; f += 0.25) {
    const v = shellFrame(f, 156, 1)
    assert.ok(v.workOpacity + v.doneOpacity >= 0.5 - 1e-9, `empty chip at f${f}`)
  }
})

test('the hold is the finished chip', () => {
  const v = shellFrame(170, 156, 0.9)
  assert.equal(v.workOpacity, 0)
  assert.equal(v.doneOpacity, 1)
  assert.equal(v.doneY, 0)
  assert.equal(v.doneBlur, 0)
  assert.equal(v.check, 0)
  assert.equal(v.progress, 0.9)
})
