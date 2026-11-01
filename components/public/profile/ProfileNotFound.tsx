"use client";

import { useEffect, useState } from "react";
import { platformOf, type Platform } from "@/lib/public/links";
import { StoreButtons } from "../AppGateContent";
import { Icon } from "../Icon";

/** "Perfil não encontrado" com os botões das lojas (a página responde 404). */
export function ProfileNotFound() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  useEffect(() => setPlatform(platformOf(navigator.userAgent)), []);

  return (
    <div className="lp-unav">
      <section className="app-card lp-block lp-unav-card">
        <div className="iconbox lp-gray lp-unav-icon"><Icon name="person_off" /></div>
        <h1 className="lp-unav-title">Perfil não encontrado</h1>
        <p className="t2 lp-unav-text">
          Este perfil não existe ou não está mais disponível. Veja outros colecionadores no app do CardTroca.
        </p>
        <StoreButtons path="/profile" platform={platform} newTab={platform === "desktop"} />
      </section>
    </div>
  );
}
