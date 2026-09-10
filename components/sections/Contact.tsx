"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { personal } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Let&apos;s talk.
          </h2>
          <p className="mt-4 font-body text-base font-light text-ink-500">
            Open to internships, collaboration on projects, and good conversations.
          </p>
          <motion.a
            href={`mailto:${personal.email}`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/70 bg-white/35 px-6 py-3 font-sans text-sm font-semibold text-slate-900 backdrop-blur-xl transition-colors duration-200 hover:bg-white/60"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(15,23,42,0.06), 0 10px 28px rgba(15,23,42,0.10)",
            }}
          >
            <Mail size={16} className="text-ink-500 transition-colors group-hover:text-slate-900" />
            {personal.email}
          </motion.a>
        </div>
      </AnimatedSection>
    </section>
  );
}
