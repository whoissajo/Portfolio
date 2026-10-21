"use client";

import { useEffect, useState } from "react";
import {
  site, nav, hero, about, work, process, impact, ripples,
  films, social, speaking, journey, contact,
} from "@/content";

/* ---------- small helpers ---------- */

function Heading({ n, label, lines }: { n: string; label: string; lines: string[] }) {
  return (
    <div className="reveal">
      <p className="label"><span className="num">{n} /</span> {label}</p>
      <h2 className="display">
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
        <button
          key={n}
          role="tab"
          className="tab"
          aria-selected={active === i}
          onClick={() => onChange(i)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

/* ---------- sections ---------- */

function Nav({ motionOff, toggleMotion }: { motionOff: boolean; toggleMotion: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="logo">{site.name}</a>
        <nav className="nav-links" aria-label="Primary">
          {nav.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <button className="motion-toggle" onClick={toggleMotion} aria-pressed={motionOff}>
            Motion {motionOff ? "Off" : "On"}
          </button>
          <a className="btn primary" href="#contact">Contact</a>
        </nav>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="mobile-menu" onClick={() => setOpen(false)}>
          {nav.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          <a href="#contact">Contact</a>
          <button className="motion-toggle" style={{ alignSelf: "flex-start", marginTop: 12 }} onClick={toggleMotion}>
            Motion {motionOff ? "Off" : "On"}
          </button>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <p className="eyebrow reveal"><span className="dot" /> {hero.eyebrow}</p>
        <h1 className="display reveal">
          {hero.headlineStart} <em>{hero.headlineItalic}</em>{hero.headlineEnd}
        </h1>
        <div className="cta-row reveal">
          <a className="btn primary" href={hero.primaryCta.href}>{hero.primaryCta.label} →</a>
          <a className="btn" href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
        </div>
        <div className="stats reveal">
          {hero.stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="v">{s.value}</div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about">
      <div className="wrap">
        <Heading n="01" label={about.label} lines={about.heading} />
        <div className="about-grid">
          <div className="reveal">
            <p className="lede">{about.body}</p>
            <a className="text-link" href={about.link.href}>{about.link.label} →</a>
          </div>
          <div className="chips reveal">
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
    <section id="work">
      <div className="wrap">
        <Heading n="02" label={work.label} lines={work.heading} />
        <div className="cards">
          {work.projects.map((p, i) => (
            <a className="card reveal" key={p.title} href={p.href}>
              <span className="idx">0{i + 1} / {p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <div className="tags">{p.stack.map((s) => <span className="tag" key={s}>{s}</span>)}</div>
            </a>
          ))}
        </div>
        <div className="sub reveal">
          <h3>{work.moreLabel}</h3>
          <div className="cards two">
            {work.more.map((m) => (
              <a className="card" key={m.title} href={m.href}>
                <h3>{m.title}</h3>
                <p>{m.summary}</p>
              </a>
            ))}
          </div>
        </div>
        <div className="expand reveal" data-open={open}>
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            <span className="plus" aria-hidden>+</span> {work.expandLabel}
          </button>
          {open && <p className="body">{work.expandBody}</p>}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const [tab, setTab] = useState(0);
  return (
    <section id="process">
      <div className="wrap">
        <Heading n="03" label={process.label} lines={process.heading} />
        <div className="reveal">
          <Tabs names={process.tabs.map((t) => t.name)} active={tab} onChange={setTab} label="Discipline" />
          <div className="steps" role="tabpanel">
            {process.tabs[tab].steps.map((s, i) => (
              <div className="step" key={s.title}>
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
        <div className="figures reveal">
          {impact.stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="v">{s.value}</div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="thread reveal">{impact.thread}</p>
        <ul className="timeline reveal">
          {impact.timeline.map((t) => (
            <li key={t.year}><span className="y">{t.year}</span><span className="t">{t.text}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Ripples() {
  const [tab, setTab] = useState(0);
  return (
    <section id="ripples">
      <div className="wrap">
        <Heading n="05" label={ripples.label} lines={ripples.heading} />
        <div className="reveal">
          <Tabs names={ripples.tabs.map((t) => t.name)} active={tab} onChange={setTab} label="Audience type" />
          <div className="figures" role="tabpanel">
            {ripples.tabs[tab].figures.map((f) => (
              <div className="stat" key={f.label}>
                <div className="v">{f.value}</div>
                <div className="l">{f.label}</div>
              </div>
            ))}
          </div>
          <p className="fine">{ripples.disclaimer}</p>
          <p className="thread">{ripples.closing}</p>
        </div>
      </div>
    </section>
  );
}

function Films() {
  const [filter, setFilter] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const active = films.filters[filter];
  const items = films.items.filter((f) => active === "All" || f.category === active);
  return (
    <section id="films">
      <div className="wrap">
        <Heading n="06" label={films.label} lines={films.heading} />
        <div className="reveal">
          <Tabs names={films.filters} active={filter} onChange={setFilter} label="Filter videos" />
          <div className="films">
            {items.map((f, i) => {
              const key = `${f.youtubeId}-${i}`;
              return (
                <div className="film" key={key}>
                  {playing === key ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${f.youtubeId}?autoplay=1`}
                      title={f.title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button style={{ width: "100%", textAlign: "left" }} onClick={() => setPlaying(key)} aria-label={`Play ${f.title}`}>
                      <img className="thumb" src={`https://i.ytimg.com/vi/${f.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
                      <span className="play" aria-hidden>▶</span>
                    </button>
                  )}
                  <div className="meta">
                    <span>{f.title}</span>
                    <span className="tag">{f.category}</span>
                  </div>
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
        <p className="label reveal"><span className="num">07 /</span> {social.label}</p>
        <div className="cards">
          {social.cards.map((c) => (
            <a className="card reveal" key={c.platform} href={c.href} target="_blank" rel="noreferrer" style={{ minHeight: 0 }}>
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
        <img className="speak-img reveal" src={speaking.image.src} alt={speaking.image.alt} />
        <div className="reveal">
          <div className="topics">{speaking.topics.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
          <p className="lede">{speaking.teaser}</p>
          <p style={{ marginTop: 28 }}><a className="btn primary" href={speaking.cta.href}>{speaking.cta.label}</a></p>
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
        <ul className="timeline reveal" style={{ marginTop: 0 }}>
          {journey.entries.map((e) => (
            <li key={e.year}><span className="y">{e.year}</span><span className="t">{e.text}</span></li>
          ))}
          <li className="next"><span className="y">Next</span><span className="t">{journey.next}</span></li>
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <p className="label reveal" style={{ justifyContent: "center" }}><span className="num">10 /</span> {contact.label}</p>
        <h2 className="display reveal">{contact.heading[0]} <em>{contact.heading[1]}</em></h2>
        <p className="lede reveal">{contact.body}</p>
        <a className="btn primary reveal" href={contact.cta.href}>{contact.cta.label} →</a>
        <div className="socials reveal">
          {contact.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- page ---------- */

export default function Portfolio() {
  const [motionOff, setMotionOff] = useState(false);

  // restore saved motion preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("motion-off") === "1";
      if (saved) setMotionOff(true);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("motion-off", motionOff);
    try { localStorage.setItem("motion-off", motionOff ? "1" : "0"); } catch {}
  }, [motionOff]);

  // scroll-triggered reveals
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });

  return (
    <>
      <a className="skip-link" href="#work">Skip to content</a>
      <Nav motionOff={motionOff} toggleMotion={() => setMotionOff((m) => !m)} />
      <main>
        <Hero />
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
      <footer>© {new Date().getFullYear()} {site.name}. All rights reserved.</footer>
    </>
  );
}
