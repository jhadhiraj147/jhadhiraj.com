"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin } from "lucide-react";
import { personal } from "@/lib/data";

/* Clips a whole line up as one unit. Descenders are never cut, kerning survives. */
function LineReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const still = useReducedMotion();
  return (
    <span
      className={`block overflow-hidden ${className}`}
      style={{ paddingBottom: "0.18em", marginBottom: "-0.18em" }}
    >
      <motion.span
        className="block"
        initial={still ? { y: 0, opacity: 0 } : { y: "108%" }}
        animate={still ? { y: 0, opacity: 1 } : { y: 0 }}
        transition={{ duration: still ? 0.4 : 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const pill =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans text-sm font-semibold " +
  "backdrop-blur-md transition-colors duration-200";

export default function Hero() {
  const still = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Scrim. Only the lower half is darkened, so the sky the motto sits on stays untouched. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(8,11,16,0.72) 0%, rgba(8,11,16,0.45) 18%, rgba(8,11,16,0.10) 38%, rgba(8,11,16,0) 55%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        {/* The motto, printed on the empty sky in the upper left */}
        <h1 className="pt-[26vh] sm:pt-[24vh] lg:pt-[21vh]">
          <LineReveal
            delay={0.15}
            className="max-w-[15ch] font-display leading-[0.98] tracking-[-0.02em] text-[#0d1117] text-[clamp(2.6rem,10vw,4rem)] sm:max-w-none sm:text-[clamp(3rem,6.6vw,6.5rem)]"
          >
            <span className="font-bold">Your Ideas</span>
            <span className="font-normal"> will live</span>
            <br className="hidden sm:inline" />
            <span className="font-normal"> longer than you.</span>
          </LineReveal>
        </h1>

        {/* Identity, pinned to the bottom edge over the skyline */}
        <div className="mt-auto pb-11 sm:pb-14">
          <motion.div
            initial={still ? { opacity: 0 } : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <p className="font-display text-[clamp(1.35rem,3vw,2.1rem)] font-medium leading-tight tracking-tight text-white">
              Dhiraj{" "}
              <span className="font-normal text-white/55">(Raj)</span> Jha
            </p>

            <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-sm font-light text-white/75 sm:text-[15px]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4ba6e0]" />
              Systems Engineer
              <span className="text-white/30">/</span>
              Nashville, TN
              <span className="text-white/30">/</span>
              open to work
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <a
                href="#projects"
                className={`${pill} bg-white text-slate-900 hover:bg-white/90`}
              >
                View Projects <ArrowDown size={15} />
              </a>
              <a
                href="/assets/resume/resume_jhadhiraj147.pdf"
                download
                className={`${pill} border border-white/35 bg-white/10 text-white hover:bg-white/20`}
              >
                <Download size={15} /> Resume
              </a>
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${pill} border border-white/35 bg-white/10 text-white hover:bg-white/20`}
              >
                <Github size={15} /> GitHub
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`${pill} border border-white/35 bg-white/10 text-white hover:bg-white/20`}
              >
                <Linkedin size={15} /> LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue, kept clear of the identity block */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="pointer-events-none absolute bottom-11 right-4 z-10 hidden flex-col items-center gap-2 sm:right-6 sm:flex lg:right-8"
      >
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-white/60">
          Scroll
        </span>
        <motion.span
          animate={still ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-white/70" />
        </motion.span>
      </motion.div>
    </section>
  );
}
