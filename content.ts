// ============================================================
//  EDIT THIS FILE — every word on the site comes from here.
//
//  Known from your old site's metadata:  name, role, React/frontend focus.
//  Everything marked TODO is a placeholder: replace it with your real info.
//  (My workspace could not open itsumar.is-a.dev, so nothing else was copied.)
//
//  Images: drop files into /public and set `image: "/your-file.png"` on a
//  project (or change speaking.image.src). Projects without an image show an
//  animated generated cover instead.
// ============================================================

export const site = {
  name: "M Umar",
  title: "M Umar | Web Developer & UI/UX Designer",
  description:
    "Professional portfolio of M Umar, a web developer and UI/UX designer building responsive, user-friendly websites.",
  url: "https://itsumar.is-a.dev", // TODO: your real domain
  locale: "en_US",
  email: "you@example.com", // TODO
  themeColor: "#030303",
};

export const preloader = {
  name: "M Umar",
  role: "Web Developer & UI/UX Designer",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Content", href: "#films" },
  { label: "Speaking", href: "#speaking" },
];

export const hero = {
  eyebrow: "Available for collaboration",
  headlineStart: "I design & build websites that feel",
  headlineItalic: "alive",
  headlineEnd: ".",
  sub: "Web developer and UI/UX designer crafting responsive, user-friendly websites with React.",
  primaryCta: { label: "See my work", href: "#work" },
  secondaryCta: { label: "Get in touch", href: "#contact" },
  // TODO: replace with your real numbers
  stats: [
    { value: "3+", label: "Years building" },
    { value: "20+", label: "Projects shipped" },
    { value: "100%", label: "Responsive" },
  ],
};

export const marquee = {
  top: ["Web Development", "UI / UX Design", "React", "Frontend", "Responsive Design"],
  bottom: ["Let's build something", "Open for collaboration", "Pixel-perfect", "Fast & accessible"],
};

export const about = {
  label: "About",
  heading: ["Designer who", "codes"],
  // TODO: replace with your real bio
  body:
    "I'm M Umar, a web developer and UI/UX designer. I turn ideas into responsive, user-friendly websites, caring as much about how a page feels as how it is built. Replace this paragraph with your own story.",
  link: { label: "My journey", href: "#journey" },
  disciplines: ["Web Development", "UI/UX Design", "React"],
};

export const work = {
  label: "Selected Work",
  heading: ["Things I have", "built"],
  // TODO: replace with your real projects. `image` is optional (see top of file).
  projects: [
    {
      title: "Project One",
      tag: "Web app",
      summary: "One sentence on what it is and the problem it solves.",
      stack: ["React", "TypeScript"],
      href: "#",
      hue: 78,
      image: "",
    },
    {
      title: "Project Two",
      tag: "UI/UX",
      summary: "One sentence on what it is and the problem it solves.",
      stack: ["Figma", "Design system"],
      href: "#",
      hue: 265,
      image: "",
    },
    {
      title: "Project Three",
      tag: "Website",
      summary: "One sentence on what it is and the problem it solves.",
      stack: ["React", "CSS"],
      href: "#",
      hue: 195,
      image: "",
    },
    {
      title: "Project Four",
      tag: "Experiment",
      summary: "One sentence on what it is and the problem it solves.",
      stack: ["JavaScript", "Animation"],
      href: "#",
      hue: 330,
      image: "",
    },
  ],
  moreLabel: "More ways I build",
  more: [
    { title: "Side project A", summary: "A smaller experiment or tool.", href: "#" },
    { title: "Side project B", summary: "Another smaller experiment.", href: "#" },
  ],
  expandLabel: "More details",
  expandBody:
    "Use this expandable block for extra context: case studies, write-ups or a longer list of projects.",
};

