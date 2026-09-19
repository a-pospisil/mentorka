import type { StaticImageData } from "next/image";
import portrait from "@/assets/images/vladislava-portrait.jpg";
import road from "@/assets/images/vladislava-road.jpg";
import dark from "@/assets/images/vladislava-dark.jpg";
import blouse from "@/assets/images/vladislava-blouse.jpg";
import scarf from "@/assets/images/vladislava-scarf.jpg";
import city from "@/assets/images/vladislava-city.jpg";

export { portrait, road, dark, blouse, scarf, city };

/** Hero – studiový portrét na černém pozadí splývá s tmavým webem. */
export const heroPortrait = dark;
/** Příběh – portrét ve sticky sloupci, který se s příběhem „vrací do barev“. */
export const storyPortrait = city;
/** Kontakt – malý černobílý portrét u závěrečné výzvy. */
export const contactPortrait = blouse;

export type PhotoTreatment = "color" | "mono" | "warm";

export interface Photo {
  id: string;
  src?: StaticImageData;
  alt: string;
  caption: string;
  /** Poměr stran rámu v galerii. */
  ratio: "3/4" | "4/5" | "1/1" | "3/2" | "16/10";
  /** Barevná úprava přes CSS – umožňuje z jedné fotografie vytvořit více nálad. */
  treatment?: PhotoTreatment;
  /** object-position pro výřez. */
  position?: string;
  /** Placeholder pro dosud nedodanou fotografii. */
  placeholder?: boolean;
}

export const galleryIntro = {
  label: "Momenty",
  headline: "Práce, život, *ticho* mezi tím.",
};

/**
 * Galerie je řízená daty. Nové fotografie vložte do src/assets/images,
 * naimportujte je výše a přidejte položku sem.
 * Položka s `placeholder: true` vykreslí elegantní prázdný rám (TODO: DOPLNIT).
 */
export const photos: Photo[] = [
  {
    id: "portrait-mono",
    src: portrait,
    alt: "Černobílý portrét Vladislavy Pospíšilové, usmívá se",
    caption: "Portrét",
    ratio: "3/4",
    treatment: "mono",
    position: "50% 30%",
  },
  {
    id: "road",
    src: road,
    alt: "Vladislava Pospíšilová stojí s rozpřaženýma rukama uprostřed silnice a směje se",
    caption: "Nový směr",
    ratio: "3/2",
    treatment: "warm",
  },
  {
    id: "city",
    src: city,
    alt: "Vladislava Pospíšilová venku před prosklenou budovou, v bílém saku s modrým šátkem",
    caption: "Ve městě",
    ratio: "4/5",
    treatment: "color",
    position: "50% 25%",
  },
  {
    id: "detail",
    src: blouse,
    alt: "Detail úsměvu Vladislavy Pospíšilové v bílé halence",
    caption: "Detail",
    ratio: "1/1",
    treatment: "warm",
    position: "50% 12%",
  },
  {
    id: "scarf",
    src: scarf,
    alt: "Vladislava Pospíšilová s růžovo-modrým šátkem a perlovým náhrdelníkem",
    caption: "Radost",
    ratio: "3/4",
    treatment: "warm",
    position: "50% 30%",
  },
];
