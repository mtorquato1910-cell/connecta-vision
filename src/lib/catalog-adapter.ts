/**
 * Converte os DTOs do Supabase (catalog.functions) para os tipos públicos
 * Produto/Categoria já usados pelos componentes do site. Mantém os componentes
 * intactos durante a migração do catálogo estático → Supabase.
 */
import type { Produto, Categoria } from "@/lib/site-data";
import type {
  ProdutoListDTO,
  ProdutoDTO,
  CategoriaDTO,
} from "@/lib/catalog.functions";

// Mesmo placeholder usado no site-data (off-white com "conecta").
export const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect fill='#FAFAF7' width='800' height='600'/><text x='400' y='320' text-anchor='middle' font-family='serif' font-size='80' fill='#9A9A9A'>conecta</text></svg>`,
  );

export function dtoToProdutoList(d: ProdutoListDTO): Produto {
  return {
    slug: d.slug,
    modelo: d.modelo,
    nome: d.nome,
    categoriaSlug: d.categoria_slug,
    categoriaNome: d.categoria_nome,
    img: d.imagem_url ?? FALLBACK_IMG,
    galeria: d.galeria,
    destaque: d.destaque,
  };
}

export function dtoToProduto(d: ProdutoDTO): Produto {
  const img = d.imagem_url ?? FALLBACK_IMG;
  return {
    ...dtoToProdutoList(d),
    img,
    galeria: d.galeria.length ? d.galeria : [img],
    resumo: d.resumo ?? undefined,
    descricao: d.descricao ?? undefined,
    diferenciais: d.diferenciais,
    aplicacoes: d.aplicacoes,
    especificacoes: d.especificacoes,
  };
}

export function dtoToCategoria(d: CategoriaDTO, qtd = 0): Categoria {
  return {
    num: d.numero,
    slug: d.slug,
    nome: d.nome,
    qtd,
    img: d.imagem_url ?? FALLBACK_IMG,
  };
}
