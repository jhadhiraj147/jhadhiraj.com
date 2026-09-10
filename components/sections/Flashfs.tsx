"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Globe } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const AMBER = "#f5b700";
const AMBER_TEXT = "#725708";

const stack = [
  { layer: "mount", component: "FUSE", mechanism: "POSIX calls served at /mnt/flashfs" },
  { layer: "naming", component: "Chunker", mechanism: "Chunk name is the hash of its own bytes" },
  { layer: "placement", component: "Coordinator", mechanism: "Directory tree and chunk map. No file data" },
  { layer: "transport", component: "Peer link", mechanism: "gRPC over mTLS. STUN and ICE for NAT traversal" },
  { layer: "durability", component: "Replicator", mechanism: "Quorum replication across nodes" },
  { layer: "recovery", component: "Write ahead log", mechanism: "Replay on restart. Repair of under replicated chunks" },
];

const why = [
  ["FUSE", "The mount behaves like a normal folder, so existing tools work against it unchanged."],
  ["Chunks named by hash", "Identical chunks collapse to one copy, and corruption is detectable on read."],
  ["Coordinator holds metadata only", "It can be compromised without exposing a single byte of anyone's files."],
  ["Direct peer transfer", "Bytes take the short path between machines, and bandwidth cost never lands on a cloud bill."],
  ["STUN and ICE", "Nodes behind home routers reach each other without port forwarding or a VPN."],
  ["Quorum replication", "A node can drop out mid session without blocking reads."],
];

function Box({
  label,
  title,
  lines,
  accent = false,
}: {
  label: string;
  title: string;
  lines: string[];
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-lg border bg-page px-4 py-4"
      style={{
        borderColor: accent ? "rgba(245,183,0,0.55)" : "rgba(100,116,139,0.30)",
        borderStyle: accent ? "solid" : "dashed",
      }}
    >
      <p className="font-mono text-[11px]" style={{ color: accent ? AMBER_TEXT : "#576478" }}>
        {label}
      </p>
      <p className="mt-1.5 font-sans text-sm font-semibold text-slate-900">{title}</p>
      <ul className="mt-2 space-y-1">
        {lines.map((l) => (
          <li key={l} className="font-body text-[13px] leading-snug text-ink-500">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Flashfs() {
  return (
    <section
      id="flashfs"
      className="relative section-pad overflow-hidden"
    >
      <div className="relative mx-auto max-w-6xl">
        {/* Identity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {/* Trimmed to its ink. The original export carried 366px of transparent
              padding on the left, which pushed the F off the text column below it. */}
          <Image
            src="/assets/flashfs_wordmark.png"
            alt="FlashFS"
            width={3828}
            height={733}
            className="h-9 w-auto select-none sm:h-12"
          />
        </motion.div>

        <AnimatedSection delay={0.06}>
          <p className="mt-5 max-w-3xl font-body text-lg font-light leading-relaxed text-slate-700 sm:text-xl">
            A distributed filesystem. Files are split into chunks, spread across Linux machines you
            own, and mounted at{" "}
            <code className="rounded bg-slate-900/[0.06] px-1.5 py-0.5 font-mono text-[0.8em] text-slate-800">
              /mnt/flashfs
            </code>
            . The cloud never holds a byte of them.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="https://github.com/jhadhiraj147/FlashFS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 transition-colors hover:decoration-[#f5b700]"
            >
              <Github size={15} strokeWidth={2} />
              github.com/jhadhiraj147/FlashFS
            </a>
            <a
              href="https://flashfilesystem.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 transition-colors hover:decoration-[#f5b700]"
            >
              <Globe size={15} strokeWidth={2} />
              flashfilesystem.com
            </a>
            <span className="font-mono text-xs text-ink-500">Go, C++, Linux. Active since Mar 2026</span>
          </div>
        </AnimatedSection>

        {/* Architecture: the whole point is that metadata and file data take different paths */}
        <AnimatedSection delay={0.1}>
          <div className="mt-14 rounded-xl border border-slate-400/25 bg-page-surface p-4 sm:p-7">
            <div className="rounded-lg border border-slate-400/30 bg-page px-4 py-4">
              <p className="font-mono text-[11px] text-ink-500">clients</p>
              <p className="mt-1.5 font-sans text-sm font-semibold text-slate-900">
                FUSE mount on every machine
              </p>
              <p className="mt-2 font-body text-[13px] leading-snug text-ink-500">
                Reads and writes enter here as ordinary filesystem calls.
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* connectors, drawn only where there is room for them */}
              <div className="hidden sm:flex sm:justify-center">
                <span aria-hidden className="h-7 w-px border-l border-dashed border-slate-500/50" />
              </div>
              <div className="hidden sm:flex sm:justify-center">
                <span aria-hidden className="h-7 w-px" style={{ background: AMBER }} />
              </div>

              <Box
                label="control path"
                title="Coordinator"
                lines={[
                  "Directory tree.",
                  "Which node holds which chunk.",
                  "No file bytes, ever.",
                ]}
              />
              <Box
                label="data path"
                title="Peer nodes"
                lines={[
                  "Chunks move machine to machine.",
                  "gRPC over mTLS, NAT traversed.",
                  "Quorum of replicas answers reads.",
                ]}
                accent
              />
            </div>

            <p className="mt-5 font-body text-[13px] leading-snug text-ink-500">
              Two separate paths. The dashed one carries metadata to the coordinator. The solid one
              carries the actual file data between machines and never touches it.
            </p>
          </div>
        </AnimatedSection>

        {/* Stack */}
        <AnimatedSection delay={0.06}>
          <h3 className="mt-16 font-sans text-[15px] font-semibold text-slate-900">Stack</h3>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-400/25">
            <div className="grid gap-px bg-slate-400/25">
              {stack.map((r) => (
                <div
                  key={r.layer}
                  className="grid gap-1 bg-page-surface px-4 py-4 sm:grid-cols-[7.5rem_11rem_1fr] sm:items-baseline sm:gap-6"
                >
                  <span className="font-mono text-[12px]" style={{ color: AMBER_TEXT }}>
                    {r.layer}
                  </span>
                  <span className="font-sans text-sm font-semibold text-slate-900">
                    {r.component}
                  </span>
                  <span className="font-body text-sm leading-snug text-slate-600">
                    {r.mechanism}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Why */}
        <AnimatedSection delay={0.06}>
          <h3 className="mt-16 font-sans text-[15px] font-semibold text-slate-900">
            Why these choices
          </h3>
          <div className="mt-4 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {why.map(([choice, reason]) => (
              <div key={choice} className="border-t border-slate-400/25 pt-4">
                <p className="font-sans text-sm font-semibold text-slate-900">{choice}</p>
                <p className="mt-1.5 font-body text-sm leading-relaxed text-slate-600">{reason}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
