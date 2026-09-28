import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ITEM_AT, QUEUE, SERVICE_END, serviceFrame } from '../../src/components/lite/panels/service.timeline.ts'

test('frame 0: an empty timeline, 60 days out', () => {
  const v = serviceFrame(0)
  assert.equal(v.rail, 0)
  assert.ok(v.items.every((it) => it.opacity === 0))
  assert.equal(v.days, 60)
  assert.equal(v.live, 0)
})

test('the hold is the static queue', () => {
  const v = serviceFrame(SERVICE_END)
  assert.equal(v.rail, 1)
  assert.equal(v.done, 1)
  assert.ok(v.items.every((it) => it.x === 0 && it.opacity === 1 && it.blur === 0 && it.dot === 1))
  assert.equal(v.cert.opacity, 0)
  assert.equal(v.live, 1)
  assert.equal(v.days, 22)
  assert.equal(v.shell.doneOpacity, 1)
})

test('each item arrives as the rail reaches its dot', () => {
  QUEUE.forEach((_, i) => {
    const v = serviceFrame(ITEM_AT[i])
    assert.ok(Math.abs(v.rail - i / (QUEUE.length - 1)) < 1e-9, `rail at item ${i}: ${v.rail}`)
    assert.equal(v.items[i].opacity, 0)
    assert.ok(serviceFrame(ITEM_AT[i] + 1).items[i].opacity > 0)
  })
})

test('the countdown only goes down, and the certificate overshoots 3% at most', () => {
  let prev = 60
  let max = 0
  for (let f = 0; f <= SERVICE_END; f += 0.25) {
    const v = serviceFrame(f)
    assert.ok(v.days <= prev)
    prev = v.days
    max = Math.max(max, v.cert.scale)
  }
  assert.ok(max <= 1.03 + 1e-9 && max > 1)
})

test('deterministic', () => {
  assert.deepEqual(serviceFrame(83.5), serviceFrame(83.5))
})
