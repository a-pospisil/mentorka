"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Vlastní kurzor: malý zlatý bod + jemný prstenec.
 * Pouze pro zařízení s jemným ukazovátkem a bez reduced-motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.body.classList.add("has-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.4 });
      }
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        "a, button, [data-cursor]",
      );
      if (target) {
        gsap.to(ring, { scale: 1.9, opacity: 0.9, duration: 0.5, ease: "power3.out" });
        gsap.to(dot, { scale: 0.5, duration: 0.4 });
      } else {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" });
        gsap.to(dot, { scale: 1, duration: 0.4 });
      }
    };
    const onLeave = () => {
      shown = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(ring, { scale: 0.75, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.4, ease: "power3.out" });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 rounded-full bg-gold-300 opacity-0 mix-blend-screen"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] h-9 w-9 rounded-full border border-gold-400/50 opacity-0"
      />
    </>
  );
}
