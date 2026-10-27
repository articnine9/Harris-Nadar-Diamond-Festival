import type { Product } from "./types";

/*
 * Product copy is written from what is visible in the festival photos (01–04).
 * Names, specs and prices are PLACEHOLDERS: replace with the store's real
 * product names, metal purity, stone details and prices before launch.
 */
export const PRODUCTS: Product[] = [
  {
    id: "cascade",
    numeral: "I",
    kind: "Drop earrings",
    name: "Cascade",
    accent: "drops",
    blurb: "Square links fall on two fine chains from the ear towards the collarbone, catching the light each time she turns her head.",
    short: "Two-tone gold · long drop",
    specs: [
      ["Design", "Square links on twin chains"],
      ["Metal", "Yellow and white gold"],
      ["Finish", "Polished and diamond-cut"],
    ],
    price: 184000,
    focus: { x: 503, y: 364, z: 7.5 },
    band: [0.19, 0.32],
  },
  {
    id: "lotus",
    numeral: "II",
    kind: "Pendant",
    name: "Lotus",
    accent: "pendant",
    blurb: "A cluster of deep blue stones held inside a hexagon of white stones, resting on a pierced gold lotus base.",
    short: "Blue stones · yellow gold",
    specs: [
      ["Centre", "Blue stone cluster"],
      ["Halo", "White stones, hexagon"],
      ["Chain", "Yellow gold, cable link"],
    ],
    price: 246000,
    focus: { x: 588, y: 524, z: 6.5 },
    band: [0.42, 0.55],
  },
  {
    id: "papillon",
    numeral: "III",
    kind: "Cocktail ring",
    name: "Papillon",
    accent: "ring",
    blurb: "Openwork wings in yellow and white gold, raised high on the finger like a butterfly that has only just landed.",
    short: "Two-tone gold filigree",
    specs: [
      ["Design", "Butterfly filigree"],
      ["Metal", "Yellow and white gold"],
      ["Finish", "Textured, diamond-cut"],
    ],
    price: 690000,
    focus: { x: 768, y: 748, z: 8 },
    band: [0.65, 0.78],
  },
];

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatPrice = (rupees: number) => inr.format(rupees);
