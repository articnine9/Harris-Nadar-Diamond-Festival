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
 * - Wide banner photos (wider than the screen) open at full width on desktop instead of
 *   being cropped to fill the height. The photo is pinned to the top; the space below is
 *   filled by stretching its bottom edge downward and blurring it, so it reads as the photo
 *   continuing, and the photo's bottom edge is feathered into that extension.
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

/**
 * Zoom (relative to cover-fit) at which the wide photo exactly fits the screen width.
 * 1 when the photo is not wider than the screen, or on phones (where it always fills).
 */
function fitZoom(img: HTMLImageElement, W: number, H: number, narrow: boolean) {
  if (narrow) return 1;
  const cover = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  return Math.min(1, W / img.naturalWidth / cover);
}

function wideKeys(set: PhotoSet, narrow: boolean, startZoom: number): Keyframes {
  const W = { x: narrow ? set.wide.subject.x : (set.wide.frameX ?? 0.5), y: 0.5, z: startZoom };
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

/**
 * Lay out an image at a zoom (1 = cover-fit), putting `pt` on `focus` without exposing an edge.
 * Below cover size it is centred horizontally and pinned to the top vertically.
 */
function layout(img: HTMLImageElement, W: number, H: number, pt: Norm, zoom: number, focus: Point): Rect {
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * zoom;
  const w = img.naturalWidth * s;
  const h = img.naturalHeight * s;
  const x = w >= W ? clamp(focus.x - pt.x * w, W - w, 0) : (W - w) / 2;
  const y = h >= H ? clamp(focus.y - pt.y * h, H - h, 0) : 0;
  return { x, y, w, h };
}

function place(c: CanvasRenderingContext2D, img: CanvasImageSource & { naturalWidth: number; naturalHeight: number }, W: number, H: number, pt: Norm, zoom: number, focus: Point, alpha: number): Rect {
  const r = layout(img as HTMLImageElement, W, H, pt, zoom, focus);
  c.globalAlpha = alpha;
  c.drawImage(img, r.x, r.y, r.w, r.h);
  c.globalAlpha = 1;
  return r;
}

/* ---- Cached helpers for the full-width desktop opening ---- */

const feathered = new WeakMap<HTMLImageElement, HTMLCanvasElement>();
/** The image with its bottom 28% faded to transparent, made once per image. */
function featheredCopy(img: HTMLImageElement) {
  let cv = feathered.get(img);
  if (cv) return cv;
  cv = document.createElement("canvas");
  cv.width = img.naturalWidth;
  cv.height = img.naturalHeight;
  const x = cv.getContext("2d")!;
  x.drawImage(img, 0, 0);
  x.globalCompositeOperation = "destination-in";
  const g = x.createLinearGradient(0, 0, 0, cv.height);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(0.72, "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, cv.width, cv.height);
  feathered.set(img, cv);
  return cv;
}

let backdrop: { img: HTMLImageElement; key: string; cv: HTMLCanvasElement } | null = null;
/**
 * The photo at full width pinned to the top, with its bottom rows stretched down to the
 * bottom of the screen, then blurred (drawn tiny and scaled back up, which works in every
 * browser). Cached per screen size.
 */
function extendedBackdrop(img: HTMLImageElement, W: number, H: number) {
  const key = `${Math.round(W)}x${Math.round(H)}`;
  if (backdrop && backdrop.img === img && backdrop.key === key) return backdrop.cv;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const fitH = (W / iw) * ih;
  const sharp = document.createElement("canvas");
  sharp.width = Math.max(1, Math.round(W));
  sharp.height = Math.max(1, Math.round(H));
  const s = sharp.getContext("2d")!;
  s.drawImage(img, 0, 0, W, fitH);
  // stretch the bottom 12% of the photo down into the gap (averages out detail), then blur hard
  const band = Math.round(ih * 0.12);
  s.drawImage(img, 0, ih - band, iw, band, 0, fitH - 1, W, Math.max(1, H - fitH + 1));
  const tiny = document.createElement("canvas");
  tiny.width = 12;
  tiny.height = Math.max(1, Math.round((64 * H) / W));
  const t = tiny.getContext("2d")!;
  t.imageSmoothingQuality = "high";
  t.drawImage(sharp, 0, 0, tiny.width, tiny.height);
  const cv = document.createElement("canvas");
  cv.width = sharp.width;
  cv.height = sharp.height;
  const x = cv.getContext("2d")!;
  x.imageSmoothingEnabled = true;
  x.imageSmoothingQuality = "high";
  x.drawImage(tiny, 0, 0, W, H);
  // settle the extension slightly darker towards the bottom of the screen
  const g = x.createLinearGradient(0, fitH, 0, H);
  g.addColorStop(0, "rgba(40,30,20,0)");
  g.addColorStop(1, "rgba(40,30,20,0.28)");
  x.fillStyle = g;
  x.fillRect(0, fitH, W, H - fitH);
  backdrop = { img, key, cv };
  return cv;
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
  const fit = fitZoom(wide, W, H, narrow);
  const cam = interpolate(wideKeys(set, narrow, fit), p);
  const tz = clamp((cam.z - 1) / 1.6);
  const f = { x: lerp(W / 2, focal.x, tz), y: lerp(H / 2, focal.y, tz) };
  const zoom = cam.z * (fit < 1 ? 1 : breathe);
  const r = layout(wide, W, H, { x: cam.x, y: cam.y }, zoom, f);

  // Opening on desktop: photo at full width, pinned to the top, blurred extension below.
  // The sharp un-feathered photo fades back in as the camera pushes past screen height.
  const solid = clamp((r.h / H - 1) / 0.2);
  if (solid < 1) {
    c.drawImage(extendedBackdrop(wide, W, H), 0, 0, W, H);
    c.drawImage(featheredCopy(wide), r.x, r.y, r.w, r.h);
  }
  const blur = clamp((cam.z - 1.4) / 1.2) * 5;
  if (blur > 0.3) c.filter = `blur(${blur.toFixed(1)}px)`;
  if (solid > 0) {
    c.globalAlpha = solid;
    c.drawImage(wide, r.x, r.y, r.w, r.h);
    c.globalAlpha = 1;
  }
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
