"use client";

import type { PublicSeller } from "@/lib/public/types";
import { useAppGate } from "../AppGate";
import { Icon } from "../Icon";
import { StatsCard } from "./StatsCard";

/** Port de ProfileHeader na versão sem medalha (e sem "seguidores · seguindo" sob o nome). */
export function ProfileHeader({ seller }: { seller: PublicSeller }) {
  const gate = useAppGate();
  const initial = seller.name.trim().charAt(0).toUpperCase() || "?";
  const place = [seller.city, seller.state].filter(Boolean).join(", ");
  const paid = seller.planLabel != null;
  const bio = seller.bio?.trim();

  return (
    <div className="pp-header">
      <div className="pp-avatar">
        <div>
          {seller.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={seller.avatarUrl} alt="" />
          ) : (
            <span aria-hidden="true">{initial}</span>
          )}
        </div>
      </div>
      <h1 className="pp-name">{seller.name}</h1>
      <div className="pp-meta">
        <span className={`pp-plan${paid ? " paid" : ""}`}>
          <Icon name={seller.isLeiloeiro ? "gavel" : paid ? "star" : "person"} filled />
          {seller.planLabel ?? "Free"}
        </span>
        {seller.isBeta && (
          <span className="lp-beta pp-beta"><Icon name="rocket_launch" filled />Beta User</span>
        )}
        {place && (
          <span className="pp-place"><Icon name="location_on" />{place}</span>
        )}
      </div>
      {bio && <p className="pp-bio">{bio}</p>}
      <button type="button" className="pp-follow" onClick={() => gate("follow")}>
        <Icon name="person_add" />Seguir
      </button>
      <StatsCard seller={seller} />
    </div>
  );
}
