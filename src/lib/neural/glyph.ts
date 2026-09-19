/**
 * Deterministický generátor malé dendritové struktury (SVG).
 * Mikroforma stejné vizuální „bytosti“ jako Canvas engine – používá se
 * u bloků „Poznáte se v tom?“ a u čtyř oblastí pomoci.
 */
export interface GlyphPath {
  d: string;
  depth: number;
}

export interface GlyphNode {
  x: number;
  y: number;
  r: number;
  terminal: boolean;
}

export interface GlyphData {
  paths: GlyphPath[];
  nodes: GlyphNode[];
  /** Nejdelší souvislá cesta od somy – pro putující impulz (offset-path). */
  main: string;
  soma: { x: number; y: number };
}

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const f = (v: number) => v.toFixed(1);

export function generateGlyph(
  seed: number,
  options: { dendrites?: number; maxDepth?: number; size?: number } = {},
): GlyphData {
  const r = mulberry32(seed);
  const size = options.size ?? 100;
  const dendrites = options.dendrites ?? 4;
  const maxDepth = options.maxDepth ?? 4;
  const paths: GlyphPath[] = [];
  const nodes: GlyphNode[] = [];
  const somaX = size * (0.36 + r() * 0.28);
  const somaY = size * (0.38 + r() * 0.24);
  let main = "";
  let mainLen = 0;

  const grow = (
    fx: number, fy: number, angle: number, len: number, depth: number, chain: string, chainLen: number,
  ) => {
    let ex = fx + Math.cos(angle) * len;
    let ey = fy + Math.sin(angle) * len;
    const pad = size * 0.06;
    ex = Math.max(pad, Math.min(size - pad, ex));
    ey = Math.max(pad, Math.min(size - pad, ey));
    const curv = (r() - 0.5) * 0.6;
    const cx = (fx + ex) / 2 - (ey - fy) * curv;
    const cy = (fy + ey) / 2 + (ex - fx) * curv;
    const seg = `Q ${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`;
    paths.push({ d: `M ${f(fx)} ${f(fy)} ${seg}`, depth });
    const nextChain = `${chain} ${seg}`;
    const nextLen = chainLen + len;
    const terminal = depth + 1 >= maxDepth || r() < 0.18;
    nodes.push({ x: ex, y: ey, r: terminal ? 1.6 : 1, terminal });
    if (terminal) {
      if (nextLen > mainLen) {
        mainLen = nextLen;
        main = nextChain;
      }
      return;
    }
    const k = r() < 0.6 ? 2 : 1;
    const spread = 0.4 + r() * 0.5;
    for (let i = 0; i < k; i++) {
      const dir = k === 2 ? (i === 0 ? -1 : 1) : r() < 0.5 ? -1 : 1;
      grow(ex, ey, angle + dir * spread + (r() - 0.5) * 0.3, len * (0.66 + r() * 0.18), depth + 1, nextChain, nextLen);
    }
  };

  const base = r() * Math.PI * 2;
  for (let i = 0; i < dendrites; i++) {
    const angle = base + (i / dendrites) * Math.PI * 2 + (r() - 0.5) * 0.6;
    grow(somaX, somaY, angle, size * (0.2 + r() * 0.1), 0, `M ${f(somaX)} ${f(somaY)}`, 0);
  }

  return { paths, nodes, main, soma: { x: somaX, y: somaY } };
}
