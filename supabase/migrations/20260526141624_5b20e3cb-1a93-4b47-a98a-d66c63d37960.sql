-- Remove public read access from configuracoes_empresa (contains CNPJ/contact data)
DROP POLICY IF EXISTS "Config empresa publica" ON public.configuracoes_empresa;

-- Restrict produtos storage bucket: allow public read of individual objects but block listing
-- Drop any broad public SELECT policies on storage.objects for this bucket
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND (qual ILIKE '%produtos%' OR policyname ILIKE '%produtos%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Allow public read of individual files (no listing because no folder-level access pattern)
CREATE POLICY "Produtos public read individual files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'produtos' AND name IS NOT NULL);

-- Admin manage produtos files
CREATE POLICY "Admins manage produtos files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Make produtos bucket private to disable anonymous LIST endpoint; files still readable via signed/public URLs through the SELECT policy
UPDATE storage.buckets SET public = false WHERE id = 'produtos';