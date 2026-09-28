import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  approach,
  approachSpeed,
  charsAt,
  clamp,
  countUp,
  ease,
  hash,
  kf,
  mix,
  typeSchedule,
} from '../../src/components/lite/motion/engine.ts'

test('approach starts at from, covers k of what is left each frame, snaps under eps', () => {
  assert.equal(approach(0, 0, 28, 0), 28)
  assert.equal(approach(-5, 0, 28, 0), 28)
  assert.ok(Math.abs(approach(1, 0, 28, 0) - 28 * 0.83) < 1e-9)
  assert.equal(approach(60, 0, 28, 0), 0)
})

test('approach enters already moving: fastest on its first frame', () => {
  const s0 = approachSpeed(0, 0, 28, 0)
  const s1 = approachSpeed(1, 0, 28, 0)
  assert.ok(s0 > 5 && s0 > s1)
  assert.equal(approachSpeed(60, 0, 28, 0), 0)
})

test('approach is continuous in f (no jumps between quarter frames)', () => {
  for (let f = 0; f < 40; f += 0.25) {
    assert.ok(Math.abs(approach(f + 0.25, 0, 28, 0) - approach(f, 0, 28, 0)) < 1.5)
  }
})

test('kf interpolates, clamps at the ends and applies per-key easing', () => {
  const t = [[0, 0], [10, 1, ease.in], [20, 1]] as const
  assert.equal(kf(-3, t), 0)
  assert.equal(kf(30, t), 1)
  assert.equal(kf(5, [[0, 0], [10, 1]]), 0.5)
  assert.ok(kf(5, t) < 0.5) // cubic-in is behind linear at the midpoint
})

test('hash is deterministic and in [0, 1)', () => {
  for (let i = 0; i < 200; i++) {
    const h = hash(i)
    assert.equal(h, hash(i))
    assert.ok(h >= 0 && h < 1)
  }
})

test('typeSchedule: about one char per frame with a hold every 2 or 3', () => {
  const { times, dur } = typeSchedule('Ridgeline Millwork LLC', 1)
  assert.equal(times.length, 22)
  assert.equal(times[0], 0)
  for (let i = 1; i < times.length; i++) {
    const gap = times[i] - times[i - 1]
    assert.ok(gap === 1 || gap === 2, `gap ${gap} at ${i}`)
  }
  assert.ok(dur >= 29 && dur <= 33, `dur ${dur}`)
  assert.deepEqual(typeSchedule('Ridgeline Millwork LLC', 1), { times, dur })
})

test('charsAt counts characters whose time has come', () => {
  const { times } = typeSchedule('abcdef', 3)
  assert.equal(charsAt(times, -1), 0)
  assert.equal(charsAt(times, 0), 1)
  assert.equal(charsAt(times, 1000), 6)
})

test('mix and clamp', () => {
  assert.equal(mix('#000000', '#ffffff', 0.5), 'rgb(128, 128, 128)')
  assert.equal(mix('#1d1a17', '#4d4c48', 2), 'rgb(77, 76, 72)')
  assert.equal(clamp(2), 1)
})

test('countUp rounds the digits and lands exactly on the target', () => {
  assert.equal(countUp(0, 0, 38), 0)
  assert.equal(countUp(200, 0, 38), 38)
})
