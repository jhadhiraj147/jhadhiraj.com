"use client";

import { MapPin } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { GoogleLogo, VanderbiltLogo } from "@/components/ui/CompanyLogo";
import { experiences } from "@/lib/data";

type LogoKey = "google" | "vanderbilt" | "offtofly";

const logoMap: Record<LogoKey, React.ReactNode> = {
  google: <GoogleLogo size={32} />,
  vanderbilt: <VanderbiltLogo size={40} />,
  offtofly: (
    <span
      aria-label="offtofly"
      className="text-title font-bold text-accent"
      style={{ fontFamily: '"Times New Roman", Times, serif', letterSpacing: "-0.08em" }}
    >
      &rsaquo;&rsaquo;
    </span>
  ),
};

function OfftoflyWordmark() {
  return (
    <h3
      className="text-title font-bold text-slate-900"
      style={{ fontFamily: '"Times New Roman", Times, serif', letterSpacing: "0.01em" }}
    >
      offtofly
      <span className="ml-[0.1em] text-accent" style={{ letterSpacing: "-0.08em" }}>
        &rsaquo;&rsaquo;
      </span>
    </h3>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="relative section-pad overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading title="Experience" />
        </AnimatedSection>

        <div className="space-y-16">
          {experiences.map((co, i) => (
            <AnimatedSection key={co.id} delay={i * 0.08}>
              <article className="flex gap-6">
                <div className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-xl border border-slate-400/25 bg-white bg-clip-padding">
                  {logoMap[co.logo]}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Company, once, with where it is and, if it has no roles, when */}
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    {co.id === "offtofly" ? (
                      <OfftoflyWordmark />
                    ) : (
                      <h3 className="font-tech text-title font-semibold tracking-tight text-slate-900">
                        {co.company}
                      </h3>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-caption text-ink-500 sm:justify-end">
                      {co.period && <span className="whitespace-nowrap">{co.period}</span>}
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <MapPin size={14} strokeWidth={2} /> {co.location}
                      </span>
                    </div>
                  </div>

                  {/* Roles held there, newest first, the company name not repeated */}
                  {co.roles.length > 0 && (
                    <div className="mt-6 space-y-8">
                      {co.roles.map((r) => (
                        <div key={r.title}>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                            <p className="font-tech text-lead font-medium text-accent">{r.title}</p>
                            <p className="whitespace-nowrap font-mono text-caption text-ink-500">{r.period}</p>
                          </div>
                          <p className="mt-3 max-w-2xl font-body text-body font-light text-slate-600">
                            {r.description}
                          </p>
                          {"note" in r && r.note && (
                            <p className="mt-3 max-w-2xl font-body text-body font-medium text-gold">{r.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
