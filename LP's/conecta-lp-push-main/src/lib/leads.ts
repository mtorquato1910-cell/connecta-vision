/**
 * Envio de leads das Landing Pages para o Supabase.
 *
 * As LPs são sites ESTÁTICOS (sem back-end). O lead vai direto para a tabela
 * `public.formularios` via PostgREST usando a chave PÚBLICA (publishable/anon).
 * Isso é seguro: a tabela tem RLS que só permite INSERT do papel `anon`
 * (policy "Visitantes podem enviar formulario", exige nome>1 e email>3), 
 * ninguém consegue LER os leads com esta chave, só o admin autenticado.
 *
 * Os campos extras do formulário (função, volume, itens, prazo...) vão no
 * `payload` (jsonb). O admin lê tudo na rota /admin/formularios.
 */

const SUPABASE_URL = "https://xrotxaapnkyokgebpodv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_p4En-OtD95GUGZlqvRiPkQ_I5b4IWQr";

export type LeadInput = {
  nome: string;
  email: string;
  whatsapp?: string;
  funcao?: string;
  tipoEstabelecimento?: string;
  nomeEstabelecimento?: string;
  cidade?: string;
  volume?: string;
  itens?: string[];
  prazo?: string;
  observacoes?: string;
  /** identidade da LP de origem (ex.: domínio ou id do site) */
  origem: string;
  lineName?: string;
  /** honeypot anti-spam: deve vir SEMPRE vazio (preenchido = bot) */
  website?: string;
};

/**
 * Insere o lead no Supabase. Retorna true em sucesso.
 * NUNCA lança: em caso de falha de rede o fluxo do usuário (abrir WhatsApp)
 * não pode ser bloqueado. O erro é só logado no console.
 */
export async function submitLead(input: LeadInput): Promise<boolean> {
  const row = {
    tipo: "orcamento_lp",
    nome: (input.nome ?? "").trim(),
    email: (input.email ?? "").trim().toLowerCase(),
    telefone: input.whatsapp?.trim() || null,
    empresa: input.nomeEstabelecimento?.trim() || null,
    cidade: input.cidade?.trim() || null,
    mensagem: input.observacoes?.trim() || null,
    origem: input.origem,
    payload: {
      funcao: input.funcao ?? null,
      tipo_estabelecimento: input.tipoEstabelecimento ?? null,
      nome_estabelecimento: input.nomeEstabelecimento ?? null,
      volume: input.volume ?? null,
      itens: input.itens ?? [],
      prazo: input.prazo ?? null,
      whatsapp: input.whatsapp ?? null,
      line_name: input.lineName ?? null,
      website: input.website ?? null,
      origem_url:
        typeof window !== "undefined" ? window.location.href : input.origem,
    },
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/formularios`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      console.error("[leads] Supabase respondeu", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[leads] Falha ao enviar lead:", err);
    return false;
  }
}
