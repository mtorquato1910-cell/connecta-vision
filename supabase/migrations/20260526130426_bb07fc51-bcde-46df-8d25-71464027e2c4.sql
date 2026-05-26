-- 1. Remove public SELECT on configuracoes (contains CNPJ + contact info).
-- Server functions use the admin client (bypasses RLS), so the site keeps working.
DROP POLICY IF EXISTS "Configurações são públicas" ON public.configuracoes;

-- 2. Revoke direct EXECUTE on has_role from app roles.
-- RLS policies that reference has_role still work because the function is
-- SECURITY DEFINER and runs as its owner during policy evaluation.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated;