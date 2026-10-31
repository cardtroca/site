export const SITE_URL = "https://cardtroca.com";

export const APP_STORE_ID = "6779094214";
export const APP_STORE_URL = `https://apps.apple.com/br/app/cardtroca/id${APP_STORE_ID}`;
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=io.cardtroca";

export const SUPPORT_EMAIL = "contato@cardtroca.com";

/** Páginas públicas indexáveis, usadas no sitemap. */
export const PUBLIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/funcionalidades", priority: 0.9, changeFrequency: "monthly" },
  { path: "/central-de-ajuda", priority: 0.7, changeFrequency: "monthly" },
  { path: "/beta", priority: 0.5, changeFrequency: "monthly" },
  { path: "/termos-de-uso", priority: 0.3, changeFrequency: "yearly" },
  { path: "/politica-de-privacidade", priority: 0.3, changeFrequency: "yearly" },
  { path: "/exclusao-de-conta", priority: 0.3, changeFrequency: "yearly" },
] as const;
