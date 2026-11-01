import type { Metadata } from "next";
import { BetaForm } from "@/components/sections/BetaForm";

export const metadata: Metadata = {
  title: "Participe do Beta | CardTroca",
  description:
    "Seja um dos primeiros a testar o CardTroca. Inscreva-se no Beta e ganhe 30 créditos adicionais na sua carteira.",
  alternates: { canonical: "/beta" },
};

export default function BetaPage() {
  return (
    <main className="min-h-screen bg-ds-bg">
      <BetaForm />
    </main>
  );
}
