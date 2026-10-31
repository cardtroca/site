import "server-only";
import { CARD_COLUMNS, LISTING_COLUMNS, SELLER_COLUMNS, type Row } from "./map";
import { fixtureSource } from "./fixtures";

export interface PublicSource {
  listingRow(id: string): Promise<Row | null>;
  sellerRow(userId: string): Promise<Row | null>;
  sellerListingRows(userId: string): Promise<Row[]>;
}

/** Import tardio: lib/supabase.ts cria o cliente ao carregar e exige as variáveis de ambiente. */
const client = async () => (await import("@/lib/supabase")).supabase;

const CARD_JOIN = `cards(${CARD_COLUMNS}), card_printings(official_image_url)`;

export const supabaseSource: PublicSource = {
  async listingRow(id) {
    const { data, error } = await (await client())
      .from("user_cards")
      .select(`${LISTING_COLUMNS}, ${CARD_JOIN}, user_profiles(${SELLER_COLUMNS})`)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as Row | null) ?? null;
  },
  async sellerRow(userId) {
    const { data, error } = await (await client())
      .from("user_profiles")
      .select(SELLER_COLUMNS)
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return (data as Row | null) ?? null;
  },
  async sellerListingRows(userId) {
    const { data, error } = await (await client())
      .from("user_cards")
      .select(`${LISTING_COLUMNS}, ${CARD_JOIN}`)
      .eq("user_id", userId)
      .in("status", ["sale", "both", "collection"]);
    if (error) throw error;
    return (data as Row[] | null) ?? [];
  },
};

export function defaultSource(): PublicSource {
  return process.env.PUBLIC_PAGES_FIXTURES === "true" ? fixtureSource : supabaseSource;
}
