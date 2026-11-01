# Anúncio e perfil público na web: plano de implementação

> **Para agentes:** sub-skill obrigatória: superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans, tarefa por tarefa. Os passos usam checkbox (`- [ ]`).

**Objetivo:** `/card/[cardId]` e `/profile/[userId]` mostram para quem não tem o app o mesmo anúncio e o mesmo perfil do app, e toda ação de negociação abre a janela "Continue no app" com os botões das lojas.

**Arquitetura:**
- **Dados:** o servidor lê o Supabase com o cliente que já existe (`lib/supabase.ts`) e só busca as colunas que a página mostra.
- **Lógica:** linha do banco → tipo público, formatação e links ficam em funções puras em `lib/public/`, testadas com Vitest.
- **Telas:** as páginas são Server Components com componentes cliente pequenos (inclinação da carta, abas, janela de download), em `components/public/`.
- **Visual do app:** um route group `app/(app-look)/` aplica a fonte e as cores do app só nessas rotas.

**Stack:** Next.js 14.2 (App Router), React 18, TypeScript, Tailwind 3, `@supabase/supabase-js` 2, `@amplitude/analytics-browser`. Novos: `vitest` (dev), `qrcode.react`, `server-only`.

**Spec:** `docs/superpowers/specs/2026-10-31-perfil-publico-web-design.md`. Protótipos aprovados: `docs/superpowers/specs/2026-10-31-perfil-publico-web/anuncio.html` e `perfil.html`. Ler os dois antes de qualquer tarefa de tela.

## Restrições globais

- **Sem mudanças fora deste repo.** Nada no app, no banco, em edge function nem em `vercel.json`.
- **Regra zero do CardTroca.** Não rodar nada contra o Supabase de produção a partir da máquina local. Isso inclui `npm run dev` com a chave de produção. O desenvolvimento local usa fixtures (Tarefa 3).
- **Chave do servidor.** `SUPABASE_SERVICE_ROLE_KEY` só aparece em código com `import "server-only"`.
- **Colunas.** Todo `select` lista as colunas uma a uma, nunca `*`. Nunca entram e-mail, telefone, documento, endereço, `latitude`, `longitude`, carteira ou pedidos.
- **Preço de mercado.** Nenhum valor real vai para o HTML: nem bloco, nem pílula "abaixo da média", nem "Média de mercado".
- **Medalha.** Sem `trader_medal` nem medalha.
- **Ações.** Nenhum botão de comprar nem de carrinho.
- **Fonte.** Poppins com pesos 400, 500 e 600 só dentro de `(app-look)`. Nada em 700.
- **Cores do app.**
  - Fundo e superfícies: fundo `#F5F6F6`, superfície `#FFFFFF`, superfície variante `#EEF0F0`.
  - Primária: `#029779`, clara `#E6FAF4`, escura `#104E4B`.
  - Texto: `#11161D`, `#586572`, `#8A95A2`.
  - Borda: `#E3E6E6`.
  - Estados: ouro e aviso `#D98E04`, sucesso `#0E9F6E`, erro `#E5484D`, raro `#2563EB`.
- **Forma.** Blocos com cantos de 22 px e sombra `0 8px 24px -8px rgba(0,0,0,.06)`. Pílulas pequenas com sombra `0 1px 2px rgba(0,0,0,.06)`.
- **Ícones.** Material Symbols Rounded.
- **Tema.** As páginas são sempre claras.
- **Indexação.** As duas páginas mantêm `robots: { index: false, follow: true }`.
- **Commits.** Seguem o padrão do repo (`feat: ...`, `fix: ...`, `docs: ...`) e terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Nunca `git push`.
- **Verificação.** `npm run lint`, `npx vitest run` e `npm run build` verdes antes de cada commit de código.

## Riscos para a revisão

Entradas que a spec deixa implícitas e que os testes das tarefas precisam cobrir:

1. **Id que não é UUID** (`/card/abc`, `/profile/xyz`): devolve 404, não 500. O Postgres responde `22P02`. Teste na Tarefa 3.
2. **Vendedor excluído ou banido:** o perfil dá 404 e o anúncio dele aparece como indisponível. Teste na Tarefa 3.
3. **Anúncio sem preço ou só de troca:** mostra "A combinar", ou "Anúncio para troca" com "Aceita propostas" e o botão "Propor troca". O título da prévia do link diz "Troca". Testes nas Tarefas 2 e 5.
4. **Carta sem imagem oficial e sem fotos:** mostra a reserva (pokébola apagada) e não quebra a prévia do link. Testes nas Tarefas 2 e 5.
5. **Textos longos em 360 px:** nome da carta, cidade, bio e nome do vendedor quebram a linha ou cortam com reticências, sem estourar o card. Conferência visual na Tarefa 9.

