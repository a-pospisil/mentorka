"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { galleryIntro, photos, type Photo } from "@/content/photos";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const ratioClass: Record<Photo["ratio"], string> = {
  "3/4": "aspect-[3/4]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "16/10": "aspect-[16/10]",
};

const treatmentClass: Record<NonNullable<Photo["treatment"]>, string> = {
  color: "",
  mono: "grayscale contrast-[1.08] brightness-[0.92]",
  warm: "saturate-[0.8] sepia-[0.18] contrast-[1.04]",
};

/**
 * Galerie momentů – na desktopu horizontální scroll (pin), na mobilu
 * nativní posun se snapem. Fotografie jsou součástí příběhu, ne mřížka.
 */
export function Gallery() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      if (prefersReducedMotionNow()) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = section.querySelector<HTMLElement>(".gallery-track");
        const stage = section.querySelector<HTMLElement>(".gallery-stage");
        if (!track || !stage) return;
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        // Jemná paralaxa uvnitř snímků
        section.querySelectorAll<HTMLElement>(".gallery-img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: () => `+=${distance()}`,
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="momenty" data-neural="gallery" className="relative overflow-x-clip">
      <div className="page-container pt-[clamp(5rem,12vw,11rem)]">
        <SectionHeading index="04" label={galleryIntro.label} headline={galleryIntro.headline} />
      </div>

      <div className="gallery-stage relative mt-16 lg:mt-0 lg:flex lg:h-screen lg:items-center">
        <div className="gallery-track no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] pb-8 lg:snap-none lg:gap-10 lg:overflow-visible lg:pb-0 lg:pr-[10vw]">
          {photos.map((photo, i) => (
            <figure
              key={photo.id}
              className={cn(
                "relative shrink-0 snap-center lg:w-auto",
                ratioClass[photo.ratio],
                photo.ratio === "3/4" || photo.ratio === "4/5"
                  ? "w-[72vw] sm:w-[46vw] lg:h-[64vh]"
                  : photo.ratio === "1/1"
                    ? "w-[64vw] sm:w-[40vw] lg:h-[46vh]"
                    : "w-[84vw] sm:w-[60vw] lg:h-[56vh]",
                i % 2 === 1 && "lg:mt-24",
              )}
            >
              {photo.src ? (
                <div className="relative h-full w-full overflow-hidden">
                  <div className="gallery-img relative h-full w-[112%] -ml-[6%]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 85vw"
                      placeholder="blur"
                      style={{ objectPosition: photo.position }}
                      className={cn("object-cover", treatmentClass[photo.treatment ?? "color"])}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
                </div>
              ) : (
                <PhotoPlaceholder caption={photo.caption} />
              )}
              <figcaption className="t-label mt-4 flex items-center gap-3 text-bone-500">
                <span className="text-bone-600">0{i + 1}</span>
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Elegantní rám pro fotografii, která bude dodána (TODO: DOPLNIT). */
function PhotoPlaceholder({ caption }: { caption: string }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden border hairline bg-ink-900/60"
      aria-label={`Fotografie – ${caption} (bude doplněna)`}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
        <defs>
          <pattern id="ph-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(201,180,138,0.35)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ph-grid)" />
        <path
          d="M12 80 L120 40 L210 110 L330 60"
          stroke="rgba(201,180,138,0.35)"
          strokeWidth="1"
          fill="none"
        />
        {[
          [12, 80],
          [120, 40],
          [210, 110],
          [330, 60],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="rgba(201,180,138,0.7)" />
        ))}
      </svg>
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <span className="todo">TODO: doplnit fotografii</span>
        <span className="t-small text-bone-500">{caption}</span>
      </div>
    </div>
  );
}
