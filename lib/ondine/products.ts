import type { Product } from "./types";

/*
 * Product copy is written from what is visible in the festival photos (01–04).
 * Names and specs are PLACEHOLDERS: replace with the store's real
 * product names, metal purity and stone details before launch.
 * Prices are not shown on the site; visitors enquire instead.
 */
export const PRODUCTS: Product[] = [
  {
    id: "minimals",
    numeral: "I",
    kind: "01 · Category",
    name: "Minimals",
    accent: "edit",
    blurb: "Delicate solitaires, fine chains, and stackable bands crafted for effortless everyday luxury — subtle for daily wear, brilliant up close.",
    short: "Everyday diamonds · Lightweight gold",
    specs: [
      ["Pieces", "Studs, fine chains & bands"],
      ["Metal", "18K & 22K gold"],
      ["Style", "Lightweight everyday luxury"],
    ],
    focus: { x: 503, y: 364, z: 7.5 },
    band: [0.19, 0.32],
  },
  {
    id: "bridal-collection",
    numeral: "II",
    kind: "02 · Category",
    name: "Bridal",
    accent: "collection",
    blurb: "Layered diamond necklaces, chandelier jhumkas, and ceremonial hand harnesses curated for the wedding aisle, muhurtham, and reception.",
    short: "Heirloom sets · Statement solitaires",
    specs: [
      ["Pieces", "Necklaces, jhumkas & sets"],
      ["Lounge", "Private 45-min bridal consultation"],
      ["Assurance", "BIS hallmarked & IGI certified"],
    ],
    focus: { x: 588, y: 524, z: 6.5 },
    band: [0.42, 0.55],
  },
  {
    id: "customization",
    numeral: "III",
    kind: "03 · Category",
    name: "Customization",
    accent: "atelier",
    blurb: "From heirloom stone resetting to one-of-a-kind bridal silhouettes, work one-on-one with our master artisans from first sketch to final setting.",
    short: "Bespoke design · Made to order",
    specs: [
      ["Process", "1-on-1 sketch & 3D preview"],
      ["Stones", "Custom carat, cut & clarity"],
      ["Crafting", "Tailored to your occasion"],
    ],
    focus: { x: 768, y: 748, z: 8 },
    band: [0.65, 0.78],
  },
];
