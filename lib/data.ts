export const personal = {
  name: "Dhiraj Jha",
  email: "jhadhiraj147@gmail.com",
  location: "Nashville, TN",
  github: "https://github.com/jhadhiraj147",
  linkedin: "https://linkedin.com/in/jhadhiraj147",
  instagram: "https://instagram.com/jhadhiraj147",
  bio: "I am an engineering student who works on systems software, backend infrastructure and automation. I automated engineering assessments at Google, moved five years of stranded records onto a new platform at Vanderbilt, and I am now building a vision system there that reads confidential documents offline. On my own time I build distributed systems in Go, C++ and Python. What holds my attention is software with real constraints behind it: correctness, reliability, latency, recovery after failure, and code someone else can still maintain a year later.",
};

export const education = [
  {
    school: "Fisk University",
    location: "Nashville, TN",
    logoPath: "/assets/fisk-logo.jpg",
    secondLogoPath: null,
    degrees: ["Computer Science (B.S.)", "Mathematics (B.A.)"],
    period: "Aug 2024 - May 2028",
    highlights: [
      { label: "Presidential Scholar", sub: "GPA 3.7 / 4.0" },
      { label: "Vice President", sub: "Fisk Mathematics Club" },
    ],
    courses: [
      "Software Design",
      "Algorithms",
      "Operating Systems",
      "Computer Networks",
      "Machine Learning",
      "Theory of Computation",
      "Object Oriented Programming",
      "Real Analysis",
      "Linear Algebra",
      "Discrete Mathematics",
      "Ordinary Differential Equations",
      "Algebraic Structures",
      "Quantum Computation",
    ],
  },
  {
    school: "Vanderbilt University",
    location: "Nashville, TN",
    logoPath: "/assets/vanderbilt-logo.png",
    secondLogoPath: null,
    degrees: ["Computer Engineering (Coursework)"],
    period: "Jan 2025 - Present",
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
    id: "vanderbilt-swe",
    company: "Vanderbilt University",
    logo: "vanderbilt" as const,
    role: "Software Developer, Part Time",
    period: "Aug 2026 - Present",
    location: "Nashville, Tennessee",
    logoBg: "bg-white",
    description:
      "Building a vision system that extracts structured data from sensitive images and handwritten documents. The pipeline runs in C++ with OpenCV for document detection, image preprocessing, and OCR and handwriting recognition. Local vision language models convert the output into structured records, with confidence validation on every field. It runs entirely offline, so the data never leaves the machine.",
  },
  {
    id: "vanderbilt-intern",
    company: "Vanderbilt University",
    logo: "vanderbilt" as const,
    role: "Software Developer Intern",
    period: "May 2026 - Aug 2026",
    location: "Nashville, Tennessee",
    logoBg: "bg-white",
    description:
      "Five years of biosafety compliance records were stranded in a legacy system, scattered across PDFs, scanned files and Word documents, and all of it had to reach a new platform called Onsite Systems without losing anything on the way. Almost none of it was structured. I built an ETL pipeline that runs two extractors over every document, pdfplumber and PyMuPDF, and flags the cases where the two disagree. A local LLM verifier settled the ones neither parser could resolve, which also kept sensitive records off any external network. RapidFuzz normalized the messy fields so the same lab did not arrive under three different names, and I put a single query interface in front of the result to satisfy the vendor API. Manual data entry dropped by 90 percent.",
  },
  {
    id: "offtofly",
    company: "offtofly",
    logo: "offtofly" as const,
    role: "Founder & Lead Engineer",
    period: "Aug 2025 - Present",
    location: "Nashville, Tennessee",
    logoBg: "bg-gradient-to-br from-[#268bd2] to-[#2aa198]",
    description:
      "No travel tool will hand you a finished itinerary. They surface options and leave the actual planning to you. Offtofly exists to close that gap. I lead a team of five engineers building it from scratch as distributed microservices in Go, Python and C++, talking over REST and gRPC. At the centre is a graph database engine we wrote ourselves, where each experience is a node and the edges carry location, timing, pace and budget. That lets a constraint solver compose itineraries that actually hold together, instead of handing the planning to a language model and hoping.",
  },
  {
    id: "google",
    company: "Google",
    logo: "google" as const,
    role: "Software Developer Intern, SRE",
    period: "May 2025 - Aug 2025",
    location: "Sunnyvale, California",
    logoBg: "bg-white",
    description:
      "Built PRICELess, a pipeline that automates PRICE assessments, short for Production Risks in Core Engineering. A cycle took 15 days of manual work. It now takes 15 minutes. The pipeline drives the Workspace APIs to replace the manual emails and Buganizer follow ups, with a feedback loop that alerts owners to gaps in their answers and verifies again on resubmit. A gate at submit time runs an LLM grounded via RAG on SRE principles, which flags answers that are missing or irrelevant before a reviewer ever sees them. The synthesis stage merges PRICE dashboard metrics into one standardized report for SRE sign off. I also integrated LOAS authentication to secure service to service calls, user authorization and internal API triggers.",
  },
];

export const projects = [
  {
    title: "AutoGrocery",
    subtitle: "IoT Smart Fridge Platform",
    date: "Jan 2026 - Mar 2026",
    description:
      "The idea was to wire smart refrigerators into online grocery platforms. The fridge notices what is running low, places the order on its own, and a warehouse robot gets dispatched to fill it. I architected three Go microservices for ordering, inventory and pricing, talking over gRPC to keep the hop between them cheap, with PostgreSQL and Redis behind them. Robot dispatch runs on ZeroMQ pub sub so the warehouse hears about an order the moment it clears. A REST gateway sits in front for authentication, order history and billing, and that is the surface users and third parties actually touch.",
    tech: ["Go", "gRPC", "ZeroMQ", "PostgreSQL", "Redis", "C++", "REST"],
  },
  {
    title: "Bluetooth AudioSync",
    subtitle: "Multi Speaker Sync Engine",
    date: "Dec 2025 - Jan 2026",
    description:
      "Bluetooth A2DP gives you nothing for keeping several speakers in step. Each device runs its own clock and they drift apart almost immediately. I wrote AudioSync in C++ to fix that. It runs concurrent playback pipelines with timestamped buffering across devices, estimates the clock offset between each speaker and a reference, then compensates for latency to hold them together in real time. The result is audible synchronisation across a multi speaker setup with nothing modified in hardware.",
    tech: ["C++", "Bluetooth A2DP", "Concurrency", "Real Time Systems", "Clock Sync"],
  },
];

export const skillCategories = [
  {
    label: "Systems",
    skills: ["C/C++", "Go", "Linux", "FUSE", "Concurrency", "Distributed Systems", "Message Queues"],
  },
  {
    label: "Networking",
    icon: "Database",
    bg: "bg-[#268bd2]/10",
    border: "border-[#268bd2]/25",
    skills: ["TCP/IP", "HTTP", "gRPC", "WebSockets", "STUN/ICE", "mTLS", "PKI"],
  },
  {
    label: "Backend",
    icon: "Code2",
    bg: "bg-[#268bd2]/10",
    border: "border-[#268bd2]/25",
    skills: ["Python", "Django", "SQL", "ORM", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    label: "Infrastructure & Tools",
    skills: ["Docker", "Kubernetes", "AWS IoT", "Git"],
  },
];


