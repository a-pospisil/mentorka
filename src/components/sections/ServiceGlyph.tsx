"use client";

import { useEffect, useRef } from "react";
import type { ServiceGlyphKind } from "@/content/services";
import { prefersReducedMotionNow } from "@/lib/hooks";

/**
 * Mikro-animace služeb na malém canvasu:
 * nlp      → neurony, které se postupně propojují
 * coaching → cesta mezi dvěma body
 * burnout  → přetížená síť, která se zpomalí a stabilizuje
 * loss     → jeden bod zhasne, okolní síť se přeskupí
 */

const GOLD = "201,180,138";
const BONE = "247,243,237";
const VIOLET = "179,176,220";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Pt = [number, number];

const dot = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, a: number, glow = 0) => {
  if (glow > 0) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    g.addColorStop(0, `rgba(${color},${a * glow * 0.6})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = `rgba(${color},${a})`;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

const line = (ctx: CanvasRenderingContext2D, a: Pt, b: Pt, color: string, alpha: number, w = 1) => {
  if (alpha <= 0.005) return;
  ctx.strokeStyle = `rgba(${color},${alpha})`;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.stroke();
};

/* ---------------------------------------------------------------- NLP */
const NLP_NODES: Pt[] = [
  [0.18, 0.3], [0.42, 0.18], [0.7, 0.24], [0.84, 0.5], [0.66, 0.78], [0.38, 0.84], [0.16, 0.62], [0.5, 0.5],
];
const NLP_EDGES: [number, number][] = [
  [0, 1], [1, 7], [7, 3], [1, 2], [2, 3], [7, 4], [3, 4], [4, 5], [5, 6], [6, 0], [7, 5], [6, 7], [0, 7],
];

function drawNlp(ctx: CanvasRenderingContext2D, s: number, t: number, time: number) {
  const pts = NLP_NODES.map(([x, y]) => [x * s, y * s] as Pt);
  const total = NLP_EDGES.length;
  const connected = new Set<number>();
  const grow = smooth(0, 0.78, t) * total;
  NLP_EDGES.forEach(([a, b], i) => {
    const local = clamp01(grow - i);
    if (local > 0) {
      connected.add(a);
      connected.add(b);
      line(ctx, pts[a], pts[b], GOLD, 0.5 * local, 1);
      // impulz na právě vznikajícím spoji
      if (local < 1) {
        const x = lerp(pts[a][0], pts[b][0], local);
        const y = lerp(pts[a][1], pts[b][1], local);
        dot(ctx, x, y, 2.2, BONE, 0.95, 1.2);
      }
    }
  });
  pts.forEach((p, i) => {
    const on = connected.has(i);
    const tw = 0.85 + 0.15 * Math.sin(time * 2 + i);
    dot(ctx, p[0], p[1], i === 7 ? 3.2 : 2.4, on ? GOLD : BONE, on ? 0.95 * tw : 0.3, on ? 0.8 : 0);
  });
  // po dokončení: putující impulz sítí
  if (t > 0.8) {
    const k = ((t - 0.8) / 0.2) * 3;
    const idx = Math.min(NLP_EDGES.length - 1, Math.floor(k) + 4);
    const [a, b] = NLP_EDGES[idx];
    const f = k - Math.floor(k);
    dot(ctx, lerp(pts[a][0], pts[b][0], f), lerp(pts[a][1], pts[b][1], f), 2.4, VIOLET, 0.95, 1.4);
  }
}

/* ----------------------------------------------------------- COACHING */
const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

function drawCoaching(ctx: CanvasRenderingContext2D, s: number, t: number, time: number) {
  const A: Pt = [0.16 * s, 0.82 * s];
  const B: Pt = [0.84 * s, 0.2 * s];
  const main = [A, [0.2 * s, 0.25 * s] as Pt, [0.62 * s, 0.75 * s] as Pt, B] as const;
  const alt1 = [A, [0.7 * s, 0.9 * s] as Pt, [0.9 * s, 0.6 * s] as Pt, B] as const;
  const alt2 = [A, [0.05 * s, 0.4 * s] as Pt, [0.45 * s, 0.05 * s] as Pt, B] as const;

  const drawPath = (p: readonly [Pt, Pt, Pt, Pt], upTo: number, color: string, alpha: number, dashed = false) => {
    ctx.strokeStyle = `rgba(${color},${alpha})`;
    ctx.lineWidth = 1;
    ctx.setLineDash(dashed ? [3, 5] : []);
    ctx.beginPath();
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const k = (i / steps) * upTo;
      const [x, y] = bez(p[0], p[1], p[2], p[3], k);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // možné cesty (slabě)
  drawPath(alt1, 1, BONE, 0.08, true);
  drawPath(alt2, 1, BONE, 0.08, true);

  const p = smooth(0.05, 0.85, t);
  drawPath(main, p, GOLD, 0.7);

  // mezibody
  [0.33, 0.66].forEach((k) => {
    const [x, y] = bez(main[0], main[1], main[2], main[3], k);
    const on = p >= k;
    dot(ctx, x, y, 2, on ? GOLD : BONE, on ? 0.9 : 0.25, on ? 0.7 : 0);
  });

  dot(ctx, A[0], A[1], 3.2, BONE, 0.9, 0.6);
  const arrived = p > 0.98;
  dot(ctx, B[0], B[1], 3.6, arrived ? BONE : GOLD, arrived ? 1 : 0.5, arrived ? 1.6 + 0.3 * Math.sin(time * 3) : 0.3);

  if (p < 0.99) {
    const [x, y] = bez(main[0], main[1], main[2], main[3], p);
    dot(ctx, x, y, 2.4, BONE, 1, 1.3);
  }
}

/* ------------------------------------------------------------ BURNOUT */
const BURN_N = 14;
const BURN_HOME: Pt[] = Array.from({ length: BURN_N }, (_, i) => {
  const a = (i / BURN_N) * Math.PI * 2;
  const r = i % 2 === 0 ? 0.36 : 0.22;
  return [0.5 + Math.cos(a) * r, 0.5 + Math.sin(a) * r];
});
const BURN_SEED = Array.from({ length: BURN_N }, (_, i) => ((i * 7919) % 97) / 97);

function drawBurnout(ctx: CanvasRenderingContext2D, s: number, t: number, time: number) {
  // 0–0.4 přetížení, 0.4–0.85 uklidnění, dál stabilní
  const chaos = 1 - smooth(0.35, 0.85, t);
  const pts = BURN_HOME.map(([x, y], i) => {
    const seed = BURN_SEED[i];
    const jx = Math.sin(time * (14 + seed * 10) + seed * 20) * 0.05 * chaos;
    const jy = Math.cos(time * (11 + seed * 12) + seed * 30) * 0.05 * chaos;
    return [(x + jx) * s, (y + jy) * s] as Pt;
  });
  const hot = chaos;
  const color = hot > 0.5 ? VIOLET : GOLD;

  // chaos: mnoho blikajících spojů
  for (let i = 0; i < BURN_N; i++) {
    for (let j = i + 1; j < BURN_N; j++) {
      const ring = j === i + 1 || (i === 0 && j === BURN_N - 1);
      const flicker = 0.5 + 0.5 * Math.sin(time * 9 + i * 1.7 + j * 0.9);
      const a = ring ? 0.35 + 0.3 * (1 - chaos) : 0.32 * chaos * flicker * (((i * j) % 3 === 0) ? 1 : 0);
      if (a > 0.02) line(ctx, pts[i], pts[j], ring ? GOLD : color, a, ring ? 1 : 0.7);
    }
  }
  pts.forEach((p, i) => {
    const flicker = 0.6 + 0.4 * Math.sin(time * 10 + i * 2.1);
    const a = lerp(0.9, 0.5 + 0.5 * flicker, chaos);
    const breathe = 1 + 0.08 * Math.sin(time * 1.2 + i) * (1 - chaos);
    dot(ctx, p[0], p[1], 2.3 * breathe, chaos > 0.5 ? BONE : GOLD, a, 0.5 + 0.6 * chaos);
  });
}

/* --------------------------------------------------------------- LOSS */
const LOSS_RING = 7;
const LOSS_PTS: Pt[] = Array.from({ length: LOSS_RING }, (_, i) => {
  const a = -Math.PI / 2 + (i / LOSS_RING) * Math.PI * 2;
  return [0.5 + Math.cos(a) * 0.36, 0.5 + Math.sin(a) * 0.36];
});

function drawLoss(ctx: CanvasRenderingContext2D, s: number, t: number, time: number) {
  const C: Pt = [0.5 * s, 0.5 * s];
  const fade = 1 - smooth(0.22, 0.42, t); // střed zhasíná
  const regroup = smooth(0.45, 0.9, t); // síť se přeskupuje
  const pts = LOSS_PTS.map(([x, y]) => {
    const dx = x - 0.5;
    const dy = y - 0.5;
    const k = 1 - 0.18 * regroup;
    return [(0.5 + dx * k) * s, (0.5 + dy * k) * s] as Pt;
  });

  // spoje ke středu
  pts.forEach((p) => line(ctx, p, C, GOLD, 0.45 * fade, 1));
  // prstenec
  pts.forEach((p, i) => line(ctx, p, pts[(i + 1) % LOSS_RING], GOLD, 0.55, 1));
  // nové spoje přes mezeru
  const newEdges: [number, number][] = [[0, 3], [1, 4], [2, 5], [3, 6], [4, 0]];
  newEdges.forEach(([a, b], i) => {
    const local = clamp01(regroup * newEdges.length - i);
    line(ctx, pts[a], pts[b], VIOLET, 0.45 * local, 1);
    if (local > 0 && local < 1) {
      dot(ctx, lerp(pts[a][0], pts[b][0], local), lerp(pts[a][1], pts[b][1], local), 2, BONE, 0.9, 1.2);
    }
  });

  pts.forEach((p, i) => {
    const tw = 0.85 + 0.15 * Math.sin(time * 1.6 + i);
    dot(ctx, p[0], p[1], 2.4, GOLD, 0.95 * tw, 0.6 + 0.5 * regroup);
  });
  if (fade > 0.01) dot(ctx, C[0], C[1], 3.2 * (0.6 + 0.4 * fade), BONE, fade, fade);
  // tichá stopa po zhaslém bodu
  if (fade < 0.99) {
    ctx.strokeStyle = `rgba(${BONE},${0.12 * (1 - fade)})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.arc(C[0], C[1], 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

const SCENES: Record<ServiceGlyphKind, { draw: typeof drawNlp; duration: number }> = {
  nlp: { draw: drawNlp, duration: 7 },
  coaching: { draw: drawCoaching, duration: 6.5 },
  burnout: { draw: drawBurnout, duration: 8 },
  loss: { draw: drawLoss, duration: 9 },
};

export function ServiceGlyph({
  kind,
  active,
  className = "",
}: {
  kind: ServiceGlyphKind;
  active: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scene = SCENES[kind];
    const reduced = prefersReducedMotionNow();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = 0;

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      size = Math.max(1, Math.round(rect.width));
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();

    let raf = 0;
    let start = performance.now();
    let inView = false;
    let running = false;

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const elapsed = (now - start) / 1000;
      const t = (elapsed % (scene.duration + 1.2)) / scene.duration; // krátká pauza na konci
      ctx.clearRect(0, 0, size, size);
      ctx.lineCap = "round";
      scene.draw(ctx, size, clamp01(t), elapsed);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, size, size);
      scene.draw(ctx, size, 1, 0);
    };

    const sync = () => {
      const should = inView && (activeRef.current || coarse) && !reduced;
      if (should && !running) {
        running = true;
        start = performance.now() - 0.0;
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
        drawStatic();
      }
    };

    const coarse = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    drawStatic();

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      fit();
      if (!running) drawStatic();
    });
    ro.observe(canvas);

    // Reagovat na změnu `active` (hover) bez re-mountu
    const interval = window.setInterval(sync, 120);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearInterval(interval);
      io.disconnect();
      ro.disconnect();
    };
  }, [kind]);

  return <canvas ref={ref} aria-hidden="true" className={`block aspect-square w-full ${className}`} />;
}
