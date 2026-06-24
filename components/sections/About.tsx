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
      className="relative section-pad bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <SectionHeading
            eyebrow="About"
            title="Who Am I?"
            subtitle={undefined}
          />
        </AnimatedSection>

        <div className="grid lg:grid-cols-12 gap-14 items-start">

          {/* Left - narrative */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatedSection delay={0.1}>
              <p className="font-body font-light text-base sm:text-lg text-slate-600 leading-relaxed">
                I am interested in the parts of computing where software has to work with real
                constraints: hardware behavior, network boundaries, latency, reliability, and
                failure. That interest became more concrete after interning on an SRE team at
                Google, where I got closer to the infrastructure side of software and saw how
                much engineering goes into keeping systems dependable.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.18}>
              <p className="font-body font-light text-base sm:text-lg text-slate-600 leading-relaxed">
                Since then, I have been building more distributed systems projects, mostly in{" "}
                <span className="font-semibold text-[#268bd2]">Go</span> and{" "}
                <span className="font-semibold text-[#268bd2]">C++</span>. Those are the
                languages I am most comfortable with, and I have used them for over a year
                across production and project work. I also spend a lot of time with computer
                networking and lower-level systems, including a backend that connects
                smart refrigerators to online grocery platforms.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.26}>
              <p className="font-body font-light text-base sm:text-lg text-slate-600 leading-relaxed">
                As of now, I am more focused on building a strong grasp of fundamentals, trying
                not to reach for frameworks while developing backend systems. As most systems
                engineers, I mostly avoid abstractions and delve deep into structures and systems.
              </p>
            </AnimatedSection>
          </div>

          {/* Right - disciplines + current + next */}
          <div className="lg:col-span-5 space-y-10 lg:pt-1">
            <AnimatedSection delay={0.15} direction="right">
              <div>
                <p className="eyebrow text-[#268bd2] mb-5">Disciplines</p>
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
                  <p className="eyebrow text-[#268bd2] mb-1.5">Currently</p>
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
