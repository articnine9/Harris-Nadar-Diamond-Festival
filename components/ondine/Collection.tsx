"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { PRODUCTS, formatPrice } from "@/lib/ondine/products";
import { renderScene } from "@/lib/ondine/scene";
import type { PhotoSet, PhotoShot, Product } from "@/lib/ondine/types";
import { useBag } from "./BagContext";
import styles from "./Ondine.module.css";

/** Close-up photo, cropped so the jewel stays in frame at any card width. */
function PhotoThumb({ product, shot }: { product: Product; shot: PhotoShot }) {
  return (
    <div className={styles.thumb}>
      <Image
        src={shot.src}
        alt={`${product.name} ${product.accent}, close-up`}
        fill
        sizes="(max-width: 900px) 100vw, 33vw"
        style={{ objectFit: "cover", objectPosition: `${shot.focus.x * 100}% ${shot.focus.y * 100}%` }}
      />
    </div>
  );
}

/** Procedural close-up, used when no photos are supplied. */
function DrawnThumb({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const draw = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = Math.round(w * d);
      cv.height = Math.round(h * d);
      const s0 = Math.max(w / 1600, h / 1000);
      renderScene(ctx, {
        width: w, height: h, dpr: d, time: 2.2 + index,
        camera: { x: product.focus.x, y: product.focus.y, z: w / s0 / 70 },
        focus: { x: w / 2, y: h / 2 },
      });
    };
    const ro = new ResizeObserver(draw);
    ro.observe(cv);
    return () => ro.disconnect();
  }, [product, index]);

  return <canvas ref={ref} className={styles.thumb} role="img" aria-label={`${product.name} ${product.accent}, close-up`} />;
}

export function Collection({ photos }: { photos?: PhotoSet }) {
  const { add } = useBag();
  return (
    <section className={styles.collection} id="collection">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <h2>Nocturne collection</h2>
          <p>Every piece is BIS hallmarked, comes with its grading certificate, and is resized free for the first year.</p>
        </div>
        <div className={styles.grid}>
          {PRODUCTS.map((p, i) => (
            <article key={p.id} className={styles.piece}>
              {photos ? <PhotoThumb product={p} shot={photos.closeups[i]} /> : <DrawnThumb product={p} index={i} />}
              <div className={styles.row}>
                <h3>{p.name} {p.accent}</h3>
                <span className={styles.price}>{formatPrice(p.price)}</span>
              </div>
              <div className={styles.row}>
                <small>{p.short}</small>
                <button className={`${styles.add} ${styles.addGhost}`} type="button" onClick={() => add(`${p.name} ${p.accent}`)}>Add</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
