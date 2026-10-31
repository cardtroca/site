"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { AppStoreBadgeButton } from "@/components/AppStoreBadgeButton";
import { openAppStore } from "@/components/AppDownloadButton";
import { Download, Sparkles } from "lucide-react";

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="download"
      aria-label="Baixar o CardTroca"
      className="relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 35%, var(--color-secondary) 65%, var(--color-primary) 100%)",
        }}
      />

      {/* Mesh overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(0,0,0,0.2) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* Floating card decorations */}
      {!shouldReduce && (
        <>
          {[
            { emoji: "🔥", x: "5%", y: "20%", rotate: -20, delay: 0 },
            { emoji: "⚡", x: "90%", y: "15%", rotate: 15, delay: 1 },
            { emoji: "🌑", x: "8%", y: "70%", rotate: 10, delay: 0.5 },
            { emoji: "💧", x: "88%", y: "65%", rotate: -12, delay: 1.5 },
            { emoji: "✨", x: "50%", y: "5%", rotate: 5, delay: 0.8 },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20 select-none pointer-events-none"
              style={{ left: card.x, top: card.y, rotate: card.rotate }}
              animate={shouldReduce ? {} : {
                y: [0, -20, 0],
                rotate: [card.rotate, card.rotate + 5, card.rotate],
              }}
              transition={{ duration: 5 + card.delay, repeat: Infinity, delay: card.delay, ease: "easeInOut" }}
              aria-hidden="true"
            >
              {card.emoji}
            </motion.div>
          ))}
        </>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32" ref={ref}>
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Disponível para colecionadores</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] mb-6"
            initial={shouldReduce ? {} : { opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Leve sua coleção{" "}
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "2px rgba(255,255,255,0.5)",
              }}
            >
              mais longe.
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            className="text-xl text-white/75 leading-relaxed max-w-2xl mx-auto mb-12"
            initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Encontre cartas, acompanhe sua coleção e negocie Pokémon TCG com pessoas da sua região.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <a
              href="#recursos"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-primary bg-white shadow-elevation-4 hover:shadow-elevation-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              aria-label="Conhecer os recursos do CardTroca"
            >
              <Sparkles className="w-5 h-5" />
              Conhecer recursos
            </a>
            <button
              type="button"
              onClick={openAppStore}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 active:scale-[0.98] transition-all duration-200"
              aria-label="Baixar o CardTroca"
            >
              <Download className="w-5 h-5" />
              Baixar o app
            </button>
          </motion.div>

          {/* App store badges */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
            initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <AppStoreBadgeButton store="apple" />
            <AppStoreBadgeButton store="google" />
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/60"
            initial={shouldReduce ? {} : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            {[
              "✓ Créditos para começar",
              "✓ Pagamento por Pix",
              "✓ Premium mensal opcional",
            ].map((item) => (
              <span key={item} className="text-sm font-medium">
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
