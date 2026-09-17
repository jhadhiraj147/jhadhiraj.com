"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Page tokens, spelled out because SVG attributes cannot take Tailwind classes.
const AMBER = "#f5b700"; // data plane lines
const AMBER_TEXT = "#725708"; // data plane labels
const INK_900 = "#0f172a"; // slate-900
const INK_700 = "#334155"; // slate-700
const INK_500 = "#505b6f"; // ink-500
const LINE = "#64748b"; // slate-500, box strokes
const CTRL = "#475569"; // slate-600, control plane lines
const PAGE = "#e6e6e6"; // page
const SURFACE = "#f0f0f0"; // page-surface

/* ---------- SVG primitives ---------- */

function Markers({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={`${id}-cp`}
        markerUnits="userSpaceOnUse"
        markerWidth={8}
        markerHeight={8}
        refX={7}
        refY={4}
        orient="auto-start-reverse"
      >
        <path d="M0 0.8 L8 4 L0 7.2 Z" fill={CTRL} />
      </marker>
      <marker
        id={`${id}-dp`}
        markerUnits="userSpaceOnUse"
        markerWidth={10}
        markerHeight={10}
        refX={9}
        refY={5}
        orient="auto-start-reverse"
      >
        <path d="M0 1 L10 5 L0 9 Z" fill={AMBER} />
      </marker>
    </defs>
  );
}

type PanelProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  ts?: number;
  ls?: number;
  pad?: number;
  fill?: string;
};

// A labelled box: title, then one text line per entry, on a shared baseline grid.
function Panel({ x, y, w, h, title, lines = [], ts = 12, ls = 10, pad = 10, fill = SURFACE }: PanelProps) {
  const tb = y + pad + ts - 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={LINE} strokeWidth={1} />
      <text x={x + pad} y={tb} fontSize={ts} fontWeight={600} fill={INK_900}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={x + pad} y={tb + (ls + 6) * (i + 1)} fontSize={ls} fill={INK_700}>
          {l}
        </text>
      ))}
    </g>
  );
}

function Cylinder({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke={INK_500} strokeWidth={1}>
      <ellipse cx={x + 8} cy={y + 3} rx={8} ry={3} />
      <path d={`M${x} ${y + 3} V${y + 13} A8 3 0 0 0 ${x + 16} ${y + 13} V${y + 3}`} />
    </g>
  );
}

function Key({ x, y }: { x: number; y: number }) {
  return (
    <g fill="none" stroke={INK_500} strokeWidth={1.2}>
      <circle cx={x + 4} cy={y} r={3.5} />
      <path d={`M${x + 7.5} ${y} H${x + 18} M${x + 15} ${y} V${y + 3.5}`} />
    </g>
  );
}

// The path file bytes would take into the cloud, struck out at the boundary.
function Strike({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={AMBER} strokeWidth={2.5} />
      <path
        d={`M${x - 6} ${y2 - 6} L${x + 6} ${y2 + 6} M${x + 6} ${y2 - 6} L${x - 6} ${y2 + 6}`}
        stroke={AMBER_TEXT}
        strokeWidth={2}
      />
    </g>
  );
}

function LaptopFull({ x, y, name }: { x: number; y: number; name: string }) {
  return (
    <g>
      <rect x={x} y={y} width={288} height={186} rx={6} fill={PAGE} stroke={LINE} strokeWidth={1} />
      <text x={x + 12} y={y + 20} fontSize={12} fontWeight={600} fill={INK_900}>
        {name}
      </text>
      <rect x={x + 234} y={y - 8} width={42} height={16} rx={2} fill={SURFACE} stroke={LINE} strokeWidth={1} />
      <text x={x + 255} y={y + 3.5} fontSize={9.5} fill={INK_500} textAnchor="middle">
        NAT
      </text>
      <Panel
        x={x + 12}
        y={y + 32}
        w={264}
        h={60}
        ts={11.5}
        title="flashfs client-daemon"
        lines={["FUSE mount at /mnt/flashfs", "lowest cost replica, disposable cache"]}
      />
      <line x1={x + 144} y1={y + 92} x2={x + 144} y2={y + 116} stroke={AMBER} strokeWidth={2} />
      <text x={x + 150} y={y + 107} fontSize={9} fill={AMBER_TEXT}>
        loopback gRPC
      </text>
      <Panel
        x={x + 12}
        y={y + 116}
        w={264}
        h={60}
        ts={11.5}
        title="flashfs node-daemon"
        lines={["/var/lib/flashfs/chunks/<sha256>", "rejects sha256(bytes) != chunk_id"]}
      />
    </g>
  );
}

