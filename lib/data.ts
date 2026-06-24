export const personal = {
  name: "Dhiraj Jha",
  firstName: "Dhiraj",
  title: "Systems Software Engineer",
  email: "jhadhiraj147@gmail.com",
  phone: "(615)-668-2773",
  location: "Nashville, TN",
  github: "https://github.com/jhadhiraj147",
  linkedin: "https://linkedin.com/in/jhadhiraj147",
  domain: "jhadhiraj.com",
  bio: "As an engineering student focused on systems software, backend infrastructure, and automation, I have worked on engineering automation at Google, legacy-data migration at Vanderbilt, and distributed systems projects in Go, C++, and Python. I am interested in software that has real constraints: correctness, reliability, latency, failure recovery, and maintainability.",
  roles: [
    "Systems Engineer",
    "Linux Internals",
    "Distributed Systems",
    "Backend Architect",
    "Founder @ offtofly",
  ],
};

export const education = [
  {
    school: "Fisk University",
    location: "Nashville, TN",
    logoPath: "/assets/fisk-logo.jpg",
    secondLogoPath: null,
    degrees: ["Computer Science (B.S.)", "Mathematics (B.A.)"],
    period: "Aug 2024 - May 2028",
    award: null,
    highlights: [
      { label: "Presidential", sub: "Scholar" },
      { label: "Vice President", sub: "Fisk Mathematics Club" },
    ],
    courses: [
      "Theory of Computation",
      "Java",
      "Python",
      "Quantum Computation",
      "Statistics",
      "Linear Algebra",
      "Discrete Mathematics",
      "Ordinary Differential Equations",
      "Real Analysis",
      "Algebraic Structures",
      "Higher Order Algebra",
    ],
  },
  {
    school: "Vanderbilt University",
    location: "Nashville, TN",
    logoPath: "/assets/vanderbilt-logo.png",
    secondLogoPath: null,
    degrees: ["Computer Engineering (Coursework)"],
    period: "Jan 2025 - Present",
    award: null,
    highlights: [],
    courses: [
      "Program Design & Algorithms",
      "Multivariable Calculus",
      "Intermediate Software Design",
      "Algorithms",
      "Computer Networking",
    ],
  },
  {
    school: "Xavier International College",
    location: "Kathmandu, Nepal",
    logoPath: "/assets/xavier.png",
    secondLogoPath: "/assets/cambridge.png",
    degrees: ["Cambridge International AS & A Levels"],
    period: "2021 - 2023",
    award: null,
    highlights: [
      { label: "Founding President", sub: "Xavier STEM Club (XSC)" },
      { label: "A+", sub: "Scholarship" },
      { label: "Finalist", sub: "Nepal Olympiad in Informatics 2022" },
      { label: "Semifinalist", sub: "Nepal Mathematical Olympiad 2022" },
    ],
    courses: [
      "A Level Physics",
      "A Level Mathematics",
      "A Level Chemistry",
      "A Level Further Mathematics",
      "A Level Computer Science",
    ],
  },
];

export const experiences = [
  {
    company: "Vanderbilt University",
    logo: "vanderbilt" as const,
    role: "Software Developer Intern",
    period: "Apr 2026 - Present",
    location: "Nashville, Tennessee",
    color: "from-[#268bd2] to-[#2aa198]",
    logoBg: "bg-white",
    badge: "bg-[#2aa198]/10 text-[#2aa198] border-[#2aa198]/20",
    tag: "Current",
    description: "Five years of sensitive Tier 3 data was trapped in a legacy system, scattered across PDFs, scanned files, and Word documents, and it needed to migrate to a modern third-party platform (Onsite Systems) without loss or corruption. The data had no consistent structure, and most of it couldn't move without being digitized first. I built an ETL pipeline using a multi-engine parser (PyMuPDF and pdfplumber running in parallel) with automated divergence flagging for when their outputs disagreed. For unstructured anomalies the parsers couldn't confidently resolve, I integrated a locally-hosted Llama 3 instance via Ollama, which kept sensitive data off external networks. The pipeline normalizes everything into JSON/YAML payloads structured for the vendor's strict API schema. Manual data entry was cut by 90%.",
  },
  {
    company: "Google",
    logo: "google" as const,
    role: "Software Developer Intern, SRE Team",
    period: "May 2025 - Aug 2025",
    location: "Sunnyvale, California",
    color: "from-[#268bd2] to-[#2aa198]",
    logoBg: "bg-white",
    badge: "bg-[#268bd2]/10 text-[#268bd2] border-[#268bd2]/20",
    tag: "Google",
    description: "Google's PRICE (Production Risks in Core Engineering) program periodically assesses system health across production infrastructure, but every cycle was entirely manual. Each assessment took around three days and required engineers to handle emailing, reporting, and bug tracking by hand. I was tasked with automating it end to end. I built PRICELess, a tool that orchestrates Google Workspace APIs to handle all communication and reporting automatically, and layered in a RAG pipeline that grounds LLM outputs in SRE principles so assessment reports come out standardized and citation-backed rather than freeform. I also built an auto-authentication service using LOAS to resolve the cross-service permission failures breaking calls between microservices. In the end, assessment time dropped from three days to fifteen minutes, and every previously manual step was eliminated.",
  },
  {
    company: "offtofly",
    logo: "offtofly" as const,
    role: "Founder & Lead Engineer",
    period: "Aug 2025 - Present",
    location: "Nashville, Tennessee",
    color: "from-[#268bd2] to-[#2aa198]",
    logoBg: "bg-gradient-to-br from-[#268bd2] to-[#2aa198]",
    badge: "bg-[#268bd2]/10 text-[#268bd2] border-[#268bd2]/20",
    tag: "Founder",
    description: "No existing travel tool generates a complete, optimized itinerary deterministically. They surface options, not answers. Offtofly is built to solve that. I am leading a five-person engineering team building the system from scratch as distributed microservices in Go, Python, and C++, communicating over REST and gRPC. The core is a custom graph database engine that models experiences as nodes with typed edges like location, timing, pace, and budget, so the constraint solver can compose valid itineraries without delegating the planning logic to an LLM.",
  },
];

