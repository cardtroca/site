// Port de core/catalog/card_rarity_catalog.dart (app Flutter). [valor, nome PT, aliases]
type Option = readonly [value: string, ptName: string, aliases?: readonly string[]];

const OPTIONS: readonly Option[] = [
  ["Common", "Comum", ["C", "COMMON (C)"]],
  ["Uncommon", "Incomum", ["I", "UNCOMMON (U)"]],
  ["Rare", "Rara", ["R", "RARE (R)"]],
  ["Rare Holo", "Rara Holográfica", ["RH", "RARE HOLO", "HOLO RARE", "RARA HOLO"]],
  ["Promo", "Promocional", ["P", "PROMO"]],
  ["Double Rare", "Rara Dupla", ["DUPLA RARA"]],
  ["Illustration Rare", "Rara Ilustração", ["IR", "AR", "ART RARE", "ILUSTRAÇÃO RARA"]],
  ["Special Illustration Rare", "Rara Ilustração Especial", ["IS", "SIR", "SAR", "SPECIAL ART RARE", "ILUSTRAÇÃO RARA ESPECIAL"]],
  ["Rare Ultra", "Rara Ultra", ["ULTRA RARE", "RU", "ULTRA RARA"]],
  ["Hyper Rare", "Rara Hiper", ["HIPER RARA"]],
  ["Mega Hyper Rare", "Rara Mega Hiper"],
  ["Black White Rare", "Rara Black White"],
  ["ACE SPEC Rare", "Rara ACE SPEC"],
  ["Poke Ball Rare", "Rara Poké Ball", ["POKEBALL RARE", "POKE BALL RARE"]],
  ["Master Ball Rare", "Rara Master Ball", ["MASTERBALL RARE", "MASTER BALL RARE"]],
  ["Radiant Rare", "Rara Radiante"],
  ["Shiny Rare", "Rara Brilhante", ["SHINY RARA"]],
  ["Shiny Ultra Rare", "Rara Ultra Brilhante"],
  ["Amazing Rare", "Amazing Rare", ["A"]],
  ["Rare ACE", "Rara ACE"],
  ["Rare BREAK", "Rara BREAK"],
  ["Rare Secret", "Rara Secreta", ["S", "SR", "SECRET RARE", "RARE SECRETA"]],
  ["Rare Rainbow", "Rara Rainbow", ["RAINBOW RARE"]],
  ["Rare Shining", "Rara Shining"],
  ["Rare Shiny", "Rara Shiny"],
  ["Rare Shiny GX", "Rara Shiny GX"],
  ["Rare Prism Star", "Rara Prism Star"],
  ["Rare Prime", "Rara Prime"],
  ["LEGEND", "LEGEND", ["L"]],
  ["Rare Holo EX", "Rara Holo EX"],
  ["Rare Holo GX", "Rara Holo GX"],
  ["Rare Holo LV.X", "Rara Holo LV.X", ["RARE HOLO LVX"]],
  ["Rare Holo Star", "Rara Holo Star"],
  ["Rare Holo V", "Rara Holo V", ["HOLO RARE V"]],
  ["Rare Holo VMAX", "Rara Holo VMAX", ["HOLO RARE VMAX"]],
  ["Rare Holo VSTAR", "Rara Holo VSTAR", ["HOLO RARE VSTAR"]],
  ["Trainer Gallery Rare Holo", "Galeria de Treinadores Holo", ["TRAINER GALLERY HOLO RARE"]],
  ["Trainer Gallery Rare Ultra", "Galeria de Treinadores Ultra", ["TRAINER GALLERY ULTRA RARE"]],
  ["Trainer Gallery Rare Secret", "Galeria de Treinadores Secreta", ["TRAINER GALLERY SECRET RARE"]],
  ["Trainer Gallery Rare Holo V", "Galeria de Treinadores V", ["TRAINER GALLERY HOLO RARE V"]],
  ["Trainer Gallery Rare Holo VMAX", "Galeria de Treinadores VMAX"],
  ["Trainer Gallery Rare Holo VSTAR", "Galeria de Treinadores VSTAR"],
];

// Equivale a value.trim().toUpperCase().replaceAll(RegExp(r'[^A-Z0-9.]'), '')
const key = (value: string): string =>
  value.trim().toUpperCase().replace(/[^A-Z0-9.]/g, "");

const PLACEHOLDERS = new Set(["NONE", "NULL", "NA", ""]);

function find(raw: string | null | undefined): string | null {
  if (raw == null || raw.trim() === "") return null;
  const k = key(raw);
  for (const [value, ptName, aliases = []] of OPTIONS) {
    if (key(value) === k || key(ptName) === k || aliases.some((a) => key(a) === k)) return value;
  }
  return null;
}

function clean(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (value == null || PLACEHOLDERS.has(key(value))) return null;
  return value;
}

/** Port de CardRarityCatalog.labelFor. */
export function rarityLabel(raw: string | null): string {
  return find(raw) ?? clean(raw) ?? "Não identificada";
}
