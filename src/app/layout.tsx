import type { Metadata, Viewport } from "next";
import { Newsreader, Manrope } from "next/font/google";
import { site } from "@/config/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { NeuralBackground } from "@/components/neural/NeuralBackground";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { StickyCta } from "@/components/layout/StickyCta";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--font-manrope",
  display: "swap",
});

const title = `${site.name} | NLP, coaching, prevence vyhoření a podpora po ztrátě`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    firstName: "Vladislava",
    lastName: "Pospíšilová",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "Osobní rozvoj",
};

export const viewport: Viewport = {
  themeColor: "#fdfbf7",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.language} className={`${newsreader.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script
          // Označí dokument jako JS-enabled ještě před prvním vykreslením,
          // aby reveal prvky nebliknuly (bez JS zůstávají viditelné).
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }}
        />
      </head>
      <body className="min-h-svh">
        <a
          href="#main"
          className="sr-only z-[110] rounded-full bg-ink-900 px-5 py-3 text-paper-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Přeskočit na obsah
        </a>
        <SmoothScroll>
          <NeuralBackground />
          <Nav />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <Footer />
          <StickyCta />
        </SmoothScroll>
      </body>
    </html>
  );
}
