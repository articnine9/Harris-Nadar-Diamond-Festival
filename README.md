# Ondine — scroll-driven jewellery storefront (Next.js + TypeScript)

The Diamond Festival leads: fixed dates bar, an event hero, four offers, a countdown band and a
visit block. The product journey sits between them — one camera move on the scrollbar: wide shot
of a woman by a night pool → earring → pendant → ring (each with its own drawer) → finale.

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
  globals.css           colour tokens, --bar-h (festival bar height)
components/ondine/
  Ondine.tsx            composes everything; runs the preloader
  Preloader.tsx         full-screen loader, real % from decoded assets, locks scroll until done
  FestivalBar.tsx       fixed festival strip: dates, live countdown, Book a slot
  ScrollStory.tsx       sticky canvas + hero + product drawers + finale (rAF loop, no React re-renders per frame)
  Offers.tsx            the four festival offers
  Countdown.tsx         compact clock + full-width countdown band
  Visit.tsx             dates, hours, address, map, what to expect
  Collection.tsx        product grid with close-up renders
  OfferPopup.tsx        festival invitation / visit booking (opens on every page load)
  StickyCTA.tsx         phone-only booking bar
  Header.tsx
  Ondine.module.css
lib/ondine/
  event.ts              ALL festival facts: dates, hours, venue, offers, slot cap, contact
  products.ts           product data, camera focus + card timing per piece
  camera.ts             scroll keyframes → camera (eased, log-space zoom)
  scene.ts              procedural night-pool renderer + cover-fit frame drawer
  useAssetPreloader.ts  loads + img.decode()s frames with a worker pool, tracks fonts
  useCountdown.ts       hydration-safe one-second clock
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

- **Festival dates, hours, venue, offers, booking cap, phone/WhatsApp:** `lib/ondine/event.ts`
  (every date, offer tile, countdown and popup line reads from this file — replace the `TODO` values).
- Products and specs: `lib/ondine/products.ts`
- Camera path and holds: `keyframes()` in `lib/ondine/camera.ts`
- Story length: `.story { height: 560svh }` in the CSS module. Longer = slower scrub.
- The invitation popup opens on every page load, about a second after the loading screen.
- Contact details (`address`, `mapUrl`, `phone`, `whatsappHref` in `event.ts`) stay hidden on the page until filled in.
