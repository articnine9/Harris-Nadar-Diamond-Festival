import Ondine from "@/components/ondine/Ondine";
import { PHOTOS } from "@/lib/ondine/photos";

/*
 * Three ways to drive the story:
 *
 * 1. Photos (current): four stills in /public/photos — see lib/ondine/photos.ts.
 *      <Ondine photos={PHOTOS} />
 *
 * 2. Real footage: export frames into /public/frames, e.g.
 *      ffmpeg -i film.mp4 -vf "fps=30,scale=1920:-2" -c:v libwebp -quality 78 public/frames/f_%04d.webp
 *    then define at module level:
 *      const FRAMES: FrameSource = { count: 240, url: (i) => `/frames/f_${String(i + 1).padStart(4, "0")}.webp` };
 *      <Ondine frames={FRAMES} />
 *
 * 3. Nothing: the night-pool scene is drawn procedurally.
 *      <Ondine />
 */

export default function Page() {
  return <Ondine photos={PHOTOS} />;
}
