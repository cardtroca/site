import type { Metadata, Viewport } from "next";
import { AppLookShell } from "@/components/public/AppLookShell";
import { DesktopFooter, DesktopNav } from "@/components/public/PageChrome";
import { PublicMessage } from "@/components/public/PublicMessage";

export const metadata: Metadata = {
  title: "Página não encontrada | CardTroca",
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { themeColor: "#F5F6F6", viewportFit: "cover" };

/** 404 do site inteiro (inclui notFound() do anúncio e do perfil), no visual do app. */
export default function NotFound() {
  return (
    <AppLookShell>
      <DesktopNav />
      <main className="lp lp-unav-page">
        <PublicMessage
          icon="search_off"
          title="Página não encontrada"
          text="Este anúncio ou perfil não está mais disponível."
        />
      </main>
      <DesktopFooter />
    </AppLookShell>
  );
}
