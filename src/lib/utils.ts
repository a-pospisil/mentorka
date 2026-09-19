/** Spojení class názvů bez falsy hodnot. */
export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

/**
 * Rozdělí text na segmenty; `*text*` označuje kurzívu (serif italic).
 */
export interface TextSegment {
  text: string;
  italic: boolean;
}

export const parseEmphasis = (input: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    if (m.index > last) segments.push({ text: input.slice(last, m.index), italic: false });
    segments.push({ text: m[1], italic: true });
    last = m.index + m[0].length;
  }
  if (last < input.length) segments.push({ text: input.slice(last), italic: false });
  return segments;
};

/** Vrátí čistý text bez značek zvýraznění (pro SEO/aria). */
export const stripEmphasis = (input: string) => input.replace(/\*([^*]+)\*/g, "$1");
