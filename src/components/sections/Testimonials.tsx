import Image from "next/image";
import {
  showTestimonialPlaceholder,
  testimonials,
  testimonialsIntro,
  type Testimonial,
} from "@/content/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Reference – velké citace, iniciály nebo fotografie, jemná animace.
 * Bez referencí se zobrazí placeholder komponenta (TODO: DOPLNIT).
 */
export function Testimonials() {
  const hasItems = testimonials.length > 0;
  if (!hasItems && !showTestimonialPlaceholder) return null;

  return (
    <section id="reference" data-neural="trust" className="relative">
      <div className="page-container section-space">
        <SectionHeading
          index="06"
          label={testimonialsIntro.label}
          headline={testimonialsIntro.headline}
        />
        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-3">
          {hasItems
            ? testimonials.map((item, i) => (
                <TestimonialCard key={`${item.name}-${i}`} item={item} delay={i * 0.1} />
              ))
            : [0, 1, 2].map((i) => <PlaceholderCard key={i} delay={i * 0.1} />)}
        </div>
      </div>
    </section>
  );
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full border hairline-strong font-serif text-base text-gold-300">
      {initials}
    </span>
  );
}

function TestimonialCard({ item, delay }: { item: Testimonial; delay: number }) {
  return (
    <Reveal
      as="figure"
      delay={delay}
      className="flex h-full flex-col justify-between border hairline bg-ink-950/60 p-8 backdrop-blur-sm lg:p-10"
    >
      <blockquote className="font-serif text-2xl font-light leading-snug text-bone-50">
        <span className="mr-1 text-gold-400">„</span>
        {item.quote}
        <span className="ml-1 text-gold-400">“</span>
      </blockquote>
      <figcaption className="mt-10 flex items-center gap-4">
        {item.image ? (
          <span className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image src={item.image} alt="" fill sizes="44px" className="object-cover" />
          </span>
        ) : (
          <Initials name={item.name} />
        )}
        <span>
          <span className="block text-sm text-bone-100">{item.name}</span>
          {item.context ? <span className="t-label mt-1 block text-bone-500">{item.context}</span> : null}
        </span>
      </figcaption>
    </Reveal>
  );
}

function PlaceholderCard({ delay }: { delay: number }) {
  return (
    <Reveal
      as="figure"
      delay={delay}
      className="flex h-full min-h-[18rem] flex-col justify-between border border-dashed border-gold-400/25 bg-ink-950/40 p-8 lg:p-10"
      aria-label="Místo pro referenci klienta"
    >
      <blockquote className="font-serif text-2xl font-light leading-snug text-bone-600">
        <span className="mr-1 text-gold-500/60">„</span>
        Sem patří slova člověka, kterému spolupráce pomohla.
        <span className="ml-1 text-gold-500/60">“</span>
      </blockquote>
      <figcaption className="mt-10 flex items-center gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-gold-400/30 font-serif text-base text-bone-600">
          ··
        </span>
        <span className="todo">TODO: doplnit referenci</span>
      </figcaption>
    </Reveal>
  );
}
