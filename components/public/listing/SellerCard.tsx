import { ratingText } from "@/lib/public/format";
import type { PublicSeller } from "@/lib/public/types";
import { Icon } from "../Icon";

function Stars({ score }: { score: number }) {
  const full = Math.floor(score);
  const half = score - full >= 0.5;
  return (
    <span className="lp-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) =>
        i < full ? <Icon key={i} name="star" filled />
        : i === full && half ? <Icon key={i} name="star_half" filled />
        : <Icon key={i} name="star" />,
      )}
    </span>
  );
}

/** Port de _SellerSection, sem medalha: estrelas com "nota · N avaliações". */
export function SellerCard({ seller }: { seller: PublicSeller }) {
  const initial = seller.name.trim().charAt(0).toUpperCase() || "?";
  const place = [seller.city, seller.state].filter(Boolean).join(", ");
  const paid = seller.planLabel != null;
  const rating = ratingText(seller.rating, seller.totalReviews);
  const reviews = `${seller.totalReviews} ${seller.totalReviews === 1 ? "avaliação" : "avaliações"}`;
  const bio = seller.bio?.trim();

  return (
    <section className="app-card lp-block">
      <a className="lp-seller" href={`/profile/${seller.id}`} aria-label={`Ver perfil de ${seller.name}`}>
        <div className="lp-avatar">
          {seller.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={seller.avatarUrl} alt="" />
          ) : (
            <span aria-hidden="true">{initial}</span>
          )}
        </div>
        <div className="lp-sinfo">
          <div className="lp-sname">
            <span className="lp-ellipsis">{seller.name}</span>
            <span className={`lp-plan${paid ? " paid" : ""}`}>
              <Icon name={seller.isLeiloeiro ? "gavel" : paid ? "star" : "person"} filled />
              {seller.planLabel ?? "Free"}
            </span>
            {seller.isBeta && (
              <span className="lp-beta"><Icon name="rocket_launch" filled />Beta User</span>
            )}
          </div>
          {place && (
            <div className="lp-scity">
              <Icon name="location_on" />
              <span className="lp-ellipsis">{place}</span>
            </div>
          )}
          <div className="lp-rating">
            {seller.totalReviews > 0 ? (
              <>
                <Stars score={seller.rating} />
                <span>{rating.value} · {reviews}</span>
              </>
            ) : (
              <span className="lp-norating">Sem avaliações ainda</span>
            )}
          </div>
        </div>
        <Icon name="chevron_right" />
      </a>
      {bio && <p className="lp-bio">{bio}</p>}
    </section>
  );
}
