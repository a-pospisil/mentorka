"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { contactHref, site } from "@/config/site";
import { heroPortrait } from "@/content/photos";
import { HeroNeural } from "@/components/neural/HeroNeural";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";
import { APP_READY_EVENT } from "@/components/ui/Preloader";

/**
 * Hero – začátek příběhu.
 * Desktop: editorial dvousloupcová kompozice, portrét s neuronovým halo.
 * Mobil: fotografie dominantní přes horní část obrazovky, text pod ní.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = prefersReducedMotionNow();
      const frame = el.querySelector(".hero-frame");
      const photo = el.querySelector(".hero-photo");
      const meta = el.querySelectorAll(".hero-meta");
      const hint = el.querySelector(".hero-hint");

      if (reduced) {
        gsap.set([frame, photo, meta, hint], { clearProps: "all", opacity: 1 });
        return;
      }

      gsap.set(photo, { clipPath: "inset(12% 8% 12% 8%)", scale: 1.12, opacity: 0 });
      gsap.set(frame, { opacity: 0, scale: 0.97 });
      gsap.set(meta, { opacity: 0, y: 18 });
      gsap.set(hint, { opacity: 0 });

      const play = () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(photo, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, opacity: 1, duration: 1.8 }, 0)
          .to(frame, { opacity: 1, scale: 1, duration: 1.6 }, 0.4)
          .to(meta, { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.5)
          .to(hint, { opacity: 1, duration: 1 }, 1.4);
      };

      if (document.documentElement.classList.contains("is-ready")) {
        play();
      } else {
        window.addEventListener(APP_READY_EVENT, play, { once: true });
        return () => window.removeEventListener(APP_READY_EVENT, play);
      }

      // Jemná paralaxa portrétu při scrollu
      gsap.to(".hero-photo-inner", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="uvod"
      data-neural="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden lg:min-h-[100svh]"
    >
      {/* Fotografie – na mobilu full-bleed nahoře, na desktopu pravý sloupec */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[60svh] lg:hidden">
        <div className="hero-photo relative h-full w-full will-change-transform">
          <div className="hero-photo-inner relative h-full w-full">
            <Image
              src={heroPortrait}
              alt={`${site.name} – portrét`}
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              className="object-cover object-[50%_22%] saturate-[0.9] contrast-[1.02]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/45 via-transparent to-ink-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent" />
        </div>
        <HeroNeural className="inset-0" />
      </div>

      <div className="page-container relative z-10 flex flex-1 flex-col justify-end pb-12 pt-[46svh] lg:justify-center lg:pb-24 lg:pt-[calc(var(--nav-height)+3rem)]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="hero-meta t-label flex items-center gap-3 text-gold-400">
              <span className="node" aria-hidden="true" />
              Mentorka · NLP · Coaching
            </p>
            <h1 className="t-display mt-6 max-w-[12ch] text-bone-50 lg:mt-8">
              <TextReveal
                text="Když se změní život, nemusí skončit jeho *směr*."
                trigger="ready"
                delay={0.25}
                stagger={0.07}
              />
            </h1>
            <p className="hero-meta t-label-wide mt-7 max-w-xl text-bone-400 lg:mt-10">
              NLP <span className="mx-2 text-gold-500">•</span> Coaching{" "}
              <span className="mx-2 text-gold-500">•</span> Prevence vyhoření{" "}
              <span className="mx-2 text-gold-500">•</span> Podpora po ztrátě
            </p>
            <div className="hero-meta mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 lg:mt-10">
              <MagneticButton href={contactHref()} className="btn btn-primary">
                Domluvme si rozhovor
                <Arrow />
              </MagneticButton>
              <a href="#pribeh" className="link-line t-label text-bone-200">
                Poznejte můj příběh
                <Arrow className="h-3 w-3 rotate-90" />
              </a>
            </div>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[460px] xl:max-w-[520px]">
              {/* Neuronové halo přesahuje rám fotografie */}
              <HeroNeural className="-inset-x-[30%] -top-[5%] -bottom-[30%]" />
              <div
                aria-hidden="true"
                className="hero-frame pointer-events-none absolute -inset-4 border hairline-strong"
              />
              <div className="hero-photo mask-vignette relative h-full w-full overflow-hidden will-change-transform">
                <div className="hero-photo-inner relative h-[115%] w-full -translate-y-[7%]">
                  <Image
                    src={heroPortrait}
                    alt={`${site.name} – portrét`}
                    fill
                    priority
                    sizes="(min-width: 1280px) 520px, (min-width: 1024px) 40vw, 100vw"
                    placeholder="blur"
                    className="object-cover object-[50%_28%] saturate-[0.9] contrast-[1.02]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-80" />
              </div>
              <p className="hero-meta t-label absolute -bottom-9 right-0 text-bone-600">
                {site.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-hint pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <span className="t-label text-bone-600">Příběh začíná</span>
        <span className="relative h-12 w-px overflow-hidden bg-bone-100/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_2.4s_ease-in-out_infinite] bg-gold-400" />
        </span>
      </div>
      <style>{`@keyframes scrollhint{0%{transform:translateY(-100%)}60%,100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
