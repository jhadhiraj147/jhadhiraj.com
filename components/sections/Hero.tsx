"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Volume2 } from "lucide-react";

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

/* The name, set beneath the motto as its attribution, with how to say it. */
function NameMark() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  const say = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    void a.play().then(() => setPlaying(true)).catch(() => setAvailable(false));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.85, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mt-7 sm:mt-9"
    >
      <p className="font-mono text-[clamp(1.35rem,2.4vw,2rem)] font-medium tracking-tight text-[#0d1117]">
        Dhiraj Jha
      </p>
      <div className="mt-2 flex items-center gap-2 font-mono text-[13px] text-[#0d1117]/65">
        {available && (
          <button
            type="button"
            onClick={say}
            data-silent
            aria-label="Hear how to pronounce Dhiraj"
            title="Hear it"
            className={`-ml-1 rounded-md p-1 transition-colors duration-200 hover:bg-slate-900/5 hover:text-[#0d1117] ${
              playing ? "text-[#0d1117]" : ""
            }`}
          >
            <Volume2 size={15} strokeWidth={2} />
          </button>
        )}
        <span>dhee &middot; ruhj</span>
      </div>
      <audio
        ref={audioRef}
        preload="none"
        src="/assets/audio/dhiraj.mp3"
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onError={() => setAvailable(false)}
      />
    </motion.div>
  );
}

/* The photograph, the motto, the name. */
export default function Hero() {
  const still = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <h1 className="pt-[26vh] sm:pt-[24vh] lg:pt-[21vh]">
          <LineReveal
            delay={0.15}
            className="max-w-[15ch] font-display leading-[0.98] tracking-[-0.02em] text-[#0d1117] text-[clamp(2.6rem,10vw,4rem)] sm:max-w-none sm:text-[clamp(2.75rem,5.8vw,5.5rem)]"
          >
            <span className="font-bold">Your Ideas</span>
            <span className="font-normal"> will live</span>
            <br className="hidden sm:inline" />
            <span className="font-normal"> longer than you.</span>
          </LineReveal>
        </h1>

        <NameMark />
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase">scroll</span>
        <motion.span
          animate={still ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.span>
      </motion.a>
    </section>
  );
}
