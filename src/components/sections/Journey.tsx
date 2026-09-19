"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { credentials, journey, journeyIntro } from "@/content/journey";
import { isTodo } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * „Moje cesta“ – vertikální timeline integrovaná do neuronového motivu:
 * linie se kreslí podle scrollu, po ní putuje světelný impulz a uzly se
 * postupně rozsvěcují.
 */
export function Journey() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const list = el.querySelector<HTMLElement>(".journey-list");
      const line = el.querySelector<HTMLElement>(".journey-line-fill");
      const pulse = el.querySelector<HTMLElement>(".journey-pulse");
      const nodes = el.querySelectorAll<HTMLElement>(".journey-node");
      if (!list || !line || !pulse) return;

      const setProgress = (p: number) => {
        line.style.transform = `scaleY(${p})`;
        pulse.style.top = `${p * 100}%`;
        pulse.style.opacity = p > 0.01 && p < 0.995 ? "1" : "0";
      };

      if (prefersReducedMotionNow()) {
        setProgress(1);
        nodes.forEach((n) => n.classList.add("is-lit"));
        return;
      }

      gsap.to(
        { p: 0 },
        {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: list,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.5,
            onUpdate: (self) => setProgress(self.progress),
          },
        },
      );

      nodes.forEach((node) => {
        ScrollTriggerLit(node);
      });
    },
    { scope: ref },
  );

  const hasCredentials = credentials.length > 0;

  return (
    <section ref={ref} id="cesta" data-neural="journey" className="relative">
      <div className="page-container section-space">
        <SectionHeading
          index="05"
          label={journeyIntro.label}
          headline={journeyIntro.headline}
          lead={journeyIntro.lead}
        />

        <div className="journey-list relative mt-20 lg:mt-32">
          {/* Osa */}
          <div className="absolute bottom-0 left-[0.6rem] top-0 w-px bg-bone-100/10 lg:left-1/2 lg:-translate-x-1/2" />
          <div
            className="journey-line-fill absolute bottom-0 left-[0.6rem] top-0 w-px origin-top bg-gradient-to-b from-gold-500 via-gold-300 to-synapse-300 lg:left-1/2 lg:-translate-x-1/2"
            style={{ transform: "scaleY(0)" }}
          />
          <span
            aria-hidden="true"
            className="journey-pulse absolute left-[0.6rem] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone-50 opacity-0 shadow-[0_0_26px_7px_rgba(179,176,220,0.45)] lg:left-1/2"
            style={{ top: 0 }}
          />

          <ol className="flex flex-col gap-14 lg:gap-24">
            {journey.map((step, i) => {
              const left = i % 2 === 0;
              return (
                <li
                  key={step.id}
                  className={cn(
                    "relative pl-10 lg:grid lg:grid-cols-2 lg:gap-24 lg:pl-0",
                  )}
                >
                  <span
                    className="journey-node absolute left-[0.6rem] top-2 -translate-x-1/2 lg:left-1/2 lg:top-3"
                    aria-hidden="true"
                  >
                    <span className="journey-node-dot" />
                  </span>
                  <Reveal
                    className={cn(
                      "lg:max-w-[30rem]",
                      left ? "lg:col-start-1 lg:justify-self-end lg:pr-8 lg:text-right" : "lg:col-start-2 lg:pl-8",
                    )}
                  >
                    {step.when ? (
                      <p className="t-label text-gold-400">{step.when}</p>
                    ) : (
                      <p className="t-label text-bone-600">0{i + 1}</p>
                    )}
                    <h3 className="mt-4 font-serif text-3xl font-light text-bone-50 lg:text-4xl">
                      {step.title}
                    </h3>
                    <p className="t-body mt-4 text-bone-300">{step.text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        {hasCredentials ? (
          <Reveal className="mt-24 grid gap-8 border-t hairline pt-10 lg:mt-36 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="t-label flex items-center gap-3 text-gold-400">
                <span className="node" aria-hidden="true" />
                Vzdělání a výcviky
              </p>
            </div>
            <ul className="flex flex-col gap-4 lg:col-span-8">
              {credentials.map((item) => (
                <li key={item} className="t-body flex items-start gap-4 text-bone-300">
                  <span aria-hidden="true" className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  {isTodo(item) ? <span className="todo">{item}</span> : item}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>

      <style>{`
        .journey-node-dot{display:block;width:11px;height:11px;border-radius:999px;background:#0f0f12;border:1px solid rgba(247,243,237,0.28);transition:background .7s,box-shadow .9s,border-color .7s}
        .journey-node.is-lit .journey-node-dot{background:#dccaa3;border-color:#dccaa3;box-shadow:0 0 20px 5px rgba(201,180,138,.32)}
      `}</style>
    </section>
  );
}

function ScrollTriggerLit(node: HTMLElement) {
  gsap.timeline({
    scrollTrigger: {
      trigger: node,
      start: "top 65%",
      onEnter: () => node.classList.add("is-lit"),
      onLeaveBack: () => node.classList.remove("is-lit"),
    },
  });
}
