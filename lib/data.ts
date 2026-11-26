export const personal = {
  name: "Dhiraj Jha",
  focus: "Embedded Systems | System Engineer",
  email: "jhadhiraj147@gmail.com",
  location: "Nashville, TN",
  github: "https://github.com/jhadhiraj147",
  linkedin: "https://linkedin.com/in/jhadhiraj147",
  instagram: "https://instagram.com/jhadhiraj147",
  currentRole: "Software Developer (part-time)",
  currentEmployer: "Vanderbilt University",
  currentRolePeriod: "Aug 2026 - Present",
  expectedGraduation: "May 2028",
  bio: "I work as a Software Developer (part-time) at Vanderbilt University, developing a Vision AI system that extracts structured data from confidential images and handwritten documents. The system uses C++, OpenCV, OCR and local vision language models, with confidence validation, entirely offline. I study Computer Science and Mathematics at Fisk University. Previously, I automated engineering assessments at Google and migrated five years of biosafety compliance records during my Vanderbilt internship. My projects include a distributed filesystem, a Linux shell and a multi-speaker audio synchronization tool.",
};

export const education = [
  {
    school: "Fisk University",
    location: "Nashville, TN",
    logoPath: "/assets/fisk-logo.jpg",
    secondLogoPath: null,
    degrees: ["Computer Science (B.S.)", "Mathematics (B.A.)"],
    period: "Aug 2024 - May 2028",
    graduation: "May 2028",
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
    degrees: ["Electrical and Computer Engineering"],
    period: "Jan 2025 - May 2028",
    graduation: "May 2028",
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

/* One entry per company, roles nested inside it, LinkedIn style: a company held
   more than once is named once. A company with no roles shows its own period. */
export const experiences = [
  {
    id: "vanderbilt",
    company: "Vanderbilt University",
    logo: "vanderbilt" as const,
    location: "Nashville, Tennessee",
    period: null,
    roles: [
      {
        title: "Software Developer (part-time)",
        period: "Aug 2026 - Present",
        description:
          "Developing a Vision AI system for structured data extraction from confidential images and handwritten documents. The C++/OpenCV pipeline handles real-time document detection, image preprocessing, and OCR and handwriting recognition. Local vision language models transform the extracted content into structured data with confidence validation, entirely offline.",
      },
      {
        title: "Software Developer Intern",
        period: "May 2026 - Aug 2026",
        description:
          "Five years of biosafety compliance records were stranded in a legacy system, scattered across PDFs, scanned files and Word documents, and all of it had to reach a new platform called Onsite Systems without losing anything on the way. Almost none of it was structured. I built an ETL pipeline that runs two extractors over every document, pdfplumber and PyMuPDF, and flags the cases where the two disagree. A local LLM verifier settled the ones neither parser could resolve, which also kept sensitive records off any external network. RapidFuzz normalized the messy fields so the same lab did not arrive under three different names, and I put a single query interface in front of the result to satisfy the vendor API. Manual data entry dropped by 90 percent.",
      },
    ],
  },
  {
    id: "google",
    company: "Google",
    logo: "google" as const,
    location: "Sunnyvale, California",
    period: null,
    roles: [
      {
        title: "Software Developer Intern, SRE",
        period: "May 2025 - Aug 2025",
        description:
          "Built PRICELess, a pipeline that automates PRICE assessments, short for Production Risks in Core Engineering. A cycle took 15 days of manual work. It now takes 15 minutes. The pipeline drives the Workspace APIs to replace the manual emails and Buganizer follow ups, with a feedback loop that alerts owners to gaps in their answers and verifies again on resubmit. A gate at submit time runs an LLM grounded via RAG on SRE principles, which flags answers that are missing or irrelevant before a reviewer ever sees them. The synthesis stage merges PRICE dashboard metrics into one standardized report for SRE sign off. I also integrated LOAS authentication to secure service to service calls, user authorization and internal API triggers.",
      },
    ],
  },
  {
    id: "offtofly",
    company: "offtofly",
    logo: "offtofly" as const,
    location: "Nashville, Tennessee",
    period: null,
    roles: [
      {
        title: "Founder",
        period: "Aug 2025 - Present",
        description:
          "Travel planning often means collecting options from different tools and composing the itinerary yourself. Offtofly is designed to bring that work together. I lead a team of five engineers building it from scratch as distributed microservices in Go, Python and C++, talking over REST and gRPC. At the centre is a graph database engine we wrote ourselves, where each experience is a node and the edges carry location, timing, pace and budget. That lets a constraint solver compose itineraries around those constraints.",
        note: "I am looking for collaborators to join me on this idea.",
      },
    ],
  },
];

export const projects = [
  {
    title: "Minish",
    subtitle: "Linux Shell",
    date: "Aug 2026 - Oct 2026",
    summary: "A C++20 Linux shell with a quote-aware parser, variable expansion, pipelines, I/O redirection, and interactive job control built on POSIX process and terminal APIs.",
    description:
      "A single-threaded C++20 Linux shell using fork(), execvp() and waitpid() for process execution and exit tracking. It includes a quote-aware parser, variable expansion, I/O redirection and multi-stage IPC pipelines using POSIX pipes. Background jobs and interactive job control use process groups, SIGCHLD and tcsetpgrp() for terminal handoff.",
    tech: ["C++20", "Linux", "POSIX", "IPC", "Process Management", "Job Control"],
  },
  {
    title: "AutoGrocery",
    subtitle: "IoT Smart Fridge Platform",
    date: "Jan 2026 - Mar 2026",
    summary: "An IoT grocery-platform prototype with Go services for ordering, inventory, and pricing over gRPC, PostgreSQL and Redis storage, and ZeroMQ robot dispatch.",
    description:
      "The idea was to wire smart refrigerators into online grocery platforms. The fridge notices what is running low, places the order on its own, and a warehouse robot gets dispatched to fill it. I architected three Go microservices for ordering, inventory and pricing, talking over gRPC to keep the hop between them cheap, with PostgreSQL and Redis behind them. Robot dispatch runs on ZeroMQ pub sub so the warehouse hears about an order the moment it clears. A REST gateway sits in front for authentication, order history and billing, and that is the surface users and third parties actually touch.",
    tech: ["Go", "gRPC", "ZeroMQ", "PostgreSQL", "Redis", "C++", "REST"],
  },
  {
    title: "Bluetooth AudioSync",
    subtitle: "Multi Speaker Sync Engine",
    date: "Dec 2025 - Jan 2026",
    summary: "A C++ audio tool that synchronizes playback across Bluetooth speakers using timestamped buffers, clock-offset estimation, and latency compensation.",
    description:
      "Bluetooth A2DP gives you nothing for keeping several speakers in step. Each device runs its own clock and they drift apart almost immediately. I wrote AudioSync in C++ to fix that. It runs concurrent playback pipelines with timestamped buffering across devices, estimates the clock offset between each speaker and a reference, then compensates for latency to hold them together in real time. The result is audible synchronisation across a multi speaker setup with nothing modified in hardware.",
    tech: ["C++", "Bluetooth A2DP", "Concurrency", "Real Time Systems", "Clock Sync"],
  },
];

export const skillCategories = [
  {
    label: "Languages",
    skills: ["C++", "C", "SystemVerilog", "Python", "Go", "Bash", "AArch64 Assembly"],
  },
  {
    label: "Systems",
    skills: ["C/C++", "Go", "Linux", "POSIX APIs", "Process Management", "IPC", "Multithreading", "Synchronization", "FUSE", "Concurrency", "Distributed Systems", "Message Queues"],
  },
  {
    label: "Embedded & Architecture",
    skills: ["ARM64", "Raspberry Pi 4", "Bare-Metal Development", "GPIO", "UART", "Memory-Mapped I/O"],
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
    skills: ["Docker", "Kubernetes", "AWS IoT", "Git", "GCC", "Clang", "GDB", "CMake", "QEMU"],
  },
];


