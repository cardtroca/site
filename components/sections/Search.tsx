"use client";

import Image from "next/image";
import { useState } from "react";
import { PhoneMockup } from "@/components/PhoneMockup";
import { SlidersHorizontal, MapPin, Star, Tag, Package } from "lucide-react";

const filters = [
  { label: "Distância", icon: <MapPin className="w-3 h-3" /> },
  { label: "Condição", icon: <Star className="w-3 h-3" /> },
  { label: "Preço", icon: <Tag className="w-3 h-3" /> },
  { label: "Avaliação", icon: <Package className="w-3 h-3" /> },
  { label: "Recentes", icon: <SlidersHorizontal className="w-3 h-3" /> },
];

export function Search() {
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <section
      id="busca"
      aria-label="Busca inteligente"
      className="py-6 lg:py-10 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 60%, rgba(217,142,4,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-start gap-3 lg:gap-16 lg:flex-row-reverse">
          {/* Phone — left on mobile, right on desktop */}
          <div className="flex-shrink-0">
            <PhoneMockup size="lg">
              <div className="relative h-full w-full">
                <Image
                  src="/images/buscar.webp"
                  alt="Busca de cartas Pokémon TCG no catálogo do CardTroca"
                  fill
                  unoptimized
                  sizes="300px"
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </PhoneMockup>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Busca inteligente
            </p>
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-black text-ds-text-primary leading-tight mb-4">
              Encontre exatamente{" "}
              <span className="text-gradient-primary">o que procura.</span>
            </h2>
            <p className="text-sm sm:text-lg text-ds-text-secondary leading-relaxed mb-4">
              Pesquise no catálogo e encontre anúncios à venda por nome ou código da carta.
            </p>
            <p className="text-base text-ds-text-secondary leading-relaxed mb-10">
              A busca atual combina catálogo TCG, anúncios, distância, condição, preço,
              reputação do usuário e ordenação por resultados recentes.
            </p>

            {/* Filters — desktop only */}
            <div className="hidden lg:block space-y-3">
              {filters.map((filter, i) => (
                <div
                  key={filter.label}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setActiveFilter(i)}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      activeFilter === i
                        ? "bg-primary text-white shadow-primary-glow"
                        : "bg-ds-bg-tertiary text-ds-text-tertiary group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {filter.icon}
                  </div>
                  <span
                    className={`font-medium text-sm transition-colors duration-200 ${
                      activeFilter === i ? "text-primary" : "text-ds-text-secondary group-hover:text-ds-text-primary"
                    }`}
                  >
                    Ordenar por {filter.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters — mobile 2-col grid */}
        <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
          {filters.map((filter, i) => (
            <div
              key={filter.label}
              className="p-3 rounded-xl bg-ds-surface border border-ds-border flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveFilter(i)}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  activeFilter === i
                    ? "bg-primary text-white shadow-primary-glow"
                    : "bg-ds-bg-tertiary text-ds-text-tertiary"
                }`}
              >
                {filter.icon}
              </div>
              <span className={`text-xs font-medium ${activeFilter === i ? "text-primary" : "text-ds-text-secondary"}`}>
                {filter.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
