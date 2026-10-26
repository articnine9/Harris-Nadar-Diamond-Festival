import type { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "lune",
    numeral: "I",
    kind: "Earrings",
    name: "Lune",
    accent: "drops",
    blurb: "A South Sea pearl hung beneath a single brilliant, so it sways when she turns her head.",
    short: "Pearl · 18K yellow gold",
    specs: [
      ["Pearl", "South Sea, 11 mm, silver-white"],
      ["Stones", "2 × 0.21 ct round, G / VS1"],
      ["Metal", "18K yellow gold · 750"],
    ],
    price: 184000,
    focus: { x: 503, y: 364, z: 7.5 },
    band: [0.19, 0.32],
  },
  {
    id: "source",
    numeral: "II",
    kind: "Pendant",
    name: "Source",
    accent: "pendant",
    blurb: "A pear-cut aquamarine the colour of lit water, ringed with a fine halo of diamonds.",
    short: "Aquamarine · 18K gold",
    specs: [
      ["Centre", "Aquamarine pear, 3.20 ct"],
      ["Halo", "18 × round, 0.36 ct total"],
      ["Chain", "18K yellow gold, 45 cm"],
    ],
    price: 246000,
    focus: { x: 588, y: 524, z: 6.5 },
    band: [0.42, 0.55],
  },
  {
    id: "nocturne",
    numeral: "III",
    kind: "Ring",
    name: "Nocturne",
    accent: "solitaire",
    blurb: "One oval diamond on a knife-edge band. Nothing else on the hand needs to speak.",
    short: "1.50 ct oval · Platinum",
    specs: [
      ["Centre", "Oval, 1.50 ct, F / VS1, GIA"],
      ["Band", "Platinum 950, knife-edge"],
      ["Sizes", "Indian 8 to 20"],
    ],
    price: 690000,
    focus: { x: 768, y: 748, z: 8 },
    band: [0.65, 0.78],
  },
];

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const formatPrice = (rupees: number) => inr.format(rupees);
