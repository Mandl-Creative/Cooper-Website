/* ──────────────────────────────────────────────────────────────
   Motion engine for the /lite capability panels.

   Everything here is a pure function of the frame number f, counted at 30
   frames per second and read at fractional frames, so the same f always
   draws the same picture: a panel can be scrubbed, frozen for a still, or
   tested in Node. The rules it serves are in the motion prompt for these
   panels: everything enters already moving, blur follows speed, nothing
   crossfades at rest, nothing uses Math.random.

   Files in motion/ and panels/*.timeline.ts import each other with the .ts
   extension because the tests run them directly in Node, which needs it.
─────────────────────────────────────────────────────────────── */

export const FPS = 30

export type Ease = (t: number) => number
export type Key = readonly [frame: number, value: number, ease?: Ease]

export const clamp = (v: number, lo = 0, hi = 1): number => Math.min(hi, Math.max(lo, v))
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export const ease = {
  linear: (t: number) => t,
  /** Accelerating: how things leave. */
  in: (t: number) => t * t * t,
  out: (t: number) => 1 - (1 - t) ** 3,
  inOut: (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
} satisfies Record<string, Ease>

/** Keyframe table: linear between keys unless a key carries its own easing. */
export function kf(f: number, table: readonly Key[], fallback: Ease = ease.linear): number {
  if (f <= table[0][0]) return table[0][1]
  for (let i = 1; i < table.length; i++) {
    const [f1, v1, segEase] = table[i]
    const [f0, v0] = table[i - 1]
    if (f <= f1) return lerp(v0, v1, (segEase ?? fallback)((f - f0) / (f1 - f0)))
  }
  return table[table.length - 1][1]
}

/**
 * Exponential ease-out that starts at full speed: every frame it covers k of
 * the distance left, so the element enters already moving. Snaps to the
 * target once what is left is under eps.
 */
export function approach(f: number, f0: number, from: number, to: number, k = 0.17, eps = 0.15): number {
  if (f <= f0) return from
  const left = (from - to) * (1 - k) ** (f - f0)
  return Math.abs(left) < eps ? to : to + left
}

/** Speed of the same curve, in units per frame. Blur is derived from it. */
export function approachSpeed(f: number, f0: number, from: number, to: number, k = 0.17, eps = 0.15): number {
  if (f < f0) return 0
  const left = (from - to) * (1 - k) ** (f - f0)
  return Math.abs(left) < eps ? 0 : Math.abs(left * Math.log(1 - k))
}

/** Seeded hash in [0, 1). Stands in for Math.random, which is banned. */
export function hash(i: number): number {
  let x = Math.imul((i + 1) ^ 0x9e3779b9, 0x85ebca6b)
  x ^= x >>> 13
  x = Math.imul(x, 0xc2b2ae35)
  x ^= x >>> 16
  return (x >>> 0) / 4294967296
}

export type TypeSchedule = { times: number[]; dur: number }

/** About one character per frame, with a one-frame hold every two or three. */
export function typeSchedule(text: string, seed: number): TypeSchedule {
  const times: number[] = []
  let t = 0
  let run = 0
  let next = 2 + Math.round(hash(seed * 97))
  for (let c = 0; c < text.length; c++) {
    times.push(t)
    t += 1
    run += 1
    if (run >= next) {
      t += 1
      run = 0
      next = 2 + Math.round(hash(seed * 97 + c + 1))
    }
  }
  return { times, dur: t }
}

/** How many characters are showing `local` frames after typing started. */
export function charsAt(times: readonly number[], local: number): number {
  let n = 0
  while (n < times.length && times[n] <= local) n++
  return n
}

/** Mix two #rrggbb colours. */
export function mix(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  const c = pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(t))))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

/** A count-up for display: only the shown digits are rounded, never the motion. */
export function countUp(f: number, f0: number, to: number, k = 0.2): number {
  return Math.round(approach(f, f0, 0, to, k, 0.5))
}
