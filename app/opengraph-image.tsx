import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "CardTroca — colecione, encontre e negocie cartas Pokémon TCG";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // logo atual do app (mesmos SVGs de frontend/cardtroca/assets/images/logo)
  const svg = async (name: string) =>
    `data:image/svg+xml;base64,${(await readFile(join(process.cwd(), "public/brand", name))).toString("base64")}`;
  const [coin, wordmark] = await Promise.all([svg("coin.svg"), svg("wordmark_dark.svg")]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 90px",
          gap: 64,
          color: "white",
          background: "radial-gradient(120% 90% at 30% 20%, #0B2A24 0%, #06120F 60%, #040A09 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coin} width={230} height={230} alt="" />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={296} height={50} style={{ marginBottom: 28 }} alt="" />
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Sua coleção TCG,&nbsp;<span style={{ color: "#7CF0CF" }}>em movimento.</span>
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,.65)", marginTop: 24 }}>
            Coleção, preços, anúncios, troca e chat · Pokémon TCG
          </div>
        </div>
      </div>
    ),
    size
  );
}
