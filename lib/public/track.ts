import * as amplitude from "@amplitude/analytics-browser";
import { getCookieConsent } from "@/components/CookieConsent";

export type PublicEvent =
  | "web_listing_viewed"
  | "web_profile_viewed"
  | "web_app_gate_opened"
  | "web_store_clicked";

/** Só no cliente e só com consentimento de cookies aceito. */
export function trackPublic(event: PublicEvent, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  if (getCookieConsent() !== "accepted") return;
  amplitude.track(event, props);
}
