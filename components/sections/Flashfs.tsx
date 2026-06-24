"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Globe } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const AMBER = "#f5b700";
const AMBER_TEXT = "#92700a";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow mb-5 inline-flex items-center gap-3" style={{ color: AMBER_TEXT }}>
      <span aria-hidden className="h-px w-7" style={{ background: AMBER }} />
      {children}
    </p>
  );
}

export default function Flashfs() {
  return (
    <section
      id="flashfs"
      className="relative section-pad bg-gradient-to-b from-white via-[#fdfcf9] to-white overflow-hidden"
    >
      {/* Soft amber wash behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{
          background:
            "radial-gradient(58% 50% at 50% 40%, rgba(245,183,0,0.12) 0%, rgba(245,183,0,0.04) 48%, transparent 76%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Hero */}
        <header>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Image
              src="/assets/flashfs_logo_black.png"
              alt="FlashFS"
              width={4352}
              height={1167}
              priority
              className="h-16 w-auto select-none sm:h-24"
            />
          </motion.div>

          <AnimatedSection delay={0.08}>
            <p className="mt-6 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              A distributed filesystem I am building
            </p>
            <p className="mt-5 max-w-4xl font-display text-[1.65rem] leading-[1.22] tracking-tight text-slate-900 sm:text-4xl sm:leading-[1.22] lg:text-[2.6rem] lg:leading-[1.18]">
              One shared folder that lives on your own machines, mounted on every laptop, with
              files moving directly between them and{" "}
              <span style={{ color: AMBER_TEXT }}>never sitting on anyone&apos;s cloud.</span>
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.14}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="https://github.com/jhadhiraj147/FlashFS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-900/15 bg-white px-5 py-2.5 font-sans text-sm font-semibold text-slate-900 shadow-sm transition-colors duration-300 hover:border-[#f5b700]/70 sm:justify-start"
              >
                <Github size={16} strokeWidth={2} />
                github.com/jhadhiraj147/FlashFS
              </a>
              <a
                href="https://flashfilesystem.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-900/15 bg-white px-5 py-2.5 font-sans text-sm font-semibold text-slate-900 shadow-sm transition-colors duration-300 hover:border-[#f5b700]/70 sm:justify-start"
              >
                <Globe size={16} strokeWidth={2} />
                flashfilesystem.com
              </a>
            </div>
          </AnimatedSection>
        </header>

        {/* What it is */}
        <div className="mt-20 border-t border-slate-200 pt-14 sm:mt-24">
          <AnimatedSection>
            <Eyebrow>What it is</Eyebrow>
            <p className="max-w-3xl font-body text-lg font-light leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed">
              Sharing files across many machines usually means handing your data to a cloud drive,
              or stitching together manual transfers that never behave like real files. I built
              FlashFS to do neither. It turns a set of machines, your own laptops or a team&apos;s,
              into one filesystem mounted at{" "}
              <code className="rounded bg-slate-900/[0.05] px-1.5 py-0.5 font-mono text-[0.82em] text-slate-800">
                /mnt/flashfs
              </code>{" "}
              that behaves like a normal folder, while every byte stays on the machines you own.
            </p>
          </AnimatedSection>
        </div>

        {/* How I built it */}
        <div className="mt-16 border-t border-slate-200 pt-14 sm:mt-20">
          <AnimatedSection>
            <Eyebrow>How I built it</Eyebrow>
            <p className="max-w-3xl font-body text-base font-light leading-relaxed text-slate-600 sm:text-lg sm:leading-relaxed">
              I designed the cloud as a thin coordinator that holds only metadata, the directory
              tree and which machine holds which chunk, and never a single file byte. Files are
              split into content-addressed chunks that move directly between machines, peer to
              peer, over mutually authenticated connections. Lost copies rebuild themselves, and
              machines behind NAT reach each other through hole-punching, so it works across home
              networks and continents rather than a single LAN.
            </p>
          </AnimatedSection>
        </div>

        {/* What sets it apart */}
        <div className="mt-16 border-t border-slate-200 pt-14 sm:mt-20">
          <AnimatedSection>
            <Eyebrow>What sets it apart</Eyebrow>
            <blockquote className="max-w-4xl">
              <p className="font-display text-[1.55rem] leading-[1.3] tracking-tight text-slate-900 sm:text-[2.1rem] sm:leading-[1.28]">
                What I wanted was something that is, at once, a real mounted filesystem,{" "}
                <span style={{ color: AMBER_TEXT }}>fully peer to peer</span> so bytes never touch
                the cloud, self-healing, and able to work across the open internet.
              </p>
            </blockquote>
            <p className="mt-8 max-w-2xl font-body text-base leading-relaxed text-slate-600 sm:text-lg">
              The cloud only coordinates. The storage, the bandwidth, and the data stay with you.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
