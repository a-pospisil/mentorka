import { neuralPresets, type NeuralState } from "./presets";

/**
 * NeuralEngine – lehký Canvas 2D systém neuronové sítě.
 *
 * – uzly pomalu driftují (uniform) nebo drží tvar „halo“ kolem středu
 * – spoje mají deterministický práh; s rostoucí „connectivity“ se postupně
 *   rozsvěcují další spoje (metafora nových neuronových drah)
 * – po spojích putují světelné impulzy, které mohou pokračovat dál sítí
 * – kurzor uzly „aktivuje“ (rozsvítí je i jejich spoje)
 * – stav se plynule interpoluje k cílovému presetu
 * – respektuje reduced motion (jeden statický snímek), limit FPS a DPR
 */

export type Distribution = "uniform" | "halo";

export interface EngineOptions {
  count?: number;
  distribution?: Distribution;
  interactive?: boolean;
  maxFps?: number;
  dprCap?: number;
  /** Paralaxa scrollu (jen uniform): 0 = žádná. */
  parallax?: number;
  /** Základní dosah spoje v px (přepočítá se podle velikosti plochy). */
  linkDistance?: number;
  /** Rychlost interpolace stavu (vyšší = rychlejší). */
  lerpRate?: number;
  /** Statický snímek bez animace (prefers-reduced-motion). */
  staticFrame?: boolean;
  /** Výchozí stav. */
  initial?: NeuralState;
  /** Halo: relativní vnitřní/vnější poloměr (vůči kratší straně). */
  haloInner?: number;
  haloOuter?: number;
  /** Míra, jak moc síť „ustupuje“ od středu (halo) – 0..1. */
  haloCenterVoid?: number;
  seed?: number;
}

interface Edge {
  a: number;
  b: number;
  threshold: number;
}

interface Pulse {
  edge: number;
  t: number;
  dir: 1 | -1;
  speed: number;
  life: number;
}

const GOLD = [201, 180, 138] as const;
const BONE = [247, 243, 237] as const;
const VIOLET = [144, 141, 201] as const;

const mix = (a: readonly number[], b: readonly number[], t: number) =>
  [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] as const;

const rgba = (c: readonly number[], a: number) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** Deterministický pseudo-náhodný generátor (mulberry32). */
const createRandom = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const hashPair = (a: number, b: number) => {
  let h = (a * 73856093) ^ (b * 19349663);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  h ^= h >>> 15;
  return ((h >>> 0) % 10000) / 10000;
};

