import type { NeuralPresetName } from "@/lib/neural/presets";

/**
 * Příběh Vladislavy – texty jsou pracovní verze v profesionálním tónu.
 * Události odpovídají zadání (ztráta manžela před osmi lety); vše ostatní
 * je formulováno obecně, bez konkrétních vymyšlených údajů.
 *
 * TODO: DOPLNIT – zkontrolujte časové údaje („před osmi lety“) při spuštění.
 */

export const storyIntro = {
  label: "Příběh",
  headline: "Některé věci pochopíme až ve chvíli, kdy je sami *prožijeme*.",
  quiet:
    "Před osmi lety jsem přišla o manžela. To, co následovalo, mě naučilo víc než jakákoli kniha: jak se člověk ztrácí, jak dlouho trvá ticho a jak nenápadně se vrací život.",
};

export interface StoryChapter {
  id: string;
  label: string;
  title: string;
  text: string;
  neural: NeuralPresetName;
}

export const storyChapters: StoryChapter[] = [
  {
    id: "ztrata",
    label: "Ztráta",
    title: "V jediném okamžiku se rozpadlo všechno, co jsem považovala za samozřejmé.",
    text:
      "Nebyl to jen konec společného života. Byl to i konec té verze mě, která existovala jen vedle něj. Najednou jsem nevěděla, kdo jsem, když nejsem něčí žena.",
    neural: "loss",
  },
  {
    id: "ticho",
    label: "Ticho",
    title: "Svět jde dál. Vy ne.",
    text:
      "Po ztrátě přichází ticho. Telefony postupně přestávají zvonit, okolí se vrací ke svým dnům a člověk zůstává sám s otázkou, co teď. Nepotřebovala jsem rady. Potřebovala jsem někoho, kdo vydrží být vedle mě.",
    neural: "silence",
  },
  {
    id: "hledani",
    label: "Hledání",
    title: "Hledala jsem, jak žít dál. Ne jak zapomenout.",
    text:
      "Četla jsem, ptala se, zkoušela. Postupně jsem pochopila, že bolest se nedá obejít, ale dá se projít. A že způsob, jakým o sobě přemýšlíme, rozhoduje o tom, kudy půjdeme dál.",
    neural: "searching",
  },
  {
    id: "pochopeni",
    label: "Pochopení",
    title: "Vzorce nejsou osud.",
    text:
      "Objevila jsem, jak mozek vytváří vzorce: myšlenky, které se vracejí, reakce, které se spouštějí samy. A také to, že žádný z těchto vzorců není konečný. Dá se pozorovat, pojmenovat a krok za krokem měnit.",
    neural: "understanding",
  },
  {
    id: "novy-smer",
    label: "Nový směr",
    title: "Život se nevrátil do starých kolejí. Našel nové.",
    text:
      "Cesta k NLP a coachingu mi dala jazyk pro to, co jsem prožila, a nástroje, jak s tím pracovat. Ne proti bolesti, ale s ní. Ne rychle, ale opravdově.",
    neural: "direction",
  },
  {
    id: "pomoc-druhym",
    label: "Pomoc druhým",
    title: "Dnes stojím vedle lidí, kteří jsou tam, kde jsem kdysi byla já.",
    text:
      "Neslibuji rychlá řešení. Nabízím čas, pozornost a metody, které fungují i ve chvíli, kdy se změna zdá nemožná.",
    neural: "helping",
  },
];

export const storyOutro = {
  quote: "Směr se neztratil. Jen jsem ho musela znovu *najít*.",
  caption: "Nový směr",
};
