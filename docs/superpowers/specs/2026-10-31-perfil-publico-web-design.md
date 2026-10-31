# Anúncio e perfil público na web

## Intenção

No app, o usuário compartilha o link de um anúncio
(`https://cardtroca.com/card/<id>`) ou do próprio perfil
(`https://cardtroca.com/profile/<id>`). Quem recebe e **tem o app** já cai
direto no app (Universal Links / App Links). Quem **não tem o app** hoje vê
só uma tela "Baixe o CardTroca" (`components/DeepLinkGate.tsx`), sem a carta
nem o perfil. A pessoa não sabe o que está perdendo.

O Lux quer que essa pessoa veja na web **a mesma tela que o app mostra**:
a carta, o preço, o vendedor e as outras cartas. Quando ela quiser conversar
ou fazer qualquer ação de negociação, aparece uma explicação de que isso fica
no app, com os botões da App Store e do Google Play.

**Restrição principal:** nenhuma versão nova do app. Tudo sai só publicando o
site `cardtroca.com` (este repo, Next.js na Vercel).

## Por que funciona sem mexer no app

- O app já compartilha `https://cardtroca.com/card/<user_card_id>`
  (detalhe do anúncio, feed, biblioteca) e
  `https://cardtroca.com/profile/<user_id>`.
- iOS: entitlement `applinks:cardtroca.com` e o AASA servido em
  `/.well-known/apple-app-site-association` casa `/*`.
- Android: intent-filter `autoVerify` para `https://cardtroca.com` e o
  `assetlinks.json` publicado.
- Com o app instalado, o sistema abre o app antes de a página carregar.
  O site só é carregado por quem não tem o app, pelo computador, ou por
  navegadores internos que ignoram Universal Links (Instagram e às vezes o
  do WhatsApp).
- Os `.well-known` são reescritos para uma edge function do Supabase
  (`vercel.json`). Não mexer nisso.

## Objetivos

1. `/card/[cardId]` mostra o anúncio igual ao detalhe do app
   (`frontend/cardtroca/lib/presentation/screens/library/card_detail_screen.dart`).
2. `/profile/[userId]` mostra o perfil público igual ao app
   (`public_profile_screen.dart`, `profile_header.dart`,
   `profile_card_list.dart` em `frontend/cardtroca/lib/features/profile/`).
3. Toda ação de negociação abre a explicação "Continue no app" com os botões
   das lojas.
4. Versão para celular e versão para computador.
5. A prévia do link no WhatsApp/iMessage mostra a foto da carta, o nome e o
   preço (anúncio), ou o nome e a foto (perfil).

## Fora do escopo

- Comprar, carrinho, ofertas, seguir, chat ou login pela web.
- Mudança no app, no banco ou em edge function. Se algo exigir isso, parar e
  falar com o Lux.
- Medalha de negociante (`trader_medal`): ainda não está liberada para todos.
  Na web aparece sempre a versão sem medalha (ver abaixo).
- Indexar essas páginas no Google. As páginas mantêm
  `robots: { index: false, follow: true }`, que já estão no trabalho local de
  SEO.

## O que seria um fracasso mesmo funcionando

- Página que não parece o app: outra fonte, outras cores, outro layout. O
  primeiro protótipo errou exatamente nisso e o Lux reprovou.
- Expor dado pessoal: e-mail, telefone, CPF, endereço, latitude/longitude ou
  qualquer coluna que o app não mostra no perfil público.
- Mostrar preço de mercado real na web. O bloco de preço de mercado é
  desfocado de propósito e serve de isca para baixar o app.
- Quebrar a abertura direta no app de quem já tem o app.

## Protótipos aprovados

Em `docs/superpowers/specs/2026-10-31-perfil-publico-web/`:

- `anuncio.html`: anúncio, celular e computador.
- `perfil.html`: perfil público, celular e computador.

Abrir no navegador. Os dois têm as janelas de download clicáveis. Os números,
nomes e textos são de exemplo.

## Visual: igual ao app

As duas páginas usam o visual do app, não o do resto do site:

- Fonte Poppins com pesos 400, 500 e 600 (nada em 700). O resto do site
  continua em Inter.
- Cores de `frontend/cardtroca/lib/core/theme/app_theme.dart` (tema claro):
  fundo `#F5F6F6`, superfície `#FFFFFF`, superfície variante `#EEF0F0`,
  primária `#029779`, primária clara `#E6FAF4`, primária escura `#104E4B`,
  texto `#11161D` / `#586572` / `#8A95A2`, borda `#E3E6E6`, ouro `#D98E04`.
- Blocos brancos com cantos de 22 px e a sombra suave do app
  (`0 8px 24px -8px rgba(0,0,0,.06)`), sem borda.
