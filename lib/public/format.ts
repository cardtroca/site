import type { ListingStatus, PublicListing } from "./types";

export { rarityLabel } from "./rarity";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatBRL(value: number): string {
  return brl.format(value).replace(/[  ]/g, " ");
}

// Port de core/utils/card_language_util.dart: [código, sigla, nome]
const LANGUAGES: readonly (readonly [string, string, string])[] = [
  ["pt", "BR", "Português"],
  ["en", "EN", "Inglês"],
  ["ja", "JP", "Japonês"],
  ["zh", "CN", "Chinês"],
  ["ko", "KR", "Coreano"],
  ["fr", "FR", "Francês"],
  ["de", "DE", "Alemão"],
  ["it", "IT", "Italiano"],
];

const LANGUAGE_ALIASES: Record<string, string> = {
  jp: "ja", cn: "zh", tw: "zh", kr: "ko", br: "pt",
};

function normalizeLanguage(code: string | null): string {
  const base = (code ?? "").trim().toLowerCase().split(/[-_]/)[0];
  return LANGUAGE_ALIASES[base] ?? base;
}

function findLanguage(code: string | null) {
  const n = normalizeLanguage(code);
  return LANGUAGES.find((l) => l[0] === n);
}

export function languageShort(code: string | null): string {
  return findLanguage(code)?.[1] ?? "OUT";
}

export function languageLabel(code: string | null): string {
  return findLanguage(code)?.[2] ?? "Outro idioma";
}

const CONDITION_COLORS: Record<string, string> = {
  M: "#0E9F6E", NM: "#029779", SP: "#2563EB", MP: "#D98E04", HP: "#E5484D",
};

export function conditionChip(condition: string): { short: string; color: string } {
  const m = condition.match(/\(([^)]*)\)/);
  const short = (m ? m[1] : condition).trim();
  return { short, color: CONDITION_COLORS[short.toUpperCase()] ?? "#586572" };
}

export function statusLabel(status: ListingStatus): string | null {
  switch (status) {
    case "sale": return "Venda";
    case "trade": return "Troca";
    case "both": return "Venda e Troca";
    default: return null;
  }
}

/** Port de UserModel.paidPlanLabel. */
export function planLabel(subscriptionPlan: string | null, isPremium: boolean): string | null {
  switch (subscriptionPlan) {
    case "leiloeiro": return "Leiloeiro";
    case "plus": return "Plus";
    case "pro": return "Pro";
    case "free": return null;
    default: return isPremium ? "Pro" : null;
  }
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

export function ratingText(rating: number, totalReviews: number): { value: string; label: string } {
  if (totalReviews <= 0) return { value: "—", label: "Sem avaliações" };
  return { value: rating.toFixed(1).replace(".", ","), label: "avaliação" };
}

/** Rótulos do card de números do perfil, no singular quando o número é 1 (como o app). */
export function followersLabel(n: number): string {
  return n === 1 ? "seguidor" : "seguidores";
}

export function reviewsLabel(n: number): string {
  return n === 1 ? "comentário" : "comentários";
}

export function priceCaption(
  status: ListingStatus,
  askingPrice: number | null,
): { caption: string; value: string; cta: "Conversar" | "Propor troca" } {
  if (status === "trade") {
    return { caption: "Anúncio para troca", value: "Aceita propostas", cta: "Propor troca" };
  }
  return {
    caption: "Preço pedido",
    value: askingPrice != null ? formatBRL(askingPrice) : "A combinar",
    cta: "Conversar",
  };
}

export function galleryImages(listing: PublicListing): { url: string; isUserPhoto: boolean }[] {
  const out: { url: string; isUserPhoto: boolean }[] = [];
  if (listing.photoUrl) out.push({ url: listing.photoUrl, isUserPhoto: true });
  if (listing.photoUrl2) out.push({ url: listing.photoUrl2, isUserPhoto: true });
  const official = listing.card?.officialImageUrl;
  if (official) out.push({ url: official, isUserPhoto: false });
  return out;
}
