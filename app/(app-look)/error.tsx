"use client";

import { DesktopFooter, DesktopNav } from "@/components/public/PageChrome";
import { PublicMessage } from "@/components/public/PublicMessage";

/** Falha ao carregar o anúncio ou o perfil (ex.: Supabase fora do ar). Nada disso é cacheado. */
export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <DesktopNav />
      <main className="lp lp-unav-page">
        <PublicMessage
          icon="cloud_off"
          title="Não foi possível carregar agora"
          text="Tente de novo em instantes ou abra no app do CardTroca."
        >
          <button type="button" className="lp-retry" onClick={() => reset()}>Tentar de novo</button>
        </PublicMessage>
      </main>
      <DesktopFooter />
    </>
  );
}
