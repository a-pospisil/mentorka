import nlpPractitioner from "@/assets/images/certifikat-nlp-practitioner.jpg";
import type { StaticImageData } from "next/image";

/**
 * Certifikáty – skeny doložených výcviků a zkoušek.
 * Přidání dalšího certifikátu: nahrát sken do src/assets/images (už správně
 * otočený, na šířku), importovat nahoře a přidat položku do pole níže.
 * Uvádějte jen to, co je na dokumentu skutečně napsané.
 */
export interface Certificate {
  /** Kotva a React key. */
  id: string;
  /** Název výcviku přesně podle dokumentu. */
  title: string;
  /** Instituce, která certifikát vydala. */
  issuer: string;
  /** Rok vydání – zobrazuje se u náhledu. */
  year: string;
  /** Datum na dokumentu, pro popisek v detailu. */
  issued: string;
  /** Evidenční číslo certifikátu. */
  number?: string;
  /** Kdo výcvik certifikoval / garantuje. */
  certifiedBy?: string;
  image: StaticImageData;
  alt: string;
}

export const certificatesIntro = {
  label: "Certifikáty",
  title: "Doložené vzdělání",
  note: "Kliknutím certifikát zvětšíte.",
};

export const certificates: Certificate[] = [
  {
    id: "nlp-premiere-practitioner",
    title: "NLP Premiere Practitioner",
    issuer: "Radek Karban Coaching University",
    year: "2025",
    issued: "23. II. 2025, Praha",
    number: "2025016028",
    certifiedBy: "John Grinder, Carmen Bostic St. Clair a Michael Carroll (ITCA NLP)",
    image: nlpPractitioner,
    alt: "Certifikát NLP Premiere Practitioner vydaný Vladislavě Pospíšilové institucí Radek Karban Coaching University",
  },
];
