"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { storyIntro, storyOutro, storySteps } from "@/content/story";
import { cinematicPhoto, photoAlt, storyPortrait } from "@/content/photos";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";

/**
 * 03 PŘÍBĚH – ZTRÁTA → HLEDÁNÍ → POCHOPENÍ → NOVÝ SMĚR → POMOC DRUHÝM.
 * Jedna velká fotografie (sticky), krátké kroky, dendritová osa.
 * Každý krok mění stav globální sítě (rozpad → přestavba → propojení).
 * Na konci jedna cinematic fotografie – nový směr.
 */
export function Story() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>(".story-step").forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });
      if (prefersReducedMotionNow()) return;

      gsap.fromTo(
        ".story-cine-img",
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: ".story-cine", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        ".story-cine-mask",
        { clipPath: "inset(10% 4% 10% 4% round 2rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          ease: "none",
          scrollTrigger: { trigger: ".story-cine", start: "top 85%", end: "top 15%", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="pribeh" className="relative">
      <div className="page-container section-space">
        <SectionHeading
          label={storyIntro.label}
          headline={storyIntro.headline}
          lead={storyIntro.lead}
          headlineClass="t-h1"
        />

        <div className="mt-14 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* Jedna velká fotografie – sticky */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--nav-height)+1.25rem)]">
              <Reveal className="photo-frame aspect-[4/5] w-full max-w-[24rem] sm:max-w-[26rem] lg:max-w-none">
                <Image
                  src={storyPortrait}
                  alt={photoAlt.story}
                  fill
                  sizes="(min-width: 1024px) 36vw, (min-width: 640px) 26rem, 90vw"
                  placeholder="blur"
                  className="photo-warm object-cover object-[50%_0%]"
                />
              </Reveal>
              <ol className="mt-7 hidden items-center gap-3 lg:flex" aria-hidden="true">
                {storySteps.map((step, i) => (
                  <li key={step.id} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full transition-all duration-700",
                        i === active
                          ? "bg-gold-500 shadow-[0_0_0_5px_rgba(201,178,131,0.25)]"
                          : i < active
                            ? "bg-gold-400"
                            : "bg-ink-900/15",
                      )}
                    />
                    {i < storySteps.length - 1 ? (
                      <span className="relative h-px w-8 bg-ink-900/10">
                        <span
                          className="absolute inset-y-0 left-0 origin-left bg-gold-400 transition-transform duration-1000 ease-[var(--ease-out-expo)]"
                          style={{ width: "100%", transform: `scaleX(${i < active ? 1 : 0})` }}
                        />
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Kroky */}
          <ol className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden="true" className="absolute bottom-6 left-[7px] top-6 w-px bg-ink-900/10" />
            {storySteps.map((step, i) => (
              <li
                key={step.id}
                id={step.id}
                data-neural={step.neural}
                className="story-step relative flex min-h-[34svh] flex-col justify-center py-8 pl-10 lg:min-h-[46vh] lg:py-10"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border transition-all duration-700",
                    i <= active
                      ? "border-gold-500 bg-gold-400 shadow-[0_0_0_6px_rgba(201,178,131,0.22)]"
                      : "border-ink-900/20 bg-paper-50",
                  )}
                />
                <Reveal as="p" className="t-label text-gold-700">
                  0{i + 1}
                </Reveal>
                <TextReveal as="h3" text={step.label} className="t-h2 mt-3 text-ink-900" stagger={0.05} />
                <Reveal as="p" delay={0.15} className="t-lead mt-4 max-w-[30ch] text-ink-600">
                  {step.text}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Cinematic fotografie – nový směr */}
      <div data-neural="quiet" className="story-cine relative h-[70svh] w-full overflow-hidden lg:h-[92vh]">
        <div className="story-cine-mask absolute inset-0 will-change-[clip-path]">
          <div className="story-cine-img absolute inset-x-0 -inset-y-[12%]">
            <Image
              src={cinematicPhoto}
              alt={photoAlt.cinematic}
              fill
              sizes="100vw"
              placeholder="blur"
              className="object-cover object-[50%_38%] saturate-[0.9]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-night-950/75 via-night-950/15 to-transparent" />
        </div>
        <div className="page-container relative z-10 flex h-full flex-col justify-end pb-14 lg:pb-20">
          <Reveal as="p" className="t-label flex items-center gap-3 text-gold-200">
            <span className="node bg-gold-300" aria-hidden="true" />
            {storyOutro.caption}
          </Reveal>
          <TextReveal
            as="p"
            text={storyOutro.quote}
            className="t-quote mt-5 max-w-[20ch] text-paper-50"
            emphasisClass="text-gold-200"
            stagger={0.05}
          />
        </div>
      </div>
    </section>
  );
}
