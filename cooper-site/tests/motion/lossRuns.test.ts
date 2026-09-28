import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LOSS_END, YEARS, caption, lossFrame } from '../../src/components/lite/panels/lossRuns.timeline.ts'

const GEO = { plotH: 200 }

test('frame 0: nothing counted, nothing risen', () => {
  const v = lossFrame(0, GEO)
  assert.equal(v.total, '$0')
  assert.ok(v.bars.every((b) => b.scale === 0))
  assert.ok(v.docs.every((d) => d.opacity === 0))
  assert.equal(v.shell.cardOpacity, 0)
})

test('the hold is the static chart', () => {
  const v = lossFrame(LOSS_END, GEO)
  v.bars.forEach((b, i) => {
    assert.equal(b.scale, YEARS[i].value === 0 ? 0 : 1)
    assert.equal(b.label, caption(YEARS[i].value))
    assert.equal(b.labelOpacity, 1)
    assert.equal(b.drop, 0)
    assert.equal(b.blurY, 0)
  })
  assert.equal(v.total, '$108,200')
  assert.equal(v.wipe, 1)
  assert.equal(v.tick, 1)
  assert.equal(v.axis, 1)
  assert.equal(v.subY, 0)
  assert.equal(v.subOpacity, 1)
  assert.ok(v.docs.every((d) => d.opacity === 0))
  assert.equal(v.shell.doneOpacity, 1)
})

test('no bar ever overshoots its height', () => {
  for (let f = 0; f <= LOSS_END; f += 0.25) {
    assert.ok(lossFrame(f, GEO).bars.every((b) => b.scale <= 1 + 1e-9), `overshoot at f${f}`)
  }
})

test('the peak rises last and slowest', () => {
  const v = lossFrame(86, GEO)
  const peak = YEARS.findIndex((y) => y.yy === '23')
  assert.ok(v.bars[peak].scale < 0.9)
  v.bars.forEach((b, i) => {
    if (i !== peak && YEARS[i].value > 0) assert.ok(b.scale >= 0.9, `'${YEARS[i].yy} at ${b.scale}`)
  })
})

test('the documents are gone before the first bar moves', () => {
  assert.ok(lossFrame(56, GEO).docs.every((d) => d.opacity === 0))
  assert.ok(lossFrame(52, GEO).bars.every((b) => b.scale === 0))
})

test('deterministic', () => {
  assert.deepEqual(lossFrame(77.25, GEO), lossFrame(77.25, GEO))
})
