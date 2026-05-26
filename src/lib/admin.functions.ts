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
    const [{ count: produtos }, { count: categorias }, { count: orcamentos }, { count: novos }] =
      await Promise.all([
        supabaseAdmin.from("produtos").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("categorias").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("orcamentos").select("id", { count: "exact", head: true }),
        supabaseAdmin
          .from("orcamentos")
          .select("id", { count: "exact", head: true })
          .eq("status", "novo"),
      ]);
    return {
      produtos: produtos ?? 0,
      categorias: categorias ?? 0,
      orcamentos: orcamentos ?? 0,
      orcamentosNovos: novos ?? 0,
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
});

export const listAllCategorias = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("categorias")
      .select("id, slug, nome, numero, descricao, imagem_url, ordem")
      .order("ordem");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertCategoria = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((i: unknown) => categoriaSchema.parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("categorias").upsert(data);
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
        "id, slug, modelo, nome, imagem_url, destaque, publicado, ordem, categoria_id, categorias!inner(nome, slug)",
      )
      .order("ordem");
    if (error) throw new Error(error.message);
    return (data ?? []).map((r: any) => ({
      id: r.id as string,
      slug: r.slug as string,
      modelo: r.modelo as string,
      nome: r.nome as string,
      imagem_url: (r.imagem_url as string | null) ?? null,
      destaque: !!r.destaque,
      publicado: !!r.publicado,
      ordem: r.ordem as number,
      categoria_id: r.categoria_id as string,
      categoria_nome: (r.categorias?.nome as string) ?? "",
    }));
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
    const { error } = await supabaseAdmin.from("produtos").upsert(data);
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
});

export const submitFormulario = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => formularioSchema.parse(i))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("formularios").insert(data);
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
      })
      .parse(i),
  )
  .handler(async ({ data }) => {
    const { id, ...rest } = data;
    const { error } = await supabaseAdmin.from("formularios").update(rest).eq("id", id);
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
