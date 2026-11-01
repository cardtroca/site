"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { Volume2, VolumeX, ShieldCheck, Star, MapPin, ChevronDown } from "lucide-react";
import { AppStoreBadgeButton } from "@/components/AppStoreBadgeButton";

/* ── Conteúdo ───────────────────────────────────────────── */

type Step = {
  id: string;
  video: string;
  eyebrow: string;
  title: [string, string, string?]; // [antes, destaque, depois]
  body: string;
  chips: string[];
  glow: string;
  soon?: boolean;
};

const STEPS: Step[] = [
  {
    id: "colecao",
    video: "colecao",
    eyebrow: "Coleção",
    title: ["Saiba quanto vale ", "sua coleção"],
    body: "Valor estimado da coleção inteira, carta por carta, com sets e análises.",
    chips: ["Valor estimado", "Suas cartas", "Análises"],
    glow: "20 184 166",
  },
  {
    id: "sets",
    video: "colecao_set",
    eyebrow: "Sets",
    title: ["Veja o que ", "falta", " em cada set"],
    body: "Progresso por set mostra o que você já tem e o que falta pra completar.",
    chips: ["Base Set", "Fossil", "Neo Discovery"],
    glow: "45 212 191",
  },
  {
    id: "busca",
    video: "busca",
    eyebrow: "Busca",
    title: ["Ache ", "qualquer carta"],
    body: "Busque pelo nome e veja quem tem pra trocar ou vender.",
    chips: ["Catálogo", "À venda", "Filtros"],
    glow: "94 234 212",
  },
  {
    id: "perto",
    video: "perto",
    eyebrow: "Por perto",
    title: ["Cartas ", "perto de você"],
    body: "Mapa e distância de cada anúncio, com raio de 0 a 100 km.",
    chips: ["0–10 km", "Mapa", "Reputação"],
    glow: "52 211 153",
  },
  {
    id: "troca",
    video: "troca",
    eyebrow: "Modo troca",
    title: ["Deslize e ", "proponha a troca"],
    body: "Curtiu a carta? Arraste pro lado e ofereça uma das suas.",
    chips: ["Swipe", "Match", "Proposta"],
    glow: "16 185 129",
  },
  {
    id: "chat",
    video: "chat",
    eyebrow: "Chat",
    title: ["Combine ", "pelo chat"],
    body: "Converse, envie fotos e marque a troca em um local público.",
    chips: ["Mensagens", "Fotos", "Encontro seguro"],
    glow: "34 197 94",
  },
  {
    id: "compra",
    video: "compra",
    eyebrow: "Compra",
    title: ["Compre com ", "entrega"],
    body: "Carrinho, opção de entrega do vendedor e pagamento em um checkout só.",
    chips: ["Econômico", "Padrão", "Expresso"],
    glow: "20 184 166",
  },
  {
    id: "venda",
    video: "venda",
    eyebrow: "Venda",
    title: ["Venda e ", "acompanhe", " seus números"],
    body: "Anúncios, visualizações e vendas por mês em um painel.",
    chips: ["Anúncios", "Visualizações", "Vendas"],
    glow: "45 212 191",
  },
  {
    id: "leilao",
    video: "leilao",
    eyebrow: "Leilão",
    title: ["Lances ", "ao vivo"],
    body: "Cronômetro, lance rápido e proteção anti-sniping pra cartas disputadas.",
    chips: ["Ao vivo", "+R$ 5", "Anti-sniping"],
    glow: "245 183 61",
    soon: true,
  },
];

const SEGMENTS = STEPS.length;
const MINT = "#7CF0CF";

/* ── Utilidades ─────────────────────────────────────────── */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Distância assinada do bloco até o centro do seu segmento.
 * -0.5 = entrando por baixo, 0 = centro, +0.5 = saindo por cima.
 */
function useDistance(progress: MotionValue<number>, index: number, lag: number) {
  return useTransform(progress, (p) => {
    let d = p * SEGMENTS - index - 0.5 - lag;
    if (index === 0) d = Math.max(d, 0); // primeiro já chega visível
    if (index === SEGMENTS - 1) d = Math.min(d, 0); // último fica até soltar
    return d;
  });
}

/* ── Texto lateral que passa com desfoque ──────────────── */

