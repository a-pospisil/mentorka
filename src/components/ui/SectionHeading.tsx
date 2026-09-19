import { TextReveal } from "./TextReveal";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index?: string;
  label: string;
  headline: string;
  lead?: string;
  align?: "left" | "center";
  headlineClass?: string;
  as?: "h2" | "h3";
  id?: string;
  className?: string;
  tone?: "light" | "dark";
}

/** Editorial hlavička sekce: štítek s uzlem, velký serifový titulek, krátký úvod. */
export function SectionHeading({
  index,
  label,
  headline,
  lead,
  align = "left",
  headlineClass = "t-h2",
  as = "h2",
  id,
  className,
  tone = "light",
}: SectionHeadingProps) {
  const center = align === "center";
  const dark = tone === "dark";
  return (
    <div className={cn(center && "mx-auto text-center", className)}>
      <Reveal
        as="p"
        className={cn("t-label flex items-center gap-3", dark ? "text-gold-300" : "text-gold-700", center && "justify-center")}
      >
        <span className={cn("node", dark && "bg-gold-300")} aria-hidden="true" />
        {index ? <span className={dark ? "text-paper-400/60" : "text-ink-400"}>{index}</span> : null}
        <span>{label}</span>
      </Reveal>
      <TextReveal
        as={as}
        id={id}
        text={headline}
        className={cn("mt-6 max-w-[16ch]", dark ? "text-paper-50" : "text-ink-900", headlineClass, center && "mx-auto")}
      />
      {lead ? (
        <Reveal
          as="p"
          delay={0.2}
          className={cn("t-lead mt-7 max-w-[40ch]", dark ? "text-paper-300" : "text-ink-600", center && "mx-auto")}
        >
          {lead}
        </Reveal>
      ) : null}
    </div>
  );
}
