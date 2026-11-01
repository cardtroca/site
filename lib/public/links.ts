import { PLAY_STORE_URL } from "../site";

export type Platform = "ios" | "android" | "desktop";

export function androidIntentUrl(path: string): string {
  return `intent://cardtroca.com${path}#Intent;scheme=https;package=io.cardtroca;S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`;
}

export function platformOf(userAgent: string): Platform {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "desktop";
}

export function isInAppBrowser(userAgent: string): boolean {
  return /Instagram|FBAN|FBAV|WhatsApp|Line\//.test(userAgent);
}

export function storeOrder(platform: Platform): ("apple" | "google")[] {
  return platform === "android" ? ["google", "apple"] : ["apple", "google"];
}
