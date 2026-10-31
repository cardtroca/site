import { describe, expect, it } from "vitest";
import { listingOg, profileOg } from "./og";
import type { ListingPageData, ListingTile, ProfilePageData, PublicListing, PublicSeller } from "./types";

const GENERIC_DESC = "Troque, compre e anuncie cartas Pokémon TCG com pessoas próximas.";

const seller: PublicSeller = {
  id: "s", name: "Ana Souza", avatarUrl: "https://img/avatar.png", city: "Curitiba", state: "PR",
  bio: null, planLabel: null, isLeiloeiro: false, isBeta: false,
  rating: 4.86, totalReviews: 12, followers: 0, totalTrades: 0,
};

function listing(o: Partial<PublicListing> = {}): PublicListing {
  return {
    id: "1", userId: "s", status: "sale", askingPrice: 2890, condition: "Near Mint (NM)", language: "en",
    variant: "normal", rarity: null, isGraded: false, gradingCompany: null, gradeScore: null,
    notes: null, photoUrl: null, photoUrl2: null, soldAt: null,
    card: {
      name: "Charizard", pokemonName: null, setName: "Base Set", number: null, hp: null,
      identifierCode: null, rarity: null, officialImageUrl: "https://img/official.png",
    },
    seller, ...o,
  };
}
const ok = (l: PublicListing): ListingPageData => ({ kind: "ok", listing: l, more: [] });

const tile = (id: string): ListingTile => ({ id, name: "X", setName: null, price: 1, language: "en", imageUrl: null });
const profile = (o: { seller?: PublicSeller; n?: number } = {}): ProfilePageData => ({
  kind: "ok", seller: o.seller ?? seller,
  forSale: Array.from({ length: o.n ?? 3 }, (_, i) => tile(String(i))), collection: [],
});

describe("listingOg", () => {
  it("venda com preço", () => {
    expect(listingOg(ok(listing()))).toEqual({
      title: "Charizard · R$ 2.890,00",
      description: "Base Set · NM · Curitiba/PR no CardTroca",
      image: "https://img/official.png",
    });
  });
  it("só troca", () => {
    expect(listingOg(ok(listing({ status: "trade" }))).title).toBe("Charizard · Troca");
  });
  it("sem preço", () => {
    expect(listingOg(ok(listing({ askingPrice: null }))).title).toBe("Charizard · A combinar");
  });
  it("pula partes nulas da descrição", () => {
    const l = listing({ seller: { ...seller, city: null, state: null } });
    l.card!.setName = null;
    expect(listingOg(ok(l)).description).toBe("NM no CardTroca");
  });
  it("foto do usuário vem primeiro", () => {
    expect(listingOg(ok(listing({ photoUrl: "https://img/foto.jpg" }))).image).toBe("https://img/foto.jpg");
  });
  it("sem imagem", () => {
    const l = listing(); l.card!.officialImageUrl = null;
    expect(listingOg(ok(l)).image).toBeNull();
  });
  it("unavailable e not_found", () => {
    const generic = { title: "CardTroca — Carta à venda", description: GENERIC_DESC, image: null };
    expect(listingOg({ kind: "unavailable", seller: null, more: [] })).toEqual(generic);
    expect(listingOg({ kind: "not_found" })).toEqual(generic);
  });
});

describe("profileOg", () => {
  it("perfil com avaliações", () => {
    expect(profileOg(profile())).toEqual({
      title: "Ana Souza no CardTroca",
      description: "3 cartas à venda · ★ 4,9",
      image: "https://img/avatar.png",
    });
  });
  it("singular", () => {
    expect(profileOg(profile({ n: 1 })).description).toBe("1 carta à venda · ★ 4,9");
  });
  it("sem avaliações e sem avatar", () => {
    const r = profileOg(profile({ seller: { ...seller, totalReviews: 0, avatarUrl: null } }));
    expect(r.description).toBe("3 cartas à venda");
    expect(r.image).toBeNull();
  });
  it("not_found", () => {
    expect(profileOg({ kind: "not_found" })).toEqual({
      title: "CardTroca — Perfil de colecionador", description: GENERIC_DESC, image: null,
    });
  });
});
