import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Brain } from "@/components/sections/Brain";
import { Services } from "@/components/sections/Services";
import { Companion } from "@/components/sections/Companion";
import { Gallery } from "@/components/sections/Gallery";
import { Journey } from "@/components/sections/Journey";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * Jedna stránka = jedna cesta:
 * HERO → CHAOS (ztráta) → UNDERSTANDING (příběh, mozek) → CHANGE (služby)
 * → SUPPORT (doprovázení) → NEW CONNECTIONS (momenty, cesta) → STABILITY
 * (důvěra) → NEW BEGINNING (kontakt)
 */
export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />
      <Story />
      <Brain />
      <Services />
      <Companion />
      <Gallery />
      <Journey />
      <Testimonials />
      <Contact />
    </>
  );
}
