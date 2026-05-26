-- 1) Add search_path to set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2) Restrict has_role execution to authenticated users only
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- 3) Replace permissive INSERT policy with one that requires basic fields
DROP POLICY IF EXISTS "Qualquer um pode criar orçamento" ON public.orcamentos;

CREATE POLICY "Visitantes podem criar orçamento" ON public.orcamentos
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(nome) > 1
    AND char_length(email) > 3
    AND char_length(telefone) > 3
  );