"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
  useReducedMotion,
} from "framer-motion";
import { PhoneMockup } from "@/components/PhoneMockup";
import { MapPin, Heart, MessageCircle, Layers, SlidersHorizontal } from "lucide-react";

/* ── App screens ──────────────────────────── */

function FeedScreen() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/proximas.webp"
        alt="Cartas à venda perto de você no CardTroca"
        fill
        unoptimized
        sizes="300px"
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}

function MapScreen() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/localizacao.webp"
        alt="Filtro de distância e localização no CardTroca"
        fill
        unoptimized
        sizes="300px"
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}

function TradeSetupScreen() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/troca1.webp"
        alt="Configuração de troca no CardTroca: carta oferecida e carta desejada"
        fill
        unoptimized
        sizes="300px"
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}

function TradeSwipeScreen() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/swipe.webp"
        alt="Modo troca do CardTroca: deslize a carta para propor uma troca"
        fill
        unoptimized
        sizes="300px"
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}

function ChatScreen() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/chat2.webp"
        alt="Chat de negociação entre colecionadores no CardTroca"
        fill
        unoptimized
        sizes="300px"
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}

/* ── Per-screen animated wrapper ─────────────── */
/* Each screen owns its transforms — no hooks in callbacks */

interface ScreenLayerProps {
  screenIndex: MotionValue<number>;
  idx: number;
  children: React.ReactNode;
}

function ScreenLayer({ screenIndex, idx, children }: ScreenLayerProps) {
  const opacity = useTransform(
    screenIndex,
    [idx - 0.7, idx - 0.25, idx + 0.25, idx + 0.7],
    [0, 1, 1, 0]
  );
  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, zIndex: 10 + idx }}
    >
      {children}
    </motion.div>
  );
}

/* ── Text row per screen ─────────────────────── */

interface TextRowProps {
  screenIndex: MotionValue<number>;
  idx: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

function TextRow({ screenIndex, idx, title, subtitle, icon }: TextRowProps) {
  const opacity = useTransform(
    screenIndex,
    [idx - 0.4, idx - 0.2, idx + 0.2, idx + 0.4],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    screenIndex,
    [idx - 0.4, idx - 0.2, idx + 0.2, idx + 0.4],
    [14, 0, 0, -14]
  );
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-start gap-4 p-3 lg:p-5 rounded-2xl"
    >
      <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2 lg:mb-3">
          <span className="text-sm lg:text-base font-bold text-primary/70 uppercase tracking-wider">
            0{idx + 1}
          </span>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-ds-text-primary leading-tight">{title}</h3>
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-ds-text-secondary leading-relaxed">{subtitle}</p>
      </div>
    </motion.div>
  );
}

/* ── Progress bar per screen ─────────────────── */

interface ProgressBarProps {
  screenIndex: MotionValue<number>;
  idx: number;
}

function ProgressBar({ screenIndex, idx }: ProgressBarProps) {
  const scaleX = useTransform(
    screenIndex,
    [idx - 0.5, idx, idx + 0.5],
    [0, 1, 0]
  );
  return (
    <div className="h-1 rounded-full flex-1 bg-ds-border overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        style={{ scaleX, transformOrigin: "left" }}
      />
    </div>
  );
}

/* ── Config ──────────────────────────────────── */

const screens = [
  {
    id: "feed",
    title: "Veja ofertas e destaques",
    subtitle: "Acompanhe cartas anunciadas, destaques e opções próximas de você.",
    icon: <Layers className="w-5 h-5" />,
    component: <FeedScreen />,
  },
  {
    id: "map",
    title: "Filtre por distância",
    subtitle: "Use sua localização ou cidade cadastrada para encontrar cartas em um raio definido.",
    icon: <MapPin className="w-5 h-5" />,
    component: <MapScreen />,
  },
  {
    id: "trade-setup",
    title: "Configure sua troca",
    subtitle: "Defina o que quer receber, escolha uma carta para oferecer e ajuste a distância máxima.",
    icon: <SlidersHorizontal className="w-5 h-5" />,
    component: <TradeSetupScreen />,
  },
  {
    id: "trade-swipe",
    title: "Demonstre interesse",
    subtitle: "Veja ofertas compatíveis e sinalize se quer avançar para uma possível negociação.",
    icon: <Heart className="w-5 h-5" />,
    component: <TradeSwipeScreen />,
  },
  {
    id: "chat",
    title: "Converse e negocie",
    subtitle: "Depois do match ou de uma oferta, converse, envie imagens e encerre a negociação.",
    icon: <MessageCircle className="w-5 h-5" />,
    component: <ChatScreen />,
  },
];

/* ── Main ────────────────────────────────────── */

export function PhoneScroll() {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phone 3-D transforms — all at top level ✓
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [shouldReduce ? 0 : 18, 0, 0, shouldReduce ? 0 : -18]
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [shouldReduce ? 0 : 6, 0, shouldReduce ? 0 : -4]
  );
  const phoneScale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.82, 1, 1, 0.82]
  );

  // Continuous 0-4 index driven by scroll — top level
  const screenIndex = useTransform(
    scrollYProgress,
    [0.05, 0.25, 0.45, 0.65, 0.85],
    [0, 1, 2, 3, 4]
  );

  return (
    <section
      id="como-funciona"
      aria-label="Como o CardTroca funciona"
      className="relative bg-ds-bg-secondary"
      ref={containerRef}
      style={{ height: "760vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-3 lg:mb-0 lg:absolute lg:top-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-full px-4 pointer-events-none">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
              Como funciona
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-ds-text-primary">
              Uma experiência de TCG começando por Pokémon TCG
            </h2>
          </div>

          <div className="flex flex-row items-center gap-4 lg:gap-16 lg:pt-24">
            {/* ── Phone column ── */}
            <div className="flex-shrink-0 flex justify-center lg:justify-end">
              <motion.div
                style={{
                  rotateY,
                  rotateX,
                  scale: phoneScale,
                  transformPerspective: 1200,
                  transformStyle: "preserve-3d",
                }}
                className="relative"
              >
                <PhoneMockup size="lg">
                  <div className="relative h-full w-full">
                    {screens.map((screen, idx) => (
                      <ScreenLayer
                        key={screen.id}
                        screenIndex={screenIndex}
                        idx={idx}
                      >
                        {screen.component}
                      </ScreenLayer>
                    ))}
                  </div>
                </PhoneMockup>
              </motion.div>
            </div>

            {/* ── Text column ── */}
            <div className="flex-1 min-w-0">
              {/* Stacked text — only active item visible */}
              <div className="relative h-64 lg:h-72">
                {screens.map((screen, idx) => (
                  <TextRow
                    key={screen.id}
                    screenIndex={screenIndex}
                    idx={idx}
                    title={screen.title}
                    subtitle={screen.subtitle}
                    icon={screen.icon}
                  />
                ))}
              </div>

              {/* Progress bars */}
              <div className="mt-4 flex gap-2" aria-hidden="true">
                {screens.map((screen, idx) => (
                  <ProgressBar key={screen.id} screenIndex={screenIndex} idx={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
