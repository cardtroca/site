"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Crown, Sparkles, X } from "lucide-react";
import { openAppStore } from "@/components/AppDownloadButton";

const plans = [
  {
    id: "credits",
    name: "Créditos",
    price: "Sem mensalidade",
    period: "pacotes de créditos à parte",
    description: "Para começar a encontrar cartas, montar anúncios e negociar no seu ritmo.",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-slate-500 to-gray-600",
    features: [
      { label: "Busca no catálogo", value: "Incluído", included: true },
      { label: "Busca de cartas à venda com filtros", value: "Incluído", included: true },
      { label: "Cartas próximas a você", value: "Incluído", included: true },
      { label: "Adicionar cartas por busca", value: "Incluído", included: true },
      { label: "Modo troca", value: "Incluído", included: true },
      { label: "Lista de desejos", value: "Incluído", included: true },
      { label: "Avaliações", value: "Incluído", included: true },
      { label: "Adicionar cartas com Scanner IA", value: "Disponível no Pro", included: false },
      { label: "Conversas e ações com créditos", value: "Conforme o uso", included: false },
      { label: "Álbum por set e coleções personalizadas", value: "Disponível no Pro", included: false },
      { label: "Observadores das suas cartas", value: "Disponível no Pro", included: false },
      { label: "Destaque Pro", value: "Disponível no Pro", included: false },
    ],
    cta: "Ver pacotes de créditos",
    variant: "secondary" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 19,90",
    period: "por mês",
    description: "Para quem quer organizar a coleção e negociar com recursos avançados.",
    icon: <Crown className="w-5 h-5" />,
    color: "from-accent to-amber-500",
    recommended: true,
    features: [
      { label: "Busca no catálogo", value: "Incluído", included: true },
      { label: "Busca de cartas à venda com filtros", value: "Incluído", included: true },
      { label: "Cartas próximas a você", value: "Incluído", included: true },
      { label: "Adicionar cartas por busca", value: "Incluído", included: true },
      { label: "Modo troca", value: "Incluído", included: true },
      { label: "Lista de desejos", value: "Incluído", included: true },
      { label: "Avaliações", value: "Incluído", included: true },
      { label: "Adicionar cartas com Scanner IA", value: "Incluído", included: true },
      { label: "Conversas sem limite de créditos", value: "Incluído", included: true },
      { label: "Álbum por set e coleções personalizadas", value: "Incluído", included: true },
      { label: "Observadores das suas cartas", value: "Incluído", included: true },
      { label: "Scanner e destaque Pro", value: "Incluído", included: true },
    ],
    cta: "Assinar Pro",
    variant: "accent" as const,
  },
];

export function Plans() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px 0px" });
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="planos"
      aria-label="Planos e preços"
      className="section-padding bg-ds-bg-secondary relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,147,132,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={shouldReduce ? {} : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
            Planos
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ds-text-primary leading-tight mb-6">
            Escolha a experiência{" "}
            <span className="text-gradient-primary">ideal.</span>
          </h2>
          <p className="text-lg text-ds-text-secondary leading-relaxed">
            Use o app sem mensalidade comprando pacotes de créditos para ações específicas,
            ou evolua para o Pro quando quiser negociar sem limites.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={shouldReduce ? {} : { opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <div
                className={`relative rounded-3xl overflow-hidden ${
                  plan.recommended
                    ? "shadow-primary-glow-lg border border-primary/30"
                    : "border border-ds-border shadow-elevation-2"
                } bg-ds-surface h-full`}
              >
                {/* Recommended badge */}
                {plan.recommended && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary" />
                )}

                <div className="p-8 h-full flex flex-col">
                  {/* Plan header */}
                  <div className="flex items-start justify-between mb-6 min-h-[148px]">
                    <div>
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-3 shadow-elevation-2`}
                      >
                        {plan.icon}
                      </div>
                      <h3 className="font-black text-xl text-ds-text-primary">{plan.name}</h3>
                      <p className="text-sm text-ds-text-secondary mt-1">{plan.description}</p>
                    </div>
                    {plan.recommended && (
                      <Badge variant="primary" size="sm">
                        Popular
                      </Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-ds-border min-h-[88px]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-ds-text-primary">{plan.price}</span>
                    </div>
                    <p className="text-sm text-ds-text-tertiary mt-1">{plan.period}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1" role="list">
                    {plan.features.map((feature) => (
                      <li key={feature.label} className="flex items-start gap-3 min-h-[44px]">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            feature.included && plan.recommended
                              ? "bg-primary/15 border border-primary/25"
                              : feature.included
                                ? "bg-emerald-500/10 border border-emerald-500/20"
                                : "bg-red-500/10 border border-red-500/25"
                          }`}
                        >
                          {feature.included ? (
                            <Check
                              className={`w-3 h-3 ${plan.recommended ? "text-primary" : "text-emerald-500"}`}
                            />
                          ) : (
                            <X className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                        <div>
                          <span className={`block text-sm font-medium ${
                            feature.included ? "text-ds-text-secondary" : "text-ds-text-tertiary line-through decoration-ds-text-tertiary/70"
                          }`}>
                            {feature.label}
                          </span>
                          <span className={`block text-xs ${
                            feature.included ? "text-ds-text-tertiary" : "text-ds-text-tertiary/70"
                          }`}>
                            {feature.value}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    variant={plan.variant}
                    size="md"
                    fullWidth
                    className={plan.recommended ? "shadow-primary-glow" : ""}
                    onClick={openAppStore}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-sm text-ds-text-tertiary mt-10"
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          No modo Créditos, algumas ações consomem créditos comprados em pacotes. No Pro, os recursos avançados ficam liberados enquanto a assinatura estiver ativa.
        </motion.p>
      </div>
    </section>
  );
}
