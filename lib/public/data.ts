import "server-only";
import type { ListingPageData, ListingTile, ProfilePageData } from "./types";
import { isHiddenSeller, listingAvailability, mapListing, mapSeller, mapTile, type Row } from "./map";
import { defaultSource, type PublicSource } from "./source";

const UUID = /^[0-9a-f-]{36}$/i;
const MORE_LIMIT = 12;
const PROFILE_LIMIT = 300;

const NOT_FOUND = { kind: "not_found" } as const;

function isInvalidId(e: unknown): boolean {
  return typeof e === "object" && e != null && (e as { code?: unknown }).code === "22P02";
}

const num = (v: unknown): number | null => (typeof v === "number" ? v : null);

/** Regra do app (GetPublicProfileUseCase): preço pedido, senão preço de mercado da carta, senão 0. */
function sortPrice(r: Row): number {
  const card = Array.isArray(r.cards) ? r.cards[0] : r.cards;
  const market = card && typeof card === "object" ? num((card as Row).market_price_brl) : null;
  return num(r.asking_price) ?? market ?? 0;
}

function profileTiles(rows: Row[], total: number, label: string): ListingTile[] {
  if (total > rows.length) {
    console.warn(`[public] ${label}: ${total} anúncios, mostrando ${rows.length}`);
  }
  return [...rows].sort((a, b) => sortPrice(b) - sortPrice(a)).map(mapTile);
}

export async function getListingPage(
  id: string, source: PublicSource = defaultSource(),
): Promise<ListingPageData> {
  if (!UUID.test(id)) return NOT_FOUND;
  try {
    const row = await source.listingRow(id);
    if (!row) return NOT_FOUND;
    const listing = mapListing(row);
    const profileRow = Array.isArray(row.user_profiles) ? row.user_profiles[0] : row.user_profiles;
    const hidden = !profileRow || isHiddenSeller(profileRow as Row);

    let more: ListingTile[] = [];
    if (!hidden) {
      more = (await source.moreFromSeller(listing.userId, id, MORE_LIMIT)).map(mapTile);
    }

    if (hidden || listingAvailability(listing) === "unavailable") {
      return { kind: "unavailable", seller: hidden ? null : mapSeller(profileRow as Row), more };
    }
    return { kind: "ok", listing, more };
  } catch (e) {
    if (isInvalidId(e)) return NOT_FOUND;
    throw e;
  }
}

export async function getProfilePage(
  userId: string, source: PublicSource = defaultSource(),
): Promise<ProfilePageData> {
  if (!UUID.test(userId)) return NOT_FOUND;
  try {
    const sellerRow = await source.sellerRow(userId);
    if (!sellerRow || isHiddenSeller(sellerRow)) return NOT_FOUND;
    const [forSale, collection] = await Promise.all([
      source.profileTab(userId, "forSale", PROFILE_LIMIT),
      source.profileTab(userId, "collection", PROFILE_LIMIT),
    ]);
    return {
      kind: "ok",
      seller: mapSeller(sellerRow),
      forSale: profileTiles(forSale.rows, forSale.total, "forSale"),
      forSaleTotal: forSale.total,
      collection: profileTiles(collection.rows, collection.total, "collection"),
      collectionTotal: collection.total,
    };
  } catch (e) {
    if (isInvalidId(e)) return NOT_FOUND;
    throw e;
  }
}
