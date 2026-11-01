"use client";

import { useState } from "react";
import type { ListingTile } from "@/lib/public/types";
import { useAppGate } from "../AppGate";
import { Icon } from "../Icon";
import { ListingTileCard } from "../ListingTileCard";

/** Port de _TabsHeader + ProfileCardList: pílula deslizante, contagem, Filtrar e grade. */
export function ProfileTabs({ forSale, forSaleTotal, collection, collectionTotal }: {
  forSale: ListingTile[]; forSaleTotal: number; collection: ListingTile[]; collectionTotal: number;
}) {
  const gate = useAppGate();
  const [tab, setTab] = useState<0 | 1>(0);
  const tiles = tab === 0 ? forSale : collection;
  // Contagem real da aba (a grade pode estar cortada em 300).
  const n = Math.max(tab === 0 ? forSaleTotal : collectionTotal, tiles.length);
  const labels = [`À venda · ${forSaleTotal}`, `Coleção · ${collectionTotal}`];

  return (
    <>
      <div className="pp-tabs">
        <div className="pp-seg" role="tablist" aria-label="Cartas do perfil" data-tab={tab}>
          <div className="pp-thumb" aria-hidden="true" />
          {labels.map((label, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              id={`pp-tab-${i}`}
              aria-selected={tab === i}
              aria-controls="pp-panel"
              className={tab === i ? "on" : undefined}
              onClick={() => setTab(i as 0 | 1)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div id="pp-panel" role="tabpanel" aria-labelledby={`pp-tab-${tab}`}>
        {n === 0 ? (
          <div className="pp-empty">
            <Icon name="style" />
            <p>{tab === 0 ? "Nenhuma carta à venda." : "Coleção vazia."}</p>
          </div>
        ) : (
          <>
            <div className="pp-count">
              <span>{n} {n === 1 ? "carta" : "cartas"}</span>
              {/* Só na aba À venda; na Coleção fica invisível para a linha não mudar de altura. */}
              <button type="button" className={`pp-filter${tab === 0 ? "" : " off"}`} onClick={() => gate("filter")}>
                <Icon name="tune" />Filtrar
              </button>
            </div>
            <div className="pp-grid">
              {tiles.map((t) =>
                tab === 0 ? (
                  <ListingTileCard key={t.id} tile={t} href={`/card/${t.id}`} showPrice showEye onGate={gate} />
                ) : (
                  <ListingTileCard key={t.id} tile={t} href={null} showPrice={false} showEye={false} onGate={gate} gateOrigin="collection" />
                ),
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