- Ícones Material Rounded, os mesmos do app.

Decisão minha: aplicar tokens e fonte só nessas rotas (layout próprio ou
classe no contêiner) para não mexer no resto do site. Tema escuro fica fora
desta entrega. As páginas são sempre claras, mesmo que o resto do site siga o
sistema.

## Anúncio: `/card/[cardId]`

### Celular (de cima para baixo)

1. **Faixa fixa "Baixar"** (só existe na web): ícone do app, "CardTroca",
   "Grátis na App Store e Google Play" e o botão "Baixar", que abre a janela de
   download.
2. **Palco da carta:** fundo em degradê radial do branco para `#F5F6F6`,
   imagem com cantos de 6 px e sombra. Etiqueta "Imagem oficial" ou "Foto do
   vendedor" no canto de baixo à esquerda. Botões redondos brancos de 38 px no
   canto de cima à direita: olho (abre a janela de download) e compartilhar
   (Web Share API, com cópia do link como alternativa).
   - Ordem das imagens igual ao app: `photo_url`, `photo_url_2` e a imagem
     oficial da carta. Com mais de uma imagem, a galeria desliza e mostra
     miniaturas e "1 de 3".
   - **Animação:** a carta inclina até cerca de 8° com o giroscópio
     (`DeviceOrientationEvent`) no celular e com o mouse no computador, com uma
     faixa de brilho branca que acompanha a inclinação. É a mesma do
     visualizador da coleção do app (`card_viewer_scaffold.dart`,
     `device_tilt.dart`). Parado, a carta balança devagar. Respeitar
     `prefers-reduced-motion`: sem balanço e sem inclinação. No iOS o
     giroscópio exige permissão por gesto; sem a permissão, fica só o balanço.
3. **Card de preço** (`_PriceSection`): nome (22/600), "Coleção · número",
   pílulas (condição com a cor do app, idioma, graduação se houver, status
   "Venda" / "Troca" / "Venda e Troca"), "Preço pedido" em 32/600 preto
   ("A combinar" sem preço), divisor e cidade/UF do vendedor com o ícone
   `near_me`. Sem distância, porque a web não sabe onde o visitante está.
   - Pílula "R$ X abaixo/acima da média" e a linha "Média de mercado": **não
     mostrar**, porque usam preço de mercado. Decisão minha, em linha com o
     blur. Os protótipos ainda mostram a pílula; vale a spec.
4. **Card do vendedor** (`_SellerSection`): avatar de 52 px (foto ou
   inicial), nome, selo do plano (Free cinza; plano pago verde-escuro com
   estrela; Leiloeiro com martelo), cidade, estrelas com "nota · N avaliações"
   ("Sem avaliações ainda" quando zero) e seta. Toque leva a
   `/profile/<user_id>`. Sem medalha.
5. **Observações do vendedor**, se houver `notes`.
6. **Preços de mercado**, um bloco que abre e fecha (`ExpandableSectionCard`):
   ícone `bar_chart`, "Preços de mercado", "CardTroca, Liga Pokémon,
   TCGplayer e eBay". Ao abrir, aparece um conteúdo **falso e desfocado**
   (linhas de fonte e barras) com a pílula "🔒 Histórico de preço no app".
   Tocar em qualquer parte abre a janela de download. Nenhum preço real vai
   para o HTML.
7. **Ficha da carta**, outro bloco que abre e fecha, com dados reais e
   públicos: Pokémon, coleção, número, HP, código, idioma, condição,
   raridade, variante e graduação (mesmas regras de `_DetailsSection`).
8. **"Mais cartas de <primeiro nome>"** (só na web): até 12 outros anúncios
   à venda do mesmo vendedor (status `sale` ou `both`, mais caros primeiro,
   tirando o atual), no visual do `ListingGridTile`. "Ver perfil" leva a
   `/profile/<user_id>`. Cada carta leva a `/card/<id>`. Sem outros anúncios,
   a seção não aparece.
9. **Barra flutuante de vidro** (`_FloatingCta`): "Preço pedido" e o valor à
   esquerda, e à direita o botão "Conversar" (ícone `chat_bubble_outline`,
   48 px de altura, cantos de 18). Anúncio só de troca: "Anúncio para troca",
   "Aceita propostas" e o botão "Propor troca" (ícone `swap_horiz`). **Nenhum
   botão de comprar nem de carrinho.** O botão abre a janela de download.

### Computador

O mesmo conteúdo em duas colunas: à esquerda, um palco grande e fixo com a
carta (cerca de 330 px de largura), o olho e o compartilhar; à direita, o card
de preço, a barra "Conversar", o vendedor, as observações, Preços de mercado
(aberto) e a Ficha da carta. "Mais cartas" ocupa a largura toda embaixo. No
topo, o menu do site com "Baixar o app".

