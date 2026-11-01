import { planLabel } from "./format";
import type {
  ListingStatus, ListingTile, PublicCard, PublicListing, PublicSeller,
} from "./types";

export type Row = Record<string, unknown>;

export const SELLER_COLUMNS =
  "id, name, avatar_url, city, state, bio, is_beta, is_premium, subscription_plan, reputation_score, total_reviews, followers_count, total_trades, deleted_at, is_banned";
export const CARD_COLUMNS =
  "name, pokemon_name, set_name, number, hp, identifier_code, rarity, official_image_url";
export const LISTING_COLUMNS =
  "id, user_id, card_id, status, asking_price, condition, language, variant, rarity_override, is_graded, grading_company, grade_score, notes, photo_url, photo_url_2, sold_at, created_at";

const str = (v: unknown): string | null => (typeof v === "string" ? v : null);
const num = (v: unknown): number | null => (typeof v === "number" ? v : null);

/** Relação do PostgREST: objeto ou array de um elemento. */
function rel(v: unknown): Row | null {
  const x = Array.isArray(v) ? v[0] : v;
  return x && typeof x === "object" ? (x as Row) : null;
}

export function isHiddenSeller(row: Row): boolean {
  return (row.deleted_at ?? null) != null || row.is_banned === true;
}

export function mapSeller(row: Row): PublicSeller {
  const plan = str(row.subscription_plan);
  return {
    id: str(row.id) ?? "",
    name: str(row.name) ?? "",
    avatarUrl: str(row.avatar_url),
    city: str(row.city),
    state: str(row.state),
    bio: str(row.bio),
    planLabel: planLabel(plan, row.is_premium === true),
    isLeiloeiro: plan === "leiloeiro",
    isBeta: row.is_beta === true,
    rating: num(row.reputation_score) ?? 0,
    totalReviews: num(row.total_reviews) ?? 0,
    followers: num(row.followers_count) ?? 0,
    totalTrades: num(row.total_trades) ?? 0,
  };
}

function mapCard(card: Row | null, printing: Row | null): PublicCard | null {
  if (!card) return null;
  return {
    name: str(card.name) ?? "Carta",
    pokemonName: str(card.pokemon_name),
    setName: str(card.set_name),
    number: str(card.number),
    hp: card.hp == null ? null : String(card.hp),
    identifierCode: str(card.identifier_code),
    rarity: str(card.rarity),
    officialImageUrl: str(printing?.official_image_url) ?? str(card.official_image_url),
  };
}

export function mapListing(row: Row): PublicListing {
  const card = mapCard(rel(row.cards), rel(row.card_printings));
  const profile = rel(row.user_profiles);
  return {
    id: str(row.id) ?? "",
    userId: str(row.user_id) ?? "",
    status: (str(row.status) ?? "collection") as ListingStatus,
    askingPrice: num(row.asking_price),
    condition: str(row.condition) ?? "",
    language: str(row.language) ?? "en",
    variant: str(row.variant) ?? "normal",
    rarity: str(row.rarity_override) ?? card?.rarity ?? null,
    isGraded: row.is_graded === true,
    gradingCompany: str(row.grading_company),
    gradeScore: row.grade_score == null ? null : String(row.grade_score),
    notes: str(row.notes),
    photoUrl: str(row.photo_url),
    photoUrl2: str(row.photo_url_2),
    soldAt: str(row.sold_at),
    card,
    seller: profile ? mapSeller(profile) : null,
  };
}

export function mapTile(row: Row): ListingTile {
  const card = mapCard(rel(row.cards), rel(row.card_printings));
  return {
    id: str(row.id) ?? "",
    name: card?.name ?? "Carta",
    setName: card?.setName ?? null,
    price: num(row.asking_price),
    language: str(row.language) ?? "en",
    imageUrl: str(row.photo_url) ?? card?.officialImageUrl ?? null,
  };
}

export function listingAvailability(listing: PublicListing): "ok" | "unavailable" {
  const live = listing.status === "sale" || listing.status === "trade" || listing.status === "both";
  return live && listing.soldAt == null && listing.seller != null ? "ok" : "unavailable";
}