---

### Tarefa 0: separar o trabalho de SEO e preparar os testes

O trabalho local de SEO e design que ainda não foi commitado (cerca de 22 arquivos modificados e alguns novos) vira um commit só, antes de qualquer código da feature.

**Arquivos:**
- Commit: tudo o que `git status` mostra, menos `.claude/settings.local.json`, `.superpowers/` e `tsconfig.tsbuildinfo`.
- Modificar: `package.json` (script `"test": "vitest run"`, `vitest` em devDependencies, `qrcode.react` e `server-only` em dependencies).
- Criar: `vitest.config.ts` com ambiente `node` e o alias `@` apontando para a raiz.

- [ ] **Passo 1:** rodar `git status --short` e conferir que só há o trabalho de SEO e design.
- [ ] **Passo 2:** rodar `npm run lint && npm run build`. Se falhar por causa do trabalho de SEO, parar e avisar o Lux. Não corrigir o SEO por conta própria.
- [ ] **Passo 3:** `git add` dos arquivos, menos as três exceções, e commit `feat(site): SEO e nova home (trabalho local do Lux)`.
- [ ] **Passo 4:** `npm i -D vitest@^2` e `npm i qrcode.react@^4 server-only`. Criar `vitest.config.ts` e o script `test`.
- [ ] **Passo 5:** criar `lib/public/smoke.test.ts` com `expect(1).toBe(1)`, rodar `npm test` (esperado: PASS) e apagar o arquivo.
- [ ] **Passo 6:** commit `chore: vitest, qrcode.react e server-only`.

---

### Tarefa 1: tipos públicos e formatação

**Arquivos:**
- Criar: `lib/public/types.ts`, `lib/public/format.ts`, `lib/public/format.test.ts`

**Interfaces que esta tarefa produz** (em `types.ts`):

```ts
export type ListingStatus = "sale" | "trade" | "both" | "collection" | "unavailable";
export interface PublicSeller {
  id: string; name: string; avatarUrl: string | null; city: string | null; state: string | null;
  bio: string | null; planLabel: string | null; isLeiloeiro: boolean; isBeta: boolean;
  rating: number; totalReviews: number; followers: number; totalTrades: number;
}
export interface PublicCard {
  name: string; pokemonName: string | null; setName: string | null; number: string | null;
  hp: string | null; identifierCode: string | null; rarity: string | null; officialImageUrl: string | null;
}
export interface PublicListing {
  id: string; userId: string; status: ListingStatus; askingPrice: number | null;
  condition: string; language: string; variant: string; rarity: string | null;
  isGraded: boolean; gradingCompany: string | null; gradeScore: string | null; notes: string | null;
  photoUrl: string | null; photoUrl2: string | null; soldAt: string | null;
  card: PublicCard | null; seller: PublicSeller | null;
}
export interface ListingTile {
  id: string; name: string; setName: string | null; price: number | null;
  language: string; imageUrl: string | null;
}
export type ListingPageData =
  | { kind: "ok"; listing: PublicListing; more: ListingTile[] }
  | { kind: "unavailable"; seller: PublicSeller | null; more: ListingTile[] }
  | { kind: "not_found" };
export type ProfilePageData =
  | { kind: "ok"; seller: PublicSeller; forSale: ListingTile[]; collection: ListingTile[] }
  | { kind: "not_found" };
```

**Interfaces de `format.ts`.** O app em `/Users/lux/development/CardTroca/frontend/cardtroca/lib` é a fonte da verdade de cada regra:

- `formatBRL(value: number): string`: `"R$ 2.890,00"`, usando `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` com espaço normal.
- `languageShort(code: string | null): string` e `languageLabel(code: string | null): string`: tabela de `core/utils/card_language_util.dart`, com os mesmos aliases e a mesma normalização (`"pt-BR"` vira `"pt"`). `languageLabel` devolve só o nome (`"Inglês"`).
- `conditionChip(condition: string): { short: string; color: string }`: abreviação é o texto entre parênteses, se houver. Cores: M `#0E9F6E`, NM `#029779`, SP `#2563EB`, MP `#D98E04`, HP `#E5484D`, demais `#586572`.
- `statusLabel(status: ListingStatus): string | null`: sale `"Venda"`, trade `"Troca"`, both `"Venda e Troca"`, demais `null`.
- `planLabel(subscriptionPlan: string | null, isPremium: boolean): string | null`: regra de `paidPlanLabel` em `data/models/user_model.dart`.
- `rarityLabel(raw: string | null): string`: portar `options` e `labelFor` de `core/catalog/card_rarity_catalog.dart`.
- `firstName(name: string): string`
- `ratingText(rating: number, totalReviews: number): { value: string; label: string }`: com avaliações, `{ value: "4,9", label: "avaliação" }`. Sem avaliações, `{ value: "—", label: "Sem avaliações" }`.
- `priceCaption(status: ListingStatus, askingPrice: number | null): { caption: string; value: string; cta: "Conversar" | "Propor troca" }`
- `galleryImages(listing: PublicListing): { url: string; isUserPhoto: boolean }[]`: ordem `photoUrl`, `photoUrl2`, `card.officialImageUrl`, sem nulos.

