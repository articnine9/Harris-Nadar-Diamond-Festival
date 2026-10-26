# Ondine — scroll-driven jewellery storefront (Next.js + TypeScript)

One camera move on the scrollbar: wide shot of a woman by a night pool → earring → pendant → ring
(each with its own product card) → fast rewind → collection grid.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Structure

```
app/
  layout.tsx            fonts (next/font), metadata
  page.tsx              <Ondine />, frame-sequence config lives here
  globals.css           colour tokens
components/ondine/
  Ondine.tsx            composes everything; runs the preloader
  Preloader.tsx         full-screen loader, real % from decoded assets, locks scroll until done
  ScrollStory.tsx       sticky canvas + product cards + progress rail (rAF loop, no React re-renders per frame)
  Collection.tsx        product grid with close-up renders
  Header.tsx, BagContext.tsx
  Ondine.module.css
lib/ondine/
  products.ts           product data, prices (₹, en-IN format), camera focus + card timing per piece
  camera.ts             scroll keyframes → camera (eased, log-space zoom)
  scene.ts              procedural night-pool renderer + cover-fit frame drawer
  useAssetPreloader.ts  loads + img.decode()s frames with a worker pool, tracks fonts
  types.ts
```

## Using real footage (the cinematic version)

1. Shoot or generate one continuous shot: wide on the model, push into earring, pendant, ring.
   Keep the holds at roughly the same proportions as `camera.ts` so the cards line up.
2. Export frames into `public/frames`:
   ```bash
   ffmpeg -i film.mp4 -vf "fps=30,scale=1920:-2" -c:v libwebp -quality 78 public/frames/f_%04d.webp
   ```
   Aim for 150–300 frames at ~40–80 KB each. Export a smaller 960px set for phones if needed.
3. In `app/page.tsx`, define `FRAMES` at module level and pass `<Ondine frames={FRAMES} />`.

The preloader then counts each frame as it finishes decoding (`img.decode()`), so 100% means every frame
is drawable without a stall. Failed frames are counted as "skipped" and the canvas falls back to the
nearest earlier frame.

## Customising

- Products, prices, specs and card timing: `lib/ondine/products.ts`
- Camera path and holds: `keyframes()` in `lib/ondine/camera.ts`
- Cart: replace `add()` in `BagContext.tsx` with your cart API.
- Story length: `.story { height: 900svh }` in the CSS module. Longer = slower scrub.
