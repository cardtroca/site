import type { Row } from "./map";
import type { PublicSource } from "./source";

/** Ids fixos para abrir as páginas no navegador com PUBLIC_PAGES_FIXTURES=true. */
export const FIXTURE_IDS = {
  seller: "11111111-1111-4111-8111-111111111111",
  deletedSeller: "22222222-2222-4222-8222-222222222222",
  bannedSeller: "33333333-3333-4333-8333-333333333333",
  listingSale: "aaaaaaaa-0000-4000-8000-000000000001",
  listingTrade: "aaaaaaaa-0000-4000-8000-000000000002",
  listingNoPrice: "aaaaaaaa-0000-4000-8000-000000000003",
  listingNoImage: "aaaaaaaa-0000-4000-8000-000000000004",
  listingSold: "aaaaaaaa-0000-4000-8000-000000000005",
  listingCollection: "aaaaaaaa-0000-4000-8000-000000000006",
  listingLongName: "aaaaaaaa-0000-4000-8000-000000000007",
  listingBoth: "aaaaaaaa-0000-4000-8000-000000000008",
  listingOfBanned: "bbbbbbbb-0000-4000-8000-000000000001",
  listingOfDeleted: "bbbbbbbb-0000-4000-8000-000000000002",
} as const;

const sellerRow = (id: string, extra: Row = {}): Row => ({
  id, name: "Ash Ketchum", avatar_url: null, city: "Pallet Town", state: "SP",
  bio: "Colecionador desde 1999. Aceito trocas.", is_beta: false, is_premium: true,
  subscription_plan: "premium", reputation_score: 4.8, total_reviews: 23,
  followers_count: 41, total_trades: 17, deleted_at: null, is_banned: false, ...extra,
});

const SELLER = sellerRow(FIXTURE_IDS.seller);
const DELETED = sellerRow(FIXTURE_IDS.deletedSeller, { name: "Excluído", deleted_at: "2026-01-01T00:00:00Z" });
const BANNED = sellerRow(FIXTURE_IDS.bannedSeller, { name: "Banido", is_banned: true });

const card = (name: string, image: string | null, extra: Row = {}): Row => ({
  name, pokemon_name: name.split(" ")[0], set_name: "Evolving Skies", number: "215/203",
  hp: 280, identifier_code: "SWSH7-215", rarity: "Rare Secret", official_image_url: image, ...extra,
});

const IMG = "https://images.pokemontcg.io/swsh7/215_hires.png";

const listing = (id: string, userId: string, extra: Row, c: Row): Row => ({
  id, user_id: userId, card_id: `cccccccc-0000-4000-8000-${id.slice(-12)}`, status: "sale",
  asking_price: 100, condition: "NM", language: "pt", variant: "normal", rarity_override: null,
  is_graded: false, grading_company: null, grade_score: null, notes: null,
  photo_url: null, photo_url_2: null, sold_at: null, created_at: "2026-10-01T12:00:00Z",
  cards: c, card_printings: null, ...extra,
});

const S = FIXTURE_IDS.seller;
const ALL: Row[] = [
  listing(FIXTURE_IDS.listingSale, S, { asking_price: 450 }, card("Umbreon VMAX", IMG)),
  listing(FIXTURE_IDS.listingTrade, S, { status: "trade", asking_price: null }, card("Rayquaza VMAX", "https://images.pokemontcg.io/swsh7/218_hires.png")),
  listing(FIXTURE_IDS.listingNoPrice, S, { status: "sale", asking_price: null }, card("Charizard V", "https://images.pokemontcg.io/swsh3/20_hires.png")),
  listing(FIXTURE_IDS.listingNoImage, S, { asking_price: 35 }, card("Pikachu", null)),
  listing(FIXTURE_IDS.listingSold, S, { asking_price: 80, sold_at: "2026-10-10T12:00:00Z" }, card("Mew V", IMG)),
  listing(FIXTURE_IDS.listingCollection, S, { status: "collection", asking_price: null }, card("Gengar VMAX", IMG)),
  listing(FIXTURE_IDS.listingLongName, S, { asking_price: 12 }, card("Pikachu com Chapéu de Festa Edição Comemorativa 25 Anos", IMG)),
  listing(FIXTURE_IDS.listingBoth, S, { status: "both", asking_price: 220, is_graded: true, grading_company: "PSA", grade_score: 9, photo_url: "https://images.pokemontcg.io/swsh12/138_hires.png", notes: "Carta direto do booster para o sleeve.\nEnvio com rastreio ou entrega em mãos." }, card("Lugia V", IMG)),
  listing(FIXTURE_IDS.listingOfBanned, FIXTURE_IDS.bannedSeller, { asking_price: 60 }, card("Eevee", IMG)),
  listing(FIXTURE_IDS.listingOfDeleted, FIXTURE_IDS.deletedSeller, { asking_price: 60 }, card("Snorlax", IMG)),
];

const sellers: Record<string, Row> = {
  [FIXTURE_IDS.seller]: SELLER,
  [FIXTURE_IDS.deletedSeller]: DELETED,
  [FIXTURE_IDS.bannedSeller]: BANNED,
};

export const fixtureSource: PublicSource = {
  async listingRow(id) {
    const row = ALL.find((r) => r.id === id);
    if (!row) return null;
    return { ...row, user_profiles: sellers[row.user_id as string] ?? null };
  },
  async sellerRow(userId) {
    return sellers[userId] ?? null;
  },
  async sellerListingRows(userId) {
    return ALL.filter((r) => r.user_id === userId);
  },
};
