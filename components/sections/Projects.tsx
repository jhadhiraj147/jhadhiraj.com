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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading title="More Projects" />
        </AnimatedSection>

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((proj, i) => (
            <AnimatedSection key={proj.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="flex h-full flex-col rounded-xl border border-slate-400/25 bg-page-surface/90 p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-4 flex">
                  <span className="inline-flex items-center gap-1.5 font-body text-xs text-ink-400">
                    <Calendar size={14} strokeWidth={2} /> {proj.date}
                  </span>
                </div>

                <h3 className="font-tech text-xl font-semibold tracking-tight text-slate-900">
                  {proj.title}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-400">
                  {proj.subtitle}
                </p>

                <p className="mt-4 max-w-lg flex-1 font-body text-base/7 font-light text-slate-600">
                  {proj.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex h-6 items-center rounded-full border border-slate-400/25 bg-slate-50 px-2 text-xs font-medium text-ink-500"
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
