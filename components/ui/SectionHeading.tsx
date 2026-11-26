"use client";

interface Props {
 title: string;
 subtitle?: string;
 centered?: boolean;
}

const commands: Record<string, string> = {
 "Who Am I?": "whoami",
 "Tech Stack": "cat ~/stack.conf",
 Experience: "cat ~/experience.log",
 Education: "cat ~/education.md",
 "More Projects": "ls ~/projects",
 "Let’s talk.": "mail dhiraj",
};

export default function SectionHeading({ title, subtitle, centered = false }: Props) {
 return (
 <div className={`mb-6 sm:mb-8 ${centered ? "text-center" : ""}`}>
 <p aria-hidden="true" className="mb-2 font-mono text-body text-accent">
 <span className="mr-2 text-ink-400">$</span>
 {commands[title] ?? `cat ~/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.md`}
 </p>

 <h2 className="font-mono text-xl font-medium leading-8 text-slate-900 sm:text-2xl">
 {title}
 </h2>

 {subtitle && (
 <p className={`mt-3 max-w-[68ch] font-mono text-body text-ink-500 ${centered ? "mx-auto" : ""}`}>
 {subtitle}
 </p>
 )}
 </div>
 );
}
