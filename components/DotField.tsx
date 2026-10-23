"use client";

import { useEffect, useRef } from "react";
import { useMotionOff } from "./MotionContext";

export type DotMode = "structure" | "ripples" | "connect";

const CREAM = [226, 216, 201];
const ACCENT = [255, 138, 92];
const GOLD = [233, 200, 138];
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

/** Ambient dotted canvas visuals: a rippling grid, radial rings, or a drifting network. */
export default function DotField({ mode, className = "" }: { mode: DotMode; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const off = useMotionOff();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = off || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = true, W = 0, H = 0, dpr = 1;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(120, r.width); H = Math.max(120, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * dpr; canvas.height = H * dpr;
    };
    size();

    // network nodes (connect mode)
    const nodes = Array.from({ length: 64 }, () => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0006, vy: (Math.random() - 0.5) * 0.0006,
    }));

    const frame = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      if (mode === "structure") {
        const cols = 46, rows = 50;
        const gx = (W * 0.92) / (cols - 1), gy = (H * 0.86) / (rows - 1);
        const x0 = W * 0.04, y0 = H * 0.07;
        for (let j = 0; j < rows; j++) {
          const ny = j / (rows - 1);
          for (let i = 0; i < cols; i++) {
            const nx = i / (cols - 1);
            const wave = Math.sin(nx * 7 + t * 0.0011 + ny * 2.2) * 7 * (0.25 + ny) + Math.sin(ny * 5 - t * 0.0008) * 3;
            const x = x0 + i * gx + Math.sin(ny * 4 + t * 0.0009) * 3;
            const y = y0 + j * gy + wave;
            const tint = Math.max(0, Math.sin(nx * 3 + ny * 4 + t * 0.0006)) * 0.55;
            const c = mix(CREAM, ACCENT, tint);
            ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.35 + 0.4 * (1 - ny * 0.4)})`;
            ctx.fillRect(x - 0.6, y - 0.6, 1.3, 1.3);
          }
        }
      } else if (mode === "ripples") {
        const cx = W / 2, cy = H / 2, rays = 96, maxR = Math.min(W, H) * 0.46, inner = maxR * 0.2;
        ctx.fillStyle = "rgba(255,138,92,.95)";
        ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,138,92,.35)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2); ctx.stroke();
        for (let a = 0; a < rays; a++) {
          const ang = (a / rays) * Math.PI * 2 + t * 0.00006;
          const cos = Math.cos(ang), sin = Math.sin(ang);
          const dots = 20;
          for (let k = 0; k < dots; k++) {
            const f = k / (dots - 1);
            const pulse = Math.sin(t * 0.0016 - f * 5 + a * 0.12) * 4;
            const rr = inner + f * (maxR - inner) + pulse;
            const c = mix(GOLD, ACCENT, Math.max(0, Math.sin(t * 0.001 + a * 0.2 + f * 3)) * 0.5);
            ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${0.9 - f * 0.55})`;
            const s = 1.9 - f * 1.1;
            ctx.fillRect(cx + cos * rr - s / 2, cy + sin * rr - s / 2, s, s);
          }
        }
      } else {
        for (const n of nodes) {
          n.x += n.vx * 16; n.y += n.vy * 16;
          if (n.x < 0.03 || n.x > 0.97) n.vx *= -1;
          if (n.y < 0.03 || n.y > 0.97) n.vy *= -1;
        }
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = (nodes[i].x - nodes[j].x) * W, dy = (nodes[i].y - nodes[j].y) * H;
            const d = Math.hypot(dx, dy);
            if (d < 92) {
              ctx.strokeStyle = `rgba(226,216,201,${(1 - d / 92) * 0.35})`;
              ctx.lineWidth = 0.7;
              ctx.beginPath(); ctx.moveTo(nodes[i].x * W, nodes[i].y * H); ctx.lineTo(nodes[j].x * W, nodes[j].y * H); ctx.stroke();
            }
          }
        }
        nodes.forEach((n, i) => {
          ctx.fillStyle = i % 9 === 0 ? "rgba(255,138,92,.95)" : "rgba(226,216,201,.85)";
          ctx.beginPath(); ctx.arc(n.x * W, n.y * H, i % 9 === 0 ? 2.6 : 1.6, 0, Math.PI * 2); ctx.fill();
        });
      }
    };

    if (reduce) {
      frame(2000);
    } else {
      const loop = (t: number) => { if (visible) frame(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    const onResize = () => { size(); if (reduce) frame(2000); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", onResize); };
  }, [mode, off]);

  return <canvas ref={ref} className={`dotfield ${className}`} aria-hidden />;
}