function LaptopCompact({ x, y, name }: { x: number; y: number; name: string }) {
  return (
    <g>
      <rect x={x} y={y} width={166} height={150} rx={5} fill={PAGE} stroke={LINE} strokeWidth={1} />
      <text x={x + 8} y={y + 16} fontSize={10.5} fontWeight={600} fill={INK_900}>
        {name}
      </text>
      <rect x={x + 124} y={y - 7} width={34} height={14} rx={2} fill={SURFACE} stroke={LINE} strokeWidth={1} />
      <text x={x + 141} y={y + 3.5} fontSize={9.5} fill={INK_500} textAnchor="middle">
        NAT
      </text>
      <Panel
        x={x + 8}
        y={y + 24}
        w={150}
        h={48}
        ts={10}
        ls={10}
        pad={8}
        title="flashfs client-daemon"
        lines={["FUSE at /mnt/flashfs"]}
      />
      <line x1={x + 83} y1={y + 72} x2={x + 83} y2={y + 92} stroke={AMBER} strokeWidth={2} />
      <text x={x + 88} y={y + 85} fontSize={9.5} fill={AMBER_TEXT}>
        loopback
      </text>
      <Panel
        x={x + 8}
        y={y + 92}
        w={150}
        h={48}
        ts={10}
        ls={10}
        pad={8}
        title="flashfs node-daemon"
        lines={["chunks/<sha256>"]}
      />
    </g>
  );
}

/* ---------- The two layouts of the same figure ---------- */

const ARIA =
  "FlashFS architecture. A cloud boundary holds control-plane with Postgres, ca-signer with the CA keys, and flashfs-master made of a metadata core with its WAL and an optimizer. Laptops below each run the flashfs binary as client-daemon with a FUSE mount and node-daemon with a chunk store. Dashed lines carry metadata over gRPC and mTLS to the master. Solid amber lines carry chunks directly laptop to laptop, hole punched via ICE. No file bytes cross the cloud.";

