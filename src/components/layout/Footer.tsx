import { navigation, site } from "@/config/site";
import { contactContent } from "@/content/contact";

export function Footer() {
  const year = new Date().getFullYear();
  const range = year > site.since ? `${site.since}–${year}` : `${year}`;
  return (
    <footer className="relative z-10 border-t hairline bg-ink-950/60 backdrop-blur-sm">
      <div className="page-container flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="font-serif text-xl text-bone-50">{site.name}</p>
          <p className="t-label mt-3 text-bone-500">{site.tagline}</p>
          <p className="t-small mt-6 text-bone-500">{contactContent.disclaimer}</p>
        </div>
        <nav aria-label="Patička">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="t-label text-bone-400 transition-colors duration-500 hover:text-gold-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="page-container flex flex-col gap-2 border-t hairline py-6 text-[0.7rem] tracking-[0.12em] text-bone-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {range} {site.name}. Všechna práva vyhrazena.
        </p>
        <p className="uppercase">Inside the mind</p>
      </div>
    </footer>
  );
}
