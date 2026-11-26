"use client";

import { Mail } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { personal } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="relative section-pad">
      <AnimatedSection className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-sm border border-accent/25 bg-page-surface/85 p-6 sm:p-10">
          <SectionHeading title="Let’s talk." />
          <p className="max-w-xl font-body text-body text-ink-500">
            Open to internships, collaboration on projects, and good conversations.
          </p>
          <a
            href={`mailto:${personal.email}`}
            className="mt-6 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-sm border border-accent/35 px-3 font-mono text-caption text-accent transition-colors duration-150 hover:border-accent hover:bg-accent/10 sm:px-4 sm:text-body"
          >
            <Mail size={16} />
            {personal.email}
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
}
