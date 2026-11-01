"use client";

import type { ListingStatus } from "@/lib/public/types";
import { priceCaption } from "@/lib/public/format";
import { useAppGate } from "../AppGate";
import { Icon } from "../Icon";

/**
 * Port de _FloatingCta (sem comprar nem carrinho). `floating`: barra de vidro
 * fixa no celular; `inline`: a mesma barra parada na coluna do computador.
 */
export function FloatingCta({
  status, askingPrice, variant,
}: {
  status: ListingStatus; askingPrice: number | null; variant: "floating" | "inline";
}) {
  const gate = useAppGate();
  const { caption, value, cta } = priceCaption(status, askingPrice);
  const trade = status === "trade";
  return (
    <div className={variant === "floating" ? "lp-float" : "lp-cta-inline"}>
      <div className="lp-glassbar">
        <div className="lp-minw">
          <div className="lp-cap">{caption}</div>
          <div className={`lp-val${trade ? " trade" : ""}`}>{value}</div>
        </div>
        <button type="button" className="lp-chatbar" onClick={() => gate("chat")}>
          <Icon name={trade ? "swap_horiz" : "chat_bubble_outline"} />
          {cta}
        </button>
      </div>
    </div>
  );
}
