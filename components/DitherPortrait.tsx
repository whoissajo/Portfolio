"use client";

import { useEffect, useRef } from "react";
import { useMotionOff } from "./MotionContext";

// 0 = current dithered look; 100 = show the original portrait.
const ORIGINAL_IMAGE_PERCENT = 60;

/**
 * Renders an image as a field of tiny dots (stipple/dither look).
 * The dots scatter away from the cursor and spring back, and sweep in on load.
 * Works best with a dark background and a face lit from one side.
 */
export default function DitherPortrait({ src }: { src: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const off = useMotionOff();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = off || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0, alive = true, visible = true;
    let mx = -9999, my = -9999;

    const img = new Image();
    // This is the hero portrait, so request it early despite rendering it on canvas.
    img.fetchPriority = "high";
    img.decoding = "async";
    img.src = src;

    type Dot = { x: number; y: number; r: number; b: number; d: number };
    let dots: Dot[] = [];
    let ox: Float32Array, oy: Float32Array, vx: Float32Array, vy: Float32Array;
    let cssW = 0, cssH = 0, dpr = 1, start = 0, hasDrawn = false;
    const BUCKETS = 28;
    const fills: string[] = [];
    for (let i = 0; i < BUCKETS; i++) {
      const t = i / (BUCKETS - 1);
      // dark -> warm cream, with the brightest dots tipping toward white
      const r = Math.round(60 + 195 * t), g = Math.round(52 + 180 * t), b = Math.round(44 + 160 * t);
      fills.push(`rgb(${r},${g},${b})`);
    }

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = Math.max(200, Math.round(rect.width));
      cssH = Math.round((cssW * img.naturalHeight) / img.naturalWidth);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.height = cssH + "px";
      const step = cssW > 420 ? 3.2 : 2.8;
      const cols = Math.floor(cssW / step), rows = Math.floor(cssH / step);
      const off2 = document.createElement("canvas");
      off2.width = cols; off2.height = rows;
      const o = off2.getContext("2d", { willReadFrequently: true })!;
      o.drawImage(img, 0, 0, cols, rows);
      const data = o.getImageData(0, 0, cols, rows).data;
      dots = [];
      // 4x4 Bayer matrix gives the stippled, dithered texture
      const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 4;
          const lum = (0.299 * data[k] + 0.587 * data[k + 1] + 0.114 * data[k + 2]) / 255;
          const thr = (bayer[(j % 4) * 4 + (i % 4)] + 0.5) / 16;
          if (lum < 0.05 || lum * 1.15 < thr * 0.9) continue;
          const b = Math.min(1, lum * 1.25);
          dots.push({
            x: (i + 0.5) * step, y: (j + 0.5) * step,
            r: step * (0.28 + 0.32 * b), b,
            d: (j / rows) * 0.55 + Math.random() * 0.45, // reveal delay: top-to-bottom sweep + noise
          });
        }
      }
      ox = new Float32Array(dots.length); oy = new Float32Array(dots.length);
      vx = new Float32Array(dots.length); vy = new Float32Array(dots.length);
    };

    const draw = (progress: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      // Blend between the existing dither effect and the untouched source image.
      const originalAlpha = Math.min(100, Math.max(0, ORIGINAL_IMAGE_PERCENT)) / 100;
      if (originalAlpha > 0) {
        ctx.globalAlpha = originalAlpha;
        ctx.drawImage(img, 0, 0, cssW, cssH);
      }
      ctx.globalAlpha = 1 - originalAlpha;

      const buckets: number[][] = Array.from({ length: BUCKETS }, () => []);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const p = Math.min(1, Math.max(0, (progress - d.d * 0.7) / 0.3));
        if (p <= 0) continue;
        const bi = Math.min(BUCKETS - 1, Math.floor(d.b * BUCKETS));
        const r = d.r * (0.4 + 0.6 * p);
        buckets[bi].push(d.x + ox[i] - r, d.y + oy[i] - r, r * 2);
      }
      for (let b = 0; b < BUCKETS; b++) {
        const arr = buckets[b];
        if (!arr.length) continue;
        ctx.fillStyle = fills[b];
        ctx.beginPath();
        for (let n = 0; n < arr.length; n += 3) ctx.rect(arr[n], arr[n + 1], arr[n + 2], arr[n + 2]);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const physics = () => {
      let moving = false;
      const R = 70, R2 = R * R;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.x + ox[i] - mx, dy = d.y + oy[i] - my;
        const dd = dx * dx + dy * dy;
        if (dd < R2 && dd > 0.01) {
          const dist = Math.sqrt(dd), f = (1 - dist / R) * 1.6;
          vx[i] += (dx / dist) * f; vy[i] += (dy / dist) * f;
        }
        vx[i] += -ox[i] * 0.06; vy[i] += -oy[i] * 0.06;
        vx[i] *= 0.84; vy[i] *= 0.84;
        ox[i] += vx[i]; oy[i] += vy[i];
        if (Math.abs(ox[i]) + Math.abs(oy[i]) + Math.abs(vx[i]) + Math.abs(vy[i]) > 0.02) moving = true;
      }
      return moving;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!alive) return;
      const progress = Math.min(1.5, (now - start) / 1500);
      const moving = visible && fine ? physics() : false;

      if (visible && (progress < 1.5 || moving || !hasDrawn)) {
        draw(progress);
        hasDrawn = true;
      }

      // Stop the per-dot work when the reveal and pointer interaction settle.
      // Pointer movement / visibility can wake the loop again when needed.
      if ((visible && progress < 1.5) || moving) {
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      if (fine && visible && !reduce && raf === 0) {
        raf = requestAnimationFrame(loop);
      }
    };

    img.onload = () => {
      if (!alive) return;
      build();
      if (reduce) { draw(1.5); return; }
      start = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce && raf === 0 && img.complete && img.naturalWidth) {
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);
    if (fine) window.addEventListener("pointermove", onMove);
    const onResize = () => { if (img.complete && img.naturalWidth) { build(); draw(1.5); hasDrawn = true; } };
    window.addEventListener("resize", onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, [src, off]);

  return <canvas ref={ref} className="portrait" aria-hidden />;
}
