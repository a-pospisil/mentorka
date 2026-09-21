/**
 * 07 CENÍK – podmínky spolupráce.
 * Jediný zdroj pravdy pro ceny; propisuje se do sekce Ceník i do
 * strukturovaných dat (Schema.org offers v src/components/seo/JsonLd.tsx).
 */

export const HOURLY_RATE_CZK = 1000;

/** První sezení trvá dvě hodiny – cena je 2 × hodinová sazba. */
export const FIRST_SESSION_HOURS = 2;
export const FIRST_SESSION_PRICE_CZK = HOURLY_RATE_CZK * FIRST_SESSION_HOURS;

/** 1 000 → „1 000 Kč“ (pevná mezera, aby se cena nezalomila). */
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
  /** Doplněk pod cenou (např. z čeho se skládá). */
  priceNote?: string;
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
    priceNote: `${FIRST_SESSION_HOURS} × ${formatCzk(HOURLY_RATE_CZK)}`,
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
  "Další sezení mohou probíhat osobně i online, podle toho, co vám vyhovuje.",
  "Nepracuji s balíčky ani s minimálním počtem sezení. Platí se za jednotlivá setkání.",
];
