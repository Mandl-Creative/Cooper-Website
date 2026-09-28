import { test } from 'node:test'
import assert from 'node:assert/strict'
import { blurFilterValue, move } from '../../src/components/lite/motion/dom.ts'

test('round blur, and nothing under a quarter pixel', () => {
  assert.equal(blurFilterValue({ round: 3 }, null, false), 'blur(3.00px)')
  assert.equal(blurFilterValue({ round: 0.2 }, null, false), '')
})

test('directional smear uses the SVG filter when there is one', () => {
  assert.equal(blurFilterValue({ x: 5 }, 'fx-a', false), 'url(#fx-a)')
  assert.equal(blurFilterValue({ x: 5 }, null, false), '')
  assert.equal(blurFilterValue({ y: 0.1 }, 'fx-a', false), '')
})

test('Safari: no blur on text, no SVG smear', () => {
  assert.equal(blurFilterValue({ round: 3, text: true }, null, true), '')
  assert.equal(blurFilterValue({ round: 3 }, null, true), 'blur(3.00px)')
  assert.equal(blurFilterValue({ x: 6 }, 'fx-a', true), '')
})

test('extra filters ride along, with or without blur', () => {
  const shadow = 'drop-shadow(0 2px 3px rgba(29, 26, 23, .35))'
  assert.equal(blurFilterValue({ round: 2, extra: shadow }, null, false), `blur(2.00px) ${shadow}`)
  assert.equal(blurFilterValue({ extra: shadow }, null, false), shadow)
})

test('move is empty at rest', () => {
  assert.equal(move(0, 0), '')
  assert.equal(move(1.5), 'translate3d(1.50px, 0.00px, 0)')
})
