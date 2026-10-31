"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { MatchSystem } from "@/components/sections/MatchSystem";
import { Geolocation } from "@/components/sections/Geolocation";
import { Search } from "@/components/sections/Search";
import { Wishlist } from "@/components/sections/Wishlist";
import { Chat } from "@/components/sections/Chat";
import { FeatureCatalog } from "@/components/sections/FeatureCatalog";
import { cn } from "@/lib/utils";

const features = [
  { id: "match", label: "Sistema de Match", component: MatchSystem },
  { id: "geolocalizacao", label: "Geolocalização", component: Geolocation },
  { id: "busca", label: "Busca Inteligente", component: Search },
  { id: "desejos", label: "Lista de Desejos", component: Wishlist },
  { id: "chat", label: "Chat e Negociação", component: Chat },
];

export default function FuncionalidadesPage() {
  const [active, setActive] = useState(0);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const ActiveComponent = features[active].component;

  const handleMobileScroll = () => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    const nextActive = Math.round(scroller.scrollLeft / scroller.clientWidth);
    if (nextActive !== active && nextActive >= 0 && nextActive < features.length) {
      setActive(nextActive);
    }
  };

  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-16 lg:pt-18 min-h-screen bg-ds-bg">

        {/* Mobile: horizontal swipe hint */}
        <div className="lg:hidden bg-ds-bg border-b border-ds-border">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">
              Deslize para o lado
            </p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-ds-text-primary">
                {features[active].label}
              </span>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {features.map((feature, i) => (
                  <span
                    key={feature.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-200",
                      active === i ? "w-5 bg-primary" : "w-1.5 bg-ds-border-strong"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: sidebar + content */}
        <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          <div className="flex gap-8 items-start">
            <aside className="flex flex-col gap-2 w-56 flex-shrink-0 sticky top-28">
              <p className="text-xs font-semibold text-ds-text-tertiary uppercase tracking-widest mb-2 px-3">
                Funcionalidades
              </p>
              {features.map((feature, i) => (
                <button
                  key={feature.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    active === i
                      ? "bg-primary text-white shadow-primary-glow"
                      : "text-ds-text-secondary hover:text-ds-text-primary hover:bg-ds-bg-tertiary"
                  )}
                >
                  {feature.label}
                </button>
              ))}
            </aside>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={features[active].id}
                className="flex-1 min-w-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile content */}
        <div className="lg:hidden">
          <div
            ref={mobileScrollerRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
            aria-label="Funcionalidades do CardTroca"
          >
            {features.map((feature) => {
              const FeatureComponent = feature.component;

              return (
                <section
                  key={feature.id}
                  className="min-w-full snap-start"
                  aria-label={feature.label}
                >
                  <FeatureComponent />
                </section>
              );
            })}
          </div>
        </div>

        <FeatureCatalog />

      </main>
      <Footer />
    </>
  );
}