export const process = {
  label: "How I Work",
  heading: ["My", "process"],
  tabs: [
    {
      name: "Development",
      steps: [
        { title: "Understand", body: "Start from the problem and the people who have it." },
        { title: "Build", body: "Ship a thin vertical slice early, then iterate." },
        { title: "Refine", body: "Measure, polish and remove what is not needed." },
      ],
    },
    {
      name: "Design",
      steps: [
        { title: "Explore", body: "Sketch many directions before picking one." },
        { title: "Prototype", body: "Make it clickable and test it with real users." },
        { title: "Systemise", body: "Turn what works into reusable components." },
      ],
    },
    {
      name: "Collaboration",
      steps: [
        { title: "Align", body: "Agree on goals, scope and what success looks like." },
        { title: "Share", body: "Show work early and often, no big reveals." },
        { title: "Launch", body: "Ship, learn and keep improving together." },
      ],
    },
  ],
};

export const impact = {
  label: "Impact",
  heading: ["Results that", "speak"],
  // TODO: real numbers
  stats: [
    { value: "20+", label: "Projects" },
    { value: "10+", label: "Happy clients" },
    { value: "99", label: "Lighthouse score" },
  ],
  thread: "The common thread: I turn ideas into interfaces people enjoy using.",
  timeline: [
    { year: "2026", text: "Milestone you are proud of." },
    { year: "2025", text: "Another milestone or achievement." },
    { year: "2024", text: "Where it started to take off." },
  ],
};

export const ripples = {
  label: "Ripples",
  heading: ["Where the work", "travels"],
  tabs: [
    { name: "Audience", figures: [{ value: "5K", label: "Followers" }, { value: "1K", label: "Newsletter" }] },
    { name: "Community", figures: [{ value: "300", label: "Members" }, { value: "40", label: "Contributors" }] },
    { name: "Product", figures: [{ value: "2K", label: "Users" }, { value: "4.8", label: "Avg. rating" }] },
  ],
  disclaimer: "Placeholder figures. Replace with your own.",
  closing: "Every project is a chance to create ripples beyond the first release.",
};

export const films = {
  label: "Films",
  heading: ["Videos &", "content"],
  filters: ["All", "Personal", "Brand"],
  // youtubeId: the part after v= in a YouTube URL. TODO: your videos (or delete this section).
  items: [
    { title: "Video title one", category: "Personal", youtubeId: "dQw4w9WgXcQ" },
    { title: "Video title two", category: "Brand", youtubeId: "dQw4w9WgXcQ" },
    { title: "Video title three", category: "Personal", youtubeId: "dQw4w9WgXcQ" },
    { title: "Video title four", category: "Brand", youtubeId: "dQw4w9WgXcQ" },
  ],
};

export const social = {
  label: "Find me",
  // TODO: replace handles and links with your real profiles
  cards: [
    { platform: "GitHub", handle: "@itsumar", href: "https://github.com/" },
    { platform: "LinkedIn", handle: "in/itsumar", href: "https://linkedin.com/" },
    { platform: "Instagram", handle: "@itsumar", href: "https://instagram.com/" },
  ],
};

export const speaking = {
  label: "Speaking",
  heading: ["Talks &", "workshops"],
  image: { src: "/speaking.svg", alt: "Speaking on stage" },
  topics: ["Topic one", "Topic two", "Topic three"],
  teaser: "A new talk series is coming soon.",
  cta: { label: "Invite me to speak", href: "mailto:you@example.com" },
};

export const journey = {
  label: "Journey",
  heading: ["How I", "got here"],
  // TODO: your real timeline
  entries: [
    { year: "2021", text: "Started learning web development." },
    { year: "2022", text: "First real projects and clients." },
    { year: "2024", text: "Moved deeper into UI/UX design." },
    { year: "2026", text: "Today: building, designing, collaborating." },
  ],
  next: "Next: what you are working toward",
};

export const contact = {
  label: "Contact",
  heading: ["Let's build", "something"],
  body: "Have a project in mind or want to collaborate on a responsive, user-friendly website? My inbox is open.",
  cta: { label: "Email me", href: "mailto:you@example.com" },
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Instagram", href: "https://instagram.com/" },
  ],
};
