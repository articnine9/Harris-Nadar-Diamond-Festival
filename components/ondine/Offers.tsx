"use client";

import { EVENT } from "@/lib/ondine/event";
import { useOffer } from "./offerContext";
import styles from "./Ondine.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** The four festival offers, where the page does its selling. */
export function Offers() {
  const { openOffer } = useOffer();

  return (
    <section className={styles.offers} id="offers">
      <div className={`${styles.wrap} ${styles.offersWrap}`}>
        <div className={styles.offersHead}>
          <div>
            <span className={styles.eyebrow}>The festival offers</span>
            <h2>
              Four reasons to come in <i>before {EVENT.closeLabel}.</i>
            </h2>
          </div>
          <p>
            {EVENT.leadOffer}, free certification on every piece, and a private bridal
            consultation if you are shopping for the wedding. All of it, for {EVENT.durationLabel} only.
          </p>
        </div>

        <ol className={styles.offerGrid}>
          {EVENT.offers.map((offer, i) => (
            <li key={offer.id}>
              <span className={styles.offerNum}>N°{pad(i + 1)}</span>
              <h3>{offer.title}</h3>
              <p>{offer.detail}</p>
              <small>{offer.note}</small>
            </li>
          ))}
        </ol>

        <div className={styles.offersFoot}>
          <span>
            {EVENT.dateLabel} · {EVENT.hours}
          </span>
          <button className={styles.primary} type="button" onClick={openOffer}>
            Reserve your visit
          </button>
        </div>
      </div>
    </section>
  );
}
