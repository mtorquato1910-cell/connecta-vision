/**
 * Dados de PRODUTOS (catálogo completo) carregados de produtos.json.
 *
 * ⚠️ Este módulo importa `produtos.json` (~1MB com descrições/specs dos 230
 * produtos). Por isso fica SEPARADO de `site-data.ts`: só as rotas /produtos*
 * importam daqui, então o JSON pesado entra apenas nos chunks dessas rotas e
 * NÃO no bundle principal carregado em toda página (Navbar/Footer usam só
 * `site-data` leve).
 */
import produtosJson from "@/data/produtos.json";
import type { Produto } from "@/lib/site-data";

// ─── Tipo bruto do JSON ──────────────────────────────────────────────────────

type ProdutoRaw = {
  id: string;
  slug: string;
  categoria_id: string;
  categoria_slug: string;
  categoria_nome: string;
  modelo: string | null;
  nome: string;
  marca: string;
  subcategoria: string | null;
  descricao_curta: string | null;
  descricao_longa: string | null;
  diferenciais?: string[];
  aplicacoes?: string[];
  especificacoes: { chave: string; valor: string }[];
  configuracoes: string | null;
  imagem_principal: string | null;
  galeria: { url: string; ordem: number; alt: string }[];
  capa_ajuste?: { fit?: "contain" | "cover"; zoom?: number; posX?: number; posY?: number } | null;
  url_fabricante: string | null;
  destaque: boolean;
  publicado: boolean;
};

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect fill='#FAFAF7' width='800' height='600'/><text x='400' y='320' text-anchor='middle' font-family='serif' font-size='80' fill='#9A9A9A'>conecta</text></svg>`,
  );

const produtosRaw = produtosJson as ProdutoRaw[];

function toProduto(p: ProdutoRaw): Produto {
  const galeriaUrls = (p.galeria ?? [])
    .slice() // não mutar
    .sort((a, b) => a.ordem - b.ordem)
    .map((g) => g.url)
    .filter(Boolean);

  const imgPrincipal = p.imagem_principal || galeriaUrls[0] || FALLBACK_IMG;

  const diferenciais = Array.isArray(p.diferenciais) ? p.diferenciais.filter(Boolean) : [];
  const aplicacoesRaw = Array.isArray(p.aplicacoes) ? p.aplicacoes.filter(Boolean) : [];
  const aplicacoes = aplicacoesRaw.length
    ? aplicacoesRaw
    : p.subcategoria
      ? [p.subcategoria]
      : [];

  return {
    slug: p.slug,
    modelo: p.modelo ?? p.nome,
    nome: p.nome,
    categoriaSlug: p.categoria_slug,
    categoriaNome: p.categoria_nome,
    img: imgPrincipal,
    galeria: galeriaUrls.length ? galeriaUrls : [imgPrincipal],
    destaque: p.destaque,
    resumo: p.descricao_curta ?? undefined,
    descricao: p.descricao_longa ?? p.descricao_curta ?? undefined,
    diferenciais,
    aplicacoes,
    especificacoes: p.especificacoes.map((e) => ({
      label: e.chave,
      valor: e.valor,
    })),
    subcategoria: p.subcategoria,
    urlFabricante: p.url_fabricante,
    capaAjuste: p.capa_ajuste ?? undefined,
  };
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export const PRODUTOS: Produto[] = produtosRaw.map(toProduto);

export const PRODUTOS_DESTAQUE: Produto[] = PRODUTOS.filter((p) => p.destaque);

export const findProduto = (slug: string) => PRODUTOS.find((p) => p.slug === slug);

export const produtosPorCategoria = (slug: string) =>
  PRODUTOS.filter((p) => p.categoriaSlug === slug);

export const produtosRelacionados = (p: Produto, limit = 3) =>
  PRODUTOS.filter((x) => x.slug !== p.slug && x.categoriaSlug === p.categoriaSlug).slice(0, limit);
