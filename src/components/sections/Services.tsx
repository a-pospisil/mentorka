"use client";

import { useState } from "react";
import { contactHref } from "@/config/site";
import { process, services, servicesIntro } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Arrow";
import { ServiceGlyph } from "./ServiceGlyph";
import { cn } from "@/lib/utils";

/** Čtyři oblasti služeb – každá s vlastní neuronovou mikro-animací. */
export function Services() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="sluzby" data-neural="services" className="relative">
      <div className="page-container section-space">
        <SectionHeading
          index="03"
          label={servicesIntro.label}
          headline={servicesIntro.headline}
          lead={servicesIntro.lead}
        />

        <div className="mt-20 grid gap-px border hairline bg-bone-100/5 lg:mt-28 lg:grid-cols-2">
          {services.map((service, i) => {
            const isHovered = hovered === service.id;
            return (
              <Reveal
                key={service.id}
                id={service.id}
                delay={i * 0.08}
                className={cn(
                  "group relative scroll-mt-28 bg-ink-950/70 p-8 backdrop-blur-sm transition-colors duration-700 sm:p-10 lg:p-14",
                  isHovered && "bg-ink-900/80",
                )}
                style={{ transitionProperty: "background-color, opacity, transform" }}
              >
                <article
                  onMouseEnter={() => setHovered(service.id)}
                  onMouseLeave={() => setHovered((v) => (v === service.id ? null : v))}
                  onFocus={() => setHovered(service.id)}
                  onBlur={() => setHovered((v) => (v === service.id ? null : v))}
                  className="flex h-full flex-col"
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="t-label text-bone-500">{service.index}</span>
                    <div className="w-28 shrink-0 sm:w-32 lg:w-36">
                      <ServiceGlyph kind={service.glyph} active={isHovered} />
                    </div>
                  </div>
                  <h3 className="-mt-10 max-w-[14ch] font-serif text-3xl font-light text-bone-50 lg:text-4xl">
                    {service.title}
                  </h3>
                  <p className="t-body mt-6 max-w-[46ch] text-bone-300">{service.description}</p>
                  <ul className="mt-8 flex flex-col gap-3">
                    {service.bullets.map((b) => (
                      <li key={b} className="t-small flex gap-4 text-bone-400">
                        <span
                          aria-hidden="true"
                          className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-gold-500"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {service.note ? (
                    <p className="mt-8 border-l hairline-strong pl-4 text-[0.8rem] leading-relaxed text-bone-500">
                      {service.note}
                    </p>
                  ) : null}
                  <div className="mt-auto pt-10">
                    <a
                      href={contactHref()}
                      className="link-line t-label text-bone-200 transition-colors duration-500 group-hover:text-gold-300"
                    >
                      Domluvit rozhovor
                      <Arrow />
                    </a>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-0 border border-gold-400/0 transition-colors duration-700",
                      isHovered && "border-gold-400/30",
                    )}
                  />
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Jak spolupráce probíhá */}
        <div className="mt-24 grid gap-12 lg:mt-36 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal as="p" className="t-label flex items-center gap-3 text-gold-400">
              <span className="node" aria-hidden="true" />
              Jak spolupráce probíhá
            </Reveal>
            <Reveal as="p" delay={0.1} className="t-lead mt-6 max-w-[28ch] text-bone-300">
              Bez slibů, které nejde dodržet. S jasným začátkem a s respektem k vašemu tempu.
            </Reveal>
          </div>
          <Reveal as="ol" stagger={0.12} className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {process.map((step) => (
              <li key={step.index} className="border-t hairline pt-6">
                <p className="t-label text-bone-500">{step.index}</p>
                <h3 className="mt-4 font-serif text-2xl font-light text-bone-50">{step.title}</h3>
                <p className="t-small mt-3 text-bone-400">{step.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
