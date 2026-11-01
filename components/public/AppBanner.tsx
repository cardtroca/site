"use client";

export function AppBanner({ onGate }: { onGate: (origin: string) => void }) {
  return (
    <div className="smart">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="applogo" src="/app-store-icon.png" alt="" width={36} height={36} />
      <div>
        <div className="a">CardTroca</div>
        <div className="b">Grátis na App Store e Google Play</div>
      </div>
      <button type="button" className="dl" onClick={() => onGate("banner")}>Baixar</button>
    </div>
  );
}
