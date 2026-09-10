"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { GoogleLogo, VanderbiltLogo, OfftoflyLogo } from "@/components/ui/CompanyLogo";
import { experiences } from "@/lib/data";

type LogoKey = "google" | "vanderbilt" | "offtofly";

const logoMap: Record<LogoKey, React.ReactNode> = {
  google: <GoogleLogo size={26} />,
  vanderbilt: <VanderbiltLogo size={44} />,
  offtofly: <OfftoflyLogo size={44} />,
};

export default function Experience() {
  return (
    <section id="experience" className="relative section-pad overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <SectionHeading title="Experience" />
        </AnimatedSection>

        <div>
          <div className="space-y-16">
            {experiences.map((exp, i) => (
              <AnimatedSection key={exp.id} delay={i * 0.1}>
                <div className="relative flex gap-6 sm:gap-8">
                  {/* Logo node sitting on the rail */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.1 }}
                    className={`flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-2xl ring-1 ring-slate-200/70 shadow-sm ${exp.logoBg}`}
                  >
                    {logoMap[exp.logo]}
                  </motion.div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          {exp.id === "offtofly" ? (
                            <h3
                              className="text-xl font-bold leading-none text-slate-900 sm:text-2xl"
                              style={{ fontFamily: '"Times New Roman", Times, serif', letterSpacing: "0.01em" }}
                            >
                              offtofly
                              <span className="ml-0.5 text-accent" style={{ letterSpacing: "-0.08em" }}>
                                &rsaquo;&rsaquo;
                              </span>
                            </h3>
                          ) : (
                            <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                              {exp.company}
                            </h3>
                          )}
                        </div>
                        <p className="mt-1 font-sans text-sm font-semibold gradient-text sm:text-base">
                          {exp.role}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-0.5 font-body text-xs text-ink-400 sm:flex-col sm:items-end">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar size={12} /> {exp.period}
                        </span>
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          <MapPin size={12} /> {exp.location}
                        </span>
                      </div>
                    </div>

                    <p className="mt-5 max-w-3xl font-body text-[15px] font-light leading-relaxed text-slate-600">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
