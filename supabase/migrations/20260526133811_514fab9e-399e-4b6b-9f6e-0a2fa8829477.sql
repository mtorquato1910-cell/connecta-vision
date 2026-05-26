
-- formularios
CREATE TABLE public.formularios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL DEFAULT 'contato',
  nome text NOT NULL,
  email text NOT NULL,
  telefone text,
  empresa text,
  cidade text,
  mensagem text,
  origem text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'novo',
  lido boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.formularios TO authenticated;
GRANT INSERT ON public.formularios TO anon;
GRANT ALL ON public.formularios TO service_role;
ALTER TABLE public.formularios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitantes podem enviar formulario"
ON public.formularios FOR INSERT
TO anon, authenticated
WITH CHECK (char_length(nome) > 1 AND char_length(email) > 3);

CREATE POLICY "Admins veem formularios"
ON public.formularios FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins atualizam formularios"
ON public.formularios FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins removem formularios"
ON public.formularios FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_formularios_updated_at
BEFORE UPDATE ON public.formularios
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- conteudo_site
CREATE TABLE public.conteudo_site (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  valor jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.conteudo_site TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.conteudo_site TO authenticated;
GRANT ALL ON public.conteudo_site TO service_role;
ALTER TABLE public.conteudo_site ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conteudo site publico"
ON public.conteudo_site FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins gerenciam conteudo site"
ON public.conteudo_site FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_conteudo_site_updated_at
BEFORE UPDATE ON public.conteudo_site
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- configuracoes_empresa
CREATE TABLE public.configuracoes_empresa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text NOT NULL UNIQUE,
  valor jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.configuracoes_empresa TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.configuracoes_empresa TO authenticated;
GRANT ALL ON public.configuracoes_empresa TO service_role;
ALTER TABLE public.configuracoes_empresa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Config empresa publica"
ON public.configuracoes_empresa FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins gerenciam config empresa"
ON public.configuracoes_empresa FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_configuracoes_empresa_updated_at
BEFORE UPDATE ON public.configuracoes_empresa
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
