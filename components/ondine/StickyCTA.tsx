"use client";

import { EVENT } from "@/lib/ondine/event";
import { useOffer } from "./offerContext";
import styles from "./Ondine.module.css";

/** Phone-only strip so the dates and the booking button never scroll away. */
export function StickyCTA() {
  const { openOffer } = useOffer();

  return (
    <div className={styles.stickyCta} role="region" aria-label="Book a festival visit">
      <span>
        {EVENT.shortDate} · {EVENT.offerShort}
      </span>
      <button className={styles.primary} type="button" onClick={openOffer}>
        Book a slot
      </button>
    </div>
  );
}
