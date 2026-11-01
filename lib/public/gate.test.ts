import { describe, expect, it } from "vitest";
import { firstName } from "./format";
import { gateFeatures, gateSubtitle, gateTitle } from "./gate";

const listing = { kind: "listing", imageUrl: null } as const;
const profile = { kind: "profile", name: "Lucas Pacheco", avatarUrl: null, initial: "L" } as const;

describe("gate", () => {
  it("usa o primeiro nome", () => {
    expect(firstName("  Lucas Pacheco ")).toBe("Lucas");
  });
  it("textos do anúncio", () => {
    expect(gateTitle(listing)).toBe("Continue no app do CardTroca");
    expect(gateSubtitle(listing)).toBe("É grátis. Este anúncio abre direto no app.");
    expect(gateFeatures(listing)[0].title).toBe("Chat com o vendedor");
  });
  it("perfil começa por Notificações com o primeiro nome", () => {
    expect(gateTitle(profile)).toBe("Siga Lucas no app do CardTroca");
    expect(gateSubtitle(profile)).toBe("É grátis. Este perfil abre direto no app.");
    const f = gateFeatures(profile);
    expect(f[0].title).toBe("Notificações");
    expect(f[0].text).toBe("Aviso quando Lucas anunciar uma carta nova");
    expect(f).toHaveLength(4);
  });
});
