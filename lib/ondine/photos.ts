import type { PhotoSet } from "./types";

/**
 * The four campaign photos in /public/photos (1672 × 941 WebP).
 * Coordinates are 0–1 fractions of each image, measured from the photos themselves.
 * If you swap in new photos, update these points so the camera lands on the jewel.
 */
export const PHOTOS: PhotoSet = {
  wide: {
    src: "/photos/poolside-wide.webp",
    subject: { x: 0.3, y: 0.5 },
    points: [
      { x: 0.288, y: 0.3 },   // pearl earring
      { x: 0.285, y: 0.56 },  // aquamarine pendant
      { x: 0.332, y: 0.508 }, // ring
    ],
  },
  closeups: [
    { src: "/photos/earring.webp", focus: { x: 0.275, y: 0.478 }, glint: { x: 0.279, y: 0.361 } },
    { src: "/photos/pendant.webp", focus: { x: 0.275, y: 0.707 }, glint: { x: 0.308, y: 0.614 } },
    { src: "/photos/ring.webp", focus: { x: 0.311, y: 0.494 }, glint: { x: 0.299, y: 0.464 } },
  ],
};

export const photoUrls = (set: PhotoSet) => [set.wide.src, ...set.closeups.map((c) => c.src)];
