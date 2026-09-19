import Image from "next/image";
import { contactHref, isTodo, site, telHref } from "@/config/site";
import { contactPortrait } from "@/content/photos";
import { contactContent } from "@/content/contact";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TodoValue } from "@/components/ui/Todo";
import { Arrow } from "@/components/ui/Arrow";

/** Závěr: tmavé pozadí, pomalu se pohybující síť, jeden rozhovor. */
export function Contact() {
  const { email, phone, location } = site.contact;

  return (
    <section id="kontakt" data-neural="contact" className="relative flex min-h-[100svh] items-center">
      <div className="page-container section-space w-full">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionHeading
              index="07"
              label={contactContent.label}
              headline={contactContent.headline}
              headlineClass="t-h1"
            />
            <Reveal as="p" delay={0.15} className="t-body mt-10 max-w-[44ch] text-bone-300">
              {contactContent.text}
            </Reveal>
            <Reveal delay={0.25} className="mt-12">
              <MagneticButton href={contactHref()} className="btn btn-primary">
                {contactContent.cta}
                <Arrow />
              </MagneticButton>
            </Reveal>
          </div>

          <Reveal className="flex flex-col justify-end lg:col-span-4 lg:col-start-9" delay={0.2}>
            <div className="relative mb-12 w-32 sm:w-36">
              <div aria-hidden="true" className="absolute -inset-3 border hairline-strong" />
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={contactPortrait}
                  alt={`${site.name} – portrét`}
                  fill
                  sizes="144px"
                  placeholder="blur"
                  className="object-cover object-[50%_16%] grayscale contrast-[1.08] brightness-[0.92]"
                />
              </div>
            </div>
            <dl className="flex flex-col divide-y hairline border-y hairline">
              <div className="flex flex-col gap-2 py-6">
                <dt className="t-label text-bone-500">E-mail</dt>
                <dd className="font-serif text-2xl font-light text-bone-50">
                  <TodoValue value={email}>
                    {(v) => (
                      <a href={`mailto:${v}`} className="link-line">
                        {v}
                      </a>
                    )}
                  </TodoValue>
                </dd>
              </div>
              <div className="flex flex-col gap-2 py-6">
                <dt className="t-label text-bone-500">Telefon</dt>
                <dd className="font-serif text-2xl font-light text-bone-50">
                  <TodoValue value={phone}>
                    {(v) => (
                      <a href={telHref(v)} className="link-line">
                        {v}
                      </a>
                    )}
                  </TodoValue>
                </dd>
              </div>
              <div className="flex flex-col gap-2 py-6">
                <dt className="t-label text-bone-500">Setkání</dt>
                <dd className="font-serif text-2xl font-light text-bone-50">
                  <TodoValue value={location} />
                </dd>
              </div>
              {site.social.length ? (
                <div className="flex flex-col gap-2 py-6">
                  <dt className="t-label text-bone-500">Sledujte</dt>
                  <dd className="flex flex-wrap gap-x-6 gap-y-2">
                    {site.social.map((s) => (
                      <a key={s.href} href={s.href} className="link-line t-label text-bone-200" rel="noopener noreferrer" target="_blank">
                        {s.label}
                      </a>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
            <p className="t-small mt-8 text-bone-500">
              V akutní krizi se prosím obraťte na odbornou pomoc –{" "}
              <span className="text-bone-300">{site.crisisLine.label}</span>{" "}
              <a href={telHref(site.crisisLine.phone)} className="text-gold-300 underline-offset-4 hover:underline">
                {site.crisisLine.phone}
              </a>{" "}
              ({site.crisisLine.note}).
            </p>
            {isTodo(email) ? (
              <p className="t-small mt-4 text-bone-600">
                Kontaktní údaje upravíte v souboru <code className="text-bone-500">src/config/site.ts</code>.
              </p>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
