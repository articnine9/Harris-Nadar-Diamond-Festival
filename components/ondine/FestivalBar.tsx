"use client";

import { EVENT } from "@/lib/ondine/event";
import { FestivalCountdown } from "./Countdown";
import { useOffer } from "./offerContext";
import styles from "./Ondine.module.css";

/** Always-visible festival strip above the header: dates, countdown, booking. */
export function FestivalBar() {
  const { openOffer } = useOffer();

  return (
    <div className={styles.festivalBar} role="region" aria-label="Festival announcement">
      <div className={styles.festivalBarInner}>
        <span className={styles.festivalBarName}>{EVENT.name}</span>
        <span className={styles.festivalBarDot} aria-hidden="true" />
        <span className={styles.festivalBarDates}>{EVENT.dateLabel}</span>
        <span className={styles.festivalBarClock}>
          <FestivalCountdown variant="bar" />
        </span>
        <span className={styles.festivalBarClockShort}>
          <FestivalCountdown variant="bar" compact />
        </span>
        <button className={styles.festivalBarCta} type="button" onClick={openOffer}>
          Book Fest Visit
        </button>
      </div>
    </div>
  );
}
