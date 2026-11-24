import type { PhotoSet } from "./types";

/**
 * The four Diamond Festival photos in /public/photos (WebP, from the shoot's DSC JPEGs).
 *   01 opening shot, 3504 × 2632 (DSC05147: side profile wearing the Cascade drop earring)
 *   03 earring, 02 pendant, 04 ring: 2632 × 3504 portrait (DSC05158, DSC05209, DSC05318)
 * Coordinates are 0–1 fractions of each image, measured from the photos themselves.
 * If you swap in new photos, update these points so the camera lands on the jewel.
 */
export const PHOTOS: PhotoSet = {
  wide: {
    src: "/photos/festival-01.webp",
    subject: { x: 0.5, y: 0.45 },
    frameX: 0.5,
    // 4:3 photo: desktop screens trim top and bottom; keep the face, earring and necklace in view.
    frameY: 0.45,
    points: [
      { x: 0.624, y: 0.473 }, // drop earring
      { x: 0.5, y: 0.858 }, // necklace ruby
      { x: 0.687, y: 0.836 }, // ring
    ],
  },
  closeups: [
    { src: "/photos/festival-03.webp", focus: { x: 0.567, y: 0.37 }, glint: { x: 0.565, y: 0.3 } },
    { src: "/photos/festival-02.webp", focus: { x: 0.52, y: 0.58 }, glint: { x: 0.54, y: 0.54 } },
    { src: "/photos/festival-04.webp", focus: { x: 0.382, y: 0.494 }, glint: { x: 0.37, y: 0.48 } },
  ],
};

export const photoUrls = (set: PhotoSet) => [set.wide.src, ...set.closeups.map((c) => c.src)];
