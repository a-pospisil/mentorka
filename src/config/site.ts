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
    email: "vladislava@mentorka.cz",
    phone: `${TODO_PREFIX} telefon`,
    /** Např. „Praha“ nebo „Praha · online“. Prázdné = nezobrazí se. */
    location: "",
    /** Volitelné: IČO, adresa provozovny apod. */
    company: "",
  },

  /** Volitelné odkazy na sociální sítě. Prázdné pole = nezobrazí se. */
  social: [] as { label: string; href: string }[],

  /**
   * Online rezervace termínů přes Google Workspace.
   *
   * Jak odkaz získat: Google Kalendář → Vytvořit → „Plánek schůzek“
   * (Appointment schedule) → nastavit délku, dostupnost a rezervační
   * formulář → Uložit → tlačítko „Otevřít stránku rezervací“ → zkopírovat
   * adresu (začíná https://calendar.google.com/calendar/appointments/schedules/).
   *
   * Jakmile je odkaz vyplněný, hlavní tlačítka vedou na rezervaci
   * a v sekci Kontakt se zobrazí vložený rezervační kalendář.
   * Dokud je TODO, tlačítka otevírají e-mail.
   *
   * TODO: DOPLNIT odkaz na plánek schůzek (viz postup výše).
   */
  booking: {
    url: `${TODO_PREFIX} odkaz na rezervační stránku Google Kalendáře`,
    /** Vložit rezervační kalendář přímo do stránky (iframe). */
    embed: true,
  },

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

/** Ověřená adresa rezervační stránky, nebo null, dokud není vyplněná. */
export const bookingUrl = (): string | null => {
  if (isTodo(site.booking.url)) return null;
  try {
    const url = new URL(site.booking.url.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

/**
 * Zdroj pro vložený rezervační kalendář. Google vyžaduje parametr `gv=true`,
 * jinak místo formuláře zobrazí plnou stránku kalendáře.
 */
export const bookingEmbedSrc = (): string | null => {
  const raw = bookingUrl();
  if (!raw || !site.booking.embed) return null;
  const url = new URL(raw);
  url.searchParams.set("gv", "true");
  return url.toString();
};

/**
 * Cíl hlavních výzev napříč webem: rezervace, když je nastavená,
 * jinak e-mail. Externí odkaz se otevírá v novém panelu.
 */
export const ctaLinkProps = (): {
  href: string;
  target?: "_blank";
  rel?: "noopener noreferrer";
} => {
  const booking = bookingUrl();
  return booking
    ? { href: booking, target: "_blank", rel: "noopener noreferrer" }
    : { href: contactHref() };
};

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
