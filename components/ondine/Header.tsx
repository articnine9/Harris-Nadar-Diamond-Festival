"use client";

import Image from "next/image";
import { useBag } from "./BagContext";
import styles from "./Ondine.module.css";

export function Header() {
  const { count } = useBag();
  return (
    <header className={styles.top}>
      <a className={styles.logoLink} href="#" aria-label="D. Harris Nadar Diamonds & Jewellery, home">
        <Image className={styles.logo} src="/logo-light.png" alt="D. Harris Nadar Diamonds & Jewellery" width={1368} height={229} priority />
        {/* Dark version, shown on phones while a white product drawer sits behind the header. */}
        <Image className={`${styles.logo} ${styles.logoDark}`} src="/logo-dark.png" alt="" width={1368} height={229} priority />
      </a>
      <nav className={styles.nav} aria-label="Main">
        <a href="#story">The Story</a>
        <a href="#collection">Collection</a>
        <a href="#atelier">Atelier</a>
      </nav>
      <button className={styles.bag} type="button" aria-label={`Bag, ${count} items`}>
        Bag <b>{count}</b>
      </button>
    </header>
  );
}