function DiagramFull() {
  const id = "ffs-l";
  const cp = `url(#${id}-cp)`;
  const dp = `url(#${id}-dp)`;
  return (
    <svg viewBox="0 0 960 606" role="img" aria-label={ARIA} className="hidden h-auto w-full font-mono lg:block">
      <Markers id={id} />

      {/* cloud boundary */}
      <rect x={16} y={18} width={928} height={236} rx={6} fill={PAGE} stroke={LINE} strokeWidth={1} />
      <text x={30} y={40} fontSize={11} fontWeight={600} fill={INK_500}>
        cloud
      </text>

      <Panel x={32} y={50} w={250} h={70} ts={13} title="ca-signer" lines={["signs CSRs. no internet port"]} />
      <Key x={44} y={100} />
      <text x={66} y={103.5} fontSize={10} fill={INK_500}>
        per cluster CA keys in KMS
      </text>

      <Panel
        x={32}
        y={152}
        w={250}
        h={86}
        ts={13}
        title="control-plane"
        lines={["accounts, membership, join tokens", "humans: OIDC. laptops: enroll, renew"]}
      />
      <Cylinder x={44} y={213} />
      <text x={66} y={225} fontSize={10} fill={INK_500}>
        Postgres
      </text>

      {/* internal cloud RPCs */}
      <line x1={157} y1={152} x2={157} y2={120} stroke={CTRL} strokeWidth={1} markerEnd={cp} />
      <text x={163} y={140} fontSize={9} fill={INK_500}>
        sign CSR
      </text>
      <line x1={282} y1={195} x2={336} y2={195} stroke={CTRL} strokeWidth={1} markerEnd={cp} />
      <text x={309} y={188} fontSize={9} fill={INK_500} textAnchor="middle">
        CA cert
      </text>
      <text x={309} y={208} fontSize={9} fill={INK_500} textAnchor="middle">
        revoke
      </text>

      {/* master: two engines */}
      <rect x={336} y={50} width={592} height={188} rx={4} fill={SURFACE} stroke={LINE} strokeWidth={1} />
      <text x={348} y={70} fontSize={13} fontWeight={600} fill={INK_900}>
        flashfs-master
      </text>
      <text x={348} y={88} fontSize={10} fill={INK_500}>
        heartbeats, rendezvous. the one cloud service on the hot path. no file bytes
      </text>
      <Panel
        x={348}
        y={100}
        w={270}
        h={126}
        fill={PAGE}
        title="metadata core"
        lines={["synchronous, authoritative", "namespace, inodes, chunk map, leases", "commit path, sole WAL writer"]}
      />
      <rect x={360} y={182} width={246} height={32} rx={2} fill={SURFACE} stroke={LINE} strokeWidth={1} />
      <text x={368} y={196} fontSize={10} fontWeight={600} fill={INK_900}>
        WAL
      </text>
      <text x={400} y={196} fontSize={9} fill={INK_500}>
        append + fsync before any change
      </text>
      <text x={400} y={208} fontSize={9} fill={INK_500}>
        shipped off box continuously
      </text>
      <Panel
        x={680}
        y={100}
        w={236}
        h={126}
        fill={PAGE}
        title="optimizer"
        lines={[
          "asynchronous, advisory",
          "popularity, demand by region",
          "placement, migration, repair",
          "holds no ground truth",
          "can crash and recompute",
        ]}
      />
      <line x1={618} y1={150} x2={680} y2={150} stroke={CTRL} strokeWidth={1} markerEnd={cp} />
      <text x={649} y={145} fontSize={9} fill={INK_500} textAnchor="middle">
        snapshot
      </text>
      <line x1={680} y1={198} x2={618} y2={198} stroke={CTRL} strokeWidth={1} markerEnd={cp} />
      <text x={649} y={193} fontSize={9} fill={INK_500} textAnchor="middle">
        proposals
      </text>

      {/* control plane: every laptop to the master */}
      <g stroke={CTRL} strokeWidth={1.2} strokeDasharray="4 4" markerStart={cp} markerEnd={cp}>
        <line x1={160} y1={330} x2={632} y2={238} />
        <line x1={480} y1={330} x2={632} y2={238} />
        <line x1={800} y1={330} x2={632} y2={238} />
      </g>
      <text x={640} y={298} fontSize={11} fontWeight={600} fill={INK_700} textAnchor="middle">
        gRPC / mTLS
      </text>
      <text x={640} y={314} fontSize={9.5} fill={INK_500} textAnchor="middle">
        metadata, leases, placement, signaling
      </text>

      {/* the invariant */}
      <Strike x={100} y1={330} y2={254} />
      <text x={112} y={290} fontSize={11} fontWeight={600} fill={AMBER_TEXT}>
        no file bytes
      </text>
      <text x={112} y={305} fontSize={11} fontWeight={600} fill={AMBER_TEXT}>
        cross the cloud
      </text>

      {/* laptops */}
      <LaptopFull x={16} y={330} name="laptop A" />
      <LaptopFull x={336} y={330} name="laptop B" />
      <LaptopFull x={656} y={330} name="laptop C" />

      {/* data plane: laptop to laptop only */}
      <g fill="none" stroke={AMBER} strokeWidth={2.5} markerStart={dp} markerEnd={dp}>
        <line x1={292} y1={476} x2={348} y2={476} />
        <line x1={612} y1={476} x2={668} y2={476} />
        <path d="M160 516 Q480 592 800 516" />
      </g>
      <text x={480} y={576} fontSize={11} fontWeight={600} fill={AMBER_TEXT} textAnchor="middle">
        chunks, direct, hole punched via ICE
      </text>
      <text x={480} y={592} fontSize={9.5} fill={AMBER_TEXT} textAnchor="middle">
        client to node, node to node
      </text>
    </svg>
  );
}

