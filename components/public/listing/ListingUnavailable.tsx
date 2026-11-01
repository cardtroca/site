"use client";

import { useEffect, useState } from "react";
import { platformOf, type Platform } from "@/lib/public/links";
import type { ListingTile, PublicSeller } from "@/lib/public/types";
import { StoreButtons } from "../AppGateContent";
import { Icon } from "../Icon";
import { MoreFromSeller } from "./MoreFromSeller";
import { SellerCard } from "./SellerCard";

export function ListingUnavailable({
  path, seller, more,
}: {
  path: string; seller: PublicSeller | null; more: ListingTile[];
}) {
  const [platform, setPlatform] = useState<Platform | null>(null);
  useEffect(() => setPlatform(platformOf(navigator.userAgent)), []);

  return (
    <>
      <div className="lp-unav">
        <section className="app-card lp-block lp-unav-card">
          <div className="iconbox lp-gray lp-unav-icon"><Icon name="search_off" /></div>
          <h1 className="lp-unav-title">Este anúncio não está mais disponível</h1>
          <p className="t2 lp-unav-text">
            A carta pode ter sido vendida ou o anúncio, removido. Veja outros anúncios no app do CardTroca.
          </p>
          <StoreButtons path={path} platform={platform} newTab={platform === "desktop"} />
        </section>
        {seller && <SellerCard seller={seller} />}
      </div>
      {seller && <MoreFromSeller sellerId={seller.id} sellerName={seller.name} tiles={more} />}
    </>
  );
}
