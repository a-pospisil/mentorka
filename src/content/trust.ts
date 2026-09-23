/**
 * 08 DŮVĚRA – vzdělání, certifikace, praxe, reference.
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

/** Vzdělání, výcviky a certifikace – doložené dokumentem (viz certificates.ts). */
export const credentials: TrustItem[] = [
  {
    title: "Životní kouč",
    meta: "2025 · Radek Karban Coaching University · 120 hodin · akreditace MŠMT",
  },
  {
    title: "NLP Premiere Practitioner",
    meta: "2025 · Radek Karban Coaching University · ITCA NLP",
  },
];

/** Praxe – jen ověřená fakta. */
export const practice: TrustItem[] = [
  {
    title: "Téměř 30 let praxe v korporátním prostředí.",
    meta: "1994–2020",
  },
  {
    title: "Osobní zkušenost se ztrátou blízkého člověka a s cestou zpět k životu.",
    meta: "2018",
  },
  {
    title: "První setkání vždy osobně, navazující sezení osobně i online.",
  },
];

/** Reference klientů – zatím prázdné, nic se nevymýšlí. */
export const testimonials: Testimonial[] = [];

/**
 * Kolik placeholder karet referencí zobrazit, dokud reference nejsou.
 * 0 = sloupec Reference se na webu vůbec nezobrazí.
 */
export const testimonialPlaceholders = 0;

export const showPlaceholders = true;
