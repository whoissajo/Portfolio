"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionOff } from "./MotionContext";

/* ---------- icons ---------- */
export function Arrow({ dir = "ne", size = 12 }: { dir?: "ne" | "down" | "right" | "up"; size?: number }) {
  const rot = { ne: 0, right: 45, down: 135, up: -45 }[dir];
  return (
    <svg className="arrow-ico" width={size} height={size} viewBox="0 0 12 12" fill="none" style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
      <path d="M3 9L9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Icon({ name }: { name: "instagram" | "linkedin" | "play" | "video" }) {
  if (name === "instagram")
    return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" /></svg>);
  if (name === "linkedin")
    return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><path d="M4 9.5v10M4 5.6v.2M9 19.5v-10M9 13.5c0-2.2 1.4-4 3.6-4S16 11 16 13.2v6.3M20 19.5v-5" strokeLinecap="round" /></svg>);
  if (name === "video")
    return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M10.5 9.5v5l4-2.5z" fill="currentColor" stroke="none" /></svg>);
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4.5v15l13-7.5z" /></svg>);
}

/* ---------- underlined link with arrow ---------- */
export function Lnk({ href, children, accent = false, external = false }: { href: string; children: ReactNode; accent?: boolean; external?: boolean }) {
  return (
    <a className={`lnk ${accent ? "accent" : ""}`} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      <span>{children}</span><Arrow />
    </a>
  );
}

/* ---------- mono text that scrambles into place ---------- */
const GLYPHS = "/\\-_|·0123456789#=+";
export function Scramble({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const off = useMotionOff();
  useEffect(() => {
    const el = ref.current;
    const node = el?.firstChild as Text | null;
    if (!el || !node || off || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = [...text];
    const scramble = (p: number) =>
      chars.map((c, i) => (c === " " || i < p * chars.length ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
    node.nodeValue = scramble(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 650 + chars.length * 14;
        const loop = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          node.nodeValue = p >= 1 ? text : scramble(p);
          if (p < 1) raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      },
      { threshold: 0.9 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); node.nodeValue = text; };
  }, [text, off]);
  return <span ref={ref} className={className}>{text}</span>;
}

/* ---------- number that counts up when scrolled into view ---------- */
export function Count({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const off = useMotionOff();
  useEffect(() => {
    const el = ref.current;
    const node = el?.firstChild as Text | null;
    const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!el || !node || !m || off || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, pre, num, suf] = m;
    const end = parseFloat(num.replace(/,/g, ""));
    const dec = (num.split(".")[1] || "").length;
    const commas = num.includes(",");
    const fmt = (v: number) => {
      const s = v.toFixed(dec);
      return commas ? Number(s).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : s;
    };
    const o = { v: 0 };
    let tween: gsap.core.Tween | undefined;
    node.nodeValue = pre + fmt(0) + suf;
    const st = ScrollTrigger.create({
      trigger: el, start: "top 92%", once: true,
      onEnter: () => {
        tween = gsap.to(o, { v: end, duration: 2.2, ease: "power3.out", onUpdate: () => { node.nodeValue = pre + fmt(o.v) + suf; } });
      },
    });
    return () => { st.kill(); tween?.kill(); node.nodeValue = value; };
  }, [value, off]);
  return <span ref={ref}>{value}</span>;
}

/* ---------- stat: big serif number + accent suffix ---------- */
export function Stat({ value, suffix, className = "" }: { value: string; suffix: string; className?: string }) {
  return (
    <span className={`num ${className}`}>
      <Count value={value} /><span className="sfx">{suffix}</span>
    </span>
  );
}

/* ---------- re-plays a stagger on `ref` children when `dep` changes ---------- */
export function usePanelAnim(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const off = useMotionOff();
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (off || !ref.current) return;
    const tw = gsap.fromTo(
      ref.current.children,
      { y: 22, opacity: 0, filter: "blur(6px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out", stagger: 0.07, clearProps: "transform,opacity,filter" }
    );
    return () => { tw.kill(); };
  }, [dep, off]);
  return ref;
}

/* ---------- section header row (hairline + scrambled mono labels) ---------- */
export function SecHead({ num, label, aside }: { num: string; label: string; aside?: string }) {
  return (
    <div className="sec-head">
      <span className="rule" data-line-x aria-hidden />
      <div className="sec-row">
        <span className="sec-label"><i className="sq" aria-hidden /><Scramble text={`${num} / ${label}`.toUpperCase()} /></span>
        {aside && <Scramble className="mono mute" text={aside.toUpperCase()} />}
      </div>
    </div>
  );
}

/* ---------- multi-line serif heading; last line italic, each line masked ---------- */
export function Heading({ lines, italicFrom, size = "lg", tag = "h2" }: { lines: string[]; italicFrom?: number; size?: "md" | "lg" | "xl"; tag?: "h1" | "h2" }) {
  const Tag = tag;
  const from = italicFrom ?? lines.length - 1;
  return (
    <Tag className={`serif head-${size}`} aria-label={lines.join(" ")}>
      {lines.map((l, i) => (
        <span className="ln" key={l} aria-hidden>
          <span className={`ln-i ${i >= from ? "it" : ""}`} data-ln>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
