/**
 * Registro compartilhado de ícones de categoria.
 *
 * Usado em dois lugares:
 *  - Admin (src/routes/admin.categorias.tsx): seletor visual de ícone ao
 *    criar/editar uma categoria.
 *  - Site (src/components/site/Navbar.tsx): mega-menu de "Produtos" no topo,
 *    que mostra o ícone escolhido para cada categoria.
 *
 * A categoria guarda apenas a CHAVE do ícone (string estável) no banco. A
 * resolução chave → componente lucide acontece aqui, então trocar o ícone no
 * admin reflete no site sem mudar nenhum código.
 */
import {
  Activity,
  Scan,
  ScanLine,
  TestTube,
  TestTubes,
  HeartPulse,
  Heart,
  Stethoscope,
  Eye,
  Microscope,
  Scissors,
  Syringe,
  Pill,
  Bone,
  Dog,
  Cat,
  Thermometer,
  Bandage,
  Brain,
  Droplet,
  Waves,
  Sparkles,
  Bath,
  ShowerHead,
  Cross,
  Zap,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";

export type CategoryIconKey =
  | "activity"
  | "scan"
  | "scan-line"
  | "test-tube"
  | "test-tubes"
  | "heart-pulse"
  | "heart"
  | "stethoscope"
  | "eye"
  | "microscope"
  | "scissors"
  | "syringe"
  | "pill"
  | "bone"
  | "dog"
  | "cat"
  | "thermometer"
  | "bandage"
  | "brain"
  | "droplet"
  | "waves"
  | "sparkles"
  | "bath"
  | "shower-head"
  | "cross"
  | "zap"
  | "sun"
  | "wind";

/** Catálogo de ícones disponíveis no seletor do admin (ordem = exibição). */
export const CATEGORY_ICON_OPTIONS: { key: CategoryIconKey; label: string; Icon: LucideIcon }[] = [
  { key: "activity", label: "Monitorização", Icon: Activity },
  { key: "heart-pulse", label: "Sinais vitais", Icon: HeartPulse },
  { key: "stethoscope", label: "Estetoscópio", Icon: Stethoscope },
  { key: "scan", label: "Imagem / Scan", Icon: Scan },
  { key: "scan-line", label: "Ultrassom", Icon: ScanLine },
  { key: "microscope", label: "Microscópio", Icon: Microscope },
  { key: "test-tube", label: "Tubo de ensaio", Icon: TestTube },
  { key: "test-tubes", label: "Laboratório", Icon: TestTubes },
  { key: "syringe", label: "Seringa", Icon: Syringe },
  { key: "pill", label: "Medicação", Icon: Pill },
  { key: "thermometer", label: "Temperatura", Icon: Thermometer },
  { key: "bandage", label: "Curativo", Icon: Bandage },
  { key: "heart", label: "Coração", Icon: Heart },
  { key: "brain", label: "Neuro", Icon: Brain },
  { key: "eye", label: "Oftalmologia", Icon: Eye },
  { key: "bone", label: "Ortopedia", Icon: Bone },
  { key: "scissors", label: "Cirurgia", Icon: Scissors },
  { key: "cross", label: "Saúde", Icon: Cross },
  { key: "droplet", label: "Fluidos", Icon: Droplet },
  { key: "waves", label: "Ondas / Banho", Icon: Waves },
  { key: "bath", label: "Banheira", Icon: Bath },
  { key: "shower-head", label: "Banho & tosa", Icon: ShowerHead },
  { key: "sparkles", label: "Estética", Icon: Sparkles },
  { key: "dog", label: "Cão", Icon: Dog },
  { key: "cat", label: "Gato", Icon: Cat },
  { key: "zap", label: "Energia", Icon: Zap },
  { key: "sun", label: "Recuperação", Icon: Sun },
  { key: "wind", label: "Respiração", Icon: Wind },
];

const ICON_BY_KEY: Record<string, LucideIcon> = Object.fromEntries(
  CATEGORY_ICON_OPTIONS.map((o) => [o.key, o.Icon]),
);

/** Ícone padrão por slug (fallback histórico das 8 linhas Shinova). */
export const DEFAULT_ICON_BY_SLUG: Record<string, CategoryIconKey> = {
  "anestesia-monitorizacao": "activity",
  "imagem-diagnostico": "scan",
  "laboratorio-clinico": "test-tube",
  "tratamento-recuperacao": "heart-pulse",
  "odontologia-veterinaria": "stethoscope",
  "oftalmologia-veterinaria": "eye",
  "exame-diagnostico": "microscope",
  "pet-grooming-estetica": "scissors",
};

/**
 * Resolve o componente de ícone para uma categoria.
 * Prioridade: ícone escolhido no admin → padrão por slug → genérico (Activity).
 */
export function resolveCategoryIcon(icone?: string | null, slug?: string | null): LucideIcon {
  if (icone && ICON_BY_KEY[icone]) return ICON_BY_KEY[icone];
  if (slug && DEFAULT_ICON_BY_SLUG[slug]) return ICON_BY_KEY[DEFAULT_ICON_BY_SLUG[slug]];
  return Activity;
}

/** Chave do ícone padrão de um slug (para pré-selecionar no admin). */
export function defaultIconKeyForSlug(slug?: string | null): CategoryIconKey {
  return (slug && DEFAULT_ICON_BY_SLUG[slug]) || "activity";
}
