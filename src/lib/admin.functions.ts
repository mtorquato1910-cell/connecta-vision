import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Forbidden: admin role required");
    return next();
  });

// ---------- Bootstrap: torna o primeiro usuário admin ----------
export const promoverPrimeiroAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { count, error: cErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (cErr) throw new Error(cErr.message);
    if ((count ?? 0) > 0) return { ok: true, promoted: false };
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true, promoted: true };
  });

export const meSouAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

// ---------- Dashboard stats ----------
export const dashboardStats = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const [
      { count: produtos },
      { count: categorias },
      { count: orcamentos },
      { count: novos },
      { count: formularios },
      { count: formulariosNovos },
    ] = await Promise.all([
      supabaseAdmin.from("produtos").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("categorias").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("orcamentos").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("orcamentos")
        .select("id", { count: "exact", head: true })
        .eq("status", "novo"),
      supabaseAdmin.from("formularios").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("formularios")
        .select("id", { count: "exact", head: true })
        .eq("status", "novo"),
    ]);
    return {
      produtos: produtos ?? 0,
      categorias: categorias ?? 0,
      orcamentos: orcamentos ?? 0,
      orcamentosNovos: novos ?? 0,
      formularios: formularios ?? 0,
      formulariosNovos: formulariosNovos ?? 0,
    };
  });

// ---------- Categorias ----------
const categoriaSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  nome: z.string().min(1).max(160),
  numero: z.string().min(1).max(8),
  descricao: z.string().max(500).optional().nullable(),
  imagem_url: z.string().url().max(500).optional().nullable(),
  ordem: z.number().int().min(0).max(999).default(0),
  destaque: z.boolean().optional().default(false),
});

export const listAllCategorias = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("categorias")
      .select("id, slug, nome, numero, descricao, imagem_url, ordem, destaque")
      .order("ordem");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertCategoria = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => categoriaSchema.parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("categorias").upsert(data as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCategoria = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("categorias").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderCategorias = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) =>
    z
      .object({
        ordem: z
          .array(z.object({ id: z.string().uuid(), ordem: z.number().int().min(0).max(999) }))
          .max(100),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    for (const it of data.ordem) {
      const { error } = await supabaseAdmin
        .from("categorias")
        .update({ ordem: it.ordem })
        .eq("id", it.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ---------- Produtos ----------
const especSchema = z.object({ label: z.string().min(1).max(120), valor: z.string().min(1).max(240) });
const produtoSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  modelo: z.string().min(1).max(80),
  nome: z.string().min(1).max(200),
  categoria_id: z.string().uuid(),
  imagem_url: z.string().url().max(500).optional().nullable(),
  resumo: z.string().max(500).optional().nullable(),
  descricao: z.string().max(4000).optional().nullable(),
  galeria: z.array(z.string().url().max(500)).max(20).default([]),
  diferenciais: z.array(z.string().min(1).max(240)).max(20).default([]),
  aplicacoes: z.array(z.string().min(1).max(240)).max(30).default([]),
  especificacoes: z.array(especSchema).max(40).default([]),
  capa_ajuste: z
    .object({
      fit: z.enum(["contain", "cover"]).optional(),
      zoom: z.number().min(1).max(2).optional(),
      posX: z.number().min(0).max(100).optional(),
      posY: z.number().min(0).max(100).optional(),
    })
    .optional()
    .default({}),
  marca: z.string().max(160).optional().nullable(),
  subcategoria: z.string().max(160).optional().nullable(),
  configuracoes: z.string().max(4000).optional().nullable(),
  url_fabricante: z.string().max(500).optional().nullable(),
  destaque: z.boolean().default(false),
  publicado: z.boolean().default(true),
  ordem: z.number().int().min(0).max(999).default(0),
});

export const listAllProdutos = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("produtos")
      .select(
        "id, slug, modelo, nome, imagem_url, subcategoria, destaque, publicado, ordem, categoria_id, categorias!inner(nome, slug)",
      )
      .order("ordem");
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: any) => ({
      id: r.id as string,
      slug: r.slug as string,
      modelo: r.modelo as string,
      nome: r.nome as string,
      imagem_url: (r.imagem_url as string | null) ?? null,
      subcategoria: (r.subcategoria as string | null) ?? null,
      destaque: !!r.destaque,
      publicado: !!r.publicado,
      ordem: r.ordem as number,
      categoria_id: r.categoria_id as string,
      categoria_nome: (r.categorias?.nome as string) ?? "",
      categoria_slug: (r.categorias?.slug as string) ?? "",
    }));
  });