### Anúncio que não está disponível

Id inexistente, anúncio removido, `status` igual a `collection` ou
`unavailable`, ou vendido: mostrar "Este anúncio não está mais disponível",
o card do vendedor (se ele existir) e "Mais cartas de...", mais um botão para
baixar o app. Responder com HTTP 404 quando o id não existir.

## Perfil: `/profile/[userId]`

### Celular

1. Faixa "Baixar", igual à do anúncio.
2. Botão redondo de compartilhar no canto de cima à direita. Na web não há
   botão Voltar.
3. **Topo** (`ProfileHeader`, na versão sem medalha): avatar de 92 px com
   aro branco (foto ou inicial em fundo `#104E4B`), nome (22/600), selo do
   plano, cidade/UF, bio (até 3 linhas) e o botão "Seguir" em pílula
   verde-escura de 46 px, que abre a janela de download.
4. **Card de números** (`ProfileStatsCard`), com quatro itens separados por
   linhas finas:
   - ★ nota com "avaliação" ("—" e "Sem avaliações" quando zero);
   - quantidade de avaliações com o rótulo "comentários", em verde (abre a
     janela de download);
   - seguidores, em verde (abre a janela de download);
   - trocas (`total_trades`), só o número.

   O Lux pediu esses quatro. Vendas não aparece.
5. **Abas** em pílula deslizante: "À venda · N" e "Coleção · N". As abas
   funcionam na web.
   - À venda: `status` igual a `sale` ou `both`, mais caros primeiro.
   - Coleção: `status` igual a `collection`, mais caros primeiro.
   - Mesma regra de `get_public_profile_usecase.dart`.
6. Linha com "N cartas" e "Filtrar". O Filtrar abre a janela de download e
   só aparece na aba À venda.
7. **Grade de 3 colunas** no visual do `ListingGridTile` compacto: imagem
   63:88, pílula do idioma, olho (abre a janela de download), nome, preço e
   coleção. A coleção não mostra preço. Na aba À venda, cada carta leva a
   `/card/<id>`. Na aba Coleção, tocar abre a janela de download.

### Computador

O topo do perfil vira uma coluna fixa de cerca de 340 px à esquerda. À
direita ficam as abas, a contagem e uma grade de 5 colunas.

### Perfil inexistente

"Perfil não encontrado" com o botão de baixar o app e HTTP 404.

## Janela "Continue no app"

Um componente só, usado em todos os pontos de ação.

- **Celular:** folha que sobe de baixo, com cantos de 24 e a alça.
- **Computador:** janela no centro com fundo escurecido. À direita, um QR
  code de verdade que aponta para a mesma URL da página. Lido no celular, a
  URL abre o app se ele estiver instalado, ou cai nesta mesma página com os
  botões das lojas.
- **Cabeçalho:**
  - anúncio: miniatura inclinada da carta, "Continue no app do CardTroca" e
    "É grátis. Este anúncio abre direto no app.";
  - perfil: avatar, "Siga <primeiro nome> no app do CardTroca" e "É grátis.
    Este perfil abre direto no app.".
- **Lista "só no app"** (ícone em caixa verde-clara):
  - Chat com o vendedor: "Combine preço, troca e entrega";
  - Histórico de preço: "CardTroca, Liga Pokémon, TCGplayer e eBay";
  - Notificações: "Aviso quando o preço baixar ou chegar oferta". No perfil,
    "Aviso quando <nome> anunciar uma carta nova", e esse item vem primeiro;
  - E mais: "Troca, pagamento protegido, sua coleção".
- **Botões:** App Store e Google Play, usando `APP_STORE_URL` e
  `PLAY_STORE_URL` de `lib/site.ts`. No celular, o sistema detectado vem
  primeiro. Abrir em nova aba no computador.
- **"Já tenho o app · Abrir"**, só no celular, para quem caiu no navegador
  interno do Instagram ou do WhatsApp:
  - Android: link `intent://cardtroca.com<path>#Intent;scheme=https;package=io.cardtroca;S.browser_fallback_url=<url da loja>;end`.
    Abre o app com o mesmo link HTTPS, que o app já trata.
  - iOS: um toque num link do mesmo domínio não dispara o Universal Link.
    Ver "Pontos a verificar".
- Fechar a janela: tocar fora, arrastar a folha para baixo, X ou Esc. Foco
  preso dentro dela enquanto estiver aberta, por acessibilidade.

## Prévia do link (Open Graph)

- **Anúncio:** `og:title` "<nome da carta> · R$ <preço>" ("Troca" quando o
  anúncio for só de troca), `og:description` "Coleção · condição · Cidade/UF
  no CardTroca", `og:image` a primeira imagem da galeria. Se a imagem não
  servir para o WhatsApp (formato ou tamanho), gerar uma imagem de 1200×630
  com `next/og`, com a carta sobre o fundo do app.
