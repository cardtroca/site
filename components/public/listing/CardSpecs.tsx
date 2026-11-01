"use client";

import type { SpecRow } from "@/lib/public/specs";
import { Expandable } from "./Expandable";

export function CardSpecs({ rows }: { rows: SpecRow[] }) {
  return (
    <Expandable icon="style" title="Ficha da carta" subtitle="Coleção, número, raridade e variante">
      <dl className="lp-specs">
        {rows.map((r) => (
          <div key={r.label} className="lp-spec">
            <dt>{r.label}</dt>
            <dd className={r.accent ? "accent" : undefined}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </Expandable>
  );
}
