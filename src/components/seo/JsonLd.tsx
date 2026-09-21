import { bookingUrl, isTodo, site } from "@/config/site";
import { services } from "@/content/services";
import { certificates } from "@/content/certificates";
import {
  HOURLY_RATE_CZK,
  FIRST_SESSION_HOURS,
  FIRST_SESSION_PRICE_CZK,
} from "@/content/pricing";

/**
 * Schema.org – Person + WebSite + nabízené služby + ceny.
 * Neuvádí žádné neověřené údaje (kontakty jen pokud jsou vyplněné).
 */
export function JsonLd() {
  const personId = `${site.url}/#person`;
  const booking = bookingUrl();

  const credentialItems = certificates.map((cert) => ({
    "@type": "EducationalOccupationalCredential",
    "@id": `${site.url}/#cert-${cert.id}`,
    name: cert.title,
    credentialCategory: "certificate",
    recognizedBy: { "@type": "Organization", name: cert.issuer },
    ...(cert.number ? { identifier: cert.number } : {}),
  }));

  const person = {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    givenName: "Vladislava",
    familyName: "Pospíšilová",
    url: site.url,
    image: `${site.url}/opengraph-image`,
    jobTitle: site.role,
    description: site.description,
    knowsAbout: [
      "Neurolingvistické programování (NLP)",
      "Coaching",
      "Prevence syndromu vyhoření",
      "Podpora po ztrátě blízkého",
      "Osobní rozvoj",
    ],
    ...(credentialItems.length ? { hasCredential: credentialItems } : {}),
    ...(isTodo(site.contact.email) ? {} : { email: `mailto:${site.contact.email}` }),
    ...(isTodo(site.contact.phone) ? {} : { telephone: site.contact.phone }),
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
  };

  /** Ceny platné pro všechny služby: úvod zdarma, první sezení 2 h, další 1 h. */
  const offers = [
    {
      "@type": "Offer",
      name: "Úvodní rozhovor",
      description: "Nezávazný úvodní rozhovor online nebo osobně.",
      price: 0,
      priceCurrency: "CZK",
      availability: "https://schema.org/InStock",
      eligibleDuration: { "@type": "QuantitativeValue", value: 30, unitCode: "MIN" },
    },
    {
      "@type": "Offer",
      name: "První sezení",
      description:
        "První setkání probíhá vždy osobně a trvá dvě hodiny. Nabízeno za zvýhodněnou cenu.",
      price: FIRST_SESSION_PRICE_CZK,
      priceCurrency: "CZK",
      availability: "https://schema.org/InStock",
      eligibleDuration: { "@type": "QuantitativeValue", value: FIRST_SESSION_HOURS, unitCode: "HUR" },
    },
    {
      "@type": "Offer",
      name: "Další sezení",
      description: "Navazující sezení osobně i online.",
      price: HOURLY_RATE_CZK,
      priceCurrency: "CZK",
      availability: "https://schema.org/InStock",
      eligibleDuration: { "@type": "QuantitativeValue", value: 1, unitCode: "HUR" },
    },
  ];

  const serviceItems = services.map((s, i) => ({
    "@type": "Service",
    "@id": `${site.url}/#${s.id}`,
    position: i + 1,
    name: s.title,
    description: s.text,
    serviceType: s.title,
    provider: { "@id": personId },
    areaServed: "CZ",
    availableLanguage: "cs",
    url: `${site.url}/#${s.id}`,
    offers,
    ...(booking
      ? {
          potentialAction: {
            "@type": "ReserveAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: booking,
              actionPlatform: [
                "https://schema.org/DesktopWebPlatform",
                "https://schema.org/MobileWebPlatform",
              ],
            },
            result: { "@type": "Reservation", name: s.title },
          },
        }
      : {}),
  }));

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: site.language,
    about: { "@id": personId },
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [person, website, ...serviceItems],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
