import { languageLabel, rarityLabel } from "./format";
import type { PublicListing } from "./types";

export interface SpecRow { label: string; value: string; accent?: true }

/** Port de _DetailsSection (card_detail_screen.dart): linhas da Ficha da carta. */
export function cardSpecRows(listing: PublicListing): SpecRow[] {
  const card = listing.card;
  const rows: SpecRow[] = [];
  if (card?.pokemonName && card.pokemonName !== card.name) rows.push({ label: "Pokémon", value: card.pokemonName });
  if (card?.setName) rows.push({ label: "Coleção", value: card.setName });
  if (card?.number) rows.push({ label: "Número", value: card.number });
  if (card?.hp) rows.push({ label: "HP", value: card.hp });
  if (card?.identifierCode) rows.push({ label: "Código", value: card.identifierCode });
  rows.push({ label: "Idioma", value: languageLabel(listing.language) });
  rows.push({ label: "Condição", value: listing.condition });
  if (listing.rarity) rows.push({ label: "Raridade", value: rarityLabel(listing.rarity) });
  rows.push({ label: "Variante", value: listing.variant.replace(/_/g, " ") });
  if (listing.isGraded && listing.gradingCompany) {
    rows.push({
      label: "Graduação",
      value: listing.gradeScore != null ? `${listing.gradingCompany} · ${listing.gradeScore}` : listing.gradingCompany,
      accent: true,
    });
  }
  return rows;
}
