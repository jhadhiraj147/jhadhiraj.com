"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { personal } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="relative bg-white px-4 py-20 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <p className="eyebrow mb-4 text-[#268bd2]">Get in touch</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Let&apos;s talk.
          </h2>
          <p className="mt-4 font-body text-base font-light text-slate-500">
            Open to internships, collaboration on projects, and good conversations.
          </p>
          <motion.a
            href={`mailto:${personal.email}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#268bd2]/90 px-6 py-3 text-sm font-semibold text-white shadow-[0_2px_16px_rgba(38,139,210,0.3)] transition-all duration-200 hover:bg-[#268bd2]"
          >
            <Mail size={16} />
            {personal.email}
          </motion.a>
        </div>
      </AnimatedSection>
    </section>
  );
}
