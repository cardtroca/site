"use client";

import type { ListingTile } from "@/lib/public/types";
import { formatBRL, languageShort } from "@/lib/public/format";
import { CardImage } from "./CardImage";
import { Icon } from "./Icon";

interface Props {
  tile: ListingTile;
  href: string | null;
  showPrice: boolean;
  /** Olho de observar: abre a janela com a origem "watch". */
  showEye: boolean;
  onGate: (origin: string) => void;
  /** Origem da janela no tile sem link. */
  gateOrigin?: string;
}

export function ListingTileCard({ tile, href, showPrice, showEye, onGate, gateOrigin = "tile" }: Props) {
  const body = (
    <>
      <div className="timg">
        <CardImage url={tile.imageUrl} alt={tile.name} />
        <span className="lang">{languageShort(tile.language)}</span>
      </div>
      <div className="tn">{tile.name}</div>
      {showPrice && <div className="tp">{tile.price != null ? formatBRL(tile.price) : "A combinar"}</div>}
      {tile.setName && <div className="tc">{tile.setName}</div>}
    </>
  );
  const card = href ? (
    <a className="tile" href={href}>{body}</a>
  ) : (
    <div className="tile" role="button" tabIndex={0} onClick={() => onGate(gateOrigin)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onGate(gateOrigin); } }}>
      {body}
    </div>
  );
  if (!showEye) return card;
  // O olho fica fora do link (botão dentro de <a> não é válido) e se sobrepõe à imagem.
  return (
    <div className="tile-wrap">
      {card}
      <button type="button" className="tile-eye" aria-label={`Observar ${tile.name}`} onClick={() => onGate("watch")}>
        <Icon name="visibility" />
      </button>
    </div>
  );
}
