/**
 * Stavy organické neuronové sítě.
 * Každá sekce webu nastaví cílový stav (data-neural="<preset>") a engine
 * k němu plynule interpoluje. Vizuální metafora: v příběhu se síť
 * nejprve rozpadá (ztráta), churnuje (hledání) a postupně znovu propojuje
 * (pochopení → nový směr → pomoc druhým).
 */
export interface NeuralState {
  /** 0–1: celková viditelnost sítě. */
  alpha: number;
  /** 0–1: podíl větví, které jsou vykreslené (jemné větve mizí první). */
  density: number;
  /** 0–1: příměs modrofialového světla v impulzech a aurách. */
  violet: number;
  /** Násobek rychlosti dýchání a růstu. */
  speed: number;
  /** Průměrný počet světelných impulzů za sekundu. */
  pulseRate: number;
  /** 0–1: míra přestavby – staré spoje se rozpadají, nové rostou. */
  rewire: number;
  /** 0–1: intenzita měkkých aur kolem neuronů. */
  glow: number;
  /** −1..1: posun celé struktury vodorovně (podíl šířky × 0,22). */
  biasX: number;
  /** −1..1: posun celé struktury svisle (podíl výšky × 0,15). */
  biasY: number;
}

const base: NeuralState = {
  alpha: 0.7,
  density: 0.75,
  violet: 0.3,
  speed: 0.6,
  pulseRate: 0.9,
  rewire: 0.08,
  glow: 0.6,
  biasX: 0,
  biasY: 0,
};

const preset = (patch: Partial<NeuralState>): NeuralState => ({ ...base, ...patch });

export const neuralPresets = {
  /** Před probuzením. */
  dormant: preset({ alpha: 0, density: 0.4, pulseRate: 0, rewire: 0, glow: 0 }),
  /** Hero: globální síť ustupuje halo kolem portrétu – tichá, vlevo za titulkem. */
  hero: preset({ alpha: 0.42, density: 0.6, pulseRate: 0.7, glow: 0.35, biasX: -0.35, biasY: -0.1 }),
  /** Poznáte se v tom? – klidná, plná. */
  situations: preset({ alpha: 0.55, density: 0.7, pulseRate: 0.8, glow: 0.45, biasX: 0.3 }),
  /** Ztráta: síť řídne, spoje se rozpadají. */
  loss: preset({ alpha: 0.6, density: 0.32, violet: 0.08, speed: 0.35, pulseRate: 0.15, rewire: 0.55, glow: 0.2, biasX: -0.3 }),
  /** Hledání: neklid, přestavba. */
  searching: preset({ alpha: 0.62, density: 0.5, violet: 0.18, speed: 0.9, pulseRate: 0.6, rewire: 0.8, glow: 0.3, biasX: -0.3 }),
  /** Pochopení: nové spoje rostou, impulzy začínají putovat. */
  understanding: preset({ alpha: 0.7, density: 0.72, violet: 0.4, speed: 0.6, pulseRate: 1.3, rewire: 0.4, glow: 0.55, biasX: -0.28 }),
  /** Nový směr: propojená, jasná, živá. */
  direction: preset({ alpha: 0.8, density: 0.9, violet: 0.45, speed: 0.6, pulseRate: 1.8, rewire: 0.15, glow: 0.8, biasX: -0.25 }),
  /** Pomoc druhým: stabilní, teplá. */
  helping: preset({ alpha: 0.75, density: 0.95, violet: 0.32, speed: 0.45, pulseRate: 1.2, rewire: 0.05, glow: 0.7, biasX: -0.2 }),
  /** Cinematic fotografie: síť ustoupí. */
  quiet: preset({ alpha: 0.18, density: 0.7, pulseRate: 0.3, glow: 0.2, rewire: 0 }),
  /** Tmavá neuronová experience má vlastní canvas – globální síť zhasne. */
  hidden: preset({ alpha: 0, pulseRate: 0, rewire: 0, glow: 0 }),
  /** S čím pomáhám. */
  services: preset({ alpha: 0.5, density: 0.78, violet: 0.3, pulseRate: 0.9, glow: 0.45, biasX: 0.25, biasY: 0.1 }),
  /** Jak to probíhá. */
  process: preset({ alpha: 0.45, density: 0.72, pulseRate: 0.7, glow: 0.4, biasX: -0.3 }),
  /** Důvěra. */
  trust: preset({ alpha: 0.4, density: 0.68, pulseRate: 0.6, glow: 0.35, biasX: 0.3 }),
  /** Závěr: plně propojená, pomalá, hluboká. */
  contact: preset({ alpha: 0.7, density: 0.96, violet: 0.35, speed: 0.4, pulseRate: 1, rewire: 0.03, glow: 0.8, biasX: -0.3 }),
} as const satisfies Record<string, NeuralState>;

export type NeuralPresetName = keyof typeof neuralPresets;

export const isNeuralPreset = (name: string): name is NeuralPresetName =>
  Object.prototype.hasOwnProperty.call(neuralPresets, name);
