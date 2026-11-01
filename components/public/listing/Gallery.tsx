"use client";

import { useRef, useState } from "react";
import { CardImage } from "../CardImage";
import { CircleButton } from "../CircleButton";
import { Icon } from "../Icon";
import { ShareButton } from "../ShareButton";
import { TiltCard } from "../TiltCard";
import { useAppGate } from "../AppGate";

type GalleryImage = { url: string; isUserPhoto: boolean };

const CARD_W = "var(--lp-card-w)";
const CARD_PAD = "var(--lp-card-pad)";

/** Port de _HeroGallery: foto(s) do vendedor e imagem oficial, deslizando. */
export function Gallery({ images, name, shareUrl }: { images: GalleryImage[]; name: string; shareUrl: string }) {
  const gate = useAppGate();
  const [page, setPage] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const many = images.length > 1;

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== page && i >= 0 && i < images.length) setPage(i);
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    setPage(i);
  };

  return (
    <div className="lp-gallery">
      <div className="lp-stage">
        <div className="lp-actions">
          <CircleButton icon="visibility" label="Observar" onClick={() => gate("watch")} />
          <ShareButton url={shareUrl} title={name} />
        </div>
        {images.length === 0 ? (
          <div className="lp-track">
            <div className="lp-slide">
              <TiltCard src={null} alt={name} width={CARD_W} padding={CARD_PAD} />
            </div>
          </div>
        ) : (
          <div
            ref={trackRef}
            className="lp-track"
            onScroll={many ? onScroll : undefined}
            aria-roledescription={many ? "carrossel" : undefined}
          >
            {images.map((img, i) => (
              <div
                key={img.url}
                className="lp-slide"
                aria-hidden={i !== page || undefined}
                aria-label={many ? `${i + 1} de ${images.length}` : undefined}
              >
                {i === page ? (
                  <TiltCard src={img.url} alt={name} width={CARD_W} padding={CARD_PAD} />
                ) : (
                  <div className="stage" style={{ padding: CARD_PAD }}>
                    <div className="tiltwrap">
                      <div className="tcard" style={{ width: CARD_W }}>
                        <CardImage url={img.url} alt={name} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {images.length > 0 && (
          <div className="lp-herotag">
            <Icon name={images[page].isUserPhoto ? "photo_camera" : "verified"} filled />
            {images[page].isUserPhoto ? "Foto do vendedor" : "Imagem oficial"}
          </div>
        )}
        {many && <div className="lp-count" aria-live="polite">{page + 1} de {images.length}</div>}
      </div>
      {many && (
        <div className="lp-thumbs">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              className={`lp-thumb${i === page ? " sel" : ""}`}
              aria-label={`Ver imagem ${i + 1} de ${images.length}`}
              aria-pressed={i === page}
              onClick={() => goTo(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
