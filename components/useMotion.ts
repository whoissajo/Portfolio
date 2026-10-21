"use client";

import { useEffect, type RefObject } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { split, restoreSplit } from "@/lib/split";

// survives re-runs of the effect (motion toggle, React strict mode)
let introDone = false;

export function useMotion(rootRef: RefObject<HTMLElement | null>, motionOff: boolean, ready: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;

    const pre = root.querySelector<HTMLElement>(".preloader");
    const reduce = motionOff || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      if (pre) pre.style.display = "none";
      introDone = true;
      return;
    }

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const q = <T extends HTMLElement = HTMLElement>(sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));
    const splitEls: HTMLElement[] = [];
    const cleanups: Array<() => void> = [];

    /* ---------- smooth scroll (Lenis) driven by GSAP's ticker ---------- */
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (!introDone) lenis.stop();

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href") || "";
      if (id.length < 2) return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: id === "#top" ? 0 : -56, duration: 1.5 });
    };
    document.addEventListener("click", onAnchor);

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* ---------- scroll progress + hide-on-scroll nav ---------- */
      gsap.fromTo(".progress", { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
      const navHide = gsap.to(".nav", { yPercent: -110, duration: 0.45, ease: "power3.out", paused: true });
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 240) navHide.play();
          else navHide.reverse();
        },
      });

      /* ---------- hero intro (plays after the preloader) ---------- */
      const heroTitle = root.querySelector<HTMLElement>(".hero-title");
      const intro = gsap.timeline({ paused: true });
      if (heroTitle) {
        const chars = split(heroTitle, "chars");
        splitEls.push(heroTitle);
        if (!introDone) {
          intro.from(chars, { yPercent: 125, rotate: 9, duration: 1.25, ease: "expo.out", stagger: 0.028 }, 0);
        }
      }
      if (!introDone) {
        intro
          .from("[data-intro]", { y: 44, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 }, 0.35)
          .from(".hero .blob", { scale: 0.5, opacity: 0, duration: 2.2, ease: "power3.out", stagger: 0.18 }, 0);
      }

      /* ---------- preloader ---------- */
      if (!introDone && pre) {
        const countNode = pre.querySelector(".pl-count")?.firstChild as Text | null;
        const o = { v: 0 };
        const tl = gsap.timeline({
          onComplete: () => {
            introDone = true;
            pre.style.display = "none";
            lenis.start();
          },
        });
        tl.fromTo(".pl-name", { yPercent: 115 }, { yPercent: 0, duration: 1, ease: "expo.out" }, 0.1)
          .fromTo(".pl-role", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5)
          .to(o, {
            v: 100, duration: 1.9, ease: "power2.inOut",
            onUpdate: () => { if (countNode) countNode.nodeValue = String(Math.round(o.v)).padStart(3, "0"); },
          }, 0)
          .fromTo(".pl-bar i", { scaleX: 0 }, { scaleX: 1, duration: 1.9, ease: "power2.inOut" }, 0)
          .to(".pl-inner", { yPercent: -30, opacity: 0, duration: 0.7, ease: "power3.in" }, 2.05)
          .to(pre, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "expo.inOut" }, 2.2)
          .add(() => intro.play(0), 2.75);
      } else {
        pre && (pre.style.display = "none");
        intro.play(0);
      }

      /* ---------- hero: parallax blobs, fade on scroll ---------- */
      const blobs = q(".hero .blob");
      if (fine) {
        const movers = blobs.map((b, i) => ({
          x: gsap.quickTo(b, "x", { duration: 1.8, ease: "power3.out" }),
          y: gsap.quickTo(b, "y", { duration: 1.8, ease: "power3.out" }),
          d: (i + 1) * 36,
        }));
        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => { m.x(nx * m.d * 2); m.y(ny * m.d * 2); });
        };
        window.addEventListener("mousemove", onMove);
        cleanups.push(() => window.removeEventListener("mousemove", onMove));
      }
      gsap.to(".hero-inner", {
        yPercent: -14, opacity: 0.15, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero .blob", {
        yPercent: 40, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      /* ---------- split headings reveal on scroll ---------- */
      q("[data-split]").forEach((el) => {
        const chars = split(el, "chars");
        splitEls.push(el);
        gsap.from(chars, {
          yPercent: 115, rotate: 6, duration: 1.1, ease: "expo.out", stagger: 0.022,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* ---------- scrubbed word-by-word paragraph ---------- */
      q("[data-scrub]").forEach((el) => {
        const words = split(el, "words");
        splitEls.push(el);
        gsap.fromTo(words, { opacity: 0.13 }, {
          opacity: 1, ease: "none", stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: true },
        });
      });

      /* ---------- generic reveals ---------- */
      q("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 56, opacity: 0, duration: 1.15, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      q("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          y: 50, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* ---------- drawn lines ---------- */
      q("[data-line-x]").forEach((el) => {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: "left center", duration: 1.4, ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
      q("[data-line-y]").forEach((el) => {
        gsap.fromTo(el, { scaleY: 0 }, {
          scaleY: 1, transformOrigin: "top center", ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top 75%", end: "bottom 60%", scrub: true },
        });
      });
      q(".timeline li").forEach((li) => {
        gsap.from(li, {
          x: -30, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: li, start: "top 88%", once: true },
        });
      });

      /* ---------- clip-path image reveal + parallax ---------- */
      q("[data-clip]").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      q("[data-parallax]").forEach((el) => {
        const s = parseFloat(el.dataset.parallax || "0.2");
        gsap.fromTo(el, { yPercent: -s * 50 }, {
          yPercent: s * 50, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      /* ---------- marquees (speed reacts to scroll velocity) ---------- */
      q(".marquee").forEach((m) => {
        const track = m.querySelector<HTMLElement>(".marquee-track");
        if (!track) return;
        const dir = m.dataset.dir === "right" ? 1 : -1;
        let x = 0;
        let started = false;
        const step = (_t: number, dt: number) => {
          const w = track.scrollWidth / 2;
          if (!w) return;
          if (!started) { x = dir > 0 ? -w : 0; started = true; }
          const v = Math.abs(lenis.velocity || 0);
          x += dir * (70 + v * 16) * (dt / 1000);
          if (dir < 0 && x <= -w) x += w;
          if (dir > 0 && x >= 0) x -= w;
          gsap.set(track, { x });
        };
        gsap.ticker.add(step);
        cleanups.push(() => gsap.ticker.remove(step));
      });

      /* ---------- word/char hover wave on big contact title ---------- */
      /* (CSS handles it) */
    }, root);

    /* ---------- pinned horizontal gallery (desktop only) ---------- */
    mm.add("(min-width: 900px)", () => {
      const pin = root.querySelector<HTMLElement>(".hpin");
      const track = root.querySelector<HTMLElement>(".htrack");
      if (!pin || !track) return;
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 40);
      const hTween = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: pin, start: "top top", end: () => "+=" + dist(),
          pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1,
        },
      });
      gsap.fromTo(".hprog i", { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist(), scrub: true, invalidateOnRefresh: true },
      });
      root.querySelectorAll<HTMLElement>(".hcard .art-inner").forEach((inner) => {
        gsap.fromTo(inner, { x: -70 }, {
          x: 70, ease: "none",
          scrollTrigger: {
            trigger: inner.closest(".hcard"), containerAnimation: hTween,
            start: "left right", end: "right left", scrub: true,
          },
        });
      });
    });

    /* ---------- pointer-driven effects (fine pointers only) ---------- */
    if (fine) {
      document.body.classList.add("has-cursor");
      const dot = root.querySelector<HTMLElement>(".cursor-dot");
      const ring = root.querySelector<HTMLElement>(".cursor-ring");
      const label = root.querySelector<HTMLElement>(".cursor-label");
      if (dot && ring) {
        const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
        const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
        const rx = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
        const ry = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });
        const move = (e: MouseEvent) => {
          dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
          dot.classList.add("on"); ring.classList.add("on");
        };
        const over = (e: MouseEvent) => {
          const t = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor-text], .film");
          const text = t?.dataset.cursorText;
          ring.classList.toggle("hover", !!t);
          ring.classList.toggle("text", !!text);
          if (label) label.textContent = text || "";
        };
        const leave = () => { dot.classList.remove("on"); ring.classList.remove("on"); };
        window.addEventListener("mousemove", move);
        document.addEventListener("mouseover", over);
        document.documentElement.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          window.removeEventListener("mousemove", move);
          document.removeEventListener("mouseover", over);
          document.documentElement.removeEventListener("mouseleave", leave);
        });
      }

      // magnetic elements
      q("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.45)" });
        const mv = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.38);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.38);
        };
        const lv = () => { xTo(0); yTo(0); };
        el.addEventListener("mousemove", mv);
        el.addEventListener("mouseleave", lv);
        cleanups.push(() => { el.removeEventListener("mousemove", mv); el.removeEventListener("mouseleave", lv); });
      });

      // 3D tilt cards
      q("[data-tilt]").forEach((el) => {
        const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
        gsap.set(el, { transformPerspective: 1000 });
        const mv = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          ryTo(((e.clientX - r.left) / r.width - 0.5) * 9);
          rxTo(-((e.clientY - r.top) / r.height - 0.5) * 9);
        };
        const lv = () => { rxTo(0); ryTo(0); };
        el.addEventListener("mousemove", mv);
        el.addEventListener("mouseleave", lv);
        cleanups.push(() => { el.removeEventListener("mousemove", mv); el.removeEventListener("mouseleave", lv); });
      });

      // cursor-following spotlight on cards
      const spot = (e: MouseEvent) => {
        const t = (e.target as HTMLElement).closest<HTMLElement>(".spot");
        if (!t) return;
        const r = t.getBoundingClientRect();
        t.style.setProperty("--mx", `${e.clientX - r.left}px`);
        t.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      root.addEventListener("mousemove", spot);
      cleanups.push(() => root.removeEventListener("mousemove", spot));
    }

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
    fontsReady?.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("load", onLoad);
      document.removeEventListener("click", onAnchor);
      cleanups.forEach((f) => f());
      mm.revert();
      ctx.revert();
      splitEls.forEach(restoreSplit);
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.body.classList.remove("has-cursor");
      if (pre && introDone) pre.style.display = "none";
    };
  }, [rootRef, motionOff, ready]);
}
