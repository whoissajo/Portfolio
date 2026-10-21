"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  site, preloader, nav, hero, marquee, about, work, process as processData, impact, ripples,
  films, social, speaking, journey, contact,
} from "@/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MotionOffContext, useMotionOff } from "./MotionContext";
import { useMotion } from "./useMotion";

/* ================= helpers ================= */

/** Number that counts up the first time it scrolls into view. */
function Count({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const off = useMotionOff();
  useEffect(() => {
    const el = ref.current;
    const node = el?.firstChild as Text | null;
    const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !node || !m || off || reduce) return;
    const [, pre, num, suf] = m;
    const end = parseFloat(num.replace(/,/g, ""));
    const dec = (num.split(".")[1] || "").length;
    const o = { v: 0 };
    let tween: gsap.core.Tween | undefined;
    node.nodeValue = pre + (0).toFixed(dec) + suf;
    const st = ScrollTrigger.create({
      trigger: el, start: "top 94%", once: true,
      onEnter: () => {
        tween = gsap.to(o, {
          v: end, duration: 1.9, ease: "power2.out",
          onUpdate: () => { node.nodeValue = pre + o.v.toFixed(dec) + suf; },
        });
      },
    });
    return () => { st.kill(); tween?.kill(); node.nodeValue = value; };
  }, [value, off]);
  return <span ref={ref}>{value}</span>;
}

/** Re-plays a stagger-in on the children of `ref` whenever `dep` changes. */
function usePanelAnim(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const off = useMotionOff();
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (off || !ref.current) return;
    const tw = gsap.fromTo(
      ref.current.children,
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.09, clearProps: "transform,opacity" }
    );
    return () => { tw.kill(); };
  }, [dep, off]);
  return ref;
}

function Heading({ n, label, lines }: { n: string; label: string; lines: string[] }) {
  return (
    <div className="head">
      <p className="label" data-reveal>
        <span className="num">{n} /</span> {label}
        <span className="rule" data-line-x />
      </p>
      <h2 className="display" data-split="chars">
        {lines[0]} <em>{lines[1]}</em>
      </h2>
    </div>
  );
}

function Tabs({ names, active, onChange, label }: {
  names: string[]; active: number; onChange: (i: number) => void; label: string;
}) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {names.map((n, i) => (
        <button key={n} role="tab" className="tab" aria-selected={active === i} onClick={() => onChange(i)}>
          {n}
        </button>
      ))}
    </div>
  );
}

function GenArt({ hue, image }: { hue: number; image?: string }) {
  return (
    <div className="art" style={{ "--h": hue } as CSSProperties} aria-hidden>
      <div className="art-inner">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="art-img" src={image} alt="" loading="lazy" />
        ) : (
          <>
            <i className="ab a1" /><i className="ab a2" /><i className="ab a3" />
            <div className="art-grid" />
          </>
        )}
      </div>
    </div>
  );
}

/* ================= chrome ================= */

function Preloader() {
  return (
    <div className="preloader" aria-hidden>
      <div className="pl-inner">
        <div className="pl-mask"><div className="pl-name">{preloader.name}</div></div>
        <div className="pl-role">{preloader.role}</div>
      </div>
      <div className="pl-foot">
        <span className="pl-count">000</span>
        <span className="pl-bar"><i /></span>
      </div>
    </div>
  );
}

function Cursor() {
  return (
    <>
      <div className="cursor-ring" aria-hidden><span className="cursor-label" /></div>
      <div className="cursor-dot" aria-hidden />
    </>
  );
}

function Nav({ motionOff, toggleMotion }: { motionOff: boolean; toggleMotion: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a href="#top" className="logo" data-magnetic>{site.name}<span className="logo-dot">.</span></a>
          <nav className="nav-links" aria-label="Primary">
            {nav.map((l) => <a key={l.href} href={l.href} className="ulink">{l.label}</a>)}
            <button className="motion-toggle" onClick={toggleMotion} aria-pressed={motionOff}>
              Motion {motionOff ? "Off" : "On"}
            </button>
            <a className="btn primary" href="#contact" data-magnetic><span>Contact</span></a>
          </nav>
          <button className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>
      {/* sibling of the header: backdrop-filter on the header would otherwise trap this fixed overlay */}
      <div id="mobile-menu" className="mobile-menu" data-open={open} onClick={() => setOpen(false)}>
        {[...nav, { label: "Contact", href: "#contact" }].map((l, i) => (
          <a key={l.href} href={l.href} style={{ transitionDelay: `${0.12 + i * 0.07}s` }}>{l.label}</a>
        ))}
        <button className="motion-toggle" onClick={(e) => { e.stopPropagation(); toggleMotion(); }}>
          Motion {motionOff ? "Off" : "On"}
        </button>
      </div>
    </>
  );
}

