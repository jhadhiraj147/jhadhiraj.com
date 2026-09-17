"use client";

interface Props {
 title: string;
 subtitle?: string;
 centered?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = true }: Props) {
 return (
 <div className={`mb-16 ${centered ? "text-center" : ""}`}>

 <h2 className="font-tech font-semibold text-display-sm sm:text-display-md lg:text-display-lg tracking-tight text-slate-900">
 {title}
 </h2>

 {subtitle && (
 <p className="mt-6 font-body font-light text-body text-ink-500 max-w-xl mx-auto">
 {subtitle}
 </p>
 )}
 </div>
 );
}
