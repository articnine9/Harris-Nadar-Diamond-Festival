"use client";

import { createContext, useCallback, useContext, useRef, type ReactNode, type RefObject } from "react";
import { useEnquiry } from "./Enquiry";

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
 * Holds the initial festival-invitation dialog (`dialogRef`).
 * Button clicks calling `openOffer()` open the full booking/enquiry dialog.
 */
export function OfferProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { open } = useEnquiry();
  const openOffer = useCallback(() => {
    open();
  }, [open]);

  return <Ctx.Provider value={{ openOffer, dialogRef }}>{children}</Ctx.Provider>;
}
