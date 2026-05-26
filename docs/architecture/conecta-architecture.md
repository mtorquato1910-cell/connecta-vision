# Arquitetura Técnica — Projeto Conecta

**Versão:** 1.0
**Data:** 2026-05-26
**Autor:** @architect (Atlas)
**Referência:** [PRD](../prd/conecta-prd.md), [Sprints](../sprints/conecta-sprints.md)
**Status:** Aprovado com observações (banco em aberto para Sprint 6)

---

## 1. Resumo executivo

A arquitetura do site Conecta segue o padrão **Next.js 15 App Router em servidor próprio**, com camada de dados desacoplada via **Repository Pattern**. Isso permite construir todo o frontend e admin (Sprints 0–5) **sem dependência do banco real**, e plugar PostgreSQL no servidor do cliente quando o acesso estiver disponível (Sprint 6) sem refatoração de páginas.

### Decisões arquiteturais principais (ADR resumido)

| ADR | Decisão | Motivo |
|---|---|---|
| ADR-01 | Next.js 15 (App Router) | Alinha com contrato ("Next.js"), SSR para SEO, deploy Node padrão |
| ADR-02 | Repository Pattern com Mock → Postgres | Desacopla camada de dados; permite Sprints 0–5 sem banco |
| ADR-03 | Drizzle ORM (preferência) | TypeScript-first, mais leve que Prisma, migrations SQL versionadas |
| ADR-04 | Auth.js v5 (NextAuth) | Padrão de mercado, integração nativa Next.js, providers flexíveis |
| ADR-05 | next-intl para i18n | App Router-friendly, geolocalização via middleware |
| ADR-06 | Filesystem local para uploads (provisório) | Reduz dependências externas; S3-compat opcional na Sprint 6 |
| ADR-07 | Não usar Cloudflare Workers | Cliente quer servidor próprio (contrato Cláusula 13) |
| ADR-08 | Sem Supabase | Decisão do Matheus em 2026-05-26 |

---

## 2. Validação do PRD vs Arquitetura

### 2.1 Pontos aprovados ✅
- ✅ **Escopo enxuto (site + admin, sem LPs)** — viável dentro dos 60 dias com folga de 14 dias
- ✅ **Banco em aberto via Repository Pattern** — abordagem correta para destravar Sprints 0–5
- ✅ **Stack Next.js + Tailwind + Radix + Framer Motion + Zod + RHF + TanStack Query** — padrão de mercado, sem riscos
- ✅ **Mock data com JSON + localStorage** — funciona bem para fase de UI; admin pode persistir mudanças durante testes
- ✅ **i18n com next-intl** — recomendado em vez de soluções caseiras
- ✅ **SEO técnico (sitemap dinâmico, schema.org JSON-LD)** — cobertura adequada
- ✅ **DoD global com tipo-check, lint e build** — bom guarda-corpo

### 2.2 Pontos de atenção ⚠️

#### A1. Migração TanStack Start → Next.js é mais profunda do que parece
**Risco:** O repo atual está em TanStack Router (file-based, mas sintaxe diferente do App Router). Migrar exige reescrita das rotas, não cópia.

**Mitigação:**
- Tratar Sprint 0 como **migração completa**, não "ajuste"
- Aproveitar componentes JSX (Hero, Navbar, etc.) **diretamente**
- Reescrever apenas as **rotas, layouts e data fetching**
- Backup do `src/` atual em `src.legacy/` antes de começar

#### A2. SSR no Next.js requer server-side data fetching
**Risco:** Mock data funcionando em client (localStorage) **não funciona em SSR** — `localStorage` é browser-only.

**Mitigação:**
- Separar **MockRepository** em dois adapters:
  - `MockServerRepository` — lê arquivos JSON do filesystem em build time / server
  - `MockClientRepository` — usa localStorage para mudanças do admin durante desenvolvimento
- Camada de "diff" que mescla: dados estáticos (JSON) + overrides do admin (localStorage)
- Quando entrar Postgres real (Sprint 6), ambos viram um único `PostgresRepository`

#### A3. Tradução automática (next-intl + geolocalização) tem 2 caminhos
**Opções:**
1. **Middleware Next.js + header `x-vercel-ip-country` ou Cloudflare equivalente** → mas estamos saindo do Vercel/Cloudflare. Servidor próprio **não fornece geolocalização nativa**.
2. **API externa** (ipapi.co, ipgeolocation.io) — gratuita até X req/dia, mas custo recorrente.
3. **Geo via `navigator.geolocation` no client** — pede permissão, atrito ruim.

