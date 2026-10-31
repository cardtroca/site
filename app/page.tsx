import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { MotionLanding } from "@/components/home/MotionLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className={`dark ${poppins.variable} bg-[#040A09]`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: "CardTroca em 30 segundos",
          description:
            "Resumo do app CardTroca: valor da coleção, progresso por set, lista de desejos, busca, cartas por perto, modo troca e chat.",
          thumbnailUrl: `${SITE_URL}/videos/promo.jpg`,
          contentUrl: `${SITE_URL}/videos/promo.mp4`,
          uploadDate: "2026-10-17",
          duration: "PT30S",
          inLanguage: "pt-BR",
        }}
      />
      <main id="main-content">
        <MotionLanding />
      </main>
      <Footer />
    </div>
  );
}
