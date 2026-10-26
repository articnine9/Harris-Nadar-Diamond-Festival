"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Ondine.module.css";

type Bag = { count: number; add: (name: string, qty?: number) => void };
const BagCtx = createContext<Bag | null>(null);

export function useBag() {
  const ctx = useContext(BagCtx);
  if (!ctx) throw new Error("useBag must be used inside <BagProvider>");
  return ctx;
}

/** Local bag state with a confirmation toast. Swap `add` for your cart API (Shopify, Medusa, your own). */
export function BagProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const add = useCallback((name: string, qty = 1) => {
    setCount((c) => c + qty);
    setToast(qty > 1 ? `${qty} × ${name} added to bag` : `${name} added to bag`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <BagCtx.Provider value={{ count, add }}>
      {children}
      <div className={`${styles.toast} ${toast ? styles.toastShow : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </BagCtx.Provider>
  );
}
