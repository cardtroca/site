import { conditionChip, formatBRL, languageLabel, statusLabel } from "@/lib/public/format";
import type { PublicListing } from "@/lib/public/types";
import { Icon } from "../Icon";

const SALE_GREEN = "#0E9F6E";
const PRIMARY = "#029779";

/** Hex de 6 dígitos + alfa de 10% (o withValues(alpha: .10) do app). */
const tint = (hex: string) => `${hex}1A`;

/** Port de _PriceSection, sem distância e sem comparação com o mercado. */
export function PriceCard({ listing }: { listing: PublicListing }) {
  const card = listing.card;
  const subtitle = [card?.setName, card?.number].filter(Boolean).join(" · ");
  const cond = conditionChip(listing.condition);
  const status = statusLabel(listing.status);
  const statusColor = listing.status === "sale" ? SALE_GREEN : PRIMARY;
  const seller = listing.seller;
  const place = [seller?.city, seller?.state].filter(Boolean).join(", ");
  const asking = listing.askingPrice;

  return (
    <section className="app-card lp-block">
      <h1 className="lp-name">{card?.name ?? "Carta"}</h1>
      {subtitle && <div className="lp-setline">{subtitle}</div>}
      <div className="lp-chips">
        {cond.short && (
          <span className="lp-chip" style={{ color: cond.color, background: tint(cond.color) }}>{cond.short}</span>
        )}
        <span className="lp-chip lp-chip-lang">{languageLabel(listing.language)}</span>
        {listing.isGraded && listing.gradingCompany && (
          <span className="lp-graded">
            <Icon name="verified" filled />
            {listing.gradeScore != null ? `${listing.gradingCompany} ${listing.gradeScore}` : listing.gradingCompany}
          </span>
        )}
        {status && (
          <span className="lp-chip" style={{ color: statusColor, background: tint(statusColor) }}>{status}</span>
        )}
      </div>
      <div className="lp-pricecap">Preço pedido</div>
      <div className={`lp-price${asking == null ? " lp-price-open" : ""}`}>
        {asking != null ? formatBRL(asking) : "A combinar"}
      </div>
      {place && (
        <>
          <div className="lp-divider" />
          <div className="lp-loc">
            <div className="iconbox"><Icon name="near_me" filled /></div>
            <div className="lp-minw">
              <div className="t1 lp-wrap">{place}</div>
              <div className="t2">Localização do vendedor</div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
