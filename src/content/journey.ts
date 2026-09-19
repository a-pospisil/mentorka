export interface JourneyStep {
  id: string;
  /** Volitelný časový údaj – zobrazí se jen pokud je vyplněný (např. „2018“). */
  when?: string;
  title: string;
  text: string;
}

export const journeyIntro = {
  label: "Moje cesta",
  headline: "Cesta, která se dá *projít*.",
  lead: "Nebyla přímá. Ale každý její bod dnes dává smysl.",
};

export const journey: JourneyStep[] = [
  {
    id: "zkusenost",
    when: "Před lety",
    title: "Osobní zkušenost se ztrátou",
    text: "Zkušenost, kterou bych nikomu nepřála. A která mě naučila, co lidé v těžkém období opravdu potřebují.",
  },
  {
    id: "hledani",
    title: "Hledání odpovědí",
    text: "Otázky, na které knihy odpovídaly jen částečně. Zbytek bylo potřeba prožít.",
  },
  {
    id: "studium",
    title: "Studium a práce na sobě",
    text: "Vzdělávání, výcviky a především vlastní, poctivá práce s tím, co jsem prožívala.",
  },
  {
    id: "nlp",
    title: "NLP a coaching",
    text: "Metody, které daly mé zkušenosti strukturu a jazyk. A ukázaly, že změna má svá pravidla.",
  },
  {
    id: "klienti",
    title: "Práce s klienty",
    text: "Individuální doprovázení lidí v období změny, přetížení nebo ztráty.",
  },
  {
    id: "dnes",
    when: "Dnes",
    title: "Pomáhám lidem procházet změnou",
    text: "S respektem k jejich tempu, jejich příběhu a jejich vlastním odpovědím.",
  },
];

/**
 * Vzdělání, výcviky a certifikace.
 * Nevymýšlíme žádné údaje – doplňte skutečné položky, nebo pole nechte prázdné
 * (blok se pak nezobrazí).
 */
export const credentials: string[] = [
  "TODO: DOPLNIT výcvik / certifikaci (např. NLP Practitioner)",
  "TODO: DOPLNIT coachingový výcvik",
  "TODO: DOPLNIT další vzdělání a praxe",
];
