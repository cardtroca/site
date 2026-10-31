"use client";

import Image from "next/image";
import { PhoneMockup } from "@/components/PhoneMockup";
import { MessageCircle, CheckCheck, Zap } from "lucide-react";

const benefits = [
  { icon: <MessageCircle className="w-4 h-4" />, text: "Comunicação direta", desc: "Sem intermediários, você fala diretamente com o colecionador." },
  { icon: <Zap className="w-4 h-4" />, text: "Negociações objetivas", desc: "Contexto da oferta já disponível para acelerar o acordo." },
  { icon: <CheckCheck className="w-4 h-4" />, text: "Experiência simplificada", desc: "Interface limpa focada na negociação, sem distrações." },
];

export function Chat() {
  return (
    <section
      id="chat"
      aria-label="Chat e negociação"
      className="py-6 lg:py-10 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 30%, rgba(14,147,132,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-start gap-3 lg:gap-16 lg:flex-row-reverse">
          {/* Phone — left on mobile, right on desktop */}
          <div className="flex-shrink-0">
            <PhoneMockup size="lg">
              <div className="relative h-full w-full">
                <Image
                  src="/images/avaliacao.webp"
                  alt="Avaliação do colecionador após a negociação no CardTroca"
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
              Chat e negociação
            </p>
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-black text-ds-text-primary leading-tight mb-4">
              Converse diretamente com{" "}
              <span className="text-gradient-primary">outros colecionadores.</span>
            </h2>
            <p className="text-sm sm:text-lg text-ds-text-secondary leading-relaxed mb-6 sm:mb-10">
              Quando existe match ou interesse em um anúncio, o aplicativo facilita o contato
              entre as partes com mensagens, imagens, encerramento da negociação e avaliação.
            </p>

            {/* Benefits — desktop only */}
            <div className="hidden lg:block space-y-6">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <p className="font-bold text-ds-text-primary mb-0.5">{b.text}</p>
                    <p className="text-sm text-ds-text-secondary">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits — mobile 2-col grid */}
        <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
          {benefits.map((b) => (
            <div key={b.text} className="p-3 rounded-xl bg-ds-surface border border-ds-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
                {b.icon}
              </div>
              <p className="font-bold text-ds-text-primary text-xs mb-1">{b.text}</p>
              <p className="text-xs text-ds-text-secondary leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
