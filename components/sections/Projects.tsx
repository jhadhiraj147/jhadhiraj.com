"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative section-pad overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <SectionHeading title="More Projects" />
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((proj, i) => (
            <AnimatedSection key={proj.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-page-surface/90 p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-5 flex items-baseline justify-between">
                  <span className="font-display text-sm text-ink-300">
                    0{i + 1}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-body text-xs text-ink-400">
                    <Calendar size={12} /> {proj.date}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900">
                  {proj.title}
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  {proj.subtitle}
                </p>

                <p className="mt-5 flex-1 font-body text-[14px] font-light leading-relaxed text-slate-600">
                  {proj.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-ink-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
