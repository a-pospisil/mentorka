/**
 * Stavy neuronové sítě.
 * Každá sekce webu nastaví cílový stav – engine k němu plynule interpoluje.
 * Vizuální metafora: fragmentovaná a tmavá síť (ztráta) se postupně
 * propojuje, rozsvěcuje a stabilizuje (nový směr, pomoc druhým).
 */
export interface NeuralState {
  /** 0–1: podíl potenciálních spojů, které jsou viditelné. */
  connectivity: number;
  /** 0–1: celkový jas sítě. */
  brightness: number;
  /** Násobek rychlosti pohybu uzlů. */
  speed: number;
  /** 0–1: chaos / roztřesenost uzlů a blikání. */
  jitter: number;
  /** Průměrný počet impulzů za sekundu. */
  pulseRate: number;
  /** 0–1: příměs modrofialového světla synapsí. */
  violet: number;
  /** Násobek dosahu spojů. */
  reach: number;
}

export const neuralPresets = {
  /** Úvod: klidná, částečně propojená síť. */
  hero: { connectivity: 0.55, brightness: 0.85, speed: 0.55, jitter: 0, pulseRate: 1.2, violet: 0.25, reach: 1 },
  /** Ztráta: fragmentovaná, tmavá, pomalá. */
  loss: { connectivity: 0.1, brightness: 0.45, speed: 0.3, jitter: 0.12, pulseRate: 0.1, violet: 0, reach: 0.8 },
  /** Ticho: téměř nehybná. */
  silence: { connectivity: 0.06, brightness: 0.3, speed: 0.12, jitter: 0, pulseRate: 0, violet: 0, reach: 0.7 },
  /** Hledání: neklid, náhodné záblesky. */
  searching: { connectivity: 0.3, brightness: 0.6, speed: 0.95, jitter: 0.65, pulseRate: 0.7, violet: 0.15, reach: 0.9 },
  /** Pochopení: spoje rostou, impulzy začínají putovat. */
  understanding: { connectivity: 0.5, brightness: 0.72, speed: 0.6, jitter: 0.2, pulseRate: 1.3, violet: 0.3, reach: 1 },
  /** Nový směr: silně propojená, jasná. */
  direction: { connectivity: 0.72, brightness: 0.88, speed: 0.55, jitter: 0, pulseRate: 1.8, violet: 0.35, reach: 1.1 },
  /** Pomoc druhým: stabilní, teplá. */
  helping: { connectivity: 0.82, brightness: 0.82, speed: 0.42, jitter: 0, pulseRate: 1.3, violet: 0.25, reach: 1.15 },
  /** Neuroplasticita: aktivní, více synaptického světla. */
  brain: { connectivity: 0.66, brightness: 0.82, speed: 0.6, jitter: 0.05, pulseRate: 2.4, violet: 0.5, reach: 1.05 },
  /** Služby: klidný střed. */
  services: { connectivity: 0.56, brightness: 0.6, speed: 0.5, jitter: 0, pulseRate: 1, violet: 0.2, reach: 1 },
  /** Doprovázení: tlumené, pomalé, ale propojené. */
  companion: { connectivity: 0.62, brightness: 0.42, speed: 0.28, jitter: 0, pulseRate: 0.5, violet: 0.15, reach: 1 },
  /** Galerie: ustupuje fotografiím. */
  gallery: { connectivity: 0.4, brightness: 0.38, speed: 0.4, jitter: 0, pulseRate: 0.6, violet: 0.15, reach: 1 },
  /** Cesta: propojená, klidná. */
  journey: { connectivity: 0.7, brightness: 0.7, speed: 0.5, jitter: 0, pulseRate: 1.2, violet: 0.3, reach: 1.1 },
  /** Reference. */
  trust: { connectivity: 0.6, brightness: 0.55, speed: 0.4, jitter: 0, pulseRate: 0.9, violet: 0.2, reach: 1.05 },
  /** Závěr: pomalá, hluboká, plně propojená. */
  contact: { connectivity: 0.88, brightness: 0.62, speed: 0.28, jitter: 0, pulseRate: 0.8, violet: 0.3, reach: 1.2 },
  /** Výchozí stav před „probuzením“. */
  dormant: { connectivity: 0, brightness: 0, speed: 0.3, jitter: 0, pulseRate: 0, violet: 0.2, reach: 1 },
} as const satisfies Record<string, NeuralState>;

export type NeuralPresetName = keyof typeof neuralPresets;

export const isNeuralPreset = (name: string): name is NeuralPresetName =>
  Object.prototype.hasOwnProperty.call(neuralPresets, name);
