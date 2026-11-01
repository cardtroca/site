"use client";

import { useState } from "react";

function PokeballPlaceholder() {
  return (
    <div className="cardimg-empty" role="img" aria-label="Sem imagem">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#586572" strokeWidth="7" />
        <path d="M6 50h30M64 50h30" stroke="#586572" strokeWidth="7" />
        <circle cx="50" cy="50" r="13" fill="none" stroke="#586572" strokeWidth="7" />
      </svg>
    </div>
  );
}

/** `lazy`: imagens de grade abaixo da dobra; a carta principal carrega já. */
export function CardImage({ url, alt, lazy = false }: { url: string | null; alt: string; lazy?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) return <PokeballPlaceholder />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="cardimg"
      src={url}
      alt={alt}
      {...(lazy ? { loading: "lazy" as const, decoding: "async" as const } : {})}
      onError={() => setFailed(true)}
    />
  );
}