- [ ] **Passo 1: testes que falham** em `format.test.ts`:

```ts
expect(formatBRL(2890)).toBe("R$ 2.890,00");
expect(languageShort("pt-BR")).toBe("BR"); expect(languageShort("jp")).toBe("JP");
expect(languageLabel("en")).toBe("Inglês"); expect(languageShort("xx")).toBe("OUT");
expect(conditionChip("Near Mint (NM)")).toEqual({ short: "NM", color: "#029779" });
expect(conditionChip("HP")).toEqual({ short: "HP", color: "#E5484D" });
expect(statusLabel("both")).toBe("Venda e Troca"); expect(statusLabel("collection")).toBeNull();
expect(planLabel("leiloeiro", false)).toBe("Leiloeiro"); expect(planLabel("free", true)).toBeNull();
expect(planLabel(null, true)).toBe("Pro"); expect(planLabel(null, false)).toBeNull();
expect(ratingText(0, 0)).toEqual({ value: "—", label: "Sem avaliações" });
expect(ratingText(4.94, 37)).toEqual({ value: "4,9", label: "avaliação" });
expect(priceCaption("sale", null)).toEqual({ caption: "Preço pedido", value: "A combinar", cta: "Conversar" });
expect(priceCaption("trade", 100)).toEqual({ caption: "Anúncio para troca", value: "Aceita propostas", cta: "Propor troca" });
expect(galleryImages(listingWith({ photoUrl: null, photoUrl2: null, card: null }))).toEqual([]);
expect(galleryImages(listingWith({ photoUrl: "a", photoUrl2: null, officialImageUrl: "o" })).map(i => i.isUserPhoto)).toEqual([true, false]);
expect(firstName("Lucas Pacheco")).toBe("Lucas");
```

`listingWith` é um helper local do teste, que monta um `PublicListing` mínimo.

- [ ] **Passo 2:** `npx vitest run lib/public/format.test.ts`. Esperado: FAIL, módulo inexistente.
- [ ] **Passo 3:** escrever `types.ts` e `format.ts`.
- [ ] **Passo 4:** `npx vitest run lib/public/format.test.ts`. Esperado: PASS.
- [ ] **Passo 5:** commit `feat(publico): tipos e formatação do anúncio e do perfil`.

---

### Tarefa 2: linha do banco para tipo público

**Arquivos:**
- Criar: `lib/public/map.ts`, `lib/public/map.test.ts`

**Interfaces:**
- Usa: os tipos da Tarefa 1.
- Produz:
  - `SELLER_COLUMNS`: `"id, name, avatar_url, city, state, bio, is_beta, is_premium, subscription_plan, reputation_score, total_reviews, followers_count, total_trades, deleted_at, is_banned"`.
  - `CARD_COLUMNS`: `"name, pokemon_name, set_name, number, hp, identifier_code, rarity, official_image_url"`.
  - `LISTING_COLUMNS`: `"id, user_id, card_id, status, asking_price, condition, language, variant, rarity_override, is_graded, grading_company, grade_score, notes, photo_url, photo_url_2, sold_at, created_at"`.
  - Funções `mapSeller(row): PublicSeller`, `mapListing(row): PublicListing`, `mapTile(row): ListingTile`, `isHiddenSeller(row): boolean` e `listingAvailability(listing: PublicListing): "ok" | "unavailable"`.
  - `row` é o formato devolvido por `.select(\`${LISTING_COLUMNS}, cards(${CARD_COLUMNS}), card_printings(official_image_url), user_profiles(${SELLER_COLUMNS})\`)`.

**Regras do app** (`_mapFromSupabase` em `data/repositories/card_repository.dart`):
- A imagem de `card_printings.official_image_url` prevalece sobre `cards.official_image_url`.
- A raridade do anúncio é `rarity_override ?? cards.rarity`.
- `status` nulo vira `"collection"`.
- `language` nulo vira `"en"`.
- `variant` nulo vira `"normal"`.

**Regras de disponibilidade e exibição:**
- `isHiddenSeller`: `deleted_at != null || is_banned === true`.
- `listingAvailability`: `"ok"` só se `status` for `sale`, `trade` ou `both`, `soldAt` for nulo e houver vendedor. Qualquer outra combinação dá `"unavailable"`.
- `mapTile`: imagem por `photo_url ?? printing ?? card`, nome `cards.name ?? "Carta"`.

