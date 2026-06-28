-- 2026-06-28: troca o travessão "—" por vírgula em TODO o conteúdo dinâmico do banco.
-- O código (textos fixos, separador modelo—nome, LPs) já foi corrigido; isto cuida
-- do que é editável/armazenado no Postgres (produtos, categorias, blog, eventos, config).
--
-- Regra: " — " (com espaços) vira ", " e qualquer "—" solto vira ",".
-- Colunas text: replace direto. Colunas jsonb: cast para text, replace, cast de volta
-- (o "—" só existe dentro de strings JSON, então o cast permanece válido).

-- Helper inline: replace(replace(x, ' — ', ', '), '—', ',')

-- PRODUTOS --------------------------------------------------------------------
UPDATE public.produtos SET
  nome           = replace(replace(nome,           ' — ', ', '), '—', ','),
  resumo         = replace(replace(resumo,         ' — ', ', '), '—', ','),
  descricao      = replace(replace(descricao,      ' — ', ', '), '—', ','),
  subcategoria   = replace(replace(subcategoria,   ' — ', ', '), '—', ','),
  marca          = replace(replace(marca,          ' — ', ', '), '—', ','),
  configuracoes  = replace(replace(configuracoes,  ' — ', ', '), '—', ','),
  diferenciais   = replace(replace(diferenciais::text,   ' — ', ', '), '—', ',')::jsonb,
  aplicacoes     = replace(replace(aplicacoes::text,     ' — ', ', '), '—', ',')::jsonb,
  especificacoes = replace(replace(especificacoes::text, ' — ', ', '), '—', ',')::jsonb,
  galeria        = replace(replace(galeria::text,        ' — ', ', '), '—', ',')::jsonb;

-- CATEGORIAS ------------------------------------------------------------------
UPDATE public.categorias SET
  nome      = replace(replace(nome,      ' — ', ', '), '—', ','),
  descricao = replace(replace(descricao, ' — ', ', '), '—', ',');

-- BLOG ------------------------------------------------------------------------
UPDATE public.blog_posts SET
  titulo   = replace(replace(titulo,   ' — ', ', '), '—', ','),
  resumo   = replace(replace(resumo,   ' — ', ', '), '—', ','),
  conteudo = replace(replace(conteudo, ' — ', ', '), '—', ',');

-- EVENTOS ---------------------------------------------------------------------
UPDATE public.eventos SET
  nome            = replace(replace(nome,            ' — ', ', '), '—', ','),
  local           = replace(replace(local,           ' — ', ', '), '—', ','),
  descricao_curta = replace(replace(descricao_curta, ' — ', ', '), '—', ','),
  descricao_longa = replace(replace(descricao_longa, ' — ', ', '), '—', ','),
  galeria         = replace(replace(galeria::text,   ' — ', ', '), '—', ',')::jsonb;

-- CONTEÚDO DO SITE + CONFIGURAÇÕES (jsonb) ------------------------------------
UPDATE public.conteudo_site SET
  valor = replace(replace(valor::text, ' — ', ', '), '—', ',')::jsonb;

UPDATE public.configuracoes_empresa SET
  valor = replace(replace(valor::text, ' — ', ', '), '—', ',')::jsonb;
