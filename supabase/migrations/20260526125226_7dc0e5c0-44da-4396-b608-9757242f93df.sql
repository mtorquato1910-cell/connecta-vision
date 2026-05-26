-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Categorias
CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  numero TEXT NOT NULL,
  imagem_url TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_categorias_updated
  BEFORE UPDATE ON public.categorias
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Categorias são públicas" ON public.categorias
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins gerenciam categorias" ON public.categorias
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Produtos
CREATE TABLE public.produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  modelo TEXT NOT NULL,
  nome TEXT NOT NULL,
  categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE RESTRICT,
  imagem_url TEXT,
  galeria JSONB NOT NULL DEFAULT '[]'::jsonb,
  resumo TEXT,
  descricao TEXT,
  diferenciais JSONB NOT NULL DEFAULT '[]'::jsonb,
  aplicacoes JSONB NOT NULL DEFAULT '[]'::jsonb,
  especificacoes JSONB NOT NULL DEFAULT '[]'::jsonb,
  destaque BOOLEAN NOT NULL DEFAULT false,
  publicado BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_produtos_categoria ON public.produtos(categoria_id);
CREATE INDEX idx_produtos_publicado ON public.produtos(publicado);

CREATE TRIGGER trg_produtos_updated
  BEFORE UPDATE ON public.produtos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Produtos publicados são públicos" ON public.produtos
  FOR SELECT TO anon, authenticated USING (publicado = true);

CREATE POLICY "Admins veem todos os produtos" ON public.produtos
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins gerenciam produtos" ON public.produtos
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins atualizam produtos" ON public.produtos
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins removem produtos" ON public.produtos
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Configurações do site
CREATE TABLE public.configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT NOT NULL UNIQUE,
  valor JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_configuracoes_updated
  BEFORE UPDATE ON public.configuracoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Configurações são públicas" ON public.configuracoes
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins gerenciam configurações" ON public.configuracoes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orçamentos
CREATE TYPE public.orcamento_status AS ENUM ('novo', 'em_andamento', 'concluido', 'arquivado');

CREATE TABLE public.orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID REFERENCES public.produtos(id) ON DELETE SET NULL,
  produto_slug TEXT,
  produto_nome TEXT,
  nome TEXT NOT NULL,
  clinica TEXT,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cidade TEXT,
  mensagem TEXT,
  status orcamento_status NOT NULL DEFAULT 'novo',
  origem TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_orcamentos_updated
  BEFORE UPDATE ON public.orcamentos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Qualquer um pode criar orçamento" ON public.orcamentos
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins veem orçamentos" ON public.orcamentos
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins atualizam orçamentos" ON public.orcamentos
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins removem orçamentos" ON public.orcamentos
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));