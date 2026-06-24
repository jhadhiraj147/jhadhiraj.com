"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import { personal } from "@/lib/data";

/* Line-level reveal - clips the whole line up as one unit, no char splitting.
   Descenders (J, g, y...) are never cut off. Full kerning is preserved. */
function LineReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span
      className={`block overflow-hidden ${className}`}
      style={{ paddingBottom: "0.18em", marginBottom: "-0.18em" }}
    >
      <motion.span
        className="block"
        initial={{ y: "108%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Pure white background */}
      <div className="absolute inset-0 bg-white" />


      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left - text */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">

            {/* Name */}
            <h1 className="mb-6">
              <LineReveal
                delay={0.2}
                className="font-display font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(54px,11vw,108px)] text-slate-900"
              >
                Dhiraj
                <span className="align-baseline ml-3 text-[0.3em] font-normal tracking-normal text-slate-400">
                  (Raj)
                </span>
              </LineReveal>
              <LineReveal
                delay={0.36}
                className="font-display font-medium leading-[0.95] tracking-[-0.02em] text-[clamp(54px,11vw,108px)] text-slate-400"
              >
                Jha
              </LineReveal>
            </h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-2 font-body font-light text-base sm:text-lg text-[#586e75] mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#268bd2] flex-shrink-0" />
              Systems Engineer &nbsp;·&nbsp; Nashville, TN &nbsp;·&nbsp; open to work
            </motion.p>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45 }}
              className="font-body font-light text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10"
            >
              {personal.bio}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-2.5 justify-center lg:justify-start"
            >
              {/* Primary: View Projects */}
              <a
                href="#projects"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full
 bg-[#268bd2]/90 text-white
 shadow-[0_2px_16px_rgba(38,139,210,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]
 hover:bg-[#268bd2] hover:shadow-[0_4px_24px_rgba(38,139,210,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]
 transition-all duration-200"
              >
                View Projects <ArrowDown size={15} />
              </a>

              {/* Glass pill: Resume */}
              <a
                href="/assets/resume/resume_jhadhiraj147.pdf"
                download
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full
 bg-white/30 backdrop-blur-md
 border border-white/60 
 shadow-[0_2px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)] 
 text-slate-700 
 hover:bg-white/50 
 transition-all duration-200"
              >
                <Download size={15} /> Resume
              </a>

              {/* Glass pill: GitHub */}
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full
 bg-white/30 backdrop-blur-md
 border border-white/60 
 shadow-[0_2px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)] 
 text-slate-700 
 hover:bg-white/50 
 transition-all duration-200"
              >
                <Github size={15} /> GitHub
              </a>

              {/* Glass pill: LinkedIn */}
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full
 bg-white/30 backdrop-blur-md
 border border-white/60 
 shadow-[0_2px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)] 
 text-slate-700 
 hover:bg-white/50 
 transition-all duration-200"
              >
                <Linkedin size={15} /> LinkedIn
              </a>

            </motion.div>
          </div>

          {/* Right - profile photo */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative flex-shrink-0 order-1 lg:order-2 flex items-end justify-center"
          >
            {/* Radial mask fades image edges into white bg - no blend mode,
                works reliably on mobile Safari where mix-blend-mode breaks
                inside transformed ancestors. */}
            <div
              className="relative w-80 h-[440px] sm:w-96 sm:h-[520px] lg:w-[500px] lg:h-[680px] bg-white"
              style={{
                WebkitMaskImage: "radial-gradient(ellipse 78% 92% at 50% 52%, black 48%, transparent 100%)",
                maskImage: "radial-gradient(ellipse 78% 92% at 50% 52%, black 48%, transparent 100%)",
              }}
            >
              {!imgError ? (
                <Image
                  src="/assets/pp.PNG"
                  alt="Dhiraj Jha"
                  fill
                  priority
                  className="object-contain object-bottom"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className="text-8xl font-display font-bold text-slate-900 select-none">DJ</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-col items-center gap-2 mt-14"
        >
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-400">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={18} className="text-brand-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
