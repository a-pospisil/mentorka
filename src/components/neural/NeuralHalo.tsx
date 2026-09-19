"use client";

import { useEffect, useRef } from "react";
import { OrganicNeural, type VoidArea } from "@/lib/neural/organic";
import { neuralPresets, type NeuralState } from "@/lib/neural/presets";
import { devicePerformanceTier, prefersReducedMotionNow } from "@/lib/hooks";

interface NeuralHaloProps {
  className?: string;
  seed?: number;
  /** Prázdná oblast (portrét) relativně k canvasu. */
  void?: VoidArea;
  somas?: number;
  scale?: number;
  haloRx?: number;
  haloRy?: number;
  state?: Partial<NeuralState>;
  /** Zpoždění probuzení v ms. */
  delay?: number;
}

/**
 * Organická síť kolem portrétu: neurony leží na elipse kolem fotografie,
 * dendrity se k ní stahují a končí na jejím okraji. Běží jen, když je vidět.
 */
export function NeuralHalo({
  className = "",
  seed = 41,
  void: voidArea = { x: 0.5, y: 0.5, rx: 0.25, ry: 0.31 },
  somas = 8,
  scale = 0.15,
  haloRx = 0.31,
  haloRy = 0.37,
  state,
  delay = 300,
}: NeuralHaloProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = prefersReducedMotionNow();
    const tier = devicePerformanceTier();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mobile = window.innerWidth < 768;
    const awake: NeuralState = {
      ...neuralPresets.hero,
      alpha: 1,
      density: 0.88,
      pulseRate: 1.3,
      glow: 0.85,
      rewire: 0.06,
      biasX: 0,
      biasY: 0,
      ...state,
    };

    const engine = new OrganicNeural(canvas, {
      seed,
      theme: "light",
      layout: "halo",
      somas: tier === "low" ? Math.max(4, somas - 3) : mobile ? Math.max(5, somas - 2) : somas,
      scale,
      maxDepth: tier === "low" ? 4 : 5,
      interactive: fine,
      maxFps: tier === "low" ? 30 : 60,
      dprCap: mobile ? 1 : 1.5,
      staticFrame: reduced,
      initial: reduced ? awake : neuralPresets.dormant,
      void: voidArea,
      haloRx,
      haloRy,
      inkBoost: 1.35,
    });

    const wakeTimer = window.setTimeout(() => engine.setTarget(awake), delay);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      engine.setPointer(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onPointerLeave = () => engine.setPointer(null);
    if (fine && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) engine.start();
        else engine.stop();
      },
      { threshold: 0.02 },
    );
    io.observe(canvas);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => engine.resize(), 160);
    });
    ro.observe(canvas);

    return () => {
      window.clearTimeout(wakeTimer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      io.disconnect();
      ro.disconnect();
      engine.destroy();
    };
    // Parametry se během života komponenty nemění.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Canvas je „replaced element“ – přes inset se neroztáhne, proto obal.
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
