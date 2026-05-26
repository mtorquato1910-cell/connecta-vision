UPDATE storage.buckets SET public = true WHERE id = 'produtos';
DROP POLICY IF EXISTS "Produtos public read individual files" ON storage.objects;