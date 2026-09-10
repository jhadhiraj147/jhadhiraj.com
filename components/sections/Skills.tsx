"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { skillCategories } from "@/lib/data";

const row1 = skillCategories.slice(0, 2).flatMap((c) => c.skills);
const row2 = skillCategories.slice(2, 4).flatMap((c) => c.skills);

function SkillPill({ skill }: { skill: string }) {
 return (
 <span className="inline-flex items-center flex-shrink-0 px-5 py-2.5 mx-2 text-sm font-medium rounded-full glass border border-[#268bd2]/15 text-slate-700 whitespace-nowrap select-none">
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
 <div className="max-w-6xl mx-auto">
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
