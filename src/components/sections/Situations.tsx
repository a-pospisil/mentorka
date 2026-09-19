import { contactHref } from "@/config/site";
import { situations, situationsIntro, situationsOutro } from "@/content/situations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";
import { DendriteGlyph } from "@/components/neural/DendriteGlyph";

/**
 * 02 POZNÁTE SE V TOM? – konverzní sekce. Čtyři velké bloky, ve kterých se
 * návštěvník pozná dřív, než čte cokoliv o metodě.
 */
export function Situations() {
  return (
    <section id="situace" data-neural="situations" className="relative">
      <div className="page-container section-space">
        <SectionHeading label={situationsIntro.label} headline={situationsIntro.headline} headlineClass="t-h1" />

        <Reveal stagger={0.12} className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-18 lg:gap-6">
          {situations.map((s) => (
            <article
              key={s.id}
              className="glyph-hover surface-mid group relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 transition-[transform,box-shadow,background-color] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:bg-paper-100 hover:shadow-[0_34px_70px_-44px_rgba(27,27,32,0.5)] sm:min-h-[19rem] sm:p-9 lg:min-h-[22rem] lg:p-11"
            >
              <div className="flex items-start justify-between gap-6">
                <span className="t-label text-gold-700">{s.index}</span>
                <DendriteGlyph
                  seed={s.seed}
                  className="h-20 w-20 text-ink-600 transition-colors duration-700 group-hover:text-synapse-600 sm:h-24 sm:w-24 lg:h-28 lg:w-28"
                />
              </div>
              <div className="mt-10">
                <p className="t-h3 max-w-[17ch] text-ink-900">„{s.quote}“</p>
                <p className="t-body mt-4 max-w-[36ch] text-ink-500">{s.note}</p>
              </div>
            </article>
          ))}
        </Reveal>

        <Reveal className="mt-12 flex flex-col items-start gap-8 lg:mt-18 lg:flex-row lg:items-end lg:justify-between">
          <p className="t-lead max-w-[30ch] text-ink-700">{situationsOutro.text}</p>
          <MagneticButton href={contactHref()} className="btn btn-primary">
            {situationsOutro.cta}
            <Arrow />
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
