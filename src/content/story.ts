import { site } from "@/config/site";
import type { NeuralPresetName } from "@/lib/neural/presets";

/**
 * 03 PŘÍBĚH – zkrácený storytelling: ZTRÁTA → HLEDÁNÍ → POCHOPENÍ → NOVÝ SMĚR → POMOC DRUHÝM.
 * Fakta odpovídají zadání (ztráta manžela před osmi lety); nic dalšího se nevymýšlí.
 */

const YEARS: Record<number, string> = {
  2: "dvěma", 3: "třemi", 4: "čtyřmi", 5: "pěti", 6: "šesti", 7: "sedmi", 8: "osmi", 9: "devíti",
  10: "deseti", 11: "jedenácti", 12: "dvanácti", 13: "třinácti", 14: "čtrnácti", 15: "patnácti",
};

/** „osmi lety“ – nebo spočítané z site.lossYear, pokud je vyplněný. */
export const yearsAgoText = (): string => {
  if (!site.lossYear) return "osmi lety";
  const n = new Date().getFullYear() - site.lossYear;
  if (n <= 1) return "rokem";
  return `${YEARS[n] ?? n} lety`;
};

export const storyIntro = {
  label: "Můj příběh",
  headline: `Před ${yearsAgoText()} jsem přišla o *manžela*.`,
  lead: "To, co následovalo, mě naučilo víc než jakákoli kniha. A přivedlo mě k práci, kterou dnes dělám.",
};

export interface StoryStep {
  id: string;
  label: string;
  text: string;
  neural: NeuralPresetName;
}

export const storySteps: StoryStep[] = [
  {
    id: "ztrata",
    label: "Ztráta",
    text: "Skončil společný život. A s ním i ta verze mě, která existovala jen vedle něj.",
    neural: "loss",
  },
  {
    id: "hledani",
    label: "Hledání",
    text: "Okolí se vrátilo ke svým dnům. Já hledala, jak žít dál. Ne jak zapomenout.",
    neural: "searching",
  },
  {
    id: "pochopeni",
    label: "Pochopení",
    text: "Myšlenky, které se vracejí, nejsou osud. Jsou to vzorce. A vzorce se dají měnit.",
    neural: "understanding",
  },
  {
    id: "novy-smer",
    label: "Nový směr",
    text: "NLP a coaching mi daly jazyk i nástroje. Život se nevrátil do starých kolejí. Našel nové.",
    neural: "direction",
  },
  {
    id: "pomoc-druhym",
    label: "Pomoc druhým",
    text: "Dnes stojím vedle lidí, kteří jsou tam, kde jsem byla já. Bez rychlých řešení. S časem a pozorností.",
    neural: "helping",
  },
];

export const storyOutro = {
  caption: "Nový směr",
  quote: "Směr se neztratil. Jen jsem ho musela znovu *najít*.",
};
