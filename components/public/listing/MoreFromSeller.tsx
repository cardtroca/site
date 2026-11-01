"use client";

import { firstName } from "@/lib/public/format";
import type { ListingTile } from "@/lib/public/types";
import { useAppGate } from "../AppGate";
import { ListingTileCard } from "../ListingTileCard";

export function MoreFromSeller({ sellerId, sellerName, tiles }: { sellerId: string; sellerName: string; tiles: ListingTile[] }) {
  const gate = useAppGate();
  if (tiles.length === 0) return null;
  return (
    <section className="lp-more">
      <h2>
        <span className="lp-ellipsis">Mais cartas de {firstName(sellerName)}</span>
        <a href={`/profile/${sellerId}`}>Ver perfil</a>
      </h2>
      <div className="lp-tiles">
        {tiles.map((t) => (
          <ListingTileCard key={t.id} tile={t} href={`/card/${t.id}`} showPrice showEye={false} onGate={gate} />
        ))}
      </div>
    </section>
  );
}
