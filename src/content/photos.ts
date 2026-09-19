import type { StaticImageData } from "next/image";
import portrait from "@/assets/images/vladislava-portrait.jpg";
import road from "@/assets/images/vladislava-road.jpg";

export { portrait, road };

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
 * naimportujte je výše a přidejte položku sem. Placeholdery odstraňte.
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
    id: "todo-work",
    alt: "",
    caption: "Z práce s klienty",
    ratio: "4/5",
    placeholder: true,
  },
  {
    id: "portrait-detail",
    src: portrait,
    alt: "Detail úsměvu Vladislavy Pospíšilové",
    caption: "Detail",
    ratio: "1/1",
    treatment: "warm",
    position: "50% 55%",
  },
  {
    id: "todo-life",
    alt: "",
    caption: "Z běžného života",
    ratio: "16/10",
    placeholder: true,
  },
];
