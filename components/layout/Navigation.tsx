"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Sun,
  Moon,
  Menu,
  X,
  Download,
} from "lucide-react";
import { openAppStore } from "@/components/AppDownloadButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/funcionalidades", label: "Funcionalidades" },
];

const supportLinks = [
  { href: "/central-de-ajuda", label: "Central de Ajuda" },
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
];

export function Navigation() {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300 ease-out",
          scrolled
            ? "glass border-b border-ds-border shadow-elevation-1"
            : "bg-transparent"
        )}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Navegação principal"
        >
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-label="CardTroca — Início"
            >
              {/* logo atual do app: verde+escuro no tema claro, verde+branco no escuro */}
              <Image
                src="/brand/wordmark_light.svg"
                alt="CardTroca"
                width={142}
                height={24}
                className="h-6 w-auto dark:hidden"
                unoptimized
              />
              <Image
                src="/brand/wordmark_dark.svg"
                alt="CardTroca"
                width={142}
                height={24}
                className="hidden h-6 w-auto dark:block"
                unoptimized
              />
            </a>

            {/* Desktop nav links */}
            <ul className="hidden lg:flex items-center gap-1" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium",
                      "text-ds-text-secondary hover:text-ds-text-primary",
                      "hover:bg-ds-bg-tertiary",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "text-ds-text-secondary hover:text-ds-text-primary",
                  "hover:bg-ds-bg-tertiary",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
                aria-label={resolvedTheme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-[22px] h-[22px]" />
                ) : (
                  <Moon className="w-[22px] h-[22px]" />
                )}
              </button>

              {/* CTA */}
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={openAppStore}
                className="hidden sm:inline-flex"
              >
                Baixe o App
              </Button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center lg:hidden",
                  "text-ds-text-secondary hover:text-ds-text-primary",
                  "hover:bg-ds-bg-tertiary",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                )}
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-[22px] h-[22px]" /> : <Menu className="w-[22px] h-[22px]" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-72 glass-strong border-l border-ds-border p-6 pt-20 animate-slide-up">
            <nav aria-label="Menu mobile">
              <ul className="space-y-1" role="list">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="block px-4 py-3 rounded-xl text-base font-medium text-ds-text-secondary hover:text-ds-text-primary hover:bg-ds-bg-tertiary transition-all duration-200"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              {/* Suporte submenu */}
              <div className="mt-4 pt-4 border-t border-ds-border">
                <p className="px-4 py-1 text-xs font-semibold text-ds-text-tertiary uppercase tracking-wider mb-1">
                  Suporte
                </p>
                <ul className="space-y-1" role="list">
                  {supportLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="block px-4 py-2.5 rounded-xl text-sm font-medium text-ds-text-secondary hover:text-ds-text-primary hover:bg-ds-bg-tertiary transition-all duration-200"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-ds-border">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => { setMobileOpen(false); openAppStore(); }}
                >
                  Baixe o App
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