export const updateProdutoStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        publicado: z.boolean().optional(),
        destaque: z.boolean().optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const { id, ...rest } = data;
    const { error } = await supabaseAdmin.from("produtos").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getProdutoAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("produtos")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const upsertProduto = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => produtoSchema.parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("produtos").upsert(data as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProduto = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("produtos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Orçamentos ----------
export const listOrcamentos = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("orcamentos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateOrcamentoStatus = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["novo", "em_andamento", "concluido", "arquivado"]),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("orcamentos")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteOrcamento = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("orcamentos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Formularios (públicos) ----------
const formularioSchema = z.object({
  tipo: z.string().min(1).max(40).default("contato"),
  nome: z.string().min(2).max(160),
  email: z.string().email().max(200),
  telefone: z.string().max(40).optional().nullable(),
  empresa: z.string().max(160).optional().nullable(),
  cidade: z.string().max(120).optional().nullable(),
  mensagem: z.string().max(4000).optional().nullable(),
  origem: z.string().max(200).optional().nullable(),
  payload: z.record(z.string(), z.any()).optional().default({}),
  // Honeypot anti-spam: campo oculto que humanos não preenchem.
  // Usado pelos forms do site e das LPs (input hidden name="website").
  website: z.string().max(200).optional(),
});

export const submitFormulario = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => formularioSchema.parse(i))
  .handler(async ({ data }) => {
    const { website, ...rest } = data;
    // Honeypot preenchido → bot. Finge sucesso e descarta (não grava no banco).
    if (website && website.trim() !== "") return { ok: true };
    const { error } = await supabaseAdmin.from("formularios").insert(rest);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listFormularios = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("formularios")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateFormulario = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.string().min(1).max(40).optional(),
        lido: z.boolean().optional(),
        notas: z.string().max(4000).optional(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const { id, notas, ...rest } = data;
    const update: Record<string, unknown> = { ...rest };

    // Notas internas vivem no payload (jsonb). Mescla preservando o restante.
    if (notas !== undefined) {
      const { data: row, error: readErr } = await supabaseAdmin
        .from("formularios")
        .select("payload")
        .eq("id", id)
        .maybeSingle();
      if (readErr) throw new Error(readErr.message);
      const payload = (row?.payload as Record<string, unknown> | null) ?? {};
      update.payload = { ...payload, notas_internas: notas };
    }

    const { error } = await supabaseAdmin
      .from("formularios")
      .update(update as never)
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteFormulario = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("formularios").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Conteúdo do site (key/value JSON) ----------
export const listConteudo = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("conteudo_site")
      .select("chave, valor, updated_at")
      .order("chave");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertConteudo = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) =>
    z
      .object({
        chave: z.string().min(1).max(120).regex(/^[a-z0-9_.-]+$/i),
        valor: z.any(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("conteudo_site")
      .upsert({ chave: data.chave, valor: data.valor }, { onConflict: "chave" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteConteudo = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ chave: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("conteudo_site").delete().eq("chave", data.chave);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Leitura PÚBLICA de conteúdo + configurações (sem auth) ----------
// Usadas pelo site público (hook useSiteConfig) para refletir o que o admin edita.
// Rodam com service role (bypass RLS); nenhum dado sensível vive nessas tabelas.
export const getConteudoPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.from("conteudo_site").select("chave, valor");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getConfigPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.from("configuracoes_empresa").select("chave, valor");
  if (error) throw new Error(error.message);
  return data ?? [];
});

// ---------- Configurações da empresa (key/value JSON) ----------
export const listConfigEmpresa = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("configuracoes_empresa")
      .select("chave, valor, updated_at")
      .order("chave");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertConfigEmpresa = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) =>
    z
      .object({
        chave: z.string().min(1).max(120).regex(/^[a-z0-9_.-]+$/i),
        valor: z.any(),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("configuracoes_empresa")
      .upsert({ chave: data.chave, valor: data.valor }, { onConflict: "chave" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteConfigEmpresa = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ chave: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("configuracoes_empresa")
      .delete()
      .eq("chave", data.chave);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Blog ----------
function slugifyBlog(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 140) || "post"
  );
}

// Cliente sem tipos para tabelas ainda não presentes no types.ts gerado
// (blog_posts, eventos). Em runtime o PostgREST resolve normalmente.
const sbUntyped = supabaseAdmin as unknown as { from: (table: string) => any };

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await sbUntyped
    .from("blog_posts")
    .select("*")
    .eq("status", "publicado")
    .order("publicado_em", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPostPublic = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ slug: z.string().min(1) }).parse(i))
  .handler(async ({ data }) => {
    const { data: row, error } = await sbUntyped
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "publicado")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const submitBlogPost = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z
      .object({
        titulo: z.string().min(3).max(240),
        resumo: z.string().max(600).optional().default(""),
        conteudo: z.string().max(40000).optional().default(""),
        capa_url: z.string().max(1000).optional().nullable(),
        video_url: z.string().max(1000).optional().nullable(),
        autor_nome: z.string().min(1).max(160),
        autor_email: z.string().email().max(200),
        tags: z.array(z.string().max(60)).max(20).optional().default([]),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const slug = `${slugifyBlog(data.titulo)}-${Math.abs(hashStr(data.titulo + data.autor_email)).toString(36).slice(0, 5)}`;
    const { error } = await sbUntyped
      .from("blog_posts")
      .insert({ ...data, slug, status: "pendente", origem: "publico" } as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await sbUntyped
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const approvePost = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { error } = await sbUntyped
      .from("blog_posts")
      .update({ status: "publicado", publicado_em: nowIso() } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const rejectPost = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) =>
    z.object({ id: z.string().uuid(), motivo: z.string().max(600).optional().default("") }).parse(i),
  )
  .handler(async ({ data }) => {
    const { error } = await sbUntyped
      .from("blog_posts")
      .update({ status: "rejeitado", motivo_rejeicao: data.motivo } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpsertPost = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        slug: z.string().max(160).optional(),
        titulo: z.string().min(1).max(240),
        resumo: z.string().max(600).optional().default(""),
        conteudo: z.string().max(40000).optional().default(""),
        capa_url: z.string().max(1000).optional().nullable(),
        video_url: z.string().max(1000).optional().nullable(),
        tags: z.array(z.string().max(60)).max(20).optional().default([]),
        status: z.enum(["pendente", "publicado", "rascunho", "rejeitado"]).optional().default("publicado"),
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const slug = data.slug || `${slugifyBlog(data.titulo)}-${Math.abs(hashStr(data.titulo)).toString(36).slice(0, 5)}`;
    const row = {
      ...data,
      slug,
      origem: "admin",
      autor_nome: "Equipe Conecta",
      autor_email: "editorial@conectavet.com.br",
      publicado_em: data.status === "publicado" ? nowIso() : null,
    };
    const { error } = await sbUntyped.from("blog_posts").upsert(row as never, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { error } = await sbUntyped.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

function nowIso(): string {
  // Em server-fn não usamos new Date() no topo do módulo; aqui em runtime é ok.
  return new Date().toISOString();
}

// ---------- Eventos ----------
const eventoSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(160).regex(/^[a-z0-9-]+$/),
  nome: z.string().min(1).max(200),
  data_evento: z.string().max(40).optional().nullable(),
  local: z.string().max(200).optional().nullable(),
  descricao_curta: z.string().max(600).optional().nullable(),
  descricao_longa: z.string().max(8000).optional().nullable(),
  capa_url: z.string().max(1000).optional().nullable(),
  galeria: z
    .array(
      z.object({
        url: z.string().max(1000),
        ordem: z.number().int().min(0).max(999).default(0),
        alt: z.string().max(300).optional().default(""),
        caption: z.string().max(300).optional().nullable(),
      }),
    )
    .max(60)
    .optional()
    .default([]),
  publicado: z.boolean().optional().default(true),
  ordem: z.number().int().min(0).max(999).optional().default(0),
});

export const listEventosPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await sbUntyped
    .from("eventos")
    .select("*")
    .eq("publicado", true)
    .order("data_evento", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getEventoPublic = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ slug: z.string().min(1) }).parse(i))
  .handler(async ({ data }) => {
    const { data: row, error } = await sbUntyped
      .from("eventos")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listAllEventos = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await sbUntyped
      .from("eventos")
      .select("*")
      .order("data_evento", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertEvento = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => eventoSchema.parse(i))
  .handler(async ({ data }) => {
    const { error } = await sbUntyped.from("eventos").upsert(data as never, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteEvento = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { error } = await sbUntyped.from("eventos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
