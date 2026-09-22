import { Hero } from "@/components/sections/Hero";
import { Situations } from "@/components/sections/Situations";
import { Story } from "@/components/sections/Story";
import { Patterns } from "@/components/sections/Patterns";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
import { Trust } from "@/components/sections/Trust";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * Jedna stránka, jedna cesta:
 * ZASTAVÍ (hero) → POZNÁ SE (situace) → ZAUJME (příběh, vzorce)
 * → ZAČNE DŮVĚŘOVAT (pomoc, průběh, ceník, důvěra) → NAPÍŠE (finální CTA).
 */
export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />
      <Situations />
      <Story />
      <Patterns />
      <Services />
      <Process />
      <Pricing />
      <Trust />
      <FinalCta />
    </>
  );
}
