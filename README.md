# Vladislava Pospíšilová – osobní web

Prémiový jednostránkový web mentorky Vladislavy Pospíšilové (NLP · coaching · prevence vyhoření · podpora po ztrátě).
Vizuální koncept **„Inside the Mind“**: návštěvník prochází stránkou jako lidským mozkem – neuronová síť na pozadí
se během příběhu mění z fragmentované a tmavé (ztráta) v propojenou a stabilní (nový směr, pomoc druhým).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (design tokeny v `src/app/globals.css`)
- **GSAP + ScrollTrigger** (scroll storytelling, reveal animace), **Lenis** (smooth scroll)
- Vlastní **Canvas 2D neuronový engine** (`src/lib/neural/engine.ts`) – žádný Three.js, GPU‑friendly, adaptivní počet uzlů a FPS
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
Na Vercelu proměnnou buď vůbec nenastavujte (použije se doména projektu), nebo ji vyplňte celou včetně `https://`.

## Kde se co upravuje

| Co | Soubor |
| --- | --- |
| Kontakty, doména, navigace, krizová linka | `src/config/site.ts` |
| Příběh (kapitoly Ztráta → Pomoc druhým) | `src/content/story.ts` |
| Neuroplasticita (diagram + vysvětlení) | `src/content/brain.ts` |
| Služby (4 oblasti, průběh spolupráce) | `src/content/services.ts` |
| „Když už nemůžete dál“ | `src/content/companion.ts` |
| Galerie fotografií | `src/content/photos.ts` (+ obrázky v `src/assets/images`) |
| Timeline „Moje cesta“, vzdělání a výcviky | `src/content/journey.ts` |
| Reference klientů | `src/content/testimonials.ts` |
| Kontaktní sekce (texty, disclaimer) | `src/content/contact.ts` |
| Stavy neuronové sítě pro jednotlivé sekce | `src/lib/neural/presets.ts` |
| Barvy, typografie, tlačítka | `src/app/globals.css` |

Hodnoty začínající `TODO: DOPLNIT` se na webu zobrazují jako zřetelně označený placeholder.
Žádné reference, certifikace ani kontaktní údaje nejsou vymyšlené – doplňte skutečné.

### Přidání fotografií

1. Vložte soubor do `src/assets/images/`.
2. V `src/content/photos.ts` ho naimportujte a přidejte položku do pole `photos`
   (`ratio`, `treatment` = `color | mono | warm`, `position`).
3. Placeholder položky (`placeholder: true`) odstraňte.

Fotografie použité mimo galerii jsou pojmenované exporty v témže souboru: `heroPortrait` (hero),
`storyPortrait` (sticky portrét v příběhu, který se s kapitolami vrací do barev), `contactPortrait` (kontakt) a `road` (odhalení na konci příběhu).

### Přidání referencí

Do pole `testimonials` v `src/content/testimonials.ts` přidejte `{ quote, name, context?, image? }`.
Sekce se vykreslí automaticky; dokud je pole prázdné, zobrazí se placeholder karty
(`showTestimonialPlaceholder = false` je skryje úplně).

## Struktura

```
src/
  app/            layout, page, globals.css, OG obrázek, sitemap, robots, ikony
  components/
    layout/       Nav, Footer
    neural/       NeuralBackground (globální síť), HeroNeural (halo kolem portrétu)
    providers/    SmoothScroll (Lenis + ScrollTrigger)
    sections/     Hero, Story, Brain, Services (+ ServiceGlyph), Companion, Gallery,
                  Journey, Testimonials, Contact
    seo/          JsonLd (Schema.org Person + Service)
    ui/           TextReveal, Reveal, MagneticButton, Cursor, Preloader, SectionHeading …
  config/         site.ts
  content/        veškeré texty a data
  lib/            gsap.ts, hooks.ts, utils.ts, neural/{engine,presets}.ts
```

## Neuronová síť

- Každá sekce nese `data-neural="<preset>"`; ScrollTrigger při vjezdu nastaví cílový stav
  (connectivity, brightness, speed, jitter, pulseRate, violet, reach) a engine k němu plynule interpoluje.
- Kurzor uzly „aktivuje“ (rozsvítí je i jejich spoje), impulzy putují po spojích a pokračují sítí.
- Výkon: limit DPR, adaptivní počet uzlů podle zařízení, 30–40 FPS na mobilu, pauza při skryté záložce,
  hero halo běží jen když je vidět.
- `prefers-reduced-motion`: síť se vykreslí jako jeden statický snímek, smooth scroll i reveal animace se vypnou.

## SEO

- Title, description, keywords, canonical, Open Graph (`/opengraph-image` generovaný při buildu), Twitter card
- `sitemap.xml`, `robots.txt`, favicon (`icon.svg`, `apple-icon.png`)
- Schema.org `Person` + `WebSite` + `Service` (JSON‑LD), kontakty se propisují jen pokud jsou vyplněné

## Poznámka k formulacím

Web nesmí působit jako zdravotnické zařízení. Texty důsledně odlišují coaching / mentoring / doprovázení
od zdravotní péče a psychoterapie a u tématu ztráty odkazují na odbornou pomoc.
