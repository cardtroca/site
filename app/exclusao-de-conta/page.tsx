import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Exclusão de Conta | CardTroca",
  description: "Saiba como solicitar a exclusão da sua conta e dados no CardTroca.",
  alternates: { canonical: "/exclusao-de-conta" },
};

const sections = [
  {
    title: "Como solicitar a exclusão",
    content:
      "Envie um e-mail para contato@cardtroca.com com o assunto \"Exclusão de conta\" e o endereço de e-mail vinculado à sua conta. Nossa equipe processará o pedido em até 30 dias.",
  },
  {
    title: "Dados que serão excluídos",
    content:
      "Ao confirmar a exclusão, removemos permanentemente: seu perfil e dados de conta, anúncios e histórico de negociações, mensagens de chat, lista de desejos, avaliações e saldo de créditos.",
  },
  {
    title: "Dados que podem ser mantidos",
    content:
      "Algumas informações podem ser retidas pelo período exigido por lei ou para fins de segurança e prevenção de fraude, como registros de transações financeiras e logs de acesso, conforme obrigação legal ou legítimo interesse.",
  },
  {
    title: "Prazo de processamento",
    content:
      "A exclusão é concluída em até 30 dias após a confirmação do pedido. Durante esse período, sua conta permanece ativa. Você receberá uma confirmação por e-mail ao final do processo.",
  },
  {
    title: "Dúvidas",
    content:
      "Para qualquer dúvida sobre o processo de exclusão ou seus dados, entre em contato pelo e-mail contato@cardtroca.com.",
  },
];

export default function AccountDeletionPage() {
  return (
    <LegalPage
      eyebrow="Conta"
      title="Exclusão de Conta"
      updated="Junho de 2026"
      intro="Veja como solicitar a exclusão da sua conta e entender quais dados são removidos."
      sections={sections}
    />
  );
}
