import { TODO_PREFIX } from "@/config/site";

/**
 * 07 DŮVĚRA – vzdělání, certifikace, praxe, reference.
 * Používejte pouze skutečné informace. Nic se nevymýšlí: položky začínající
 * „TODO: DOPLNIT“ se vykreslí jako zřetelně označený placeholder.
 * Prázdné pole = blok se nezobrazí. Když je `showPlaceholders` false,
 * placeholdery se skryjí i v případě, že v poli zůstaly.
 */

export interface TrustItem {
  title: string;
  /** Např. rok, instituce, rozsah. */
  meta?: string;
}

export interface Testimonial {
  quote: string;
  /** Jméno nebo iniciály (např. „M. K.“). */
  name: string;
  /** Např. „klientka, coaching“. */
  context?: string;
}

export const trustIntro = {
  label: "Důvěra",
  headline: "Zkušenost, vzdělání a lidé, kteří to *zažili*.",
};

/** Vzdělání, výcviky a certifikace. */
export const credentials: TrustItem[] = [
  { title: `${TODO_PREFIX} výcvik / certifikaci (např. NLP Practitioner)`, meta: `${TODO_PREFIX} rok · instituce` },
  { title: `${TODO_PREFIX} coachingový výcvik`, meta: `${TODO_PREFIX} rok · instituce` },
  { title: `${TODO_PREFIX} další vzdělání` },
];

/** Praxe – jen ověřená fakta. */
export const practice: TrustItem[] = [
  { title: "Osobní zkušenost se ztrátou blízkého člověka a s cestou zpět k životu." },
  { title: `${TODO_PREFIX} délku praxe (např. „X let individuální práce s klienty“)` },
  { title: `${TODO_PREFIX} formu setkání (osobně / online) a místo` },
];

/** Reference klientů – zatím prázdné, nic se nevymýšlí. */
export const testimonials: Testimonial[] = [];

/** Kolik placeholder karet referencí zobrazit, dokud reference nejsou. */
export const testimonialPlaceholders = 2;

export const showPlaceholders = true;
