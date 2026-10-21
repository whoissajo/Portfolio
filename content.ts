// ============================================================
//  EDIT THIS FILE — every word on the site comes from here.
// ============================================================

export const site = {
  name: "Your Name",
  title: "Your Name — Developer & Creator",
  description: "Portfolio of Your Name: projects, process, writing and talks.",
  url: "https://your-domain.vercel.app",
  locale: "en_US",
  email: "you@example.com",
  themeColor: "#030303",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Content", href: "#films" },
  { label: "Speaking", href: "#speaking" },
];

export const hero = {
  eyebrow: "Available for new projects",
  headlineStart: "I build things that",
  headlineItalic: "people actually use",
  headlineEnd: ".",
  primaryCta: { label: "See my work", href: "#work" },
  secondaryCta: { label: "Get in touch", href: "#contact" },
  stats: [
    { value: "5+", label: "Years building" },
    { value: "40+", label: "Projects shipped" },
    { value: "100K", label: "People reached" },
  ],
};

export const about = {
  label: "About",
  heading: ["A short line about", "who you are"],
  body:
    "Write two or three sentences about what you do, what you care about and what you are working toward. Keep it human and specific.",
  link: { label: "Read more about me", href: "#journey" },
  disciplines: ["Engineering", "Design", "Content"],
};

export const work = {
  label: "Selected Work",
  heading: ["Things I have", "built"],
  projects: [
    {
      title: "Project One",
      tag: "Web app",
      summary: "One sentence on what it is and the problem it solves.",
      stack: ["Next.js", "TypeScript", "Postgres"],
      href: "#",
    },
    {
      title: "Project Two",
      tag: "Mobile",
      summary: "One sentence on what it is and the problem it solves.",
      stack: ["React Native", "Firebase"],
      href: "#",
    },
    {
      title: "Project Three",
      tag: "Open source",
      summary: "One sentence on what it is and the problem it solves.",
      stack: ["Rust", "CLI"],
      href: "#",
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
      name: "Engineering",
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
      name: "Content",
      steps: [
        { title: "Research", body: "Find the angle only you can offer." },
        { title: "Create", body: "Write, record and edit with a clear audience in mind." },
        { title: "Distribute", body: "Share it where the right people already are." },
      ],
    },
  ],
};

export const impact = {
  label: "Impact",
  heading: ["Results that", "speak"],
  stats: [
    { value: "1M+", label: "Total views" },
    { value: "25", label: "Clients served" },
    { value: "12", label: "Talks given" },
  ],
  thread: "The common thread: I turn ideas into things people can use and enjoy.",
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
    { name: "Audience", figures: [{ value: "50K", label: "Followers" }, { value: "10K", label: "Newsletter" }] },
    { name: "Community", figures: [{ value: "3K", label: "Members" }, { value: "200", label: "Contributors" }] },
    { name: "Product", figures: [{ value: "20K", label: "Users" }, { value: "4.8", label: "Avg. rating" }] },
  ],
  disclaimer: "Figures are approximate and updated periodically.",
  closing: "Every project is a chance to create ripples beyond the first release.",
};

export const films = {
  label: "Films",
  heading: ["Videos &", "content"],
  filters: ["All", "Personal", "Brand"],
  // youtubeId: the part after v= in a YouTube URL
  items: [
    { title: "Video title one", category: "Personal", youtubeId: "dQw4w9WgXcQ" },
    { title: "Video title two", category: "Brand", youtubeId: "dQw4w9WgXcQ" },
    { title: "Video title three", category: "Personal", youtubeId: "dQw4w9WgXcQ" },
    { title: "Video title four", category: "Brand", youtubeId: "dQw4w9WgXcQ" },
  ],
};

export const social = {
  label: "Find me",
  cards: [
    { platform: "Instagram", handle: "@yourhandle", href: "https://instagram.com/" },
    { platform: "YouTube", handle: "@yourchannel", href: "https://youtube.com/" },
    { platform: "LinkedIn", handle: "in/yourname", href: "https://linkedin.com/" },
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
  entries: [
    { year: "2020", text: "Started learning and building." },
    { year: "2022", text: "First professional project." },
    { year: "2024", text: "Grew the audience and the work." },
    { year: "2026", text: "Today: building and sharing." },
  ],
  next: "Next: what you are working toward",
};

export const contact = {
  label: "Contact",
  heading: ["Let's build", "something"],
  body: "Have a project, a question or just want to say hi? My inbox is open.",
  cta: { label: "Email me", href: "mailto:you@example.com" },
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "X", href: "https://x.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],
};
