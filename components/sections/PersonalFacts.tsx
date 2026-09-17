"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import AnimatedSection from "@/components/ui/AnimatedSection";

const GEO_URL = "/world-110m.json";

const VISITED = new Set(["524", "356", "840", "792", "48", "608", "784", "630"]);

const markers: { name: string; coords: [number, number] }[] = [
  { name: "Nepal",       coords: [85.32,  27.72] },
  { name: "India",       coords: [78.96,  20.59] },
  { name: "USA",         coords: [-98.58, 39.83] },
  { name: "Turkey",      coords: [35.24,  38.96] },
  { name: "Bahrain",     coords: [50.59,  26.22] },
  { name: "Philippines", coords: [122.0,  12.88] },
  { name: "UAE",         coords: [53.85,  23.42] },
  { name: "Puerto Rico", coords: [-66.59, 18.22] },
];

const story = [
  {
    title: "International Student",
    body: "Nepal to Nashville is $1,200 and three connections on a good day. Every trip home is a financial equation before it is a reunion. You learn to find routes nobody else would look for, the ones with a six-hour layover in Doha that cut the price in half.",
  },
  {
    title: "The Opportunity Hunt",
    body: "Bahrain because it was visa-on-arrival and cheap. The Philippines because a friend had a spare room. Turkey because the layover made the connection cheaper than any direct route. A Nepali passport teaches you to find the opening nobody else looked for.",
  },
  {
    title: "The Tools Are Broken",
    body: "Every trip planned across twenty tabs, four apps, and a notes file that falls apart the moment a price changes. The platforms are built for blue passports and fat wallets. The rest of us improvise. That is where offtofly started.",
  },
];

export default function PersonalFacts() {
  const mapRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(mapRef, { once: true, amount: 0.3 });
  const still = useReducedMotion();

  return (
    <section className="relative section-pad overflow-hidden">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-tech font-semibold text-display-sm sm:text-display-md lg:text-display-lg tracking-tight text-slate-900">
              <span className="block">7 Countries.</span>
              <span className="block text-ink-300">One Nepali Passport.</span>
            </h2>
          </div>
        </AnimatedSection>

        {/* World map - clean atlas style on white */}
        <AnimatedSection delay={0.15}>
          <div ref={mapRef}>
            <ComposableMap
              projection="geoNaturalEarth1"
              projectionConfig={{ scale: 155, center: [20, 5] }}
              width={900}
              height={420}
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <Geographies geography={GEO_URL}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {({ geographies }: { geographies: any[] }) =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  geographies.map((geo: any) => {
                    const visited = VISITED.has(String(geo.id));
                    return (
                      <Geography
                        key={geo.rsmKey}
                        tabIndex={-1}
                        geography={geo}
                        fill={visited ? "rgba(63,91,123,0.16)" : "#f1f5f9"}
                        stroke={visited ? "#3f5b7b" : "#b6bfca"}
                        strokeWidth={visited ? 0.7 : 0.35}
                        style={{
                          default: { outline: "none" },
                          hover:   { fill: visited ? "rgba(63,91,123,0.30)" : "#dfe3e8", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {inView && markers.map((m, i) => (
                <Marker key={m.name} coordinates={m.coords}>
                  <motion.circle
                    r={0}
                    fill="none"
                    stroke="#3f5b7b"
                    strokeWidth={1.2}
                    initial={{ r: 0, opacity: 0.8 }}
                    animate={{ r: 11, opacity: 0 }}
                    transition={{
                      delay: i * 0.18 + 0.2,
                      duration: 1.8,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: "easeOut",
                    }}
                  />
                  <motion.circle
                    r={0}
                    fill="#3f5b7b"
                    initial={{ r: 0 }}
                    animate={{ r: 3.5 }}
                    transition={{ delay: i * 0.18, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection delay={0.28}>
          <div className="flex justify-center gap-12 sm:gap-16 mt-16 mb-16">
            {[
              { value: "7",   label: "Countries"  },
              { value: "50+", label: "Cities"      },
              { value: "3",   label: "Continents" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-sans font-bold text-display-sm sm:text-display-md tracking-tight text-accent tabular-nums">{s.value}</p>
                <p className="mt-2 font-sans text-caption font-medium uppercase tracking-widest text-ink-400">{s.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Story columns */}
        <div className="grid lg:grid-cols-3 gap-16">
          {story.map((s, i) => (
            <AnimatedSection key={s.title} delay={0.12 + i * 0.1}>
              <div className="space-y-2">
                <p className="font-sans font-semibold text-title text-slate-800 tracking-tight">
                  {s.title}
                </p>
                <p className="max-w-md font-body font-light text-body text-ink-500">
                  {s.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bridge to offtofly */}
        <AnimatedSection delay={0.4}>
          <div className="text-center mt-16">
            <p className="font-body italic text-lead text-accent">
              This is where offtofly started.
            </p>
            <motion.a
              href="#offtofly"
              aria-label="Continue to offtofly"
              className="mt-6 inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-300 transition-colors duration-150 hover:bg-slate-900/5 hover:text-slate-900"
              animate={still ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={18} strokeWidth={1.8} />
            </motion.a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
