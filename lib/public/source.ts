import "server-only";
import { CARD_COLUMNS, LISTING_COLUMNS, SELLER_COLUMNS, type Row } from "./map";
import { fixtureSource } from "./fixtures";

export type ProfileTab = "forSale" | "collection";

export interface PublicSource {
  listingRow(id: string): Promise<Row | null>;
  sellerRow(userId: string): Promise<Row | null>;
  /** "Mais cartas": à venda, sem vendido, sem o anúncio atual, preço decrescente. */
  moreFromSeller(userId: string, excludeId: string, limit: number): Promise<Row[]>;
  /**
   * Uma aba do perfil, cortada em `limit`, com o total real. Cada linha traz
   * `cards.market_price_brl` só para a ordenação do app; o map não o copia.
   */
  profileTab(userId: string, tab: ProfileTab, limit: number): Promise<{ rows: Row[]; total: number }>;
}

/** Import tardio: lib/supabase.ts cria o cliente ao carregar e exige as variáveis de ambiente. */
const client = async () => (await import("@/lib/supabase")).supabase;

const CARD_JOIN = `cards(${CARD_COLUMNS}), card_printings(official_image_url)`;
/** Preço de mercado só para ordenar; nunca é mapeado nem vai para o HTML. */
const TAB_CARD_JOIN = `cards(${CARD_COLUMNS}, market_price_brl), card_printings(official_image_url)`;
const FOR_SALE = ["sale", "both"];

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
  async moreFromSeller(userId, excludeId, limit) {
    const { data, error } = await (await client())
      .from("user_cards")
      .select(`${LISTING_COLUMNS}, ${CARD_JOIN}`)
      .eq("user_id", userId)
      .in("status", FOR_SALE)
      .is("sold_at", null)
      .neq("id", excludeId)
      .order("asking_price", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as Row[] | null) ?? [];
  },
  async profileTab(userId, tab, limit) {
    let q = (await client())
      .from("user_cards")
      .select(`${LISTING_COLUMNS}, ${TAB_CARD_JOIN}`, { count: "exact" })
      .eq("user_id", userId);
    q = tab === "forSale" ? q.in("status", FOR_SALE).is("sold_at", null) : q.eq("status", "collection");
    // O corte segue o app (preço pedido, senão mercado) o mais perto que o PostgREST permite;
    // data.ts reordena pela regra exata.
    const { data, error, count } = await q
      .order("asking_price", { ascending: false, nullsFirst: false })
      .order("cards(market_price_brl)", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    const rows = (data as Row[] | null) ?? [];
    return { rows, total: count ?? rows.length };
  },
};

export function defaultSource(): PublicSource {
  const fixtures = process.env.PUBLIC_PAGES_FIXTURES === "true" && process.env.VERCEL_ENV !== "production";
  return fixtures ? fixtureSource : supabaseSource;
}
