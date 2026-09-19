export type ServiceGlyphKind = "nlp" | "coaching" | "burnout" | "loss";

export interface Service {
  /** Kotva v navigaci (#nlp, #coaching, #vyhoreni, #ztrata). */
  id: string;
  index: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  glyph: ServiceGlyphKind;
  note?: string;
}

export const servicesIntro = {
  label: "S čím pomáhám",
  headline: "Čtyři oblasti. Jeden *společný* základ.",
  lead:
    "Ať přicházíte s přetížením, s rozhodnutím, které odkládáte, nebo se ztrátou, o které nejde mluvit – vždy pracujeme s tím, jak myslíte, co cítíte a jak reagujete.",
};

export const services: Service[] = [
  {
    id: "nlp",
    index: "01",
    title: "NLP a práce s myšlenkovými vzorci",
    short: "NLP",
    description:
      "Pomoc při změně zažitých způsobů uvažování, komunikace a reakcí.",
    bullets: [
      "Opakující se myšlenky a vnitřní dialog",
      "Reakce, které se spouštějí dřív, než si to uvědomíte",
      "Jazyk, kterým mluvíte sami se sebou i s druhými",
    ],
    glyph: "nlp",
  },
  {
    id: "coaching",
    index: "02",
    title: "Coaching",
    short: "Coaching",
    description:
      "Individuální práce zaměřená na konkrétní životní nebo pracovní situace.",
    bullets: [
      "Rozhodnutí, která odkládáte",
      "Změna role, práce nebo životní etapy",
      "Cíle, ke kterým se opakovaně nedaří dojít",
    ],
    glyph: "coaching",
  },
  {
    id: "vyhoreni",
    index: "03",
    title: "Prevence vyhoření",
    short: "Vyhoření",
    description:
      "Práce s dlouhodobým přetížením, hranicemi, prioritami a schopností včas rozpoznat varovné signály.",
    bullets: [
      "Dlouhodobé přetížení a ztráta energie",
      "Hranice v práci i ve vztazích",
      "Včasné rozpoznání varovných signálů",
    ],
    glyph: "burnout",
  },
  {
    id: "ztrata",
    index: "04",
    title: "Podpora po ztrátě blízkého",
    short: "Ztráta",
    description:
      "Citlivé individuální provázení člověka v období po významné životní ztrátě.",
    bullets: [
      "Prostor pro to, co nejde říct okolí",
      "Doprovázení bez tlaku na tempo a na „správné“ prožívání",
      "Návrat ke každodennímu životu vlastním způsobem",
    ],
    glyph: "loss",
    note:
      "Doprovázení po ztrátě není psychoterapie ani zdravotní péče. Pokud procházíte akutní krizí, obraťte se prosím na odbornou pomoc.",
  },
];

/** Jak spolupráce probíhá – obecné kroky, žádné vymyšlené údaje. */
export const process = [
  {
    index: "01",
    title: "Úvodní rozhovor",
    text: "Nezávazné setkání, ve kterém si řekneme, s čím přicházíte a zda si lidsky sedneme.",
  },
  {
    index: "02",
    title: "Společná práce",
    text: "Individuální setkání podle vaší situace. Tempo i témata určujete vy.",
  },
  {
    index: "03",
    title: "Vlastní cesta",
    text: "Cílem je, abyste mě časem nepotřebovali. Aby nové vzorce fungovaly bez mé přítomnosti.",
  },
];

/** TODO: DOPLNIT praktické informace (forma setkání, délka, cena). */
export const practicalInfo = "TODO: DOPLNIT praktické informace – forma setkání (osobně / online), délka a cena";
