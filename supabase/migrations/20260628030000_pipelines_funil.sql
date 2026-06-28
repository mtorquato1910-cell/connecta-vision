-- Funil de vendas (Kanban): pipelines editáveis/criáveis pelo admin.
-- O lead (formularios.status) referencia a `chave` de uma pipeline.
CREATE TABLE IF NOT EXISTS public.pipelines (
  id uuid primary key default gen_random_uuid(),
  chave text unique not null,
  nome text not null,
  ordem int not null default 0,
  cor text not null default 'slate',
  created_at timestamptz not null default now()
);

ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.pipelines TO service_role;

-- Seed com os estágios atuais (idempotente)
INSERT INTO public.pipelines (chave, nome, ordem, cor) VALUES
  ('novo',        'Novo',        0, 'blue'),
  ('em_contato',  'Em contato',  1, 'amber'),
  ('qualificado', 'Qualificado', 2, 'violet'),
  ('convertido',  'Convertido',  3, 'green'),
  ('perdido',     'Perdido',     4, 'rose')
ON CONFLICT (chave) DO NOTHING;
