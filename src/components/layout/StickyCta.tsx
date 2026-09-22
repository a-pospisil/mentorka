"use client";

import { useEffect, useState } from "react";
import { ctaLinkProps, CTA_SHORT } from "@/config/site";
import { Arrow } from "@/components/ui/Arrow";
import { cn } from "@/lib/utils";

/**
 * Sticky CTA pro mobil: spodní lišta s jedinou výzvou. Zobrazí se po
 * opuštění hero sekce a skryje se u finální výzvy. Na desktopu plní
 * roli sticky CTA tlačítko v pevné navigaci.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("uvod");
    const contact = document.getElementById("kontakt");
    if (!hero) return;
    let heroVisible = true;
    let contactVisible = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === contact) contactVisible = entry.isIntersecting;
        });
        setVisible(!heroVisible && !contactVisible);
      },
      { threshold: 0.12 },
    );
    io.observe(hero);
    if (contact) io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Mobil – spodní lišta */}
      <div
        aria-hidden={!visible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[60] border-t hairline bg-paper-50/85 px-4 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl transition-transform duration-700 ease-[var(--ease-out-expo)] xl:hidden",
          visible ? "translate-y-0" : "translate-y-full",
        )}
      >
        <a {...ctaLinkProps()} className="btn btn-primary w-full !py-3.5" tabIndex={visible ? 0 : -1}>
          {CTA_SHORT}
          <Arrow className="h-3 w-3" />
        </a>
      </div>
    </>
  );
}
