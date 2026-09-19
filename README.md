# Vladislava Pospíšilová – osobní web

Prémiový jednostránkový web mentorky Vladislavy Pospíšilové (NLP · coaching · prevence vyhoření · podpora po ztrátě).

Koncept **„Nový směr“**: světlý, klidný, lidský web s jednou organickou neuronovou strukturou, která se v různých
formách vrací napříč stránkou – kolem portrétu v hero, jako pomalu dýchající pozadí, jako interaktivní vrchol
(Podnět → Myšlenka → Emoce → Reakce → Vzorec → Nová cesta) a jako mikroformy u jednotlivých bloků.
Cílem stránky je první nezávazný rozhovor: ZASTAVÍ → ZAUJME → POZNÁ SE → ZAČNE DŮVĚŘOVAT → NAPÍŠE.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (design tokeny v `src/app/globals.css`)
- **GSAP + ScrollTrigger** (pin neuronové experience, reveal animace), **Lenis** (smooth scroll)
- Vlastní **Canvas 2D organický neuronový engine** (`src/lib/neural/organic.ts`) – bez Three.js, adaptivní výkon
- Fonty přes `next/font` (Newsreader – serif, Manrope – sans), self‑hosted při buildu
- Připraveno pro nasazení na **Vercel**

## Spuštění

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # produkční build
npm run start      # produkční server
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run icons      # přegeneruje apple-icon.png z src/app/icon.svg
```

Volitelně nastavte veřejnou URL (canonical, Open Graph, sitemap, robots):

```bash
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL=https://www.vase-domena.cz
```

Pořadí: `NEXT_PUBLIC_SITE_URL` → produkční doména Vercelu (`VERCEL_PROJECT_PRODUCTION_URL`) → výchozí doména
v `src/config/site.ts`. Prázdná nebo nevalidní hodnota se ignoruje, build tím nikdy nespadne.

## Struktura stránky

| # | Sekce | Komponenta | Obsah |
| --- | --- | --- | --- |
| 01 | Hero | `sections/Hero.tsx` | `content/hero.ts` |
| 02 | Poznáte se v tom? | `sections/Situations.tsx` | `content/situations.ts` |
| 03 | Můj příběh + cinematic foto | `sections/Story.tsx` | `content/story.ts` |
| 04 | Neuronová experience (tmavá) | `sections/Patterns.tsx` | `content/patterns.ts` |
| 05 | S čím pomáhám | `sections/Services.tsx` | `content/services.ts` |
| 06 | Jak to probíhá | `sections/Process.tsx` | `content/process.ts` |
| 07 | Důvěra | `sections/Trust.tsx` | `content/trust.ts` |
| 08 | Finální CTA + kontakt | `sections/FinalCta.tsx` | `content/contact.ts` + `config/site.ts` |

Sticky CTA: na desktopu je trvalé tlačítko v pevné navigaci, na mobilu spodní lišta (`layout/StickyCta.tsx`),
která se zobrazí po opuštění hero a skryje u finální výzvy.

## Co doplnit před spuštěním (TODO systém)

Hodnoty začínající `TODO: DOPLNIT` se na webu vykreslí jako zřetelně označený placeholder (žlutá pilulka
s přerušovaným rámečkem). Nic z toho není vymyšlené – doplňte pouze skutečné údaje.

| Co | Kde |
| --- | --- |
| E‑mail, telefon, místo setkávání, sociální sítě | `src/config/site.ts` → `site.contact`, `site.social` |
| Rok ztráty manžela (text „před osmi lety“ se pak počítá automaticky) | `src/config/site.ts` → `site.lossYear` |
| Krizová linka (ověřit číslo) | `src/config/site.ts` → `site.crisisLine` |
| Vzdělání, certifikace, praxe | `src/content/trust.ts` → `credentials`, `practice` |
| Reference klientů | `src/content/trust.ts` → `testimonials` (placeholder karty zmizí, jakmile přidáte první) |
| Skrýt všechny placeholdery najednou | `src/content/trust.ts` → `showPlaceholders = false` |
| Finální doména | `NEXT_PUBLIC_SITE_URL` nebo `src/config/site.ts` |

Jakmile je vyplněný e‑mail, všechna CTA „Domluvit nezávazný rozhovor“ vedou přímo na `mailto:`;
do té doby scrollují na kontaktní sekci.

## Fotografie

Žádná galerie – každá fotografie má dramaturgickou roli. Přiřazení je v `src/content/photos.ts`:

| Role | Soubor |
| --- | --- |
| Hero portrét (s neuronovým halo) | `vladislava-city.jpg` |
| Jedna velká fotografie v příběhu (sticky) | `vladislava-scarf.jpg` |
| Cinematic fotografie „Nový směr“ | `vladislava-road.jpg` |
| Malý portrét u „Jak to probíhá“ | `vladislava-portrait.jpg` |
| Portrét u finálního CTA | `vladislava-blouse.jpg` |

Nové fotografie vložte do `src/assets/images/` a přepište import. Doporučené rozlišení pro hero a příběh:
alespoň 1200 px na šířku (současné originály mají 683 px, na retina displejích jsou měkčí).

## Neuronová síť

- `src/lib/neural/organic.ts` – engine: neurony (somy) s dendrity kreslenými jako měkké křivky, synaptické spoje
  mezi výběžky, světelné impulzy (při scrollu jich přibývá), přestavba (staré větve se rozpadají od špičky, nové rostou).
  Layouty `field` (pozadí), `halo` (kolem portrétu), `chain` (řetězec vzorce), světlé i tmavé téma.
- `src/lib/neural/presets.ts` – stavy sítě pro jednotlivé sekce (`data-neural="<preset>"` na sekci).
  V příběhu: `loss` (rozpad) → `searching` (přestavba) → `understanding` → `direction` → `helping` (propojení).
- `src/lib/neural/glyph.ts` – deterministické SVG mikroformy (bloky „Poznáte se v tom?“ a oblasti pomoci).
- Neuronová experience (`sections/Patterns.tsx`): pozice uzlů `HUBS_DESKTOP` / `HUBS_MOBILE`, časová osa
  `CHAIN_TIMELINE` v `organic.ts`.
- Výkon: limit DPR a FPS, adaptivní hustota podle zařízení, pauza mimo viewport a při skryté záložce.
- `prefers-reduced-motion`: síť se vykreslí jako statický snímek, pin i smooth scroll se vypnou.

## Kde se co upravuje

| Co | Soubor |
| --- | --- |
| Kontakty, doména, navigace, texty CTA, krizová linka | `src/config/site.ts` |
| Texty všech sekcí | `src/content/*.ts` |
| Barvy, typografie, tlačítka, placeholder styl | `src/app/globals.css` |
| Stavy neuronové sítě | `src/lib/neural/presets.ts` |
| Open Graph obrázek | `src/app/opengraph-image.tsx` |

## SEO

- Title, description, keywords, canonical, Open Graph (`/opengraph-image` generovaný při buildu), Twitter card
- `sitemap.xml`, `robots.txt`, favicon (`icon.svg`, `apple-icon.png`)
- Schema.org `Person` + `WebSite` + `Service` (JSON‑LD), kontakty se propisují jen pokud jsou vyplněné

## Poznámka k formulacím

Web nesmí působit jako zdravotnické zařízení. Texty důsledně odlišují coaching / mentoring / doprovázení
od zdravotní péče a psychoterapie a u tématu ztráty odkazují na odbornou pomoc.
