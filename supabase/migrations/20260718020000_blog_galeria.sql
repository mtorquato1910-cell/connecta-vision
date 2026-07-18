-- Ajuste fino: blog passa a aceitar múltiplas imagens (galeria/carrossel),
-- igual aos eventos. A capa continua em capa_url; as demais em galeria (jsonb).
alter table public.blog_posts
  add column if not exists galeria jsonb not null default '[]'::jsonb;
