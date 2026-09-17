"use client";

import { Mail } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { personal } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="relative section-pad">
      <AnimatedSection className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="font-tech text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Let&apos;s talk.
          </h2>
          <p className="mt-6 font-body text-base/7 font-light text-ink-500">
            Open to internships, collaboration on projects, and good conversations.
          </p>
          <a
            href={`mailto:${personal.email}`}
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900/30 px-4 font-sans text-sm font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-900/5"
          >
            <Mail size={16} />
            {personal.email}
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
}
