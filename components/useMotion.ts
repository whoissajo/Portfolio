"use client";

import { useEffect, type RefObject } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { split, restoreSplit } from "@/lib/split";

export function useMotion(rootRef: RefObject<HTMLElement | null>, motionOff: boolean, ready: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;
    const reduce = motionOff || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const q = <T extends HTMLElement = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
    const splitEls: HTMLElement[] = [];

    /* ---------- smooth scroll (Lenis) on GSAP's ticker ---------- */
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href") || "";
      if (id.length < 2) return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: id === "#top" ? 0 : -24, duration: 1.5 });
    };
    document.addEventListener("click", onAnchor);

    const ctx = gsap.context(() => {
      /* ---------- scroll progress line ---------- */
      gsap.fromTo(".progress", { scaleX: 0 }, {
        scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.25 },
      });

      /* ---------- hero intro ---------- */
      const name = root.querySelector<HTMLElement>(".hero-name");
      const intro = gsap.timeline({ delay: 0.15 });
      intro.from(".nav", { y: -24, opacity: 0, duration: 0.9, ease: "power3.out" }, 0);
      if (name) {
        const chars = split(name, "chars");
        splitEls.push(name);
        intro.from(chars, { yPercent: 118, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.035 }, 0.25);
      }
      intro.from("[data-intro]", { y: 22, opacity: 0, filter: "blur(8px)", duration: 1, ease: "power3.out", stagger: 0.09, clearProps: "filter,transform,opacity" }, 0.45);
      intro.from(".portrait-wrap", { opacity: 0, duration: 1.6, ease: "power2.out" }, 0.1);

      /* ---------- masked line reveals for serif headings ---------- */
      q(".serif").forEach((h) => {
        const lines = h.querySelectorAll("[data-ln]");
        if (!lines.length || h.closest(".hero")) return;
        gsap.from(lines, {
          yPercent: 112, duration: 1.15, ease: "expo.out", stagger: 0.12,
          scrollTrigger: { trigger: h, start: "top 88%", once: true },
        });
      });

      /* ---------- soft blur-in reveals ---------- */
      q("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 34, opacity: 0, filter: "blur(10px)", duration: 1.1, ease: "power3.out", clearProps: "filter,transform,opacity",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      q("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          y: 30, opacity: 0, filter: "blur(8px)", duration: 1, ease: "power3.out", stagger: 0.1, clearProps: "filter,transform,opacity",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* ---------- hairlines draw in; timeline spines scrub ---------- */
      q("[data-line-x]").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: "left center", duration: 1.6, ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        });
      });
      q("[data-line-y]").forEach((el) => {
        gsap.fromTo(el, { scaleY: 0 }, {
          scaleY: 1, transformOrigin: "top center", ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top 78%", end: "bottom 62%", scrub: true },
        });
      });

      /* ---------- subtle parallax ---------- */
      q("[data-parallax]").forEach((el) => {
        const s = parseFloat(el.dataset.parallax || "0.1");
        gsap.to(el, {
          yPercent: s * 100, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true },
        });
      });
      gsap.to(".hero-stage .hero-copy", {
        opacity: 0.2, y: -40, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("load", onLoad);
      document.removeEventListener("click", onAnchor);
      ctx.revert();
      splitEls.forEach(restoreSplit);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [rootRef, motionOff, ready]);
}
