
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Imagens de produtos públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'produtos');

CREATE POLICY "Admins enviam imagens de produtos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins atualizam imagens de produtos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins removem imagens de produtos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
