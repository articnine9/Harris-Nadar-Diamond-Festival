"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useAssetPreloader } from "@/lib/ondine/useAssetPreloader";
import { photoUrls } from "@/lib/ondine/photos";
import type { FrameSource, PhotoSet, StoryMode } from "@/lib/ondine/types";
import { BagProvider } from "./BagContext";
import { Collection } from "./Collection";
import { Header } from "./Header";
import { Preloader } from "./Preloader";
import { ScrollStory } from "./ScrollStory";
import styles from "./Ondine.module.css";

type Props = {
  /** Four stills (wide + three close-ups). The camera move is built from them. */
  photos?: PhotoSet;
  /** A real exported frame sequence. Takes priority over `photos`. */
  frames?: FrameSource;
};

/**
 * Pass `frames` or `photos` as stable references (module-level constants),
 * otherwise the preloader restarts on every render.
 * With neither, the scene is drawn procedurally.
 */
export default function Ondine({ photos, frames }: Props) {
  const mode: StoryMode = useMemo(() => {
    if (frames && frames.count > 0) return { kind: "frames", count: frames.count };
    if (photos) return { kind: "photos", set: photos };
    return { kind: "procedural" };
  }, [frames, photos]);

  const urls = useMemo(() => {
    if (mode.kind === "frames" && frames) return Array.from({ length: frames.count }, (_, i) => frames.url(i));
    if (mode.kind === "photos") return photoUrls(mode.set);
    return [];
  }, [mode, frames]);

  const preload = useAssetPreloader(urls, frames?.concurrency ?? 6);
  const unit = mode.kind === "frames" ? "Frames" : mode.kind === "photos" ? "Photographs" : undefined;

  return (
    <BagProvider>
      <Preloader {...preload} unit={unit} />
      <Header />
      <main>
        <ScrollStory images={preload.images} mode={mode} />
        <Collection photos={mode.kind === "photos" ? mode.set : undefined} />
      </main>
      <footer className={styles.footer} id="atelier">
        <div className={`${styles.wrap} ${styles.footerWrap}`}>
          <div className={styles.footerBrand}>
            <Image className={styles.footerLogo} src="/logo-light.png" alt="D. Harris Nadar Diamonds & Jewellery" width={1368} height={229} />
            <span>Private viewings at the showroom by appointment.</span>
          </div>
          <div className={styles.hall}>BIS Hallmark · 750 / 950 · GIA certified</div>
        </div>
      </footer>
    </BagProvider>
  );
}
