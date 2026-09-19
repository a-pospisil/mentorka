import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";

export const alt = `${site.name} – NLP, coaching, prevence vyhoření, podpora po ztrátě`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Načte font z Google Fonts (při buildu). Při selhání se použije výchozí font. */
async function loadFont(family: string, weight: number, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const match = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype|woff)'\)/);
    if (!match) return null;
    const res = await fetch(match[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

const HEADLINE = "Když se změní život, nemusí skončit jeho směr.";
const SUB = "NLP · COACHING · PREVENCE VYHOŘENÍ · PODPORA PO ZTRÁTĚ";

export default async function OpenGraphImage() {
  const [serif, sans, photo] = await Promise.all([
    loadFont("Newsreader", 300, HEADLINE + site.name),
    loadFont("Manrope", 500, SUB),
    readFile(join(process.cwd(), "src/assets/images/vladislava-dark.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const fonts = [
    ...(serif ? [{ name: "Newsreader", data: serif, weight: 300 as const, style: "normal" as const }] : []),
    ...(sans ? [{ name: "Manrope", data: sans, weight: 500 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#08080a",
          color: "#f7f3ed",
          position: "relative",
          fontFamily: serif ? "Newsreader" : "serif",
        }}
      >
        {/* Portrét vpravo */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 480,
            height: 630,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <img
            src={photoSrc}
            alt=""
            width={480}
            height={720}
            style={{ objectFit: "cover", objectPosition: "50% 20%", filter: "saturate(0.9)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, #08080a 0%, rgba(8,8,10,0.55) 35%, rgba(8,8,10,0) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(8,8,10,0) 50%, #08080a 100%)",
            }}
          />
        </div>

        {/* Neuronové linie */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", left: 0, top: 0, opacity: 0.55 }}
        >
          <g stroke="#c9b48a" strokeWidth="1" fill="none" opacity="0.5">
            <path d="M470 90 L560 60 L640 120 L700 80" />
            <path d="M560 60 L600 20 L640 120" />
            <path d="M780 120 L900 80 L1040 160 L1130 110" />
            <path d="M900 80 L980 40" />
          </g>
          <g fill="#c9b48a">
            <circle cx="470" cy="90" r="3.5" />
            <circle cx="560" cy="60" r="4.5" />
            <circle cx="640" cy="120" r="3" />
            <circle cx="700" cy="80" r="4" />
            <circle cx="600" cy="20" r="3" fill="#b3b0dc" />
            <circle cx="780" cy="120" r="3" />
            <circle cx="900" cy="80" r="4.5" />
            <circle cx="1040" cy="160" r="3" fill="#b3b0dc" />
            <circle cx="1130" cy="110" r="3.5" />
            <circle cx="980" cy="40" r="2.5" />
          </g>
        </svg>

        {/* Text */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 72,
            bottom: 72,
            width: 640,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: "#c9b48a" }} />
            <div
              style={{
                fontFamily: sans ? "Manrope" : "sans-serif",
                fontSize: 18,
                letterSpacing: 5,
                color: "#c9b48a",
              }}
            >
              {site.name.toUpperCase()}
            </div>
          </div>
          <div
            style={{
              fontSize: 70,
              lineHeight: 1.04,
              letterSpacing: -1,
              fontWeight: 300,
              display: "flex",
            }}
          >
            {HEADLINE}
          </div>
          <div
            style={{
              fontFamily: sans ? "Manrope" : "sans-serif",
              fontSize: 13,
              letterSpacing: 4,
              color: "#b7a992",
            }}
          >
            {SUB}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
