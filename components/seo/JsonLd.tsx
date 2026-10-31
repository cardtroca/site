import { APP_STORE_URL, PLAY_STORE_URL, SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

type JsonLdData = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // < escapado para nenhum texto fechar o <script> antes da hora
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const DESCRIPTION =
  "App para colecionadores de TCG organizarem a coleção, acompanharem o valor das cartas e comprarem, venderem e trocarem cartas com colecionadores próximos. Preparado para Pokémon TCG; Magic em breve.";

/** Organização, site e app — vale para todas as páginas. */
export function SiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "CardTroca",
            url: SITE_URL,
            logo: `${SITE_URL}/splash_logo.png`,
            email: SUPPORT_EMAIL,
            contactPoint: {
              "@type": "ContactPoint",
              email: SUPPORT_EMAIL,
              contactType: "customer support",
              availableLanguage: "Portuguese",
            },
          },
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: "CardTroca",
            url: SITE_URL,
            inLanguage: "pt-BR",
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          {
            "@type": "MobileApplication",
            "@id": `${SITE_URL}/#app`,
            name: "CardTroca",
            description: DESCRIPTION,
            operatingSystem: "iOS, Android",
            applicationCategory: "ShoppingApplication",
            inLanguage: "pt-BR",
            url: SITE_URL,
            image: `${SITE_URL}/splash_logo.png`,
            installUrl: [APP_STORE_URL, PLAY_STORE_URL],
            offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
            publisher: { "@id": `${SITE_URL}/#organization` },
            featureList: [
              "Coleção com valor estimado",
              "Progresso por set",
              "Catálogo e busca de cartas",
              "Lista de desejos",
              "Anúncios de compra e venda",
              "Cartas próximas por distância",
              "Modo troca com match",
              "Chat para negociação",
              "Reputação e avaliações",
            ],
          },
        ],
      }}
    />
  );
}

/** FAQPage a partir de pares pergunta/resposta já exibidos na página. */
export function FaqJsonLd({ items }: { items: { title: string; content: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((it) => ({
          "@type": "Question",
          name: it.title,
          acceptedAnswer: { "@type": "Answer", text: it.content },
        })),
      }}
    />
  );
}
