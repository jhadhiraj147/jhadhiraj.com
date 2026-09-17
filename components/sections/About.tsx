"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

const disciplines = [
  "Distributed Systems",
  "Network Engineering",
  "Infrastructure & SRE",
  "Backend Architecture",
  "Systems Automation",
  "Linux Internals",
];

export default function About() {
  return (
    <section
      id="about"
      className="relative section-pad overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading title="Who Am I?" subtitle={undefined} />
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left - narrative */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatedSection delay={0.1}>
              <p className="font-body text-lg text-slate-900 sm:text-xl">Namaste,</p>
              <p className="mt-4 max-w-xl font-body font-light text-base/7 sm:text-lg/8 text-slate-600">
                I am Dhiraj, a system software engineer based in Nashville. But... deep down, I am
                just a <span className="font-semibold text-gold">math guy</span>. The why and
                how is most of what drives me, which is why I avoid frameworks and go looking for
                what sits underneath them.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.18}>
              <p className="max-w-xl font-body font-light text-base/7 sm:text-lg/8 text-slate-600">
                Systems engineering started for me on the{" "}
                <span className="font-semibold text-accent">SRE team at Google</span>. Working
                next to real infrastructure made me want to understand every part of it, and then{" "}
                <span className="font-semibold text-gold">every bit of the machine</span>{" "}
                underneath. I have not stopped since.
              </p>
            </AnimatedSection>
          </div>

          {/* Right - disciplines + current + next */}
          <div className="lg:col-span-5 lg:pt-1">
            <AnimatedSection delay={0.15} direction="right">
              <div>
                <ul className="space-y-3">
                  {disciplines.map((d) => (
                    <li
                      key={d}
                      className="flex items-baseline gap-3 font-body font-light text-sm text-slate-600"
                    >
                      <span className="h-1 w-1 flex-none -translate-y-[0.125em] rounded-full bg-accent" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
