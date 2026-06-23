import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Shared shapes returned to the client
export type Especificacao = { label: string; valor: string };

export type CategoriaDTO = {
  id: string;
  slug: string;
  nome: string;
  numero: string;
  imagem_url: string | null;
  ordem: number;
};

export type ProdutoListDTO = {
  slug: string;
  modelo: string;
  nome: string;
  imagem_url: string | null;
  destaque: boolean;
  categoria_slug: string;
  categoria_nome: string;
};

export type ProdutoDTO = ProdutoListDTO & {
  resumo: string | null;
  descricao: string | null;
  galeria: string[];
  diferenciais: string[];
  aplicacoes: string[];
  especificacoes: Especificacao[];
};

const PRODUTO_BASE_SELECT =
  "slug, modelo, nome, imagem_url, destaque, ordem, resumo, descricao, galeria, diferenciais, aplicacoes, especificacoes, categoria:categorias!inner(slug, nome)";

type ProdutoRow = {
  slug: string;
  modelo: string;
  nome: string;
  imagem_url: string | null;
  destaque: boolean;
  ordem: number;
  resumo: string | null;
  descricao: string | null;
  galeria: unknown;
  diferenciais: unknown;
  aplicacoes: unknown;
  especificacoes: unknown;
  categoria: { slug: string; nome: string } | { slug: string; nome: string }[];
};

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function asEspecificacoes(v: unknown): Especificacao[] {
  if (!Array.isArray(v)) return [];
  return v.flatMap((x) => {
    if (x && typeof x === "object" && "label" in x && "valor" in x) {
      return [{ label: String((x as Especificacao).label), valor: String((x as Especificacao).valor) }];
    }
    return [];
  });
}

function rowToList(r: ProdutoRow): ProdutoListDTO {
  const cat = Array.isArray(r.categoria) ? r.categoria[0] : r.categoria;
  return {
    slug: r.slug,
    modelo: r.modelo,
    nome: r.nome,
    imagem_url: r.imagem_url,
    destaque: r.destaque,
    categoria_slug: cat?.slug ?? "",
    categoria_nome: cat?.nome ?? "",
  };
}

function rowToFull(r: ProdutoRow): ProdutoDTO {
  return {
    ...rowToList(r),
    resumo: r.resumo,
    descricao: r.descricao,
    galeria: asStringArray(r.galeria),
    diferenciais: asStringArray(r.diferenciais),
    aplicacoes: asStringArray(r.aplicacoes),
    especificacoes: asEspecificacoes(r.especificacoes),
  };
}

export const listCategorias = createServerFn({ method: "GET" }).handler(
  async (): Promise<CategoriaDTO[]> => {
    const { data, error } = await supabaseAdmin
      .from("categorias")
      .select("id, slug, nome, numero, imagem_url, ordem")
      .order("ordem", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as CategoriaDTO[];
  },
);

export type CategoriaComContagemDTO = CategoriaDTO & { qtd: number };

/** Tudo que a home precisa em 1 chamada: categorias (com contagem) + destaques. */
export const homeCatalogo = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ categorias: CategoriaComContagemDTO[]; destaques: ProdutoListDTO[] }> => {
    const [catsRes, countRes, destRes] = await Promise.all([
      supabaseAdmin
        .from("categorias")
        .select("id, slug, nome, numero, imagem_url, ordem")
        .order("ordem", { ascending: true }),
      supabaseAdmin.from("produtos").select("categoria_id").eq("publicado", true),
      supabaseAdmin
        .from("produtos")
        .select(PRODUTO_BASE_SELECT)
        .eq("publicado", true)
        .eq("destaque", true)
        .order("ordem", { ascending: true })
        .limit(6),
    ]);
    if (catsRes.error) throw new Error(catsRes.error.message);
    if (countRes.error) throw new Error(countRes.error.message);
    if (destRes.error) throw new Error(destRes.error.message);

    const counts: Record<string, number> = {};
    for (const row of (countRes.data ?? []) as { categoria_id: string }[]) {
      counts[row.categoria_id] = (counts[row.categoria_id] ?? 0) + 1;
    }
    const categorias = ((catsRes.data ?? []) as (CategoriaDTO & { id: string })[]).map((c) => ({
      ...c,
      qtd: counts[c.id] ?? 0,
    }));
    const destaques = (destRes.data as ProdutoRow[] | null ?? []).map(rowToList);
    return { categorias, destaques };
  },
);

export const listProdutos = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) =>
    z
      .object({
        categoriaSlug: z.string().optional(),
        destaque: z.boolean().optional(),
        limit: z.number().int().min(1).max(500).optional(),
      })
      .parse(i ?? {}),
  )
  .handler(async ({ data }): Promise<ProdutoListDTO[]> => {
    let q = supabaseAdmin
      .from("produtos")
      .select(PRODUTO_BASE_SELECT)
      .eq("publicado", true)
      .order("ordem", { ascending: true });
    if (data.categoriaSlug) q = q.eq("categoria.slug", data.categoriaSlug);
    if (data.destaque) q = q.eq("destaque", true);
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows as ProdutoRow[] | null ?? []).map(rowToList);
  });

export const getProduto = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ slug: z.string().min(1) }).parse(i))
  .handler(async ({ data }): Promise<ProdutoDTO | null> => {
    const { data: row, error } = await supabaseAdmin
      .from("produtos")
      .select(PRODUTO_BASE_SELECT)
      .eq("publicado", true)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToFull(row as ProdutoRow) : null;
  });

export const getRelacionados = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) =>
    z.object({ categoriaSlug: z.string(), excluirSlug: z.string(), limit: z.number().int().min(1).max(12).default(3) }).parse(i),
  )
  .handler(async ({ data }): Promise<ProdutoListDTO[]> => {
    const { data: rows, error } = await supabaseAdmin
      .from("produtos")
      .select(PRODUTO_BASE_SELECT)
      .eq("publicado", true)
      .eq("categoria.slug", data.categoriaSlug)
      .neq("slug", data.excluirSlug)
      .limit(data.limit);
    if (error) throw new Error(error.message);
    return (rows as ProdutoRow[] | null ?? []).map(rowToList);
  });

export const criarOrcamento = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z
      .object({
        produto_slug: z.string().optional(),
        produto_nome: z.string().optional(),
        nome: z.string().min(2).max(160),
        clinica: z.string().max(160).optional(),
        email: z.string().email().max(200),
        telefone: z.string().min(6).max(40),
        cidade: z.string().max(160).optional(),
        mensagem: z.string().max(2000).optional(),
        origem: z.string().max(80).optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    let produto_id: string | null = null;
    if (data.produto_slug) {
      const { data: p } = await supabaseAdmin
        .from("produtos")
        .select("id")
        .eq("slug", data.produto_slug)
        .maybeSingle();
      produto_id = (p as { id: string } | null)?.id ?? null;
    }
    const { error } = await supabaseAdmin.from("orcamentos").insert({
      produto_id,
      produto_slug: data.produto_slug ?? null,
      produto_nome: data.produto_nome ?? null,
      nome: data.nome,
      clinica: data.clinica ?? null,
      email: data.email,
      telefone: data.telefone,
      cidade: data.cidade ?? null,
      mensagem: data.mensagem ?? null,
      origem: data.origem ?? "site",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
