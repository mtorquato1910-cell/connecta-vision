-- Onda 3 — Ocultar categoria do site sem excluir.
-- O admin controla a visibilidade; o site (listCategorias/homeCatalogo) passa a
-- filtrar `oculto = false`. Excluir de vez continua sendo ação separada, que
-- migra os produtos vinculados para outra categoria antes de remover.
alter table public.categorias
  add column if not exists oculto boolean not null default false;

create index if not exists idx_categorias_oculto on public.categorias (oculto);