/* ================= sections ================= */

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="blobs" aria-hidden><i className="blob b1" /><i className="blob b2" /><i className="blob b3" /></div>
      <div className="grid-bg" aria-hidden />
      <div className="wrap hero-inner">
        <p className="eyebrow" data-intro><span className="dot" /> {hero.eyebrow}</p>
        <h1 className="hero-title">
          {hero.headlineStart} <em>{hero.headlineItalic}</em>{hero.headlineEnd}
        </h1>
        <p className="lede hero-sub" data-intro>{hero.sub}</p>
        <div className="cta-row" data-intro>
          <a className="btn primary" href={hero.primaryCta.href} data-magnetic><span>{hero.primaryCta.label} →</span></a>
          <a className="btn" href={hero.secondaryCta.href} data-magnetic><span>{hero.secondaryCta.label}</span></a>
        </div>
        <div className="stats" data-intro>
          {hero.stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="v"><Count value={s.value} /></div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-cue" data-intro aria-hidden><span className="cue-line" />Scroll</div>
    </section>
  );
}

function Marquees() {
  const row = (items: string[], dir: "left" | "right", outline: boolean) => {
    const group = (k: string) => (
      <div className="marquee-group" key={k} aria-hidden={k === "b"}>
        {items.map((t, i) => (
          <span className={`mq-item ${outline && i % 2 ? "outline" : ""}`} key={t + i}>
            {t}<span className="mq-star">✦</span>
          </span>
        ))}
      </div>
    );
    return (
      <div className="marquee" data-dir={dir}>
        <div className="marquee-track">{group("a")}{group("b")}</div>
      </div>
    );
  };
  return (
    <div className="marquees" aria-label="Skills">
      {row(marquee.top, "left", true)}
      {row(marquee.bottom, "right", false)}
    </div>
  );
}

