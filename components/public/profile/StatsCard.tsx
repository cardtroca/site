"use client";

import { Fragment } from "react";
import { ratingText } from "@/lib/public/format";
import type { PublicSeller } from "@/lib/public/types";
import { useAppGate } from "../AppGate";
import { Icon } from "../Icon";

interface Stat { value: string; label: string; star?: boolean; origin?: string }

/** Port de ProfileStatsCard: avaliação, comentários, seguidores e trocas. Vendas não entra. */
export function StatsCard({ seller }: { seller: PublicSeller }) {
  const gate = useAppGate();
  const rating = ratingText(seller.rating, seller.totalReviews);
  const items: Stat[] = [
    { value: rating.value, label: rating.label, star: true },
    { value: String(seller.totalReviews), label: "comentários", origin: "reviews" },
    { value: String(seller.followers), label: "seguidores", origin: "followers" },
    { value: String(seller.totalTrades), label: "trocas" },
  ];
  return (
    <div className="pp-stats">
      {items.map((s, i) => {
        const content = (
          <>
            <b>{s.star && <Icon name="star" filled />}{s.value}</b>
            <span>{s.label}</span>
          </>
        );
        return (
          <Fragment key={s.label}>
            {i > 0 && <div className="pp-vsep" aria-hidden="true" />}
            {s.origin ? (
              <button type="button" className="pp-stat tap" onClick={() => gate(s.origin as string)}>
                {content}
              </button>
            ) : (
              <div className="pp-stat">{content}</div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
