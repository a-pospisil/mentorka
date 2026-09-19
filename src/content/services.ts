/** 05 S ČÍM POMÁHÁM – čtyři oblasti, každá max. 2–3 věty. */
export const servicesIntro = {
  label: "S čím pomáhám",
  headline: "Čtyři oblasti. Jeden *základ*.",
  lead: "Metody jsou různé. Základ je vždy stejný: jak myslíte, co cítíte a jak reagujete.",
};

export interface Service {
  /** Kotva (#nlp, #coaching, #vyhoreni, #ztrata). */
  id: string;
  index: string;
  title: string;
  text: string;
  more: string;
  seed: number;
  note?: string;
}

export const services: Service[] = [
  {
    id: "nlp",
    index: "01",
    title: "NLP",
    text: "Když chcete změnit způsob, jakým přemýšlíte a reagujete.",
    more: "Pracujeme s jazykem, pozorností a vnitřními obrazy, které spouštějí vaše automatické reakce.",
    seed: 5105,
  },
  {
    id: "coaching",
    index: "02",
    title: "Coaching",
    text: "Když stojíte před rozhodnutím a potřebujete si ujasnit další krok.",
    more: "Konkrétní situace, konkrétní otázky. Odpovědi zůstávají vaše.",
    seed: 6206,
  },
  {
    id: "vyhoreni",
    index: "03",
    title: "Prevence vyhoření",
    text: "Když už dlouho jedete na výkon a začíná vám docházet energie.",
    more: "Hranice, priority a včasné rozpoznání signálů. Dřív, než vás zastaví tělo.",
    seed: 7307,
  },
  {
    id: "ztrata",
    index: "04",
    title: "Podpora po ztrátě",
    text: "Když se váš svět změnil a potřebujete prostor najít nový způsob, jak žít dál.",
    more: "Bez tlaku na tempo. Bez „správného“ prožívání.",
    seed: 8408,
    note: "Doprovázení po ztrátě nenahrazuje psychoterapii ani zdravotní péči.",
  },
];
