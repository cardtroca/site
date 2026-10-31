import type { Metadata } from "next";

// a página é client component e não pode exportar metadata
export const metadata: Metadata = {
  title: "Funcionalidades | CardTroca",
  description:
    "Conheça as funcionalidades do CardTroca: coleção com valor estimado, busca de cartas, lista de desejos, cartas por perto, modo troca com match e chat para negociar Pokémon TCG.",
  alternates: { canonical: "/funcionalidades" },
  openGraph: {
    title: "Funcionalidades do CardTroca",
    description:
      "Coleção, busca, lista de desejos, cartas por perto, modo troca e chat para colecionadores Pokémon TCG.",
    url: "/funcionalidades",
  },
};

export default function FuncionalidadesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
