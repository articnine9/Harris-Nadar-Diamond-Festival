/**
 * Photo mode: fakes one continuous camera move from four stills.
 *
 * - A "camera" travels over the wide photo, zooming toward each jewel and panning
 *   between them (earring → pendant → ring), then rewinds to the wide shot.
 * - As the camera arrives, the matching close-up dissolves in from a larger scale,
 *   with its jewel locked to the same screen point, so the cut reads as a push-in.
 * - Each close-up keeps drifting in slowly while its product card is up, then pushes
 *   through and dissolves back into the travelling wide shot.
 * - A light motion blur is applied while the camera is deep into the wide photo,
 *   which hides the upscaling and sells the movement (Chrome / Firefox / Edge).
 */
import type { Norm, PhotoSet, Point } from "./types";
import { clamp, easeInOutCubic, interpolate, lerp, type Keyframes } from "./camera";
import { sparkle } from "./scene";

/** How far the wide camera pushes toward each jewel before the close-up takes over. */
const WIDE_ZOOM = [2.6, 2.3, 2.6];

/** Close-up windows in scroll progress: [fade-in start, fully in, push-out start, gone]. */
export const CLOSE_WINDOWS: [number, number, number, number][] = [
  [0.14, 0.2, 0.31, 0.36],
  [0.37, 0.43, 0.54, 0.59],
  [0.6, 0.66, 0.77, 0.8],
];

function wideKeys(set: PhotoSet, narrow: boolean): Keyframes {
  const W = { x: narrow ? set.wide.subject.x : 0.5, y: 0.5, z: 1 };
  const [e, p, r] = set.wide.points.map((pt, i) => ({ x: pt.x, y: pt.y, z: WIDE_ZOOM[i] }));
  return [
    [0, W], [0.08, W],
    [0.2, e], [0.31, e],
    [0.43, p], [0.54, p],
    [0.66, r], [0.77, r],
    [0.86, W], [1, W],
  ];
}

type Rect = { x: number; y: number; w: number; h: number };

/** Cover-fit an image at a zoom, putting `pt` on `focus` without ever exposing an edge. */
function place(c: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number, pt: Norm, zoom: number, focus: Point, alpha: number): Rect {
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * zoom;
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  const x = clamp(focus.x - pt.x * w, W - w, 0);
  const y = clamp(focus.y - pt.y * h, H - h, 0);
  c.globalAlpha = alpha;
  c.drawImage(img, x, y, w, h);
  c.globalAlpha = 1;
  return { x, y, w, h };
}

export type PhotoRenderOptions = {
  width: number;
  height: number;
  dpr: number;
  progress: number;
  time: number;
  narrow: boolean;
  set: PhotoSet;
  /** [wide, earring, pendant, ring]; missing entries are skipped. */
  images: (HTMLImageElement | null)[];
};

export function renderPhotos(c: CanvasRenderingContext2D, o: PhotoRenderOptions) {
  const { width: W, height: H, dpr, progress: p, time, narrow, set, images } = o;
  const [wide, ...close] = images;

  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = "#060c11";
  c.fillRect(0, 0, W, H);
  if (!wide) return;

  // Jewels settle left of centre on desktop (card on the right), upper third on phones (card below).
  // Desktop: the drawer covers the right ~46%, so jewels settle in the middle of the open left side.
  const focal: Point = narrow ? { x: W * 0.5, y: H * 0.32 } : { x: W * 0.28, y: H * 0.5 };
  const breathe = 1 + 0.012 * Math.sin(time * 0.35);

  // Wide camera
  const cam = interpolate(wideKeys(set, narrow), p);
  const tz = clamp((cam.z - 1) / 1.6);
  const f = { x: lerp(W / 2, focal.x, tz), y: lerp(H / 2, focal.y, tz) };
  const blur = clamp((cam.z - 1.4) / 1.2) * 5;
  if (blur > 0.3) c.filter = `blur(${blur.toFixed(1)}px)`;
  place(c, wide, W, H, { x: cam.x, y: cam.y }, cam.z * breathe, f, 1);
  c.filter = "none";

  // Close-ups
  CLOSE_WINDOWS.forEach(([a, b, out0, out1], i) => {
    if (p < a || p > out1) return;
    const img = close[i];
    if (!img) return;
    const shot = set.closeups[i];
    const fin = easeInOutCubic(clamp((p - a) / (b - a)));
    const fout = easeInOutCubic(clamp((p - out0) / (out1 - out0)));
    const alpha = fin * (1 - fout);
    const scale = p < b ? lerp(1.35, 1.04, fin) : p < out0 ? lerp(1.04, 1.1, (p - b) / (out0 - b)) : lerp(1.1, 1.32, fout);

    // Portrait screens crop a 16:9 photo hard, so zoom close-ups further to lift low jewels clear of the card.
    const r = place(c, img, W, H, shot.focus, scale * (narrow ? 1.25 : 1), focal, alpha);

    if (shot.glint && alpha > 0.05) {
      const gx = r.x + shot.glint.x * r.w;
      const gy = r.y + shot.glint.y * r.h;
      const twinkle = 0.3 + 0.7 * Math.pow(Math.abs(Math.sin(time * 1.2 + i * 1.7)), 6);
      sparkle(c, gx, gy, Math.min(W, H) * 0.045, twinkle * alpha * 0.55);
    }
  });

  c.setTransform(1, 0, 0, 1, 0, 0);
}
