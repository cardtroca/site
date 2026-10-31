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

const isForSale = (r: Row) => (r.status === "sale" || r.status === "both") && r.sold_at == null;

/** Preço decrescente, sem preço por último. */
function byPriceDesc(a: Row, b: Row): number {
  const pa = typeof a.asking_price === "number" ? a.asking_price : null;
  const pb = typeof b.asking_price === "number" ? b.asking_price : null;
  if (pa == null && pb == null) return 0;
  if (pa == null) return 1;
  if (pb == null) return -1;
  return pb - pa;
}

function tiles(rows: Row[], limit: number, warnLabel?: string): ListingTile[] {
  const sorted = [...rows].sort(byPriceDesc);
  if (warnLabel && sorted.length > limit) {
    console.warn(`[public] ${warnLabel}: ${sorted.length} anúncios, cortando em ${limit}`);
  }
  return sorted.slice(0, limit).map(mapTile);
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
      const rows = await source.sellerListingRows(listing.userId);
      more = tiles(rows.filter((r) => isForSale(r) && r.id !== id), MORE_LIMIT);
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
    const rows = await source.sellerListingRows(userId);
    return {
      kind: "ok",
      seller: mapSeller(sellerRow),
      forSale: tiles(rows.filter(isForSale), PROFILE_LIMIT, "forSale"),
      collection: tiles(rows.filter((r) => r.status === "collection"), PROFILE_LIMIT, "collection"),
    };
  } catch (e) {
    if (isInvalidId(e)) return NOT_FOUND;
    throw e;
  }
}
