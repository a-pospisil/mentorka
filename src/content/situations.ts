/** 02 POZNÁTE SE V TOM? – konverzní sekce: začínáme problémem člověka, ne metodou. */
export const situationsIntro = {
  label: "Poznáte se v tom?",
  headline: "Možná jste právě *tady*.",
};

export interface Situation {
  id: string;
  index: string;
  quote: string;
  note: string;
  /** Seed dendritového glyfu (stejný seed = stejný tvar). */
  seed: number;
}

export const situations: Situation[] = [
  {
    id: "pretizeni",
    index: "01",
    quote: "Jsem dlouhodobě přetížený/á.",
    note: "Fungujete. Ale už dlouho jen na výkon a odpočinek nepomáhá.",
    seed: 1101,
  },
  {
    id: "zmena",
    index: "02",
    quote: "Vím, že potřebuji změnu, ale nevím jakou.",
    note: "Něco nesedí. Jen zatím nevíte co a kudy dál.",
    seed: 2202,
  },
  {
    id: "vzorce",
    index: "03",
    quote: "Opakuji pořád stejné vzorce.",
    note: "Jiné situace, jiní lidé. A přesto stejný konec.",
    seed: 3303,
  },
  {
    id: "ztrata",
    index: "04",
    quote: "Přišel/a jsem o někoho blízkého a nevím, jak dál.",
    note: "Svět jde dál. Vy potřebujete čas a prostor, ne rady.",
    seed: 4404,
  },
];

export const situationsOutro = {
  text: "Nemusíte přesně vědět, co potřebujete. Stačí vědět, že chcete něco změnit.",
  cta: "Probrat svou situaci",
};
