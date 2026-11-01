# SharedLinks — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar páginas web para `/profile/:userId` e `/card/:cardId` que tentam abrir o app CardTroca via deep link e, se não conseguirem, exibem uma tela de download.

**Architecture:** Cada rota é uma Server Component do Next.js que exporta metadata dinâmica (OG tags) e renderiza um Client Component responsável pelo deep link attempt. O Client Component tenta abrir `cardtroca://<path>` via `window.location.href`, espera ~2s e, se a página ainda estiver visível, exibe os botões de download. Não há chamadas a banco de dados — as páginas são estáticas com lógica client-side.

**Tech Stack:** Next.js 14 App Router (TypeScript), Tailwind CSS, componentes `AppStoreBadgeButton` já existentes, Vercel (deploy automático).

## Global Constraints

- Branch: `SharedLinks` (já criada)
- Apenas arquivos do projeto `SIte - CardTroca` devem ser tocados
- Store URLs já definidas em `components/AppStoreBadgeButton.tsx` — reusar, não duplicar
- Deep link scheme: `cardtroca://`
- App Store: `https://apps.apple.com/br/app/cardtroca/id6779094214`
- Play Store: `https://play.google.com/store/apps/details?id=io.cardtroca&pcampaignid=web_share`
- Sem backend, sem banco de dados, sem autenticação
- Seguir padrão visual do site (Tailwind `ds-*` tokens, `glass`, `Button`, `AppStoreBadgeButton`)
- Sem comentários desnecessários no código

---

## File Structure

```
app/
  profile/
    [userId]/
      page.tsx          ← Server Component: metadata + renderiza DeepLinkGate
  card/
    [cardId]/
      page.tsx          ← Server Component: metadata + renderiza DeepLinkGate

components/
  DeepLinkGate.tsx      ← Client Component: lógica de deep link + tela de fallback
```

---

### Task 1: Componente `DeepLinkGate`

**Files:**
- Create: `components/DeepLinkGate.tsx`

**Interfaces:**
- Produces: `<DeepLinkGate deepLink="cardtroca://profile/abc123" />` — prop `deepLink: string`

- [ ] **Step 1: Criar o arquivo `components/DeepLinkGate.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AppStoreBadgeButton } from "@/components/AppStoreBadgeButton";

interface DeepLinkGateProps {
  deepLink: string;
}

export function DeepLinkGate({ deepLink }: DeepLinkGateProps) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Tenta abrir o app
    window.location.href = deepLink;

    // Se a página continuar visível após 2s, o app não abriu
    const timer = setTimeout(() => {
      setShowFallback(true);
    }, 2000);

    // Se o usuário sair da página (app abriu), cancela o timer
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timer);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [deepLink]);

  if (!showFallback) {
    return (
      <main className="min-h-screen bg-ds-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-ds-text-secondary text-sm">Abrindo o CardTroca…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ds-bg flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-8 text-center max-w-sm">
        <Image
          src="/logo-vertical-1.svg"
          alt="CardTroca"
          width={160}
          height={96}
          className="h-16 w-auto"
          priority
          unoptimized
        />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-ds-text-primary">
            Baixe o CardTroca
          </h1>
          <p className="text-ds-text-secondary text-base leading-relaxed">
            Marketplace de cartas Pokémon TCG. Troque, compre e anuncie com pessoas próximas.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <AppStoreBadgeButton store="apple" />
          <AppStoreBadgeButton store="google" />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verificar que o arquivo foi salvo sem erros de TypeScript**

```bash
cd "/Users/lux/development/SIte - CardTroca" && npx tsc --noEmit 2>&1 | head -30
```

Expected: nenhum erro relacionado a `DeepLinkGate.tsx`.

- [ ] **Step 3: Commit**

```bash
cd "/Users/lux/development/SIte - CardTroca"
git add components/DeepLinkGate.tsx
git commit -m "feat: add DeepLinkGate client component for app deep link fallback"
```

---

### Task 2: Página `/profile/:userId`

**Files:**
- Create: `app/profile/[userId]/page.tsx`

**Interfaces:**
- Consumes: `DeepLinkGate` de `@/components/DeepLinkGate` com prop `deepLink: string`
- Produces: rota `/profile/:userId` no Next.js

- [ ] **Step 1: Criar `app/profile/[userId]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { DeepLinkGate } from "@/components/DeepLinkGate";

interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  return {
    title: "Perfil | CardTroca",
    description: "Veja o perfil deste colecionador no CardTroca — marketplace de cartas Pokémon TCG.",
    openGraph: {
      title: "CardTroca — Perfil de colecionador",
      description: "Troque, compre e anuncie cartas Pokémon TCG com pessoas próximas.",
      url: `https://cardtroca.com/profile/${userId}`,
      siteName: "CardTroca",
      images: [{ url: "https://cardtroca.com/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;
  return <DeepLinkGate deepLink={`cardtroca://profile/${userId}`} />;
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd "/Users/lux/development/SIte - CardTroca" && npx tsc --noEmit 2>&1 | head -30
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
cd "/Users/lux/development/SIte - CardTroca"
git add app/profile/
git commit -m "feat: add /profile/:userId deep link page"
```

---

### Task 3: Página `/card/:cardId`

**Files:**
- Create: `app/card/[cardId]/page.tsx`

**Interfaces:**
- Consumes: `DeepLinkGate` de `@/components/DeepLinkGate` com prop `deepLink: string`
- Produces: rota `/card/:cardId` no Next.js

- [ ] **Step 1: Criar `app/card/[cardId]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { DeepLinkGate } from "@/components/DeepLinkGate";

interface Props {
  params: Promise<{ cardId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cardId } = await params;
  return {
    title: "Carta | CardTroca",
    description: "Veja esta carta à venda no CardTroca — marketplace de cartas Pokémon TCG.",
    openGraph: {
      title: "CardTroca — Carta à venda",
      description: "Troque, compre e anuncie cartas Pokémon TCG com pessoas próximas.",
      url: `https://cardtroca.com/card/${cardId}`,
      siteName: "CardTroca",
      images: [{ url: "https://cardtroca.com/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { cardId } = await params;
  return <DeepLinkGate deepLink={`cardtroca://card/${cardId}`} />;
}
```

- [ ] **Step 2: Verificar TypeScript**

```bash
cd "/Users/lux/development/SIte - CardTroca" && npx tsc --noEmit 2>&1 | head -30
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
cd "/Users/lux/development/SIte - CardTroca"
git add app/card/
git commit -m "feat: add /card/:cardId deep link page"
```

---

### Task 4: Verificação manual no browser

- [ ] **Step 1: Iniciar servidor local**

```bash
cd "/Users/lux/development/SIte - CardTroca" && npm run dev
```

- [ ] **Step 2: Testar `/profile/teste123`**

Abrir: `http://localhost:3000/profile/teste123`

Expected:
1. Spinner aparece com "Abrindo o CardTroca…" por ~2 segundos
2. Depois de 2s (sem o app instalado no desktop), aparece a tela de download com logo, título e dois botões de store
3. Botão App Store abre `https://apps.apple.com/br/app/cardtroca/id6779094214` em nova aba
4. Botão Google Play abre `https://play.google.com/store/apps/details?id=io.cardtroca&pcampaignid=web_share` em nova aba

- [ ] **Step 3: Testar `/card/card-abc`**

Abrir: `http://localhost:3000/card/card-abc`

Expected: mesmo comportamento acima.

- [ ] **Step 4: Abrir PR no GitHub**

```bash
cd "/Users/lux/development/SIte - CardTroca"
gh pr create \
  --title "feat: SharedLinks — deep link pages for /profile and /card" \
  --body "$(cat <<'EOF'
## O que faz

Cria páginas web para as rotas `/profile/:userId` e `/card/:cardId` que:

1. Ao carregar, tenta abrir o app via `cardtroca://` deep link
2. Se o app abrir → usuário é direcionado ao app automaticamente
3. Se o app não abrir após 2s → exibe tela com logo CardTroca, descrição e botões de download (App Store / Google Play)

## Como testar

- Acesse `/profile/qualquer-id` ou `/card/qualquer-id`
- Sem o app instalado: spinner por 2s → tela de download
- Com o app instalado (mobile): app abre direto

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" \
  --base main \
  --head SharedLinks
```

---

## Self-Review

### Spec coverage

| Requisito | Task |
|-----------|------|
| `/profile/:userId` abre app via deep link | Task 2 |
| `/card/:cardId` abre app via deep link | Task 3 |
| Spinner enquanto tenta | Task 1 (`DeepLinkGate` estado inicial) |
| Fallback após ~2s | Task 1 (`setTimeout(2000)`) |
| Logo + descrição + botões de store no fallback | Task 1 |
| App Store link correto | Task 1 (via `AppStoreBadgeButton store="apple"`) |
| Play Store link correto | Task 1 (via `AppStoreBadgeButton store="google"`) |
| Sem dados reais / sem backend | ✅ não há fetch |
| Sem autenticação | ✅ páginas públicas |
| Deploy Vercel automático | ✅ via push na branch + PR merge |

### Placeholder scan

Nenhum "TBD", "TODO" ou "fill in" encontrado. Todos os code blocks têm código completo.

### Type consistency

- `DeepLinkGate` exporta `{ deepLink: string }` — usado exatamente assim em Task 2 e Task 3.
- `params` tipado como `Promise<{ userId: string }>` / `Promise<{ cardId: string }>` — padrão Next.js 14 para dynamic routes com `async/await`.
