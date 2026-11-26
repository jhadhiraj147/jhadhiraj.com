"use client";

import { useEffect, useState } from "react";
import { TERMINAL_HOSTNAME, TERMINAL_USERNAME } from "@/lib/portfolio-terminal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav aria-label="Main navigation" className={`fixed inset-x-0 top-0 z-50 border-b border-accent/20 font-mono text-sm ${scrolled ? "bg-page/95" : "bg-page/80"}`}>
      <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-1 px-4 py-2 sm:px-6 lg:px-8">
        <a href="#hero" aria-label="Dhiraj Jha, home" className="flex min-h-9 items-center gap-3 text-accent"><span>{TERMINAL_USERNAME}@{TERMINAL_HOSTNAME}:~</span><span className="text-ink-400">tty1</span></a>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-400 sm:gap-x-4">
          {["about", "projects", "beats", "contact"].map(section => <a key={section} href={`#${section}`} className="inline-flex min-h-9 items-center hover:text-accent">{section === "projects" ? <><span className="sm:hidden">[code]</span><span className="hidden sm:inline">[projects]</span></> : `[${section}]`}</a>)}
          <a href="/assets/resume/resume_jhadhiraj147.pdf" download className="hidden min-h-9 items-center text-accent hover:underline sm:inline-flex">[resume]</a>
        </div>
      </div>
    </nav>
  );
}
