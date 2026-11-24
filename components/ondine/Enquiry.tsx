"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { PRODUCTS } from "@/lib/ondine/products";
import styles from "./Ondine.module.css";

const GENERAL = "General enquiry";
const pieceName = (p: (typeof PRODUCTS)[number]) => `${p.name} ${p.accent}`;

type Enquiry = { open: (piece?: string) => void };
const EnquiryCtx = createContext<Enquiry | null>(null);

export function useEnquiry() {
  const ctx = useContext(EnquiryCtx);
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return ctx;
}

/** Stops the page (and the scroll story) from moving behind a <dialog> while it is open. */
export function useDialogScrollLock(ref: RefObject<HTMLDialogElement | null>) {
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const lock = () => document.documentElement.style.setProperty("overflow", "hidden");
    const unlock = () => document.documentElement.style.removeProperty("overflow");
    const obs = new MutationObserver(() => (d.open ? lock() : unlock()));
    obs.observe(d, { attributes: true, attributeFilter: ["open"] });
    return () => { obs.disconnect(); unlock(); };
  }, [ref]);
}

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "error"; message: string };

/** Holds the enquiry popup. Any "Enquire" button calls `open(pieceName)` to show it with that piece chosen. */
export function EnquiryProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [piece, setPiece] = useState(GENERAL);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const open = useCallback((p?: string) => {
    setPiece(p ?? GENERAL);
    setStatus({ kind: "idle" });
    dialogRef.current?.showModal();
  }, []);

  const close = () => dialogRef.current?.close();
  useDialogScrollLock(dialogRef);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not send your enquiry. Please try again.");
      form.reset();
      setStatus({ kind: "sent", name: data.name.split(" ")[0] });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Could not send your enquiry. Please try again." });
    }
  }

  return (
    <EnquiryCtx.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialogRef}
        className={styles.enquiry}
        aria-labelledby="enquiry-title"
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div className={styles.enquiryInner}>
          <button className={styles.enquiryClose} type="button" onClick={close} aria-label="Close">×</button>

          {status.kind === "sent" ? (
            <div className={styles.enquiryDone} role="status">
              <span className={styles.eyebrow}>Enquiry received</span>
              <h2 id="enquiry-title">Thank you, {status.name}.</h2>
              <p>Our showroom team will call you within one working day to talk about the piece and arrange a private viewing.</p>
              <button className={styles.enquirySubmit} type="button" onClick={close}>Close</button>
            </div>
          ) : (
            <form className={styles.enquiryForm} onSubmit={submit}>
              <div className={styles.enquiryHead}>
                <span className={styles.eyebrow}>Diamond Festival</span>
                <h2 id="enquiry-title">Enquire about a piece</h2>
                <p>Leave your details and our showroom team will call you with the price, sizes and a time for a private viewing.</p>
              </div>

              <label className={styles.field}>
                <span>Piece</span>
                <select id="enquiry-piece" name="piece" value={piece} onChange={(e) => setPiece(e.target.value)}>
                  {PRODUCTS.map((p) => <option key={p.id}>{pieceName(p)}</option>)}
                  <option>{GENERAL}</option>
                </select>
              </label>

              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span>Full name</span>
                  <input id="enquiry-name" name="name" required autoComplete="name" maxLength={80} />
                </label>
                <label className={styles.field}>
                  <span>Mobile number</span>
                  <input id="enquiry-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel"
                    pattern="[+0-9 ()-]{10,16}" title="10-digit mobile number, with country code if outside India" maxLength={16} />
                </label>
              </div>

              <label className={styles.field}>
                <span>Email <em>(optional)</em></span>
                <input id="enquiry-email" name="email" type="email" autoComplete="email" maxLength={120} />
              </label>

              <label className={styles.field}>
                <span>Message <em>(optional)</em></span>
                <textarea id="enquiry-message" name="message" rows={3} maxLength={1000}
                  placeholder="Ring size, preferred metal, a date you would like to visit…" />
              </label>

              {status.kind === "error" && <p className={styles.enquiryError} role="alert">{status.message}</p>}

              <button className={styles.enquirySubmit} type="submit" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? "Sending…" : "Send enquiry"}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </EnquiryCtx.Provider>
  );
}
