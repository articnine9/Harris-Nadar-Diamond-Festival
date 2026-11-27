"use client";

import { EVENT } from "@/lib/ondine/event";
import { useOffer } from "./offerContext";
import styles from "./Ondine.module.css";

/** The four poster offers, the validity card and the service inclusions. */
export function Offers() {
  const { openOffer } = useOffer();

  return (
    <section className={styles.offers} id="offers">
      <div className={`${styles.wrap} ${styles.offersWrap}`}>
        <div className={styles.offersHead}>
          <div>
            <span className={styles.eyebrow}>Offer valid · {EVENT.validityLabel}</span>
            <h2 className={styles.offersTitle}>
              <span className={styles.offersScript}>Some luxuries</span>
              are simply timeless.
            </h2>
          </div>
          <p>{EVENT.offerIntro}</p>
        </div>

        <div className={styles.offerBlock}>
          <ol className={styles.offerCards}>
            {EVENT.offers.map((offer) => (
              <li key={offer.id} className={styles.offerCard}>
                <span className={styles.offerTag}>{offer.tag || "\u00a0"}</span>
                <span className={styles.offerValue}>
                  <strong>{offer.value}</strong>
                  <em>{offer.unit}</em>
                </span>
                <span className={styles.offerSub}>{offer.sub}</span>
                <small className={styles.offerNote}>{offer.note}</small>
              </li>
            ))}
          </ol>

          <aside className={styles.validity} aria-label="Offer validity">
            <span className={styles.validityEyebrow}>Offer Valid</span>
            <strong>{EVENT.validityLabel}</strong>
            <span className={styles.validitySub}>(Sundays open)</span>
            <span className={styles.validityRule} aria-hidden="true" />
            <strong className={styles.validitySundays}>{EVENT.sundaysDates}</strong>
            <button className={styles.validityCta} type="button" onClick={openOffer}>
              Book Fest Visit
            </button>
          </aside>
        </div>

        <div className={styles.included}>
          <span className={styles.includedLabel}>Also included</span>
          <ul className={styles.includedList}>
            {EVENT.included.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
          <button className={styles.primary} type="button" onClick={openOffer}>
            Reserve your visit
          </button>
        </div>
      </div>
    </section>
  );
}
