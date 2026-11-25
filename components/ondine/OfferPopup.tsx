"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { EVENT } from "@/lib/ondine/event";
import { useDialogScrollLock } from "./Enquiry";
import { FestivalCountdown } from "./Countdown";
import { useOffer } from "./offerContext";
import styles from "./Ondine.module.css";

/*
 * The festival invitation, shown on every page load shortly after the
 * loading screen. Any "Reserve" button on the page opens the same dialog.
 */
const OFFER_TITLE = "Your Diamond Festival invitation";
const IMAGE = { src: "/photos/festival-01.webp", position: "50% 18%" }; // face and drop earring
const INTERESTS = ["Diamond Earrings", "Diamond Necklaces & Pendants", "Diamond Rings", "Bridal Diamond Sets"];
const SLOTS = ["10:00 AM - 12:00 PM", "12:00 PM - 02:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM"];

const OPEN_DELAY_MS = 900; // lets the loading screen fade out first

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "error"; message: string };

export function OfferPopup({ ready }: { ready: boolean }) {
  const { dialogRef: ref, openOffer } = useOffer();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [hasDate, setHasDate] = useState(false);
  useDialogScrollLock(ref);

  // Opens on every page load, once the loading screen has finished.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(openOffer, OPEN_DELAY_MS);
    return () => clearTimeout(t);
  }, [ready, openOffer]);

  const close = () => ref.current?.close();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      type: "offer",
      piece: "Festival offer",
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      visitDate: String(fd.get("visitDate") ?? ""),
      visitTime: String(fd.get("visitTime") ?? ""),
      interests: fd.getAll("interests").map(String),
    };
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not send your details. Please try again.");
      form.reset();
      setHasDate(false);
      setStatus({ kind: "sent", name: payload.name.split(" ")[0] });
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
            <h2 id="offer-title">Your slot is booked, {status.name}.</h2>
            <p>Our showroom team will call you to confirm your visit and the festival offer.</p>
            <button className={styles.offerSubmit} type="button" onClick={close}>Continue to the festival</button>
          </div>
        ) : (
          <form className={styles.offerForm} onSubmit={submit}>
            <div className={styles.offerHead}>
              <span className={styles.offerEyebrow}>{EVENT.name}</span>
              <h2 id="offer-title">{OFFER_TITLE}</h2>
              <p className={styles.offerDates}>{EVENT.dateLabel} · {EVENT.hours}</p>
              <p>{EVENT.leadOffer}, plus free certification and a private bridal consultation.</p>
              <span className={styles.offerClock}>
                <FestivalCountdown variant="inline" />
              </span>
            </div>

            <input className={styles.offerInput} id="offer-name" name="name" placeholder="Your Name *" aria-label="Your name"
              required autoComplete="name" maxLength={80} />
            <input className={styles.offerInput} id="offer-phone" name="phone" type="tel" placeholder="Mobile Number *" aria-label="Mobile number"
              required autoComplete="tel" inputMode="tel" pattern="[+0-9 ()-]{10,16}" maxLength={16}
              title="10-digit mobile number, with country code if outside India" />
            {/* Phones show an empty date input as a blank box, so draw our own placeholder over it. */}
            <div className={styles.offerDate}>
              <input className={styles.offerInput} id="offer-date" name="visitDate" type="date" aria-label="Visit date"
                required min={today()} max={EVENT.endAt.slice(0, 10)} onChange={(e) => setHasDate(Boolean(e.target.value))} />
              {!hasDate && <span className={styles.offerDateHint} aria-hidden="true">Select Date *</span>}
            </div>
            <select className={styles.offerInput} id="offer-time" name="visitTime" aria-label="Visit time" required defaultValue="">
              <option value="" disabled>Select Time *</option>
              {SLOTS.map((s) => <option key={s}>{s}</option>)}
            </select>

            <fieldset className={styles.offerChecks}>
              <legend className={styles.srOnly}>Interested in</legend>
              {INTERESTS.map((label, i) => (
                <label key={label}>
                  <input type="checkbox" id={`offer-interest-${i}`} name="interests" value={label} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>

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