function DiagramCompact() {
  const id = "ffs-s";
  const cp = `url(#${id}-cp)`;
  const dp = `url(#${id}-dp)`;
  return (
    <svg
      viewBox="0 0 360 500"
      role="img"
      aria-label={ARIA}
      className="mx-auto h-auto w-full max-w-[520px] font-mono lg:hidden"
    >
      <Markers id={id} />

      <rect x={6} y={6} width={348} height={222} rx={6} fill={PAGE} stroke={LINE} strokeWidth={1} />
      <text x={16} y={22} fontSize={10} fontWeight={600} fill={INK_500}>
        cloud
      </text>

      <Panel x={14} y={30} w={160} h={60} ts={11} ls={9.5} pad={8} title="ca-signer" lines={["signs CSRs", "CA keys in KMS"]} />
      <Panel
        x={186}
        y={30}
        w={160}
        h={60}
        ts={11}
        ls={9.5}
        pad={8}
        title="control-plane"
        lines={["accounts, membership", "Postgres. OIDC login"]}
      />

      <rect x={14} y={100} width={332} height={118} rx={4} fill={SURFACE} stroke={LINE} strokeWidth={1} />
      <text x={22} y={116} fontSize={11} fontWeight={600} fill={INK_900}>
        flashfs-master
      </text>
      <text x={22} y={130} fontSize={9} fill={INK_500}>
        metadata only. the one hot path service
      </text>
      <Panel x={22} y={138} w={156} h={72} ts={10.5} ls={10} pad={8} fill={PAGE} title="metadata core" lines={["sync, authoritative"]} />
      <rect x={30} y={178} width={140} height={24} rx={2} fill={SURFACE} stroke={LINE} strokeWidth={1} />
      <text x={36} y={193} fontSize={9} fontWeight={600} fill={INK_900}>
        WAL
      </text>
      <text x={60} y={193} fontSize={9.5} fill={INK_500}>
        append + fsync
      </text>
      <Panel
        x={186}
        y={138}
        w={152}
        h={72}
        ts={10.5}
        ls={10}
        pad={8}
        fill={PAGE}
        title="optimizer"
        lines={["async, advisory", "placement, repair"]}
      />

      <g stroke={CTRL} strokeWidth={1.2} strokeDasharray="4 4" markerStart={cp} markerEnd={cp}>
        <line x1={89} y1={300} x2={180} y2={218} />
        <line x1={271} y1={300} x2={180} y2={218} />
      </g>
      <text x={180} y={266} fontSize={10} fontWeight={600} fill={INK_700} textAnchor="middle">
        gRPC / mTLS
      </text>
      <text x={180} y={282} fontSize={9.5} fill={INK_500} textAnchor="middle">
        leases, NAT signaling
      </text>

      <Strike x={30} y1={300} y2={228} />
      <text x={38} y={241} fontSize={9.5} fontWeight={600} fill={AMBER_TEXT}>
        no file bytes
      </text>
      <text x={38} y={254} fontSize={9.5} fontWeight={600} fill={AMBER_TEXT}>
        cross the cloud
      </text>

      <LaptopCompact x={6} y={300} name="laptop A" />
      <LaptopCompact x={188} y={300} name="laptop B" />

      <path d="M89 450 V462 H271 V450" fill="none" stroke={AMBER} strokeWidth={2.5} markerStart={dp} markerEnd={dp} />
      <text x={180} y={478} fontSize={10} fontWeight={600} fill={AMBER_TEXT} textAnchor="middle">
        chunks, direct, hole punched via ICE
      </text>
      <text x={180} y={492} fontSize={9.5} fill={AMBER_TEXT} textAnchor="middle">
        client to node, node to node
      </text>
    </svg>
  );
}

/* ---------- Text below the figure ---------- */

