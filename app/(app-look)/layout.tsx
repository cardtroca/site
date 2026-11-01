import type { Viewport } from "next";
import { AppLookShell } from "@/components/public/AppLookShell";

/**
 * Anúncio e perfil são sempre claros: a barra do navegador segue o fundo do app.
 * `cover` estende a página até as bordas do iPhone; as áreas seguras viram
 * padding via env(safe-area-inset-*) no app-look.css.
 */
export const viewport: Viewport = { themeColor: "#F5F6F6", viewportFit: "cover" };

export default function AppLookLayout({ children }: { children: React.ReactNode }) {
  return <AppLookShell>{children}</AppLookShell>;
}
