"use client";

import { useState, type Ref } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/ondine/products";
import type { PhotoShot, Product } from "@/lib/ondine/types";
import { useBag } from "./BagContext";
import styles from "./Ondine.module.css";

type Props = {
  product: Product;
  index: number;
  total: number;
  /** Close-up photo for the image panel. Omitted in procedural mode. */
  shot?: PhotoShot;
  ref?: Ref<HTMLElement>;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Full-height white product drawer. ScrollStory slides it in and out by setting
 * its transform; this component only renders content and holds the quantity.
 */
export function ProductDrawer({ product: p, index, total, shot, ref }: Props) {
  const { add } = useBag();
  const [qty, setQty] = useState(1);
  const [lead] = p.specs;
  const tag = `${lead[0]} · ${lead[1].split(",")[0]}`;

  return (
    <article ref={ref} className={styles.drawer} data-on="false" aria-label={`${p.name} ${p.accent}`}>
      <div className={styles.drawerInner}>
        <div className={styles.drawerMeta}>
          <span>N°{pad(index + 1)} / {pad(total)}</span>
          <span>Diamond Festival</span>
        </div>

        <div className={styles.drawerHead}>
          <span className={styles.drawerKind}>{p.kind}</span>
          <h2>{p.name} <i>{p.accent}</i></h2>
          <span className={styles.drawerMaterial}>{p.short}</span>
        </div>

        <p className={styles.drawerBlurb}>{p.blurb}</p>

        <figure className={styles.drawerMedia}>
          {shot && (
            <Image
              src={shot.src}
              alt=""
              fill
              sizes="(max-width: 720px) 92vw, 600px"
              style={{ objectFit: "cover", objectPosition: `${shot.focus.x * 100}% ${shot.focus.y * 100}%` }}
            />
          )}
          <span className={styles.mediaNum}>{pad(index + 1)}</span>
          <figcaption className={styles.mediaTag}>{tag}</figcaption>
        </figure>

        <dl className={styles.drawerSpecs}>
          {p.specs.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.drawerBuy}>
          <button className={styles.pill} type="button" onClick={() => add(`${p.name} ${p.accent}`, qty)}>
            Add to bag
          </button>
          <div className={styles.stepper} role="group" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
            <output aria-live="polite">{qty}</output>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))} disabled={qty >= 9}>+</button>
          </div>
          <span className={styles.drawerPrice}>{formatPrice(p.price * qty)}</span>
        </div>
      </div>
    </article>
  );
}
