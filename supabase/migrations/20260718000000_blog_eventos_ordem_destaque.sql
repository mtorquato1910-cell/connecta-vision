-- Onda 1 — Ordenação e destaque para Blog e Eventos.
--
-- Contexto:
--   * Blog não tinha ordem nem destaque (listava só por publicado_em DESC).
--   * Eventos já tinha `ordem`, faltava `destaque` (fixar no topo).
--   * A capa deixou de ser base64 e passou a ser URL curta do Storage
--     (server fn uploadImagem), então o erro "capa_url too_big <=1000" some
--     sem precisar mexer nas colunas (que já são `text` sem limite no Postgres).

-- Blog: ordem manual + destaque (fixar no topo)
alter table public.blog_posts
  add column if not exists ordem integer not null default 0,
  add column if not exists destaque boolean not null default false;

create index if not exists idx_blog_posts_ordem on public.blog_posts (ordem);

-- Eventos: destaque (fixar no topo). `ordem` já existe.
alter table public.eventos
  add column if not exists destaque boolean not null default false;
