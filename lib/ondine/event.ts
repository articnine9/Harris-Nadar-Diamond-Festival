/**
 * Every fact about the Diamond Festival lives here.
 *
 * Change the dates, hours, offers or contact details in this one file and the
 * header bar, hero, offer strip, countdown, visit section, popup and footer all
 * update together.
 *
 * The `TODO` notes mark dummy content that must be replaced before launch.
 */
export const EVENT = {
  brand: "D. Harris Nadar Diamonds & Jewellery",
  name: "Diamond Festival",

  startAt: "2026-12-12T10:00:00+05:30",
  endAt: "2026-12-20T21:00:00+05:30",

  dateLabel: "12 — 20 December 2026",
  shortDate: "12–20 Dec",
  heroDate: { range: "12 — 20", month: "December 2026" },
  closeLabel: "20 December",
  durationLabel: "nine days",
  hours: "10:00 am – 9:00 pm, all nine days",

  venue: "D. Harris Nadar showroom",
  // Contact details from the main Harris Nadar website footer.
  // Any value left empty ("") is hidden on the page.
  address: "48/3, 42A Court Road, Opposite Duthie School, Nagercoil, Tamil Nadu 629001" as string,
  mapUrl: "https://www.google.com/maps/search/?api=1&query=D+Harris+Nadar+Jewellery+42A+Court+Road+Nagercoil+629001" as string,
  phone: "+91 97912 49600" as string, // mobile
  phoneHref: "tel:+919791249600" as string,
  landline: "+91 4652 279770" as string,
  landlineHref: "tel:+914652279770" as string,
  // TODO: add the showroom's WhatsApp number if it has one, e.g. "https://wa.me/919791249600".
  whatsappHref: "" as string,

  /** How many showroom visits the team can host each day. */
  dailyCap: 30,

  // Offer wording is deliberately generic: no discount figures until the store confirms one.
  leadOffer: "Special festival offers on diamond jewellery",
  offerShort: "Festival offers",
  productOffer: "Ask about the festival offer on this piece when you book your visit",

  offers: [
    {
      id: "festival-offers",
      title: "Festival offers",
      detail: "Special offers on diamond jewellery across the showroom. Our team shares the details when you visit.",
      note: "Festival days only",
    },
    {
      id: "certification",
      title: "Free certification",
      detail: "BIS hallmarking and GIA grading on every piece you buy.",
      note: "On every piece",
    },
    {
      id: "resizing",
      title: "Resizing for a year",
      detail: "Free resizing on rings and bangles, for a full year after purchase.",
      note: "First year free",
    },
    {
      id: "bridal",
      title: "Bridal consultation",
      detail: "A private 45-minute session with a diamond consultant, by appointment.",
      note: "Limited slots",
    },
  ],

  /** "What to expect" list in the visit section. */
  expectations: [
    {
      title: "The festival edit",
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
