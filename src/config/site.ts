/**
 * Centrální konfigurace webu.
 * Kontaktní údaje a URL upravujte pouze zde – propisují se do navigace,
 * kontaktní sekce, patičky, SEO metadat i strukturovaných dat (Schema.org).
 *
 * Hodnoty začínající „TODO: DOPLNIT“ se na webu zobrazí jako zřetelně
 * označený placeholder, dokud je nenahradíte skutečným údajem.
 */

export const TODO_PREFIX = "TODO: DOPLNIT";

export const isTodo = (value?: string | null): boolean =>
  !value || value.trim().toUpperCase().startsWith("TODO");

export const site = {
  name: "Vladislava Pospíšilová",
  firstName: "Vladislava",
  /** Krátký popis role – používá se v metadatech a Schema.org. */
  role: "Mentorka, NLP a coaching",
  tagline: "NLP · Coaching · Prevence vyhoření · Podpora po ztrátě",
  /** TODO: DOPLNIT finální doménu (nebo nastavte NEXT_PUBLIC_SITE_URL). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vladislavapospisilova.cz",
  locale: "cs_CZ",
  language: "cs",
  description:
    "Vladislava Pospíšilová – NLP, coaching, prevence syndromu vyhoření a citlivé doprovázení po ztrátě blízkého člověka. Mozek není statický. A nemusí být ani váš příběh.",
  keywords: [
    "Vladislava Pospíšilová",
    "NLP",
    "neurolingvistické programování",
    "coaching",
    "koučink",
    "kouč",
    "prevence vyhoření",
    "syndrom vyhoření",
    "podpora při ztrátě blízkého",
    "doprovázení po ztrátě",
    "osobní rozvoj",
    "životní změna",
    "mentoring",
  ],

  contact: {
    email: `${TODO_PREFIX} e-mail`,
    phone: `${TODO_PREFIX} telefon`,
    /** Např. „Praha“ nebo „Praha · online“. */
    location: `${TODO_PREFIX} místo setkávání`,
    /** Volitelné: IČO, adresa provozovny apod. */
    company: "",
  },

  /** Volitelné odkazy na sociální sítě. Prázdné pole = sekce se nezobrazí. */
  social: [] as { label: string; href: string }[],

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

/** Navigace – kotvy odpovídají id sekcí na stránce. */
export const navigation = [
  { label: "O mně", href: "#pribeh" },
  { label: "NLP", href: "#nlp" },
  { label: "Coaching", href: "#coaching" },
  { label: "Vyhoření", href: "#vyhoreni" },
  { label: "Ztráta", href: "#ztrata" },
  { label: "Kontakt", href: "#kontakt" },
] as const;
