import { describe, expect, it, vi } from "vitest";
import { getListingPage, getProfilePage } from "./data";
import { fixtureSource, FIXTURE_IDS } from "./fixtures";
import type { PublicSource } from "./source";

const spySource = (): PublicSource => ({
  listingRow: vi.fn(async () => null),
  sellerRow: vi.fn(async () => null),
  moreFromSeller: vi.fn(async () => []),
  profileTab: vi.fn(async () => ({ rows: [], total: 0 })),
});

describe("getListingPage", () => {
  it("id inválido dá not_found sem chamar a fonte", async () => {
    const s = spySource();
    expect(await getListingPage("abc", s)).toEqual({ kind: "not_found" });
    expect(s.listingRow).not.toHaveBeenCalled();
  });

  it("erro 22P02 dá not_found; outros erros sobem", async () => {
    const bad: PublicSource = { ...spySource(), listingRow: async () => { throw { code: "22P02" }; } };
    expect(await getListingPage(FIXTURE_IDS.listingSale, bad)).toEqual({ kind: "not_found" });
    const boom: PublicSource = { ...spySource(), listingRow: async () => { throw new Error("db"); } };
    await expect(getListingPage(FIXTURE_IDS.listingSale, boom)).rejects.toThrow("db");
  });

  it("anúncio inexistente dá not_found", async () => {
    expect(await getListingPage("00000000-0000-4000-8000-00000000ffff", fixtureSource)).toEqual({ kind: "not_found" });
  });

  it("anúncio ativo dá ok", async () => {
    const r = await getListingPage(FIXTURE_IDS.listingSale, fixtureSource);
    expect(r.kind).toBe("ok");
    if (r.kind === "ok") {
      expect(r.more.find((t) => t.id === FIXTURE_IDS.listingSale)).toBeUndefined();
    }
  });

  it("anúncio vendido dá unavailable, com more sem o próprio", async () => {
    const r = await getListingPage(FIXTURE_IDS.listingSold, fixtureSource);
    expect(r.kind).toBe("unavailable");
    if (r.kind === "unavailable") {
      expect(r.seller).not.toBeNull();
      expect(r.more.find((t) => t.id === FIXTURE_IDS.listingSold)).toBeUndefined();
    }
  });

  it("anúncio de vendedor banido dá unavailable com seller null e more vazio, sem buscar more", async () => {
    const s: PublicSource = { ...spySource(), listingRow: fixtureSource.listingRow };
    const r = await getListingPage(FIXTURE_IDS.listingOfBanned, s);
    expect(r).toEqual({ kind: "unavailable", seller: null, more: [] });
    expect(s.moreFromSeller).not.toHaveBeenCalled();
  });

  it("more só tem à venda sem vendido, sem o próprio, por preço decrescente, nulos por último", async () => {
    const r = await getListingPage(FIXTURE_IDS.listingSale, fixtureSource);
    if (r.kind !== "ok") throw new Error("esperado ok");
    const ids = r.more.map((t) => t.id);
    expect(ids).not.toContain(FIXTURE_IDS.listingSold);
    expect(ids).not.toContain(FIXTURE_IDS.listingCollection);
    expect(ids).not.toContain(FIXTURE_IDS.listingTrade);
    expect(r.more.length).toBeLessThanOrEqual(12);
    const prices = r.more.map((t) => t.price);
    const nonNull = prices.filter((p): p is number => p != null);
    expect(nonNull).toEqual([...nonNull].sort((a, b) => b - a));
    const firstNull = prices.indexOf(null);
    if (firstNull >= 0) expect(prices.slice(firstNull).every((p) => p == null)).toBe(true);
  });

  it("pede à fonte o vendedor, o id atual e o limite de 12", async () => {
    const s: PublicSource = {
      ...spySource(),
      listingRow: async () => ({ id: FIXTURE_IDS.listingSale, user_id: FIXTURE_IDS.seller, status: "sale", user_profiles: { id: FIXTURE_IDS.seller, name: "A" } }),
    };
    await getListingPage(FIXTURE_IDS.listingSale, s);
    expect(s.moreFromSeller).toHaveBeenCalledWith(FIXTURE_IDS.seller, FIXTURE_IDS.listingSale, 12);
  });
});

