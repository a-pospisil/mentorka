import type { NeuralState } from "./presets";

/**
 * OrganicNeural – organická neuronová struktura (Canvas 2D).
 *
 * Jedna vizuální „bytost“, která se v různých formách vrací napříč webem:
 * – neurony (somy) s větvícími se dendrity kreslenými jako měkké křivky
 *   s postupně tenčími větvemi; koncové výběžky (boutony) se synapticky
 *   spojují s větvemi sousedních neuronů
 * – struktura pomalu „dýchá“, po větvích putují světelné impulzy
 *   (při scrollu jich přibývá)
 * – při přestavbě (rewire) se staré větve rozpadají od špičky a nové
 *   rostou – vizuální metafora změny vzorců
 * – layouty: field (volná struktura), halo (kolem portrétu s prázdným
 *   středem), chain (řetězec Podnět → … → Vzorec + nová cesta)
 * – světlé i tmavé téma, limit FPS/DPR, statický snímek pro reduced motion
 */

export type NeuralTheme = "light" | "dark";
export type NeuralLayout = "field" | "halo" | "chain";

/** Oblast, které se struktura vyhýbá (relativně 0–1 vůči ploše). */
export interface VoidArea {
  x: number;
  y: number;
  rx: number;
  ry: number;
}

/** Uzel řetězce (relativně 0–1 vůči ploše). */
export interface ChainHub {
  x: number;
  y: number;
}

export interface OrganicOptions {
  seed?: number;
  theme?: NeuralTheme;
  layout?: NeuralLayout;
  /** Počet neuronů (field/halo). */
  somas?: number;
  /** Délka primární větve jako podíl kratší strany plochy. */
  scale?: number;
  /** Hloubka větvení. */
  maxDepth?: number;
  interactive?: boolean;
  maxFps?: number;
  dprCap?: number;
  /** Jediný statický snímek (prefers-reduced-motion). */
  staticFrame?: boolean;
  initial?: NeuralState;
  void?: VoidArea | null;
  /** halo: poloosy elipsy, na které leží neurony (podíl šířky / výšky). */
  haloRx?: number;
  haloRy?: number;
  /** chain: pozice hubů; poslední hub je „Nová cesta“. */
  chainHubs?: ChainHub[];
  /** chain: index hubu, kde se vzorec uzavírá smyčkou zpět na začátek. */
  chainLoopEnd?: number;
  /** chain: odkud a kam roste nová cesta. */
  chainNewFrom?: number;
  chainNewTo?: number;
  /** chain: zakřivení smyčky (znaménko určuje stranu). */
  chainLoopCurv?: number;
  /** Násobek intenzity čar a uzlů (halo kolem portrétu je o něco výraznější). */
  inkBoost?: number;
}

/** Časová osa neuronové experience v podílu scroll-progressu 0–1. */
export const CHAIN_TIMELINE = {
  hubAt: (i: number) => 0.05 + i * 0.155,
  hubSpan: 0.155,
  loopGrow: [0.68, 0.79] as const,
  loopDissolve: [0.85, 0.93] as const,
  newPath: [0.85, 0.97] as const,
  newHubAt: 0.95,
};

interface NNode {
  hx: number;
  hy: number;
  x: number;
  y: number;
  r: number;
  depth: number;
  soma: number;
  /** 0 uzel, 1 soma, 2 hub řetězce */
  kind: 0 | 1 | 2;
  phase: number;
  amp: number;
  excite: number;
  dead: boolean;
  /** Index rodičovské větve (−1 u somy). */
  parent: number;
  links: number[];
}

interface Branch {
  a: number;
  b: number;
  curv: number;
  width: number;
  depth: number;
  threshold: number;
  /** 0–1 vykreslená část křivky (růst / rozpad). */
  grow: number;
  /** 0 stabilní, 1 roste, 2 rozpadá se */
  state: 0 | 1 | 2;
  /** 0 dendrit, 1 synapse, 2 spoj řetězce, 3 smyčka vzorce, 4 nová cesta */
  kind: 0 | 1 | 2 | 3 | 4;
  dead: boolean;
  dissolve: number;
  seq: number;
}

interface Pulse {
  branch: number;
  t: number;
  dir: 1 | -1;
  speed: number;
  hops: number;
}

type RGB = readonly [number, number, number];

interface Palette {
  stroke: RGB;
  strokeAlpha: number;
  linkAlpha: number;
  node: RGB;
  soma: RGB;
  gold: RGB;
  violet: RGB;
  pulse: RGB;
  auraA: RGB;
  auraB: RGB;
  auraAlpha: number;
}

const LIGHT: Palette = {
  stroke: [46, 44, 60],
  strokeAlpha: 0.18,
  linkAlpha: 0.5,
  node: [64, 60, 80],
  soma: [173, 149, 106],
  gold: [196, 172, 124],
  violet: [112, 104, 190],
  pulse: [104, 96, 190],
  auraA: [216, 200, 160],
  auraB: [172, 164, 224],
  auraAlpha: 0.14,
};

