"use client";

import { Mail } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { personal } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Let&apos;s talk.
          </h2>
          <p className="mt-4 font-body text-base font-light text-ink-500">
            Open to internships, collaboration on projects, and good conversations.
          </p>
          <a
            href={`mailto:${personal.email}`}
            className="mt-8 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-900/30 px-4 font-sans text-sm font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-900/5"
          >
            <Mail size={16} />
            {personal.email}
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
}
