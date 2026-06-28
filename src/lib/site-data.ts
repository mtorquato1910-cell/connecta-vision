/**
 * Catálogo Conecta, dados carregados da planilha shinova_todos_produtos.xlsx
 * (extraída via scripts/extract-products.py → src/data/*.json)
 *
 * Esta camada adapta o JSON da planilha para o formato esperado pelos
 * componentes do site (mantém retro-compatibilidade com o tipo Produto).
 */
import categoriasJson from "@/data/categorias.json";

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
  qtd?: number;
  img?: string | null;
  fonte_aba: string;
};

// Imagem fallback (off-white com inicial, placeholder neutro)
const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect fill='#FAFAF7' width='800' height='600'/><text x='400' y='320' text-anchor='middle' font-family='serif' font-size='80' fill='#9A9A9A'>conecta</text></svg>`,
  );

// ─── Adaptadores ─────────────────────────────────────────────────────────────

const categoriasRaw = categoriasJson as CategoriaRaw[];

// qtd e img de capa já vêm pré-computados no categorias.json (gerado pelo
// export-catalog-json.mjs), evitando importar o produtos.json (1MB) aqui.
function toCategoria(c: CategoriaRaw): Categoria {
  return {
    num: c.numero,
    slug: c.slug,
    nome: c.nome,
    qtd: c.qtd ?? 0,
    img: c.img ?? FALLBACK_IMG,
    icone: c.icone ?? null,
    descricaoCurta: c.descricao_curta,
  };
}

// ─── Exports principais ──────────────────────────────────────────────────────

export const CATEGORIAS: Categoria[] = categoriasRaw
  .slice()
  .sort((a, b) => a.ordem - b.ordem)
  .map(toCategoria);

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const findCategoria = (slug: string) =>
  CATEGORIAS.find((c) => c.slug === slug);

export const waLink = (msg = SITE.whatsappMsg) =>
  `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(msg)}`;
