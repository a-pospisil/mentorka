"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

interface LightboxProps {
  image: StaticImageData;
  alt: string;
  /** Popisek pod zvětšeným obrázkem. */
  caption?: string;
  /** Obsah spouštěče – náhled. */
  children: React.ReactNode;
  className?: string;
  /** Přístupný popis tlačítka, např. „Zvětšit certifikát NLP Practitioner“. */
  label: string;
}

/**
 * Zvětšení obrázku přes celou obrazovku. Náhled je tlačítko, detail je modální
 * dialog: zavírá se Escapem, kliknutím mimo i křížkem, vrací fokus zpět na
 * spouštěč a na dobu otevření zastaví plynulý scroll (Lenis).
 *
 * Overlay se vykresluje portálem do <body>: sekce výš ve stromu mají
 * GSAP transformace, které by `position: fixed` ukotvily k sobě a nechaly
 * dialog vykreslit pod navigací.
 */
export function Lightbox({ image, alt, caption, children, className, label }: LightboxProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    // Spouštěč se během otevřeného dialogu neodpojuje – uložíme si ho pro návrat fokusu.
    const trigger = triggerRef.current;
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, close]);

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={close}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-ink-950/90 p-4 backdrop-blur-md sm:p-8"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={close}
        aria-label="Zavřít"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-paper-50/25 text-paper-50 transition-colors duration-500 hover:border-gold-400 hover:text-gold-300 sm:right-8 sm:top-8"
      >
        <span className="relative block h-4 w-4">
          <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-current" />
          <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-current" />
        </span>
      </button>

      <Image
        src={image}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        sizes="(max-width: 1280px) 94vw, 1200px"
        placeholder="blur"
        className="max-h-[78vh] w-auto max-w-[94vw] cursor-default rounded-lg object-contain shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
      />

      {caption ? (
        <p
          onClick={(e) => e.stopPropagation()}
          className="t-small max-w-[60ch] cursor-default text-center text-paper-300"
        >
          {caption}
        </p>
      ) : null}
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        className={cn(
          "group block w-full cursor-zoom-in text-left transition-transform duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1",
          className,
        )}
      >
        {children}
      </button>

      {/* Dialog se otevírá jen klikem, takže document tu vždy existuje. */}
      {open ? createPortal(overlay, document.body) : null}
    </>
  );
}
