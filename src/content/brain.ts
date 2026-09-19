/**
 * Sekce „Mozek není statický“ – neuroplasticita srozumitelně.
 */

export const brainIntro = {
  label: "Neuroplasticita",
  headline: "Mozek není statický. A nemusí být ani váš *příběh*.",
  lead:
    "Každý den mozek posiluje spoje, které používáme nejčastěji. Proto se návyky zdají tak pevné. A právě proto se dají měnit.",
};

export interface BrainStep {
  id: string;
  title: string;
  text: string;
}

/** podnět → myšlenka → emoce → reakce → nový vzorec */
export const brainSteps: BrainStep[] = [
  {
    id: "podnet",
    title: "Podnět",
    text: "Něco se stane. Slovo, pohled, vzpomínka, e-mail. Situace sama o sobě nemá význam – ten jí teprve dáme.",
  },
  {
    id: "myslenka",
    title: "Myšlenka",
    text: "Mozek situaci bleskově vyhodnotí. Většinou podle starého vzorce a tak rychle, že si toho nevšimneme.",
  },
  {
    id: "emoce",
    title: "Emoce",
    text: "Vyhodnocení spustí pocit. Úzkost, vztek, stud, únavu. Emoce nereaguje na situaci, ale na naši interpretaci.",
  },
  {
    id: "reakce",
    title: "Reakce",
    text: "Pocit vede k chování. Často automatickému a často stejnému jako minule. Tím se dráha znovu posílí.",
  },
  {
    id: "novy-vzorec",
    title: "Nový vzorec",
    text: "Když si cyklus všimneme, získáme prostor zvolit jinou odpověď. Každé opakování nové reakce posiluje novou dráhu.",
  },
];

export interface BrainFact {
  id: string;
  index: string;
  title: string;
  text: string;
}

export const brainFacts: BrainFact[] = [
  {
    id: "navyky",
    index: "01",
    title: "Jak vznikají návyky",
    text:
      "Když se určitá reakce opakuje, nervová dráha se posiluje. Mozek šetří energii a příště ji spustí automaticky. Návyk není povahový rys. Je to dobře vyšlapaná cesta.",
  },
  {
    id: "vzorce",
    index: "02",
    title: "Jak fungují myšlenkové vzorce",
    text:
      "Mezi tím, co se stane, a tím, jak se cítíme, je vždy myšlenka. Většinou proběhne tak rychle, že ji nezaznamenáme. Přesto rozhoduje o emoci i o tom, co uděláme.",
  },
  {
    id: "reakce",
    index: "03",
    title: "Jak se učíme nové reakce",
    text:
      "Změna nezačíná silou vůle, ale pozorností. Když si vzorec všimneme, vzniká prostor pro jinou odpověď. Každé její opakování ji dělá o něco přirozenější.",
  },
  {
    id: "nlp",
    index: "04",
    title: "Jak pracuje NLP",
    text:
      "Neurolingvistické programování pracuje s jazykem, pozorností a vnitřními představami. Pomáhá zjistit, jak si situaci uvnitř zobrazujeme, a tento obraz vědomě upravit.",
  },
  {
    id: "zmena",
    index: "05",
    title: "Proč je změna možná",
    text:
      "Mozek se učí celý život. Neuroplasticita znamená, že nové spoje vznikají i v dospělosti – zejména tam, kde je opakování, emoce a smysl. Změna není výjimka. Je to způsob, jak mozek funguje.",
  },
];
