// All copy lives here so the layout code stays content-agnostic.

export const profile = {
  name: "Srivishal Sivasubramanian",
  short: "Srivishal",
  user: "srivishal",
  host: "chennai",
  role: "Lead Engineer",
  company: "MeetStream",
  location: "Chennai, IN",
  email: "srivishal.sivasubramanian@gmail.com",
  github: "root-daemon",
  links: [
    { label: "GitHub", href: "https://github.com/root-daemon" },
    { label: "LinkedIn", href: "https://linkedin.com/in/srivishal-sivasubramanian" },
    { label: "Email", href: "mailto:srivishal.sivasubramanian@gmail.com" },
  ],
  // Typed out one after another in the hero.
  verbs: ["video pipelines", "meeting bots", "scrapers", "small Mac apps"],
  intro: "Lead engineer at MeetStream. Mostly backend, some frontend, and small tools on the side.",
  // Words wrapped in *asterisks* render in the accent colour.
  about:
    "I'm a lead engineer at MeetStream and still a student. Most of my work is backend: *video pipelines* on AWS, calendar integrations, and billing. On the side I build *small tools*, mostly for macOS and for other students. ClassPro, the academics app I work on, has about *15,000 monthly users*.",
};

// The neofetch block in the about section: key/value pairs, in order.
export const sysinfo: [string, string][] = [
  ["Role", "Lead Engineer @ MeetStream"],
  ["Location", "Chennai, IN"],
  ["Languages", "TypeScript, Go, Python, Swift"],
  ["Backend", "AWS Lambda, Step Functions, ECS, DynamoDB"],
  ["Media", "FFmpeg"],
  ["ClassPro", "15k monthly users, 1.1M+ page views"],
  ["Uptime", "99.9% through finals week"],
  ["Jobs", "4, before graduating"],
  ["Games", "Competitive shooters"],
  ["Music", "Retro synth (press play below)"],
];

export type Job = {
  company: string;
  role: string;
  period: string;
  place: string;
  points: string[];
};

