"use client";

import { EVENT } from "@/lib/ondine/event";
import { useOffer } from "./offerContext";
import styles from "./Ondine.module.css";

/** Dates, hours, address and what to expect — the block the page was missing. */
export function Visit() {
  const { openOffer } = useOffer();

  return (
    <section className={styles.visit} id="visit">
      <div className={`${styles.wrap} ${styles.visitWrap}`}>
        <div className={styles.visitIntro}>
          <span className={styles.eyebrow}>Plan your visit</span>
          <h2>
            Nine days. One showroom. <i>Come and see it.</i>
          </h2>
          <p>
            The whole festival edit will be on the tables — including pieces that never make
            it online. Reserve a slot and a consultant will have the pieces ready when you
            arrive.
          </p>
          <div className={styles.visitActions}>
            <button className={styles.primary} type="button" onClick={openOffer}>
              Reserve your visit
            </button>
            {EVENT.mapUrl && (
              <a className={styles.ghost} href={EVENT.mapUrl} target="_blank" rel="noreferrer">
                Open in maps
              </a>
            )}
          </div>
        </div>

        <dl className={styles.visitFacts}>
          <div>
            <dt>Dates</dt>
            <dd>
              {EVENT.dateLabel}
              <small>{EVENT.hours}</small>
            </dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>
              {EVENT.venue}
              {EVENT.address && <small>{EVENT.address}</small>}
            </dd>
          </div>
          {(EVENT.phone || EVENT.whatsappHref) && (
            <div>
              <dt>Talk to us</dt>
              <dd>
                {EVENT.phone && <a href={EVENT.phoneHref}>{EVENT.phone}</a>}
                {EVENT.landline && (
                  <small>
                    Showroom: <a href={EVENT.landlineHref}>{EVENT.landline}</a>
                  </small>
                )}
                {EVENT.whatsappHref && (
                  <small>
                    <a href={EVENT.whatsappHref} target="_blank" rel="noreferrer">
                      WhatsApp the showroom
                    </a>
                  </small>
                )}
              </dd>
            </div>
          )}
          <div>
            <dt>Booking</dt>
            <dd>
              {EVENT.dailyCap} visits a day
              <small>Walk-ins welcome if a slot is free</small>
            </dd>
          </div>
        </dl>

        <ul className={styles.visitExpect}>
          {EVENT.expectations.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
