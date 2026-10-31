"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  CircleDollarSign,
  Coins,
  Heart,
  Library,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PhoneMockup } from "@/components/PhoneMockup";

type Feature = { label: string; status?: "Em breve" };

type Group = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  icon: React.ReactNode;
  features: Feature[];
};

const groups: Group[] = [
  {
    id: "encontrar",
    eyebrow: "Encontrar",
    title: "Descubra a carta que falta na sua coleção",
    description: "Pesquise por nome ou código, filtre anúncios e veja o que está perto de você no mapa.",
    image: "/images/buscar.webp",
    alt: "Tela de busca de cartas do CardTroca",
    icon: <Search className="w-5 h-5" />,
    features: [{ label: "Catálogo e busca inteligente" }, { label: "Filtros por preço, condição e distância" }, { label: "Mapa de cartas próximas" }],
  },
  {
    id: "negociar",
    eyebrow: "Trocar e negociar",
    title: "Do interesse ao acordo, em um só fluxo",
    description: "Monte sua proposta, descubra combinações no Modo Troca e converse quando houver interesse.",
    image: "/images/swipe.webp",
    alt: "Tela do Modo Troca do CardTroca",
    icon: <Heart className="w-5 h-5" />,
    features: [{ label: "Modo Troca com match" }, { label: "Chat em tempo real e imagens" }, { label: "Compra, venda ou troca" }],
  },
  {
    id: "colecao",
    eyebrow: "Coleção",
    title: "Organize cartas sem depender de planilhas",
    description: "Adicione pelo scanner, busca ou importação e acompanhe sua coleção por cartas, sets e objetivos.",
    image: "/images/add.webp",
    alt: "Tela de adição de carta do CardTroca",
    icon: <Library className="w-5 h-5" />,
    features: [{ label: "Scanner de carta e confirmação" }, { label: "Importação da Liga Pokémon" }, { label: "Álbuns por set e coleções personalizadas" }],
  },
  {
    id: "precos",
    eyebrow: "Preços e anúncios",
    title: "Anuncie com mais contexto e segurança",
    description: "Registre fotos, condição, idioma e preço para deixar a negociação clara desde o começo.",
    image: "/images/meus_anuncios.webp",
    alt: "Tela de meus anúncios do CardTroca",
    icon: <CircleDollarSign className="w-5 h-5" />,
    features: [{ label: "Anúncios para venda e troca" }, { label: "Condição, fotos e graduação" }, { label: "Referências e histórico de preços" }],
  },
  {
    id: "comunidade",
    eyebrow: "Comunidade e confiança",
    title: "Negocie conhecendo melhor a comunidade",
    description: "Acompanhe novidades, salve anúncios e consulte reputação antes de avançar em uma negociação.",
    image: "/images/avaliacao.webp",
    alt: "Tela de avaliações do CardTroca",
    icon: <Users className="w-5 h-5" />,
    features: [{ label: "Feed e seguidores" }, { label: "Anúncios observados e notificações" }, { label: "Avaliações, denúncia e bloqueio" }],
  },
  {
    id: "pro",
    eyebrow: "Pro e carteira",
    title: "Escolha como quer colecionar",
    description: "Use créditos quando precisar ou desbloqueie ferramentas avançadas com o CardTroca Pro.",
    image: "/images/carteira.webp",
    alt: "Tela de carteira do CardTroca",
    icon: <Coins className="w-5 h-5" />,
    features: [{ label: "Créditos, recompensas e Pix" }, { label: "Scanner, álbum e recursos Pro" }, { label: "Novos TCGs além de Pokémon", status: "Em breve" }],
  },
];

export function FeatureCatalog() {
  const shouldReduce = useReducedMotion();

  return (
    <section id="recursos" aria-label="Recursos do CardTroca" className="section-padding bg-ds-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-mesh opacity-50" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 lg:mb-20">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Feito para colecionar</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ds-text-primary leading-tight mb-5">
            Tudo o que sua coleção precisa, <span className="text-gradient-primary">antes e depois da troca.</span>
          </h2>
          <p className="text-lg text-ds-text-secondary leading-relaxed">
            Do catálogo ao chat, o CardTroca reúne ferramentas para encontrar, organizar e negociar cartas Pokémon TCG.
          </p>
        </div>

        <div className="grid gap-8 lg:gap-14">
          {groups.map((group, index) => (
            <motion.article
              key={group.id}
              initial={shouldReduce ? {} : { opacity: 0, y: 28 }}
              whileInView={shouldReduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index % 2 ? 0.08 : 0 }}
              className="grid md:grid-cols-[minmax(0,1fr)_220px] lg:grid-cols-[minmax(0,1fr)_280px] gap-6 lg:gap-12 items-center rounded-3xl border border-ds-border bg-ds-surface p-6 sm:p-8 lg:p-10 shadow-elevation-1"
            >
              <div className="order-2 md:order-1">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                  {group.icon}
                </div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">{group.eyebrow}</p>
                <h3 className="text-2xl sm:text-3xl font-black text-ds-text-primary leading-tight mb-3">{group.title}</h3>
                <p className="text-ds-text-secondary leading-relaxed mb-6 max-w-xl">{group.description}</p>
                <ul className="grid sm:grid-cols-2 gap-3" role="list">
                  {group.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2.5 text-sm text-ds-text-secondary">
                      {feature.status ? <Sparkles className="w-4 h-4 mt-0.5 flex-none text-accent" /> : <ShieldCheck className="w-4 h-4 mt-0.5 flex-none text-primary" />}
                      <span>
                        {feature.label}{" "}
                        {feature.status && <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">{feature.status}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2 flex justify-center md:justify-end">
                <PhoneMockup size="md" className="shadow-elevation-4">
                  <Image src={group.image} alt={group.alt} fill sizes="220px" unoptimized className="object-cover" draggable={false} />
                </PhoneMockup>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ds-text-tertiary">
          Recursos identificados como <span className="font-semibold text-accent">Em breve</span> fazem parte da evolução planejada do CardTroca.
        </p>
      </div>
    </section>
  );
}