**Recomendação:** Combinação — usar `Accept-Language` header como sinal primário (não pede permissão) + fallback para API externa em primeira visita + cache em cookie persistente. Custo zero na maioria dos casos.

#### A4. Upload múltiplo com reordenação drag-drop em filesystem local
**Risco:** Sem S3, perder uploads em redeploy se hospedagem for stateless (Docker sem volume).

**Mitigação:**
- Sprint 6 confirma com Matheus: servidor tem disco persistente (esperado)
- Estrutura: `/var/www/conecta/uploads/{categoria,produto,blog,evento}/{slug}/{filename}`
- Backup automatizado das uploads (cron + rsync ou borg)

#### A5. Blog com submissão pública precisa de proteção anti-spam séria
**Risco:** Form aberto vira porta para spam de SEO.

**Mitigação:**
- **Honeypot field** (campo invisível que bot preenche)
- **Time-to-submit** (form descartado se enviado em < 3s)
- **Rate limit por IP** (máx 3 submissões / hora)
- **hCaptcha** ou **Cloudflare Turnstile** opcional (mantemos Turnstile pois é gratuito e não exige Cloudflare como host)

### 2.3 Pontos a evoluir 🔄

#### E1. Versionamento de schema de mock data
Conforme o admin edita dados, o JSON pode divergir entre máquinas (Sprint 0-5). Solução: gerar um `data/schema-version.json` e ter um migrator que normaliza.

#### E2. Estratégia de cache no Next.js 15
Next.js 15 mudou defaults de cache (agora "uncached by default"). Definir explicitamente:
- `revalidate: 60` em páginas de catálogo
- `revalidate: 300` em página de produto
- `revalidate: 30` em blog
- `dynamic` em páginas admin (sempre fresh)

#### E3. Observabilidade — log estruturado
PRD pediu, mas não detalhou. Recomendo:
- **pino** (Node, JSON estruturado, performance excelente)
- Logs em `/var/log/conecta/` rotacionados
- Sentry self-hosted (Glitchtip) opcional na Sprint 7

---

## 3. Arquitetura de alto nível

```
┌────────────────────────────────────────────────────────────────────┐
│                        Browser (PT/EN/ES)                           │
│      Next.js Client Components + React Query + Framer Motion        │
└──────────────────────────────┬─────────────────────────────────────┘
                               │  HTTPS
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                  Nginx (reverse proxy + HTTPS)                      │
│  - /_next/static → cache agressivo                                  │
│  - /uploads/* → serve estático                                      │
│  - / → Next.js                                                      │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│              Next.js 15 App Router (Node 20+ via PM2)               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Routes                                                        │  │
│  │  - app/(site)/* (público SSR)                                 │  │
│  │  - app/(admin)/admin/* (protegido)                            │  │
│  │  - app/api/* (endpoints, RSC actions)                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Middleware                                                    │  │
│  │  - i18n routing (next-intl)                                   │  │
│  │  - Auth gate (admin/*)                                        │  │
│  │  - Rate limit (forms)                                         │  │
│  │  - Geolocalização → locale default                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Repository Layer (interface)                                  │  │
│  │  CategoriaRepo · ProdutoRepo · FormularioRepo                 │  │
│  │  BlogPostRepo · EventoRepo · ConteudoRepo · ConfigRepo        │  │
│  └─────────┬──────────────────────────────────┬─────────────────┘  │
│            │                                  │                    │
│   Sprint 0–5: MockRepo            Sprint 6+: PostgresRepo          │
│   (JSON + localStorage)           (Drizzle ORM)                    │
└────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                Servidor próprio (a confirmar)                        │
│  - PostgreSQL 15+ (porta 5432, local)                               │
│  - Filesystem /var/www/conecta/uploads/                             │
│  - SMTP (envio de email)                                            │
└────────────────────────────────────────────────────────────────────┘
```

---

## 4. Modelagem de dados (DDL provisório)

### 4.1 Tabelas core

