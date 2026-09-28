import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  clockReducer as r,
  EXIT_FRAMES,
  initialClock,
  isRunning,
  MAX_STEP,
  TOUR_HOLD,
  tourProgress,
  type ClockState,
} from '../../src/components/lite/motion/clock.ts'

const ENDS = [165, 150, 150, 165, 150, 165]
const run = (s: ClockState, n: number, df = 1): ClockState => {
  for (let i = 0; i < n; i++) s = r(s, { type: 'tick', df })
  return s
}
const offScreen = () => r(initialClock(ENDS), { type: 'hydrate', onScreen: false, reduced: false })
const onScreen = () => r(initialClock(ENDS), { type: 'hydrate', onScreen: true, reduced: false })

test('hydrate off screen arms at f0, plays when seen, holds at the end', () => {
  let s = offScreen()
  assert.equal(s.mode, 'armed')
  assert.equal(s.f, 0)
  s = r(s, { type: 'visible', onScreen: true })
  assert.equal(s.mode, 'playing')
  s = run(s, 10)
  assert.equal(s.f, 10)
  s = r(s, { type: 'hover', on: true })
  s = run(s, 400)
  assert.equal(s.mode, 'hold')
  assert.equal(s.f, 165)
  assert.equal(s.active, 0)
})

test('hydrate on screen stays in hold, then the tour moves on', () => {
  let s = onScreen()
  assert.equal(s.mode, 'hold')
  assert.equal(s.f, 165)
  assert.equal(isRunning(s), true)
  s = run(s, TOUR_HOLD)
  assert.equal(s.active, 1)
  assert.equal(s.mode, 'playing')
  assert.equal(s.f, 0)
  assert.deepEqual(s.outgoing, { index: 0, f: 0 })
})

test('reduced motion at hydrate: hold, no tour, instant selects', () => {
  let s = r(initialClock(ENDS), { type: 'hydrate', onScreen: false, reduced: true })
  assert.equal(s.mode, 'hold')
  assert.equal(s.tour, 'stopped')
  assert.equal(isRunning(s), false)
  s = r(s, { type: 'select', index: 3, byUser: true })
  assert.equal(s.active, 3)
  assert.equal(s.f, 165)
  assert.equal(s.outgoing, null)
})

test('leaving the screen pauses and returning resumes from the same frame', () => {
  let s = r(offScreen(), { type: 'visible', onScreen: true })
  s = run(s, 40)
  s = r(s, { type: 'visible', onScreen: false })
  assert.equal(s.mode, 'paused')
  s = run(s, 30)
  assert.equal(s.f, 40)
  s = r(s, { type: 'visible', onScreen: true })
  s = run(s, 1)
  assert.equal(s.mode, 'playing')
  assert.equal(s.f, 41)
})

test('a second pick while the first panel is still leaving keeps it leaving', () => {
  let s = r(onScreen(), { type: 'select', index: 1, byUser: true })
  s = run(s, 2)
  s = r(s, { type: 'select', index: 2, byUser: true })
  assert.deepEqual(s.outgoing, { index: 0, f: 2 })
  assert.equal(s.active, 2)
  assert.equal(s.f, 0)
  s = run(s, EXIT_FRAMES)
  assert.equal(s.outgoing, null)
})

test('a pick late in the exit replaces the outgoing with the panel on screen', () => {
  let s = r(onScreen(), { type: 'select', index: 1, byUser: true })
  s = run(s, EXIT_FRAMES - 2)
  s = r(s, { type: 'select', index: 2, byUser: true })
  assert.deepEqual(s.outgoing, { index: 1, f: 0 })
  assert.equal(s.active, 2)
})

test('picking the leaving panel again cancels its exit and shows its result', () => {
  let s = r(onScreen(), { type: 'select', index: 1, byUser: true })
  s = run(s, 2)
  s = r(s, { type: 'select', index: 0, byUser: true })
  assert.equal(s.active, 0)
  assert.equal(s.mode, 'hold')
  assert.equal(s.f, 165)
  assert.equal(s.outgoing, null)
})

test('narrow screens get no tour, and going narrow stops it', () => {
  let s = r(initialClock(ENDS), { type: 'hydrate', onScreen: true, reduced: false, wide: false })
  assert.equal(tourProgress(s), null)
  s = run(s, TOUR_HOLD * 2)
  assert.equal(s.active, 0)
  let w = onScreen()
  w = r(w, { type: 'wide', on: false })
  assert.equal(w.tour, 'stopped')
})

test('pointer on the list and focus in the section pause the tour independently', () => {
  let s = r(onScreen(), { type: 'focus', on: true })
  s = r(s, { type: 'hover', on: true })
  s = r(s, { type: 'hover', on: false })
  s = run(s, TOUR_HOLD * 2)
  assert.equal(s.active, 0, 'still paused by focus')
  s = r(s, { type: 'focus', on: false })
  s = run(s, TOUR_HOLD)
  assert.equal(s.active, 1)
})

test('a user click stops the tour for good', () => {
  let s = r(onScreen(), { type: 'select', index: 4, byUser: true })
  s = run(s, 150 + TOUR_HOLD + 10)
  assert.equal(s.active, 4)
  assert.equal(s.mode, 'hold')
  assert.equal(tourProgress(s), null)
  assert.equal(isRunning(s), false)
})

test('the tour wraps from the last capability to the first', () => {
  let s: ClockState = { ...onScreen(), active: 5, f: 165 }
  s = run(s, TOUR_HOLD)
  assert.equal(s.active, 0)
})

test('tour does not advance off screen or while hovering', () => {
  let s = r(onScreen(), { type: 'hover', on: true })
  s = run(s, TOUR_HOLD * 3)
  assert.equal(s.active, 0)
  s = r(s, { type: 'hover', on: false })
  s = r(s, { type: 'visible', onScreen: false })
  s = run(s, TOUR_HOLD * 3)
  assert.equal(s.active, 0)
  assert.equal(isRunning(s), false)
})

test('reduced motion mid-play jumps to the hold and stops the tour', () => {
  let s = r(offScreen(), { type: 'visible', onScreen: true })
  s = run(s, 50)
  s = r(s, { type: 'reduced', on: true })
  assert.equal(s.mode, 'hold')
  assert.equal(s.f, 165)
  assert.equal(s.tour, 'stopped')
  assert.equal(s.outgoing, null)
})

test('a long gap is clamped to MAX_STEP frames', () => {
  let s = r(offScreen(), { type: 'visible', onScreen: true })
  s = r(s, { type: 'tick', df: 1000 })
  assert.equal(s.f, MAX_STEP)
})

test('seek freezes the frame for stills', () => {
  let s = r(onScreen(), { type: 'seek', index: 2, f: 70 })
  s = run(s, 50)
  s = r(s, { type: 'visible', onScreen: false })
  assert.equal(s.mode, 'frozen')
  assert.equal(s.active, 2)
  assert.equal(s.f, 70)
})

test('tourProgress runs from 0 to 1 across the panel and its rest', () => {
  let s = r(offScreen(), { type: 'visible', onScreen: true })
  assert.equal(tourProgress(s), 0)
  s = run(s, 165)
  assert.equal(tourProgress(s), 165 / (165 + TOUR_HOLD))
  s = run(s, TOUR_HOLD - 1)
  assert.equal(tourProgress(s), (165 + TOUR_HOLD - 1) / (165 + TOUR_HOLD))
})
