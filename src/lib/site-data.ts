/**
 * Catálogo Conecta, dados carregados da planilha shinova_todos_produtos.xlsx
 * (extraída via scripts/extract-products.py → src/data/*.json)
 *
 * Esta camada adapta o JSON da planilha para o formato esperado pelos
 * componentes do site (mantém retro-compatibilidade com o tipo Produto).
 */
import categoriasJson from "@/data/categorias.json";
import produtosJson from "@/data/produtos.json";

// ─── Site / Empresa ──────────────────────────────────────────────────────────

export const SITE = {
  name: "Conecta Equipamentos Veterinários",
  shortName: "Conecta",
  cnpj: "54.269.525/0001-56",
  city: "Vespasiano/MG",
  address: "Av. Prefeito Sebastião Fernandes, 240, Centro, Shopping Premiere, Vespasiano/MG",
  phone: "(11) 94343-6177",
  phoneRaw: "5511943436177",
  whatsappMsg:
    "Olá! Vim pelo site da Conecta e gostaria de saber mais sobre os equipamentos veterinários.",
  email: "conectamondragon@gmail.com",
  topBar:
    "🇧🇷 Distribuição oficial Shinova no Brasil · Representação oficial · Suporte técnico nacional",
};

export const NAV = [
  { label: "Produtos", to: "/produtos" },
  { label: "Soluções", to: "/solucoes" },
  { label: "Blog", to: "/blog" },
  { label: "Eventos", to: "/eventos" },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" },
] as const;

// ─── Tipos públicos (mantém shape esperado pelos componentes existentes) ─────

export type Categoria = {
  num: string;
  slug: string;
  nome: string;
  qtd: number;
  img: string;
  icone?: string | null;
  descricaoCurta?: string;
};

export type Especificacao = { label: string; valor: string };

export type Produto = {
  slug: string;
  modelo: string;
  nome: string;
  categoriaSlug: string;
  categoriaNome: string;
  img: string;
  galeria?: string[];
  destaque?: boolean;
  resumo?: string;
  descricao?: string;
  diferenciais?: string[];
  aplicacoes?: string[];
  especificacoes?: Especificacao[];
  subcategoria?: string | null;
  urlFabricante?: string | null;
  capaAjuste?: { fit?: "contain" | "cover"; zoom?: number; posX?: number; posY?: number };
};

// ─── Tipos brutos do JSON ────────────────────────────────────────────────────

type CategoriaRaw = {
  id: string;
  slug: string;
  nome: string;
  descricao_curta: string;
  numero: string;
  ordem: number;
  destaque: boolean;
  icone?: string | null;
  fonte_aba: string;
};

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

// Imagem fallback (off-white com inicial, placeholder neutro)
const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect fill='#FAFAF7' width='800' height='600'/><text x='400' y='320' text-anchor='middle' font-family='serif' font-size='80' fill='#9A9A9A'>conecta</text></svg>`,
  );

// ─── Adaptadores ─────────────────────────────────────────────────────────────

const categoriasRaw = categoriasJson as CategoriaRaw[];
const produtosRaw = produtosJson as ProdutoRaw[];

// contagem real de produtos por categoria
const countByCat = produtosRaw.reduce<Record<string, number>>((acc, p) => {
  acc[p.categoria_slug] = (acc[p.categoria_slug] ?? 0) + 1;
  return acc;
}, {});

// primeira imagem de produto da categoria (para usar como capa da categoria)
const firstImgByCat: Record<string, string> = {};
for (const p of produtosRaw) {
  if (p.imagem_principal && !firstImgByCat[p.categoria_slug]) {
    firstImgByCat[p.categoria_slug] = p.imagem_principal;
  }
}

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

function toCategoria(c: CategoriaRaw): Categoria {
  return {
    num: c.numero,
    slug: c.slug,
    nome: c.nome,
    qtd: countByCat[c.slug] ?? 0,
    img: firstImgByCat[c.slug] ?? FALLBACK_IMG,
    icone: c.icone ?? null,
    descricaoCurta: c.descricao_curta,
  };
}

// ─── Exports principais ──────────────────────────────────────────────────────

export const CATEGORIAS: Categoria[] = categoriasRaw
  .slice()
  .sort((a, b) => a.ordem - b.ordem)
  .map(toCategoria);

export const PRODUTOS: Produto[] = produtosRaw.map(toProduto);

export const PRODUTOS_DESTAQUE: Produto[] = PRODUTOS.filter((p) => p.destaque);

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const findProduto = (slug: string) =>
  PRODUTOS.find((p) => p.slug === slug);

export const findCategoria = (slug: string) =>
  CATEGORIAS.find((c) => c.slug === slug);

export const produtosPorCategoria = (slug: string) =>
  PRODUTOS.filter((p) => p.categoriaSlug === slug);

export const produtosRelacionados = (p: Produto, limit = 3) =>
  PRODUTOS.filter(
    (x) => x.slug !== p.slug && x.categoriaSlug === p.categoriaSlug,
  ).slice(0, limit);

export const waLink = (msg = SITE.whatsappMsg) =>
  `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(msg)}`;
