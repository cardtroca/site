import { conditionChip, formatBRL, galleryImages, ratingText } from "./format";
import type { ListingPageData, ProfilePageData } from "./types";

export interface OgData { title: string; description: string; image: string | null }

const GENERIC_DESCRIPTION = "Troque, compre e anuncie cartas Pokémon TCG com pessoas próximas.";

export function listingOg(data: ListingPageData): OgData {
  if (data.kind !== "ok") {
    return { title: "CardTroca — Carta à venda", description: GENERIC_DESCRIPTION, image: null };
  }
  const { listing } = data;
  const name = listing.card?.name ?? "Carta";
  const price =
    listing.status === "trade" ? "Troca"
    : listing.askingPrice != null ? formatBRL(listing.askingPrice)
    : "A combinar";
  const seller = listing.seller;
  const place = seller?.city && seller.state ? `${seller.city}/${seller.state}` : seller?.city ?? seller?.state ?? null;
  const parts = [
    listing.card?.setName ?? null,
    conditionChip(listing.condition).short || null,
    place,
  ].filter((p): p is string => !!p);
  return {
    title: `${name} · ${price}`,
    description: `${parts.join(" · ")} no CardTroca`.trim(),
    image: galleryImages(listing)[0]?.url ?? null,
  };
}

export function profileOg(data: ProfilePageData): OgData {
  if (data.kind !== "ok") {
    return { title: "CardTroca — Perfil de colecionador", description: GENERIC_DESCRIPTION, image: null };
  }
  const { seller, forSale } = data;
  const n = forSale.length;
  const parts = [`${n} ${n === 1 ? "carta" : "cartas"} à venda`];
  if (seller.totalReviews > 0) parts.push(`★ ${ratingText(seller.rating, seller.totalReviews).value}`);
  return {
    title: `${seller.name} no CardTroca`,
    description: parts.join(" · "),
    image: seller.avatarUrl,
  };
}