export const projects = [
  {
    title: "AutoGrocery",
    subtitle: "IoT Smart Fridge Platform",
    date: "Jan 2026 - Mar 2026",
    description:
      "The idea was to attach smart refrigerators to online grocery platforms. The fridge detects what's running low and triggers an order automatically, including real-time dispatch to a warehouse robot for fulfillment. I structured four Go microservices covering ordering, inventory, pricing, and analytics, all communicating over gRPC to keep inter-service latency low. Warehouse robot dispatch runs on ZeroMQ pub-sub so events push immediately when an order clears. A REST API Gateway sits in front for auth, order history, and payment. It is the external-facing surface for users and third-party integrations.",
    tech: ["Go", "gRPC", "ZeroMQ", "Microservices", "REST", "IoT"],
    github: "https://github.com/jhadhiraj147",
    demo: null,
    color: "from-emerald-400/20 to-teal-500/20",
    accent: "#10b981",
  },
  {
    title: "Bluetooth AudioSync",
    subtitle: "Multi-Speaker Sync Engine",
    date: "Dec 2025 - Jan 2026",
    description:
      "Bluetooth A2DP gives you no native mechanism to synchronize playback across multiple speakers. Each device runs its own clock and they drift apart almost immediately. I built AudioSync in C++ to fix that. The tool runs concurrent playback pipelines with timestamped buffering across devices, estimates the clock offset between each speaker and a reference, and applies latency compensation to keep them aligned in real time. The result is tight, audible synchronization across a multi-speaker setup with no hardware modifications.",
    tech: ["C++", "Bluetooth A2DP", "Concurrency", "Real-Time Systems", "Clock Sync"],
    github: "https://github.com/jhadhiraj147",
    demo: null,
    color: "from-violet-400/20 to-purple-500/20",
    accent: "#8b5cf6",
  },
];

export const skillCategories = [
  {
    label: "Backend",
    icon: "Code2",
    color: "from-[#268bd2] to-[#2aa198]",
    bg: "bg-[#268bd2]/10",
    border: "border-[#268bd2]/25",
    skills: ["Go", "C/C++", "Python", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    label: "Systems",
    icon: "Network",
    color: "from-[#2aa198] to-[#268bd2]",
    bg: "bg-[#2aa198]/10",
    border: "border-[#2aa198]/25",
    skills: ["Linux", "Distributed Systems", "Concurrency", "gRPC/RPC", "Message Queues"],
  },
  {
    label: "Networking & Security",
    icon: "Database",
    color: "from-[#268bd2] to-[#2aa198]",
    bg: "bg-[#268bd2]/10",
    border: "border-[#268bd2]/25",
    skills: ["TCP/IP", "HTTP/S", "WebSockets", "STUN/ICE", "mTLS", "PKI"],
  },
  {
    label: "Infrastructure",
    icon: "Cloud",
    color: "from-[#2aa198] to-[#268bd2]",
    bg: "bg-[#2aa198]/10",
    border: "border-[#2aa198]/25",
    skills: ["Docker", "Kubernetes", "Terraform", "AWS", "Git"],
  },
];

export const awards = [
  { title: "Vice President | Fisk Mathematics Club", icon: "Trophy" },
  { title: "Finalist | Nepal Olympiad in Informatics 2022", icon: "Medal" },
  { title: "Semifinalist | Nepal Mathematical Olympiad 2022", icon: "Star" },
];

export const stats = [
  { label: "Companies", value: "2+" },
  { label: "Projects", value: "6+" },
  { label: "Languages", value: "5" },
  { label: "GPA", value: "3.7" },
];
