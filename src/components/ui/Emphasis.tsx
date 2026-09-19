import { parseEmphasis } from "@/lib/utils";

/** Vykreslí text, kde `*slovo*` je serifová kurzíva ve zlaté. */
export function Emphasis({ text, tone = "gold" }: { text: string; tone?: "gold" | "inherit" }) {
  return (
    <>
      {parseEmphasis(text).map((seg, i) =>
        seg.italic ? (
          <em key={i} className={tone === "gold" ? "serif-italic text-gold-300" : "serif-italic"}>
            {seg.text}
          </em>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}
