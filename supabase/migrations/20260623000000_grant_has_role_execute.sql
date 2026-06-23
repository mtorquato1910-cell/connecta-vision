-- Reforço: permite que papéis authenticated/anon EXECUTEM has_role,
-- para que políticas RLS que chamam has_role funcionem também em queries
-- diretas do cliente (o app usa service_role nas server-fns, mas isto é
-- defesa em profundidade e corrige "permission denied for function has_role").
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
