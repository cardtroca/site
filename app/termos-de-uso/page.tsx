import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso | CardTroca",
  description: "Termos de Uso do CardTroca, app para comprar, vender e trocar cartas TCG entre colecionadores.",
  alternates: { canonical: "/termos-de-uso" },
};

const sections = [
  {
    title: "1. Aceitação dos Termos",
    content:
      "Ao usar o CardTroca, você concorda com estes Termos de Uso. Leia-os atentamente antes de criar uma conta, anunciar cartas, comprar, vender, trocar ou conversar com outros usuários.",
  },
  {
    title: "2. Serviço",
    content:
      "O CardTroca é uma plataforma de marketplace para compra, venda e troca de cartas TCG entre usuários. A base atual está preparada para cartas Pokémon TCG. O app organiza anúncios, busca, lista de desejos, modo troca, chats e reputação, mas não é parte das negociações, produtos ou encontros entre usuários.",
  },
  {
    title: "3. Responsabilidade do usuário",
    content:
      "Você é responsável pela veracidade dos dados cadastrados, pela segurança da sua conta, pelas condutas realizadas durante encontros e pelas negociações feitas pelo app. Antes de concluir qualquer troca ou venda, confira a carta, a condição, o idioma, o preço e as informações do outro usuário.",
  },
  {
    title: "4. Créditos e pagamentos",
    content:
      "Créditos podem ser usados para ações específicas, como criar anúncios, abrir chats e destacar cartas. Créditos adquiridos não são reembolsáveis após consumo. Assinaturas Pro são renovadas automaticamente até cancelamento pela loja de aplicativos correspondente.",
  },
  {
    title: "5. Segurança",
    content:
      "O CardTroca recomenda fortemente que encontros presenciais sejam realizados em locais públicos e seguros. O app não se responsabiliza por incidentes ocorridos durante encontros ou negociações realizadas fora da plataforma.",
  },
  {
    title: "6. Moderação",
    content:
      "Reservamos o direito de suspender contas que violem estes termos, pratiquem fraudes, publiquem informações falsas, tenham comportamento abusivo ou coloquem outros usuários em risco.",
  },
  {
    title: "7. Suporte",
    content:
      "Para assuntos relacionados aos termos, privacidade ou suporte, entre em contato pelo e-mail contato@cardtroca.com.",
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Termos"
      title="Termos de Uso"
      updated="Maio de 2026"
      intro="Regras de uso da plataforma CardTroca para compra, venda e troca de cartas TCG entre colecionadores."
      sections={sections}
    />
  );
}
