"use client";

import { useSyncExternalStore } from "react";

const subscribeMedia = (query: string) => (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

/** Bezpečný media-query hook (SSR vrací `false`). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

/** Heuristika výkonu zařízení – používá se pro počet uzlů a FPS. */
export function devicePerformanceTier(): "low" | "mid" | "high" {
  if (typeof navigator === "undefined") return "mid";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse && (cores <= 4 || memory <= 3)) return "low";
  if (cores <= 4 || memory <= 4) return "mid";
  return "high";
}

export const prefersReducedMotionNow = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