const DARK: Palette = {
  stroke: [230, 224, 210],
  strokeAlpha: 0.3,
  linkAlpha: 0.6,
  node: [238, 232, 218],
  soma: [224, 202, 154],
  gold: [230, 208, 158],
  violet: [182, 174, 238],
  pulse: [224, 220, 252],
  auraA: [176, 154, 112],
  auraB: [122, 114, 204],
  auraAlpha: 0.2,
};

const TAU = Math.PI * 2;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const rgba = (c: RGB, a: number) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a < 0 ? 0 : a > 1 ? 1 : a})`;

/** Deterministický generátor (mulberry32) – stejný seed = stejná struktura. */
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

/** Řídicí bod kvadratické křivky: kolmý posun od středu úsečky. */
const ctrlPoint = (ax: number, ay: number, bx: number, by: number, curv: number) =>
  [(ax + bx) / 2 - (by - ay) * curv, (ay + by) / 2 + (bx - ax) * curv] as const;

const bezPoint = (
  ax: number, ay: number, cx: number, cy: number, bx: number, by: number, t: number,
) => {
  const u = 1 - t;
  return [u * u * ax + 2 * u * t * cx + t * t * bx, u * u * ay + 2 * u * t * cy + t * t * by] as const;
};

/** Blossom kvadratické křivky – řídicí bod úseku [s, t]. */
const blossom = (
  ax: number, ay: number, cx: number, cy: number, bx: number, by: number, s: number, t: number,
) => {
  const w0 = (1 - s) * (1 - t);
  const w1 = (1 - s) * t + s * (1 - t);
  const w2 = s * t;
  return [w0 * ax + w1 * cx + w2 * bx, w0 * ay + w1 * cy + w2 * by] as const;
};

export class OrganicNeural {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: Required<Omit<OrganicOptions, "initial" | "void" | "chainHubs">> & {
    initial: NeuralState;
    void: VoidArea | null;
    chainHubs: ChainHub[];
  };
  private palette: Palette;

  private width = 0;
  private height = 0;
  private dpr = 1;

  private nodes: NNode[] = [];
  private branches: Branch[] = [];
  private pulses: Pulse[] = [];
  private hubs: number[] = [];
  private hubActive: number[] = [];
  private baseBranchCount = 0;

  private current: NeuralState;
  private target: NeuralState;
  private chainProgress = 0;

  private pointer: { x: number; y: number } | null = null;
  private offX = 0;
  private offY = 0;

  private random: () => number;
  private raf = 0;
  private running = false;
  private destroyed = false;
  private lastTime = 0;
  private time = 0;
  private pulseAccumulator = 0;
  private rewireAccumulator = 0;

  constructor(canvas: HTMLCanvasElement, options: OrganicOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas 2D není k dispozici.");
    this.ctx = ctx;

    this.opts = {
      seed: options.seed ?? 7,
      theme: options.theme ?? "light",
      layout: options.layout ?? "field",
      somas: options.somas ?? 0,
      scale: options.scale ?? 0.16,
      maxDepth: options.maxDepth ?? 5,
      interactive: options.interactive ?? true,
      maxFps: options.maxFps ?? 60,
      dprCap: options.dprCap ?? 1.5,
      staticFrame: options.staticFrame ?? false,
      initial: options.initial ?? {
        alpha: 0.7, density: 0.75, violet: 0.3, speed: 0.6, pulseRate: 0.9, rewire: 0.08, glow: 0.6, biasX: 0, biasY: 0,
      },
      void: options.void ?? null,
      haloRx: options.haloRx ?? 0.36,
      haloRy: options.haloRy ?? 0.38,
      chainHubs: options.chainHubs ?? [],
      chainLoopEnd: options.chainLoopEnd ?? 4,
      chainNewFrom: options.chainNewFrom ?? 3,
      chainNewTo: options.chainNewTo ?? 5,
      chainLoopCurv: options.chainLoopCurv ?? -0.42,
      inkBoost: options.inkBoost ?? 1,
    };
    this.palette = this.opts.theme === "dark" ? DARK : LIGHT;
    this.random = mulberry32(this.opts.seed);
    this.current = { ...this.opts.initial };
    this.target = { ...this.opts.initial };
    this.resize();
  }

  /* ------------------------------------------------------------ API */

  setTarget(state: NeuralState) {
    this.target = { ...state };
    if (this.opts.staticFrame) {
      this.current = { ...state };
      this.renderStatic();
    }
  }

  snap(state: NeuralState) {
    this.current = { ...state };
    this.target = { ...state };
  }

  setPointer(x: number | null, y?: number) {
    this.pointer = x === null || y === undefined ? null : { x, y };
  }

  /** Impulzy navíc (např. při scrollu). */
  kick(n: number) {
    for (let i = 0; i < n && this.pulses.length < 64; i++) this.spawnPulse();
  }

  /** chain: 0–1 scroll-progress neuronové experience. */
  setChainProgress(p: number) {
    this.chainProgress = clamp01(p);
    this.applyChainProgress();
    if (this.opts.staticFrame) this.renderStatic();
  }

  start() {
    if (this.destroyed || this.running) return;
    if (this.opts.staticFrame) {
      this.renderStatic();
      return;
    }
    this.running = true;
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.destroyed = true;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.dprCap);
    this.width = w;
    this.height = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.generate();
    if (this.opts.staticFrame) this.renderStatic();
  }

  /* ------------------------------------------------------- GROWTH */

  private generate() {
    this.nodes = [];
    this.branches = [];
    this.pulses = [];
    this.hubs = [];
    this.hubActive = [];
    this.random = mulberry32(this.opts.seed);

    if (this.opts.layout === "chain") this.generateChain();
    else if (this.opts.layout === "halo") this.generateHalo();
    else this.generateField();

    this.linkSynapses();
    this.baseBranchCount = this.branches.length;
    if (this.opts.layout === "chain") this.applyChainProgress();
  }

  private generateField() {
    const r = this.random;
    const w = this.width;
    const h = this.height;
    const m = Math.min(w, h);
    const count = this.opts.somas || clamp(Math.round((w * h) / (440 * 440)), 3, 8);
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < count; i++) {
      let best: [number, number] | null = null;
      let bestD = -1;
      for (let c = 0; c < 16; c++) {
        const x = w * (0.06 + r() * 0.88);
        const y = h * (0.06 + r() * 0.88);
        if (this.voidT(x, y) < 1.15) continue;
        let d = Number.POSITIVE_INFINITY;
        for (const p of pts) d = Math.min(d, Math.hypot(x - p[0], y - p[1]));
        if (!pts.length) d = r() * w;
        if (d > bestD) {
          bestD = d;
          best = [x, y];
        }
      }
      if (best) pts.push(best);
    }
    for (const [x, y] of pts) {
      this.growSoma(x, y, m * this.opts.scale * (0.9 + r() * 0.3), 4 + (r() < 0.45 ? 1 : 0), this.opts.maxDepth, 1);
    }
  }

  private generateHalo() {
    const r = this.random;
    const w = this.width;
    const h = this.height;
    const m = Math.min(w, h);
    const count = this.opts.somas || 7;
    const cx = w / 2;
    const cy = h / 2;
    const rx = w * this.opts.haloRx;
    const ry = h * this.opts.haloRy;
    for (let i = 0; i < count; i++) {
      const a = -Math.PI / 2 + (i / count) * TAU + (r() - 0.5) * 0.45;
      const rad = 0.92 + r() * 0.2;
      const x = cx + Math.cos(a) * rx * rad;
      const y = cy + Math.sin(a) * ry * rad;
      this.growSoma(x, y, m * this.opts.scale * (0.85 + r() * 0.3), 3 + Math.floor(r() * 3), this.opts.maxDepth, 1);
    }
  }

  private generateChain() {
    const r = this.random;
    const w = this.width;
    const h = this.height;
    const m = Math.min(w, h);
    const hubs = this.opts.chainHubs;
    hubs.forEach((hb, i) => {
      const idx = this.growSoma(hb.x * w, hb.y * h, m * 0.085, 3 + (i % 2), 3, 2);
      this.hubs.push(idx);
      this.hubActive.push(0);
    });
    const loopEnd = Math.min(this.opts.chainLoopEnd, this.hubs.length - 1);
    for (let i = 0; i < loopEnd; i++) {
      this.addBranch(this.hubs[i], this.hubs[i + 1], (i % 2 ? 1 : -1) * (0.1 + r() * 0.08), 2, 0, 0, 2, 0, i);
    }
    if (loopEnd > 0) {
      this.addBranch(this.hubs[loopEnd], this.hubs[0], this.opts.chainLoopCurv, 1.4, 0, 0, 3, 0, loopEnd);
    }
    const from = this.hubs[this.opts.chainNewFrom];
    const to = this.hubs[this.opts.chainNewTo];
    if (from !== undefined && to !== undefined) {
      this.addBranch(from, to, 0.18, 2.2, 0, 0, 4, 0, 99);
    }
  }

  /** Vytvoří neuron a nechá z něj vyrůst dendrity. Vrací index somy. */
  private growSoma(x: number, y: number, len0: number, dendrites: number, maxDepth: number, kind: 1 | 2) {
    const r = this.random;
    const somaIndex = this.nodes.length;
    this.addNode(x, y, kind === 2 ? 5 : 3.2, 0, somaIndex, kind, -1);
    const base = r() * TAU;
    for (let i = 0; i < dendrites; i++) {
      const angle = base + (i / dendrites) * TAU + (r() - 0.5) * 0.7;
      this.growBranch(somaIndex, angle, len0 * (0.8 + r() * 0.45), 1.5, 0, maxDepth, somaIndex);
    }
    return somaIndex;
  }

  private growBranch(from: number, angle: number, len: number, width: number, depth: number, maxDepth: number, soma: number) {
    const r = this.random;
    const fx = this.nodes[from].hx;
    const fy = this.nodes[from].hy;
    let a = angle;
    let ex = fx + Math.cos(a) * len;
    let ey = fy + Math.sin(a) * len;
    let terminal = false;

    // Vyhnout se prázdné oblasti (portrét): ohnout, nebo zastavit na jejím okraji.
    if (this.opts.void && this.voidT(ex, ey) < 1) {
      const v = this.opts.void;
      const away = Math.atan2(fy - v.y * this.height, fx - v.x * this.width);
      const a2 = away + (r() - 0.5) * 1.3;
      const ex2 = fx + Math.cos(a2) * len * 0.85;
      const ey2 = fy + Math.sin(a2) * len * 0.85;
      if (this.voidT(ex2, ey2) >= 1) {
        a = a2;
        ex = ex2;
        ey = ey2;
      } else {
        const t = this.rayToVoidEdge(fx, fy, ex, ey);
        if (t < 0.3) return;
        ex = fx + (ex - fx) * t * 0.94;
        ey = fy + (ey - fy) * t * 0.94;
        terminal = true;
      }
    }

    // Držet se v ploše (s malým přesahem).
    const pad = Math.min(this.width, this.height) * 0.04;
    if (ex < -pad || ex > this.width + pad || ey < -pad || ey > this.height + pad) {
      const tx = ex < -pad ? (-pad - fx) / (ex - fx) : ex > this.width + pad ? (this.width + pad - fx) / (ex - fx) : 1;
      const ty = ey < -pad ? (-pad - fy) / (ey - fy) : ey > this.height + pad ? (this.height + pad - fy) / (ey - fy) : 1;
      const t = clamp01(Math.min(tx, ty)) * 0.9;
      if (t < 0.3) return;
      ex = fx + (ex - fx) * t;
      ey = fy + (ey - fy) * t;
      terminal = true;
    }

    const nextDepth = depth + 1;
    const branchIndex = this.branches.length;
    const nodeIndex = this.addNode(ex, ey, 0.9 + r() * 0.7, nextDepth, soma, 0, branchIndex);
    const threshold = clamp(0.08 + depth * 0.17 + r() * 0.16, 0, 0.97);
    this.addBranch(from, nodeIndex, (r() - 0.5) * (0.16 + depth * 0.12), width, depth, threshold, 0, 1, -1);

    if (terminal || nextDepth >= maxDepth) return;

    const k = r() < (depth === 0 ? 0.9 : depth === 1 ? 0.6 : 0.4) ? 2 : 1;
    const spread = 0.5 + r() * 0.5;
    for (let i = 0; i < k; i++) {
      const dir = k === 2 ? (i === 0 ? -1 : 1) : r() < 0.5 ? -1 : 1;
      const na = a + dir * spread * (k === 2 ? 1 : 0.5) + (r() - 0.5) * 0.3;
      this.growBranch(nodeIndex, na, len * (0.72 + r() * 0.14), width * 0.74, nextDepth, maxDepth, soma);
    }
  }

  /** Synaptické spoje mezi koncovými výběžky různých neuronů. */
  private linkSynapses() {
    const r = this.random;
    const m = Math.min(this.width, this.height);
    const maxD = m * this.opts.scale * 0.55;
    const terminals: number[] = [];
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (n.kind === 0 && n.links.length === 1) terminals.push(i);
    }
    const used = new Set<number>();
    for (const i of terminals) {
      if (used.has(i) || r() > 0.55) continue;
      const a = this.nodes[i];
      let best = -1;
      let bestD = maxD;
      for (const j of terminals) {
        if (j === i || used.has(j)) continue;
        const b = this.nodes[j];
        if (b.soma === a.soma) continue;
        const d = Math.hypot(a.hx - b.hx, a.hy - b.hy);
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      }
      if (best >= 0) {
        used.add(i);
        used.add(best);
        this.addBranch(i, best, (r() - 0.5) * 0.5, 0.55, 5, 0.45 + r() * 0.4, 0, 1, -1);
      }
    }
  }

  private addNode(x: number, y: number, r: number, depth: number, soma: number, kind: 0 | 1 | 2, parent: number) {
    const rnd = this.random;
    this.nodes.push({
      hx: x, hy: y, x, y, r, depth, soma, kind,
      phase: rnd() * TAU,
      amp: kind === 0 ? 1.4 + depth * 1.25 : 1.2,
      excite: 0, dead: false, parent, links: [],
    });
    return this.nodes.length - 1;
  }

  private addBranch(
    a: number, b: number, curv: number, width: number, depth: number, threshold: number,
    kind: Branch["kind"], grow: number, seq: number,
  ) {
    const idx = this.branches.length;
    this.branches.push({ a, b, curv, width, depth, threshold, grow, state: 0, kind, dead: false, dissolve: 0, seq });
    this.nodes[a].links.push(idx);
    this.nodes[b].links.push(idx);
    return idx;
  }

  /** <1 uvnitř prázdné oblasti, 1 na okraji, >1 venku. */
  private voidT(x: number, y: number) {
    const v = this.opts.void;
    if (!v) return 2;
    const dx = (x - v.x * this.width) / (v.rx * this.width);
    const dy = (y - v.y * this.height) / (v.ry * this.height);
    return Math.sqrt(dx * dx + dy * dy);
  }

  private rayToVoidEdge(fx: number, fy: number, ex: number, ey: number) {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2;
      if (this.voidT(fx + (ex - fx) * mid, fy + (ey - fy) * mid) < 1) hi = mid;
      else lo = mid;
    }
    return lo;
  }

  /* -------------------------------------------------------- CHAIN */

  private applyChainProgress() {
    if (this.opts.layout !== "chain") return;
    const p = this.chainProgress;
    const T = CHAIN_TIMELINE;
    const loopEnd = this.opts.chainLoopEnd;
    for (let i = 0; i < this.hubs.length; i++) {
      if (i === this.opts.chainNewTo) {
        this.hubActive[i] = smoothstep(T.newHubAt - 0.03, T.newHubAt + 0.03, p);
      } else {
        let v = smoothstep(T.hubAt(i) - 0.015, T.hubAt(i) + 0.05, p);
        if (i === loopEnd) v *= 1 - 0.75 * smoothstep(T.newPath[0], T.newPath[1], p);
        this.hubActive[i] = v;
      }
    }
    for (const br of this.branches) {
      if (br.kind === 2) {
        const g = clamp01((p - T.hubAt(br.seq) - 0.02) / (T.hubSpan * 0.8));
        br.grow = g;
        br.state = g > 0 && g < 1 ? 1 : 0;
      } else if (br.kind === 3) {
        br.grow = clamp01((p - T.loopGrow[0]) / (T.loopGrow[1] - T.loopGrow[0]));
        br.state = br.grow > 0 && br.grow < 1 ? 1 : 0;
        br.dissolve = clamp01((p - T.loopDissolve[0]) / (T.loopDissolve[1] - T.loopDissolve[0]));
      } else if (br.kind === 4) {
        br.grow = clamp01((p - T.newPath[0]) / (T.newPath[1] - T.newPath[0]));
        br.state = br.grow > 0 && br.grow < 1 ? 1 : 0;
      }
    }
  }

  /* --------------------------------------------------------- STEP */

  private step(dt: number) {
    const s = this.current;
    const t = this.target;
    const k = 1 - Math.exp(-dt * 1.4);
    s.alpha += (t.alpha - s.alpha) * k;
    s.density += (t.density - s.density) * k;
    s.violet += (t.violet - s.violet) * k;
    s.speed += (t.speed - s.speed) * k;
    s.pulseRate += (t.pulseRate - s.pulseRate) * k;
    s.rewire += (t.rewire - s.rewire) * k;
    s.glow += (t.glow - s.glow) * k;
    s.biasX += (t.biasX - s.biasX) * k * 0.6;
    s.biasY += (t.biasY - s.biasY) * k * 0.6;

    this.time += dt;
    const time = this.time;
    const sp = s.speed;
    const w = this.width;
    const h = this.height;
    const chain = this.opts.layout === "chain";

    this.offX = s.biasX * w * 0.22;
    this.offY = s.biasY * h * 0.15;
    const driftX = chain ? 0 : Math.sin(time * 0.045) * w * 0.012;
    const driftY = chain ? 0 : Math.cos(time * 0.038) * h * 0.012;

    const p = this.pointer;
    const px = p ? p.x - this.offX : 0;
    const py = p ? p.y - this.offY : 0;
    const pr = Math.max(140, Math.min(w, h) * 0.24);

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (n.dead) continue;
      const amp = chain ? n.amp * 0.5 : n.amp;
      n.x = n.hx + Math.sin(time * 0.33 * sp + n.phase) * amp + driftX;
      n.y = n.hy + Math.cos(time * 0.26 * sp + n.phase * 1.7) * amp * 0.75 + driftY;
      if (p && this.opts.interactive) {
        const dx = px - n.x;
        const dy = py - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < pr) {
          const f = (1 - d / pr) * (1 - d / pr);
          n.x += dx * f * 0.1;
          n.y += dy * f * 0.1;
          n.excite = Math.max(n.excite, f * 0.85);
        }
      }
      n.excite *= Math.pow(0.93, dt * 60);
    }

    // Růst a rozpad větví
    for (let i = 0; i < this.branches.length; i++) {
      const br = this.branches[i];
      if (br.dead || br.kind !== 0 && br.kind !== 1) continue;
      if (br.state === 1) {
        br.grow += dt * (0.32 + 0.3 * sp);
        if (br.grow >= 1) {
          br.grow = 1;
          br.state = 0;
        }
      } else if (br.state === 2) {
        br.grow -= dt * (0.38 + 0.25 * sp);
        if (br.grow <= 0) {
          br.grow = 0;
          br.dead = true;
          const nb = this.nodes[br.b];
          if (!nb.links.some((l) => l !== i && !this.branches[l].dead)) nb.dead = true;
          this.pulses = this.pulses.filter((pl) => pl.branch !== i);
        }
      }
    }

    if (!chain && s.rewire > 0.01) {
      this.rewireAccumulator += dt * s.rewire * 0.9;
      let guard = 0;
      while (this.rewireAccumulator >= 1 && guard++ < 3) {
        this.rewireAccumulator -= 1;
        this.rewireOnce();
      }
    }

    // Impulzy
    if (this.branches.length) {
      this.pulseAccumulator += s.pulseRate * dt;
      let guard = 0;
      while (this.pulseAccumulator >= 1 && guard++ < 3 && this.pulses.length < 48) {
        this.pulseAccumulator -= 1;
        this.spawnPulse();
      }
    }
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      const br = this.branches[pulse.branch];
      if (!br || br.dead) {
        this.pulses.splice(i, 1);
        continue;
      }
      pulse.t += pulse.speed * dt * pulse.dir;
      if (pulse.t > 1 || pulse.t < 0) {
        const node = pulse.dir === 1 ? br.b : br.a;
        this.nodes[node].excite = Math.max(this.nodes[node].excite, 0.75);
        pulse.hops -= 1;
        const next = this.nodes[node].links.filter((l) => {
          const nb = this.branches[l];
          return l !== pulse.branch && !nb.dead && nb.grow >= 0.98 && this.branchVisibility(nb) > 0.4;
        });
        if (pulse.hops > 0 && next.length) {
          const idx = next[(Math.random() * next.length) | 0];
          const nb = this.branches[idx];
          pulse.branch = idx;
          pulse.dir = nb.a === node ? 1 : -1;
          pulse.t = pulse.dir === 1 ? 0 : 1;
        } else {
          this.pulses.splice(i, 1);
        }
      }
    }
  }

  private rewireOnce() {
    const r = Math.random;
    // Rozpad: koncová větev (hloubka ≥ 2) bez živých dětí.
    for (let tries = 0; tries < 14; tries++) {
      const idx = (r() * this.branches.length) | 0;
      const br = this.branches[idx];
      if (br.dead || br.kind !== 0 || br.depth < 2 || br.state !== 0) continue;
      const nb = this.nodes[br.b];
      if (nb.links.some((l) => l !== idx && !this.branches[l].dead)) continue;
      br.state = 2;
      break;
    }
    // Růst: nová větev z uzlu střední hloubky, novým směrem.
    const alive = this.branches.reduce((acc, b) => acc + (b.dead ? 0 : 1), 0);
    if (alive >= this.baseBranchCount * 1.12) return;
    const m = Math.min(this.width, this.height);
    for (let tries = 0; tries < 14; tries++) {
      const idx = (r() * this.nodes.length) | 0;
      const n = this.nodes[idx];
      if (n.dead || n.kind !== 0 || n.depth < 1 || n.depth > this.opts.maxDepth - 2 || n.parent < 0) continue;
      const liveLinks = n.links.filter((l) => !this.branches[l].dead).length;
      if (liveLinks >= 3) continue;
      const parent = this.branches[n.parent];
      const pa = this.nodes[parent.a];
      const dir = Math.atan2(n.hy - pa.hy, n.hx - pa.hx);
      const angle = dir + (r() - 0.5) * 1.7;
      const len = m * this.opts.scale * Math.pow(0.72, n.depth) * (0.8 + r() * 0.4);
      const ex = n.hx + Math.cos(angle) * len;
      const ey = n.hy + Math.sin(angle) * len;
      if (this.voidT(ex, ey) < 1) continue;
      if (ex < 0 || ex > this.width || ey < 0 || ey > this.height) continue;
      const bi = this.branches.length;
      const ni = this.addNode(ex, ey, 1 + r() * 0.6, n.depth + 1, n.soma, 0, bi);
      const width = 1.5 * Math.pow(0.74, n.depth);
      this.addBranch(idx, ni, (r() - 0.5) * 0.6, width, n.depth, clamp(0.08 + n.depth * 0.17 + r() * 0.16, 0, 0.97), 0, 0, -1);
      this.branches[bi].state = 1;
      break;
    }
  }

  private branchVisibility(br: Branch) {
    if (br.kind >= 2) return 1;
    return smoothstep(br.threshold - 0.08, br.threshold + 0.08, this.current.density);
  }

  private hubFactor(br: Branch) {
    if (this.opts.layout !== "chain") return 1;
    const soma = this.nodes[br.a].soma;
    const hubIdx = this.hubs.indexOf(soma);
    if (hubIdx < 0) return 1;
    const active = this.hubActive[hubIdx];
    if (hubIdx === this.opts.chainNewTo) return active;
    return 0.3 + 0.7 * active;
  }

  private spawnPulse() {
    for (let tries = 0; tries < 10; tries++) {
      const idx = (Math.random() * this.branches.length) | 0;
      const br = this.branches[idx];
      if (br.dead || br.grow < 0.98 || br.kind === 3 || br.kind === 4) continue;
      if (this.branchVisibility(br) * this.hubFactor(br) < 0.5) continue;
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      this.pulses.push({
        branch: idx,
        t: dir === 1 ? 0 : 1,
        dir,
        speed: 0.55 + Math.random() * 0.6,
        hops: 2 + ((Math.random() * 4) | 0),
      });
      return;
    }
  }

  /* ------------------------------------------------------- RENDER */

  private render() {
    const ctx = this.ctx;
    const s = this.current;
    const P = this.palette;
    const w = this.width;
    const h = this.height;
    const m = Math.min(w, h);
    const chain = this.opts.layout === "chain";
    ctx.clearRect(0, 0, w, h);
    if (s.alpha <= 0.005) return;
    ctx.save();
    ctx.translate(this.offX, this.offY);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const auraColor = mix(P.auraA, P.auraB, s.violet);
    const edgeColor = P.stroke;
    const pulseColor = mix(P.gold, P.pulse, 0.35 + s.violet * 0.65);

    // Aury neuronů
    if (s.glow > 0.02) {
      for (let i = 0; i < this.nodes.length; i++) {
        const n = this.nodes[i];
        if (n.dead || n.kind === 0) continue;
        let act = 1;
        if (n.kind === 2) {
          const hi = this.hubs.indexOf(i);
          act = hi >= 0 ? this.hubActive[hi] : 1;
          if (act <= 0.01) continue;
        }
        const rad = m * (n.kind === 2 ? 0.11 : 0.085) * (0.8 + s.glow * 0.5) * (0.7 + act * 0.3);
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rad);
        const a = P.auraAlpha * s.glow * s.alpha * act;
        g.addColorStop(0, rgba(auraColor, a));
        g.addColorStop(0.55, rgba(auraColor, a * 0.35));
        g.addColorStop(1, rgba(auraColor, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, rad, 0, TAU);
        ctx.fill();
      }
    }

    // Větve
    for (let i = 0; i < this.branches.length; i++) {
      const br = this.branches[i];
      if (br.dead || br.grow <= 0.001) continue;
      const vis = this.branchVisibility(br);
      if (vis <= 0.02) continue;
      const na = this.nodes[br.a];
      const nb = this.nodes[br.b];
      const [cx, cy] = ctrlPoint(na.x, na.y, nb.x, nb.y, br.curv);
      let alpha: number;
      let color: RGB = edgeColor;
      let width = br.width;
      if (br.kind >= 2) {
        alpha = P.linkAlpha * s.alpha;
        if (br.kind === 4) {
          color = P.gold;
          alpha = 0.95 * s.alpha;
        } else if (br.kind === 3) {
          color = mix(edgeColor, P.violet, 0.5);
          alpha *= 1 - br.dissolve * 0.9;
        } else {
          color = mix(edgeColor, P.violet, 0.25);
        }
      } else {
        const ex = Math.max(na.excite, nb.excite);
        alpha =
          P.strokeAlpha * this.opts.inkBoost * s.alpha * vis * (1 - br.depth * 0.08) * this.hubFactor(br) +
          ex * 0.35 * s.alpha;
        if (ex > 0.05) color = mix(edgeColor, pulseColor, ex * 0.8);
        if (br.kind === 1) {
          alpha *= 0.8;
          width = 0.55;
        }
      }
      if (alpha < 0.01) continue;

      ctx.strokeStyle = rgba(color, alpha);
      ctx.lineWidth = width;
      if (br.kind === 3 && br.dissolve > 0.01) {
        ctx.setLineDash([Math.max(2, 14 * (1 - br.dissolve)), 4 + 46 * br.dissolve]);
      }
      if (br.kind === 4) {
        ctx.shadowColor = rgba(P.gold, 0.7 * s.alpha);
        ctx.shadowBlur = 14;
      }
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      if (br.grow >= 0.999) {
        ctx.quadraticCurveTo(cx, cy, nb.x, nb.y);
      } else {
        const g = br.grow;
        const [ex, ey] = bezPoint(na.x, na.y, cx, cy, nb.x, nb.y, g);
        ctx.quadraticCurveTo(lerp(na.x, cx, g), lerp(na.y, cy, g), ex, ey);
      }
      ctx.stroke();
      if (br.kind === 3) ctx.setLineDash([]);
      if (br.kind === 4) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      // Rostoucí špička spoje řetězce = putující impulz
      if (chain && br.kind >= 2 && br.state === 1) {
        const [hx, hy] = bezPoint(na.x, na.y, cx, cy, nb.x, nb.y, br.grow);
        const hc = br.kind === 4 ? P.gold : pulseColor;
        const gr = ctx.createRadialGradient(hx, hy, 0, hx, hy, 16);
        gr.addColorStop(0, rgba(hc, 0.9 * s.alpha));
        gr.addColorStop(0.3, rgba(hc, 0.35 * s.alpha));
        gr.addColorStop(1, rgba(hc, 0));
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(hx, hy, 16, 0, TAU);
        ctx.fill();
      }
    }

    // Impulzy
    for (const pulse of this.pulses) {
      const br = this.branches[pulse.branch];
      if (!br || br.dead) continue;
      const na = this.nodes[br.a];
      const nb = this.nodes[br.b];
      const [cx, cy] = ctrlPoint(na.x, na.y, nb.x, nb.y, br.curv);
      const t = clamp01(pulse.t);
      const tail = clamp01(t - 0.18 * pulse.dir);
      const [hx, hy] = bezPoint(na.x, na.y, cx, cy, nb.x, nb.y, t);
      const [tx, ty] = bezPoint(na.x, na.y, cx, cy, nb.x, nb.y, tail);
      const [qx, qy] = blossom(na.x, na.y, cx, cy, nb.x, nb.y, tail, t);
      const grad = ctx.createLinearGradient(tx, ty, hx, hy);
      grad.addColorStop(0, rgba(pulseColor, 0));
      grad.addColorStop(1, rgba(pulseColor, 0.9 * s.alpha));
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1.2, br.width * 0.9);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(qx, qy, hx, hy);
      ctx.stroke();

      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 9);
      g.addColorStop(0, rgba(pulseColor, 0.85 * s.alpha));
      g.addColorStop(0.4, rgba(pulseColor, 0.3 * s.alpha));
      g.addColorStop(1, rgba(pulseColor, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(hx, hy, 9, 0, TAU);
      ctx.fill();
    }

    // Uzly
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (n.dead) continue;
      if (n.kind === 0) {
        const parent = n.parent >= 0 ? this.branches[n.parent] : null;
        if (parent) {
          if (parent.dead || parent.grow < 0.97) continue;
          const vis = this.branchVisibility(parent) * this.hubFactor(parent);
          if (vis < 0.15) continue;
          const terminal = !n.links.some((l) => l !== n.parent && !this.branches[l].dead && this.branches[l].kind === 0);
          const ex = n.excite;
          const r = (terminal ? n.r * 1.5 : n.r) * (1 + ex * 1.1);
          const baseColor = terminal ? mix(P.node, P.soma, 0.6) : P.node;
          const color = ex > 0.05 ? mix(baseColor, pulseColor, ex) : baseColor;
          const alpha = (terminal ? 0.42 : 0.3) * this.opts.inkBoost * vis * s.alpha + ex * 0.5 * s.alpha;
          if (ex > 0.2) {
            const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
            gr.addColorStop(0, rgba(color, 0.35 * ex * s.alpha));
            gr.addColorStop(1, rgba(color, 0));
            ctx.fillStyle = gr;
            ctx.beginPath();
            ctx.arc(n.x, n.y, r * 4, 0, TAU);
            ctx.fill();
          }
          ctx.fillStyle = rgba(color, alpha);
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, TAU);
          ctx.fill();
        }
      } else if (n.kind === 1) {
        const ex = n.excite;
        const color = ex > 0.05 ? mix(P.soma, pulseColor, ex) : P.soma;
        ctx.strokeStyle = rgba(color, 0.55 * s.alpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 2.5 + ex * 3, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = rgba(color, 0.9 * s.alpha);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 0.55 + ex, 0, TAU);
        ctx.fill();
      } else {
        const hi = this.hubs.indexOf(i);
        const act = hi >= 0 ? this.hubActive[hi] : 1;
        const isNew = hi === this.opts.chainNewTo;
        const color = isNew ? P.gold : mix(P.soma, pulseColor, act * 0.7);
        const baseAlpha = isNew ? act : 0.35 + 0.65 * act;
        if (act > 0.02) {
          const rad = 22 + act * 16;
          const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rad);
          gr.addColorStop(0, rgba(color, 0.55 * act * s.alpha));
          gr.addColorStop(1, rgba(color, 0));
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.arc(n.x, n.y, rad, 0, TAU);
          ctx.fill();
        }
        ctx.strokeStyle = rgba(color, 0.7 * baseAlpha * s.alpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 5 + act * 4, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = rgba(color, baseAlpha * s.alpha);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.6 + act * 0.5), 0, TAU);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private renderStatic() {
    for (const br of this.branches) {
      if (br.kind === 0 || br.kind === 1) {
        br.grow = 1;
        br.state = 0;
      }
    }
    this.pulses = [];
    this.offX = this.current.biasX * this.width * 0.22;
    this.offY = this.current.biasY * this.height * 0.15;
    for (const n of this.nodes) {
      n.x = n.hx;
      n.y = n.hy;
    }
    this.render();
  }

  private loop = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);
    const minFrame = 1000 / this.opts.maxFps;
    const elapsed = now - this.lastTime;
    if (elapsed < minFrame - 1) return;
    const dt = Math.min(0.05, elapsed / 1000);
    this.lastTime = now;
    this.step(dt);
    this.render();
  };
}
