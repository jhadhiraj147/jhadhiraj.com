"use client";

import { ArrowUp, Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/components/ui/SoundProvider";

export default function Footer() {
  const { enabled: soundOn, toggle: toggleSound } = useSound();
  return (
    <footer>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-8 sm:px-10">
        <p className="font-body text-xs text-ink-400">© 2026 Dhiraj Jha</p>
        <p className="font-body text-xs text-ink-300">jhadhiraj.com</p>
        <button
          onClick={toggleSound}
          aria-label={soundOn ? "Mute interface sound" : "Unmute interface sound"}
          aria-pressed={soundOn}
          title={soundOn ? "Sound on" : "Sound off"}
          className="text-ink-400 transition-colors duration-200 hover:text-accent"
        >
          {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="text-ink-400 transition-colors duration-200 hover:text-accent"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
}
