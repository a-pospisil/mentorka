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
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

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
 * 07 DŮVĚRA – vzdělání, certifikace, praxe, reference.
 * Pouze skutečné informace; chybějící údaje jsou zřetelně označené
 * placeholdery (src/content/trust.ts).
 */
export function Trust() {
  const creds = visibleItems(credentials);
  const prac = visibleItems(practice);
  const placeholders = showPlaceholders && !testimonials.length ? testimonialPlaceholders : 0;
  if (!creds.length && !prac.length && !testimonials.length && !placeholders) return null;

  return (
    <section id="duvera" data-neural="trust" className="relative">
      <div className="page-container section-space">
        <SectionHeading label={trustIntro.label} headline={trustIntro.headline} />

        <div className="mt-12 grid gap-12 lg:mt-18 lg:grid-cols-12 lg:gap-8">
          {creds.length ? (
            <Reveal className="lg:col-span-4">
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
            <Reveal className="lg:col-span-3" delay={0.1}>
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
      </div>
    </section>
  );
}
