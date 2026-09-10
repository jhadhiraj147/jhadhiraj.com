"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* One sound, on press only. A soft damped wooden knock, synthesised rather than
   loaded, mixed low enough to sit just at the edge of hearing.

   Hover sound was removed deliberately: pointerover never grants user activation
   in any browser, so it could not be made to work before the first click. */

type Ctx = { enabled: boolean; toggle: () => void };
const SoundCtx = createContext<Ctx>({ enabled: false, toggle: () => {} });
export const useSound = () => useContext(SoundCtx);

const STORE_KEY = "dj:sound";
const TARGETS = 'a[href], button, [role="button"], summary';

/* Master trim. The individual voice peaks below are already small; this is the
   single dial for "a little quieter" or "a little louder". */
const MASTER = 0.5;
/* Never schedule at exactly currentTime: on a freshly opened device the clock has
   not started advancing and the envelope would land in the past and be dropped. */
const LOOKAHEAD = 0.005;

export default function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);

  const acRef = useRef<AudioContext | null>(null);
  const busRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const warmedRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved !== null) {
        setEnabled(saved === "1");
        enabledRef.current = saved === "1";
      }
    } catch {
      /* private mode, keep the default */
    }
  }, []);

  const build = useCallback((): AudioContext | null => {
    if (acRef.current) return acRef.current;
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;

    const ac = new AC({ latencyHint: "interactive" });
    const bus = ac.createGain();
    bus.gain.value = MASTER;
    const lp = ac.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 6500;
    lp.Q.value = 0.5;
    bus.connect(lp);
    lp.connect(ac.destination);

    // short white-noise buffer reused for the attack transient
    const len = Math.floor(ac.sampleRate * 0.05);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    acRef.current = ac;
    busRef.current = bus;
    noiseRef.current = buf;
    return ac;
  }, []);

  const knock = useCallback(() => {
    const ac = acRef.current;
    const bus = busRef.current;
    if (!ac || !bus || ac.state !== "running") return;
    const t = ac.currentTime + LOOKAHEAD;

    // body: a low triangle easing downward, the part you actually feel
    const bodyEnv = ac.createGain();
    bodyEnv.gain.setValueAtTime(0.0001, t);
    bodyEnv.gain.exponentialRampToValueAtTime(0.02, t + 0.005);
    bodyEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    bodyEnv.connect(bus);
    const body = ac.createOscillator();
    body.type = "triangle";
    body.frequency.setValueAtTime(420, t);
    body.frequency.exponentialRampToValueAtTime(300, t + 0.16);
    body.connect(bodyEnv);
    body.start(t);
    body.stop(t + 0.2);

    // overtone: gives it wood rather than rubber
    const airEnv = ac.createGain();
    airEnv.gain.setValueAtTime(0.0001, t);
    airEnv.gain.exponentialRampToValueAtTime(0.007, t + 0.004);
    airEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    airEnv.connect(bus);
    const air = ac.createOscillator();
    air.type = "sine";
    air.frequency.setValueAtTime(840, t);
    air.connect(airEnv);
    air.start(t);
    air.stop(t + 0.12);

    // transient: 6ms of band-limited noise, the contact itself
    if (noiseRef.current) {
      const src = ac.createBufferSource();
      src.buffer = noiseRef.current;
      const bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2600;
      bp.Q.value = 1.1;
      const nEnv = ac.createGain();
      nEnv.gain.setValueAtTime(0.006, t);
      nEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.006);
      src.connect(bp);
      bp.connect(nEnv);
      nEnv.connect(bus);
      src.start(t);
      src.stop(t + 0.05);
    }
  }, []);

  /* Resume is idempotent and safe to call on every gesture. Playing is chained off
     it so the very first press is audible rather than swallowed mid-transition. */
  const wake = useCallback(
    (then?: () => void) => {
      const ac = build();
      if (!ac) return;
      if (ac.state === "running") {
        then?.();
        return;
      }
      ac.resume().then(
        () => {
          if (!warmedRef.current && noiseRef.current) {
            warmedRef.current = true; // open the output device before the first real voice
            const s = ac.createBufferSource();
            const g = ac.createGain();
            g.gain.value = 0;
            s.buffer = noiseRef.current;
            s.connect(g);
            g.connect(ac.destination);
            s.start();
            s.stop(ac.currentTime + 0.01);
          }
          then?.();
        },
        () => {
          /* no user activation yet; the next gesture gets another go */
        }
      );
    },
    [build]
  );

  useEffect(() => {
    build(); // construct suspended at mount, so no device work happens inside the click

    const onDown = (e: PointerEvent) => {
      wake(); // every gesture is another chance to unlock, never once-only
      if (!enabledRef.current) return;
      const el = (e.target as Element | null)?.closest?.(TARGETS);
      if (!el) return;
      if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") return;
      wake(knock);
    };
    const onKey = () => wake();
    const onVisible = () => {
      if (document.visibilityState === "visible") wake();
    };

    document.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("keydown", onKey, { passive: true });
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [build, wake, knock]);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      enabledRef.current = next;
      try {
        localStorage.setItem(STORE_KEY, next ? "1" : "0");
      } catch {
        /* nothing to persist to */
      }
      if (next) wake(knock);
      return next;
    });
  }, [wake, knock]);

  return <SoundCtx.Provider value={{ enabled, toggle }}>{children}</SoundCtx.Provider>;
}
