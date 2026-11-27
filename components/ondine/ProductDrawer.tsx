"use client";

import type { Ref } from "react";
import Image from "next/image";
import { EVENT } from "@/lib/ondine/event";
import type { PhotoShot, Product } from "@/lib/ondine/types";
import { useEnquiry } from "./Enquiry";
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
 * its transform; this component only renders content.
 */
export function ProductDrawer({ product: p, index, total, shot, ref }: Props) {
  const { open } = useEnquiry();
  const [lead] = p.specs;
  const tag = `${lead[0]} · ${lead[1].split(",")[0]}`;

  return (
    <article ref={ref} className={styles.drawer} data-on="false" aria-label={`${p.name} ${p.accent}`}>
      <div className={styles.drawerInner}>
        <div className={styles.drawerMeta}>
          <span>N°{pad(index + 1)} / {pad(total)}</span>
          <span>{EVENT.name} {EVENT.year}</span>
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

        <p className={styles.drawerOffer}>
          <span>Festival offer</span>
          {EVENT.productOffer}
        </p>

        <div className={styles.drawerBuy}>
          <button className={styles.pill} type="button" onClick={() => open(`${p.name} ${p.accent}`)}>
            Explore {p.name}
          </button>
          <span className={styles.drawerNote}>Price on request · private viewing by appointment</span>
        </div>
      </div>
    </article>
  );
}
