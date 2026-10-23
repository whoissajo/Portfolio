"use client";

import { useEffect, useRef } from "react";
import { useMotionOff } from "./MotionContext";

/** Grayscale image that resolves from big blocky pixels to sharp when scrolled into view. */
export default function PixelImage({ src, alt }: { src: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const off = useMotionOff();

  useEffect(() => {
    const canvas = cv.current, box = wrap.current;
    if (!canvas || !box) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = off || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    img.src = src;
    let alive = true, timer = 0, ready = false, played = false, last = 1;

    const paint = (px: number) => {
      last = px;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = box.getBoundingClientRect();
      const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      // cover-fit crop of the source
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const sw = W / s, sh = H / s, sx = (img.naturalWidth - sw) / 2, sy = (img.naturalHeight - sh) / 2;
      ctx.imageSmoothingEnabled = px === 1;
      if (px === 1) { ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H); return; }
      const w = Math.max(1, Math.ceil(W / (px * dpr))), h = Math.max(1, Math.ceil(H / (px * dpr)));
      const t = document.createElement("canvas"); t.width = w; t.height = h;
      t.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(t, 0, 0, w, h, 0, 0, W, H);
    };

    const play = () => {
      if (played || !ready) return;
      played = true;
      const steps = [96, 64, 40, 26, 16, 10, 6, 3, 1];
      let i = 0;
      const next = () => {
        if (!alive) return;
        paint(steps[i]);
        i++;
        if (i < steps.length) timer = window.setTimeout(next, 120);
      };
      next();
    };

    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); if (reduce) paint(1); else play(); } }, { threshold: 0.25 });
    img.onload = () => { ready = true; paint(reduce ? 1 : 96); io.observe(box); };
    const onResize = () => { if (ready && played) paint(last); };
    window.addEventListener("resize", onResize);
    return () => { alive = false; clearTimeout(timer); io.disconnect(); window.removeEventListener("resize", onResize); };
  }, [src, off]);

  return (
    <div ref={wrap} className="pixel-wrap" role="img" aria-label={alt}>
      <canvas ref={cv} className="pixel-cv" />
    </div>
  );
}