describe("getProfilePage", () => {
  it("id inválido dá not_found sem chamar a fonte", async () => {
    const s = spySource();
    expect(await getProfilePage("xyz", s)).toEqual({ kind: "not_found" });
    expect(s.sellerRow).not.toHaveBeenCalled();
  });

  it("22P02 dá not_found", async () => {
    const bad: PublicSource = { ...spySource(), sellerRow: async () => { throw { code: "22P02" }; } };
    expect(await getProfilePage(FIXTURE_IDS.seller, bad)).toEqual({ kind: "not_found" });
  });

  it("vendedor excluído e banido dão not_found", async () => {
    expect(await getProfilePage(FIXTURE_IDS.deletedSeller, fixtureSource)).toEqual({ kind: "not_found" });
    expect(await getProfilePage(FIXTURE_IDS.bannedSeller, fixtureSource)).toEqual({ kind: "not_found" });
  });

  it("forSale não tem vendido nem coleção; collection só coleção", async () => {
    const r = await getProfilePage(FIXTURE_IDS.seller, fixtureSource);
    if (r.kind !== "ok") throw new Error("esperado ok");
    const ids = r.forSale.map((t) => t.id);
    expect(ids).not.toContain(FIXTURE_IDS.listingSold);
    expect(ids).not.toContain(FIXTURE_IDS.listingCollection);
    expect(r.collection.map((t) => t.id)).toContain(FIXTURE_IDS.listingCollection);
    expect(r.forSaleTotal).toBe(r.forSale.length);
    expect(r.collectionTotal).toBe(r.collection.length);
  });

  it("ordena como o app: preço pedido, senão preço de mercado; o mercado não vai para o objeto", async () => {
    const card = (market: number | null) => ({ name: "C", market_price_brl: market });
    const rows = [
      { id: "a", status: "collection", asking_price: null, cards: card(10) },
      { id: "b", status: "collection", asking_price: null, cards: card(777) },
      { id: "c", status: "collection", asking_price: 50, cards: card(1) },
      { id: "d", status: "collection", asking_price: null, cards: card(null) },
    ];
    const s: PublicSource = {
      ...spySource(),
      sellerRow: async () => ({ id: FIXTURE_IDS.seller, name: "A" }),
      profileTab: async (_u, tab) => (tab === "collection" ? { rows, total: 4 } : { rows: [], total: 0 }),
    };
    const r = await getProfilePage(FIXTURE_IDS.seller, s);
    if (r.kind !== "ok") throw new Error("esperado ok");
    expect(r.collection.map((t) => t.id)).toEqual(["b", "c", "a", "d"]);
    expect(JSON.stringify(r)).not.toMatch(/market/i);
    expect(JSON.stringify(r)).not.toContain("777");
  });

  it("fixture: coleção segue o preço de mercado e sem o campo no resultado", async () => {
    const r = await getProfilePage(FIXTURE_IDS.seller, fixtureSource);
    if (r.kind !== "ok") throw new Error("esperado ok");
    expect(r.collection.map((t) => t.id)).toEqual([FIXTURE_IDS.listingCollection2, FIXTURE_IDS.listingCollection]);
    expect(JSON.stringify(r)).not.toMatch(/market/i);
  });

  it("vendedor sem avaliações e sem anúncios: ok com listas vazias", async () => {
    const r = await getProfilePage(FIXTURE_IDS.noReviewsSeller, fixtureSource);
    if (r.kind !== "ok") throw new Error("esperado ok");
    expect(r.seller.totalReviews).toBe(0);
    expect(r.seller.planLabel).toBeNull();
    expect(r.forSale).toEqual([]);
    expect(r.collection).toEqual([]);
    expect(r.forSaleTotal).toBe(0);
  });

  it("pede 300 por aba e usa o total real da fonte, avisando quando corta", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const rows = Array.from({ length: 300 }, (_, i) => ({ id: `id${i}`, status: "sale", asking_price: i, sold_at: null }));
    const s: PublicSource = {
      ...spySource(),
      sellerRow: async () => ({ id: FIXTURE_IDS.seller, name: "A" }),
      profileTab: vi.fn(async (_u: string, tab: "forSale" | "collection") => (tab === "forSale" ? { rows, total: 350 } : { rows: [], total: 0 })),
    };
    const r = await getProfilePage(FIXTURE_IDS.seller, s);
    if (r.kind !== "ok") throw new Error("esperado ok");
    expect(s.profileTab).toHaveBeenCalledWith(FIXTURE_IDS.seller, "forSale", 300);
    expect(s.profileTab).toHaveBeenCalledWith(FIXTURE_IDS.seller, "collection", 300);
    expect(r.forSale).toHaveLength(300);
    expect(r.forSale[0].price).toBe(299);
    expect(r.forSaleTotal).toBe(350);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("fixtureSource", () => {
  it("moreFromSeller respeita filtro, exclusão e limite", async () => {
    const rows = await fixtureSource.moreFromSeller(FIXTURE_IDS.seller, FIXTURE_IDS.listingSale, 2);
    expect(rows).toHaveLength(2);
    expect(rows.map((r) => r.id)).not.toContain(FIXTURE_IDS.listingSale);
  });
});
