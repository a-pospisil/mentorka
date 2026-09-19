"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { site } from "@/config/site";

export const APP_READY_EVENT = "app:ready";
const SESSION_KEY = "vp-intro-seen";

const emitReady = () => {
  document.documentElement.classList.add("is-ready");
  window.dispatchEvent(new Event(APP_READY_EVENT));
};

/**
 * Krátký úvod: jméno a rozsvěcující se linie, poté odkrytí stránky.
 * Zobrazí se jen jednou za relaci; při reduced motion se přeskočí.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }

    if (!el || seen || prefersReducedMotionNow()) {
      setVisible(false);
      const t = window.setTimeout(emitReady, 60);
      return () => window.clearTimeout(t);
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }

    document.documentElement.classList.add("is-loading");
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("is-loading");
        setVisible(false);
      },
    });
    tl.fromTo(
      ".preloader-name",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      0.1,
    )
      .fromTo(
        ".preloader-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
        0.2,
      )
      .fromTo(
        ".preloader-node",
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: "power2.out" },
        0.5,
      )
      .add(emitReady, 1.35)
      .to(
        ".preloader-inner",
        { opacity: 0, y: -10, duration: 0.5, ease: "power2.in" },
        1.3,
      )
      .to(
        el,
        { yPercent: -100, duration: 1.1, ease: "expo.inOut" },
        1.45,
      );

    return () => {
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-ink-950"
    >
      <div className="preloader-inner flex flex-col items-center gap-6">
        <p className="preloader-name font-serif text-2xl font-light tracking-wide text-bone-100 opacity-0 sm:text-3xl">
          {site.name}
        </p>
        <div className="relative h-px w-40 sm:w-56">
          <span className="preloader-line absolute inset-0 origin-left scale-x-0 bg-gold-400/70" />
          {[0, 0.5, 1].map((p) => (
            <span
              key={p}
              className="preloader-node absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300 opacity-0"
              style={{ left: `${p * 100}%` }}
            />
          ))}
        </div>
      </div>
      <noscript>
        <style>{`.preloader{display:none!important}`}</style>
      </noscript>
    </div>
  );
}