export class NeuralEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: Required<
    Omit<EngineOptions, "initial" | "seed">
  > & { initial: NeuralState; seed: number };

  private width = 0;
  private height = 0;
  private dpr = 1;

  private count = 0;
  private x!: Float32Array;
  private y!: Float32Array;
  private hx!: Float32Array; // home (halo)
  private hy!: Float32Array;
  private vx!: Float32Array;
  private vy!: Float32Array;
  private size!: Float32Array;
  private phase!: Float32Array;
  private excite!: Float32Array;
  private hub!: Uint8Array;

  private edges: Edge[] = [];
  private adjacency: number[][] = [];
  private pulses: Pulse[] = [];

  private current: NeuralState;
  private target: NeuralState;

  private pointer: { x: number; y: number } | null = null;
  private scrollY = 0;

  private raf = 0;
  private running = false;
  private lastTime = 0;
  private lastEdgeBuild = 0;
  private time = 0;
  private pulseAccumulator = 0;
  private random: () => number;
  private destroyed = false;

  constructor(canvas: HTMLCanvasElement, options: EngineOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Canvas 2D není k dispozici.");
    this.ctx = ctx;

    this.opts = {
      count: options.count ?? 120,
      distribution: options.distribution ?? "uniform",
      interactive: options.interactive ?? true,
      maxFps: options.maxFps ?? 60,
      dprCap: options.dprCap ?? 1.5,
      parallax: options.parallax ?? 0.08,
      linkDistance: options.linkDistance ?? 150,
      lerpRate: options.lerpRate ?? 1.6,
      staticFrame: options.staticFrame ?? false,
      initial: options.initial ?? neuralPresets.hero,
      haloInner: options.haloInner ?? 0.42,
      haloOuter: options.haloOuter ?? 0.72,
      haloCenterVoid: options.haloCenterVoid ?? 0.6,
      seed: options.seed ?? 1337,
    };

    this.random = createRandom(this.opts.seed);
    this.current = { ...this.opts.initial };
    this.target = { ...this.opts.initial };

    this.resize();
  }

  /* ----------------------------------------------------------- API */

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

  getState(): Readonly<NeuralState> {
    return this.current;
  }

  setPointer(x: number | null, y?: number) {
    if (x === null || y === undefined) {
      this.pointer = null;
      return;
    }
    this.pointer = { x, y };
  }

  setScroll(y: number) {
    this.scrollY = y;
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

    const first = this.width === 0;
    const sx = first ? 1 : w / this.width;
    const sy = first ? 1 : h / this.height;

    this.width = w;
    this.height = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (first) {
      this.seedNodes();
    } else {
      for (let i = 0; i < this.count; i++) {
        this.x[i] *= sx;
        this.y[i] *= sy;
        this.hx[i] *= sx;
        this.hy[i] *= sy;
      }
      this.buildEdges(true);
    }

    if (this.opts.staticFrame) this.renderStatic();
  }

  /* ---------------------------------------------------- INTERNALS */

  private seedNodes() {
    const n = this.opts.count;
    this.count = n;
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.hx = new Float32Array(n);
    this.hy = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.size = new Float32Array(n);
    this.phase = new Float32Array(n);
    this.excite = new Float32Array(n);
    this.hub = new Uint8Array(n);

    const r = this.random;
    const w = this.width;
    const h = this.height;

    for (let i = 0; i < n; i++) {
      if (this.opts.distribution === "halo") {
        const cx = w / 2;
        const cy = h / 2;
        const base = Math.min(w, h) / 2;
        // Většina uzlů v prstenci kolem středu, část i uvnitř (přes fotografii).
        const inRing = r() > this.opts.haloCenterVoid * 0.35;
        const angle = r() * Math.PI * 2;
        const radius = inRing
          ? base * (this.opts.haloInner + r() * (this.opts.haloOuter - this.opts.haloInner))
          : base * r() * this.opts.haloInner;
        // Elipsa přizpůsobená poměru stran plochy.
        const ex = w / Math.min(w, h);
        const ey = h / Math.min(w, h);
        this.hx[i] = cx + Math.cos(angle) * radius * ex;
        this.hy[i] = cy + Math.sin(angle) * radius * ey;
        this.x[i] = this.hx[i];
        this.y[i] = this.hy[i];
      } else {
        this.x[i] = r() * w;
        this.y[i] = r() * h;
        this.hx[i] = this.x[i];
        this.hy[i] = this.y[i];
      }
      const a = r() * Math.PI * 2;
      const s = 0.08 + r() * 0.16;
      this.vx[i] = Math.cos(a) * s;
      this.vy[i] = Math.sin(a) * s;
      this.hub[i] = r() < 0.09 ? 1 : 0;
      this.size[i] = this.hub[i] ? 2.2 + r() * 1.2 : 0.9 + r() * 1.1;
      this.phase[i] = r() * Math.PI * 2;
    }

    this.buildEdges(true);
  }

  private linkDistance() {
    // Dosah škálovaný podle plochy, aby síť měla podobnou hustotu na všech
    // velikostech obrazovky.
    const area = this.width * this.height;
    const perNode = Math.sqrt(area / Math.max(1, this.count));
    return Math.min(this.opts.linkDistance * 1.6, Math.max(70, perNode * 1.55)) * this.current.reach;
  }

  private drawY(i: number) {
    if (this.opts.distribution === "halo" || this.opts.parallax === 0) return this.y[i];
    const offset = (this.scrollY * this.opts.parallax) % this.height;
    let y = this.y[i] - offset;
    if (y < 0) y += this.height;
    return y;
  }

  private buildEdges(force = false) {
    const now = this.time;
    if (!force && now - this.lastEdgeBuild < 0.22) return;
    this.lastEdgeBuild = now;

    const maxDist = this.linkDistance() * 1.25; // rezerva pro změny reach
    const cell = maxDist;
    const cols = Math.max(1, Math.ceil(this.width / cell));
    const rows = Math.max(1, Math.ceil(this.height / cell));
    const grid: number[][] = new Array(cols * rows);
    for (let i = 0; i < grid.length; i++) grid[i] = [];

    const py = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      py[i] = this.drawY(i);
      const cx = Math.min(cols - 1, Math.max(0, Math.floor(this.x[i] / cell)));
      const cy = Math.min(rows - 1, Math.max(0, Math.floor(py[i] / cell)));
      grid[cy * cols + cx].push(i);
    }

    const edges: Edge[] = [];
    const adjacency: number[][] = new Array(this.count);
    for (let i = 0; i < this.count; i++) adjacency[i] = [];
    const maxSq = maxDist * maxDist;
    const maxPerNode = 6;

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const bucket = grid[cy * cols + cx];
        for (const i of bucket) {
          for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              const nx = cx + ox;
              const ny = cy + oy;
              if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
              for (const j of grid[ny * cols + nx]) {
                if (j <= i) continue;
                if (adjacency[i].length >= maxPerNode || adjacency[j].length >= maxPerNode) continue;
                const dx = this.x[i] - this.x[j];
                const dy = py[i] - py[j];
                const d2 = dx * dx + dy * dy;
                if (d2 > maxSq) continue;
                const idx = edges.length;
                edges.push({ a: i, b: j, threshold: hashPair(i, j) });
                adjacency[i].push(idx);
                adjacency[j].push(idx);
              }
            }
          }
        }
      }
    }

    // Zachovat impulzy na spojích, které stále existují.
    const map = new Map<string, number>();
    edges.forEach((e, idx) => map.set(`${e.a}-${e.b}`, idx));
    this.pulses = this.pulses
      .map((p) => {
        const old = this.edges[p.edge];
        if (!old) return null;
        const idx = map.get(`${old.a}-${old.b}`);
        if (idx === undefined) return null;
        return { ...p, edge: idx };
      })
      .filter((p): p is Pulse => p !== null);

    this.edges = edges;
    this.adjacency = adjacency;
  }

  private edgeVisibility(e: Edge, dist: number, maxDist: number) {
    const c = this.current.connectivity;
    const base = smoothstep(e.threshold - 0.1, e.threshold + 0.1, c);
    const ex = Math.max(this.excite[e.a], this.excite[e.b]);
    const falloff = 1 - Math.pow(Math.min(1, dist / maxDist), 2);
    if (falloff <= 0) return 0;
    return clamp01(base + ex * 0.9) * falloff;
  }

  private step(dt: number) {
    const s = this.current;
    const t = this.target;
    const k = 1 - Math.exp(-dt * this.opts.lerpRate);
    s.connectivity += (t.connectivity - s.connectivity) * k;
    s.brightness += (t.brightness - s.brightness) * k;
    s.speed += (t.speed - s.speed) * k;
    s.jitter += (t.jitter - s.jitter) * k;
    s.pulseRate += (t.pulseRate - s.pulseRate) * k;
    s.violet += (t.violet - s.violet) * k;
    s.reach += (t.reach - s.reach) * k;

    this.time += dt;
    const w = this.width;
    const h = this.height;
    const halo = this.opts.distribution === "halo";
    const speed = s.speed * dt * 60;
    const jitter = s.jitter;

    // Kurzor
    const p = this.pointer;
    const pr = Math.max(120, Math.min(w, h) * 0.22);

    for (let i = 0; i < this.count; i++) {
      // Jemné bloudění
      const ph = this.phase[i] + this.time * 0.35;
      this.vx[i] += Math.cos(ph) * 0.004 * speed;
      this.vy[i] += Math.sin(ph * 1.3) * 0.004 * speed;

      if (halo) {
        // Pružina k domovské pozici – síť drží tvar kolem portrétu.
        const dx = this.hx[i] - this.x[i];
        const dy = this.hy[i] - this.y[i];
        this.vx[i] += dx * 0.0015 * speed;
        this.vy[i] += dy * 0.0015 * speed;
      }

      // Tlumení
      this.vx[i] *= 0.985;
      this.vy[i] *= 0.985;

      // Kurzor: uzly se rozsvítí a lehce se přikloní
      if (p && this.opts.interactive) {
        const dx = p.x - this.x[i];
        const dy = p.y - this.drawY(i);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < pr) {
          const f = 1 - d / pr;
          this.excite[i] = Math.max(this.excite[i], f);
          if (d > 8) {
            this.vx[i] += (dx / d) * f * 0.03 * speed;
            this.vy[i] += (dy / d) * f * 0.03 * speed;
          }
        }
      }
      this.excite[i] *= Math.pow(0.9, dt * 60);

      this.x[i] += this.vx[i] * speed + (jitter > 0 ? (Math.random() - 0.5) * jitter * 1.8 : 0);
      this.y[i] += this.vy[i] * speed + (jitter > 0 ? (Math.random() - 0.5) * jitter * 1.8 : 0);

      if (halo) {
        // Halo: neutíkat z plochy
        if (this.x[i] < -20) this.x[i] = -20;
        if (this.x[i] > w + 20) this.x[i] = w + 20;
        if (this.y[i] < -20) this.y[i] = -20;
        if (this.y[i] > h + 20) this.y[i] = h + 20;
      } else {
        // Torus
        if (this.x[i] < 0) this.x[i] += w;
        else if (this.x[i] >= w) this.x[i] -= w;
        if (this.y[i] < 0) this.y[i] += h;
        else if (this.y[i] >= h) this.y[i] -= h;
      }
    }

    this.buildEdges();

    // Impulzy
    if (this.edges.length) {
      this.pulseAccumulator += s.pulseRate * dt;
      let guard = 0;
      while (this.pulseAccumulator >= 1 && guard++ < 4 && this.pulses.length < 40) {
        this.pulseAccumulator -= 1;
        this.spawnPulse();
      }
    }
    const maxDist = this.linkDistance();
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i];
      pulse.t += pulse.speed * dt * pulse.dir;
      pulse.life -= dt;
      if (pulse.life <= 0) {
        this.pulses.splice(i, 1);
        continue;
      }
      if (pulse.t > 1 || pulse.t < 0) {
        // Pokračovat na sousední spoj (propagace signálu)
        const e = this.edges[pulse.edge];
        const node = pulse.dir === 1 ? e.b : e.a;
        const next = this.adjacency[node]?.filter((idx) => idx !== pulse.edge) ?? [];
        const candidates = next.filter((idx) => {
          const ne = this.edges[idx];
          const d = this.edgeLength(ne);
          return this.edgeVisibility(ne, d, maxDist) > 0.35;
        });
        if (candidates.length && Math.random() < 0.7) {
          const idx = candidates[(Math.random() * candidates.length) | 0];
          const ne = this.edges[idx];
          pulse.edge = idx;
          pulse.dir = ne.a === node ? 1 : -1;
          pulse.t = pulse.dir === 1 ? 0 : 1;
          this.excite[node] = Math.max(this.excite[node], 0.6);
        } else {
          this.excite[node] = Math.max(this.excite[node], 0.5);
          this.pulses.splice(i, 1);
        }
      }
    }
  }

  private edgeLength(e: Edge) {
    const dx = this.x[e.a] - this.x[e.b];
    const dy = this.drawY(e.a) - this.drawY(e.b);
    return Math.sqrt(dx * dx + dy * dy);
  }

  private spawnPulse() {
    const maxDist = this.linkDistance();
    for (let tries = 0; tries < 8; tries++) {
      const idx = (Math.random() * this.edges.length) | 0;
      const e = this.edges[idx];
      const d = this.edgeLength(e);
      if (d > this.height / 2) continue; // přes okraj torusu
      if (this.edgeVisibility(e, d, maxDist) < 0.45) continue;
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      this.pulses.push({
        edge: idx,
        t: dir === 1 ? 0 : 1,
        dir,
        speed: 0.9 + Math.random() * 0.9,
        life: 2.5 + Math.random() * 3,
      });
      return;
    }
  }

  private render() {
    const ctx = this.ctx;
    const s = this.current;
    const w = this.width;
    const h = this.height;
    ctx.clearRect(0, 0, w, h);

    const maxDist = this.linkDistance();
    const bright = s.brightness;
    const edgeColor = mix(GOLD, VIOLET, s.violet * 0.7);
    const nodeColor = mix(BONE, GOLD, 0.4);
    const pulseColor = mix(BONE, VIOLET, s.violet);
    const seam = h / 2;

    // Spoje
    ctx.lineCap = "round";
    for (let i = 0; i < this.edges.length; i++) {
      const e = this.edges[i];
      const ax = this.x[e.a];
      const ay = this.drawY(e.a);
      const bx = this.x[e.b];
      const by = this.drawY(e.b);
      if (Math.abs(ay - by) > seam) continue;
      const dx = ax - bx;
      const dy = ay - by;
      const d = Math.sqrt(dx * dx + dy * dy);
      const vis = this.edgeVisibility(e, d, maxDist);
      if (vis <= 0.01) continue;
      const alpha = vis * 0.42 * bright;
      if (alpha < 0.01) continue;
      ctx.strokeStyle = rgba(edgeColor, alpha);
      ctx.lineWidth = 0.6 + vis * 0.5;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }

    // Uzly
    for (let i = 0; i < this.count; i++) {
      const px = this.x[i];
      const py = this.drawY(i);
      const twinkle = 0.75 + 0.25 * Math.sin(this.time * (0.9 + s.jitter * 6) + this.phase[i]);
      const ex = this.excite[i];
      const alpha = (0.35 + 0.45 * twinkle + ex * 0.6) * bright;
      const r = this.size[i] * (1 + ex * 0.8);
      const color = ex > 0.05 ? mix(nodeColor, pulseColor, ex) : nodeColor;

      if (this.hub[i] || ex > 0.15) {
        // Jemná svatozář hubů a aktivovaných uzlů
        const glowR = r * (3.5 + ex * 3);
        const g = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        g.addColorStop(0, rgba(color, Math.min(0.55, alpha * 0.5)));
        g.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = rgba(color, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Impulzy
    for (const pulse of this.pulses) {
      const e = this.edges[pulse.edge];
      if (!e) continue;
      const ax = this.x[e.a];
      const ay = this.drawY(e.a);
      const bx = this.x[e.b];
      const by = this.drawY(e.b);
      if (Math.abs(ay - by) > seam) continue;
      const t = clamp01(pulse.t);
      const px = ax + (bx - ax) * t;
      const py = ay + (by - ay) * t;
      const fade = Math.min(1, pulse.life / 0.6);
      const tailT = clamp01(t - 0.16 * pulse.dir);
      const tx = ax + (bx - ax) * tailT;
      const ty = ay + (by - ay) * tailT;

      const grad = ctx.createLinearGradient(tx, ty, px, py);
      grad.addColorStop(0, rgba(pulseColor, 0));
      grad.addColorStop(1, rgba(pulseColor, 0.9 * fade * bright));
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(px, py);
      ctx.stroke();

      const g = ctx.createRadialGradient(px, py, 0, px, py, 9);
      g.addColorStop(0, rgba(pulseColor, 0.9 * fade * bright));
      g.addColorStop(0.35, rgba(pulseColor, 0.35 * fade * bright));
      g.addColorStop(1, rgba(pulseColor, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private renderStatic() {
    // Statický snímek: jednou spočítat spoje a vykreslit bez impulzů.
    this.buildEdges(true);
    this.pulses = [];
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
