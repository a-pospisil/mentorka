"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";

let lenisInstance: Lenis | null = null;

export const getLenis = () => lenisInstance;

/** Plynulý scroll na cíl (kotva nebo element). Bez Lenis použije nativní scroll. */
export function scrollToTarget(target: string | HTMLElement, offset = -48) {
  const el =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, {
      offset,
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  el.scrollIntoView({ behavior: prefersReducedMotionNow() ? "auto" : "smooth" });
}

/**
 * Lenis smooth scrolling propojený s GSAP ScrollTriggerem.
 * – při prefers-reduced-motion se používá nativní scroll
 * – kotvy (#sekce) se odchytávají globálně a scrollují plynule
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = prefersReducedMotionNow();

    if (!reduced) {
      const lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 0.95,
        smoothWheel: true,
        anchors: false,
      });
      lenisInstance = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisInstance = null;
      };
    }
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      event.preventDefault();
      scrollToTarget(el);
      window.history.pushState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <>{children}</>;
}
