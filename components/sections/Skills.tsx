"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillCategories } from "@/lib/data";

const row1 = skillCategories.slice(0, 2).flatMap((c) => c.skills);
const row2 = skillCategories.slice(2, 4).flatMap((c) => c.skills);

function SkillPill({ skill }: { skill: string }) {
 return (
 <span className="inline-flex h-10 flex-shrink-0 items-center rounded-full border border-slate-400/25 bg-page-surface px-4 mx-2 text-caption font-medium text-slate-700 whitespace-nowrap select-none">
 {skill}
 </span>
 );
}

function TickerRow({ skills, reverse }: { skills: string[]; reverse?: boolean }) {
 const doubled = [...skills, ...skills];
 return (
 <div className="ticker-wrap relative">
 <div className={reverse ? "ticker-track-right" : "ticker-track-left"}>
 {doubled.map((skill, i) => (
 <SkillPill key={i} skill={skill} />
 ))}
 </div>
 </div>
 );
}

export default function Skills() {
 return (
 <section
 id="skills"
 className="relative section-pad overflow-hidden"
 >
 <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
 <AnimatedSection>
 <SectionHeading title="Tech Stack" />
 </AnimatedSection>

 <AnimatedSection delay={0.1}>
 <div className="space-y-4">
 <TickerRow skills={row1} />
 <TickerRow skills={row2} reverse />
 </div>
 </AnimatedSection>
 </div>
 </section>
 );
}