Antes de escrever, conferir os nomes das colunas nas migrations de `user_profiles` e `user_cards` em `/Users/lux/development/CardTroca/database/migrations` e `backend/supabase/migrations`. Se `is_banned`, `total_trades` ou `rarity_override` não existir, parar e avisar.

- [ ] **Passo 1: testes que falham.**
  - Uma linha completa vira o `PublicListing` esperado, com a imagem do printing prevalecendo.
  - `rarity_override` vence `cards.rarity`.
  - Uma linha com `status: null` dá `status: "collection"` e `availability: "unavailable"`.
  - Um anúncio com `sold_at` preenchido dá `"unavailable"`.
  - `isHiddenSeller({ deleted_at: "2026-01-01" })` é `true`.
  - `isHiddenSeller({ is_banned: true })` é `true`.
  - `mapSeller` dá `planLabel: "Pro"` para `{ subscription_plan: "pro" }`.
  - O objeto devolvido por `mapSeller` não tem nenhuma chave além das de `PublicSeller` (`Object.keys` comparado com a lista).
- [ ] **Passo 2:** `npx vitest run lib/public/map.test.ts`. Esperado: FAIL.
- [ ] **Passo 3:** escrever `map.ts`.
- [ ] **Passo 4:** `npx vitest run lib/public/map.test.ts`. Esperado: PASS.
- [ ] **Passo 5:** commit `feat(publico): mapeia anúncio, vendedor e cartas do banco`.

---

### Tarefa 3: busca de dados e fixtures

**Arquivos:**
- Criar: `lib/public/data.ts` (com `import "server-only"`), `lib/public/source.ts`, `lib/public/fixtures.ts`, `lib/public/data.test.ts`
- Modificar: `.env.example` (adicionar `SUPABASE_URL=`, `SUPABASE_SERVICE_ROLE_KEY=` e `PUBLIC_PAGES_FIXTURES=`)

**Interfaces:**
- Usa: o que a Tarefa 2 produz.
- Produz:
  - `getListingPage(id: string, source?: PublicSource): Promise<ListingPageData>`
  - `getProfilePage(userId: string, source?: PublicSource): Promise<ProfilePageData>`
  - `interface PublicSource { listingRow(id: string): Promise<Row | null>; sellerRow(userId: string): Promise<Row | null>; sellerListingRows(userId: string): Promise<Row[]> }`, em `source.ts`
  - `supabaseSource` (lê com o cliente de `lib/supabase.ts`) e `fixtureSource` (em memória), em `source.ts`
  - `defaultSource()`: `fixtureSource` se `process.env.PUBLIC_PAGES_FIXTURES === "true"`, senão `supabaseSource`

**Regras:**
- **Id inválido:** quando o id não casa com `/^[0-9a-f-]{36}$/i`, devolve `not_found` sem chamar a fonte.
- **Erro do banco:** um erro com `code === "22P02"` também dá `not_found`. Os outros erros sobem.
- **Anúncio:**
  - `listingRow` nulo dá `not_found`;
  - vendedor oculto ou `listingAvailability` igual a `"unavailable"` dá `unavailable`, com `seller` (nulo se oculto) e `more`;
  - fora isso, `ok`.
- **"Mais cartas" (`more`):** anúncios do vendedor com `status` `sale` ou `both`, sem `sold_at`, tirando o atual, ordenados por preço decrescente (nulos por último), no máximo 12. Vendedor oculto dá `more: []`.
- **Perfil:**
  - vendedor inexistente ou oculto dá `not_found`;
  - `forSale` são os anúncios com `status` `sale` ou `both` e sem `sold_at`;
  - `collection` são os com `status` igual a `collection`;
  - as duas listas por preço decrescente, igual a `get_public_profile_usecase.dart`;
  - sem limite. Decisão deste plano: se passar de 300, cortar em 300 e registrar `console.warn`.
- **`supabaseSource`:** um `select` por método, com as colunas da Tarefa 2.
  - `sellerListingRows` filtra `.eq("user_id", userId).in("status", ["sale", "both", "collection"])`.
- **`fixtures.ts`:** um vendedor normal, um excluído e um banido; anúncios de venda, troca, sem preço, sem imagem, vendido e de coleção; e um nome de carta com 60 caracteres.

- [ ] **Passo 1: testes que falham** (com `fixtureSource` e uma fonte espiã):
  - `getListingPage("abc")` devolve `{ kind: "not_found" }` e a espiã não é chamada;
  - uma fonte que lança `{ code: "22P02" }` dá `not_found`;
  - um anúncio vendido dá `unavailable`, com `more` sem o próprio anúncio;
  - um anúncio de vendedor banido dá `unavailable` com `seller: null`;
  - `more.length <= 12` e está ordenado por preço decrescente;
  - `getProfilePage(<id do excluído>)` dá `not_found`;
  - `forSale` não tem anúncio vendido nem de coleção.
