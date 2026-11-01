import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultSource, supabaseSource } from "./source";
import { fixtureSource } from "./fixtures";

describe("defaultSource", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("usa as fixtures com a flag fora de produção", () => {
    vi.stubEnv("PUBLIC_PAGES_FIXTURES", "true");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(defaultSource()).toBe(fixtureSource);
  });

  it("usa as fixtures com a flag sem VERCEL_ENV (local)", () => {
    vi.stubEnv("PUBLIC_PAGES_FIXTURES", "true");
    vi.stubEnv("VERCEL_ENV", undefined);
    expect(defaultSource()).toBe(fixtureSource);
  });

  it("ignora a flag em produção", () => {
    vi.stubEnv("PUBLIC_PAGES_FIXTURES", "true");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(defaultSource()).toBe(supabaseSource);
  });

  it("sem a flag usa o Supabase", () => {
    vi.stubEnv("PUBLIC_PAGES_FIXTURES", undefined);
    expect(defaultSource()).toBe(supabaseSource);
  });
});
