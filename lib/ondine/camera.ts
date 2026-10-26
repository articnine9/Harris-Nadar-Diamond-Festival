import type { Camera } from "./types";
import { PRODUCTS } from "./products";

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export type Keyframes = [progress: number, cam: Camera][];

/**
 * The whole film as scroll keyframes:
 * wide → hold → earring → hold → pendant → hold → ring → hold → fast rewind → wide.
 */
function keyframes(narrow: boolean): Keyframes {
  const wide: Camera = { x: narrow ? 620 : 800, y: 500, z: 1 };
  const [e, p, r] = PRODUCTS.map((x) => x.focus);
  return [
    [0, wide], [0.08, wide],
    [0.2, e], [0.31, e],
    [0.43, p], [0.54, p],
    [0.66, r], [0.77, r],
    [0.86, wide], [1, wide],
  ];
}

/** Camera at a given scroll progress. Zoom is interpolated in log space so the push-in feels even. */
export function cameraAt(progress: number, narrow: boolean): Camera {
  return interpolate(keyframes(narrow), progress);
}

/** Interpolate any set of camera keyframes at a progress value. */
export function interpolate(k: Keyframes, progress: number): Camera {
  for (let i = 0; i < k.length - 1; i++) {
    const [a, A] = k[i];
    const [b, B] = k[i + 1];
    if (progress <= b) {
      const u = easeInOutCubic(clamp((progress - a) / (b - a)));
      return {
        x: lerp(A.x, B.x, u),
        y: lerp(A.y, B.y, u),
        z: Math.exp(lerp(Math.log(A.z), Math.log(B.z), u)),
      };
    }
  }
  return k[k.length - 1][1];
}

/** 0 → 1 → 0 window with soft edges, used for card visibility. */
export function band(p: number, start: number, end: number, fade = 0.025) {
  return clamp(Math.min((p - start) / fade, (end - p) / fade));
}
