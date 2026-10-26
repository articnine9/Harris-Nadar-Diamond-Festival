"use client";

import { useEffect, useRef, useState } from "react";

export type PreloadState = {
  /** Assets finished (decoded or failed), fonts included. */
  loaded: number;
  /** Images finished (decoded or failed), fonts excluded. */
  imagesLoaded: number;
  total: number;
  failed: number;
  done: boolean;
};

/**
 * Loads and *decodes* every image (img.decode()), so the bar reflects images that can
 * actually be drawn without a stall, plus one unit for web fonts.
 * Images load in list order through a small worker pool, so the first ones arrive first.
 *
 * `urls` must be a stable reference (useMemo or a module constant).
 * With no URLs, only fonts are tracked.
 */
export function useAssetPreloader(urls: readonly string[], concurrency = 6) {
  const total = urls.length + 1;
  const [state, setState] = useState<PreloadState>({ loaded: 0, imagesLoaded: 0, total, failed: 0, done: false });
  const images = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    let imagesLoaded = 0;
    let failed = 0;
    let scheduled = false;

    // Batch React updates to one per animation frame; hundreds of setState calls in a burst is wasteful.
    const flush = () => {
      scheduled = false;
      if (!cancelled) setState({ loaded, imagesLoaded, total, failed, done: loaded >= total });
    };
    const tick = (ok: boolean, isImage = false) => {
      if (cancelled) return;
      loaded++;
      if (isImage) imagesLoaded++;
      if (!ok) failed++;
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(flush);
      }
    };

    document.fonts.ready.then(() => tick(true), () => tick(false));

    images.current = new Array(urls.length).fill(null);
    let next = 0;
    const worker = async () => {
      while (!cancelled && next < urls.length) {
        const i = next++;
        const img = new Image();
        img.decoding = "async";
        img.src = urls[i];
        try {
          await img.decode();
          if (!cancelled) images.current[i] = img;
          tick(true, true);
        } catch {
          tick(false, true);
        }
      }
    };
    for (let k = 0; k < Math.min(concurrency, urls.length); k++) void worker();

    return () => {
      cancelled = true;
    };
  }, [urls, total, concurrency]);

  return { ...state, images };
}
