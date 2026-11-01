"use client";

import { AppBanner } from "./AppBanner";
import { useAppGate } from "./AppGate";

/** Faixa "Baixar" ligada à janela do AppGateProvider mais próximo. */
export function GatedAppBanner() {
  const gate = useAppGate();
  return <AppBanner onGate={gate} />;
}
