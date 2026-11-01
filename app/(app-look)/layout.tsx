import type { Viewport } from "next";
import { AppLookShell } from "@/components/public/AppLookShell";

/** Anúncio e perfil são sempre claros: a barra do navegador segue o fundo do app. */
export const viewport: Viewport = { themeColor: "#F5F6F6" };

export default function AppLookLayout({ children }: { children: React.ReactNode }) {
  return <AppLookShell>{children}</AppLookShell>;
}