function About() {
  return (
    <section id="about">
      <div className="wrap">
        <Heading n="01" label={about.label} lines={about.heading} />
        <p className="scrub" data-scrub>{about.body}</p>
        <div className="about-foot">
          <a className="text-link ulink" href={about.link.href}>{about.link.label} →</a>
          <div className="chips" data-stagger>
            {about.disciplines.map((d) => <span className="chip" key={d}>{d}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  const [open, setOpen] = useState(false);
  return (
    <section id="work" className="hwork">
      <div className="hpin">
        <div className="wrap hhead">
          <Heading n="02" label={work.label} lines={work.heading} />
          <div className="hprog" aria-hidden><i /></div>
        </div>
        <div className="htrack">
          {work.projects.map((p, i) => (
            <a className="hcard spot" key={p.title} href={p.href} data-cursor-text="View" data-tilt>
              <GenArt hue={p.hue} image={p.image} />
              <div className="hcard-top">
                <span className="big-idx">0{i + 1}</span>
                <span className="tag">{p.tag}</span>
              </div>
              <div className="hcard-body">
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="tags">{p.stack.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
              </div>
              <span className="arrow" aria-hidden>↗</span>
            </a>
          ))}
          <div className="hcard hend">
            <div>
              <p className="label"><span className="num">+</span> {work.moreLabel}</p>
              <div className="mini-list">
                {work.more.map((m) => (
                  <a key={m.title} href={m.href} className="mini ulink"><strong>{m.title}</strong><span>{m.summary}</span></a>
                ))}
              </div>
              <div className="expand" data-open={open}>
                <button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                  <span className="plus" aria-hidden>+</span> {work.expandLabel}
                </button>
                {open && <p className="body">{work.expandBody}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const [tab, setTab] = useState(0);
  const panel = usePanelAnim(tab);
  return (
    <section id="process">
      <div className="wrap">
        <Heading n="03" label={processData.label} lines={processData.heading} />
        <div data-reveal>
          <Tabs names={processData.tabs.map((t) => t.name)} active={tab} onChange={setTab} label="Discipline" />
          <div className="steps" role="tabpanel" ref={panel}>
            {processData.tabs[tab].steps.map((s, i) => (
              <div className="step spot" key={tab + s.title}>
                <span className="n">0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section id="impact">
      <div className="wrap">
        <Heading n="04" label={impact.label} lines={impact.heading} />
        <div className="figures" data-stagger>
          {impact.stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="v big"><Count value={s.value} /></div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="thread" data-reveal>{impact.thread}</p>
        <div className="tl">
          <span className="tl-line" data-line-y aria-hidden />
          <ul className="timeline">
            {impact.timeline.map((t) => (
              <li key={t.year}><span className="y">{t.year}</span><span className="t">{t.text}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Ripples() {
  const [tab, setTab] = useState(0);
  const panel = usePanelAnim(tab);
  return (
    <section id="ripples">
      <div className="wrap">
        <Heading n="05" label={ripples.label} lines={ripples.heading} />
        <div data-reveal>
          <Tabs names={ripples.tabs.map((t) => t.name)} active={tab} onChange={setTab} label="Audience type" />
          <div className="figures" role="tabpanel" ref={panel}>
            {ripples.tabs[tab].figures.map((f) => (
              <div className="stat" key={tab + f.label}>
                <div className="v big"><Count value={f.value} /></div>
                <div className="l">{f.label}</div>
              </div>
            ))}
          </div>
          <p className="fine">{ripples.disclaimer}</p>
        </div>
        <p className="thread" data-reveal>{ripples.closing}</p>
      </div>
    </section>
  );
}

function Films() {
  const [filter, setFilter] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const grid = usePanelAnim(filter);
  const active = films.filters[filter];
  const items = films.items.filter((f) => active === "All" || f.category === active);
  return (
    <section id="films">
      <div className="wrap">
        <Heading n="06" label={films.label} lines={films.heading} />
        <div data-reveal>
          <Tabs names={films.filters} active={filter} onChange={setFilter} label="Filter videos" />
          <div className="films" ref={grid}>
            {items.map((f, i) => {
              const key = `${f.youtubeId}-${f.category}-${i}`;
              return (
                <div className="film" key={key} data-cursor-text={playing === key ? undefined : "Play"}>
                  {playing === key ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${f.youtubeId}?autoplay=1`}
                      title={f.title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button className="film-btn" onClick={() => setPlaying(key)} aria-label={`Play ${f.title}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="thumb" src={`https://i.ytimg.com/vi/${f.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
                      <span className="play" aria-hidden>▶</span>
                    </button>
                  )}
                  <div className="meta"><span>{f.title}</span><span className="tag">{f.category}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Social() {
  return (
    <section id="social">
      <div className="wrap">
        <p className="label" data-reveal><span className="num">07 /</span> {social.label}<span className="rule" data-line-x /></p>
        <div className="cards" data-stagger>
          {social.cards.map((c) => (
            <a className="card spot" key={c.platform} href={c.href} target="_blank" rel="noreferrer" data-tilt data-cursor-text="Open">
              <h3>{c.platform}</h3>
              <p>{c.handle} ↗</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Speaking() {
  return (
    <section id="speaking">
      <div className="wrap">
        <Heading n="08" label={speaking.label} lines={speaking.heading} />
        <div className="speak-frame" data-clip>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="speak-img" data-parallax="0.25" src={speaking.image.src} alt={speaking.image.alt} />
        </div>
        <div className="speak-copy">
          <div className="topics" data-stagger>{speaking.topics.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
          <p className="lede" data-reveal>{speaking.teaser}</p>
          <p style={{ marginTop: 28 }} data-reveal>
            <a className="btn primary" href={speaking.cta.href} data-magnetic><span>{speaking.cta.label}</span></a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey">
      <div className="wrap">
        <Heading n="09" label={journey.label} lines={journey.heading} />
        <div className="tl">
          <span className="tl-line" data-line-y aria-hidden />
          <ul className="timeline">
            {journey.entries.map((e) => (
              <li key={e.year}><span className="y">{e.year}</span><span className="t">{e.text}</span></li>
            ))}
            <li className="next"><span className="y">Next</span><span className="t">{journey.next}</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <p className="label center" data-reveal><span className="num">10 /</span> {contact.label}</p>
        <h2 className="display giant" data-split="chars">{contact.heading[0]} <em>{contact.heading[1]}</em></h2>
        <p className="lede" data-reveal>{contact.body}</p>
        <a className="btn primary xl" href={contact.cta.href} data-magnetic data-reveal><span>{contact.cta.label} →</span></a>
        <div className="socials" data-stagger>
          {contact.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="ulink">{s.label}</a>)}
        </div>
      </div>
    </section>
  );
}

/* ================= page ================= */

export default function Portfolio() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [motionOff, setMotionOff] = useState(false);
  const [ready, setReady] = useState(false);

  // read the saved preference once, before any animation starts
  useEffect(() => {
    try { if (localStorage.getItem("motion-off") === "1") setMotionOff(true); } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("motion-off", motionOff);
    try { localStorage.setItem("motion-off", motionOff ? "1" : "0"); } catch {}
  }, [motionOff, ready]);

  useMotion(rootRef, motionOff, ready);

  return (
    <MotionOffContext.Provider value={motionOff}>
      <div ref={rootRef} className="app">
        <noscript><style>{".preloader{display:none!important}"}</style></noscript>
        <Preloader />
        <Cursor />
        <div className="progress" aria-hidden />
        <div className="grain" aria-hidden />
        <a className="skip-link" href="#work">Skip to content</a>
        <Nav motionOff={motionOff} toggleMotion={() => setMotionOff((m) => !m)} />
        <main>
          <Hero />
          <Marquees />
          <About />
          <Work />
          <Process />
          <Impact />
          <Ripples />
          <Films />
          <Social />
          <Speaking />
          <Journey />
          <Contact />
        </main>
        <footer>
          <div className="foot-big" aria-hidden>{site.name}</div>
          <div className="wrap foot-row">
            <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
            <a className="ulink" href="#top">Back to top ↑</a>
          </div>
        </footer>
      </div>
    </MotionOffContext.Provider>
  );
}
