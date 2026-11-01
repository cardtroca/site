"use client";

import { QRCodeSVG } from "qrcode.react";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";
import { androidIntentUrl, storeOrder, type Platform } from "@/lib/public/links";
import { gateFeatures, gateSubtitle, gateTitle, type GateSubject } from "@/lib/public/gate";
import { trackPublic } from "@/lib/public/track";
import { Icon } from "./Icon";

const APPLE_PATH =
  "M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.72-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.6 2.25 2.75 2.2 1.1-.04 1.52-.71 2.85-.71s1.7.71 2.87.69c1.18-.02 1.93-1.08 2.66-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.3-3.55zM14.18 6.13c.61-.74 1.02-1.76.91-2.78-.88.04-1.94.58-2.57 1.32-.56.65-1.06 1.7-.92 2.7.98.08 1.97-.5 2.58-1.24z";
const PLAY_PATH =
  "M3.6 2.2c-.2.2-.3.6-.3 1v17.6c0 .4.1.8.3 1l.1.1 9.9-9.9v-.2L3.7 2.1l-.1.1zm13.3 13.2-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2h-.1zm-.1.1L13.4 12l-9.8 9.8c.4.4 1 .4 1.7.1l11.5-6.4M16.8 8.5 5.3 2c-.7-.4-1.3-.3-1.7.1l9.8 9.9 3.4-3.5z";

export function AppGateContent({
  subject,
  path,
  platform,
  inApp,
  isMobile,
}: {
  subject: GateSubject;
  path: string;
  /** null = ainda não detectado (antes do mount). */
  platform: Platform | null;
  inApp: boolean;
  isMobile: boolean;
}) {
  // No Safari do iPhone o link só recarregaria a página; lá a Smart App Banner abre o app.
  const showAlready = isMobile && (platform === "android" || (platform === "ios" && inApp));

  return (
    <>
      <div className="dl-head">
        {subject.kind === "listing" ? (
          subject.imageUrl && (
            <div className="dl-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={subject.imageUrl} alt="" />
            </div>
          )
        ) : subject.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="dl-av" src={subject.avatarUrl} alt="" />
        ) : (
          <div className="dl-av" aria-hidden="true">{subject.initial}</div>
        )}
        <div>
          <h2 className="dl-title" id="app-gate-title">{gateTitle(subject)}</h2>
          <div className="t2" style={{ marginTop: 2 }}>{gateSubtitle(subject)}</div>
        </div>
      </div>
      <ul className="feats">
        {gateFeatures(subject).map((f) => (
          <li key={f.title}>
            <div className="iconbox"><Icon name={f.icon} /></div>
            <div>
              <div className="t1">{f.title}</div>
              <div className="t2">{f.text}</div>
            </div>
          </li>
        ))}
      </ul>
      <StoreButtons path={path} platform={platform} newTab={!isMobile} />
      {showAlready &&
        (platform === "ios" && inApp ? (
          <div className="already already-hint">Toque em ⋯ e escolha Abrir no navegador</div>
        ) : (
          <a className="already" href={androidIntentUrl(path)}>
            Já tenho o app · Abrir
          </a>
        ))}
    </>
  );
}

/** Botões pretos da App Store e do Google Play, com o sistema detectado primeiro. */
export function StoreButtons({
  path,
  platform,
  newTab,
}: {
  path: string;
  platform: Platform | null;
  newTab: boolean;
}) {
  const order = storeOrder(platform ?? "desktop");
  const stores = {
    apple: { url: APP_STORE_URL, small: "Baixar na", name: "App Store", d: APPLE_PATH },
    google: { url: PLAY_STORE_URL, small: "Disponível no", name: "Google Play", d: PLAY_PATH },
  };
  return (
    <div className="stores">
      {order.map((s) => (
        <a
          key={s}
          className="store"
          href={stores[s].url}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={() => trackPublic("web_store_clicked", { store: s, page: path })}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={stores[s].d} /></svg>
          <div><small>{stores[s].small}</small><b>{stores[s].name}</b></div>
        </a>
      ))}
    </div>
  );
}

export function AppGateQr({ path, kind }: { path: string; kind: GateSubject["kind"] }) {
  return (
    <div className="qrbox">
      <div className="qr">
        <QRCodeSVG value={`https://cardtroca.com${path}`} size={152} level="M" />
      </div>
      <p>
        <b>Aponte a câmera do celular</b>
        <br />
        para baixar o app e abrir {kind === "listing" ? "este anúncio" : "este perfil"}
      </p>
    </div>
  );
}
