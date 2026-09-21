import { CTA_PRIMARY } from "@/config/site";

/** 06 JAK TO PROBÍHÁ – tři kroky. Ceny a podmínky jsou v src/content/pricing.ts. */
export const processIntro = {
  label: "Jak to probíhá",
  headline: "Tři kroky. Žádný *závazek*.",
};

export const processSteps = [
  { index: "01", title: "Napíšete mi", text: "Krátce popíšete, co řešíte." },
  {
    index: "02",
    title: "30 minut zdarma",
    text: "Úvodní nezávazný rozhovor online nebo osobně.",
  },
  {
    index: "03",
    title: "První sezení osobně",
    text: "Dvě hodiny naživo. Pak pokračujeme tak, jak vám to dává smysl.",
  },
];

export const processNote =
  "Nemusíte předem vědět, jestli potřebujete coaching, NLP nebo jen někoho, s kým si můžete promluvit.";

export const processCta = CTA_PRIMARY;
