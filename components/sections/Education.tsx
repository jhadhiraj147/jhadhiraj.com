"use client";

import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { education } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="relative section-pad">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <SectionHeading title="Education" />
        </AnimatedSection>

        <div className="border-b border-slate-400/25">
          {education.map((edu, idx) => (
            <AnimatedSection key={edu.school} delay={0.08 + idx * 0.08} direction="up">
              <article className="border-t border-slate-400/25 py-10 sm:py-12">
                <div className="flex gap-4 sm:gap-6">
                  {/* Logo sits with the school it belongs to, not stranded in its own column */}
                  <span className="relative h-10 w-10 flex-none overflow-hidden rounded-md bg-white ring-1 ring-slate-300/60 sm:h-12 sm:w-12">
                    <Image
                      src={edu.logoPath}
                      alt={edu.school}
                      fill
                      sizes="48px"
                      className="object-contain"
                      style={{ padding: "3px" }}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    {/* School and location left, dates right, on one baseline */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-[1.4rem] font-semibold leading-snug tracking-tight text-slate-900 sm:text-[1.7rem]">
                          {edu.school}
                        </h3>
                        <span className="font-body text-sm text-ink-400">{edu.location}</span>
                      </div>
                      <p className="font-mono text-xs tracking-wide text-accent sm:flex-none">
                        {edu.period}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-col gap-1.5">
                      {edu.degrees.map((degree, di) => (
                        <p
                          key={degree}
                          className="flex items-center gap-2 font-sans text-[15px] font-medium text-slate-700"
                        >
                          {di === 0 && edu.secondLogoPath && (
                            <span className="relative inline-block h-4 w-4 flex-shrink-0 overflow-hidden rounded-[3px] bg-white ring-1 ring-slate-300/50">
                              <Image
                                src={edu.secondLogoPath}
                                alt=""
                                fill
                                sizes="16px"
                                className="object-contain"
                                style={{ padding: "1px" }}
                              />
                            </span>
                          )}
                          {degree}
                        </p>
                      ))}
                    </div>

                    {edu.highlights.length > 0 && (
                      <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                        {edu.highlights.map((item) => (
                          <li key={`${item.label}-${item.sub}`} className="flex items-baseline gap-2.5">
                            <span
                              aria-hidden
                              className="mt-[5px] h-1 w-1 flex-shrink-0 rounded-full bg-accent-cyan"
                            />
                            <span className="text-[14px] leading-snug">
                              <span className="font-sans font-medium text-slate-800">
                                {item.label}
                              </span>
                              <span className="font-body text-ink-400"> &middot; {item.sub}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {edu.courses.length > 0 && (
                      <p className="mt-6 max-w-2xl font-body text-[13px] leading-relaxed text-ink-400">
                        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
                          Coursework
                        </span>
                        <span aria-hidden className="mx-2 text-ink-300">
                          &middot;
                        </span>
                        {edu.courses.slice(0, 8).join(", ")}
                        {edu.courses.length > 8 && (
                          <span className="text-ink-300"> &amp; {edu.courses.length - 8} more</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
