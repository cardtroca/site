import { describe, expect, it } from "vitest";
import {
  conditionChip, firstName, formatBRL, galleryImages, languageLabel, languageShort,
  followersLabel, planLabel, priceCaption, rarityLabel, ratingText, reviewsLabel, statusLabel,
} from "./format";
import type { PublicListing } from "./types";

function listingWith(o: { photoUrl?: string | null; photoUrl2?: string | null; officialImageUrl?: string | null; card?: null }): PublicListing {
  const card = o.card === null ? null : {
    name: "Charizard", pokemonName: null, setName: null, number: null, hp: null,
    identifierCode: null, rarity: null, officialImageUrl: o.officialImageUrl ?? null,
  };
  return {
    id: "1", userId: "u", status: "sale", askingPrice: null, condition: "NM", language: "en",
    variant: "normal", rarity: null, isGraded: false, gradingCompany: null, gradeScore: null,
    notes: null, photoUrl: o.photoUrl ?? null, photoUrl2: o.photoUrl2 ?? null, soldAt: null,
    card, seller: null,
  };
}

describe("format", () => {
  it("formatBRL", () => {
    expect(formatBRL(2890)).toBe("R$ 2.890,00");
  });
  it("idioma", () => {
    expect(languageShort("pt-BR")).toBe("BR"); expect(languageShort("jp")).toBe("JP");
    expect(languageLabel("en")).toBe("Inglês"); expect(languageShort("xx")).toBe("OUT");
    expect(languageLabel("xx")).toBe("Outro idioma"); expect(languageLabel(null)).toBe("Outro idioma");
    expect(languageLabel("pt_BR")).toBe("Português");
  });
  it("conditionChip", () => {
    expect(conditionChip("Near Mint (NM)")).toEqual({ short: "NM", color: "#029779" });
    expect(conditionChip("HP")).toEqual({ short: "HP", color: "#E5484D" });
    expect(conditionChip("Foo")).toEqual({ short: "Foo", color: "#586572" });
  });
  it("statusLabel", () => {
    expect(statusLabel("both")).toBe("Venda e Troca"); expect(statusLabel("collection")).toBeNull();
    expect(statusLabel("sale")).toBe("Venda"); expect(statusLabel("trade")).toBe("Troca");
  });
  it("planLabel", () => {
    expect(planLabel("leiloeiro", false)).toBe("Leiloeiro"); expect(planLabel("free", true)).toBeNull();
    expect(planLabel(null, true)).toBe("Pro"); expect(planLabel(null, false)).toBeNull();
  });
  it("followersLabel e reviewsLabel: singular só em 1", () => {
    expect([0, 1, 2].map(followersLabel)).toEqual(["seguidores", "seguidor", "seguidores"]);
    expect([0, 1, 2].map(reviewsLabel)).toEqual(["comentários", "comentário", "comentários"]);
  });

  it("ratingText", () => {
    expect(ratingText(0, 0)).toEqual({ value: "—", label: "Sem avaliações" });
    expect(ratingText(4.94, 37)).toEqual({ value: "4,9", label: "avaliação" });
  });
  it("priceCaption", () => {
    expect(priceCaption("sale", null)).toEqual({ caption: "Preço pedido", value: "A combinar", cta: "Conversar" });
    expect(priceCaption("trade", 100)).toEqual({ caption: "Anúncio para troca", value: "Aceita propostas", cta: "Propor troca" });
    expect(priceCaption("sale", 50).value).toBe("R$ 50,00");
  });
  it("galleryImages", () => {
    expect(galleryImages(listingWith({ photoUrl: null, photoUrl2: null, card: null }))).toEqual([]);
    expect(galleryImages(listingWith({ photoUrl: "a", photoUrl2: null, officialImageUrl: "o" })).map(i => i.isUserPhoto)).toEqual([true, false]);
  });
  it("firstName", () => {
    expect(firstName("Lucas Pacheco")).toBe("Lucas");
  });
  it("rarityLabel", () => {
    expect(rarityLabel(null)).toBe("Não identificada");
    expect(rarityLabel("none")).toBe("Não identificada");
    expect(rarityLabel("SIR")).toBe("Special Illustration Rare");
    expect(rarityLabel("Rara Holográfica")).toBe("Rare Holo");
    expect(rarityLabel("  Weird One ")).toBe("Weird One");
  });
});
