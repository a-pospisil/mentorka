import Image from "next/image";
import { contactHref } from "@/config/site";
import { processCta, processIntro, processNote, processSteps } from "@/content/process";
import { photoAlt, processPortrait } from "@/content/photos";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";

/**
 * 06 JAK TO PROBÍHÁ – tři kroky, jedna důležitá věta, jedno CTA.
 * Střední neutrální plocha (ivory) – tempo stránky se zklidní.
 */
export function Process() {
  return (
    <section id="prubeh" data-neural="process" className="surface-mid relative">
      <div className="page-container section-space">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeading label={processIntro.label} headline={processIntro.headline} />
            <Reveal className="mt-10 flex items-center gap-5">
              <div className="photo-frame h-20 w-20 shrink-0 !rounded-full sm:h-24 sm:w-24">
                <Image
                  src={processPortrait}
                  alt={photoAlt.process}
                  fill
                  sizes="96px"
                  placeholder="blur"
                  className="photo-warm object-cover object-[50%_22%]"
                />
              </div>
              <p className="t-body max-w-[32ch] text-ink-700">{processNote}</p>
            </Reveal>
          </div>

          <Reveal stagger={0.12} className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:col-span-7 lg:gap-8">
            {processSteps.map((step) => (
              <div key={step.index} className="relative border-t border-ink-900/15 pt-7">
                <span className="node absolute -top-1 left-0" aria-hidden="true" />
                <span className="t-label text-gold-700">{step.index}</span>
                <h3 className="t-h3 mt-4 text-ink-900">{step.title}</h3>
                <p className="t-body mt-3 max-w-[26ch] text-ink-600">{step.text}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="mt-12 lg:mt-16">
          <MagneticButton href={contactHref()} className="btn btn-primary">
            {processCta}
            <Arrow />
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
