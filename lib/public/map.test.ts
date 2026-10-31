import { describe, expect, it } from "vitest";
import {
  isHiddenSeller, listingAvailability, mapListing, mapSeller, mapTile, type Row,
} from "./map";

const sellerRow: Row = {
  id: "u1", name: "Ash", avatar_url: "a.png", city: "Pallet", state: "SP", bio: "oi",
  is_beta: true, is_premium: false, subscription_plan: "pro", reputation_score: 4.5,
  total_reviews: 3, followers_count: 7, total_trades: 2, deleted_at: null, is_banned: false,
};

function row(over: Row = {}): Row {
  return {
    id: "l1", user_id: "u1", card_id: "c1", status: "sale", asking_price: 12.5,
    condition: "Near Mint (NM)", language: "pt", variant: "holo", rarity_override: null,
    is_graded: false, grading_company: null, grade_score: null, notes: "n",
    photo_url: null, photo_url_2: null, sold_at: null, created_at: "2026-01-01",
    cards: {
      name: "Pikachu", pokemon_name: "Pikachu", set_name: "Base", number: "58", hp: "40",
      identifier_code: "BS-58", rarity: "Common", official_image_url: "card.png",
    },
    card_printings: { official_image_url: "printing.png" },
    user_profiles: sellerRow,
    ...over,
  };
}

describe("mapListing", () => {
  it("mapeia linha completa, com imagem do printing prevalecendo", () => {
    expect(mapListing(row())).toEqual({
      id: "l1", userId: "u1", status: "sale", askingPrice: 12.5, condition: "Near Mint (NM)",
      language: "pt", variant: "holo", rarity: "Common", isGraded: false, gradingCompany: null,
      gradeScore: null, notes: "n", photoUrl: null, photoUrl2: null, soldAt: null,
      card: {
        name: "Pikachu", pokemonName: "Pikachu", setName: "Base", number: "58", hp: "40",
        identifierCode: "BS-58", rarity: "Common", officialImageUrl: "printing.png",
      },
      seller: mapSeller(sellerRow),
    });
  });
  it("rarity_override vence cards.rarity", () => {
    expect(mapListing(row({ rarity_override: "Rare" })).rarity).toBe("Rare");
  });
  it("aceita relações como array de um elemento", () => {
    const l = mapListing(row({
      cards: [(row().cards as Row)], card_printings: [{ official_image_url: "p.png" }],
      user_profiles: [sellerRow],
    }));
    expect(l.card?.officialImageUrl).toBe("p.png");
    expect(l.seller?.id).toBe("u1");
  });
  it("sem printing usa a imagem da carta; sem vendedor, seller null", () => {
    const l = mapListing(row({ card_printings: null, user_profiles: null }));
    expect(l.card?.officialImageUrl).toBe("card.png");
    expect(l.seller).toBeNull();
  });
  it("status nulo vira collection e fica indisponível; defaults de idioma/variante", () => {
    const l = mapListing(row({ status: null, language: null, variant: null }));
    expect(l.status).toBe("collection");
    expect(l.language).toBe("en");
    expect(l.variant).toBe("normal");
    expect(listingAvailability(l)).toBe("unavailable");
  });
});

describe("listingAvailability", () => {
  it("ok para sale/trade/both com vendedor e sem sold_at", () => {
    for (const s of ["sale", "trade", "both"]) {
      expect(listingAvailability(mapListing(row({ status: s })))).toBe("ok");
    }
  });
  it("sold_at preenchido dá unavailable", () => {
    expect(listingAvailability(mapListing(row({ sold_at: "2026-02-01" })))).toBe("unavailable");
  });
  it("sem vendedor dá unavailable", () => {
    expect(listingAvailability(mapListing(row({ user_profiles: null })))).toBe("unavailable");
  });
});

describe("isHiddenSeller", () => {
  it("deleted_at ou is_banned escondem", () => {
    expect(isHiddenSeller({ deleted_at: "2026-01-01" })).toBe(true);
    expect(isHiddenSeller({ is_banned: true })).toBe(true);
    expect(isHiddenSeller({ deleted_at: null, is_banned: false })).toBe(false);
  });
});

describe("mapSeller", () => {
  it("planLabel Pro para subscription_plan pro", () => {
    expect(mapSeller({ subscription_plan: "pro" }).planLabel).toBe("Pro");
  });
  it("só expõe as chaves de PublicSeller", () => {
    const keys = Object.keys(mapSeller({ ...sellerRow, email: "x@y", phone: "1" })).sort();
    expect(keys).toEqual([
      "avatarUrl", "bio", "city", "followers", "id", "isBeta", "isLeiloeiro", "name",
      "planLabel", "rating", "state", "totalReviews", "totalTrades",
    ]);
  });
});

describe("mapTile", () => {
  it("foto do usuário > printing > carta", () => {
    expect(mapTile(row({ photo_url: "me.png" })).imageUrl).toBe("me.png");
    expect(mapTile(row()).imageUrl).toBe("printing.png");
    expect(mapTile(row({ card_printings: null })).imageUrl).toBe("card.png");
  });
  it("sem imagem e sem carta usa reserva", () => {
    const t = mapTile(row({ cards: null, card_printings: null }));
    expect(t).toMatchObject({ name: "Carta", imageUrl: null, setName: null, price: 12.5, language: "pt" });
  });
});