- [ ] **Passo 2:** `npx vitest run lib/public/data.test.ts`. Esperado: FAIL.
- [ ] **Passo 3:** escrever `source.ts`, `fixtures.ts` e `data.ts`.
- [ ] **Passo 4:** `npx vitest run`. Esperado: tudo PASS.
- [ ] **Passo 5:** commit `feat(publico): busca do anúncio e do perfil com fixtures locais`.

---

### Tarefa 4: links das lojas, navegador interno e eventos

**Arquivos:**
- Criar: `lib/public/links.ts`, `lib/public/links.test.ts`, `lib/public/track.ts`

**Interfaces:**
- `androidIntentUrl(path: string): string`: `intent://cardtroca.com${path}#Intent;scheme=https;package=io.cardtroca;S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`
- `platformOf(userAgent: string): "ios" | "android" | "desktop"`
- `isInAppBrowser(userAgent: string): boolean`: verdadeiro com `Instagram`, `FBAN`, `FBAV`, `WhatsApp` ou `Line/`.
- `storeOrder(platform): ("apple" | "google")[]`: android dá google primeiro; os outros, apple primeiro.
- `trackPublic(event: "web_listing_viewed" | "web_profile_viewed" | "web_app_gate_opened" | "web_store_clicked", props?: Record<string, string>): void`, em `track.ts`, só no cliente. Só chama `amplitude.track` quando `getCookieConsent() === "accepted"`, de `components/CookieConsent.tsx`.

- [ ] **Passo 1: testes que falham.**
  - `androidIntentUrl("/card/x")` começa com `intent://cardtroca.com/card/x#Intent;scheme=https;package=io.cardtroca;` e contém `S.browser_fallback_url=https%3A%2F%2Fplay.google.com`.
  - `platformOf` com o user agent de um iPhone dá `"ios"`.
  - `isInAppBrowser` com um user agent do Instagram dá `true`; com o do Safari, `false`.
  - `storeOrder("android")` dá `["google", "apple"]`.
- [ ] **Passo 2:** rodar os testes. Esperado: FAIL.
- [ ] **Passo 3:** escrever `links.ts` e `track.ts`.
- [ ] **Passo 4:** rodar os testes. Esperado: PASS.
- [ ] **Passo 5:** commit `feat(publico): links das lojas, intent do Android e eventos`.

---

### Tarefa 5: textos da prévia do link

**Arquivos:**
- Criar: `lib/public/og.ts`, `lib/public/og.test.ts`

**Interfaces:**
- `listingOg(data: ListingPageData): { title: string; description: string; image: string | null }`
- `profileOg(data: ProfilePageData): { title: string; description: string; image: string | null }`

**Textos:**
- **Anúncio `ok`:**
  - `title`: `"<nome> · R$ 2.890,00"`. Só troca usa `"<nome> · Troca"`; sem preço, `"<nome> · A combinar"`.
  - `description`: `"<coleção> · <condição curta> · <Cidade/UF> no CardTroca"`, pulando as partes nulas.
  - `image`: primeira de `galleryImages`, ou `null`.
- **Perfil `ok`:**
  - `title`: `"<nome> no CardTroca"`.
  - `description`: `"<N> cartas à venda · ★ 4,9"`. Sem avaliações, sem a parte da estrela.
  - `image`: o avatar, ou `null`.
- **`image` nulo:** a página não declara `og:image` e vale a imagem padrão do site (`app/opengraph-image.tsx`). Se o teste manual 5 da Tarefa 10 mostrar que o WhatsApp recusa a imagem da carta, criar `opengraph-image.tsx` na rota com `next/og` (1200×630, carta sobre `#F5F6F6`). Isso fica como tarefa de acompanhamento.
- **`unavailable` e `not_found`:** os textos genéricos de hoje.
  - Anúncio: `"CardTroca — Carta à venda"` e `"Troque, compre e anuncie cartas Pokémon TCG com pessoas próximas."`.
  - Perfil: `"CardTroca — Perfil de colecionador"` e o mesmo texto.

- [ ] **Passo 1: testes que falham.** Um caso por regra acima, incluindo troca, sem preço, sem imagem e sem avaliações.
- [ ] **Passo 2:** rodar os testes. Esperado: FAIL.
- [ ] **Passo 3:** escrever `og.ts`.
- [ ] **Passo 4:** rodar os testes. Esperado: PASS.
- [ ] **Passo 5:** commit `feat(publico): textos da prévia do link`.

---

### Tarefa 6: visual do app e peças compartilhadas

