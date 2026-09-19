"use client";

import { useEffect, useRef } from "react";
import { OrganicNeural } from "@/lib/neural/organic";
import { isNeuralPreset, neuralPresets, type NeuralPresetName } from "@/lib/neural/presets";
import { ScrollTrigger } from "@/lib/gsap";
import { devicePerformanceTier, prefersReducedMotionNow } from "@/lib/hooks";

/**
 * Globální organická neuronová struktura na pozadí celého webu.
 * Sekce označené data-neural="<preset>" mění při scrollování její stav
 * (hustota, jas, přestavba spojů, posun). Rychlost scrollu vysílá impulzy.
 */
export function NeuralBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced = prefersReducedMotionNow();
    const tier = devicePerformanceTier();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mobile = window.innerWidth < 768;

    const engine = new OrganicNeural(canvas, {
      seed: 2026,
      theme: "light",
      layout: "field",
      somas: tier === "low" ? 3 : mobile ? 4 : 0,
      scale: mobile ? 0.2 : 0.17,
      maxDepth: tier === "low" ? 4 : 5,
      interactive: fine,
      maxFps: tier === "low" ? 30 : mobile ? 40 : 60,
      dprCap: mobile ? 1 : 1.5,
      staticFrame: reduced,
      initial: reduced ? neuralPresets.hero : neuralPresets.dormant,
    });

    let current: NeuralPresetName = "hero";
    const apply = (name: NeuralPresetName) => {
      current = name;
      engine.setTarget(neuralPresets[name]);
    };
    // Probuzení po prvním vykreslení stránky
    const wake = window.setTimeout(() => apply(current), 250);
    engine.start();

    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>("[data-neural]").forEach((el) => {
      const name = el.dataset.neural;
      if (!name || !isNeuralPreset(name)) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => apply(name),
          onEnterBack: () => apply(name),
        }),
      );
    });

    // Kurzor
    const onPointerMove = (e: PointerEvent) => engine.setPointer(e.clientX, e.clientY);
    const onPointerLeave = () => engine.setPointer(null);
    if (fine && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    // Scroll → impulzy (podle rychlosti)
    let lastY = window.scrollY;
    let lastT = performance.now();
    let budget = 0;
    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY);
      const dt = Math.max(16, now - lastT);
      lastY = window.scrollY;
      lastT = now;
      budget += (dy / dt) * 0.9;
      if (budget >= 1) {
        const n = Math.min(4, Math.floor(budget));
        budget -= n;
        engine.kick(n);
      }
    };
    if (!reduced) window.addEventListener("scroll", onScroll, { passive: true });

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => engine.resize(), 180);
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) engine.stop();
      else engine.start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(wake);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      triggers.forEach((t) => t.kill());
      engine.destroy();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] w-full"
    />
  );
}
