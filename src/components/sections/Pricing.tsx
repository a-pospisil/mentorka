import { ctaLinkProps, CTA_PRIMARY } from "@/config/site";
import { pricing, pricingIntro, pricingTerms } from "@/content/pricing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Arrow } from "@/components/ui/Arrow";
import { cn } from "@/lib/utils";

/**
 * 07 CENÍK – tři jasné položky a podmínky spolupráce.
 * Ceny se berou výhradně z src/content/pricing.ts.
 */
export function Pricing() {
  return (
    <section id="cenik" data-neural="pricing" className="relative">
      <div className="page-container section-space">
        <SectionHeading label={pricingIntro.label} headline={pricingIntro.headline} lead={pricingIntro.lead} />

        <Reveal stagger={0.12} className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {pricing.map((item) => (
            <article
              key={item.id}
              className={cn(
                "flex flex-col rounded-[1.5rem] p-7 transition-shadow duration-700 ease-[var(--ease-out-expo)] sm:p-8",
                item.highlight
                  ? "bg-ink-900 text-paper-50 shadow-[0_30px_70px_-40px_rgba(27,27,32,0.7)]"
                  : "bg-paper-200",
              )}
            >
              <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  className={cn("node", item.highlight ? "node-violet" : "")}
                  aria-hidden="true"
                />
                <span className={cn("t-label", item.highlight ? "text-gold-300" : "text-gold-700")}>
                  {item.index}
                </span>
                {item.badge ? (
                  <span className="t-label rounded-full bg-gold-200 px-3 py-1 text-gold-700">
                    {item.badge}
                  </span>
                ) : null}
              </header>

              <h3 className={cn("t-h3 mt-5", item.highlight ? "text-paper-50" : "text-ink-900")}>
                {item.title}
              </h3>

              <p
                className={cn(
                  "t-small mt-3 flex flex-wrap items-center gap-x-2 gap-y-1",
                  item.highlight ? "text-paper-300" : "text-ink-500",
                )}
              >
                <span>{item.duration}</span>
                <span aria-hidden="true">·</span>
                <span>{item.format}</span>
              </p>

              <p className={cn("t-body mt-5 grow", item.highlight ? "text-paper-300" : "text-ink-600")}>
                {item.text}
              </p>

              <footer
                className={cn(
                  "mt-7 border-t pt-5",
                  item.highlight ? "border-paper-50/15" : "hairline",
                )}
              >
                <p
                  className={cn(
                    "flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif text-4xl leading-none",
                    item.highlight ? "text-gold-300" : "text-ink-900",
                  )}
                >
                  {item.price}
                  {item.priceRegular ? (
                    <s className="text-2xl text-ink-400 decoration-1">
                      <span className="sr-only">běžná cena </span>
                      {item.priceRegular}
                    </s>
                  ) : null}
                </p>
                {item.priceNote ? (
                  <p className={cn("t-small mt-2", item.highlight ? "text-paper-400" : "text-ink-500")}>
                    {item.priceNote}
                  </p>
                ) : null}
              </footer>
            </article>
          ))}
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <h3 className="t-label text-ink-500">Podmínky</h3>
            <ul className="mt-6 divide-y hairline border-y hairline">
              {pricingTerms.map((term, i) => (
                <li key={i} className="flex items-start gap-4 py-4">
                  <span className="node mt-2.5" aria-hidden="true" />
                  <p className="t-body text-ink-700">{term}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="flex items-end lg:col-span-5">
            <MagneticButton {...ctaLinkProps()} className="btn btn-primary">
              {CTA_PRIMARY}
              <Arrow />
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