**Arquivos:**
- Criar:
  - `app/(app-look)/layout.tsx`: Poppins pelo `next/font/google`, com pesos 400, 500 e 600 e a variável `--font-poppins`; `<link>` do Material Symbols Rounded do Google Fonts; contêiner `className="app-look"`.
  - `app/(app-look)/app-look.css`: tokens como variáveis CSS dentro de `.app-look`, e as classes `.app-card` (cantos 22, sombra suave, fundo branco) e `.ms` (ícone).
  - `components/public/Icon.tsx`: `Icon({ name, size?, filled? })`.
  - `components/public/AppBanner.tsx`: faixa fixa "Baixar" do celular.
  - `components/public/CircleButton.tsx`: botão redondo branco de 38 px.
  - `components/public/ShareButton.tsx`: `navigator.share`, e sem ele copia o link com um aviso "Link copiado".
  - `components/public/TiltCard.tsx`, cliente: inclinação, brilho e balanço.
  - `components/public/CardImage.tsx`: imagem com cantos de 6 px e a reserva com a pokébola apagada quando `url` é nulo ou a imagem falha.
  - `components/public/ListingTileCard.tsx`: o `ListingGridTile` compacto do app.
- Mover: `app/card/[cardId]/` e `app/profile/[userId]/` para dentro de `app/(app-look)/`. As URLs não mudam.

**Interfaces que esta tarefa produz:**
- `TiltCard({ src: string | null, alt: string, width: number })`
  - Inclina até 8° com `deviceorientation` (beta e gamma relativos à primeira leitura; a referência acompanha devagar, com fator 0,02, como `device_tilt.dart`) ou com o mouse sobre o palco.
  - Faixa de brilho branca: `linear-gradient(115deg, transparent 38%, rgba(255,255,255,.38) 50%, transparent 62%)` com opacidade 0,55, deslocada pela inclinação.
  - Balanço com seno quando parado.
  - Com `prefers-reduced-motion: reduce`, nada se move.
  - No iOS, pede a permissão do giroscópio (`DeviceOrientationEvent.requestPermission`) no primeiro toque no palco.
- `ListingTileCard({ tile: ListingTile, href: string | null, showPrice: boolean, showEye: boolean, onGate: (origin: string) => void })`
- `AppBanner({ onGate })`, `CircleButton({ icon, label, onClick })` e `ShareButton({ url, title })`

- [ ] **Passo 1:** escrever o layout, o CSS e os componentes. Copiar medidas e cores dos protótipos (`anuncio.html` e `perfil.html`), que já usam os valores do app.
- [ ] **Passo 2:** conferir que o resto do site não mudou: `npm run build` e, com `PUBLIC_PAGES_FIXTURES=true npm run dev`, abrir `/` e `/funcionalidades` e confirmar que continuam em Inter.
- [ ] **Passo 3:** `npm run lint && npx vitest run && npm run build`. Esperado: verde.
- [ ] **Passo 4:** commit `feat(publico): visual do app e peças compartilhadas`.

---

### Tarefa 7: janela "Continue no app"

**Arquivos:**
- Criar:
  - `components/public/AppGate.tsx`, cliente: `AppGateProvider` e o hook `useAppGate()`.
  - `components/public/AppGateContent.tsx`: cabeçalho, lista de recursos e botões.

**Interfaces:**
- `AppGateProvider({ subject, path, children })`
  - `subject`: `{ kind: "listing"; imageUrl: string | null } | { kind: "profile"; name: string; avatarUrl: string | null; initial: string }`.
  - `path`: `"/card/<id>"` ou `"/profile/<id>"`.
- `useAppGate(): (origin: string) => void`: abre a janela e chama `trackPublic("web_app_gate_opened", { origin })`.

**Comportamento:**
- **Celular** (largura menor que 768 px): folha que sobe de baixo, com cantos de 24 e alça; fecha com toque fora, arrasto para baixo ou Esc.
- **Computador:** janela central de 740 px, com X, Esc e toque fora; à direita, `QRCodeSVG` de `qrcode.react` com o valor `https://cardtroca.com${path}` e o texto "Aponte a câmera do celular" / "para baixar o app e abrir este anúncio" (ou "este perfil").
- **Textos e lista de recursos:** exatamente os da seção "Janela 'Continue no app'" da spec. No perfil, Notificações vem primeiro.
- **Botões das lojas:**
  - URLs `APP_STORE_URL` e `PLAY_STORE_URL` de `lib/site.ts`;
  - ordem por `storeOrder(platformOf(navigator.userAgent))`;
  - `target="_blank"` no computador;
  - cada clique chama `trackPublic("web_store_clicked", { store, page })`.
- **"Já tenho o app · Abrir":** só no celular.
  - Android: `href={androidIntentUrl(path)}`.
  - iOS dentro de navegador interno: troca o link pelo texto "Toque em ⋯ e escolha Abrir no navegador".
  - iOS no Safari: link para o próprio `path`. A Smart App Banner da Tarefa 10 resolve.
