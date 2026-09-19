import { navigation, site } from "@/config/site";
import { finalCta } from "@/content/contact";

export function Footer() {
  const year = new Date().getFullYear();
  const range = year > site.since ? `${site.since}–${year}` : `${year}`;
  return (
    <footer className="relative z-10 border-t hairline bg-paper-100/70 backdrop-blur-sm">
      <div className="page-container flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="font-serif text-xl text-ink-900">{site.name}</p>
          <p className="t-label mt-3 text-ink-500">{site.tagline}</p>
          <p className="t-small mt-6 text-ink-500">{finalCta.disclaimer}</p>
        </div>
        <nav aria-label="Patička">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="t-label text-ink-500 transition-colors duration-500 hover:text-gold-700">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="page-container flex flex-col gap-2 border-t hairline py-6 pb-[calc(1.5rem+var(--sticky-cta-height))] text-[0.7rem] tracking-[0.12em] text-ink-400 sm:flex-row sm:items-center sm:justify-between lg:pb-6">
        <p>
          © {range} {site.name}. Všechna práva vyhrazena.
        </p>
        <p className="uppercase">Nový směr</p>
      </div>
    </footer>
  );
}
