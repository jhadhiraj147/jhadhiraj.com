"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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

  return (
    <section className="relative section-pad overflow-hidden">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight text-slate-900">
              7 Countries.
            </h2>
            <h2 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight text-ink-300">
              One Nepali Passport.
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
                        geography={geo}
                        fill={visited ? "rgba(38,139,210,0.14)" : "#f1f5f9"}
                        stroke={visited ? "#268bd2" : "#b6bfca"}
                        strokeWidth={visited ? 0.7 : 0.35}
                        style={{
                          default: { outline: "none" },
                          hover:   { fill: visited ? "rgba(38,139,210,0.28)" : "#dfe3e8", outline: "none" },
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
                    stroke="#268bd2"
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
                    fill="#268bd2"
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
          <div className="flex justify-center gap-14 sm:gap-20 mt-10 mb-16">
            {[
              { value: "7",   label: "Countries"  },
              { value: "50+", label: "Cities"      },
              { value: "3",   label: "Continents" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-4xl sm:text-5xl text-accent leading-none tabular-nums">{s.value}</p>
                <p className="eyebrow text-ink-400 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Story columns */}
        <div className="grid lg:grid-cols-3 gap-10">
          {story.map((s, i) => (
            <AnimatedSection key={s.title} delay={0.12 + i * 0.1}>
              <div className="space-y-3 lg:px-8 first:lg:pl-0 last:lg:pr-0 pt-8 lg:pt-0 first:pt-0">
                <p className="font-display font-semibold text-lg text-slate-800 tracking-tight leading-snug">
                  {s.title}
                </p>
                <p className="font-body font-light text-sm text-ink-500 leading-relaxed">
                  {s.body}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bridge to offtofly */}
        <AnimatedSection delay={0.4}>
          <div className="text-center mt-20">
            <p className="font-display italic text-2xl sm:text-3xl text-accent">
              This is where offtofly started.
            </p>
            <motion.div
              className="mt-6 inline-block text-ink-300"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
