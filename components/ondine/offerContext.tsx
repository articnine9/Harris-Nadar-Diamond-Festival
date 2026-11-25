"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode, type RefObject } from "react";

type OfferCtx = {
  openOffer: () => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
};

const Ctx = createContext<OfferCtx | null>(null);

export function useOffer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOffer must be used inside <OfferProvider>");
  return ctx;
}

/**
 * Holds the festival-invitation dialog. Any "Reserve" button calls
 * `openOffer()`; the dialog itself lives in <OfferPopup />.
 */
export function OfferProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openOffer = useCallback(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);

  return <Ctx.Provider value={{ openOffer, dialogRef }}>{children}</Ctx.Provider>;
}
