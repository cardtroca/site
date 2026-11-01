import { describe, expect, it } from "vitest";
import { cardSpecRows } from "./specs";
import type { PublicListing } from "./types";

const base: PublicListing = {
  id: "l", userId: "u", status: "sale", askingPrice: 10, condition: "NM", language: "en",
  variant: "reverse_holo", rarity: null, isGraded: false, gradingCompany: null, gradeScore: null,
  notes: null, photoUrl: null, photoUrl2: null, soldAt: null, seller: null,
  card: {
    name: "Umbreon VMAX", pokemonName: "Umbreon VMAX", setName: "Evolving Skies", number: "215/203",
    hp: "310", identifierCode: null, rarity: null, officialImageUrl: null,
  },
};

describe("cardSpecRows", () => {
  it("segue _DetailsSection: Pokémon só se diferente, variante sem underscore", () => {
    expect(cardSpecRows(base)).toEqual([
      { label: "Coleção", value: "Evolving Skies" },
      { label: "Número", value: "215/203" },
      { label: "HP", value: "310" },
      { label: "Idioma", value: "Inglês" },
      { label: "Condição", value: "NM" },
      { label: "Variante", value: "reverse holo" },
    ]);
  });

  it("mostra Pokémon, código, raridade e graduação quando existem", () => {
    const rows = cardSpecRows({
      ...base, rarity: "Rare Secret", isGraded: true, gradingCompany: "PSA", gradeScore: "9",
      card: { ...base.card!, pokemonName: "Umbreon", identifierCode: "SWSH7-215" },
    });
    expect(rows[0]).toEqual({ label: "Pokémon", value: "Umbreon" });
    expect(rows.find((r) => r.label === "Código")?.value).toBe("SWSH7-215");
    expect(rows.find((r) => r.label === "Raridade")?.value).toBeTruthy();
    expect(rows.at(-1)).toEqual({ label: "Graduação", value: "PSA · 9", accent: true });
  });

  it("graduação sem nota mostra só a empresa; sem empresa não aparece", () => {
    expect(cardSpecRows({ ...base, isGraded: true, gradingCompany: "CGC" }).at(-1)?.value).toBe("CGC");
    expect(cardSpecRows({ ...base, isGraded: true }).some((r) => r.label === "Graduação")).toBe(false);
  });
});
