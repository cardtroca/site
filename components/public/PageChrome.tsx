import { Navigation } from "@/components/layout/Navigation";
import { GatedNavigation } from "./GatedNavigation";

/** Menu do site no computador. `gated`: o "Baixe o App" abre a janela (origem "nav"); sem ela, abre a loja. */
export function DesktopNav({ gated = false }: { gated?: boolean }) {
  return (
    <div className="lp-nav">
      {gated ? <GatedNavigation /> : <Navigation />}
    </div>
  );
}

export function DesktopFooter() {
  return (
    <footer className="lp-foot">
      <span>© {new Date().getFullYear()} CardTroca</span>
      <span>
        <a href="/termos-de-uso">Termos de uso</a> · <a href="/politica-de-privacidade">Política de privacidade</a>
      </span>
    </footer>
  );
}
