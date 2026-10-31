"use client";

import Image from "next/image";
import { PhoneMockup } from "@/components/PhoneMockup";
import { Heart, Bell, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Base para o modo troca",
    desc: "Use a lista como referência para encontrar anúncios compatíveis.",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: "Destaques relevantes",
    desc: "Cartas marcadas como destaque podem aparecer para quem já demonstrou interesse.",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Desejos organizados",
    desc: "Mantenha suas prioridades de coleção separadas dos seus anúncios.",
  },
];

export function Wishlist() {
  return (
    <section
      id="lista-de-desejos"
      aria-label="Lista de desejos"
      className="py-6 lg:py-10 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 80% 40%, rgba(14,147,132,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-start gap-3 lg:gap-16">
          {/* Wishlist screen — left always */}
          <div className="flex-shrink-0">
            <PhoneMockup size="lg">
              <div className="relative h-full w-full">
                <Image
                  src="/images/desejos.webp"
                  alt="Lista de desejos do CardTroca com cartas Pokémon salvas"
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
              Lista de desejos
            </p>
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-black text-ds-text-primary leading-tight mb-4">
              Monte sua lista{" "}
              <span className="text-gradient-primary">de desejos.</span>
            </h2>
            <p className="text-sm sm:text-lg text-ds-text-secondary leading-relaxed mb-6 sm:mb-10">
              Adicione cartas que deseja encontrar e use essa lista para orientar buscas,
              destaques e o modo troca.
            </p>

            {/* Benefits — desktop only */}
            <div className="hidden lg:block space-y-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-ds-text-primary mb-1">{benefit.title}</h3>
                    <p className="text-sm text-ds-text-secondary leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:block mt-10 p-4 rounded-2xl bg-primary/8 border border-primary/15">
              <p className="text-sm text-primary font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                Quanto melhor sua lista, mais fácil configurar uma troca relevante.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits — mobile 2-col grid */}
        <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="p-3 rounded-xl bg-ds-surface border border-ds-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
                {benefit.icon}
              </div>
              <p className="font-bold text-ds-text-primary text-xs mb-1">{benefit.title}</p>
              <p className="text-xs text-ds-text-secondary leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
