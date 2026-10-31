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
    robots: { index: false, follow: true },
    openGraph: {
      title: "CardTroca — Perfil de colecionador",
      description: "Troque, compre e anuncie cartas Pokémon TCG com pessoas próximas.",
      url: `https://cardtroca.com/profile/${userId}`,
      siteName: "CardTroca",
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;
  return <DeepLinkGate deepLink={`cardtroca://profile/${userId}`} />;
}