const PLACEMENT = `# internal/master/optimizer, README §16
popularity = recent_reads*5 + unique_clients*10 + cache_misses*3 + recent_writes*2 - age_decay
target_rf  = 2 cold (<20) | 3 warm (>=20) | 4 hot (>=100) | 5 viral (>=300, capped)

demand_by_region[r] = recent_reads_from_region[r] + weighted_cache_misses_from_region[r]
locality_benefit    = sum over demand regions r of demand[r] / (1 + rtt(node_region, r))
                      # unknown rtt = 250 ms

score(node, chunk) = w_loc*locality_benefit + w_avail*zone_complement + w_space*free_space
                   - w_load*load - penalty
take the top target_rf nodes. migration is copy then drop.`;

const REPO = "https://github.com/jhadhiraj147/FlashFS";

const heading = "font-tech text-title font-semibold text-slate-900";
const prose = "max-w-2xl font-tech text-body font-light text-slate-700";
const linkClass =
  "inline-flex items-center gap-2 font-mono text-body text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent";

// Paths, calls and identifiers.
function Code({ children }: { children: string }) {
  return <code className="whitespace-nowrap font-mono text-slate-900">{children}</code>;
}

// A component named in the diagram, in the ink blue the site uses for structure.
function Name({ children }: { children: string }) {
  return <code className="whitespace-nowrap font-mono text-accent">{children}</code>;
}

export default function Flashfs() {
  return (
    <section id="flashfs" className="relative section-pad overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <Image
            src="/assets/flashfs_wordmark.png"
            alt="FlashFS"
            width={3828}
            height={733}
            className="h-9 w-auto select-none sm:h-12"
          />
        </motion.div>

        <AnimatedSection delay={0.06} className="mt-6 space-y-5">
          <p className={prose}>
            FlashFS is a distributed filesystem for the laptops you own. Files live on the laptops as chunks, and the
            cloud holds only metadata.
          </p>
          <p className={prose}>
            I built it while working at Vanderbilt, when keeping one project in sync across a Linux desktop, a
            MacBook and a work laptop got hard. MooseFS is not built for personal computers, and file sharing tools
            are redundant or fail behind NAT.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.06} className="mt-16">
          <h3 className={heading}>Architecture</h3>
          <figure className="mt-6 rounded-xl border border-slate-400/25 bg-page-surface p-2 sm:p-6">
            <DiagramFull />
            <DiagramCompact />
          </figure>
        </AnimatedSection>

        <AnimatedSection delay={0.06} className="mt-16">
          <h3 className={heading}>How it works</h3>
          <div className="mt-6 space-y-5">
            <p className={prose}>
              In the cloud, <Name>flashfs-master</Name> is the only service on the hot path. Its metadata core is
              synchronous and authoritative. Its optimizer runs asynchronously and only proposes changes, which the metadata core applies.
            </p>
            <p className={prose}>
              Each laptop runs <Code>flashfs</Code> in two roles. The <Name>client-daemon</Name> serves the FUSE mount
              and reads from the lowest cost reachable replica. The <Name>node-daemon</Name> stores chunks and
              rejects any with the wrong hash.
            </p>
            <p className={prose}>
              The dashed control path carries metadata to the master over gRPC with mTLS. The amber{" "}
              <span style={{ color: AMBER_TEXT }}>data path</span> carries chunks directly between laptops, using ICE through NAT when
              they are remote. The struck line marks the invariant:{" "}
              <strong className="font-semibold text-gold">no file bytes cross the cloud</strong>.
            </p>
            <p className={prose}>
              To write, the client takes a lease and splits the file into chunks named <Code>sha256(bytes)</Code>.
              Each chunk goes directly to its primary node, and the other chosen nodes copy it from there. Once every chunk has{" "}
              <Code>commit_rf_floor</Code> acknowledgements, the version and chunk map flip in one metadata core
              transaction.
            </p>
            <p className={prose}>
              Popularity sets how many replicas a chunk gets, and placement puts them near the regions reading it.
            </p>
            <pre className="max-w-3xl overflow-x-auto rounded-md border border-slate-400/25 bg-page px-4 py-3 font-mono text-caption text-slate-800">
              <code>{PLACEMENT}</code>
            </pre>
            <p>
              <a href={REPO} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <Github size={14} strokeWidth={2} />
                github.com/jhadhiraj147/FlashFS
              </a>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
