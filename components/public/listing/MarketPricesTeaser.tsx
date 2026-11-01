"use client";

import { useAppGate } from "../AppGate";
import { Icon } from "../Icon";
import { Expandable } from "./Expandable";

// Conteúdo de mentira, só para o desfoque: nenhum preço real vai para o HTML.
const FAKE_ROWS = ["CardTroca", "Liga Pokémon", "TCGplayer"];
const FAKE_BARS = [40, 55, 48, 70, 62, 85, 78, 66];

export function MarketPricesTeaser({ openOnDesktop = true }: { openOnDesktop?: boolean }) {
  const gate = useAppGate();
  return (
    <Expandable
      icon="bar_chart"
      title="Preços de mercado"
      subtitle="CardTroca, Liga Pokémon, TCGplayer e eBay"
      openOnDesktop={openOnDesktop}
    >
      <button type="button" className="lp-lock" onClick={() => gate("market_prices")}>
        <div className="lp-blur" aria-hidden="true">
          {FAKE_ROWS.map((r) => (
            <div key={r} className="lp-srcrow"><span>{r}</span><b>R$ 0.000</b></div>
          ))}
          <div className="lp-bars">
            {FAKE_BARS.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}
          </div>
        </div>
        <span className="lp-over">
          <span className="lp-pill"><Icon name="lock" />Histórico de preço no app</span>
        </span>
      </button>
    </Expandable>
  );
}
