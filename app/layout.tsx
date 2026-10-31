import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AmplitudeProvider } from "@/components/AmplitudeProvider";
import { CookieConsentBanner } from "@/components/CookieConsent";
import { SiteJsonLd } from "@/components/seo/JsonLd";
import { APP_STORE_ID, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CardTroca — Colecione, encontre e negocie cartas Pokémon TCG",
  description:
    "Organize sua coleção, encontre cartas próximas, acompanhe preços e negocie Pokémon TCG. Scanner, anúncios, lista de desejos, match e chat no mesmo app.",
  keywords: [
    "troca de cartas",
    "cartas TCG",
    "TCG",
    "match de cartas",
    "compra venda cartas TCG",
    "coleção Pokémon TCG",
    "scanner de cartas Pokémon",
    "preço de cartas Pokémon",
    "colecionadores",
    "CardTroca",
  ],
  metadataBase: new URL(SITE_URL),
  applicationName: "CardTroca",
  category: "shopping",
  authors: [{ name: "CardTroca" }],
  creator: "CardTroca",
  publisher: "CardTroca",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: "/splash_logo.png",
    apple: "/splash_logo.png",
  },
  // og:image e twitter:image vêm de app/opengraph-image.tsx e app/twitter-image.tsx
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "CardTroca — Sua coleção Pokémon TCG em movimento",
    description:
      "Organize, encontre e negocie cartas Pokémon TCG com scanner, catálogo, preços, anúncios e chat.",
    siteName: "CardTroca",
  },
  twitter: {
    card: "summary_large_image",
    title: "CardTroca — Sua coleção Pokémon TCG em movimento",
    description:
      "Scanner, coleção, preços, anúncios e chat para colecionadores Pokémon TCG.",
  },
  // Smart App Banner do Safari no iPhone
  other: { "apple-itunes-app": `app-id=${APP_STORE_ID}` },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6F8" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0D10" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Blocking script: apply dark class + preview mode before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t=localStorage.getItem('cardtroca-theme');
              var h=new Date().getHours();
              var night=h>=18||h<6;
              var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
              if(t==='dark'||(t!=='light'&&(night||d))){document.documentElement.classList.add('dark')}
              if(new URLSearchParams(location.search).get('preview')==='1'){document.documentElement.classList.add('preview-mode')}
            }catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-ds-bg text-ds-text-primary">
        <SiteJsonLd />
        <AmplitudeProvider>
          <ThemeProvider>
            {children}
            <CookieConsentBanner />
          </ThemeProvider>
        </AmplitudeProvider>
      </body>
    </html>
  );
}
