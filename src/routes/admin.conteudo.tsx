import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listConteudo, upsertConteudo, deleteConteudo } from "@/lib/admin.functions";
import { KeyValueEditor } from "@/components/admin/KeyValueEditor";

export const Route = createFileRoute("/admin/conteudo")({
  component: AdminConteudo,
});

const SUGGESTIONS = [
  {
    chave: "home.hero",
    descricao: "Conteúdo do hero da página inicial",
    valor: {
      titulo: "Equipamentos médicos de alta confiabilidade",
      subtitulo: "Soluções completas para clínicas e hospitais.",
      cta_texto: "Solicitar orçamento",
      cta_link: "/contato",
    },
  },
  {
    chave: "home.destaques",
    descricao: "Bloco de destaques da home",
    valor: { titulo: "Por que a Conecta", itens: ["Atendimento técnico", "Assistência rápida", "Equipamentos certificados"] },
  },
  {
    chave: "sobre.texto",
    descricao: "Texto institucional da página Sobre",
    valor: { titulo: "Sobre a Conecta", paragrafos: ["..."] },
  },
  {
    chave: "solucoes.lista",
    descricao: "Lista de soluções apresentadas",
    valor: { itens: [{ titulo: "Solução A", descricao: "..." }] },
  },
];

function AdminConteudo() {
  const listFn = useServerFn(listConteudo);
  const upsertFn = useServerFn(upsertConteudo);
  const deleteFn = useServerFn(deleteConteudo);
  return (
    <KeyValueEditor
      kicker="CMS"
      title="Conteúdo do site"
      subtitle="Edite blocos de texto, listas e mídias usadas nas páginas públicas."
      queryKey="conteudo"
      listFn={listFn}
      upsertFn={upsertFn}
      deleteFn={deleteFn}
      suggestions={SUGGESTIONS}
    />
  );
}
