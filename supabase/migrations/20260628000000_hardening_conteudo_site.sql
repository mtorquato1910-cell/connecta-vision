-- Hardening 2026-06-28: remove o SELECT público de conteudo_site.
--
-- Motivo: o site público passou a ler conteudo_site (e configuracoes_empresa)
-- via server-fn com service_role (getConteudoPublic/getConfigPublic em
-- src/lib/admin.functions.ts), que faz bypass de RLS. Logo, o role `anon`
-- NÃO precisa mais de SELECT direto nessa tabela. Alinha com o tratamento já
-- dado a `configuracoes` (20260526130426) e `configuracoes_empresa` (20260526141624).

DROP POLICY IF EXISTS "Conteudo site publico" ON public.conteudo_site;
DROP POLICY IF EXISTS "Conteudo site é público" ON public.conteudo_site;
DROP POLICY IF EXISTS "Conteúdo do site é público" ON public.conteudo_site;

REVOKE SELECT ON public.conteudo_site FROM anon;
REVOKE SELECT ON public.conteudo_site FROM authenticated;

-- A escrita (admin) e a leitura via service_role continuam funcionando:
-- service_role ignora RLS; o admin opera via server-fn autenticada.
