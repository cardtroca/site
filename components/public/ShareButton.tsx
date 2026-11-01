"use client";

import { useEffect, useRef, useState } from "react";
import { CircleButton } from "./CircleButton";

export function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  async function share() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ url, title });
      } catch {
        // cancelado pela pessoa
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // sem clipboard: nada a fazer
    }
  }

  return (
    <>
      <CircleButton icon="ios_share" label="Compartilhar" onClick={share} />
      {copied && <div className="toast" role="status">Link copiado</div>}
    </>
  );
}
