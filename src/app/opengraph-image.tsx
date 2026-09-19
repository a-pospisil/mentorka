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

const HEADLINE = "Když se život změní, můžete najít nový směr.";
const SUB = "NLP · COACHING · PREVENCE VYHOŘENÍ · PODPORA PO ZTRÁTĚ";

export default async function OpenGraphImage() {
  const [serif, sans, photo] = await Promise.all([
    loadFont("Newsreader", 400, HEADLINE + site.name),
    loadFont("Manrope", 600, SUB),
    readFile(join(process.cwd(), "src/assets/images/vladislava-city.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const fonts = [
    ...(serif ? [{ name: "Newsreader", data: serif, weight: 400 as const, style: "normal" as const }] : []),
    ...(sans ? [{ name: "Manrope", data: sans, weight: 600 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#fdfbf7",
          color: "#1b1b20",
          position: "relative",
          fontFamily: serif ? "Newsreader" : "serif",
        }}
      >
        {/* Organické větve */}
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <g stroke="#2e2c3c" strokeWidth="1.2" fill="none" opacity="0.22" strokeLinecap="round">
            <path d="M120 520 Q 210 470 300 500 Q 380 530 450 460" />
            <path d="M300 500 Q 330 430 400 400 Q 460 380 470 320" />
            <path d="M400 400 Q 470 370 520 390" />
            <path d="M210 470 Q 170 400 220 340 Q 250 300 230 260" />
            <path d="M220 340 Q 280 330 320 290" />
            <path d="M640 120 Q 690 170 650 230 Q 620 280 660 330" />
            <path d="M650 230 Q 700 240 720 200" />
            <path d="M1040 560 Q 1090 500 1060 440 Q 1030 400 1070 350" />
          </g>
          <g fill="#ad956a" opacity="0.85">
            <circle cx="120" cy="520" r="5" />
            <circle cx="450" cy="460" r="3" />
            <circle cx="470" cy="320" r="3" />
            <circle cx="520" cy="390" r="2.5" />
            <circle cx="230" cy="260" r="3" />
            <circle cx="320" cy="290" r="2.5" />
            <circle cx="640" cy="120" r="4.5" />
            <circle cx="720" cy="200" r="2.5" />
            <circle cx="660" cy="330" r="3" />
            <circle cx="1040" cy="560" r="4" />
            <circle cx="1070" cy="350" r="3" />
          </g>
          <g fill="#7d75c4" opacity="0.8">
            <circle cx="300" cy="500" r="4" />
            <circle cx="650" cy="230" r="3.5" />
          </g>
        </svg>

        {/* Portrét vpravo */}
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 60,
            width: 408,
            height: 510,
            display: "flex",
            overflow: "hidden",
            borderRadius: 32,
            boxShadow: "0 30px 70px -40px rgba(27,27,32,0.5)",
          }}
        >
          <img
            src={photoSrc}
            alt=""
            width={408}
            height={612}
            style={{ objectFit: "cover", objectPosition: "50% 18%", filter: "saturate(0.92)" }}
          />
        </div>

        {/* Text */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 72,
            bottom: 72,
            width: 600,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: "#ad956a" }} />
            <div
              style={{
                fontFamily: sans ? "Manrope" : "sans-serif",
                fontSize: 18,
                letterSpacing: 5,
                color: "#6b5a3c",
              }}
            >
              {site.name.toUpperCase()}
            </div>
          </div>
          <div style={{ fontSize: 66, lineHeight: 1.04, letterSpacing: -1.5, display: "flex" }}>{HEADLINE}</div>
          <div
            style={{
              fontFamily: sans ? "Manrope" : "sans-serif",
              fontSize: 13,
              letterSpacing: 4,
              color: "#6f6e78",
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
