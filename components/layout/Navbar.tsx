"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Download, Github, Instagram, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import { personal } from "@/lib/data";

/* Avatar on the left. GitHub, LinkedIn, Resume on the right. Nothing else. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Every control sits on a 32px module: 32x32 icon squares, a 32px tall Resume,
     a 32px avatar. Same ink, same radius, same hover, so the row reads as one family. */
  const control = `inline-flex h-8 items-center justify-center rounded-lg transition-colors duration-150 ${
    scrolled
      ? "text-ink-500 hover:bg-slate-900/5 hover:text-slate-900"
      : "text-slate-800 hover:bg-slate-900/5 hover:text-slate-900"
  }`;
  const iconBtn = `${control} w-8`;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-page-surface/95 border-b border-slate-400/25"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <motion.a href="#" className="flex h-8 w-8 items-center justify-center rounded-full" aria-label="Top">
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-slate-400/25 flex-shrink-0">
            <Image
              src="/assets/avatar.jpg"
              alt="Dhiraj Jha"
              fill
              sizes="32px"
              style={{ objectFit: "cover", objectPosition: "center top" }}
              priority
            />
          </div>
        </motion.a>

        <div className="flex items-center gap-1.5">
          <a href={personal.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub" className={iconBtn}>
            <Github size={18} strokeWidth={1.8} />
          </a>
          <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" className={iconBtn}>
            <Linkedin size={18} strokeWidth={1.8} />
          </a>
          <a href={personal.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className={iconBtn}>
            <Instagram size={18} strokeWidth={1.8} />
          </a>
          <a href={`mailto:${personal.email}`} aria-label="Email" title={personal.email} className={iconBtn}>
            <Mail size={18} strokeWidth={1.8} />
          </a>
          <a
            href="/assets/resume/resume_jhadhiraj147.pdf"
            download
            className={`${control} gap-1.5 border px-3 text-[13px] font-medium ${
              scrolled ? "border-slate-400/40" : "border-slate-900/30"
            }`}
          >
            <Download size={14} strokeWidth={2} /> Resume
          </a>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3f5b7b] to-[#396056] origin-left"
        style={{ scaleX: progressScaleX }}
      />
    </motion.nav>
  );
}
