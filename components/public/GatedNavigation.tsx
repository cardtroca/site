"use client";

import { Navigation } from "@/components/layout/Navigation";
import { useAppGate } from "./AppGate";

/** Menu do site com "Baixe o App" abrindo a janela (origem "nav"). */
export function GatedNavigation() {
  const gate = useAppGate();
  return <Navigation onDownload={() => gate("nav")} />;
}
