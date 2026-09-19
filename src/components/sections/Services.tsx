import { services, servicesIntro } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DendriteGlyph } from "@/components/neural/DendriteGlyph";

/**
 * 05 S ČÍM POMÁHÁM – čtyři oblasti, výrazný headline, max. 2–3 věty,
 * jemná mikroanimace (dendritový glyf se na hover dokreslí). Bez CTA –
 * návštěvník pokračuje k „Jak to probíhá“.
 */
export function Services() {
  return (
    <section id="pomoc" data-neural="services" className="relative">
      <div className="page-container section-space">
        <SectionHeading label={servicesIntro.label} headline={servicesIntro.headline} lead={servicesIntro.lead} />

        <Reveal
          stagger={0.1}
          className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] border hairline bg-ink-900/8 sm:grid-cols-2 lg:mt-18 lg:grid-cols-4"
        >
          {services.map((s) => (
            <article
              key={s.id}
              id={s.id}
              className="glyph-hover group relative flex min-h-[19rem] flex-col justify-between bg-paper-50 p-7 transition-colors duration-700 hover:bg-paper-100 lg:min-h-[26rem] lg:p-8"
            >
              <div>
                <span className="t-label text-gold-700">{s.index}</span>
                <h3 className="t-h3 mt-5 min-h-[2.4em] text-ink-900">{s.title}</h3>
                <p className="mt-4 font-serif text-[1.15rem] leading-snug text-ink-800 lg:text-[1.25rem]">{s.text}</p>
                <p className="t-body mt-4 text-ink-500">{s.more}</p>
                {s.note ? (
                  <p className="t-small mt-5 border-l-2 border-gold-400 pl-3 text-ink-500">{s.note}</p>
                ) : null}
              </div>
              <div className="mt-10 flex justify-end">
                <DendriteGlyph
                  seed={s.seed}
                  dendrites={3}
                  className="h-16 w-16 text-ink-500 transition-colors duration-700 group-hover:text-synapse-600 lg:h-20 lg:w-20"
                />
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
