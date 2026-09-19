"use client";

import { useEffect, useState } from "react";
import { navigation, site, contactHref } from "@/config/site";
import { cn } from "@/lib/utils";
import { getLenis } from "@/components/providers/SmoothScroll";

/**
 * Minimalistická navigace: transparentní, při scrollu získá blur pozadí.
 * Na mobilu celoobrazovkové menu s velkými serifovými odkazy.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Aktivní sekce (IntersectionObserver – bez GSAP, levné)
  useEffect(() => {
    const ids = navigation.map((n) => n.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) setActive(href);
          else setActive((current) => (current === href ? "" : current));
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Zamknout scroll při otevřeném menu
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-[background-color,backdrop-filter,border-color] duration-700",
          scrolled && !open
            ? "border-b border-bone-100/5 bg-ink-950/55 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Hlavní navigace"
          className="page-container flex h-[var(--nav-height)] items-center justify-between"
        >
          <a
            href="#uvod"
            className="group relative z-[80] flex items-center gap-3 font-serif text-lg tracking-wide text-bone-50 sm:text-xl"
            aria-label={`${site.name} – úvod`}
          >
            <span
              aria-hidden="true"
              className="node node-pulse h-1.5 w-1.5 bg-gold-400 transition-transform duration-500 group-hover:scale-125"
            />
            {site.name}
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "t-label relative py-2 text-bone-300 transition-colors duration-500 hover:text-bone-50",
                    active === item.href && "text-bone-50",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-400 transition-transform duration-500 ease-[var(--ease-out-expo)]",
                      active === item.href && "scale-x-100",
                    )}
                  />
                </a>
              </li>
            ))}
            <li>
              <a
                href={contactHref()}
                className="btn btn-ghost !px-5 !py-2.5 text-[0.68rem]"
              >
                Rozhovor
              </a>
            </li>
          </ul>

          <button
            type="button"
            className="relative z-[80] flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-6 bg-bone-100 transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  open && "translate-y-[6px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[6px] h-px w-6 bg-bone-100 transition-opacity duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-3 h-px w-6 bg-bone-100 transition-transform duration-500 ease-[var(--ease-out-expo)]",
                  open && "-translate-y-[6px] -rotate-45",
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobilní menu */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[75] flex flex-col justify-between bg-ink-950/95 px-6 pb-10 pt-28 backdrop-blur-2xl transition-[opacity,visibility] duration-500 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <ul className="flex flex-col gap-1">
          {navigation.map((item, i) => (
            <li
              key={item.href}
              className={cn(
                "border-b hairline transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
            >
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-4 font-serif text-3xl font-light text-bone-50"
                tabIndex={open ? 0 : -1}
              >
                {item.label}
                <span className="t-label text-bone-500">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div
          className={cn(
            "flex flex-col gap-4 transition-opacity duration-700",
            open ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDelay: open ? "420ms" : "0ms" }}
        >
          <p className="t-label text-bone-500">{site.tagline}</p>
          <a
            href={contactHref()}
            onClick={() => setOpen(false)}
            className="btn btn-primary w-fit"
            tabIndex={open ? 0 : -1}
          >
            Domluvit rozhovor
          </a>
        </div>
      </div>
    </>
  );
}