```sql
-- Usuarios (admin)
CREATE TABLE usuarios (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL UNIQUE,
  senha_hash   TEXT NOT NULL,
  nome         TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  ativo        BOOLEAN NOT NULL DEFAULT true,
  ultimo_login TIMESTAMPTZ,
  criado_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categorias
CREATE TABLE categorias (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  nome            TEXT NOT NULL,
  descricao_curta TEXT,
  descricao_longa TEXT,
  icone_url       TEXT,
  cor             TEXT DEFAULT '#1A1F8F',
  ordem           INT NOT NULL DEFAULT 0,
  destaque        BOOLEAN NOT NULL DEFAULT false,
  -- traduções
  nome_en         TEXT,
  nome_es         TEXT,
  descricao_curta_en TEXT,
  descricao_curta_es TEXT,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_categorias_ordem ON categorias(ordem);

-- Produtos
CREATE TABLE produtos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  modelo          TEXT NOT NULL,
  nome            TEXT NOT NULL,
  categoria_id    UUID NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
  subcategoria    TEXT,
  marca           TEXT NOT NULL DEFAULT 'SHINOVA',
  descricao_curta TEXT,
  descricao_longa TEXT,
  especificacoes  JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{chave, valor}]
  aplicacoes      JSONB NOT NULL DEFAULT '[]'::jsonb, -- ["clínica geral", ...]
  diferenciais    JSONB NOT NULL DEFAULT '[]'::jsonb,
  galeria         JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{url, ordem, alt}]
  video_url       TEXT,
  destaque        BOOLEAN NOT NULL DEFAULT false,
  publicado       BOOLEAN NOT NULL DEFAULT true,
  ordem           INT NOT NULL DEFAULT 0,
  meta_titulo     TEXT,
  meta_descricao  TEXT,
  -- traduções
  descricao_longa_en TEXT,
  descricao_longa_es TEXT,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_publicado ON produtos(publicado);
CREATE INDEX idx_produtos_destaque ON produtos(destaque) WHERE destaque = true;
CREATE INDEX idx_produtos_search ON produtos USING gin (to_tsvector('portuguese', modelo || ' ' || nome || ' ' || coalesce(descricao_curta,'')));

-- Formularios (todos os formulários do site)
CREATE TYPE formulario_tipo AS ENUM ('contato', 'orcamento_geral', 'orcamento_produto');
CREATE TYPE formulario_status AS ENUM ('novo', 'em_contato', 'qualificado', 'convertido', 'perdido');

CREATE TABLE formularios (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo                  formulario_tipo NOT NULL,
  nome                  TEXT NOT NULL,
  email                 TEXT NOT NULL,
  whatsapp              TEXT,
  telefone              TEXT,
  tipo_estabelecimento  TEXT,
  nome_estabelecimento  TEXT,
  cidade                TEXT,
  estado                TEXT,
  cargo                 TEXT,
  produto_id            UUID REFERENCES produtos(id) ON DELETE SET NULL,
  produto_modelo        TEXT, -- snapshot
  mensagem              TEXT,
  status                formulario_status NOT NULL DEFAULT 'novo',
  notas_internas        TEXT,
  origem_pagina         TEXT,
  ip_address            INET,
  user_agent            TEXT,
  consentimento_lgpd    BOOLEAN NOT NULL DEFAULT false,
  criado_em             TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_formularios_status ON formularios(status);
CREATE INDEX idx_formularios_tipo ON formularios(tipo);
CREATE INDEX idx_formularios_criado ON formularios(criado_em DESC);

-- Blog Posts
CREATE TYPE blog_status AS ENUM ('pendente', 'publicado', 'rascunho', 'rejeitado');
CREATE TYPE blog_origem AS ENUM ('publico', 'admin');

CREATE TABLE blog_posts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT NOT NULL UNIQUE,
  titulo            TEXT NOT NULL,
  resumo            TEXT,
  conteudo          TEXT NOT NULL, -- markdown
  capa_url          TEXT,
  autor_nome        TEXT NOT NULL,
  autor_email       TEXT,
  tags              JSONB NOT NULL DEFAULT '[]'::jsonb,
  status            blog_status NOT NULL DEFAULT 'pendente',
  origem            blog_origem NOT NULL DEFAULT 'publico',
  motivo_rejeicao   TEXT,
  aprovado_por      UUID REFERENCES usuarios(id),
  aprovado_em       TIMESTAMPTZ,
  publicado_em      TIMESTAMPTZ,
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_blog_status ON blog_posts(status);
CREATE INDEX idx_blog_publicado_em ON blog_posts(publicado_em DESC) WHERE status = 'publicado';
CREATE INDEX idx_blog_tags ON blog_posts USING gin (tags);

-- Eventos
CREATE TABLE eventos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  nome            TEXT NOT NULL,
  data_evento     DATE NOT NULL,
  local           TEXT,
  descricao_curta TEXT,
  descricao_longa TEXT,
  capa_url        TEXT,
  galeria         JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{url, ordem, alt, caption}]
  publicado       BOOLEAN NOT NULL DEFAULT true,
  ordem           INT NOT NULL DEFAULT 0,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_eventos_data ON eventos(data_evento DESC);
CREATE INDEX idx_eventos_publicado ON eventos(publicado);

-- Conteudo Site (textos editáveis)
CREATE TABLE conteudo_site (
  chave         TEXT PRIMARY KEY,
  valor         TEXT NOT NULL,
  tipo          TEXT NOT NULL CHECK (tipo IN ('texto', 'html', 'url', 'numero')),
  pagina        TEXT,
  descricao     TEXT,
  ordem         INT DEFAULT 0,
  -- traduções
  valor_en      TEXT,
  valor_es      TEXT,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configuracoes Empresa
CREATE TABLE configuracoes_empresa (
  chave         TEXT PRIMARY KEY,
  valor         JSONB NOT NULL,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.2 Tabelas auxiliares (sessões e auditoria)

```sql
-- Sessões (Auth.js)
CREATE TABLE sessoes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  expira_em   TIMESTAMPTZ NOT NULL,
  ip          INET,
  user_agent  TEXT,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sessoes_token ON sessoes(token);

