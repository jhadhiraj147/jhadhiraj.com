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
 {/* Edge fades */}
 <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f7f8fa] to-transparent z-10 pointer-events-none" />
 <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f7f8fa] to-transparent z-10 pointer-events-none" />
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
 className="relative section-pad bg-gradient-to-b from-white via-[#f7f8fa] to-white overflow-hidden"
 >
 <div className="max-w-7xl mx-auto">
 <AnimatedSection>
 <SectionHeading
 eyebrow="Technical Skills"
 title="Tech Stack"
 subtitle="What I reach for when building production systems."
 />
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
