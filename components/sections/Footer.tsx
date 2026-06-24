"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-[#f6f8fb]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-8 sm:px-10">
        <p className="font-body text-xs text-slate-400">© 2026 Dhiraj Jha</p>
        <p className="font-body text-xs text-slate-300">jhadhiraj.com</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="text-slate-400 transition-colors duration-200 hover:text-[#268bd2]"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
}
