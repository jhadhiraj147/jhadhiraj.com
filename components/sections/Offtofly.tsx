"use client";

import { ArrowUpRight } from "lucide-react";
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
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-display-sm font-bold text-slate-900 sm:text-display-md lg:text-display-lg"
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
              className="group mt-6 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-900/30 px-4 font-sans text-body font-medium text-slate-900 transition-colors duration-150 hover:bg-slate-900/5"
            >
              offtofly.com
              <ArrowUpRight
                size={16} strokeWidth={2}
                className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </AnimatedSection>

        <div className="mx-auto mt-16 max-w-xl space-y-8">
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
            <div className="pt-8">
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
