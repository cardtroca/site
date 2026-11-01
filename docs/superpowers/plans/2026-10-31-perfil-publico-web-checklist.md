# Checklist do celular: perfil e anúncio públicos

Para o Lux rodar depois do deploy, com aparelhos reais.

1. [ ] **iPhone sem o app:** link no WhatsApp e no Safari. A página carrega, a carta inclina depois do toque e a janela mostra a App Store primeiro.
2. [ ] **iPhone com o app:** o mesmo link abre o app direto no anúncio. A Smart App Banner, com "Abrir", leva ao anúncio certo. Se levar à home do app, anotar; a spec já prevê o texto alternativo.
3. [ ] **Android sem o app:** a página e o Google Play primeiro. Com o app: abre direto, e o "Já tenho o app" (intent) abre o anúncio.
4. [ ] **Instagram (navegador interno):** no iOS aparece a dica "Abrir no navegador"; no Android o intent abre o app.
5. [ ] **Prévia no WhatsApp** mostra a foto, o nome e o preço. Testar um anúncio de foto do vendedor e outro só com imagem oficial.
6. [ ] **Computador:** o QR lido pelo celular abre o app ou a página.
7. [ ] **Amplitude:** com os cookies aceitos aparecem os eventos `web_*`; com os cookies recusados, nenhum.

## Antes do deploy

- Conferir `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` em Production na Vercel.

## Limitações conhecidas

1. Sob `next start`, o corpo HTML do 404 vem vazio no servidor (o conteúdo chega pelo payload RSC; o status 404 está correto). É comportamento do Next 14.2 com ISR + `notFound()`. Rever depois de atualizar o Next.
2. O banner de cookies do site fica fora de `.app-look` e segue o tema do site: pode aparecer escuro à noite nestas páginas claras.
3. `PUBLIC_PAGES_FIXTURES` deve ficar sem definir na Vercel em Production.
4. Se o Supabase cair no primeiro acesso a um anúncio ou perfil que ainda não está no cache do ISR, o visitante vê a página 500 padrão do Next, não a tela de erro do app. No Next 14.2, o `error.tsx` não pega erro de render do servidor em rota ISR. Páginas que já estão no cache continuam sendo servidas.
5. A aba Coleção do perfil é ordenada no banco por `order("cards(market_price_brl)")` (`lib/public/source.ts`), recurso do PostgREST 11+. Isso não pôde ser testado contra o PRD. Se `/profile/<id>` der 500 logo depois do deploy, apague essa linha de `.order(...)`: o `data.ts` reordena do mesmo jeito. Só o corte de 300 cartas deixa de pegar as mais caras.
