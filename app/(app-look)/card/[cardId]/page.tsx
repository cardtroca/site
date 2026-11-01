import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { AppGateProvider } from "@/components/public/AppGate";
import { GatedAppBanner } from "@/components/public/GatedAppBanner";
import { DesktopFooter, DesktopNav } from "@/components/public/PageChrome";
import { CardSpecs } from "@/components/public/listing/CardSpecs";
import { FloatingCta } from "@/components/public/listing/FloatingCta";
import { Gallery } from "@/components/public/listing/Gallery";
import { ListingUnavailable } from "@/components/public/listing/ListingUnavailable";
import { MarketPricesTeaser } from "@/components/public/listing/MarketPricesTeaser";
import { MoreFromSeller } from "@/components/public/listing/MoreFromSeller";
import { NotesCard } from "@/components/public/listing/NotesCard";
import { PriceCard } from "@/components/public/listing/PriceCard";
import { SellerCard } from "@/components/public/listing/SellerCard";
import { ViewTracker } from "@/components/public/listing/ViewTracker";
import { getListingPage } from "@/lib/public/data";
import { galleryImages } from "@/lib/public/format";
import { listingOg } from "@/lib/public/og";
import { cardSpecRows } from "@/lib/public/specs";
import { APP_STORE_ID, SITE_URL } from "@/lib/site";

export const revalidate = 60;

// Lista vazia: nada é gerado no build, e cada anúncio vira ISR na primeira visita.
export function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ cardId: string }>;
}

// Uma leitura por requisição, dividida entre generateMetadata e a página.
const load = cache((id: string) => getListingPage(id));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cardId } = await params;
  const data = await load(cardId);
  const og = listingOg(data);
  const url = `${SITE_URL}/card/${cardId}`;
  const images = og.image ? [og.image] : undefined;
  return {
    title: data.kind === "ok" ? `${og.title} | CardTroca` : "Carta | CardTroca",
    description: og.description,
    robots: { index: false, follow: true },
    ...(data.kind === "not_found"
      ? {}
      : { other: { "apple-itunes-app": `app-id=${APP_STORE_ID}, app-argument=${url}` } }),
    openGraph: { title: og.title, description: og.description, url, siteName: "CardTroca", images },
    twitter: { card: "summary_large_image", title: og.title, description: og.description, images },
  };
}

export default async function CardPage({ params }: Props) {
  const { cardId } = await params;
  const data = await load(cardId);
  if (data.kind === "not_found") notFound();

  const path = `/card/${cardId}`;

  if (data.kind === "unavailable") {
    return (
      <>
        <ViewTracker event="web_listing_viewed" props={{ listing_id: cardId, available: "false" }} />
        <DesktopNav />
        <main className="lp lp-unav-page">
          <ListingUnavailable path={path} seller={data.seller} more={data.more} />
        </main>
        <DesktopFooter />
      </>
    );
  }

  const { listing, more } = data;
  const images = galleryImages(listing);
  const name = listing.card?.name ?? "Carta";
  const notes = listing.notes?.trim();
  const seller = listing.seller;

  return (
    <AppGateProvider subject={{ kind: "listing", imageUrl: images[0]?.url ?? null }} path={path}>
      <ViewTracker event="web_listing_viewed" props={{ listing_id: listing.id, available: "true" }} />
      <DesktopNav gated />
      <GatedAppBanner />
      <main className="lp">
        <div className="lp-main">
          <div className="lp-left">
            <Gallery images={images} name={name} shareUrl={`${SITE_URL}${path}`} />
          </div>
          <div className="lp-right">
            <PriceCard listing={listing} />
            {seller && <FloatingCta status={listing.status} askingPrice={listing.askingPrice} variant="inline" />}
            {seller && <SellerCard seller={seller} />}
            {notes && <NotesCard notes={notes} />}
            {listing.card && <MarketPricesTeaser />}
            {listing.card && <CardSpecs rows={cardSpecRows(listing)} />}
          </div>
        </div>
        {seller && <MoreFromSeller sellerId={seller.id} sellerName={seller.name} tiles={more} />}
      </main>
      <DesktopFooter />
      {seller && <FloatingCta status={listing.status} askingPrice={listing.askingPrice} variant="floating" />}
    </AppGateProvider>
  );
}
