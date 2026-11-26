"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/components/ui/SoundProvider";

export default function Footer() {
  const { enabled: soundOn, toggle: toggleSound } = useSound();
  return (
    <footer className="border-t border-accent/20 bg-page/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-caption text-ink-400">© 2026 Dhiraj Jha</p>
        <p className="hidden font-mono text-caption text-ink-400 sm:block">jhadhiraj.com</p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? "Mute interface sound" : "Unmute interface sound"}
            aria-pressed={soundOn}
            title={soundOn ? "Sound on" : "Sound off"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink-400 transition-colors duration-150 hover:bg-accent/10 hover:text-accent"
          >
            {soundOn ? <Volume2 size={18} strokeWidth={1.8} /> : <VolumeX size={18} strokeWidth={1.8} />}
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
            aria-label="Back to top"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm font-mono text-caption text-ink-400 transition-colors duration-150 hover:bg-accent/10 hover:text-accent"
          >
            top
          </button>
        </div>
      </div>
    </footer>
  );
}
