"use client";

import { useEffect, useRef } from "react";
import { NeuralEngine } from "@/lib/neural/engine";
import { neuralPresets } from "@/lib/neural/presets";
import { devicePerformanceTier, prefersReducedMotionNow } from "@/lib/hooks";
import { APP_READY_EVENT } from "@/components/ui/Preloader";

/**
 * Neuronové „halo“ kolem portrétu v hero sekci.
 * Uzly drží tvar kolem fotografie, reagují na kurzor a při načtení
 * se postupně „probouzejí“ – první spoje se rozsvěcují.
 */
export function HeroNeural({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced = prefersReducedMotionNow();
    const tier = devicePerformanceTier();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mobile = window.innerWidth < 768;
    const count = tier === "low" ? 28 : mobile ? 40 : 72;

    const engine = new NeuralEngine(canvas, {
      count,
      distribution: "halo",
      interactive: fine,
      maxFps: tier === "low" ? 30 : 60,
      dprCap: mobile ? 1 : 1.5,
      lerpRate: 0.9,
      staticFrame: reduced,
      initial: reduced ? neuralPresets.hero : neuralPresets.dormant,
      haloInner: 0.52,
      haloOuter: 0.92,
      haloCenterVoid: 0.7,
      linkDistance: 120,
      seed: 77,
    });

    const wake = () => {
      engine.setTarget({ ...neuralPresets.hero, connectivity: 0.6, brightness: 0.95, pulseRate: 1.6 });
    };
    let wakeTimer = 0;
    const onReady = () => {
      wakeTimer = window.setTimeout(wake, 350);
    };
    window.addEventListener(APP_READY_EVENT, onReady, { once: true });
    const fallback = window.setTimeout(wake, 3200);

    // Kurzor relativně ke canvasu
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      engine.setPointer(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onPointerLeave = () => engine.setPointer(null);
    if (fine && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    // Běží jen, když je hero vidět
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) engine.start();
        else engine.stop();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => engine.resize());
    ro.observe(canvas);

    return () => {
      window.clearTimeout(fallback);
      window.clearTimeout(wakeTimer);
      window.removeEventListener(APP_READY_EVENT, onReady);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      io.disconnect();
      ro.disconnect();
      engine.destroy();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
    />
  );
}
