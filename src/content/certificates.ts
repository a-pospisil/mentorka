import zivotniKouc from "@/assets/images/certifikat-zivotni-kouc.jpg";
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
  /** Datum a místo na dokumentu, doslova. */
  issued: string;
  /** Evidenční / kontrolní číslo certifikátu. */
  number?: string;
  /** Rozsah výcviku, např. počet hodin. */
  scope?: string;
  /** Státní akreditace výcviku. */
  accreditation?: {
    /** Text doslova z dokumentu (7. pád – „Akreditováno Ministerstvem…“). */
    text: string;
    /** Název akreditujícího orgánu v 1. pádě – pro strukturovaná data. */
    body: string;
  };
  /** Kdo výcvik certifikoval / garantuje. */
  certifiedBy?: string;
  image: StaticImageData;
  alt: string;
}

export const certificatesIntro = {
  label: "Certifikáty",
  title: "Doložené vzdělání",
};

/** Pořadí odpovídá číslování certifikátů (1 – Životní kouč, 2 – NLP). */
export const certificates: Certificate[] = [
  {
    id: "zivotni-kouc",
    title: "Životní kouč",
    issuer: "Radek Karban Coaching University",
    year: "2025",
    issued: "15. června 2025, Praha",
    number: "CŽK-2025-7014",
    scope: "Koučovací výcvik v rozsahu 120 hodin",
    accreditation: {
      text: "Akreditováno Ministerstvem školství, mládeže a tělovýchovy",
      body: "Ministerstvo školství, mládeže a tělovýchovy",
    },
    image: zivotniKouc,
    alt: "Certifikát Životní kouč vydaný Vladislavě Pospíšilové institucí Radek Karban Coaching University",
  },
  {
    id: "nlp-premiere-practitioner",
    title: "NLP Premiere Practitioner",
    issuer: "Radek Karban Coaching University",
    year: "2025",
    issued: "23. II. 2025, Praha",
    number: "2025016028",
    scope: "Komplexní výcvik NLP na úrovni praktika se závěrečnou zkouškou",
    certifiedBy: "John Grinder, Carmen Bostic St. Clair a Michael Carroll (ITCA NLP)",
    image: nlpPractitioner,
    alt: "Certifikát NLP Premiere Practitioner vydaný Vladislavě Pospíšilové institucí Radek Karban Coaching University",
  },
];
