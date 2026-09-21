/**
 * Centrální konfigurace webu.
 * Kontaktní údaje a URL upravujte pouze zde – propisují se do navigace,
 * závěrečné výzvy, patičky, SEO metadat i strukturovaných dat (Schema.org).
 *
 * Hodnoty začínající „TODO: DOPLNIT“ se na webu zobrazí jako zřetelně
 * označený placeholder, dokud je nenahradíte skutečným údajem.
 */

export const TODO_PREFIX = "TODO: DOPLNIT";

export const isTodo = (value?: string | null): boolean =>
  !value || value.trim().toUpperCase().startsWith("TODO");

/** TODO: DOPLNIT finální doménu (nebo nastavte NEXT_PUBLIC_SITE_URL). */
const FALLBACK_SITE_URL = "https://www.vladislavapospisilova.cz";

/**
 * Veřejná URL webu pro canonical, Open Graph, sitemap a robots.
 * Priorita: NEXT_PUBLIC_SITE_URL → produkční doména Vercelu → výchozí doména.
 * Prázdná nebo nevalidní hodnota se ignoruje, aby build nikdy nespadl
 * na `new URL("")`.
 */
function resolveSiteUrl(): string {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const candidates = [process.env.NEXT_PUBLIC_SITE_URL, vercel ? `https://${vercel}` : undefined];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      // nevalidní hodnota – zkusit další kandidát
    }
  }
  return FALLBACK_SITE_URL;
}

export const site = {
  name: "Vladislava Pospíšilová",
  firstName: "Vladislava",
  /** Krátký popis role – používá se v metadatech a Schema.org. */
  role: "Mentorka · NLP · Coaching",
  tagline: "NLP · Coaching · Prevence vyhoření · Podpora po ztrátě",
  /** Viz resolveSiteUrl() – bez koncového lomítka. */
  url: resolveSiteUrl(),
  locale: "cs_CZ",
  language: "cs",
  description:
    "Vladislava Pospíšilová – NLP, coaching, prevence vyhoření a podpora po ztrátě blízkého. Když se život změní, můžete najít nový směr. Domluvte si nezávazný rozhovor.",
  keywords: [
    "Vladislava Pospíšilová",
    "NLP",
    "neurolingvistické programování",
    "coaching",
    "koučink",
    "kouč",
    "prevence vyhoření",
    "syndrom vyhoření",
    "podpora po ztrátě blízkého",
    "doprovázení po ztrátě",
    "osobní rozvoj",
    "životní změna",
    "mentoring",
  ],

  contact: {
    email: `${TODO_PREFIX} e-mail`,
    phone: `${TODO_PREFIX} telefon`,
    /** Např. „Praha“ nebo „Praha · online“. Prázdné = nezobrazí se. */
    location: "",
    /** Volitelné: IČO, adresa provozovny apod. */
    company: "",
  },

  /** Volitelné odkazy na sociální sítě. Prázdné pole = nezobrazí se. */
  social: [] as { label: string; href: string }[],

  /**
   * Rok, kdy Vladislava přišla o manžela. Text „před osmi lety“ se v příběhu
   * dopočítává z tohoto roku (viz src/content/story.ts), takže web nezestárne.
   */
  lossYear: 2018 as number | null,

  /**
   * Praxe v korporátním prostředí – doba před přechodem k mentoringu.
   * Propisuje se do sekce Důvěra a do strukturovaných dat.
   */
  corporate: {
    from: 1994,
    to: 2020,
  },

  /**
   * Bezplatná linka pomoci uvedená u tématu ztráty.
   * TODO: DOPLNIT – ověřte aktuálnost čísla před spuštěním webu.
   */
  crisisLine: {
    label: "Linka první psychické pomoci",
    phone: "116 123",
    note: "nonstop, zdarma",
  },

  /** Rok začátku provozu webu pro patičku (© od–do). */
  since: 2026,
};

export type Site = typeof site;

/** Odkaz pro primární CTA – mailto, pokud je e-mail vyplněný, jinak kotva na kontakt. */
export const contactHref = (): string =>
  isTodo(site.contact.email) ? "#kontakt" : `mailto:${site.contact.email}`;

export const telHref = (phone: string): string => `tel:${phone.replace(/\s+/g, "")}`;

/** Jednotný text primární výzvy napříč webem. */
export const CTA_PRIMARY = "Domluvit nezávazný rozhovor";
export const CTA_SHORT = "Domluvit rozhovor";

/** Navigace – kotvy odpovídají id sekcí na stránce. */
export const navigation = [
  { label: "Poznáte se?", href: "#situace" },
  { label: "Můj příběh", href: "#pribeh" },
  { label: "S čím pomáhám", href: "#pomoc" },
  { label: "Jak to probíhá", href: "#prubeh" },
  { label: "Ceník", href: "#cenik" },
  { label: "Kontakt", href: "#kontakt" },
] as const;
