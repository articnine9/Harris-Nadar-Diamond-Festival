/**
 * Every fact about the Dazzling Diamond Fest lives here.
 *
 * Change the dates, offers, venue or contact details in this one file and the
 * header bar, hero, offer cards, countdown, visit section, popup and footer all
 * update together.
 *
 * Copy is taken from the printed 2026 festival poster. Replace the `TODO`
 * values (email, exact opening hours, WhatsApp) before launch.
 */
export const EVENT = {
  brand: "D. Harris Nadar Diamonds & Jewellery",
  name: "Dazzling Diamond Fest",
  year: "2026",
  tagline: "Some Luxuries are Simply Timeless",

  startAt: "2026-12-17T10:00:00+05:30",
  endAt: "2026-12-24T21:00:00+05:30",

  dateLabel: "17 — 24 December 2026",
  shortDate: "17–24 Dec",
  heroDate: { range: "17 — 24", month: "December 2026" },
  closeLabel: "24 December",
  durationLabel: "eight days",
  // TODO: the poster does not state opening hours — confirm with the showroom.
  hours: "10:00 am – 9:00 pm, all eight days",

  validityLabel: "17th – 24th December",
  sundays: "Sundays open · 20 & 27 December",
  sundaysDates: "20th & 27th December",

  venue: "D. Harris Nadar showroom",
  address: "48/3, 42A Court Road, Duthie School Junction, Nagercoil, Tamil Nadu 629001" as string,
  mapUrl: "https://www.google.com/maps/search/?api=1&query=D+Harris+Nadar+Jewellery+Duthie+School+Junction+Nagercoil+629001" as string,
  // The poster leads with the showroom landline.
  phone: "+91 4652 279770" as string,
  phoneHref: "tel:+914652279770" as string,
  mobile: "+91 97912 49600" as string,
  mobileHref: "tel:+919791249600" as string,
  // TODO: add the showroom's WhatsApp number if it has one, e.g. "https://wa.me/919791249600".
  whatsappHref: "" as string,
  // TODO: the poster's email is unreadable at print resolution — add it when confirmed.
  socials: [
    { label: "harrisnadar.com", href: "https://harrisnadar.com" },
    { label: "@harrisnadar", href: "https://www.instagram.com/harrisnadar/" },
    { label: "harrisnadarjewellery", href: "https://www.facebook.com/harrisnadarjewellery" },
  ],

  /** How many showroom visits the team can host each day. */
  dailyCap: 30,

  // Headline wording, used in sentences across the page.
  leadOffer: "Up to 30% off gold jewellery and ₹20,000 off per carat",
  offerShort: "Offer valid 17–24 Dec",
  productOffer: "Festival offer: up to 30% off gold jewellery and ₹20,000 off per carat, 17–24 December.",
  offerIntro:
    "Four ways to save at the showroom, from 17 to 24 December. Every offer is applied at the counter — reserve a slot and we will have the pieces ready.",

  /** The four price offers, exactly as printed on the poster. */
  offers: [
    {
      id: "per-carat",
      tag: "",
      value: "₹20,000",
      unit: "Off",
      sub: "Per carat",
      note: "On diamond solitaires. Terms and conditions apply.",
    },
    {
      id: "gold",
      tag: "Upto",
      value: "30%",
      unit: "Off*",
      sub: "On gold jewellery",
      note: "*On MRP. Only gold jewellery. Exclusive for our existing customers.",
    },
    {
      id: "platinum",
      tag: "Flat",
      value: "15%",
      unit: "Off",
      sub: "Platinum making charges",
      note: "On platinum making charges during the festival.",
    },
    {
      id: "solitaire",
      tag: "",
      value: "10%",
      unit: "Off",
      sub: "On solitaire diamonds",
      note: "On solitaire diamond purchases during the festival.",
    },
  ],

  /** Service inclusions shown in a slim strip under the four offers. */
  included: [
    {
      title: "Free certification",
      detail: "BIS hallmarking and grading papers with every piece.",
    },
    {
      title: "Resizing for a year",
      detail: "Free resizing on rings and bangles for a full year.",
    },
    {
      title: "Bridal consultation",
      detail: "A private 45-minute session with a diamond consultant.",
    },
  ],

  /** "What to expect" list in the visit section. */
  expectations: [
    {
      title: "The dazzling edit",
      detail: "The full collection on the tables, including pieces not shown online.",
    },
    {
      title: "Bridal lounge",
      detail: "A quiet room for families, with a consultant who stays with you.",
    },
    {
      title: "Certified diamonds",
      detail: "Every stone graded, every piece hallmarked, all paperwork in hand.",
    },
  ],
} as const;

export const EVENT_START_MS = Date.parse(EVENT.startAt);
export const EVENT_END_MS = Date.parse(EVENT.endAt);

export type EventState = "upcoming" | "live" | "ended";

export function eventState(now = Date.now()): EventState {
  if (now < EVENT_START_MS) return "upcoming";
  if (now <= EVENT_END_MS) return "live";
  return "ended";
}
