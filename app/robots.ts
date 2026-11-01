import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // buscadores e crawlers de IA (GPTBot, ClaudeBot, PerplexityBot,
    // Google-Extended) seguem a regra geral: tudo público liberado
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/preview/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
