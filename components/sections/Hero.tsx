"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PhoneMockup } from "@/components/PhoneMockup";
import { TcgCard } from "@/components/TcgCard";
import { ArrowDown, Sparkles, FlaskConical } from "lucide-react";
import { AppStoreBadgeButton } from "@/components/AppStoreBadgeButton";
import Link from "next/link";

function HeroAppScreen() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/home.webp"
        alt="Tela inicial do app CardTroca com valor da coleção, atalhos e anúncios em destaque"
        fill
        priority
        unoptimized
        sizes="300px"
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}

const floatingCards = [
  { name: "Carta holo", type: "fire" as const, power: 2800, rarity: 3 as const, delay: 0, x: -200, y: -60, rotate: -15 },
  { name: "Promo rara", type: "electric" as const, power: 1600, rarity: 2 as const, delay: 1.5, x: 180, y: 40, rotate: 12 },
  { name: "Treinador", type: "dark" as const, power: 2200, rarity: 3 as const, delay: 0.8, x: -160, y: 160, rotate: -8 },
  { name: "Energia esp.", type: "water" as const, power: 1900, rarity: 2 as const, delay: 2, x: 200, y: -120, rotate: 18 },
];

export function Hero() {
  const shouldReduce = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  // h1 é o LCP element — nunca começa com opacity:0 para não atrasar o LCP
  const itemLcp = {
    hidden: { y: 24 },
    visible: { y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      id="hero"
      aria-label="Apresentação do CardTroca"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-ds-bg" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(14,147,132,0.15) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-mesh" />

      {/* Decorative orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 dark:opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 dark:opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center min-h-screen lg:min-h-0 lg:py-32">
          {/* Content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1"
          >
            <motion.div variants={item}>
              <div className="mb-6 flex flex-col items-start gap-2">
                <Badge variant="primary" dot>
                  <Sparkles className="w-3 h-3" />
                  Preparado para Pokémon TCG
                </Badge>
                <Badge variant="neutral" dot>
                  Magic - Em breve
                </Badge>
              </div>
            </motion.div>

            <motion.h1
              variants={itemLcp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] mb-6"
            >
              Troque, compre{" "}
              <span className="text-gradient-primary">
                e anuncie cartas TCG
              </span>{" "}
              com pessoas próximas.
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg sm:text-xl text-ds-text-secondary leading-relaxed max-w-lg mb-10"
            >
              A plataforma definitiva para colecionadores TCG.
              Com catálogo, anúncios, lista de desejos, modo troca, chat e reputação —
              preparada neste momento para cartas Pokémon TCG.
            </motion.p>

            <motion.div variants={item} className="flex flex-col gap-4 w-full max-w-sm">
              <div className="flex flex-row gap-3">
                <AppStoreBadgeButton store="apple" />
                <AppStoreBadgeButton store="google" />
              </div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={item}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {["R", "A", "M", "C", "P"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-ds-bg flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: `hsl(${i * 60 + 240}, 70%, 55%)`,
                      zIndex: 5 - i,
                    }}
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className="text-amber-400 text-xs">★</span>
                  ))}
                </div>
                <p className="text-xs text-ds-text-secondary">
                  Feito para aproximar colecionadores e lojas locais
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Phone + floating cards */}
          <div className="order-1 lg:order-2 flex items-center justify-center relative">
            {/* Floating TCG cards */}
            {!shouldReduce && floatingCards.map((card, i) => (
              <motion.div
                key={card.name}
                className="absolute"
                style={{
                  x: card.x,
                  y: card.y,
                  rotate: card.rotate,
                  zIndex: i % 2 === 0 ? 2 : 8,
                }}
                animate={{
                  y: [card.y, card.y - 18, card.y - 8, card.y],
                  rotate: [card.rotate, card.rotate + 2, card.rotate - 1, card.rotate],
                }}
                transition={{
                  duration: 6 + card.delay,
                  repeat: Infinity,
                  delay: card.delay,
                  ease: "easeInOut",
                }}
              >
                <TcgCard
                  name={card.name}
                  type={card.type}
                  power={card.power}
                  rarity={card.rarity}
                  mini
                  className="opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-300"
                />
              </motion.div>
            ))}

            {/* Phone mockup */}
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, y: 60, scale: 0.9 }}
              animate={shouldReduce ? {} : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              {!shouldReduce && (
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <PhoneMockup size="lg">
                    <HeroAppScreen />
                  </PhoneMockup>
                </motion.div>
              )}
              {shouldReduce && (
                <PhoneMockup size="lg">
                  <HeroAppScreen />
                </PhoneMockup>
              )}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-ds-text-tertiary text-xs">Role para conhecer</span>
          <motion.div
            animate={shouldReduce ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-ds-text-tertiary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
