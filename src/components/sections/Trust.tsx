import Image from "next/image";
import { isTodo } from "@/config/site";
import {
  credentials,
  practice,
  showPlaceholders,
  testimonialPlaceholders,
  testimonials,
  trustIntro,
  type TrustItem,
} from "@/content/trust";
import { certificates, certificatesIntro } from "@/content/certificates";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const visibleItems = (items: TrustItem[]) =>
  showPlaceholders ? items : items.filter((item) => !isTodo(item.title));

function TrustLine({ item }: { item: TrustItem }) {
  return (
    <div className="flex flex-col gap-2">
      {isTodo(item.title) ? (
        <span className="todo">{item.title}</span>
      ) : (
        <p className="font-serif text-xl leading-snug text-ink-900">{item.title}</p>
      )}
      {item.meta ? (
        isTodo(item.meta) ? (
          <span className="todo w-fit">{item.meta}</span>
        ) : (
          <p className="t-small text-ink-500">{item.meta}</p>
        )
      ) : null}
    </div>
  );
}

/**
 * 08 DŮVĚRA – vzdělání, certifikace, praxe, reference a skeny certifikátů.
 * Pouze skutečné informace; chybějící údaje jsou zřetelně označené
 * placeholdery (src/content/trust.ts).
 */
export function Trust() {
  const creds = visibleItems(credentials);
  const prac = visibleItems(practice);
  const placeholders = showPlaceholders && !testimonials.length ? testimonialPlaceholders : 0;
  /** Jediný certifikát dostane širší, editoriální layout (obrázek + údaje vedle sebe). */
  const single = certificates.length === 1;
  /** Bez referencí si vzdělání a praxe rozdělí šířku mezi sebe. */
  const hasTestimonials = Boolean(testimonials.length || placeholders);
  if (!creds.length && !prac.length && !testimonials.length && !placeholders && !certificates.length)
    return null;

  return (
    <section id="duvera" data-neural="trust" className="relative">
      <div className="page-container section-space">
        <SectionHeading label={trustIntro.label} headline={trustIntro.headline} />

        <div className="mt-12 grid gap-12 lg:mt-18 lg:grid-cols-12 lg:gap-8">
          {creds.length ? (
            <Reveal className={hasTestimonials ? "lg:col-span-4" : "lg:col-span-5"}>
              <h3 className="t-label text-ink-500">Vzdělání a certifikace</h3>
              <ul className="mt-6 divide-y hairline border-y hairline">
                {creds.map((item, i) => (
                  <li key={i} className="py-5">
                    <TrustLine item={item} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {prac.length ? (
            <Reveal className={hasTestimonials ? "lg:col-span-3" : "lg:col-span-5"} delay={0.1}>
              <h3 className="t-label text-ink-500">Praxe</h3>
              <ul className="mt-6 divide-y hairline border-y hairline">
                {prac.map((item, i) => (
                  <li key={i} className="py-5">
                    <TrustLine item={item} />
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {testimonials.length || placeholders ? (
            <Reveal className="lg:col-span-5" delay={0.2}>
              <h3 className="t-label text-ink-500">Reference</h3>
              <div className="mt-6 flex flex-col gap-4">
                {testimonials.map((t, i) => (
                  <blockquote key={i} className="rounded-[1.25rem] bg-paper-200 p-7">
                    <p className="font-serif text-xl leading-snug text-ink-900">„{t.quote}“</p>
                    <footer className="t-small mt-4 text-ink-500">
                      {t.name}
                      {t.context ? ` · ${t.context}` : ""}
                    </footer>
                  </blockquote>
                ))}
                {Array.from({ length: placeholders }).map((_, i) => (
                  <div key={`ph-${i}`} className="todo-block flex min-h-[9rem] flex-col justify-between p-6">
                    <span className="todo">TODO: DOPLNIT referenci klienta</span>
                    <p className="t-small text-ink-500">
                      Citace, jméno nebo iniciály a kontext – src/content/trust.ts
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>

        {certificates.length ? (
          <div className="mt-16 border-t hairline pt-12 lg:mt-24 lg:pt-16">
            <Reveal>
              <h3 className="t-label text-ink-500">{certificatesIntro.label}</h3>
            </Reveal>

            <Reveal
              stagger={0.12}
              className={cn(
                "mt-8 grid lg:mt-10",
                single
                  ? "gap-8"
                  : certificates.length === 2
                    ? "gap-x-8 gap-y-12 sm:grid-cols-2 lg:gap-x-12"
                    : "gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8",
              )}
            >
              {certificates.map((cert) => (
                <figure
                  key={cert.id}
                  className={cn(single && "grid items-center gap-8 sm:grid-cols-2 lg:gap-14")}
                >
                  <div className="photo-frame !rounded-[1.25rem] aspect-[1.4/1] w-full">
                    <Image
                      src={cert.image}
                      alt={cert.alt}
                      fill
                      sizes={
                        single || certificates.length === 2
                          ? "(max-width: 640px) 90vw, 46vw"
                          : "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      }
                      placeholder="blur"
                      className="object-cover object-top"
                    />
                  </div>

                  <figcaption className={cn(!single && "mt-5")}>
                    <p className="font-serif text-xl leading-snug text-ink-900">{cert.title}</p>
                    <p className="t-small mt-1.5 text-ink-500">
                      {cert.issuer} · {cert.year}
                    </p>
                    {cert.scope ? <p className="t-small mt-3 text-ink-600">{cert.scope}</p> : null}
                    {cert.accreditation ? (
                      <p className="t-small mt-1 text-ink-600">{cert.accreditation.text}</p>
                    ) : null}
                    {cert.certifiedBy ? (
                      <p className="t-small mt-1 text-ink-400">Certifikoval {cert.certifiedBy}</p>
                    ) : null}
                    {cert.number ? (
                      <p className="t-small mt-1 text-ink-400">
                        Č. {cert.number} · {cert.issued}
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </Reveal>
          </div>
        ) : null}
      </div>
    </section>
  );
}
