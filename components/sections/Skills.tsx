"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillCategories } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="relative section-pad overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading title="Tech Stack" />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <dl className="divide-y divide-accent/15 border-y border-accent/20 font-mono text-body">
            {skillCategories.map((category) => (
              <div key={category.label} className="grid gap-2 py-4 md:grid-cols-[15rem_1fr] md:gap-6">
                <dt className="text-accent">{category.label}</dt>
                <dd className="leading-7 text-slate-700">{category.skills.join(" / ")}</dd>
              </div>
            ))}
          </dl>
        </AnimatedSection>
      </div>
    </section>
  );
}
