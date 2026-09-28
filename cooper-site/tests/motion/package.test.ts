import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PACKAGE_END, ROWS, packageFrame } from '../../src/components/lite/panels/package.timeline.ts'

const GEO = { rowW: 480 }

test('frame 0: nothing has arrived', () => {
  const v = packageFrame(0, GEO)
  assert.ok(v.rows.every((r) => r.opacity === 0))
  assert.equal(v.pages, 0)
  assert.equal(v.chipOpacity, 0)
})

test('the hold is the collated, bound stack', () => {
  const v = packageFrame(PACKAGE_END, GEO)
  assert.ok(v.rows.every((r) => r.x === 0 && r.y === 0 && r.rot === 0 && r.opacity === 1 && r.smear === 0))
  assert.equal(v.spine, 1)
  assert.equal(v.spineWidth, 1)
  assert.equal(v.spineColor, 'rgb(217, 86, 17)')
  assert.equal(v.pages, 27)
  assert.equal(v.chipScale, 1)
  assert.equal(v.chipOpacity, 1)
  assert.equal(v.shell.doneOpacity, 1)
})

test('rows arrive in order, one every 14 frames', () => {
  ROWS.forEach((_, i) => {
    const s = 8 + 14 * i
    const v = packageFrame(s + 1, GEO)
    assert.ok(v.rows[i].opacity > 0)
    if (i + 1 < ROWS.length) assert.equal(v.rows[i + 1].opacity, 0)
  })
})

test('a row never flies past its slot, and the chip overshoots 3% at most', () => {
  let chipMax = 0
  for (let f = 0; f <= PACKAGE_END; f += 0.25) {
    const v = packageFrame(f, GEO)
    assert.ok(v.rows.every((r) => r.x >= -1e-9), `row past its slot at f${f}`)
    chipMax = Math.max(chipMax, v.chipScale)
  }
  assert.ok(chipMax <= 1.03 + 1e-9 && chipMax > 1)
})

test('the page count only climbs', () => {
  let prev = 0
  for (let f = 0; f <= PACKAGE_END; f += 0.5) {
    const p = packageFrame(f, GEO).pages
    assert.ok(p >= prev)
    prev = p
  }
})

test('deterministic', () => {
  assert.deepEqual(packageFrame(50.75, GEO), packageFrame(50.75, GEO))
})