- **Acessibilidade:** `role="dialog"`, `aria-modal`, foco preso dentro e devolvido a quem abriu.

- [ ] **Passo 1:** escrever os dois componentes.
- [ ] **Passo 2:** checar os dois formatos com o verificador de navegador (preview em 375 px e em 1280 px) numa página temporária que monte o provider com dados fixos. Apagar a página antes do commit.
- [ ] **Passo 3:** `npm run lint && npx vitest run && npm run build`. Esperado: verde.
- [ ] **Passo 4:** commit `feat(publico): janela Continue no app com QR code`.

---

### Tarefa 8: página do anúncio

**Arquivos:**
- Modificar: `app/(app-look)/card/[cardId]/page.tsx`, reescrito.
- Criar: em `components/public/listing/`:
  - `PriceCard.tsx`
  - `SellerCard.tsx`
  - `NotesCard.tsx`
  - `MarketPricesTeaser.tsx`, cliente: bloco que abre e fecha, com o conteúdo falso desfocado.
  - `CardSpecs.tsx`, cliente: bloco que abre e fecha.
  - `MoreFromSeller.tsx`
  - `FloatingCta.tsx`, cliente
  - `Gallery.tsx`, cliente: deslizar, miniaturas, "1 de N" e etiqueta "Imagem oficial" ou "Foto do vendedor", usando `TiltCard` na imagem atual.
  - `ListingUnavailable.tsx`
  - `ViewTracker.tsx`, cliente: `trackPublic` no mount.

**Interfaces:**
- Usa: `getListingPage`, `listingOg` e todos os componentes das Tarefas 6 e 7.
- A página exporta `revalidate = 60` e `generateMetadata`, que usa `listingOg` mais `robots: { index: false, follow: true }`, `openGraph.url` e `twitter.card = "summary_large_image"`.
- `not_found` chama `notFound()` do Next.

**Layout:** igual ao `anuncio.html` e à seção "Anúncio" da spec, com estas diferenças:
- sem a pílula "abaixo da média" e sem "Média de mercado";
- sem distância: a linha de local mostra "Cidade, UF" e "Localização do vendedor";
- vendedor sem medalha: estrelas e "nota · N avaliações", ou "Sem avaliações ainda";
- Ficha da carta segue as regras de `_DetailsSection` (`presentation/screens/library/card_detail_screen.dart`, a partir da linha 1259 no app), com `rarityLabel` e `languageLabel`.

**Pontos de ação e a origem que cada um registra:**

| Ponto de ação | Origem |
|---|---|
| Olho | `"watch"` |
| Bloco de preço de mercado | `"market_prices"` |
| Barra flutuante (Conversar / Propor troca) | `"chat"` |
| Faixa "Baixar" | `"banner"` |
| Botão "Baixar o app" do menu | `"nav"` |

**Computador** (a partir de 1024 px): grade `1fr 460px`.
- À esquerda, o palco fixo com `TiltCard` de 330 px.
- À direita, nesta ordem: card de preço, barra "Conversar" estática, vendedor, observações, Preços de mercado (aberto por padrão), Ficha.
- Embaixo, Mais cartas.
- No topo, o `Navigation` do site.

**Indisponível:** `ListingUnavailable` com "Este anúncio não está mais disponível", o `SellerCard` (se houver), `MoreFromSeller` e os botões das lojas.

- [ ] **Passo 1:** escrever os componentes e a página.
- [ ] **Passo 2:** com `PUBLIC_PAGES_FIXTURES=true npm run dev`, abrir cada fixture de anúncio em 360 px e em 1280 px:
  - venda;
  - troca: aparecem "Propor troca" e "Aceita propostas";
  - sem preço: aparece "A combinar";
  - sem imagem: aparece a reserva;
  - nome de 60 caracteres: quebra a linha sem estourar;
  - vendido: aparece a tela de indisponível;
  - banido: indisponível, sem card do vendedor;
  - `/card/abc`: 404.
- [ ] **Passo 3:** comparar a tela de 360 px com `anuncio.html` lado a lado. Fonte, raios, sombras e cores têm que bater.
- [ ] **Passo 4:** no `curl` do HTML da fixture de venda, conferir que não aparecem `latitude`, `email`, `market_price`, `"abaixo da média"` nem `"Média de mercado"`: `curl -s localhost:3000/card/<id> | grep -Ei "latitude|email|market_price|abaixo da m|Média de mercado"` não deve imprimir nada.
- [ ] **Passo 5:** `npm run lint && npx vitest run && npm run build`. Esperado: verde.
- [ ] **Passo 6:** commit `feat(publico): página do anúncio igual ao app`.

---

### Tarefa 9: página do perfil

