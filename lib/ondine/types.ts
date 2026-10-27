/** A point in scene space (the scene is authored on a 1600 × 1000 board) plus a zoom level. */
export type Camera = { x: number; y: number; z: number };

/** Screen-space point (CSS pixels). */
export type Point = { x: number; y: number };

/**
 * An exported image sequence, e.g. from
 *   ffmpeg -i film.mp4 -vf fps=30 -q:v 80 public/frames/f_%04d.webp
 */
export type FrameSource = {
  count: number;
  url: (index: number) => string;
  /** How many frames to fetch in parallel. Default 6. */
  concurrency?: number;
};

export type Product = {
  id: string;
  numeral: string;
  kind: string;
  name: string;
  accent: string;
  blurb: string;
  short: string;
  specs: [label: string, value: string][];
  /** Price in rupees. */
  price: number;
  /** Where the camera lands for this piece. */
  focus: Camera;
  /** Scroll progress window (0–1) where the card is visible. */
  band: [start: number, end: number];
};

/** Normalised image coordinate: 0–1 across the image's width and height. */
export type Norm = { x: number; y: number };

export type PhotoShot = {
  src: string;
  /** Where the jewel sits in this photo; the camera keeps it on the focal point. */
  focus: Norm;
  /** Optional point for an animated twinkle (usually the brightest facet). */
  glint?: Norm;
};

/** One wide establishing photo plus a close-up for each product, in product order. */
export type PhotoSet = {
  wide: {
    src: string;
    /** Where the subject sits, used to frame the wide shot on narrow screens. */
    subject: Norm;
    /** Horizontal point to centre the wide shot on wider screens. Default 0.5. */
    frameX?: number;
    /** Where each product's jewel sits in the wide photo. */
    points: [Norm, Norm, Norm];
  };
  closeups: [PhotoShot, PhotoShot, PhotoShot];
};

export type StoryMode =
  | { kind: "procedural" }
  | { kind: "frames"; count: number }
  | { kind: "photos"; set: PhotoSet };