export const jobs: Job[] = [
  {
    company: "MeetStream",
    role: "Lead Engineer",
    period: "2025 - now",
    place: "SF (remote)",
    points: [
      "Own the video pipeline: Lambda, Step Functions, ECS and FFmpeg split recordings into parallel chunks and stitch them back together in sync.",
      "Built the Google Calendar integration that sends bots to meetings: OAuth, webhooks, recurring events, and no duplicate bots.",
      "Built billing and credits on Stripe and DynamoDB, behind serverless APIs with custom authorizers.",
    ],
  },
  {
    company: "XARWIN",
    role: "Full Stack Developer",
    period: "2024 - 2025",
    place: "Chennai",
    points: [
      "Next.js and FastAPI dashboard that turns 2D images into 3D models.",
      "Made the 2D to 3D pipeline 25% faster and cut errors by 15%.",
      "Containerised it on GCP and added WebAR previews.",
    ],
  },
  {
    company: "GameUp",
    role: "Full Stack Developer",
    period: "2023 - 2024",
    place: "Chennai",
    points: [
      "AI chat app on the OpenAI API, with a Flutter frontend and a NestJS, MongoDB and Firebase backend.",
      "Support chatbot that handles about 30% of tickets.",
    ],
  },
  {
    company: "Nyx Wolves",
    role: "Full Stack Intern",
    period: "2023",
    place: "Chennai",
    points: [
      "Maintained React and Next.js apps with 10k monthly users.",
      "Built a document designer on Fabric.js.",
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  stack: string[];
  blurb: string;
  details: string[];
  href: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "classpro",
    title: "ClassPro",
    kind: "Product",
    year: "2024",
    stack: ["Next.js", "Go", "Fiber", "Supabase"],
    blurb: "Academics app used by about 15,000 SRM students a month.",
    details: [
      "15,000+ monthly users and 1.1M+ page views.",
      "A Go and Fiber scraper (goscraper) made data fetches about 40% faster.",
      "Held 99.9% uptime through exam-season traffic spikes.",
      "23 PRs in the suduolabs org.",
    ],
    href: "https://github.com/suduolabs/ClassPro",
    featured: true,
  },
  {
    slug: "klip",
    title: "KLIP",
    kind: "Desktop",
    year: "2026",
    stack: ["Electron", "TypeScript", "OpenAI"],
    blurb: "Hold a hotkey, ask a question out loud, and it answers using what's on your screen.",
    details: [
      "Voice-driven, screen-aware assistant for Windows, macOS and Linux.",
      "Uses OpenAI computer use, with cloud account sync in the app.",
    ],
    href: "https://github.com/root-daemon/klip",
    featured: true,
  },
  {
    slug: "lavalamp",
    title: "lavalamp",
    kind: "CLI",
    year: "2026",
    stack: ["TypeScript", "Workers AI"],
    blurb: "Terminal coding agent that runs on Cloudflare Workers AI, billed to your own account.",
    details: [
      "Edits code directly in your workspace from the terminal.",
      "Cloudflare first, with optional Anthropic, OpenAI and OpenRouter keys.",
    ],
    href: "https://github.com/root-daemon/lavalamp-rewritten",
    featured: true,
  },
  {
    slug: "tinycast",
    title: "Tinycast Auto Quit",
    kind: "macOS",
    year: "2026",
    stack: ["Swift", "AppKit"],
    blurb: "Quits Mac apps you left open in the background, after a delay you set per app.",
    details: [
      "Per-app background auto quit with preset or custom delays.",
      "Native Swift, uses well under 100 MB of RAM.",
    ],
    href: "https://github.com/root-daemon/tinycast-autoquit",
    featured: true,
  },
  {
    slug: "xeno-crm",
    title: "Xeno Mini CRM",
    kind: "Agent",
    year: "2026",
    stack: ["Next.js", "Python", "BullMQ"],
    blurb: "CRM where an AI agent drafts campaigns and a person approves them before they send.",
    details: [
      "The agent proposes the segment, channel and message; a person approves.",
      "Redis and BullMQ queue with async delivery callbacks.",
    ],
    href: "https://github.com/root-daemon/xeno-crm",
  },
  {
    slug: "cnnig",
    title: "CNNIG",
    kind: "ML",
    year: "2026",
    stack: ["PyTorch", "FastAPI", "Next.js"],
    blurb: "CNN that classifies defects in silicon wafer maps.",
    details: [
      "Wafer-map defect classifier with a FastAPI inference service.",
      "Next.js dashboard for exploring predictions. Built for a research paper.",
    ],
    href: "https://github.com/root-daemon/cnnig",
  },
  {
    slug: "berri-space",
    title: "Berri Space",
    kind: "SaaS",
    year: "2026",
    stack: ["TypeScript", "RAG"],
    blurb: "Shared document space with folder permissions and an assistant that answers from your docs.",
    details: [
      "Folder and file permissions, with a dedicated test suite for enforcement.",
      "RAG assistant that answers questions about your documents.",
    ],
    href: "https://github.com/root-daemon/berri-space",
  },
  {
    slug: "speech-analytics",
    title: "Speech Analytics",
    kind: "ML",
    year: "2026",
    stack: ["Whisper", "Docker", "CUDA"],
    blurb: "Upload audio and get a transcript, sentiment, keywords and a summary.",
    details: ["Whisper, RoBERTa, KeyBERT and BART on GPU, all in Docker."],
    href: "https://github.com/root-daemon/dockerized-speech-analytics",
  },
  {
    slug: "gradex",
    title: "GradeX",
    kind: "Tool",
    year: "2025",
    stack: ["JavaScript"],
    blurb: "CGPA calculator for SRM students that works out the marks you still need.",
    details: ["Required-mark calculator for SRM students. 6 stars on GitHub."],
    href: "https://github.com/root-daemon/gradex",
  },
  {
    slug: "saveme",
    title: "SaveMe",
    kind: "Web3",
    year: "2025",
    stack: ["Solidity", "TypeScript"],
    blurb: "Smart contracts that pull your funds out when a token starts to look like a rug pull.",
    details: ["Real-time anomaly detection triggers an automated exit."],
    href: "https://github.com/root-daemon/saveme",
  },
];

// Merged or open PRs in other people's repos.
export const contributions = [
  { repo: "vorssaint/vorssaint-utils", stars: "28.5k", note: "Dock preview and command bar fixes", state: "merged" },
  { repo: "robinebers/openusage", stars: "4.4k", note: "Codex multi-account support", state: "merged" },
  { repo: "suduolabs/ClassPro", stars: "99", note: "23 PRs, from grading sliders to light mode", state: "merged" },
  { repo: "mrkai77/Loop", stars: "", note: "Physical Fn key tracking for media keys", state: "open" },
  { repo: "awaseem/foqos", stars: "", note: "Home Screen quick actions", state: "open" },
  { repo: "Swebi/Orderly", stars: "", note: "Classroom numbers in the timetable", state: "merged" },
];

export const skills = [
  "TypeScript", "Go", "Python", "Next.js", "React", "AWS CDK", "Lambda",
  "Step Functions", "DynamoDB", "FFmpeg", "Stripe", "FastAPI", "PyTorch",
  "Hono", "Elysia", "Fiber", "Bun", "Docker", "Swift", "Flutter", "Tauri", "LiveKit",
];
