"use client";

interface Props {
 eyebrow?: string;
 title: string;
 subtitle?: string;
 centered?: boolean;
}

export default function SectionHeading({ eyebrow, title, subtitle, centered = true }: Props) {
 return (
 <div className={`mb-16 ${centered ? "text-center" : ""}`}>

 {eyebrow && (
 <p className="eyebrow text-[#268bd2] mb-4">{eyebrow}</p>
 )}

 <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight text-slate-900">
 {title}
 </h2>

 {subtitle && (
 <p className="mt-5 font-body font-light text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
 {subtitle}
 </p>
 )}
 </div>
 );
}