function PassingBlock({
  progress,
  index,
  side,
  lag = 0,
  mobile,
  reduced,
  className,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  side: "left" | "right" | "top" | "bottom";
  lag?: number;
  mobile: boolean;
  reduced: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const d = useDistance(progress, index, lag);
  const travel = mobile ? 90 : 220;
  const maxBlur = reduced ? 0 : mobile ? 8 : 14;
  const sideways = side === "left" ? -1 : side === "right" ? 1 : 0;

  const y = useTransform(d, (v) => (reduced ? 0 : -v * travel));
  const x = useTransform(d, (v) => (reduced ? 0 : sideways * Math.abs(v) * 70));
  const scale = useTransform(d, (v) => (reduced ? 1 : 1 - Math.abs(v) * 0.08));
  // janelas se sobrepõem na troca de segmento: um sai enquanto o outro entra
  const opacity = useTransform(d, (v) => 1 - smoothstep(0.26, 0.64, Math.abs(v)));
  const filter = useTransform(d, (v) => {
    const b = maxBlur * smoothstep(0.12, 0.56, Math.abs(v));
    return b < 0.2 ? "none" : `blur(${b.toFixed(2)}px)`;
  });
  const pointerEvents = useTransform(opacity, (o) => (o > 0.6 ? "auto" : "none"));

  // posição fica no wrapper; o transform do motion.div é só do movimento
  return (
    <div className={className}>
      <motion.div
        style={{ y, x, scale, opacity, filter, pointerEvents, willChange: "transform, opacity, filter" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Title({ parts, className }: { parts: Step["title"]; className?: string }) {
  return (
    <h2
      className={className}
      style={{ fontFamily: "var(--font-poppins)", letterSpacing: "-0.02em" }}
    >
      {parts[0]}
      <span style={{ color: MINT }}>{parts[1]}</span>
      {parts[2]}
    </h2>
  );
}

/* ── Celular com vídeos empilhados ─────────────────────── */

function Phone({ active, progress, reduced }: { active: string; progress: MotionValue<number>; reduced: boolean }) {
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});
  const sources = STEPS.map((s) => s.video);

  useEffect(() => {
    Object.entries(refs.current).forEach(([key, el]) => {
      if (!el) return;
      if (key === active) {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [active]);

  // inclinação leve que acompanha o scroll
  const rotateY = useTransform(progress, (p) =>
    reduced ? 0 : Math.sin(p * SEGMENTS * Math.PI) * 7
  );
  const rotateX = useTransform(progress, (p) =>
    reduced ? 0 : Math.cos(p * SEGMENTS * Math.PI) * 3
  );

  return (
    <div style={{ perspective: 1400 }} aria-hidden="true">
      <motion.div
        style={{ rotateY, rotateX, transformStyle: "preserve-3d", willChange: "transform" }}
        className="relative w-[min(56vw,25svh)] md:w-[min(300px,31vh)] rounded-[13%/6%] p-[2.2%]"
      >
        <div
          className="absolute inset-0 rounded-[13%/6%]"
          style={{
            background: "linear-gradient(160deg,#2B333D 0%,#161A20 45%,#0D1014 100%)",
            boxShadow:
              "0 40px 120px -20px rgba(0,0,0,.85), inset 0 0 0 1px rgba(255,255,255,.08)",
          }}
        />
        <div
          className="relative overflow-hidden rounded-[11%/5.2%] bg-white"
          style={{ aspectRatio: "780 / 1688" }}
        >
          {sources.map((key) => (
            <video
              key={key}
              ref={(el) => {
                refs.current[key] = el;
              }}
              src={`/videos/${key}.mp4`}
              poster={`/videos/${key}.jpg`}
              muted
              loop
              playsInline
              preload={key === active ? "auto" : "metadata"}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: key === active ? 1 : 0,
                transform: key === active ? "scale(1)" : "scale(1.06)",
                filter: key === active || reduced ? "none" : "blur(10px)",
                transition:
                  "opacity .6s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1), filter .6s ease",
                willChange: "opacity, transform",
              }}
            />
          ))}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(130deg,rgba(255,255,255,.14) 0%,transparent 38%)" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ── Seção principal: celular fixo + textos passando ───── */

function FeatureTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.35 });

  const [segment, setSegment] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    const s = clamp(Math.floor(p * SEGMENTS), 0, SEGMENTS - 1);
    setSegment((prev) => (prev === s ? prev : s));
  });

  const active = STEPS[segment].video;
  const glow = STEPS[segment].glow;

  const bar = useTransform(progress, [0, 1], [0, 1]);
  const barOpacity = useTransform(progress, [0, 0.03, 0.96, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} style={{ height: `${SEGMENTS * 95}svh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* brilho de fundo que muda por funcionalidade */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `radial-gradient(circle, rgb(${glow} / .28) 0%, rgb(${glow} / .08) 40%, transparent 70%)`,
            transition: "background 1s ease",
          }}
        />

        {/* celular central */}
        <div className="absolute inset-0 flex items-center justify-center pt-[4svh] md:pt-0">
          <Phone active={active} progress={progress} reduced={reduced} />
        </div>

        {/* textos */}
        {/* troca por CSS (não por JS) para o HTML do servidor já servir nos dois tamanhos */}
        <div className="hidden md:block">
          <DesktopTexts progress={progress} reduced={reduced} />
        </div>
        <div className="md:hidden">
          <MobileTexts progress={progress} reduced={reduced} />
        </div>

        {/* progresso */}
        <motion.div
          style={{ opacity: barOpacity }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5"
        >
          <motion.div
            style={{ scaleX: bar, background: MINT }}
            className="h-full origin-left"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Eyebrow({ step }: { step: Step }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
      {step.eyebrow}
      {step.soon && (
        <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] tracking-normal text-amber-300">
          em breve
        </span>
      )}
    </p>
  );
}

function DesktopTexts({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const col = "absolute top-1/2 -translate-y-1/2";
  return (
    <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1280px] px-10">
      <div className="relative h-full">
        {STEPS.map((step, i) => (
          <div key={step.id}>
            <PassingBlock
              progress={progress}
              index={i}
              side="left"
              mobile={false}
              reduced={reduced}
              className={`${col} left-10 w-[min(420px,calc(50%-200px))]`}
            >
              <span
                className="mb-2 block text-sm font-semibold tabular-nums text-white/25"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <Eyebrow step={step} />
              <Title
                parts={step.title}
                className="text-4xl font-bold leading-[1.08] text-white xl:text-5xl"
              />
            </PassingBlock>
            <PassingBlock
              progress={progress}
              index={i}
              side="right"
              lag={0.05}
              mobile={false}
              reduced={reduced}
              className={`${col} right-10 w-[min(340px,calc(50%-200px))]`}
            >
              <p className="mb-5 text-lg leading-relaxed text-white/70">{step.body}</p>
              <div className="flex flex-wrap gap-2">
                {step.chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </PassingBlock>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileTexts({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const top = "absolute left-4 right-4 top-[calc(env(safe-area-inset-top)+3svh)] text-center";
  const bottom = "absolute left-5 right-5 bottom-[calc(env(safe-area-inset-bottom)+3svh)] text-center";
  return (
    <div className="pointer-events-none absolute inset-0">
      {STEPS.map((step, i) => (
        <div key={step.id}>
          <PassingBlock progress={progress} index={i} side="top" mobile reduced={reduced} className={top}>
            <div className="flex justify-center">
              <Eyebrow step={step} />
            </div>
            <Title
              parts={step.title}
              className="text-[clamp(24px,7.4vw,32px)] font-bold leading-[1.08] text-white"
            />
          </PassingBlock>
          <PassingBlock
            progress={progress}
            index={i}
            side="bottom"
            lag={0.05}
            mobile
            reduced={reduced}
            className={bottom}
          >
            <p className="text-[15px] leading-snug text-white/70">{step.body}</p>
          </PassingBlock>
        </div>
      ))}
    </div>
  );
}

/* ── Topo: resumo de 30s ────────────────────────────────── */

const enter = {
  hidden: { opacity: 0, y: 30, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

// h1 é o LCP: nunca começa invisível, só desliza
const enterLcp = {
  hidden: { y: 24 },
  show: { y: 0 },
};

function HeroReel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative mx-auto aspect-[9/16] h-[min(56svh,calc(78vw*16/9))] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_140px_-30px_rgba(20,184,166,.5)] md:h-[min(76svh,720px)]">
      <video
        ref={videoRef}
        src="/videos/promo.mp4"
        aria-label="Vídeo de 30 segundos mostrando as funcionalidades do app CardTroca"
        poster="/videos/promo.jpg"
        muted={muted}
        autoPlay
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />
      <button
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
        aria-label={muted ? "Ativar som" : "Desativar som"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="flex flex-col items-center gap-1 text-xs font-medium text-white/55 md:text-sm">
      Deslize para conhecer cada funcionalidade
      <ChevronDown className="h-4 w-4 animate-bounce" style={{ color: MINT }} />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.35 });
  // ao rolar, o topo inteiro afunda em desfoque e abre espaço pro celular
  const opacity = useTransform(p, [0, 0.75], [1, 0]);
  const scale = useTransform(p, [0, 1], reduced ? [1, 1] : [1, 0.9]);
  const y = useTransform(p, [0, 1], reduced ? [0, 0] : [0, -80]);
  const filter = useTransform(p, (v) => {
    const b = reduced ? 0 : 14 * smoothstep(0.05, 0.7, v);
    return b < 0.2 ? "none" : `blur(${b.toFixed(2)}px)`;
  });

  const stagger = (i: number) => ({
    variants: i === 0 ? enterLcp : enter,
    initial: "hidden",
    animate: "show",
    transition: { duration: 1, delay: 0.15 + i * 0.15, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section ref={ref} className="relative h-[100svh]">
      <motion.div
        style={{ opacity, scale, y, filter, willChange: "transform, opacity, filter" }}
        className="h-full"
      >
        {/* um bloco só (um h1 só): coluna no celular, título | vídeo | lojas no desktop */}
        <div className="mx-auto flex h-full max-w-[1280px] flex-col items-center justify-between px-5 pb-[calc(env(safe-area-inset-bottom)+3svh)] pt-[calc(env(safe-area-inset-top)+4svh)] text-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-12 md:px-10 md:pb-0 md:pt-10 md:text-left">
          <motion.div {...stagger(0)}>
            <p className="mb-4 hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: MINT }} />
              Pokémon TCG · Magic em breve
            </p>
            <h1
              className="text-[clamp(26px,8vw,34px)] font-extrabold leading-[1.05] text-white md:text-5xl md:leading-[1.02] xl:text-6xl"
              style={{ fontFamily: "var(--font-poppins)", letterSpacing: "-0.03em" }}
            >
              Sua coleção TCG, <span style={{ color: MINT }}>em movimento.</span>
            </h1>
          </motion.div>
          <motion.div {...stagger(1)}>
            <HeroReel />
          </motion.div>
          <motion.div {...stagger(2)} className="hidden md:block">
            <p className="mb-6 text-lg leading-relaxed text-white/65">
              Organize, encontre, troque, compre e venda cartas com colecionadores perto de você.
            </p>
            <div className="flex max-w-sm gap-3">
              <AppStoreBadgeButton store="apple" />
              <AppStoreBadgeButton store="google" />
            </div>
          </motion.div>
          <motion.div {...stagger(2)} className="md:hidden">
            <ScrollHint />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        {...stagger(3)}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        style={{ opacity }}
      >
        <ScrollHint />
      </motion.div>
    </section>
  );
}

/* ── Confiança + CTA ────────────────────────────────────── */

const reveal = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function Trust() {
  const items = [
    { icon: Star, title: "Reputação", text: "Avaliações depois de cada negociação, visíveis no perfil." },
    { icon: ShieldCheck, title: "Denúncia e bloqueio", text: "Reporte comportamento inadequado direto do chat." },
    { icon: MapPin, title: "Encontros seguros", text: "Recomendamos locais públicos, lojas e eventos de TCG." },
  ];
  return (
    <section className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center text-3xl font-bold text-white md:text-5xl"
          style={{ fontFamily: "var(--font-poppins)", letterSpacing: "-0.02em" }}
        >
          Mais confiança em <span style={{ color: MINT }}>cada negociação</span>
        </motion.h2>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <it.icon className="mb-4 h-6 w-6" style={{ color: MINT }} />
              <h3 className="mb-2 font-semibold text-white">{it.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{it.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="baixar" className="scroll-mt-24 px-4 pb-28 pt-10 text-center">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-xl"
      >
        <h2
          className="mb-4 text-4xl font-extrabold text-white md:text-6xl"
          style={{ fontFamily: "var(--font-poppins)", letterSpacing: "-0.03em" }}
        >
          Sua próxima carta <span style={{ color: MINT }}>está perto.</span>
        </h2>
        <p className="mb-8 text-white/60">Baixe grátis e comece pela sua coleção.</p>
        <div className="mx-auto flex max-w-sm gap-3">
          <AppStoreBadgeButton store="apple" />
          <AppStoreBadgeButton store="google" />
        </div>
      </motion.div>
    </section>
  );
}

/* ── Página ─────────────────────────────────────────────── */

export function MotionLanding() {
  // recarregar no meio da página faria o spring varrer todos os segmentos
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(120% 60% at 50% 0%, #0B2A24 0%, #06120F 55%, #040A09 100%)",
      }}
    >
      <header className="fixed inset-x-0 top-0 z-50 hidden md:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-10 py-5">
          <a href="/" aria-label="CardTroca — início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/wordmark_dark.svg" alt="CardTroca" className="h-6 w-auto" />
          </a>
          <a
            href="#baixar"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#04201B]"
            style={{ background: MINT }}
          >
            Baixar o app
          </a>
        </div>
      </header>
      <Hero />
      <FeatureTrack />
      <Trust />
      <FinalCTA />
    </div>
  );
}
