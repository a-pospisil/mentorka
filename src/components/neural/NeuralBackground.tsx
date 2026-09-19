"use client";

import { useEffect, useRef } from "react";
import { NeuralEngine } from "@/lib/neural/engine";
import { isNeuralPreset, neuralPresets, type NeuralPresetName } from "@/lib/neural/presets";
import { ScrollTrigger } from "@/lib/gsap";
import { devicePerformanceTier, prefersReducedMotionNow } from "@/lib/hooks";
import { APP_READY_EVENT } from "@/components/ui/Preloader";

/**
 * Globální neuronová síť na pozadí celého webu.
 * Sekce označené atributem data-neural="<preset>" mění cílový stav sítě
 * při scrollování – síť tak vizuálně propojuje celý příběh.
 */
export function NeuralBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced = prefersReducedMotionNow();
    const tier = devicePerformanceTier();
    const width = window.innerWidth;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mobile = width < 768;

    const count =
      tier === "low"
        ? 38
        : tier === "mid"
          ? mobile
            ? 52
            : 92
          : mobile
            ? 60
            : width < 1280
              ? 110
              : 150;

    const engine = new NeuralEngine(canvas, {
      count,
      distribution: "uniform",
      interactive: fine,
      maxFps: tier === "low" ? 30 : mobile ? 40 : 60,
      dprCap: mobile ? 1 : 1.5,
      parallax: 0.12,
      lerpRate: 1.4,
      staticFrame: reduced,
      initial: reduced ? neuralPresets.hero : neuralPresets.dormant,
      seed: 2024,
    });

    let lastPreset: NeuralPresetName | null = null;
    let ready = reduced;

    const apply = (name: NeuralPresetName) => {
      lastPreset = name;
      if (ready) engine.setTarget(neuralPresets[name]);
    };

    const wake = () => {
      if (ready) return;
      ready = true;
      engine.setTarget(neuralPresets[lastPreset ?? "hero"]);
    };
    window.addEventListener(APP_READY_EVENT, wake, { once: true });
    const wakeFallback = window.setTimeout(wake, 3000);

    engine.start();

    // Stavy podle sekcí
    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>("[data-neural]").forEach((el) => {
      const name = el.dataset.neural;
      if (!name || !isNeuralPreset(name)) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 38%",
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

    // Scroll (paralaxa)
    const onScroll = () => engine.setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Resize
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => engine.resize(), 150);
    };
    window.addEventListener("resize", onResize);

    // Viditelnost záložky
    const onVisibility = () => {
      if (document.hidden) engine.stop();
      else engine.start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(wakeFallback);
      window.clearTimeout(resizeTimer);
      window.removeEventListener(APP_READY_EVENT, wake);
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