-- Auditoria (mudanças no admin)
CREATE TABLE auditoria (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID REFERENCES usuarios(id),
  entidade    TEXT NOT NULL,      -- produto, categoria, blog_post, etc.
  entidade_id UUID,
  acao        TEXT NOT NULL,      -- create, update, delete, approve, reject
  diff        JSONB,              -- snapshot do antes/depois
  ip          INET,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_auditoria_entidade ON auditoria(entidade, entidade_id);
CREATE INDEX idx_auditoria_criado ON auditoria(criado_em DESC);
```

### 4.3 Trigger genérico de `atualizado_em`

```sql
CREATE OR REPLACE FUNCTION set_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar em todas as tabelas com atualizado_em:
CREATE TRIGGER trg_categorias_updated   BEFORE UPDATE ON categorias   FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
CREATE TRIGGER trg_produtos_updated     BEFORE UPDATE ON produtos     FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
CREATE TRIGGER trg_formularios_updated  BEFORE UPDATE ON formularios  FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
CREATE TRIGGER trg_blog_updated         BEFORE UPDATE ON blog_posts   FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
CREATE TRIGGER trg_eventos_updated      BEFORE UPDATE ON eventos      FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
CREATE TRIGGER trg_usuarios_updated     BEFORE UPDATE ON usuarios     FOR EACH ROW EXECUTE FUNCTION set_atualizado_em();
```

---

## 5. Interface Repository (TypeScript)

```typescript
// src/lib/repositories/types.ts
export interface CategoriaRepository {
  listar(): Promise<Categoria[]>;
  porSlug(slug: string): Promise<Categoria | null>;
  porId(id: string): Promise<Categoria | null>;
  criar(input: CategoriaInput): Promise<Categoria>;
  atualizar(id: string, input: Partial<CategoriaInput>): Promise<Categoria>;
  remover(id: string): Promise<void>;
  reordenar(ordemAtualizada: Array<{ id: string; ordem: number }>): Promise<void>;
}

export interface ProdutoRepository {
  listar(filtros?: ProdutoFiltros): Promise<Paginated<Produto>>;
  porSlug(slug: string): Promise<Produto | null>;
  porId(id: string): Promise<Produto | null>;
  porCategoria(categoriaSlug: string, filtros?: ProdutoFiltros): Promise<Paginated<Produto>>;
  emDestaque(limite?: number): Promise<Produto[]>;
  relacionados(produtoId: string, limite?: number): Promise<Produto[]>;
  criar(input: ProdutoInput): Promise<Produto>;
  atualizar(id: string, input: Partial<ProdutoInput>): Promise<Produto>;
  remover(id: string): Promise<void>;
  buscar(termo: string): Promise<Produto[]>;
}

// ... idem para FormularioRepository, BlogPostRepository, EventoRepository, ConteudoRepository, ConfigRepository
```

### 5.1 Implementação Mock (Sprint 0)

```typescript
// src/lib/repositories/mock/produto-repository.ts
import produtosSeed from '@/data/produtos.json';

export class MockProdutoRepository implements ProdutoRepository {
  private getProdutos(): Produto[] {
    if (typeof window !== 'undefined') {
      const override = localStorage.getItem('conecta_produtos');
      if (override) return JSON.parse(override);
    }
    return produtosSeed as Produto[];
  }
  // ... CRUD operando em memória/localStorage
}
```

### 5.2 Implementação Postgres (Sprint 6)

```typescript
// src/lib/repositories/postgres/produto-repository.ts
import { db } from '@/lib/db';
import { produtos } from '@/lib/db/schema';

export class PostgresProdutoRepository implements ProdutoRepository {
  async porSlug(slug: string): Promise<Produto | null> {
    const [row] = await db.select().from(produtos).where(eq(produtos.slug, slug));
    return row ?? null;
  }
  // ... mesma interface, troca apenas o adapter
}
```

### 5.3 Injeção do Repository

```typescript
// src/lib/repositories/index.ts
const isProduction = process.env.NODE_ENV === 'production' && process.env.USE_REAL_DB === 'true';

export const produtoRepo: ProdutoRepository = isProduction
  ? new PostgresProdutoRepository()
  : new MockProdutoRepository();
```

---

## 6. Segurança

| Camada | Medida |
|---|---|
| **Senhas** | argon2id (não bcrypt — mais resistente a GPU/ASIC) |
| **Sessões** | Cookie httpOnly + Secure + SameSite=Lax, expiração 7 dias com renovação |
| **CSRF** | Token CSRF em forms (Next.js Server Actions já mitigam, mas reforçar) |
| **Rate limit** | 5 req/min para login, 3/h para submissão pública, 20/h para contato |
| **Upload** | Validação MIME real (não só extensão) + max 10MB + sanitização nome |
| **SQL injection** | Drizzle/Prisma com prepared statements — sem string concat |
| **XSS** | DOMPurify para conteúdo de blog (autor público) |
| **Headers** | Helmet equivalente: CSP, X-Frame-Options, HSTS, Referrer-Policy |
| **LGPD** | Consentimento explícito + opção de remoção de dados + retenção definida |

---

## 7. Deploy (Sprint 7)

### Cenário esperado (VPS Linux)

```bash
# Provisionamento
sudo apt install -y postgresql-15 nginx certbot python3-certbot-nginx nodejs npm
sudo npm install -g pm2

# Build local
bun install
bun run build

# Deploy
rsync -avz --delete ./.next ./public ./package.json ./bun.lock ./node_modules user@servidor:/var/www/conecta/
ssh user@servidor "cd /var/www/conecta && pm2 reload ecosystem.config.js"
```

### `ecosystem.config.js` PM2

```js
module.exports = {
  apps: [{
    name: 'conecta',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production' }
  }]
};
```

### Nginx (proxy + uploads)

```nginx
server {
  listen 80;
  server_name conectavet.com.br;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name conectavet.com.br;
  ssl_certificate /etc/letsencrypt/live/conectavet.com.br/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/conectavet.com.br/privkey.pem;

  location /_next/static/ {
    proxy_pass http://localhost:3000;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
  location /uploads/ {
    alias /var/www/conecta/uploads/;
    expires 30d;
  }
  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

---

## 8. Riscos arquiteturais e mitigações

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | Servidor do cliente não suporta Node 20+ ou Postgres 15 | Baixa | Alto | Sprint 6 inicia com discovery; fallback para Node 18 + PG 13 |
| R2 | Migração Lovable→Next.js leva mais que 3 dias | Média | Médio | Sprint 0 com margem; cortar features não-essenciais se necessário |
| R3 | Geolocalização sem Cloudflare/Vercel headers | Alta | Baixo | Plano B: API ipapi.co (gratuita) + cache |
| R4 | Mock data desincroniza entre máquinas | Baixa | Baixo | Persistir em arquivo + git ignore opcional |
| R5 | Cliente quer mudar visual no meio da Sprint 5 | Média | Médio | Design system com tokens — facilita ajustes em massa |
| R6 | Hospedagem compartilhada do cliente (cPanel sem Node) | Baixa | Crítico | Esclarecer com Matheus assim que receber acesso; pior caso: alugar VPS DigitalOcean R$30/mês |

---

## 9. Aprovações e próximos passos

### Aprovado para execução
✅ Sprints 0–5 do PRD estão arquiteturalmente sólidas. Recomendado começar pela Sprint 0 imediatamente, com atenção especial aos pontos A1 (migração profunda), A2 (separação Mock client/server) e A5 (anti-spam blog).

### Bloqueios
🚫 Sprint 6 (banco) e Sprint 7 (deploy) requerem acesso ao servidor — sem isso, sem cronograma final.

### Recomendações finais
1. Antes de começar Sprint 0, fazer **backup do branch atual** (`git tag pre-nextjs-migration`)
2. Trabalhar em branch separada `feat/nextjs-migration` durante Sprint 0
3. Documentar todas as decisões em ADRs futuros em `docs/architecture/decisions/`
4. Definir já agora: **Drizzle** ou **Prisma**? Recomendação Atlas: **Drizzle** (mais leve, SQL-first, melhor TypeScript inference)
5. Definir já agora: **Auth.js v5** ou **Lucia**? Recomendação Atlas: **Auth.js v5** (mais maduro, comunidade enorme)

— @architect Atlas, validando a base 🏛️
