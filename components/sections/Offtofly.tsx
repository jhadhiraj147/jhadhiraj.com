"use client";

import { ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const covers = [
  "where you want to go, and how you like to move",
  "what you can actually spend",
  "what has to be covered if the plan breaks",
];

export default function Offtofly() {
  return (
    <section id="offtofly" className="relative section-pad overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="max-w-3xl">
            <p aria-hidden="true" className="mb-3 font-mono text-caption text-accent">
              <span className="mr-2 text-ink-400">$</span> open ~/offtofly
            </p>
            <h2
              className="text-[2.25rem] font-bold text-slate-900 sm:text-[2.75rem]"
              style={{ fontFamily: '"Times New Roman", Times, serif', letterSpacing: "0.01em" }}
            >
              offtofly
              <span className="ml-[0.1em] text-accent" style={{ letterSpacing: "-0.08em" }}>
                &rsaquo;&rsaquo;
              </span>
            </h2>
            <p className="mt-6 font-body text-lead italic text-slate-700">
              Plan it right. <span className="text-gold">Keep it alive.</span>
            </p>
            <a
              href="https://offtofly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-accent/35 bg-page-surface/60 px-4 font-mono text-body text-accent transition-colors duration-150 hover:border-accent hover:bg-accent/10"
            >
              offtofly.com
              <ExternalLink size={16} strokeWidth={1.8} />
            </a>
          </div>
        </AnimatedSection>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-x-16">
          <AnimatedSection delay={0.05}>
            <p className="font-body text-body font-light text-slate-600">
              Travelling is not the hard part anymore. Planning it is, and paying for it is.
              Safety and insurance are a bigger problem than either, and almost nobody deals
              with them until something has already gone wrong.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="font-body text-body font-light text-slate-600">
              offtofly takes all of it on, and builds every plan around you:
            </p>
            <ul className="mt-4 space-y-2">
              {covers.map((c) => (
                <li key={c} className="flex items-baseline gap-3 font-body text-body font-light text-slate-600">
                  <span aria-hidden className="h-1 w-1 flex-none -translate-y-[0.125em] rounded-full bg-accent" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-body text-body font-light text-slate-600">
              When something changes, the plan changes with it.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="border-l border-accent/30 pl-6">
              <p className="font-body text-lead text-slate-900">
                I believe travel should not be a luxury. This planet is everyone&apos;s home, and
                we deserve to know it better before we ultimately depart from here.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
