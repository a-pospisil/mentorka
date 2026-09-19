import Image from "next/image";
import { contactHref, isTodo, site, telHref } from "@/config/site";
import { finalCta } from "@/content/contact";
import { contactPortrait, photoAlt } from "@/content/photos";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TodoValue } from "@/components/ui/Todo";
import { Arrow } from "@/components/ui/Arrow";
import { NeuralHalo } from "@/components/neural/NeuralHalo";

/**
 * 08 FINÁLNÍ CTA – velmi světlá sekce, velký portrét s neuronovým halo
 * (ozvěna hero), jedna výzva, e-mail a telefon.
 */
export function FinalCta() {
  const { email, phone, location } = site.contact;

  return (
    <section id="kontakt" data-neural="contact" className="surface-soft relative overflow-hidden">
      <div className="page-container section-space">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <SectionHeading label={finalCta.label} headline={finalCta.headline} headlineClass="t-h1" />
            <Reveal as="p" delay={0.1} className="t-lead mt-8 max-w-[30ch] text-ink-700">
              {finalCta.text}
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <MagneticButton href={contactHref()} className="btn btn-primary">
                {finalCta.cta}
                <Arrow />
              </MagneticButton>
            </Reveal>

            <Reveal delay={0.25} className="mt-12">
              <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <dt className="t-label text-ink-500">E-mail</dt>
                  <dd className="font-serif text-2xl text-ink-900">
                    <TodoValue value={email}>
                      {(v) => (
                        <a href={`mailto:${v}`} className="link-line">
                          {v}
                        </a>
                      )}
                    </TodoValue>
                  </dd>
                </div>
                <div className="flex flex-col gap-2">
                  <dt className="t-label text-ink-500">Telefon</dt>
                  <dd className="font-serif text-2xl text-ink-900">
                    <TodoValue value={phone}>
                      {(v) => (
                        <a href={telHref(v)} className="link-line">
                          {v}
                        </a>
                      )}
                    </TodoValue>
                  </dd>
                </div>
                {location ? (
                  <div className="flex flex-col gap-2">
                    <dt className="t-label text-ink-500">Setkání</dt>
                    <dd className="font-serif text-2xl text-ink-900">{location}</dd>
                  </div>
                ) : null}
                {site.social.length ? (
                  <div className="flex flex-col gap-2">
                    <dt className="t-label text-ink-500">Sledujte</dt>
                    <dd className="flex flex-wrap gap-x-6 gap-y-2">
                      {site.social.map((s) => (
                        <a
                          key={s.href}
                          href={s.href}
                          className="link-line t-label text-ink-700"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {s.label}
                        </a>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <p className="t-small mt-8 max-w-[46ch] text-ink-500">
                V akutní krizi se prosím obraťte na odbornou pomoc – {site.crisisLine.label}{" "}
                <a href={telHref(site.crisisLine.phone)} className="text-ink-900 underline underline-offset-4">
                  {site.crisisLine.phone}
                </a>{" "}
                ({site.crisisLine.note}).
              </p>
              {isTodo(email) ? (
                <p className="t-small mt-3 text-ink-400">
                  Kontaktní údaje upravíte v souboru <code className="text-ink-500">src/config/site.ts</code>.
                </p>
              ) : null}
            </Reveal>
          </div>

          <div className="relative lg:col-span-5 lg:col-start-8">
            <div className="relative mx-auto w-[min(66vw,18rem)] sm:w-[min(48vw,22rem)] lg:w-full lg:max-w-[28rem]">
              <NeuralHalo
                className="-inset-x-[42%] -inset-y-[24%]"
                seed={77}
                somas={7}
                scale={0.14}
                state={{ alpha: 0.85, pulseRate: 0.9, rewire: 0.03 }}
              />
              <Reveal className="photo-frame aspect-[4/5]">
                <Image
                  src={contactPortrait}
                  alt={photoAlt.contact}
                  fill
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 22rem, 66vw"
                  placeholder="blur"
                  className="photo-warm object-cover object-[50%_4%]"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
