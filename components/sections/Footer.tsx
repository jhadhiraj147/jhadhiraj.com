"use client";

import { ArrowUp, Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/components/ui/SoundProvider";

export default function Footer() {
  const { enabled: soundOn, toggle: toggleSound } = useSound();
  return (
    <footer>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <p className="font-body text-caption text-ink-400">© 2026 Dhiraj Jha</p>
        <p className="font-body text-caption text-ink-300">jhadhiraj.com</p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? "Mute interface sound" : "Unmute interface sound"}
            aria-pressed={soundOn}
            title={soundOn ? "Sound on" : "Sound off"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors duration-150 hover:bg-slate-900/5 hover:text-slate-900"
          >
            {soundOn ? <Volume2 size={18} strokeWidth={1.8} /> : <VolumeX size={18} strokeWidth={1.8} />}
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors duration-150 hover:bg-slate-900/5 hover:text-slate-900"
          >
            <ArrowUp size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </footer>
  );
}
