"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotionNow } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  start?: string;
  /** Animovat přímé potomky se zpožděním (stagger). */
  stagger?: number;
  id?: string;
  style?: React.CSSProperties;
}

/** Blokové odhalení při scrollu: průhlednost + jemný posun. */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = 28,
  duration = 1.2,
  start = "top 88%",
  stagger,
  id,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = stagger ? Array.from(el.children) : el;
      if (prefersReducedMotionNow()) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.set(el, { opacity: 1 });
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: stagger ?? 0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start, once: true },
          onComplete: () => gsap.set(targets, { clearProps: "transform" }),
        },
      );
    },
    { scope: ref },
  );

  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={cn(!stagger && "reveal-init", className)} style={style}>
      {children}
    </Tag>
  );
}
