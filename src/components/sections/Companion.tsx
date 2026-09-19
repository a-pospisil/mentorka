"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { companion } from "@/content/companion";
import { contactHref } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";

/**
 * „Když už nemůžete dál“ – text se odkrývá po slovech v tempu scrollu.
 * Bez agresivního CTA.
 */
export function Companion() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const words = el.querySelectorAll<HTMLElement>(".companion-word");
      if (prefersReducedMotionNow()) {
        gsap.set(words, { opacity: 1 });
        return;
      }
      gsap.set(words, { opacity: 0.12 });
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".companion-text",
          start: "top 75%",
          end: "bottom 45%",
          scrub: 0.4,
        },
      });
    },
    { scope: ref },
  );

  const words = companion.headline.split(" ");

  return (
    <section
      ref={ref}
      id="doprovazeni"
      data-neural="companion"
      className="relative flex min-h-[100svh] items-center"
    >
      <div className="page-container py-28 lg:py-40">
        <p className="companion-text t-h1 max-w-[20ch] text-bone-50" aria-label={companion.headline}>
          {words.map((w, i) => (
            <span key={i} aria-hidden="true">
              <span className="companion-word inline-block">{w}</span>
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <Reveal as="p" delay={0.1} className="t-body mt-12 max-w-[46ch] text-bone-300 lg:ml-[41.666%]">
          {companion.text}
        </Reveal>
        <Reveal className="mt-14 flex flex-col gap-6 lg:ml-[41.666%]" delay={0.2}>
          <p className="serif-italic text-2xl text-gold-300 sm:text-3xl">{companion.quiet}</p>
          <MagneticButton href={contactHref()} className="btn btn-ghost w-fit">
            {companion.cta}
            <Arrow />
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
