"use client";

import styles from "./Ondine.module.css";

/**
 * The poster's decorative layer: soft aurora ribbons, violet butterflies and
 * four-point sparkles. Purely presentational — never intercepts clicks, and
 * the animations switch off under `prefers-reduced-motion`.
 */
export function FestiveDecor() {
  return (
    <div className={styles.decor} aria-hidden="true">
      <span className={`${styles.ribbon} ${styles.ribbonA}`} />
      <span className={`${styles.ribbon} ${styles.ribbonB}`} />

      <span className={`${styles.butterfly} ${styles.butterflyA}`}><i /></span>
      <span className={`${styles.butterfly} ${styles.butterflyB}`}><i /></span>
      <span className={`${styles.butterfly} ${styles.butterflyC}`}><i /></span>

      <span className={`${styles.sparkle} ${styles.sparkA}`} />
      <span className={`${styles.sparkle} ${styles.sparkB}`} />
      <span className={`${styles.sparkle} ${styles.sparkC}`} />
      <span className={`${styles.sparkle} ${styles.sparkD}`} />
      <span className={`${styles.sparkle} ${styles.sparkE}`} />
    </div>
  );
}
