-- Coluna destaque para categorias (usada no admin para marcar linhas em destaque).
ALTER TABLE public.categorias
  ADD COLUMN IF NOT EXISTS destaque BOOLEAN NOT NULL DEFAULT false;
