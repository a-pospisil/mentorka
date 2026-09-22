/**
 * 07 CENÍK – podmínky spolupráce.
 * Jediný zdroj pravdy pro ceny; propisuje se do sekce Ceník i do
 * strukturovaných dat (Schema.org offers v src/components/seo/JsonLd.tsx).
 */

export const HOURLY_RATE_CZK = 1000;

/** První sezení trvá dvě hodiny. */
export const FIRST_SESSION_HOURS = 2;

/** Běžná cena prvního sezení – dvě hodiny za hodinovou sazbu. */
export const FIRST_SESSION_REGULAR_CZK = HOURLY_RATE_CZK * FIRST_SESSION_HOURS;

/** Zvýhodněná cena prvního sezení, za kterou se nabízí teď. */
export const FIRST_SESSION_PRICE_CZK = 1500;

/** 1 000 → „1 000 Kč“ (úzké pevné mezery, aby se cena nezalomila). */
export const formatCzk = (amount: number): string =>
  `${amount.toLocaleString("cs-CZ").replace(/ /g, " ")} Kč`;

export const pricingIntro = {
  label: "Ceník",
  headline: "Jasné podmínky. Žádná *překvapení*.",
  lead: "Začínáme nezávazně. Teprve pokud si budeme rozumět, domluvíme se na dalším postupu.",
};

export interface PriceItem {
  id: string;
  index: string;
  title: string;
  /** Délka setkání. */
  duration: string;
  /** Cena k zobrazení – už naformátovaná. */
  price: string;
  /** Běžná cena, pokud je `price` zvýhodněná. Zobrazí se přeškrtnutá. */
  priceRegular?: string;
  /** Doplněk pod cenou (např. z čeho se skládá). */
  priceNote?: string;
  /** Krátký štítek nad názvem, např. „Zvýhodněná cena“. */
  badge?: string;
  /** Forma setkání – osobně / online. */
  format: string;
  text: string;
  /** Zvýraznit kartu (nabídka zdarma). */
  highlight?: boolean;
}

export const pricing: PriceItem[] = [
  {
    id: "uvodni-rozhovor",
    index: "01",
    title: "Úvodní rozhovor",
    duration: "30 minut",
    price: "Zdarma",
    format: "Online i osobně",
    text: "Nezávazné seznámení. Řeknete mi, co právě prožíváte, a společně zjistíme, jestli je moje práce to, co vám teď pomůže.",
    highlight: true,
  },
  {
    id: "prvni-sezeni",
    index: "02",
    title: "První sezení",
    duration: `${FIRST_SESSION_HOURS} hodiny`,
    price: formatCzk(FIRST_SESSION_PRICE_CZK),
    priceRegular: formatCzk(FIRST_SESSION_REGULAR_CZK),
    priceNote: "Zvýhodněná cena prvního setkání.",
    badge: "Zvýhodněná cena",
    format: "Pouze osobně",
    text: "První setkání probíhá vždy naživo a má dvojnásobnou délku. Potřebujeme čas i klid na to, abychom pojmenovali, kde jste a kam chcete dojít.",
  },
  {
    id: "dalsi-sezeni",
    index: "03",
    title: "Další sezení",
    duration: "1 hodina",
    price: formatCzk(HOURLY_RATE_CZK),
    format: "Osobně i online",
    text: "Frekvenci si určujete sami. Scházíme se tak často, jak to dává smysl – ne podle předem daného balíčku.",
  },
];

/** Podmínky pod ceníkem – krátké, konkrétní, bez hvězdiček. */
export const pricingTerms: string[] = [
  "Úvodních 30 minut je zdarma a k ničemu vás nezavazuje.",
  "První sezení je možné pouze osobně – potkat se naživo je pro začátek spolupráce důležité.",
  `První sezení nabízím za zvýhodněných ${formatCzk(FIRST_SESSION_PRICE_CZK)} místo běžných ${formatCzk(FIRST_SESSION_REGULAR_CZK)}.`,
  "Další sezení mohou probíhat osobně i online, podle toho, co vám vyhovuje.",
  "Nepracuji s balíčky ani s minimálním počtem sezení. Platí se za jednotlivá setkání.",
];
