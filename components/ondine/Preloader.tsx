"use client";

import { useEffect, useState } from "react";
import type { PreloadState } from "@/lib/ondine/useAssetPreloader";
import styles from "./Ondine.module.css";

type Props = PreloadState & {
  /** What the image assets are called in the status line, e.g. "Frames" or "Photographs". Omit when there are none. */
  unit?: string;
};

/**
 * Shows true progress (decoded images + fonts). No fake timers:
 * if everything is cached the loader disappears almost immediately.
 */
export function Preloader({ loaded, imagesLoaded, total, failed, done, unit }: Props) {
  const [gone, setGone] = useState(false);
  const pct = total ? Math.round((loaded / total) * 100) : 100;

  // Lock scrolling while loading so the story never starts mid-film.
  useEffect(() => {
    if (done) {
      document.documentElement.style.overflow = "";
      const t = setTimeout(() => setGone(true), 700);
      return () => clearTimeout(t);
    }
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [done]);

  if (gone) return null;

  const assetCount = total - 1;
  const assetsLoaded = imagesLoaded;

  return (
    <div className={`${styles.loader} ${done ? styles.loaderDone : ""}`} aria-busy={!done} role="progressbar"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Loading the Diamond Festival">
      <div className={styles.loaderInner}>
        {/* eslint-disable-next-line @next/next/no-img-element -- plain img so it paints before hydration */}
        <img className={styles.loaderLogo} src="/logo-light.png" alt="D. Harris Nadar Diamonds & Jewellery" width={1368} height={229} />
        <span className={styles.loaderPct}>{String(pct).padStart(3, "0")}</span>
        <div className={styles.loaderBar}><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
        <span className={styles.loaderNote}>
          {unit && assetCount > 0 ? `${unit} ${assetsLoaded} / ${assetCount}` : "Preparing the scene"}
          {failed > 0 && ` · ${failed} skipped`}
        </span>
      </div>
    </div>
  );
}
