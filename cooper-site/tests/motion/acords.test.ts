import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  ACORDS_END,
  B_IN,
  CLICK,
  CUT,
  FIELDS_A,
  FILLED_B,
  PRESS,
  TOTAL_B,
  acordsFrame,
} from '../../src/components/lite/panels/acords.timeline.ts'

const GEO = { start: { x: 730, y: 510 }, target: { x: 190, y: 90 } }
const every = (a: number, b: number, fn: (f: number) => void) => {
  for (let f = a; f <= b; f += 0.25) fn(f)
}

test('frame 0: the card is on its way in and nothing is typed yet', () => {
  const v = acordsFrame(0, GEO)
  assert.equal(v.shell.cardOpacity, 0)
  assert.ok(v.fieldsA.every((fd) => fd.text === ''))
  assert.equal(v.count, 0)
  assert.equal(v.cursor.opacity, 0)
})

test('the hold is the static markup: ACORD 126 filled, pill on 126, no cursor, no tags', () => {
  const v = acordsFrame(ACORDS_END, GEO)
  assert.equal(v.sheetA.visible, false)
  assert.deepEqual(v.sheetB, { visible: true, x: 0, opacity: 1, smear: 0 })
  assert.ok(v.fieldsB.every((fd) => fd.y === 0 && fd.opacity === 1))
  assert.equal(v.count, FILLED_B)
  assert.equal(v.total, TOTAL_B)
  assert.equal(v.pill, 1)
  assert.equal(v.cursor.opacity, 0)
  assert.ok(v.fieldsA.every((fd) => fd.tagOpacity === 0))
  assert.equal(v.shell.doneOpacity, 1)
  assert.equal(v.shell.workOpacity, 0)
})

test('one caret at a time', () => {
  every(0, ACORDS_END, (f) => {
    const carets = acordsFrame(f, GEO).fieldsA.filter((fd) => fd.caret).length
    assert.ok(carets <= 1, `${carets} carets at f${f}`)
  })
})

test('the sheet switch never leaves the panel empty', () => {
  every(CLICK, CUT + 12, (f) => {
    const v = acordsFrame(f, GEO)
    const shown = (v.sheetA.visible ? v.sheetA.opacity : 0) + (v.sheetB.visible ? v.sheetB.opacity : 0)
    assert.ok(shown >= 0.5 - 1e-9, `only ${shown} showing at f${f}`)
  })
  assert.equal(acordsFrame(B_IN - 0.5, GEO).sheetB.visible, false)
})

test('the cursor is on the tab when it presses, and the tags have gone', () => {
  const v = acordsFrame(PRESS, GEO)
  assert.ok(Math.hypot(v.cursor.x - GEO.target.x, v.cursor.y - GEO.target.y) < 3)
  assert.ok(v.fieldsA.every((fd) => fd.tagOpacity === 0))
})

test('every field of ACORD 125 is typed in full before the click', () => {
  const v = acordsFrame(CLICK, GEO)
  v.fieldsA.forEach((fd, i) => assert.equal(fd.text, FIELDS_A[i].value))
})

test('the counter only climbs while ACORD 125 fills', () => {
  let prev = 0
  every(0, B_IN - 0.25, (f) => {
    const c = acordsFrame(f, GEO).count
    assert.ok(c >= prev, `count fell at f${f}`)
    prev = c
  })
  assert.equal(prev, 38)
})

test('deterministic', () => {
  assert.deepEqual(acordsFrame(70.5, GEO), acordsFrame(70.5, GEO))
})
