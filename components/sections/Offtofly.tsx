"use client";

import { ArrowUpRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function Offtofly() {
  return (
    <section
      id="offtofly"
      className="relative section-pad overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        {/* Brand header */}
        <AnimatedSection>
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-5xl font-bold leading-none text-slate-900 sm:text-6xl"
              style={{ fontFamily: '"Times New Roman", Times, serif', letterSpacing: "0.01em" }}
            >
              offtofly
              <span className="ml-1 text-accent" style={{ letterSpacing: "-0.08em" }}>
                &rsaquo;&rsaquo;
              </span>
            </h2>
            <p className="mt-6 font-display text-xl italic text-slate-700 sm:text-2xl">
              Plan it right. <span className="gradient-text">Keep it alive.</span>
            </p>
            <a
              href="https://offtofly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-accent transition-colors hover:text-accent-cyan"
            >
              offtofly.com
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </AnimatedSection>

        {/* Narrative */}
        <div className="mx-auto mt-16 max-w-3xl space-y-6">
          <AnimatedSection delay={0.05}>
            <p className="font-body text-lg font-light leading-relaxed text-slate-600">
              We live on a planet of extraordinary things. Mountains, coasts, old cities, faces
              we have never met, meals we have never tasted. We are born into it. Most of us
              leave it having seen almost none of it. Not because we did not want to. Because
              nobody made the planning simple enough to actually follow through.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <blockquote className="border-l-2 border-[#268bd2]/40 py-1 pl-6">
              <p className="font-display text-xl italic leading-snug text-slate-900 sm:text-2xl">
                Give me a perfect maintainable itinerary and I will travel the world.
              </p>
              <p className="mt-2 font-body text-sm text-ink-400">
                Said nobody. Because nobody built it. Until now.
              </p>
            </blockquote>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <p className="font-body text-base font-light leading-relaxed text-slate-600">
              Jake spent a week near Chicago. His favorite artist played a show there that same
              week. He found out the day after it ended, scattered across 23 browser tabs with no
              single source connecting the dots. Maya had six days of spring break and a tight
              budget. A perfect combination of cheap flights and free stays existed. Nobody
              surfaced it in time.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.14}>
            <p className="font-body text-base font-light leading-relaxed text-slate-600">
              Planning a trip today means bouncing between booking sites, airline apps, maps, and
              a notes file that falls apart the moment anything changes. One rescheduled flight
              and the whole itinerary collapses. There is no tool that recovers it for you. There
              is no single place that holds your trip together.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.16}>
            <p className="font-body text-base font-light leading-relaxed text-slate-600">
              offtofly treats a trip as what it actually is: a chain of connected decisions where
              one change ripples through everything. It finds the plan that fits you. When the
              plan breaks, it fixes it. For the retiree on his first trip to Japan. For the
              student with six days and almost no money. For anyone who ever thought they could
              not afford to see more of this planet.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.18}>
            <div className="mt-10 border-t border-slate-200 pt-8">
              <p className="font-display text-xl leading-relaxed text-slate-900 sm:text-2xl">
                I believe travel should not be a luxury. This planet is everyone&apos;s home, and
                we deserve to know it better before we ultimately depart from here.
              </p>
              <p className="mt-3 font-display text-xl italic text-accent">
                Plan it right. Keep it alive.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
