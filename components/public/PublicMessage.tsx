"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { platformOf, type Platform } from "@/lib/public/links";
import { StoreButtons } from "./AppGateContent";
import { Icon } from "./Icon";

/** Cartão de aviso no visual do app (404 e erro), com os botões das lojas. */
export function PublicMessage({
  icon, title, text, children,
}: {
  icon: string; title: string; text: string; children?: React.ReactNode;
}) {
  const path = usePathname() ?? "/";
  const [platform, setPlatform] = useState<Platform | null>(null);
  useEffect(() => setPlatform(platformOf(navigator.userAgent)), []);

  return (
    <div className="lp-unav">
      <section className="app-card lp-block lp-unav-card">
        <div className="iconbox lp-gray lp-unav-icon"><Icon name={icon} /></div>
        <h1 className="lp-unav-title">{title}</h1>
        <p className="t2 lp-unav-text">{text}</p>
        {children}
        <StoreButtons path={path} platform={platform} newTab={platform === "desktop"} />
      </section>
    </div>
  );
}
