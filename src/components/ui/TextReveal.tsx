"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { parseEmphasis, stripEmphasis, cn } from "@/lib/utils";
import { prefersReducedMotionNow } from "@/lib/hooks";

interface TextRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** scroll = při vjezdu do viewportu, ready = hned po načtení. */
  trigger?: "scroll" | "ready";
  delay?: number;
  stagger?: number;
  start?: string;
  id?: string;
  /** Třída kurzívy `*slovo*` – např. text-gold-200 na tmavém podkladu. */
  emphasisClass?: string;
}

/**
 * Odhalení textu po slovech (posun + rozostření + průhlednost).
 * `*slovo*` = serifová kurzíva v champagne.
 */
export function TextReveal({
  text,
  as = "span",
  className,
  trigger = "scroll",
  delay = 0,
  stagger = 0.045,
  start = "top 85%",
  id,
  emphasisClass = "text-gold-600",
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const words = el.querySelectorAll<HTMLElement>(".tr-word");
      if (prefersReducedMotionNow()) {
        gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.set(words, { opacity: 0, y: 22, filter: "blur(6px)" });
      gsap.set(el, { opacity: 1 });
      gsap.to(words, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        stagger,
        delay,
        ease: "power4.out",
        scrollTrigger: trigger === "scroll" ? { trigger: el, start, once: true } : undefined,
        onComplete: () => gsap.set(words, { clearProps: "filter,transform" }),
      });
    },
    { scope: ref, dependencies: [text] },
  );

  const segments = parseEmphasis(text);
  const children: React.ReactNode[] = [];
  let key = 0;
  segments.forEach((seg) => {
    const words = seg.text.split(/(\s+)/);
    words.forEach((w) => {
      if (w === "") return;
      if (/^\s+$/.test(w)) {
        children.push(" ");
        return;
      }
      children.push(
        <span
          key={key++}
          className={cn("tr-word inline-block will-change-transform", seg.italic && cn("serif-italic", emphasisClass))}
        >
          {w}
        </span>,
      );
    });
  });

  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={cn("reveal-init", className)} aria-label={stripEmphasis(text)}>
      <span aria-hidden="true">{children}</span>
    </Tag>
  );
}