**Arquivos:**
- Modificar: `app/(app-look)/profile/[userId]/page.tsx`, reescrito.
- Criar: em `components/public/profile/`:
  - `ProfileHeader.tsx`
  - `StatsCard.tsx`
  - `ProfileTabs.tsx`, cliente: pílula deslizante, contagem, Filtrar e grade.
  - `ProfileNotFound.tsx`

**Interfaces:**
- Usa: `getProfilePage`, `profileOg`, `ListingTileCard` e `useAppGate`.
- A página exporta `revalidate = 60`, `generateMetadata` (com `profileOg` e `robots` noindex) e `notFound()` para `not_found`.

**Layout:** igual ao `perfil.html` e à seção "Perfil" da spec, sem a linha "seguidores · seguindo" embaixo do nome e sem medalha.

**`StatsCard`:** quatro itens, nesta ordem:
1. ★ com `ratingText(...).value` e o rótulo dela;
2. `totalReviews` com o rótulo "comentários", em verde e com 500 de peso. Abre a janela com a origem `"reviews"`;
3. `followers` com o rótulo "seguidores", em verde e com 500 de peso. Abre a janela com a origem `"followers"`;
4. `totalTrades` com o rótulo "trocas", em cinza.

**Pontos de ação:**
- Seguir: `"follow"`.
- Filtrar: `"filter"`. Só aparece na aba À venda.
- Olho do tile: `"watch"`.
- Tile da coleção: `"collection"`.
- Tile à venda: `href="/card/<id>"`.

**Computador** (a partir de 1024 px): coluna fixa de 340 px com o topo; grade de 5 colunas à direita; abas fixas abaixo do menu.

- [ ] **Passo 1:** escrever os componentes e a página.
- [ ] **Passo 2:** com as fixtures, abrir em 360 px e 1280 px:
  - perfil normal: as abas trocam e a contagem fica certa;
  - sem avaliações: aparecem "—" e "Sem avaliações";
  - bio longa: corta em 3 linhas;
  - excluído: 404;
  - banido: 404;
  - `/profile/xyz`: 404.
- [ ] **Passo 3:** comparar com `perfil.html` em 360 px.
- [ ] **Passo 4:** rodar o mesmo `curl | grep` da Tarefa 8 em `/profile/<id>`. Não deve imprimir nada.
- [ ] **Passo 5:** `npm run lint && npx vitest run && npm run build`. Esperado: verde.
- [ ] **Passo 6:** commit `feat(publico): perfil público igual ao app`.

---

### Tarefa 10: limpeza, Smart App Banner e checklist do celular

**Arquivos:**
- Apagar: `components/DeepLinkGate.tsx`. Antes, conferir com `grep -r DeepLinkGate` que não sobrou uso.
- Modificar: as duas páginas. Em `generateMetadata`, `other: { "apple-itunes-app": \`app-id=${APP_STORE_ID}, app-argument=https://cardtroca.com${path}\` }` sobrescreve a meta global só nessas rotas.
- Criar: `docs/superpowers/plans/2026-10-31-perfil-publico-web-checklist.md`, com a lista de testes manuais abaixo para o Lux rodar depois do deploy.

**Testes manuais** (precisam do deploy e de aparelhos):
1. iPhone sem o app: link no WhatsApp e no Safari. A página carrega, a carta inclina depois do toque e a janela mostra a App Store primeiro.
2. iPhone com o app: o mesmo link abre o app direto no anúncio. A Smart App Banner, com "Abrir", leva ao anúncio certo. Se levar à home do app, anotar; a spec já prevê o texto alternativo.
3. Android sem o app: a página e o Google Play primeiro. Com o app: abre direto, e o "Já tenho o app" (intent) abre o anúncio.
4. Instagram (navegador interno): no iOS aparece a dica "Abrir no navegador"; no Android o intent abre o app.
5. Prévia no WhatsApp mostra a foto, o nome e o preço. Testar um anúncio de foto do vendedor e outro só com imagem oficial.
6. Computador: o QR lido pelo celular abre o app ou a página.
7. Amplitude: com os cookies aceitos aparecem os eventos `web_*`; com os cookies recusados, nenhum.

- [ ] **Passo 1:** apagar o `DeepLinkGate` e ajustar o metadata.
- [ ] **Passo 2:** escrever o checklist.
- [ ] **Passo 3:** `npm run lint && npx vitest run && npm run build`. Esperado: verde.
- [ ] **Passo 4:** commit `chore(publico): remove DeepLinkGate e liga a Smart App Banner ao link`.
- [ ] **Passo 5:** avisar o Lux:
  - a branch está pronta, sem push;
  - antes do deploy, ele precisa conferir `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` em Production na Vercel;
  - depois do deploy, rodar o checklist do celular.
