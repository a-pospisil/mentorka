import { generateGlyph } from "@/lib/neural/glyph";
import { cn } from "@/lib/utils";

interface DendriteGlyphProps {
  seed: number;
  className?: string;
  /** Barva přes currentColor rodiče. */
  dendrites?: number;
  maxDepth?: number;
}

/**
 * Mikroforma neuronové sítě – deterministické SVG (stejný seed = stejný tvar).
 * Na hover se větve „dokreslí“ a po hlavní větvi proběhne impulz
 * (CSS: .glyph-hover na rodiči).
 */
export function DendriteGlyph({ seed, className, dendrites = 4, maxDepth = 4 }: DendriteGlyphProps) {
  const glyph = generateGlyph(seed, { dendrites, maxDepth });
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn("glyph overflow-visible", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyph.paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          pathLength={1}
          strokeWidth={1.6 - p.depth * 0.3}
          opacity={0.85 - p.depth * 0.14}
        />
      ))}
      {glyph.nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="currentColor" stroke="none" opacity={n.terminal ? 0.7 : 0.45} />
      ))}
      <circle cx={glyph.soma.x} cy={glyph.soma.y} r={3.2} stroke="currentColor" strokeWidth={1} opacity={0.8} />
      <circle cx={glyph.soma.x} cy={glyph.soma.y} r={1.4} fill="currentColor" stroke="none" />
      <circle
        className="glyph-pulse text-synapse-500"
        r={2.2}
        fill="currentColor"
        stroke="none"
        style={{ offsetPath: `path("${glyph.main}")`, offsetRotate: "0deg" }}
      />
    </svg>
  );
}
