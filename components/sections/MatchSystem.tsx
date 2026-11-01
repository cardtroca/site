"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PhoneMockup } from "@/components/PhoneMockup";
import { MessageCircle, Sparkles, Zap } from "lucide-react";

const steps = [
  { icon: "📦", title: "Você anuncia uma carta", desc: "Cadastre condição, idioma, preço e disponibilidade para troca, venda ou ambos." },
  { icon: "🔍", title: "Você define o que busca", desc: "Use uma carta específica ou sua lista de desejos como referência." },
  { icon: "🤝", title: "O app monta o feed", desc: "O CardTroca considera desejo, distância, valor, condição e reputação." },
  { icon: "💬", title: "O chat pode ser aberto", desc: "Com interesse mútuo, você decide abrir a conversa e negociar." },
];

export function MatchSystem() {
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="match"
      aria-label="Sistema de Match"
      className="py-6 lg:py-10 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 50%, rgba(14,147,132,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-start gap-3 lg:gap-16 lg:flex-row-reverse">
          {/* Phone — left on mobile, right on desktop */}
          <div className="flex-shrink-0">
            <PhoneMockup size="lg">
              <div className="relative h-full w-full">
                <Image
                  src="/images/swipe.webp"
                  alt="Modo troca do CardTroca: deslize a carta para propor uma troca"
                  fill
                  unoptimized
                  priority
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
              Sistema de Match
            </p>
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-black text-ds-text-primary leading-tight mb-4">
              Um match para{" "}
              <span className="text-gradient-primary">cada oportunidade.</span>
            </h2>
            <p className="text-sm sm:text-lg text-ds-text-secondary leading-relaxed mb-4">
              Informe o que você possui e o que procura. O CardTroca encontra pessoas
              compatíveis próximas de você.
            </p>
            <p className="text-xs sm:text-base text-ds-text-secondary leading-relaxed mb-6 sm:mb-10">
              Inspirado na simplicidade dos aplicativos de relacionamento, o modo troca
              transforma uma busca dispersa em um fluxo direto: passar ou demonstrar interesse.
            </p>

            {/* Steps — desktop only */}
            <div className="hidden lg:block space-y-4">
              {steps.map((step) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl glass border-gradient flex items-center justify-center text-lg flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-bold text-ds-text-primary text-sm">{step.title}</p>
                    <p className="text-sm text-ds-text-secondary">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits row — desktop only */}
            <div className="hidden lg:flex flex-wrap gap-2 mt-8">
              {["Menos buscas manuais", "Lista de desejos", "Raio configurável", "Chat após match"].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium"
                >
                  <Zap className="w-3 h-3" />
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Steps — mobile 2-col grid */}
        <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
          {steps.map((step) => (
            <div key={step.title} className="p-3 rounded-xl bg-ds-surface border border-ds-border">
              <div className="text-xl mb-2">{step.icon}</div>
              <p className="font-bold text-ds-text-primary text-xs mb-1">{step.title}</p>
              <p className="text-xs text-ds-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 lg:mt-24 flex flex-row items-start gap-3 lg:gap-16">
          <div className="flex-shrink-0">
            <PhoneMockup size="lg">
              <div className="relative h-full w-full">
                <Image
                  src="/images/match.webp"
                  alt="Match no CardTroca quando dois colecionadores querem trocar"
                  fill
                  unoptimized
                  sizes="300px"
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </PhoneMockup>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Depois do swipe
            </p>
            <h3 className="text-xl sm:text-3xl font-black text-ds-text-primary leading-tight mb-4">
              O match acontece quando{" "}
              <span className="text-gradient-primary">os dois lados demonstram interesse.</span>
            </h3>
            <p className="text-sm sm:text-lg text-ds-text-secondary leading-relaxed mb-6 sm:mb-8">
              Quando a intenção é mútua, o CardTroca confirma o match e libera o próximo
              passo da negociação: abrir o chat para combinar detalhes, condição, envio ou
              encontro presencial.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Interesse mútuo", icon: <Sparkles className="w-3 h-3" /> },
                { label: "Chat liberado", icon: <MessageCircle className="w-3 h-3" /> },
                { label: "Negociação direta", icon: <Zap className="w-3 h-3" /> },
              ].map((it) => (
                <span
                  key={it.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium"
                >
                  {it.icon}
                  {it.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
