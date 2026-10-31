"use client";

import Image from "next/image";
import Link from "next/link";
import { openCookiePreferences } from "@/components/CookieConsent";

const footerLinks = {
  suporte: [
    { label: "Central de ajuda", href: "/central-de-ajuda" },
    { label: "Politica de privacidade", href: "/politica-de-privacidade" },
    { label: "Termos de uso", href: "/termos-de-uso" },
  ],
  comunidade: [
    { label: "Instagram", href: "https://www.instagram.com/cardtroca" },
  ],
};

export function Footer() {
  const renderLink = (link: { label: string; href: string }) => {
    const className = "text-sm text-ds-text-secondary hover:text-ds-text-primary transition-colors duration-200";

    if (link.href.startsWith("http")) {
      return (
        <a href={link.href} target="_blank" rel="noreferrer" className={className}>
          {link.label}
        </a>
      );
    }

    return (
      <Link href={link.href} className={className}>
        {link.label}
      </Link>
    );
  };

  return (
    <footer
      className="border-t border-ds-border bg-ds-bg-secondary"
      aria-label="Rodapé"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <a
              href="/"
              className="flex items-center gap-2.5"
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
            <p className="text-ds-text-secondary text-sm leading-relaxed max-w-xs">
              A plataforma definitiva para colecionadores TCG.
            </p>
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-ds-text-tertiary">
                <span
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                Em desenvolvimento ativo
              </span>
            </div>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-ds-text-primary text-sm mb-4 uppercase tracking-wider">
              Suporte
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.suporte.map((link) => (
                <li key={link.label}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h3 className="font-semibold text-ds-text-primary text-sm mb-4 uppercase tracking-wider">
              Comunidade
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.comunidade.map((link) => (
                <li key={link.label}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-ds-border flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-ds-text-tertiary">
              © {new Date().getFullYear()} CardTroca. Todos os direitos reservados.
            </p>
            <p className="text-xs text-ds-text-tertiary">
              Software criado e registrado por <span className="font-medium text-ds-text-secondary">Blur Tecnologia</span>.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <p className="text-xs text-ds-text-tertiary text-center sm:text-right">
              Imagens das cartas © The Pokémon Company. Dados fornecidos por TCGdex e Pokémon TCG API.
            </p>
            <button
              type="button"
              onClick={openCookiePreferences}
              className="text-xs text-ds-text-tertiary underline underline-offset-2 transition-colors hover:text-ds-text-primary"
            >
              Preferências de cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
