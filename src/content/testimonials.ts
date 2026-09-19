export interface Testimonial {
  /** Citace klienta. */
  quote: string;
  /** Jméno nebo iniciály (např. „M. K.“). */
  name: string;
  /** Volitelný kontext – např. „klientka, coaching“. */
  context?: string;
  /** Volitelná fotografie (cesta v /public nebo statický import). */
  image?: string;
}

export const testimonialsIntro = {
  label: "Důvěra",
  headline: "Co říkají lidé, kteří mou podporu *zažili*.",
};

/**
 * Reference klientů.
 * Zatím prázdné – žádné reference nevymýšlíme. Jakmile budou k dispozici,
 * stačí doplnit položky sem; sekce se vykreslí automaticky.
 */
export const testimonials: Testimonial[] = [];

/** Zobrazit sekci s placeholder kartami, dokud reference nejsou? */
export const showTestimonialPlaceholder = true;
