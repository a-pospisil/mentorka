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
}

/** Editorial hlavička sekce: číslo + štítek, velký serifový titulek, úvodní text. */
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
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={cn(center && "mx-auto text-center", className)}>
      <Reveal
        as="p"
        className={cn(
          "t-label flex items-center gap-3 text-gold-400",
          center && "justify-center",
        )}
      >
        <span className="node" aria-hidden="true" />
        {index ? <span className="text-bone-500">{index}</span> : null}
        <span>{label}</span>
      </Reveal>
      <TextReveal
        as={as}
        id={id}
        text={headline}
        className={cn("mt-6 max-w-[16ch] text-bone-50", headlineClass, center && "mx-auto")}
      />
      {lead ? (
        <Reveal
          as="p"
          delay={0.2}
          className={cn("t-lead mt-8 max-w-[38ch] text-bone-300", center && "mx-auto")}
        >
          {lead}
        </Reveal>
      ) : null}
    </div>
  );
}
