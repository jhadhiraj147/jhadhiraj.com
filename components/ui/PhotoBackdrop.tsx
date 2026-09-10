"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/* The hero photograph is pinned to the viewport and never scrolls. Content rides
   over it, and two veils fade up as you leave the hero so that copy stays legible.

   VEIL_MAX is the one dial worth touching: 0 leaves the photo at full strength
   behind every section, 1 hides it completely and the page looks exactly as it
   did before this existed. 0.88 lets a little more of it through. */
const VEIL_MAX = 0.88;
/* The lower third of the photo is much darker than the sky. This second veil is
   weighted to the bottom of the screen so the composite stays even top to bottom. */
const FLOOR_MAX = 0.5;

export default function PhotoBackdrop() {
  const { scrollY } = useScroll();
  const still = useReducedMotion();
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const measure = () => setVh(window.innerHeight);
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  const start = vh * 0.3;
  const end = vh * 1.15;
  const veil = useTransform(scrollY, [start, end], [0, VEIL_MAX]);
  const floor = useTransform(scrollY, [start, end], [0, FLOOR_MAX]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-page">
      <picture>
        <source
          media="(orientation: portrait)"
          type="image/webp"
          srcSet="/assets/hero/city-tall-828.webp 828w, /assets/hero/city-tall-1242.webp 1242w, /assets/hero/city-tall-1860.webp 1860w"
          sizes="100vw"
        />
        <source
          media="(orientation: portrait)"
          srcSet="/assets/hero/city-tall-828.jpg 828w, /assets/hero/city-tall-1242.jpg 1242w, /assets/hero/city-tall-1860.jpg 1860w"
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet="/assets/hero/city-wide-1600.webp 1600w, /assets/hero/city-wide-2560.webp 2560w, /assets/hero/city-wide-3840.webp 3840w"
          sizes="100vw"
        />
        <img
          src="/assets/hero/city-wide-1600.jpg"
          srcSet="/assets/hero/city-wide-1600.jpg 1600w, /assets/hero/city-wide-2560.jpg 2560w, /assets/hero/city-wide-3840.jpg 3840w"
          sizes="100vw"
          width={2560}
          height={1440}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <motion.div
        className="absolute inset-0 bg-page"
        style={{ opacity: still ? VEIL_MAX : veil }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: still ? FLOOR_MAX : floor,
          background: "linear-gradient(to bottom, transparent 30%, #e6e6e6 100%)",
        }}
      />
    </div>
  );
}
