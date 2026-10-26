/**
 * Procedural night-pool scene, drawn in a 1600 × 1000 "world".
 * Replace with a real frame sequence by passing `frames` to <Ondine />.
 */
import type { Camera, Point } from "./types";
import { clamp, lerp } from "./camera";

type Ctx = CanvasRenderingContext2D;

/* Deterministic stars so every render (and SSR hydration) matches. */
let seed = 7;
const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const STARS = Array.from({ length: 140 }, () => ({
  x: -300 + rand() * 2200,
  y: -400 + rand() * 1020,
  r: 0.4 + rand() * 1.2,
  p: rand() * 6,
}));

function sky(c: Ctx, t: number) {
  const g = c.createLinearGradient(0, -400, 0, 700);
  g.addColorStop(0, "#03070b");
  g.addColorStop(0.7, "#081820");
  g.addColorStop(1, "#0d2730");
  c.fillStyle = g;
  c.fillRect(-600, -600, 2800, 1310);
  c.fillStyle = "#efe7da";
  for (const s of STARS) {
    c.globalAlpha = 0.35 + 0.4 * Math.abs(Math.sin(t * 0.6 + s.p));
    c.beginPath();
    c.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
  const mg = c.createRadialGradient(1150, 170, 10, 1150, 170, 220);
  mg.addColorStop(0, "rgba(239,231,218,.35)");
  mg.addColorStop(1, "rgba(239,231,218,0)");
  c.fillStyle = mg;
  c.fillRect(900, -80, 500, 500);
  c.fillStyle = "#f3ecdf";
  c.beginPath();
  c.arc(1150, 170, 34, 0, Math.PI * 2);
  c.fill();
}

function bokeh(c: Ctx, x: number, y: number, r: number, a: number) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(226,180,110,${a})`);
  g.addColorStop(1, "rgba(226,180,110,0)");
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
}

function garden(c: Ctx) {
  c.fillStyle = "#040a0e";
  c.beginPath();
  c.moveTo(-600, 702);
  for (let x = -600; x <= 2200; x += 60) {
    c.quadraticCurveTo(
      x + 30, 610 + Math.sin(x * 0.013) * 30 + Math.cos(x * 0.031) * 18,
      x + 60, 640 + Math.sin(x * 0.02) * 20,
    );
  }
  c.lineTo(2200, 702);
  c.closePath();
  c.fill();
  bokeh(c, 1380, 640, 70, 0.45);
  bokeh(c, 230, 655, 55, 0.35);
  bokeh(c, 1650, 620, 40, 0.3);
}

function deck(c: Ctx) {
  const g = c.createLinearGradient(0, 700, 0, 792);
  g.addColorStop(0, "#151d21");
  g.addColorStop(1, "#1d272b");
  c.fillStyle = g;
  c.fillRect(-600, 700, 2800, 92);
  c.strokeStyle = "rgba(239,231,218,.05)";
  c.lineWidth = 1;
  for (let x = -600; x < 2200; x += 90) {
    c.beginPath();
    c.moveTo(x, 700);
    c.lineTo(x - 12, 792);
    c.stroke();
  }
  c.strokeStyle = "rgba(239,231,218,.28)";
  c.beginPath();
  c.moveTo(-600, 791);
  c.lineTo(2200, 791);
  c.stroke();
}

function water(c: Ctx, t: number) {
  const g = c.createLinearGradient(0, 792, 0, 1150);
  g.addColorStop(0, "#0f3a46");
  g.addColorStop(1, "#041219");
  c.fillStyle = g;
  c.fillRect(-600, 792, 2800, 500);
  c.lineCap = "round";
  for (let r = 0; r < 44; r++) {
    const y = 798 + Math.pow(r, 1.32) * 2.6;
    const spread = 40 + r * 7;
    for (let x = -600; x < 2200; x += 34) {
      const d = (x - 1150) / spread;
      const moon = Math.exp(-d * d);
      const shimmer = 0.5 + 0.5 * Math.sin(x * 0.05 + r * 1.7 + t * 1.4);
      const a = 0.035 + 0.7 * moon * shimmer;
      if (a < 0.04 && (x + r * 13) % 3) continue;
      const yy = y + Math.sin(x * 0.021 + t * 1.1 + r) * 1.4;
      const len = 6 + 16 * shimmer * (moon + 0.3);
      c.strokeStyle = moon > 0.2 ? `rgba(239,231,218,${a})` : `rgba(120,200,210,${a})`;
      c.lineWidth = 0.8 + r * 0.03;
      c.beginPath();
      c.moveTo(x - len / 2, yy);
      c.lineTo(x + len / 2, yy);
      c.stroke();
    }
  }
}

function bodyPath(c: Ctx) {
  c.beginPath();
  c.moveTo(470, 215);
  c.bezierCurveTo(520, 190, 580, 215, 590, 270);
  c.bezierCurveTo(594, 290, 600, 305, 610, 325);
  c.lineTo(598, 334);
  c.bezierCurveTo(602, 342, 600, 350, 595, 352);
  c.bezierCurveTo(600, 358, 596, 366, 590, 368);
  c.bezierCurveTo(592, 382, 585, 396, 570, 400);
  c.bezierCurveTo(556, 404, 552, 412, 552, 430);
  c.bezierCurveTo(552, 452, 556, 468, 570, 480);
  c.bezierCurveTo(620, 505, 652, 540, 660, 600);
  c.bezierCurveTo(668, 680, 660, 740, 655, 800);
  c.lineTo(390, 800);
  c.bezierCurveTo(395, 700, 405, 560, 450, 500);
  c.bezierCurveTo(470, 470, 478, 440, 476, 410);
  c.bezierCurveTo(460, 380, 440, 330, 445, 280);
  c.bezierCurveTo(448, 245, 455, 225, 470, 215);
  c.closePath();
}

function figure(c: Ctx) {
  c.save();
  c.beginPath();
  c.rect(-600, -600, 2800, 1391);
  c.clip();
  const g = c.createLinearGradient(0, 200, 0, 800);
  g.addColorStop(0, "#0f1c22");
  g.addColorStop(1, "#0a151a");
  c.fillStyle = g;
  c.beginPath();
  c.ellipse(438, 292, 46, 50, -0.3, 0, Math.PI * 2);
  c.fill();
  bodyPath(c);
  c.fill();

  c.strokeStyle = "#0e1a20";
  c.lineWidth = 34;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(585, 560);
  c.quadraticCurveTo(625, 700, 722, 752);
  c.stroke();
  c.fillStyle = "#0e1a20";
  c.beginPath();
  c.ellipse(752, 754, 30, 12, -0.05, 0, Math.PI * 2);
  c.fill();

  c.shadowColor = "rgba(201,166,107,.8)";
  c.shadowBlur = 8;
  c.strokeStyle = "rgba(201,166,107,.55)";
  c.lineWidth = 1.4;
  bodyPath(c);
  c.stroke();
  c.strokeStyle = "rgba(160,220,225,.35)";
  c.lineWidth = 1.2;
  c.beginPath();
  c.moveTo(600, 548);
  c.quadraticCurveTo(648, 690, 735, 740);
  c.stroke();
  c.beginPath();
  c.ellipse(752, 754, 30, 12, -0.05, Math.PI * 1.05, Math.PI * 1.95);
  c.stroke();
  c.shadowBlur = 0;

  c.strokeStyle = "rgba(201,166,107,.25)";
  c.lineWidth = 1;
  c.beginPath();
  c.ellipse(503, 320, 10, 17, 0.15, 0, Math.PI * 2);
  c.stroke();
  c.strokeStyle = "rgba(201,166,107,.2)";
  for (let i = 0; i < 3; i++) {
    c.beginPath();
    c.moveTo(758 + i * 6, 747);
    c.lineTo(780 + i * 4, 750 + i * 2);
    c.stroke();
  }
  c.restore();
}

export function sparkle(c: Ctx, x: number, y: number, size: number, a: number) {
  c.save();
  c.globalCompositeOperation = "lighter";
  const g = c.createRadialGradient(x, y, 0, x, y, size * 0.5);
  g.addColorStop(0, `rgba(255,252,240,${a})`);
  g.addColorStop(1, "rgba(255,252,240,0)");
  c.fillStyle = g;
  c.fillRect(x - size, y - size, size * 2, size * 2);
  c.strokeStyle = `rgba(255,252,240,${a * 0.9})`;
  c.lineWidth = size * 0.04;
  c.beginPath();
  c.moveTo(x - size, y);
  c.lineTo(x + size, y);
  c.moveTo(x, y - size);
  c.lineTo(x, y + size);
  c.stroke();
  c.restore();
}

function gem(c: Ctx, x: number, y: number, r: number, tint: [string, string]) {
  const g = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.45, tint[0]);
  g.addColorStop(1, tint[1]);
  c.fillStyle = g;
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 8;
    c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  c.closePath();
  c.fill();
  c.strokeStyle = "rgba(255,255,255,.45)";
  c.lineWidth = r * 0.05;
  c.stroke();
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + Math.PI / 8;
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    c.lineTo(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5);
  }
  c.stroke();
}

function jewels(c: Ctx, t: number) {
  const twinkle = (ph: number) => 0.35 + 0.65 * Math.pow(Math.abs(Math.sin(t * 1.3 + ph)), 6);

  // Earring
  c.strokeStyle = "#d9d4cc";
  c.lineWidth = 0.6;
  c.beginPath();
  c.moveTo(503, 336);
  c.quadraticCurveTo(507, 342, 503, 350);
  c.stroke();
  gem(c, 503, 353, 2.6, ["#e9f1f5", "#7e8f99"]);
  c.beginPath();
  c.moveTo(503, 355.5);
  c.lineTo(503, 359);
  c.stroke();
  const pg = c.createRadialGradient(501, 364, 0.5, 503, 366, 6.2);
  pg.addColorStop(0, "#fffaf0");
  pg.addColorStop(0.55, "#e8ddcd");
  pg.addColorStop(1, "#8c8178");
  c.fillStyle = pg;
  c.beginPath();
  c.arc(503, 366, 6, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = "rgba(220,170,190,.35)";
  c.lineWidth = 0.7;
  c.beginPath();
  c.arc(503, 366, 4.4, 0.3, 1.6);
  c.stroke();
  sparkle(c, 501.5, 352, 7, twinkle(0));

  // Pendant
  c.strokeStyle = "#d6b679";
  c.lineWidth = 0.7;
  c.beginPath();
  c.moveTo(512, 428);
  c.quadraticCurveTo(540, 498, 588, 508);
  c.stroke();
  c.beginPath();
  c.arc(588, 510, 1.6, 0, Math.PI * 2);
  c.stroke();
  const px = 588, py = 524;
  c.beginPath();
  c.moveTo(px, py - 11);
  c.bezierCurveTo(px + 4, py - 5, px + 7.5, py + 1, px + 7.5, py + 5);
  c.bezierCurveTo(px + 7.5, py + 10, px + 4, py + 12.5, px, py + 12.5);
  c.bezierCurveTo(px - 4, py + 12.5, px - 7.5, py + 10, px - 7.5, py + 5);
  c.bezierCurveTo(px - 7.5, py + 1, px - 4, py - 5, px, py - 11);
  const ag = c.createRadialGradient(px - 2, py + 1, 0, px, py + 3, 13);
  ag.addColorStop(0, "#e2f7f8");
  ag.addColorStop(0.5, "#76c3cf");
  ag.addColorStop(1, "#225f6d");
  c.fillStyle = ag;
  c.fill();
  c.strokeStyle = "rgba(255,255,255,.4)";
  c.lineWidth = 0.35;
  c.stroke();
  c.beginPath();
  c.moveTo(px, py - 11); c.lineTo(px, py + 12.5);
  c.moveTo(px - 7.5, py + 5); c.lineTo(px + 7.5, py + 5);
  c.moveTo(px - 5, py - 2); c.lineTo(px + 5, py + 11);
  c.moveTo(px + 5, py - 2); c.lineTo(px - 5, py + 11);
  c.stroke();
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    gem(c, px + Math.sin(a) * 9.6, py + 3 - Math.cos(a) * 12.4, 0.9, ["#eef4f6", "#8a979e"]);
  }
  sparkle(c, px - 2, py + 1, 10, twinkle(1.4));

  // Ring
  c.strokeStyle = "#dcdcd8";
  c.lineWidth = 1.4;
  c.beginPath();
  c.ellipse(768, 752, 3.6, 6.5, 0.15, 0, Math.PI * 2);
  c.stroke();
  c.save();
  c.translate(768, 744.5);
  c.scale(1.25, 1);
  gem(c, 0, 0, 4.4, ["#f2f6fa", "#93a2ad"]);
  c.restore();
  sparkle(c, 767, 743.5, 11, twinkle(2.6));
  sparkle(c, 770, 745.5, 5, twinkle(3.7) * 0.7);
}

export type RenderOptions = {
  width: number;   // CSS px
  height: number;  // CSS px
  dpr: number;
  camera: Camera;
  time: number;    // seconds, drives water + sparkle
  /** Where the focused jewel should sit on screen when fully zoomed. */
  focus: Point;
};

export function renderScene(c: Ctx, { width, height, dpr, camera, time, focus }: RenderOptions) {
  const s0 = Math.max(width / 1600, height / 1000);
  const S = s0 * camera.z;
  const tz = clamp((camera.z - 1) / 5);
  const fx = lerp(width / 2, focus.x, tz);
  const fy = lerp(height / 2, focus.y, tz);
  c.setTransform(S * dpr, 0, 0, S * dpr, (fx - camera.x * S) * dpr, (fy - camera.y * S) * dpr);
  sky(c, time);
  garden(c);
  deck(c);
  water(c, time);
  figure(c);
  jewels(c, time);
  c.setTransform(1, 0, 0, 1, 0, 0);
}

/** Cover-fit an image into the canvas, like object-fit: cover. */
export function drawCover(c: Ctx, img: CanvasImageSource & { naturalWidth: number; naturalHeight: number }, width: number, height: number, dpr: number) {
  const s = Math.max(width / img.naturalWidth, height / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
  c.setTransform(1, 0, 0, 1, 0, 0);
}
