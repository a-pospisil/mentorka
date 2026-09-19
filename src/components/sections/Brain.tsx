"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { brainFacts, brainIntro, brainSteps } from "@/content/brain";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * „Mozek není statický.“ – neuroplasticita.
 * Diagram podnět → myšlenka → emoce → reakce → nový vzorec:
 * impulz putuje po dráze podle scrollu, uzly se postupně rozsvěcují,
 * starý vzorec (smyčka zpět) zůstává slabý, nová dráha svítí zlatě.
 */
export function Brain() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const diagram = el.querySelector<HTMLElement>(".brain-diagram");
      if (!diagram) return;
      const nodes = diagram.querySelectorAll<HTMLElement>(".brain-node");
      const loop = diagram.querySelector<SVGPathElement>(".brain-loop");

      const setProgress = (p: number) => {
        diagram.style.setProperty("--p", p.toFixed(4));
        nodes.forEach((node, i) => {
          const threshold = i / (nodes.length - 1) - 0.02;
          node.classList.toggle("is-lit", p >= threshold);
          node.classList.toggle("is-current", p >= threshold && p < threshold + 0.25);
        });
        if (loop) {
          const lp = gsap.utils.clamp(0, 1, (p - 0.72) / 0.2);
          loop.style.strokeDashoffset = String(1 - lp);
          loop.style.opacity = String(0.55 * lp);
        }
      };

      if (prefersReducedMotionNow()) {
        setProgress(1);
        return;
      }

      setProgress(0);
      ScrollTriggerProgress(diagram, setProgress);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="mozek" data-neural="brain" className="relative">
      <div className="page-container section-space">
        <SectionHeading
          index="02"
          label={brainIntro.label}
          headline={brainIntro.headline}
          lead={brainIntro.lead}
          headlineClass="t-h1"
        />

        {/* Diagram */}
        <div
          className="brain-diagram relative mt-20 lg:mt-32"
          style={{ ["--p" as string]: 0 }}
          aria-label="Podnět, myšlenka, emoce, reakce, nový vzorec"
          role="img"
        >
          {/* Desktop: horizontální dráha */}
          <div className="relative hidden lg:block">
            <div className="relative h-24">
              <div className="absolute left-[10%] right-[10%] top-1/2 h-px -translate-y-1/2 bg-bone-100/10" />
              <div
                className="absolute left-[10%] right-[10%] top-1/2 h-px origin-left -translate-y-1/2 bg-gradient-to-r from-gold-500 via-gold-300 to-synapse-300"
                style={{ transform: "translateY(-50%) scaleX(var(--p))" }}
              />
              {/* Smyčka starého vzorce: reakce → podnět */}
              <svg
                className="absolute left-[10%] top-1/2 h-24 w-[60%]"
                viewBox="0 0 600 96"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  className="brain-loop"
                  d="M600 0 C600 92, 0 92, 0 0"
                  fill="none"
                  stroke="rgba(183,169,146,0.6)"
                  strokeWidth="1"
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  pathLength={1}
                  style={{ opacity: 0 }}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span className="pointer-events-none absolute left-[40%] top-[calc(50%+3.4rem)] -translate-x-1/2 text-[0.62rem] uppercase tracking-[0.22em] text-bone-600">
                starý vzorec
              </span>
              {/* Impulz */}
              <span
                aria-hidden="true"
                className="brain-pulse absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone-50 shadow-[0_0_24px_6px_rgba(179,176,220,0.45)]"
                style={{ left: "calc(10% + var(--p) * 80%)", opacity: "calc(0.15 + var(--p) * 0.85)" }}
              />
              {brainSteps.map((step, i) => (
                <span
                  key={step.id}
                  className={cn("brain-node absolute top-1/2 -translate-x-1/2 -translate-y-1/2", i === 4 && "is-new")}
                  style={{ left: `${10 + i * 20}%` }}
                >
                  <span className="brain-node-dot" />
                </span>
              ))}
            </div>
            <ol className="grid grid-cols-5 gap-6">
              {brainSteps.map((step, i) => (
                <li key={step.id} className="px-2 text-center">
                  <p className="t-label text-bone-500">0{i + 1}</p>
                  <h3
                    className={cn(
                      "mt-3 font-serif text-2xl font-light",
                      i === 4 ? "text-gold-300" : "text-bone-50",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="t-small mt-3 text-bone-400">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Mobil / tablet: vertikální dráha */}
          <ol className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 lg:hidden">
            <div className="absolute bottom-6 left-[1.25rem] top-2 w-px -translate-x-1/2 bg-bone-100/10" />
            <div
              className="absolute bottom-6 left-[1.25rem] top-2 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-gold-500 via-gold-300 to-synapse-300"
              style={{ transform: "translateX(-50%) scaleY(var(--p))" }}
            />
            <span
              aria-hidden="true"
              className="brain-pulse absolute left-[1.25rem] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone-50 shadow-[0_0_24px_6px_rgba(179,176,220,0.45)]"
              style={{ top: "calc(0.5rem + var(--p) * (100% - 2rem))", opacity: "calc(0.15 + var(--p) * 0.85)" }}
            />
            {brainSteps.map((step, i) => (
              <li key={step.id} className="contents">
                <div className="relative pt-2">
                  <span className={cn("brain-node absolute left-1/2 top-3 -translate-x-1/2", i === 4 && "is-new")}>
                    <span className="brain-node-dot" />
                  </span>
                </div>
                <div className="pb-10">
                  <p className="t-label text-bone-500">0{i + 1}</p>
                  <h3
                    className={cn(
                      "mt-2 font-serif text-2xl font-light",
                      i === 4 ? "text-gold-300" : "text-bone-50",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="t-small mt-2 max-w-[44ch] text-bone-400">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Vysvětlení */}
        <div className="mt-24 grid gap-px border hairline bg-bone-100/5 lg:mt-36 lg:grid-cols-3">
          {brainFacts.map((fact, i) => (
            <Reveal
              key={fact.id}
              delay={i * 0.06}
              className={cn(
                "group relative bg-ink-950/70 p-8 backdrop-blur-sm lg:p-10",
                i === brainFacts.length - 1 && "lg:col-span-2",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="node transition-shadow duration-700 group-hover:shadow-[0_0_16px_4px_rgba(201,180,138,0.35)]" />
                <span className="t-label text-bone-500">{fact.index}</span>
              </div>
              <h3 className="mt-6 font-serif text-2xl font-light text-bone-50 lg:text-[1.75rem]">
                {fact.title}
              </h3>
              <p className="t-body mt-4 max-w-[52ch] text-bone-300">{fact.text}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .brain-node-dot{display:block;width:12px;height:12px;border-radius:999px;background:rgba(247,243,237,0.18);border:1px solid rgba(247,243,237,0.25);transition:background .6s,box-shadow .8s,border-color .6s,transform .6s}
        .brain-node.is-lit .brain-node-dot{background:#dccaa3;border-color:#dccaa3;box-shadow:0 0 18px 4px rgba(201,180,138,.35)}
        .brain-node.is-new.is-lit .brain-node-dot{background:#f7f3ed;border-color:#f7f3ed;box-shadow:0 0 26px 8px rgba(179,176,220,.5)}
        .brain-node.is-current .brain-node-dot{transform:scale(1.35)}
      `}</style>
    </section>
  );
}

/** Scrub progress diagramu podle scrollu (0 → 1). */
function ScrollTriggerProgress(el: HTMLElement, onUpdate: (p: number) => void) {
  gsap.to(
    { p: 0 },
    {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 78%",
        end: "bottom 55%",
        scrub: 0.6,
        onUpdate: (self) => onUpdate(self.progress),
      },
    },
  );
}
