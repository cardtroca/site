import type { Metadata } from "next";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Central de Ajuda | CardTroca",
  description: "Perguntas frequentes do CardTroca: créditos e Pro, busca e lista de desejos, anúncios, modo troca, avaliações e segurança em encontros.",
  alternates: { canonical: "/central-de-ajuda" },
};

const sections = [
  {
    title: "O que é o CardTroca?",
    content:
      "O CardTroca é um app para colecionadores de TCG anunciarem, comprarem, venderem e trocarem cartas entre si. Você cadastra sua biblioteca, encontra colecionadores próximos e negocia diretamente pelo chat. A base atual está preparada para cartas Pokémon TCG.",
  },
  {
    title: "Créditos e Pro",
    content:
      "No modo Créditos, algumas ações consomem créditos comprados em pacotes ou obtidos por recompensas. Os créditos não expiram. No Pro, chats, matches, anúncios e destaques ficam liberados conforme as regras do plano ativo.",
  },
  {
    title: "Busca de cartas e Lista de Desejos",
    content:
      "A busca possui catálogo e cartas à venda. No catálogo, pesquise pelo nome da carta ou código. Em cartas à venda, use filtros de distância, condição, preço, avaliação e recentes. A Lista de Desejos permite salvar cartas que você procura e usar essas preferências no app.",
  },
  {
    title: "Adicionar e anunciar cartas",
    content:
      "Para adicionar uma carta, informe o código, selecione o resultado correto e preencha idioma, condição, disponibilidade, preço, observações e dados de graduação quando houver. Ao criar anúncio, podem ser consumidos créditos, incluindo créditos extras caso você escolha destaque.",
  },
  {
    title: "Modo Troca",
    content:
      "No modo troca, escolha o que você quer receber, selecione uma carta sua para oferecer e defina a distância máxima. Depois, veja ofertas compatíveis e sinalize interesse. Quando dois usuários demonstram interesse, acontece o match e o chat pode ser aberto para negociação.",
  },
  {
    title: "Destaques e cartas próximas",
    content:
      "A tela inicial mostra destaques e cartas próximas de você. As cartas próximas usam sua localização aproximada ou cidade cadastrada. Os destaques ajudam anúncios a aparecerem com mais visibilidade nas áreas certas do app.",
  },
  {
    title: "Sistema de avaliação",
    content:
      "Ao encerrar uma negociação, o usuário pode indicar se houve negócio ou não. Com negócio, a contagem de trocas ou vendas é atualizada no perfil e uma avaliação pode ser registrada. Chats encerrados ficam arquivados na lista de conversas.",
  },
  {
    title: "Segurança em encontros",
    content:
      "Ao combinar uma troca ou venda presencial, prefira locais públicos, movimentados e seguros. Confira a carta, estado, idioma, preço e reputação do outro usuário antes de concluir a negociação.",
  },
  {
    title: "Suporte",
    content:
      "Para suporte, privacidade ou dúvidas sobre a conta, envie uma mensagem para contato@cardtroca.com.",
  },
];

export default function HelpPage() {
  return (
    <>
      <FaqJsonLd items={sections} />
      <LegalPage
        eyebrow="Ajuda"
        title="Central de Ajuda"
        intro="Perguntas frequentes e manual resumido das principais áreas do CardTroca."
        sections={sections}
      />
    </>
  );
}
