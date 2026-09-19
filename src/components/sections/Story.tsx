"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { storyChapters, storyIntro, storyOutro } from "@/content/story";
import { road, storyPortrait } from "@/content/photos";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { cn } from "@/lib/utils";

/**
 * Příběh – Ztráta → Ticho → Hledání → Pochopení → Nový směr → Pomoc druhým.
 * Každá kapitola nese data-neural a mění stav sítě na pozadí:
 * fragmentovaná a tmavá → propojená a stabilní.
 */
export function Story() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const storyProgress = storyChapters.length > 1 ? active / (storyChapters.length - 1) : 1;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const chapters = el.querySelectorAll<HTMLElement>(".story-chapter");
      chapters.forEach((chapter, i) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          },
        });
      });

      if (prefersReducedMotionNow()) return;

      // Paralaxa fotografie na konci příběhu
      gsap.fromTo(
        ".story-road-img",
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: ".story-road", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        ".story-road-mask",
        { clipPath: "inset(18% 6% 18% 6%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: ".story-road", start: "top 90%", end: "top 25%", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="pribeh" className="relative">
      <div className="page-container section-space">
        <SectionHeading
          index="01"
          label="Příběh"
          headline={storyIntro.headline}
          headlineClass="t-h1"
        />
        <Reveal as="p" delay={0.15} className="t-lead mt-14 max-w-[42ch] text-bone-300 lg:ml-[41.666%]">
          {storyIntro.quiet}
        </Reveal>
      </div>

      <div className="page-container grid gap-10 pb-24 lg:grid-cols-12 lg:pb-40">
        {/* Levý sloupec – portrét a neuronová osa kapitol (sticky) */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-[10vh] flex flex-col gap-10">
            {/* Portrét se s příběhem vrací z šedi do barev */}
            <div className="relative w-40 xl:w-44">
              <div aria-hidden="true" className="absolute -inset-3 border hairline" />
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={storyPortrait}
                  alt="Vladislava Pospíšilová venku, v bílém saku"
                  fill
                  sizes="176px"
                  placeholder="blur"
                  className="object-cover object-[50%_22%]"
                  style={{
                    filter: `grayscale(${(1 - storyProgress).toFixed(2)}) brightness(${(0.5 + 0.5 * storyProgress).toFixed(2)}) contrast(1.05)`,
                    transition: "filter 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </div>
            </div>
          <ol className="flex flex-col" aria-label="Kapitoly příběhu">
            {storyChapters.map((chapter, i) => {
              const isActive = i === active;
              const isPast = i < active;
              return (
                <li key={chapter.id} className="relative flex items-stretch gap-6">
                  <div className="flex w-4 flex-col items-center">
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full transition-all duration-700",
                        isActive
                          ? "bg-gold-300 shadow-[0_0_18px_4px_rgba(201,180,138,0.35)]"
                          : isPast
                            ? "bg-gold-500/80"
                            : "bg-bone-100/15",
                      )}
                    />
                    {i < storyChapters.length - 1 ? (
                      <span className="relative my-1 w-px flex-1 bg-bone-100/10">
                        <span
                          className="absolute inset-x-0 top-0 origin-top bg-gold-500/70 transition-transform duration-1000 ease-[var(--ease-out-expo)]"
                          style={{ height: "100%", transform: `scaleY(${isPast ? 1 : 0})` }}
                        />
                      </span>
                    ) : null}
                  </div>
                  <a
                    href={`#${chapter.id}`}
                    className={cn(
                      "pb-7 font-serif text-2xl font-light transition-colors duration-700",
                      isActive ? "text-bone-50" : isPast ? "text-bone-400" : "text-bone-600",
                    )}
                  >
                    {chapter.label}
                  </a>
                </li>
              );
            })}
          </ol>
          </div>
        </aside>

        {/* Pravý sloupec – kapitoly */}
        <div className="lg:col-span-7 lg:col-start-6">
          {storyChapters.map((chapter, i) => (
            <article
              key={chapter.id}
              id={chapter.id}
              data-neural={chapter.neural}
              className="story-chapter flex min-h-[70svh] flex-col justify-center py-16 lg:min-h-[85vh]"
            >
              <Reveal as="p" className="t-label flex items-center gap-3 text-gold-400 lg:hidden">
                <span className="text-bone-500">0{i + 1}</span>
                {chapter.label}
              </Reveal>
              <TextReveal
                as="h3"
                text={chapter.title}
                className="t-h3 mt-6 max-w-[22ch] text-bone-50 lg:mt-0"
                stagger={0.03}
              />
              <Reveal as="p" delay={0.2} className="t-body mt-8 max-w-[52ch] text-bone-300">
                {chapter.text}
              </Reveal>
            </article>
          ))}
        </div>
      </div>

      {/* Nový směr – fotografie ze silnice */}
      <div
        data-neural="direction"
        className="story-road relative h-[80svh] w-full overflow-hidden lg:h-[100vh]"
      >
        <div className="story-road-mask absolute inset-0 will-change-[clip-path]">
          <div className="story-road-img absolute -inset-y-[14%] inset-x-0">
            <Image
              src={road}
              alt="Vladislava Pospíšilová stojí s rozpřaženýma rukama uprostřed silnice a směje se"
              fill
              sizes="100vw"
              placeholder="blur"
              className="object-cover object-[50%_35%] saturate-[0.8] contrast-[1.05]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-ink-950/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-transparent to-transparent opacity-80" />
        </div>
        <div className="page-container relative z-10 flex h-full flex-col justify-end pb-16 lg:pb-24">
          <Reveal as="p" className="t-label flex items-center gap-3 text-gold-300">
            <span className="node" aria-hidden="true" />
            {storyOutro.caption}
          </Reveal>
          <TextReveal
            as="p"
            text={storyOutro.quote}
            className="t-quote mt-6 max-w-[22ch] text-bone-50"
            stagger={0.05}
          />
        </div>
      </div>
    </section>
  );
}
