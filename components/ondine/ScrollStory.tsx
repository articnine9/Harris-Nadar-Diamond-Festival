"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { PRODUCTS } from "@/lib/ondine/products";
import { band, cameraAt, clamp, easeInOutCubic } from "@/lib/ondine/camera";
import { drawCover, renderScene } from "@/lib/ondine/scene";
import { renderPhotos } from "@/lib/ondine/photoScene";
import type { StoryMode } from "@/lib/ondine/types";
import { ProductDrawer } from "./ProductDrawer";
import styles from "./Ondine.module.css";

type Props = {
  /** Decoded images from useAssetPreloader: frames, or [wide, earring, pendant, ring] in photo mode. */
  images: MutableRefObject<(HTMLImageElement | null)[]>;
  mode: StoryMode;
};

const RAIL = ["Earring", "Pendant", "Ring", "Rewind"];

export function ScrollStory({ images, mode }: Props) {
  const storyRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const railRefs = useRef<(HTMLLIElement | null)[]>([]);
  const railRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const story = storyRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!story || !canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, DPR = 1;
    let target = 0, current = 0, time = 2;
    let raf = 0;
    let visible = true;

    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
    };
    const readScroll = () => {
      const r = story.getBoundingClientRect();
      target = clamp(-r.top / (r.height - window.innerHeight));
    };

    const nearestFrame = (i: number) => {
      for (let k = i; k >= 0; k--) { const im = images.current[k]; if (im) return im; }
      return null;
    };

    // Overlays are written straight to the DOM each frame; React state at 60fps would re-render needlessly.
    const updateUI = (p: number) => {
      const hero = heroRef.current;
      if (hero) {
        const o = p < 0.01 ? 1 : clamp(1 - (p - 0.01) / 0.05);
        hero.style.opacity = String(o);
        hero.style.transform = `translateY(${(1 - o) * -30}px)`;
        // The rail shares the left edge with the title, so it only appears once the hero has gone.
        if (railRef.current) railRef.current.style.opacity = String(1 - o);
      }
      // Drawers slide in from the right edge; the header turns dark-on-light while one is open.
      let open = 0;
      PRODUCTS.forEach((prod, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const o = easeInOutCubic(band(p, prod.band[0], prod.band[1], 0.035));
        open = Math.max(open, o);
        el.style.transform = `translate3d(${((1 - o) * 104).toFixed(2)}%,0,0)`;
        el.style.visibility = o <= 0.001 ? "hidden" : "visible";
        el.dataset.on = o > 0.5 ? "true" : "false";
        el.inert = o <= 0.5;
      });
      const root = document.documentElement;
      const state = open > 0.6 ? "open" : "closed";
      if (root.dataset.drawer !== state) root.dataset.drawer = state;
      const fin = finaleRef.current;
      if (fin) {
        const o = clamp((p - 0.87) / 0.05);
        fin.style.opacity = String(o);
        fin.dataset.on = o > 0.5 ? "true" : "false";
        fin.inert = o <= 0.5;
      }
      const chap = p < 0.15 ? -1 : p < 0.37 ? 0 : p < 0.6 ? 1 : p < 0.82 ? 2 : 3;
      railRefs.current.forEach((li, i) => li?.classList.toggle(styles.active, i === chap));
      if (meterRef.current) meterRef.current.style.transform = `scaleX(${p})`;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (!reduce) time = now / 1000;
      current += (target - current) * (reduce ? 1 : 0.1);
      if (Math.abs(target - current) < 0.0002) current = target;

      const narrow = W <= 720;
      if (mode.kind === "frames") {
        const img = nearestFrame(Math.round(current * (mode.count - 1)));
        if (img) drawCover(ctx, img, W, H, DPR);
      } else if (mode.kind === "photos") {
        renderPhotos(ctx, {
          width: W, height: H, dpr: DPR, progress: current, time, narrow,
          set: mode.set, images: images.current,
        });
      } else {
        renderScene(ctx, {
          width: W, height: H, dpr: DPR, time,
          camera: cameraAt(current, narrow),
          focus: narrow ? { x: W * 0.5, y: H * 0.3 } : { x: W * 0.38, y: H * 0.5 },
        });
      }
      updateUI(current);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "100px" });
    io.observe(story);
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);

    resize();
    readScroll();
    current = target;
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      delete document.documentElement.dataset.drawer;
    };
  }, [images, mode]);

  return (
    <section className={styles.story} id="story" ref={storyRef} aria-label="Scroll story">
      <div className={styles.stage}>
        <canvas ref={canvasRef} className={styles.scene} aria-hidden="true" />
        <div className={styles.vignette} />
        {mode.kind === "photos" && <div className={styles.scrim} />}

        <div className={styles.hero} ref={heroRef} data-align={mode.kind === "photos" ? "right" : "left"}>
          <div className={styles.eyebrow}>The Festival Collection</div>
          <h1>Harris Nadar <i>Diamond Festival</i></h1>
          <p>Three pieces from the festival collection: cascading drop earrings, a stone-set pendant and a gold filigree ring.</p>
          <div className={styles.cue}><span />Scroll to dive in</div>
        </div>

        <ol className={styles.rail} ref={railRef}>
          {RAIL.map((label, i) => (
            <li key={label} ref={(el) => { railRefs.current[i] = el; }}>{label}</li>
          ))}
        </ol>

        {PRODUCTS.map((p, i) => (
          <ProductDrawer
            key={p.id}
            product={p}
            index={i}
            total={PRODUCTS.length}
            shot={mode.kind === "photos" ? mode.set.closeups[i] : undefined}
            ref={(el) => { cardRefs.current[i] = el; }}
          />
        ))}

        <div className={styles.finale} ref={finaleRef} data-on="false" data-align={mode.kind === "photos" ? "right" : "center"}>
          <div className={styles.eyebrow}>Fin</div>
          <h2>The whole festival, in <i>three pieces.</i></h2>
          <a className={styles.ghost} href="#collection">View the collection</a>
        </div>

        <div className={styles.meter} ref={meterRef} />
      </div>
    </section>
  );
}
