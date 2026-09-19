"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CHAIN_TIMELINE, OrganicNeural, type ChainHub } from "@/lib/neural/organic";
import { devicePerformanceTier, prefersReducedMotionNow } from "@/lib/hooks";
import { patterns } from "@/content/patterns";
import { parseEmphasis } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Pozice uzlů řetězce (relativně k ploše). Poslední = „Nová cesta“. */
const HUBS_DESKTOP: ChainHub[] = [
  { x: 0.11, y: 0.6 },
  { x: 0.29, y: 0.41 },
  { x: 0.47, y: 0.62 },
  { x: 0.65, y: 0.42 },
  { x: 0.84, y: 0.64 },
  { x: 0.9, y: 0.2 },
];
const HUBS_MOBILE: ChainHub[] = [
  { x: 0.27, y: 0.34 },
  { x: 0.72, y: 0.44 },
  { x: 0.28, y: 0.54 },
  { x: 0.72, y: 0.64 },
  { x: 0.3, y: 0.78 },
  { x: 0.76, y: 0.9 },
];

const Emph = ({ text, italic }: { text: string; italic: string }) => (
  <>
    {parseEmphasis(text).map((seg, i) =>
      seg.italic ? (
        <em key={i} className={cn("serif-italic", italic)}>
          {seg.text}
        </em>
      ) : (
        <span key={i}>{seg.text}</span>
      ),
    )}
  </>
);

/**
 * 04 NEURONOVÁ EXPERIENCE – vizuální vrchol webu (jediná tmavá sekce).
 * Připnutá scéna: při scrollování se aktivují uzly PODNĚT → MYŠLENKA → EMOCE
 * → REAKCE → VZOREC, vzorec se uzavře smyčkou, smyčka se rozpadne a z REAKCE
 * vyroste nová, zlatá cesta.
 */
export function Patterns() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<OrganicNeural | null>(null);
  const [layout, setLayout] = useState<"desktop" | "mobile">("desktop");
  const hubs = layout === "mobile" ? HUBS_MOBILE : HUBS_DESKTOP;
  const labels = [...patterns.nodes, patterns.newNode];

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setLayout(mql.matches ? "mobile" : "desktop");
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = prefersReducedMotionNow();
    const tier = devicePerformanceTier();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const mobile = layout === "mobile";
    const engine = new OrganicNeural(canvas, {
      seed: 909,
      theme: "dark",
      layout: "chain",
      chainHubs: mobile ? HUBS_MOBILE : HUBS_DESKTOP,
      chainLoopEnd: 4,
      chainNewFrom: 3,
      chainNewTo: 5,
      chainLoopCurv: -0.3,
      interactive: fine,
      maxFps: tier === "low" ? 30 : 60,
      dprCap: mobile ? 1 : 1.5,
      staticFrame: reduced,
      initial: { alpha: 1, density: 1, violet: 0.55, speed: 0.5, pulseRate: 1.4, rewire: 0, glow: 0.9, biasX: 0, biasY: 0 },
    });
    engineRef.current = engine;
    if (reduced) engine.setChainProgress(1);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) engine.start();
        else engine.stop();
      },
      { threshold: 0.02 },
    );
    io.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      engine.setPointer(e.clientX - rect.left, e.clientY - rect.top);
    };
    const onPointerLeave = () => engine.setPointer(null);
    if (fine && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => engine.resize(), 160);
    });
    ro.observe(canvas);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      io.disconnect();
      ro.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [layout]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const head = el.querySelector<HTMLElement>(".patterns-head");
      const closing = el.querySelector<HTMLElement>(".patterns-closing");
      const hint = el.querySelector<HTMLElement>(".patterns-hint");
      const labelEls = el.querySelectorAll<HTMLElement>(".patterns-label");

      const applyLabels = (p: number) => {
        labelEls.forEach((lab, i) => {
          const isNew = i === labelEls.length - 1;
          const at = isNew ? CHAIN_TIMELINE.newHubAt : CHAIN_TIMELINE.hubAt(i);
          lab.classList.toggle("is-on", p >= at - 0.01);
          if (i === labelEls.length - 2) lab.classList.toggle("is-dim", p > CHAIN_TIMELINE.newPath[1] - 0.05);
        });
      };

      if (prefersReducedMotionNow()) {
        applyLabels(1);
        gsap.set([head, closing], { opacity: 1, y: 0 });
        gsap.set(hint, { opacity: 0 });
        return;
      }

      gsap.set(closing, { opacity: 0, y: 14 });
      applyLabels(0);

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          engineRef.current?.setChainProgress(p);
          applyLabels(p);
          const mobile = layout === "mobile";
          const fade = gsap.utils.clamp(0, 1, (p - 0.12) / 0.16);
          const headOut = mobile ? gsap.utils.clamp(0, 1, (p - 0.86) / 0.06) : 0;
          if (head) head.style.opacity = String((1 - 0.5 * fade) * (1 - headOut));
          const c = gsap.utils.clamp(0, 1, (p - 0.9) / 0.08);
          if (closing) {
            closing.style.opacity = String(c);
            closing.style.transform = `translateY(${(1 - c) * 14}px)`;
          }
          if (hint) hint.style.opacity = String(1 - gsap.utils.clamp(0, 1, p / 0.06));
        },
      });
    },
    { scope: ref, dependencies: [layout] },
  );

  return (
    <section
      ref={ref}
      id="vzorce"
      data-neural="hidden"
      className="relative h-[100svh] overflow-hidden bg-night-950 text-paper-50"
      aria-label="Jak vzniká vzorec – podnět, myšlenka, emoce, reakce, vzorec – a nová cesta"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_50%,rgba(125,117,196,0.16),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(40%_35%_at_85%_20%,rgba(201,178,131,0.14),transparent_70%)]"
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

      {labels.map((label, i) => (
        <div
          key={label}
          aria-hidden="true"
          className={cn("patterns-label", i === labels.length - 1 && "patterns-label-new")}
          style={{ left: `${hubs[i].x * 100}%`, top: `${hubs[i].y * 100}%` }}
        >
          <span className="t-label">{label}</span>
        </div>
      ))}

      <div className="patterns-head page-container absolute inset-x-0 top-[calc(var(--nav-height)+0.75rem)] lg:top-[calc(var(--nav-height)+2rem)]">
        <p className="t-label flex items-center gap-3 text-gold-300">
          <span className="node bg-gold-300" aria-hidden="true" />
          {patterns.label}
        </p>
        <h2 className="t-h3 mt-4 max-w-[22ch] text-paper-50 md:t-h2 lg:mt-5">
          <Emph text={patterns.headline} italic="text-gold-300" />
        </h2>
      </div>

      <div className="patterns-closing page-container absolute inset-x-0 top-[calc(var(--nav-height)+0.75rem)] md:top-auto md:bottom-12 lg:bottom-16">
        <p className="t-quote max-w-[18ch] text-paper-50">
          <Emph text={patterns.closing} italic="text-gold-300" />
        </p>
      </div>

      <p className="patterns-hint t-label absolute bottom-[calc(var(--sticky-cta-height)+0.75rem)] left-1/2 -translate-x-1/2 whitespace-nowrap text-paper-400/70 lg:bottom-5">
        {patterns.hint}
      </p>
    </section>
  );
}
