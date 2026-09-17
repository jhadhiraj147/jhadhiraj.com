"use client";

import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { education } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="relative section-pad">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading title="Education" />
        </AnimatedSection>

        <div className="border-b border-slate-400/25">
          {education.map((edu, idx) => (
            <AnimatedSection key={edu.school} delay={0.08 + idx * 0.08} direction="up">
              <article className="border-t border-slate-400/25 py-8">
                <div className="flex gap-6">
                  {/* Logo sits with the school it belongs to, not stranded in its own column */}
                  <span className="relative h-12 w-12 flex-none overflow-hidden rounded-xl border border-slate-400/25 bg-white bg-clip-padding">
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
                        <h3 className="font-tech text-title font-semibold tracking-tight text-slate-900">
                          {edu.school}
                        </h3>
                        <span className="font-body text-caption text-ink-400">{edu.location}</span>
                      </div>
                      <p className="font-body text-caption text-accent sm:flex-none">
                        {edu.period}
                      </p>
                    </div>

                    <div className="mt-1 flex flex-col gap-2">
                      {edu.degrees.map((degree, di) => (
                        <p
                          key={degree}
                          className="flex items-center gap-2 font-sans text-lead font-medium text-slate-700"
                        >
                          {di === 0 && edu.secondLogoPath && (
                            <span className="relative h-4 w-4 flex-none overflow-hidden rounded border border-slate-400/25 bg-white bg-clip-padding">
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
                      <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                        {edu.highlights.map((item) => (
                          <li key={`${item.label}-${item.sub}`} className="flex items-baseline gap-3">
                            <span
                              aria-hidden
                              className="h-1 w-1 flex-none -translate-y-[0.125em] rounded-full bg-accent"
                            />
                            <span className="text-caption">
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
                      <p className="mt-6 max-w-md font-body text-caption text-ink-400">
                        <span className="font-sans text-caption font-medium uppercase tracking-widest text-ink-400">
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
