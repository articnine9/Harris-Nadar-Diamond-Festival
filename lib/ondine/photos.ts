import type { PhotoSet } from "./types";

/**
 * The four Diamond Festival photos in /public/photos (1920 × 800 WebP, made from 01–04.jpg).
 *   01 wide shot · 03 earring · 02 pendant · 04 ring
 * Coordinates are 0–1 fractions of each image, measured from the photos themselves.
 * If you swap in new photos, update these points so the camera lands on the jewel.
 */
export const PHOTOS: PhotoSet = {
  wide: {
    src: "/photos/festival-01.webp",
    subject: { x: 0.3, y: 0.45 },
    // The photo is 2.4:1, so a desktop screen crops the sides; keep the model on the left.
    frameX: 0.34,
    points: [
      { x: 0.206, y: 0.52 }, // drop earring
      { x: 0.269, y: 0.89 }, // necklace
      { x: 0.443, y: 0.76 }, // ring
    ],
  },
  closeups: [
    { src: "/photos/festival-03.webp", focus: { x: 0.193, y: 0.625 }, glint: { x: 0.198, y: 0.369 } },
    { src: "/photos/festival-02.webp", focus: { x: 0.213, y: 0.74 }, glint: { x: 0.21, y: 0.68 } },
    { src: "/photos/festival-04.webp", focus: { x: 0.193, y: 0.45 }, glint: { x: 0.185, y: 0.41 } },
  ],
};

export const photoUrls = (set: PhotoSet) => [set.wide.src, ...set.closeups.map((c) => c.src)];
