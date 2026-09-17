"use client";

interface Props {
 title: string;
 subtitle?: string;
 centered?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = true }: Props) {
 return (
 <div className={`mb-16 ${centered ? "text-center" : ""}`}>

 <h2 className="font-tech font-semibold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900">
 {title}
 </h2>

 {subtitle && (
 <p className="mt-6 font-body font-light text-base/7 sm:text-lg/8 text-ink-500 max-w-xl mx-auto">
 {subtitle}
 </p>
 )}
 </div>
 );
}
