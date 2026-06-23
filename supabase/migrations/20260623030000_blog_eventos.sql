-- ============================================================
-- Blog (com moderação) + Eventos (galeria). Home continua em conteudo_site.
-- ============================================================

-- ---------- BLOG ----------
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  resumo text NOT NULL DEFAULT '',
  conteudo text NOT NULL DEFAULT '',
  capa_url text,
  video_url text,
  autor_nome text NOT NULL DEFAULT '',
  autor_email text NOT NULL DEFAULT '',
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pendente',     -- pendente | publicado | rascunho | rejeitado
  origem text NOT NULL DEFAULT 'publico',       -- publico | admin
  motivo_rejeicao text,
  publicado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT ON public.blog_posts TO anon;            -- visitante pode submeter
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog publicado é público"
ON public.blog_posts FOR SELECT TO anon, authenticated
USING (status = 'publicado');

CREATE POLICY "Visitante submete post"
ON public.blog_posts FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pendente' AND origem = 'publico' AND char_length(titulo) > 2);

CREATE POLICY "Admin vê todo o blog"
ON public.blog_posts FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin gerencia blog (update)"
ON public.blog_posts FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin gerencia blog (delete)"
ON public.blog_posts FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);

-- ---------- EVENTOS ----------
CREATE TABLE public.eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nome text NOT NULL,
  data_evento date,
  local text,
  descricao_curta text,
  descricao_longa text,
  capa_url text,
  galeria jsonb NOT NULL DEFAULT '[]'::jsonb,
  publicado boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.eventos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.eventos TO authenticated;
GRANT ALL ON public.eventos TO service_role;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Eventos publicados são públicos"
ON public.eventos FOR SELECT TO anon, authenticated
USING (publicado = true);

CREATE POLICY "Admin vê todos eventos"
ON public.eventos FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin gerencia eventos"
ON public.eventos FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_eventos_updated_at
BEFORE UPDATE ON public.eventos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
