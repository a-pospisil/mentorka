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

/** Produkční doména. Lze přebít proměnnou NEXT_PUBLIC_SITE_URL. */
const FALLBACK_SITE_URL = "https://mentorka.eu";

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
    email: "vladislava@mentorka.eu",
    phone: "776 313 594",
    /** Např. „Praha“ nebo „Praha · online“. Prázdné = nezobrazí se. */
    location: "",
    /** Volitelné: IČO, adresa provozovny apod. */
    company: "",
  },

  /** Volitelné odkazy na sociální sítě. Prázdné pole = nezobrazí se. */
  social: [] as { label: string; href: string }[],

  /**
   * Online rezervace termínů přes Google Workspace (účet vladislava@mentorka.eu).
   *
   * Jeden „Plánek schůzek“ (Appointment schedule) umí jen jednu délku setkání,
   * proto je potřeba vytvořit tři – pro každou položku ceníku jeden:
   *
   *   1. Google Kalendář → Vytvořit → Plánek schůzek
   *   2. nastavit délku (30 min / 2 h / 1 h), dostupnost, cenu a formulář
   *   3. Uložit → „Otevřít stránku rezervací“ → zkopírovat adresu
   *      (začíná https://calendar.google.com/calendar/appointments/schedules/)
   *   4. vložit níže ke správnému klíči
   *
   * Klíče odpovídají `id` položek v src/content/pricing.ts. Každá karta
   * ceníku s vyplněným odkazem dostane tlačítko Rezervovat; plánek uvedený
   * v `primary` je cílem hlavních tlačítek a vloženého kalendáře v Kontaktu.
   * Dokud je odkaz TODO, tlačítka otevírají e-mail.
   */
  booking: {
    schedules: {
      "uvodni-rozhovor": `${TODO_PREFIX} odkaz na plánek – úvodní rozhovor 30 min`,
      "prvni-sezeni": `${TODO_PREFIX} odkaz na plánek – první sezení 2 h`,
      "dalsi-sezeni": `${TODO_PREFIX} odkaz na plánek – další sezení 1 h`,
    } as Record<string, string>,
    /** Který plánek je cílem hlavních tlačítek a vloženého kalendáře. */
    primary: "uvodni-rozhovor",
    /**
     * Zobrazit v Kontaktu nápovědu, dokud není vyplněný žádný plánek.
     * Vypnuto = sekce rezervace se do té doby vůbec nevykreslí.
     * Jakmile odkazy doplníte, rezervace se zobrazí bez ohledu na tuto volbu.
     */
    showPlaceholder: false,
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

/**
 * Ověřený odkaz na plánek schůzek podle klíče (= id položky ceníku),
 * nebo null, dokud není vyplněný. Nehttps adresu záměrně odmítá –
 * rezervace se nesmí otevřít po nešifrovaném spojení.
 */
export const bookingUrlFor = (key: string): string | null => {
  const raw = site.booking.schedules[key];
  if (!raw || isTodo(raw)) return null;
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

/** Plánek, na který vedou hlavní tlačítka (výchozí: úvodních 30 minut zdarma). */
export const bookingUrl = (): string | null => bookingUrlFor(site.booking.primary);

/** Je vyplněný aspoň jeden plánek? */
export const hasAnyBooking = (): boolean =>
  Object.keys(site.booking.schedules).some((key) => bookingUrlFor(key) !== null);

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

/** Předvolba doplněná k devítimístnému českému číslu. */
const CZ_DIAL_CODE = "+420";

/**
 * Telefon v mezinárodním tvaru pro odkazy a strukturovaná data.
 * Devítimístné české číslo dostane předvolbu; kratší čísla (linky pomoci
 * jako 116 123) i čísla s vlastní předvolbou zůstávají beze změny.
 */
export const phoneE164 = (phone: string): string => {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  return digits.length === 9 ? `${CZ_DIAL_CODE}${digits}` : digits;
};

export const telHref = (phone: string): string => `tel:${phoneE164(phone)}`;

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
