"use client";

import { Icon } from "./Icon";

export function AppBanner({ onGate }: { onGate: (origin: string) => void }) {
  return (
    <div className="smart">
      <div className="applogo"><Icon name="style" /></div>
      <div>
        <div className="a">CardTroca</div>
        <div className="b">Grátis na App Store e Google Play</div>
      </div>
      <button type="button" className="dl" onClick={() => onGate("banner")}>Baixar</button>
    </div>
  );
}
