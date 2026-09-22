"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { ctaLinkProps } from "@/config/site";
import { hero } from "@/content/hero";
import { heroPortrait, photoAlt } from "@/content/photos";
import { NeuralHalo } from "@/components/neural/NeuralHalo";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";

/**
 * 01 HERO – velký, světlý. Dominantní portrét s organickým neuronovým halo.
 * Během několika sekund: kdo je Vladislava, komu pomáhá, s čím a co udělat dál.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const photo = el.querySelector(".hero-photo");
      const meta = el.querySelectorAll(".hero-meta");
      if (prefersReducedMotionNow()) {
        gsap.set([photo, meta], { clearProps: "all", opacity: 1 });
        return;
      }
      gsap.set(photo, { clipPath: "inset(8% 6% 8% 6% round 1.75rem)", scale: 1.05, opacity: 0 });
      gsap.set(meta, { opacity: 0, y: 16 });
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(photo, { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", scale: 1, opacity: 1, duration: 1.6 }, 0.05)
        .to(meta, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.3);

      gsap.to(".hero-photo-inner", {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="uvod" data-neural="hero" className="relative overflow-hidden">
      <div className="page-container relative z-10 grid min-h-[100svh] items-center gap-7 pb-12 pt-[calc(var(--nav-height)+0.25rem)] sm:gap-10 lg:grid-cols-12 lg:gap-8 lg:pb-20 lg:pt-[calc(var(--nav-height)+1.5rem)]">
        {/* Portrét – na mobilu první, na desktopu vpravo */}
        <div className="relative order-first lg:order-last lg:col-span-5 lg:col-start-8">
          <div className="relative mx-auto w-[min(58vw,17rem)] sm:w-[min(48vw,21rem)] lg:w-full lg:max-w-[32rem]">
            <NeuralHalo
              className="-inset-x-[38%] -inset-y-[22%] lg:-inset-x-[48%] lg:-inset-y-[26%]"
              seed={41}
              somas={8}
              scale={0.15}
            />
            <div className="hero-photo photo-frame relative aspect-[4/5] will-change-transform">
              <div className="hero-photo-inner relative h-[112%] w-full -translate-y-[6%]">
                <Image
                  src={heroPortrait}
                  alt={photoAlt.hero}
                  fill
                  priority
                  sizes="(min-width: 1024px) 32rem, (min-width: 640px) 21rem, 58vw"
                  placeholder="blur"
                  className="photo-warm object-cover object-[50%_8%]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
          <p className="hero-meta t-label flex flex-wrap items-center gap-x-3 gap-y-2 text-gold-700">
            <span className="node" aria-hidden="true" />
            <span>{hero.eyebrow}</span>
            <span className="text-ink-400">·</span>
            <span className="text-ink-500">{hero.role}</span>
          </p>
          <h1 className="t-display mt-4 max-w-[13ch] text-ink-900 lg:mt-7">
            <TextReveal text={hero.headline} trigger="ready" delay={0.15} stagger={0.06} />
          </h1>
          <p className="hero-meta t-label-wide mt-4 text-ink-500 lg:mt-7">{hero.tagline}</p>
          <p className="hero-meta t-lead mt-4 max-w-[32ch] text-ink-700 lg:mt-7">{hero.lead}</p>
          <div className="hero-meta mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-9">
            <MagneticButton {...ctaLinkProps()} className="btn btn-primary">
              {hero.primaryCta}
              <Arrow />
            </MagneticButton>
            <a href="#pribeh" className="link-line t-label text-ink-700">
              {hero.secondaryCta}
              <Arrow className="h-3 w-3 rotate-90" />
            </a>
          </div>
          <p className="hero-meta t-small mt-4 text-ink-500">{hero.note}</p>
        </div>
      </div>
    </section>
  );
}
