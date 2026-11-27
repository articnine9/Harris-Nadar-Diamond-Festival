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
    src: "/photos/banner-wide.webp",
    subject: { x: 0.56, y: 0.45 },
    frameX: 0.5,
    frameY: 0.5,
    points: [
      { x: 0.62, y: 0.42 }, // Minimals: drop earring & stud detail
      { x: 0.57, y: 0.66 }, // Bridal collection: layered diamond necklace
      { x: 0.41, y: 0.82 }, // Customization: bespoke haath phool & handcraft
    ],
  },
  closeups: [
    { src: "/photos/festival-03.webp", focus: { x: 0.567, y: 0.37 }, glint: { x: 0.565, y: 0.3 } },
    { src: "/photos/festival-02.webp", focus: { x: 0.52, y: 0.58 }, glint: { x: 0.54, y: 0.54 } },
    { src: "/photos/festival-04.webp", focus: { x: 0.382, y: 0.494 }, glint: { x: 0.37, y: 0.48 } },
  ],
};

export const photoUrls = (set: PhotoSet) => [set.wide.src, ...set.closeups.map((c) => c.src)];
