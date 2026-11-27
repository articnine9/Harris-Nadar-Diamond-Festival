"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { EVENT } from "@/lib/ondine/event";
import { useDialogScrollLock } from "./Enquiry";
import { FestivalCountdown } from "./Countdown";
import { useOffer } from "./offerContext";
import styles from "./Ondine.module.css";

/*
 * The festival invitation, shown once per browser session shortly after the
 * loading screen. Any "Reserve" button on the page opens the same dialog.
 */
const OFFER_TITLE = "You're invited";
const IMAGE = { src: "/photos/banner-model.jpg", position: "50% 15%" }; // face and diamond necklace

const OPEN_DELAY_MS = 900; // lets the loading screen fade out first

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function OfferPopup({ ready }: { ready: boolean }) {
  const { dialogRef: ref } = useOffer();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const openedRef = useRef(false);
  useDialogScrollLock(ref);

  // Opens shortly after the loading screen has finished.
  useEffect(() => {
    if (!ready || openedRef.current) return;
    const t = setTimeout(() => {
      const d = ref.current;
      if (d && !d.open) {
        openedRef.current = true;
        d.showModal();
      }
    }, OPEN_DELAY_MS);
    return () => clearTimeout(t);
  }, [ready, ref]);

  const close = () => ref.current?.close();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      type: "offer",
      piece: "Festival offer",
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
    };
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not send your details. Please try again.");
      form.reset();
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Could not send your details. Please try again." });
    }
  }

  return (
    <dialog ref={ref} className={styles.offer} aria-labelledby="offer-title" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className={styles.offerInner}>
        <button className={styles.offerClose} type="button" onClick={close} aria-label="Close">×</button>

        <div className={styles.offerImage}>
          <Image src={IMAGE.src} alt="" fill sizes="(max-width: 560px) 92vw, 480px" style={{ objectFit: "cover", objectPosition: IMAGE.position }} />
        </div>

        {status.kind === "sent" ? (
          <div className={styles.offerDone} role="status">
            <h2 id="offer-title">You&apos;re on the list.</h2>
            <p>Our showroom team will reach out to you with the festival offer details.</p>
            <button className={styles.offerSubmit} type="button" onClick={close}>Continue to the festival</button>
          </div>
        ) : (
          <form className={styles.offerForm} onSubmit={submit}>
            <div className={styles.offerHead}>
              <span className={styles.offerEyebrow}>{EVENT.name} {EVENT.year}</span>
              <h2 id="offer-title">{OFFER_TITLE}</h2>
              <p className={styles.offerDates}>{EVENT.dateLabel} · {EVENT.sundays}</p>
              <p>{EVENT.tagline}. {EVENT.leadOffer}, plus free certification and a private bridal consultation.</p>
              <span className={styles.offerClock}>
                <FestivalCountdown variant="inline" />
              </span>
            </div>

            <ul className={styles.offerPerks}>
              {EVENT.offers.map((offer) => (
                <li key={offer.id}>
                  <strong>{offer.value}</strong> {offer.unit}
                  <span>{offer.sub}</span>
                </li>
              ))}
            </ul>

            <input className={styles.offerInput} id="offer-phone" name="phone" type="tel" placeholder="Mobile Number *" aria-label="Mobile number"
              required autoComplete="tel" inputMode="tel" pattern="[+0-9 ()-]{10,16}" maxLength={16}
              title="10-digit mobile number, with country code if outside India" />
            <input className={styles.offerInput} id="offer-email" name="email" type="email" placeholder="Email Address *" aria-label="Email address"
              required autoComplete="email" maxLength={120} />

            {status.kind === "error" && <p className={styles.offerError} role="alert">{status.message}</p>}

            <button className={styles.offerSubmit} type="submit" disabled={status.kind === "sending"}>
              {status.kind === "sending" ? "Sending…" : "Reserve my visit"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
