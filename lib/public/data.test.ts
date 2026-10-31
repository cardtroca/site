import { describe, expect, it, vi } from "vitest";
import { getListingPage, getProfilePage } from "./data";
import { fixtureSource, FIXTURE_IDS } from "./fixtures";
import type { PublicSource } from "./source";

const spySource = (): PublicSource => ({
  listingRow: vi.fn(async () => null),
  sellerRow: vi.fn(async () => null),
  sellerListingRows: vi.fn(async () => []),
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

  it("anúncio de vendedor banido dá unavailable com seller null e more vazio", async () => {
    const r = await getListingPage(FIXTURE_IDS.listingOfBanned, fixtureSource);
    expect(r).toEqual({ kind: "unavailable", seller: null, more: [] });
  });

  it("more tem no máximo 12, por preço decrescente, nulos por último", async () => {
    const r = await getListingPage(FIXTURE_IDS.listingSale, fixtureSource);
    if (r.kind !== "ok") throw new Error("esperado ok");
    expect(r.more.length).toBeLessThanOrEqual(12);
    const prices = r.more.map((t) => t.price);
    const nonNull = prices.filter((p): p is number => p != null);
    expect(nonNull).toEqual([...nonNull].sort((a, b) => b - a));
    const firstNull = prices.indexOf(null);
    if (firstNull >= 0) expect(prices.slice(firstNull).every((p) => p == null)).toBe(true);
  });

  it("limita more a 12", async () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({
      id: `00000000-0000-4000-8000-0000000001${String(i).padStart(2, "0")}`,
      user_id: FIXTURE_IDS.seller, status: "sale", asking_price: i, sold_at: null,
    }));
    const s: PublicSource = {
      listingRow: async () => ({ id: FIXTURE_IDS.listingSale, user_id: FIXTURE_IDS.seller, status: "sale", user_profiles: { id: FIXTURE_IDS.seller, name: "A" } }),
      sellerRow: async () => null,
      sellerListingRows: async () => rows,
    };
    const r = await getListingPage(FIXTURE_IDS.listingSale, s);
    if (r.kind !== "ok") throw new Error("esperado ok");
    expect(r.more).toHaveLength(12);
    expect(r.more[0].price).toBe(19);
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

  it("forSale não tem vendido nem coleção; collection só coleção; ordem por preço", async () => {
    const r = await getProfilePage(FIXTURE_IDS.seller, fixtureSource);
    if (r.kind !== "ok") throw new Error("esperado ok");
    const ids = r.forSale.map((t) => t.id);
    expect(ids).not.toContain(FIXTURE_IDS.listingSold);
    expect(ids).not.toContain(FIXTURE_IDS.listingCollection);
    expect(r.collection.map((t) => t.id)).toEqual([FIXTURE_IDS.listingCollection]);
    const nonNull = r.forSale.map((t) => t.price).filter((p): p is number => p != null);
    expect(nonNull).toEqual([...nonNull].sort((a, b) => b - a));
  });

  it("corta em 300 com aviso", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const rows = Array.from({ length: 350 }, (_, i) => ({ id: `id${i}`, user_id: FIXTURE_IDS.seller, status: "sale", asking_price: i, sold_at: null }));
    const s: PublicSource = {
      listingRow: async () => null,
      sellerRow: async () => ({ id: FIXTURE_IDS.seller, name: "A" }),
      sellerListingRows: async () => rows,
    };
    const r = await getProfilePage(FIXTURE_IDS.seller, s);
    if (r.kind !== "ok") throw new Error("esperado ok");
    expect(r.forSale).toHaveLength(300);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
