"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import Image from "next/image";

const links = [
  { href: "#about",      label: "About"      },
  { href: "#skills",     label: "Skills"     },
  { href: "#experience", label: "Experience" },
  { href: "#projects",   label: "Projects"   },
  { href: "#education",  label: "Education"  },
  { href: "#contact",    label: "Contact"    },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [activeLink,  setActiveLink]  = useState("");
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight active section
  useEffect(() => {
    const sectionIds = links.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveLink(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80  backdrop-blur-2xl border-b border-brand-200/40  shadow-sm shadow-brand-400/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          {/* Logo */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.06 }}
            className="flex items-center"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-slate-200 flex-shrink-0">
              <Image
                src="/assets/avatar.jpg"
                alt="Dhiraj Jha"
                fill
                sizes="36px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
                priority
              />
            </div>
          </motion.a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeLink === l.href
                      ? "text-brand-400"
                      : "text-slate-600  hover:text-brand-400  hover:bg-brand-50 "
                  }`}
                >
                  {l.label}
                  {activeLink === l.href && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-400"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="/assets/resume/resume_jhadhiraj147.pdf"
              download
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full
                bg-white/60 backdrop-blur-md border border-slate-200
                shadow-[0_2px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]
                text-slate-700 hover:border-[#268bd2]/40 hover:shadow-[0_2px_16px_rgba(38,139,210,0.15),inset_0_1px_0_rgba(255,255,255,0.8)]
                transition-all duration-200"
            >
              <Download size={15} /> Resume
            </a>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-brand-50 transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#268bd2] to-[#2aa198] origin-left"
          style={{ scaleX: progressScaleX }}
        />
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-2xl border-b border-brand-200/30 shadow-xl"
          >
            <nav className="px-4 py-5 flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-brand-400 rounded-xl hover:bg-brand-50 transition-all"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/assets/resume/resume_jhadhiraj147.pdf"
                download
                className="mt-3 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-full
                  bg-[#268bd2]/90 text-white
                  shadow-[0_2px_16px_rgba(38,139,210,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]"
              >
                <Download size={15} /> Download Resume
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