- **Perfil:** `og:title` "<nome> no CardTroca", `og:description` "N cartas à
  venda · ★ nota", `og:image` o avatar ou uma imagem gerada com a inicial.
- Página indisponível: textos genéricos que já existem hoje.
- Sem `og:image` com dado sensível.

## Dados

- **Hoje:** o site lê o Supabase no servidor com `SUPABASE_URL` e
  `SUPABASE_SERVICE_ROLE_KEY` (`lib/supabase.ts`). Esta entrega usa o mesmo
  acesso, só em Server Components ou rotas do servidor, e a chave nunca vai
  para o cliente. Nada novo no banco.
- **Tabelas que o app lê:**
  - anúncio: `user_cards` com `cards`, `card_printings` e `user_profiles`
    (`card_repository.dart`, `getUserCardById`);
  - perfil: `user_profiles` e `user_cards` do usuário (`profile_repository.dart`).
- **Colunas:** listar uma a uma no `select`, nunca `*`. Só o que a tela
  usa:
  - anúncio: imagens, preço, condição, idioma, status, variante, raridade,
    graduação e observações;
  - carta: nome, Pokémon, coleção, número, HP, código e imagem oficial;
  - vendedor: id, nome, avatar, cidade, UF, bio, plano, beta, nota, total de
    avaliações, seguidores e trocas.
- **Fora do HTML:** e-mail, telefone, documento, endereço, coordenadas,
  carteira e qualquer coisa de pedido.
- **Nomes:** o mapeamento de `_mapFromSupabase` e do `UserModel` no app
  mostra como os campos se chamam no banco. Conferir lá em vez de adivinhar.
- **Cache:** ISR ou `revalidate` curto (sugestão: 60 s). O preço precisa
  ficar razoavelmente atual.
- **Usuário excluído ou banido** (`user_profiles.deleted_at` preenchido ou
  `is_banned`, os mesmos filtros das RPCs do app): tratar como perfil
  inexistente, e o anúncio dele como indisponível.
- **Vendido:** o anúncio fica com `status='unavailable'` e `sold_at`
  preenchido, e cai em "Anúncio que não está disponível".
- **Fotos:** `photo_url` já é URL pública (gravada pela `upload-card-photo`).
- Se o acesso por service role não estiver configurado na Vercel de
  produção, avisar o Lux. Não criar view nem RPC por conta própria
  (regra zero do CardTroca).

## Medição

Disparar eventos no Amplitude, que já está no site e respeita o banner LGPD.
Sugestão de nomes:

- `web_listing_viewed` e `web_profile_viewed`;
- `web_app_gate_opened`, com a origem (`chat`, `market_prices`, `follow`,
  `watch`, `filter`, `banner`, ...);
- `web_store_clicked`, com `ios` ou `android` e a página.

## Limpeza

- `DeepLinkGate` e o redirecionamento para `cardtroca://...` saem: o scheme
  está errado (o do app é `io.cardtroca`) e o app não trata carta por scheme.
- `AppStoreBadgeButton` pode ser reaproveitado ou trocado pelo botão preto
  dos protótipos.

## Pontos a verificar na implementação

1. **"Abrir no app" no iOS:** testar se a Smart App Banner nativa (meta
   `apple-itunes-app`, já no layout) com `app-argument=<url da página>`
   aparece e abre o app no anúncio certo. O `app_links` precisa receber a URL
   pelo `openURL`. Se não abrir no lugar certo, no iOS o "Já tenho o app"
   vira a dica "Toque em ⋯ e escolha Abrir no navegador" quando o site
   detectar navegador interno (Instagram/FBAN/FBAV no user agent).
2. **App instalado + link aberto no Safari, Chrome e WhatsApp:** confirmar
   que continua abrindo o app direto (iOS e Android).
3. **Prévia no WhatsApp** com a imagem da carta.
4. **Cartas sem imagem oficial:** usar a mesma reserva do app (ícone com a
   pokébola apagada).

## Entrega

- Branch `perfil-publico-via-web` neste repo. Ela já contém o trabalho local
  de SEO e design ainda não publicado, e o Lux decidiu publicar tudo junto.
  Primeiro commit da branch: esse trabalho de SEO/design sozinho. Depois vêm
  os commits da feature, para o histórico separar uma coisa da outra.
- Nada no repo CardTroca precisa mudar. A branch de mesmo nome lá fica vazia
  ou é apagada.
- `npm run lint` e `npm run build` verdes antes do commit.
- Testar em celular de verdade (iOS e Android) sem o app e com o app, e no
  computador.
- O deploy é com o Lux.
