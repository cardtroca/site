export type ListingStatus = "sale" | "trade" | "both" | "collection" | "unavailable";

export interface PublicSeller {
  id: string; name: string; avatarUrl: string | null; city: string | null; state: string | null;
  bio: string | null; planLabel: string | null; isLeiloeiro: boolean; isBeta: boolean;
  rating: number; totalReviews: number; followers: number; totalTrades: number;
}

export interface PublicCard {
  name: string; pokemonName: string | null; setName: string | null; number: string | null;
  hp: string | null; identifierCode: string | null; rarity: string | null; officialImageUrl: string | null;
}

export interface PublicListing {
  id: string; userId: string; status: ListingStatus; askingPrice: number | null;
  condition: string; language: string; variant: string; rarity: string | null;
  isGraded: boolean; gradingCompany: string | null; gradeScore: string | null; notes: string | null;
  photoUrl: string | null; photoUrl2: string | null; soldAt: string | null;
  card: PublicCard | null; seller: PublicSeller | null;
}

export interface ListingTile {
  id: string; name: string; setName: string | null; price: number | null;
  language: string; imageUrl: string | null;
}

export type ListingPageData =
  | { kind: "ok"; listing: PublicListing; more: ListingTile[] }
  | { kind: "unavailable"; seller: PublicSeller | null; more: ListingTile[] }
  | { kind: "not_found" };

export type ProfilePageData =
  | { kind: "ok"; seller: PublicSeller; forSale: ListingTile[]; collection: ListingTile[] }
  | { kind: "not_found" };
