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
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <SectionHeading title="Who Am I?" subtitle={undefined} />
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-14 items-start">

          {/* Left - narrative */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatedSection delay={0.1}>
              <p className="font-body font-light text-base sm:text-lg text-slate-600 leading-relaxed">
                Deep down I am just a{" "}
                <span className="font-semibold text-slate-800">math guy</span>, and the why and
                how is most of what drives me. That is why I avoid frameworks and go looking for
                what sits underneath them.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.18}>
              <p className="font-body font-light text-base sm:text-lg text-slate-600 leading-relaxed">
                Systems engineering started for me on the{" "}
                <span className="font-semibold text-accent">SRE team at Google</span>. Working
                next to real infrastructure made me want to understand every part of it, and then{" "}
                <span className="font-semibold text-slate-800">every bit of the machine</span>{" "}
                underneath. I have not stopped since.
              </p>
            </AnimatedSection>
          </div>

          {/* Right - disciplines + current + next */}
          <div className="lg:col-span-5 space-y-10 lg:pt-1">
            <AnimatedSection delay={0.15} direction="right">
              <div>
                <p className="eyebrow text-accent mb-5">Disciplines</p>
                <ul className="space-y-3">
                  {disciplines.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-3 font-body font-light text-sm text-slate-600"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#268bd2] flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.25} direction="right">
              <div className="space-y-5 pl-4 border-l border-[#268bd2]/20">
                <div>
                  <p className="eyebrow text-accent mb-1.5">Currently</p>
                  <p className="font-body font-light text-sm text-slate-600">
                    Building{" "}
                    <span className="font-semibold text-slate-800">offtofly</span>
                    , a constraint solver for travel planning
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
