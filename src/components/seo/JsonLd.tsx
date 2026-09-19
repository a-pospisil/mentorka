import { isTodo, site } from "@/config/site";
import { services } from "@/content/services";

/**
 * Schema.org – Person + nabízené služby.
 * Neuvádí žádné neověřené údaje (kontakty jen pokud jsou vyplněné).
 */
export function JsonLd() {
  const personId = `${site.url}/#person`;

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
    ...(isTodo(site.contact.email) ? {} : { email: `mailto:${site.contact.email}` }),
    ...(isTodo(site.contact.phone) ? {} : { telephone: site.contact.phone }),
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
  };

  const serviceItems = services.map((s, i) => ({
    "@type": "Service",
    "@id": `${site.url}/#${s.id}`,
    position: i + 1,
    name: s.title,
    description: s.description,
    serviceType: s.title,
    provider: { "@id": personId },
    areaServed: "CZ",
    availableLanguage: "cs",
    url: `${site.url}/#${s.id}`,
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
