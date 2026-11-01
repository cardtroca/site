"use client";

import { useEffect, useId, useState } from "react";
import { Icon } from "../Icon";

const DESKTOP = "(min-width: 1024px)";

/**
 * Port de ExpandableSectionCard. `openOnDesktop` deixa o bloco aberto a partir
 * de 1024 px até a pessoa tocar, por CSS, para não piscar na hidratação.
 */
export function Expandable({
  icon, title, subtitle, openOnDesktop = false, children,
}: {
  icon: string; title: string; subtitle: string; openOnDesktop?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean | null>(openOnDesktop ? null : false);
  const [desktop, setDesktop] = useState(false);
  const id = useId();

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const shown = open ?? desktop;
  const cls = open === null ? "auto-desk" : open ? "open" : "";

  return (
    <section className={`lp-exp ${cls}`}>
      <button
        type="button"
        className="lp-exp-head"
        aria-expanded={shown}
        aria-controls={id}
        onClick={() => setOpen(!shown)}
      >
        <div className="iconbox lp-gray"><Icon name={icon} /></div>
        <div className="lp-minw">
          <div className="t1">{title}</div>
          <div className="t2">{subtitle}</div>
        </div>
        <span className="lp-exp-chev"><Icon name="expand_more" /></span>
      </button>
      <div className="lp-exp-content" id={id}>{children}</div>
    </section>
  );
}
