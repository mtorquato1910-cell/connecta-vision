import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listConfigEmpresa, upsertConfigEmpresa, deleteConfigEmpresa } from "@/lib/admin.functions";
import { KeyValueEditor } from "@/components/admin/KeyValueEditor";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminConfiguracoes,
});

const SUGGESTIONS = [
  {
    chave: "empresa.contato",
    descricao: "Dados de contato (email, telefone, whatsapp)",
    valor: { email: "contato@exemplo.com", telefone: "(00) 0000-0000", whatsapp: "5500000000000" },
  },
  {
    chave: "empresa.endereco",
    descricao: "Endereço físico",
    valor: { rua: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "", cep: "" },
  },
  {
    chave: "empresa.redes_sociais",
    descricao: "Links de redes sociais",
    valor: { instagram: "", linkedin: "", facebook: "", youtube: "" },
  },
  {
    chave: "empresa.identidade",
    descricao: "Nome, slogan e logos",
    valor: { nome: "Conecta", slogan: "", logo_url: "", logo_dark_url: "" },
  },
  {
    chave: "empresa.seo",
    descricao: "Metadados padrão (SEO)",
    valor: { title: "", description: "", og_image: "" },
  },
];

function AdminConfiguracoes() {
  const listFn = useServerFn(listConfigEmpresa);
  const upsertFn = useServerFn(upsertConfigEmpresa);
  const deleteFn = useServerFn(deleteConfigEmpresa);
  return (
    <KeyValueEditor
      kicker="Settings"
      title="Configurações da empresa"
      subtitle="Dados institucionais usados em todo o site (contato, endereço, redes, SEO)."
      queryKey="config_empresa"
      listFn={listFn}
      upsertFn={upsertFn}
      deleteFn={deleteFn}
      suggestions={SUGGESTIONS}
    />
  );
}
