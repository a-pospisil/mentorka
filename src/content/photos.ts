import portrait from "@/assets/images/vladislava-portrait.jpg";
import road from "@/assets/images/vladislava-road.jpg";
import blouse from "@/assets/images/vladislava-blouse.jpg";
import scarf from "@/assets/images/vladislava-scarf.jpg";
import city from "@/assets/images/vladislava-city.jpg";

/**
 * Fotografie mají na webu dramaturgickou roli – žádná galerie.
 * Přiřazení lze změnit zde; soubory jsou v src/assets/images.
 * (vladislava-dark.jpg – studiový portrét na černé – zůstává k dispozici,
 *  ve světlém designu se nepoužívá.)
 */

/** 01 Hero – velký portrét, kolem něj neuronové halo. */
export const heroPortrait = city;
/** 03 Příběh – jedna velká fotografie ve sticky sloupci. */
export const storyPortrait = scarf;
/** Cinematic fotografie uprostřed stránky – nový směr. */
export const cinematicPhoto = road;
/** 06 Jak to probíhá – malý vrstvený portrét u kroku „Potkáme se“. */
export const processPortrait = portrait;
/** 08 Finální CTA – portrét u závěrečné výzvy. */
export const contactPortrait = blouse;

export const photoAlt = {
  hero: "Vladislava Pospíšilová – portrét venku, v bílém saku s modrým šátkem",
  story: "Vladislava Pospíšilová s růžovo-modrým šátkem, jemný úsměv",
  cinematic: "Vladislava Pospíšilová stojí s rozpřaženýma rukama uprostřed silnice a směje se",
  process: "Vladislava Pospíšilová se srdečně směje",
  contact: "Vladislava Pospíšilová v bílé halence, usmívá se",
};
