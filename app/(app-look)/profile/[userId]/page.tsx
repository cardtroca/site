import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { AppGateProvider } from "@/components/public/AppGate";
import { GatedAppBanner } from "@/components/public/GatedAppBanner";
import { DesktopFooter, DesktopNav } from "@/components/public/PageChrome";
import { ShareButton } from "@/components/public/ShareButton";
import { ViewTracker } from "@/components/public/listing/ViewTracker";
import { ProfileHeader } from "@/components/public/profile/ProfileHeader";
import { ProfileTabs } from "@/components/public/profile/ProfileTabs";
import { getProfilePage } from "@/lib/public/data";
import { profileOg } from "@/lib/public/og";
import { APP_STORE_ID, SITE_URL } from "@/lib/site";

export const revalidate = 60;

// Lista vazia: nada é gerado no build, e cada perfil vira ISR na primeira visita.
export function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ userId: string }>;
}

// Uma leitura por requisição, dividida entre generateMetadata e a página.
const load = cache((id: string) => getProfilePage(id));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const data = await load(userId);
  const og = profileOg(data);
  const url = `${SITE_URL}/profile/${userId}`;
  const images = og.image ? [og.image] : undefined;
  return {
    title: data.kind === "ok" ? `${og.title} | CardTroca` : "Perfil | CardTroca",
    description: og.description,
    robots: { index: false, follow: true },
    ...(data.kind === "not_found"
      ? {}
      : { other: { "apple-itunes-app": `app-id=${APP_STORE_ID}, app-argument=${url}` } }),
    openGraph: { title: og.title, description: og.description, url, siteName: "CardTroca", images },
    twitter: { card: images ? "summary_large_image" : "summary", title: og.title, description: og.description, images },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;
  const data = await load(userId);
  if (data.kind === "not_found") notFound();

  const { seller, forSale, collection } = data;
  const path = `/profile/${seller.id}`;
  const initial = seller.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <AppGateProvider subject={{ kind: "profile", name: seller.name, avatarUrl: seller.avatarUrl, initial }} path={path}>
      <ViewTracker event="web_profile_viewed" props={{ profile_id: seller.id }} />
      <DesktopNav gated />
      <GatedAppBanner />
      <main className="pp">
        <div className="pp-main">
          <aside className="pp-left">
            <div className="pp-sharebar">
              <ShareButton url={`${SITE_URL}${path}`} title={`${seller.name} no CardTroca`} />
            </div>
            <ProfileHeader seller={seller} />
          </aside>
          <div className="pp-right">
            <ProfileTabs forSale={forSale} collection={collection} />
          </div>
        </div>
      </main>
      <DesktopFooter />
    </AppGateProvider>
  );
}
