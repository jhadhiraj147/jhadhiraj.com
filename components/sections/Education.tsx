"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { education } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="relative section-pad bg-white">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Academic Background"
            title="Education"
            subtitle="A rigorous foundation in computer science, mathematics, and engineering."
          />
        </AnimatedSection>

        {/* Tech-specs rows - each school a flat row, hairline top borders, no rail, no dots, no cards */}
        <div className="border-b border-slate-200/70">
          {education.map((edu, idx) => (
            <AnimatedSection
              key={edu.school}
              delay={0.08 + idx * 0.08}
              direction="up"
            >
              <article className="grid grid-cols-1 gap-x-10 gap-y-6 border-t border-slate-200/70 py-12 sm:grid-cols-[168px_1fr] sm:py-14">
                {/* Left column - period + tiny logo */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-4">
                  <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-md sm:h-11 sm:w-11">
                    <Image
                      src={edu.logoPath}
                      alt={edu.school}
                      fill
                      sizes="44px"
                      className="object-contain"
                    />
                  </span>
                  <p className="font-mono text-xs tracking-wide text-[#268bd2]">
                    {edu.period}
                  </p>
                </div>

                {/* Right column - school, degrees, highlights, courses */}
                <div className="min-w-0">
                  {/* School + location */}
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-[1.7rem]">
                      {edu.school}
                    </h3>
                    <span className="font-body text-sm text-slate-400">
                      {edu.location}
                    </span>
                  </div>

                  {/* Degrees - quiet lines; second logo rendered inline by the first degree */}
                  <div className="mt-3 flex flex-col gap-1.5">
                    {edu.degrees.map((degree, di) => (
                      <p
                        key={degree}
                        className="flex items-center gap-2 font-sans text-[15px] font-medium text-slate-700"
                      >
                        {di === 0 && edu.secondLogoPath && (
                          <span className="relative inline-block h-4 w-4 flex-shrink-0">
                            <Image
                              src={edu.secondLogoPath}
                              alt=""
                              fill
                              sizes="16px"
                              className="object-contain"
                            />
                          </span>
                        )}
                        {degree}
                      </p>
                    ))}
                  </div>

                  {/* Award - rendered only when present */}
                  {edu.award && (
                    <p className="mt-3 font-sans text-[13px] font-medium text-[#268bd2]">
                      {edu.award}
                    </p>
                  )}

                  {/* Highlights - minimal label / sub pairs, small text, no bordered boxes */}
                  {edu.highlights.length > 0 && (
                    <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                      {edu.highlights.map((item) => (
                        <li
                          key={`${item.label}-${item.sub}`}
                          className="flex items-baseline gap-2.5"
                        >
                          <span
                            aria-hidden
                            className="mt-[5px] h-1 w-1 flex-shrink-0 rounded-full bg-[#2aa198]"
                          />
                          <span className="text-[14px] leading-snug">
                            <span className="font-sans font-medium text-slate-800">
                              {item.label}
                            </span>
                            <span className="font-body text-slate-400">
                              {" "}
                              &middot; {item.sub}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Coursework - restrained, muted comma line; truncated for calm */}
                  {edu.courses.length > 0 && (
                    <p className="mt-6 max-w-2xl font-body text-[13px] leading-relaxed text-slate-400">
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                        Coursework
                      </span>
                      <span aria-hidden className="mx-2 text-slate-300">
                        &middot;
                      </span>
                      {edu.courses.slice(0, 8).join(", ")}
                      {edu.courses.length > 8 && (
                        <span className="text-slate-300">
                          {" "}
                          &amp; {edu.courses.length - 8} more
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        {/* Subtle closing accent - keeps the section feeling intentional, not abrupt */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-10 h-px w-16 origin-left bg-gradient-to-r from-[#268bd2] to-[#2aa198]"
        />
      </div>
    </section>
  );
}