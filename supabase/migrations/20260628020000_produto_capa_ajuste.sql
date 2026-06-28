-- 2026-06-28: ajuste visual da capa do produto (controlado pelo admin).
-- Guarda como a miniatura/capa aparece no site: encaixe, zoom e posição.
-- Formato do jsonb: { "fit": "contain"|"cover", "zoom": number(1..2), "posX": 0..100, "posY": 0..100 }
ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS capa_ajuste jsonb NOT NULL DEFAULT '{}'::jsonb;
