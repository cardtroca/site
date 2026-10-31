"use client";

import type { ListingTile } from "@/lib/public/types";
import { formatBRL, languageShort } from "@/lib/public/format";
import { CardImage } from "./CardImage";
import { Icon } from "./Icon";

interface Props {
  tile: ListingTile;
  href: string | null;
  showPrice: boolean;
  showEye: boolean;
  onGate: (origin: string) => void;
}

export function ListingTileCard({ tile, href, showPrice, showEye, onGate }: Props) {
  const body = (
    <>
      <div className="timg">
        <CardImage url={tile.imageUrl} alt={tile.name} />
        <span className="lang">{languageShort(tile.language)}</span>
        {showEye && <span className="eye"><Icon name="visibility" /></span>}
      </div>
      <div className="tn">{tile.name}</div>
      {showPrice && <div className="tp">{tile.price != null ? formatBRL(tile.price) : "A combinar"}</div>}
      {tile.setName && <div className="tc">{tile.setName}</div>}
    </>
  );
  if (href) return <a className="tile" href={href}>{body}</a>;
  return (
    <div className="tile" role="button" tabIndex={0} onClick={() => onGate("tile")}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onGate("tile"); }}>
      {body}
    </div>
  );
}
