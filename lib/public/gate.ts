import { firstName } from "./format";

export type GateSubject =
  | { kind: "listing"; imageUrl: string | null }
  | { kind: "profile"; name: string; avatarUrl: string | null; initial: string };

export type GateFeature = { icon: string; title: string; text: string };

export function gateTitle(subject: GateSubject): string {
  return subject.kind === "listing"
    ? "Continue no app do CardTroca"
    : `Siga ${firstName(subject.name)} no app do CardTroca`;
}

export function gateSubtitle(subject: GateSubject): string {
  return subject.kind === "listing"
    ? "É grátis. Este anúncio abre direto no app."
    : "É grátis. Este perfil abre direto no app.";
}

export function gateFeatures(subject: GateSubject): GateFeature[] {
  const chat: GateFeature = { icon: "chat_bubble_outline", title: "Chat com o vendedor", text: "Combine preço, troca e entrega" };
  const history: GateFeature = { icon: "bar_chart", title: "Histórico de preço", text: "CardTroca, Liga Pokémon, TCGplayer e eBay" };
  if (subject.kind === "listing") {
    return [
      chat,
      history,
      { icon: "notifications", title: "Notificações", text: "Aviso quando o preço baixar ou chegar oferta" },
      { icon: "more_horiz", title: "E mais", text: "Troca, pagamento protegido, sua coleção" },
    ];
  }
  return [
    { icon: "notifications", title: "Notificações", text: `Aviso quando ${firstName(subject.name)} anunciar uma carta nova` },
    chat,
    history,
    { icon: "more_horiz", title: "E mais", text: "Filtros, troca, pagamento protegido, sua coleção" },
  ];
}
