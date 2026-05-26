# Sprints de Execução — Projeto Conecta

**Versão:** 1.0
**Data:** 2026-05-26
**Autor:** @pm (Aria) — orquestrado por Orion
**Referência:** [PRD Conecta](../prd/conecta-prd.md)
**Estratégia:** Banco em aberto. Sprints 0–5 usam **mock data** (JSON local + Repository pattern). Sprints 6–7 dependem de acesso ao servidor.

---

## Legenda

- 🟢 **S** (1–2 dias) | 🟡 **M** (3–5 dias) | 🟠 **L** (5–8 dias) | 🔴 **XL** (8+ dias)
- ✅ pode executar agora | ⏳ aguarda dependência | 🚫 bloqueado (servidor)

---

# 📦 SPRINT 0 — Setup e fundação (3 dias) ✅

**Objetivo:** Preparar o repo para a nova realidade (Next.js + sem Supabase + mock data layer).

## S0-01 — Migrar de TanStack Start para Next.js 15 🟡 M
**AC:**
- Next.js 15 App Router instalado
- Estrutura `src/app/(site)` e `src/app/(admin)/admin` criada
- Rotas atuais (`src/routes/*.tsx`) migradas para rotas equivalentes em `src/app/`
- Dev server roda em `npm run dev` sem erros
- Build em `npm run build` passa

**Tarefas:**
- Backup do `src/routes/` antes de remover
- Setup do `app/` com layouts (root + site + admin)
- Migrar `index.tsx` → `app/(site)/page.tsx`
- Migrar `sobre.tsx` → `app/(site)/sobre/page.tsx` etc.
- Migrar `admin.*.tsx` → `app/(admin)/admin/.../page.tsx`
- Atualizar `next.config.js`, `tsconfig.json`

## S0-02 — Remover dependências Supabase + Cloudflare 🟢 S
**AC:**
- `package.json` sem `@supabase/supabase-js`, `@cloudflare/vite-plugin`, `@tanstack/react-start`, `@tanstack/react-router`, `wrangler`
- `wrangler.jsonc`, `bunfig.toml`, `vite.config.ts` removidos ou esvaziados
- `.env` limpo de chaves Supabase

**Tarefas:**
- `bun remove` das deps
- Apagar `src/integrations/supabase/`
- Apagar `supabase/migrations/` (manter como referência em `docs/reference/legacy-supabase-migrations/`)

## S0-03 — Camada de dados mock (Repository pattern) 🟡 M
**AC:**
- `src/lib/repositories/types.ts` com interfaces tipadas (CategoriaRepo, ProdutoRepo, FormularioRepo, BlogPostRepo, EventoRepo, ConteudoRepo, ConfigRepo)
- `src/lib/repositories/mock/` com implementação que lê de `data/*.json`
- `data/categorias.json` (8 categorias reais do briefing)
- `data/produtos.json` (10 produtos fictícios para demonstração)
- `data/blog-posts.json`, `data/eventos.json`, `data/conteudo-site.json`, `data/formularios.json`
- Hook `useRepository()` injeta o repo no React (provider)

**Tarefas:**
- Definir interfaces TypeScript
- Implementar MockRepository com leitura/escrita em memória + persistência opcional em localStorage para admin
- Popular JSON inicial com 8 categorias reais do briefing

## S0-04 — Design tokens + fonts + paleta 🟢 S
**AC:**
- Fontes Instrument Serif + Work Sans + JetBrains Mono carregadas (Google Fonts ou @fontsource)
- CSS variables com paleta confirmada (`--bg`, `--ink`, `--conecta-blue`, `--conecta-orange`, etc.)
- Tailwind config atualizado para usar tokens
- `tailwind.config.ts` com `theme.extend.fontFamily` e `theme.extend.colors`
- Documentado em `docs/ux/design-tokens.md`

## S0-05 — Auth admin mock 🟢 S
**AC:**
- Página `/admin/login` com form (email + senha)
- Credenciais mock fixas: `admin@conecta.dev` / `admin123` (anotar no .env.example)
- Middleware básico que redireciona não-autenticado de `/admin/*` para `/admin/login`
- Cookie httpOnly de sessão mock
- Logout funcionando

**⚠️ Nota:** auth definitiva (Auth.js / Lucia) entra na Sprint 6 quando tiver banco real.

**Tracking sprint 0:** rodar `npm run dev` ao final + checklist visual.

---

# 🎨 SPRINT 1 — Visual Premium e Logo (5 dias) ✅

**Objetivo:** Elevar visual do site ao padrão editorial premium aprovado pelo cliente, com logo nova sem fundo.

## S1-01 — Processar logo (remover fundo) 🟢 S
**AC:**
- Logo `Logo Conecta.jpeg` processada → PNG transparente
- Salva em `public/logo-conecta.png`
- Variantes: `logo-conecta.png` (full), `logo-conecta-icon.png` (só ícone para favicon)
- `app/favicon.ico` gerado a partir do ícone

**Opções de execução:**
1. **rembg (Python)** — `pip install rembg && rembg i input.jpeg output.png` (recomendado, gratuito, local)
2. **remove.bg** — API online (precisa de chave, 50 grátis/mês)
3. **Manual** — Photoshop/GIMP/Figma

## S1-02 — Navbar editorial 🟢 S
**AC:**
- Logo a 48px de altura (não minúscula)
- Links: Home / Produtos / Soluções / Blog / Eventos / Sobre / Contato
- Idioma toggle (PT 🇧🇷 / EN 🇺🇸 / ES 🇪🇸) — placeholder na Sprint 1, funcional Sprint 5
- Mobile: menu hamburger com drawer Framer Motion
- Sticky com `backdrop-blur`

## S1-03 — Hero da Home editorial 🟢 S
**AC:**
- Headline em Instrument Serif gigante (clamp responsivo 48–96px)
- Sub-headline em Work Sans
- 2 CTAs: primário (laranja Conecta — "Solicitar orçamento") + secundário (outline — "Explorar catálogo")
- Numeração editorial 01 ao lado
- Animação de entrada Framer Motion (stagger)

## S1-04 — Grid de 8 Categorias 🟢 S
**AC:**
- Cards com ícone SVG (não foto grande), nome, descrição curta
- Hover sutil (sombra leve + leve elevação)
- Click navega para `/produtos/categoria/:slug`
- Mobile: grid 2 colunas; desktop: 4 colunas

## S1-05 — Marquee infinito 🟢 S
**AC:**
- Componente reutilizável `<Marquee>` com texto repetido
- Texto: "Equipamentos veterinários premium • Distribuidora oficial Shinova • Atendimento técnico especializado"
- Animação CSS infinita (sem JS)
- Variantes: light e dark

## S1-06 — Produtos em destaque + Sobre + Depoimento + CTA fechamento 🟡 M
**AC:**
- Carrossel/grid de produtos destaque (lê do mock repo)
- Bloco "Sobre" editorial (texto + imagem opcional)
- Depoimento com aspas grandes + foto autor + cargo
- CTA fechamento: WhatsApp + link contato

## S1-07 — Footer premium 🟢 S
**AC:**
- 4 colunas: Logo+descrição / Catálogo (links categorias) / Empresa (links institucionais) / Contato (whats, email, redes)
- Linha inferior: copyright + CNPJ + LGPD links
- Fundo escuro com texto inverso

## S1-08 — Catálogo `/produtos` editorial 🟡 M
**AC:**
- Filtros laterais (categoria, subcategoria, busca)
- Ordenação dropdown
- Grid responsivo
- Cards com imagem `object-cover` 100% (sem padding excessivo)
- Hover sutil

## S1-09 — Categoria `/produtos/categoria/:slug` 🟢 S
**AC:**
- Header com número editorial + nome + descrição
- Breadcrumb
- Listagem de produtos
- **Fallback amigável** se categoria vazia (mensagem + CTA WhatsApp)

## S1-10 — Detalhe de produto `/produtos/:slug` 🟡 M
**AC:**
- Galeria de imagens com thumb + main (clique troca, opcional lightbox)
- Tabs: Descrição / Especificações / Aplicações / Vídeo
- Formulário de orçamento integrado com pré-preenchimento
- Botão WhatsApp com mensagem (modelo + link)
- Produtos relacionados ao final

## S1-11 — Páginas Soluções, Sobre, Contato 🟢 S cada
**AC:**
- `/solucoes` com cards por segmento (Clínica, Hospital, Universidade, Pet shop)
- `/sobre` com história + valores + time
- `/contato` com formulário + mapa estático + dados

## S1-12 — Botão WhatsApp flutuante global 🟢 S
**AC:**
- Componente `<WhatsAppFab>` fixed bottom-right em todas as páginas
- Mensagem pré-preenchida configurável
- Em página de produto: inclui modelo automaticamente
- Animação pulse sutil

---

# ✍️ SPRINT 2 — Blog (público + admin moderação) (5 dias) ✅

**Objetivo:** Sistema completo de blog com submissão pública moderada.

## S2-01 — Listagem `/blog` 🟢 S
**AC:**
- Grid de cards (capa + título + resumo + data + autor + tags)
- Filtro por tag
- Paginação (12 posts por página)
- Posts ordenados por `publicado_em` desc

## S2-02 — Post individual `/blog/:slug` 🟡 M
**AC:**
- Layout editorial (largura máx 720px conteúdo, lateral com TOC opcional)
- Capa hero + título Instrument Serif + meta (autor, data, tempo de leitura)
- Renderização do conteúdo rich text (markdown via `react-markdown` ou HTML sanitizado)
- Compartilhamento (WhatsApp, LinkedIn, copy link)
- CTA orçamento ao final
- Posts relacionados (mesma tag)

## S2-03 — Submissão pública `/blog/enviar` 🟡 M
**AC:**
- Form com Zod validation: nome autor, email, título, resumo, conteúdo (textarea grande ou editor simples), capa upload opcional, tags (multi-select)
- Captcha simples (honeypot ou math) anti-spam
- Após envio: tela de confirmação "Obrigado! Seu post está em moderação"
- Post entra no MockRepo com status `pendente`

## S2-04 — Admin Blog — listagem `/admin/blog` 🟡 M
**AC:**
- Tabs por status: Todos / **Pendentes** (badge contador) / Publicados / Rascunhos / Rejeitados
- Listagem com colunas: capa, título, autor, data envio, status, ações
- Filtro por tag, busca por título

## S2-05 — Admin Blog — moderação 🟡 M
**AC:**
- Modal/drawer de detalhe do post pendente
- Ações:
  - **Aprovar** → status `publicado` + define `publicado_em` = agora
  - **Editar antes de aprovar** → editor inline
  - **Rejeitar** → motivo + status `rejeitado` (envia email opcional na Sprint 4)
  - **Excluir**

## S2-06 — Admin Blog — criação direta 🟢 S
**AC:**
- Botão "Novo post"
- Editor rich text (TipTap ou Lexical ou markdown)
- Post criado pelo admin nasce como `publicado` direto
- Upload de capa
- Tags livres

## S2-07 — Mock data e seed de blog 🟢 S
**AC:**
- 5 posts de exemplo populados em `data/blog-posts.json`
- 2 pendentes para demonstrar fluxo
- Tags consistentes (anestesia, diagnóstico, gestão clínica, etc.)

---

# 📸 SPRINT 3 — Galeria de Eventos (4 dias) ✅

**Objetivo:** Página pública e admin para galeria de feiras/eventos.

## S3-01 — Listagem `/eventos` 🟡 M
**AC:**
- Header editorial "Feiras & Eventos" + descrição
- Cards cronológicos: capa + nome + data + local + descrição curta
- Filtro por ano (dropdown)
- Ordenação: data desc por padrão
- Grid responsivo (1/2/3 colunas)

## S3-02 — Detalhe de evento `/eventos/:slug` 🟡 M
**AC:**
- Capa hero
- Nome + data + local + descrição
- **Galeria de fotos com lightbox** (clica abre tela cheia + navegação setas/swipe)
- Lazy loading das imagens
- CTA: "Próximos eventos? Fale com a gente" + WhatsApp

## S3-03 — Admin Eventos — listagem `/admin/eventos` 🟢 S
**AC:**
- Listagem cronológica
- Filtros: ano, publicado/rascunho
- Ações por evento: editar, excluir, toggle publicado

## S3-04 — Admin Eventos — criação/edição 🟡 M
**AC:**
- Form: nome, slug auto, data (date picker), local, descrição curta, descrição longa
- Upload de capa
- **Upload múltiplo de fotos da galeria** com reordenação drag-drop + alt + caption opcional
- Toggle publicado
- Preview lateral

## S3-05 — Mock seed de eventos 🟢 S
**AC:**
- 3 eventos de exemplo (Pet South America 2024, CBVet 2024, etc.) em `data/eventos.json`
- Cada um com 5–10 fotos placeholder (unsplash veterinary)

---

# 🛠️ SPRINT 4 — Admin completo (6 dias) ✅

**Objetivo:** Fechar todas as abas do painel admin que ainda faltam.

## S4-01 — Dashboard `/admin` 🟢 S
**AC:**
- Cards de estatística (mock contadores): produtos, formulários novos, posts pendentes, eventos
- Lista "Últimos 5 formulários" + "Últimos 5 posts pendentes"
- Atalhos rápidos

## S4-02 — CRUD Produtos `/admin/produtos` (completo) 🟠 L
**AC:**
- Listagem com busca, filtro categoria, filtro publicado, ordenação
- Form de edição com:
  - Modelo, nome, slug (auto), categoria, subcategoria, marca
  - Descrição curta + descrição longa (rich text)
  - Editor de especificações (chave/valor dinâmico, adicionar/remover)
  - Listas: aplicações, diferenciais
  - Galeria: upload múltiplo + drag-drop reorder + alt
  - URL YouTube
  - SEO: meta título, meta descrição
  - Toggles: destaque, publicado
- Validação Zod
- Persistência no MockRepo (localStorage)

## S4-03 — CRUD Categorias `/admin/categorias` 🟡 M
**AC:**
- Listagem com drag-drop reorder
- Form: nome, slug, descrição curta/longa, ícone (upload SVG/PNG 200×200), cor, destaque, ordem
- Validação Zod

## S4-04 — Página Inicial `/admin/pagina-inicial` 🟡 M
**AC:**
- Toggle ON/OFF para cada seção da home
- Drag-drop para reordenar seções
- Selector de produtos em destaque (multi-select)
- Editor do depoimento (texto, autor, cargo, foto)
- Preview lateral (opcional)

## S4-05 — Editor de Conteúdo `/admin/conteudo` 🟡 M
**AC:**
- Tabs: Home / Sobre / Contato / Global / Footer
- Listagem de chaves de conteúdo com tipo (texto/html/url)
- Edição inline (sem modal)
- Salvar persiste no MockRepo
- Aviso "Não salvo" se houver mudança pendente

## S4-06 — Caixa de Formulários `/admin/formularios` 🟠 L
**AC:**
- Listagem com colunas: data, tipo, nome, email, status, ações
- Filtros: status (novo/em_contato/qualificado/convertido/perdido), tipo, período (date range)
- Busca por nome/email/whatsapp
- Drawer lateral com detalhes completos
- Campo notas internas (textarea)
- Botão "Abrir WhatsApp" com mensagem pré-preenchida (nome + produto se houver)
- Botão "Marcar status" (dropdown)
- Exportação CSV (gera download)
- Mock seed com 10 formulários variados

## S4-07 — Configurações `/admin/configuracoes` 🟡 M
**AC:**
- Tabs:
  - **Empresa:** nome, CNPJ, endereço, descrição institucional, missão/valores
  - **Contato:** telefones (lista), emails (lista), WhatsApp principal, mensagem WhatsApp pré-preenchida
  - **Redes sociais:** Instagram, Facebook, LinkedIn, YouTube (URLs)
  - **SEO:** título global, descrição global, OG image upload, palavras-chave
  - **Admin:** lista de admins, criar novo (mock), alterar senha
- Persistência no MockRepo

## S4-08 — Layout admin compartilhado 🟢 S
**AC:**
- Sidebar com navegação para todas as abas
- Header com nome do admin logado + logout
- Breadcrumb
- Responsivo (mobile colapsa sidebar)

---

# 🌍 SPRINT 5 — i18n, SEO e Polish final (5 dias) ✅

**Objetivo:** Tradução automática, otimização SEO e polish geral antes da integração com banco.

## S5-01 — i18n com next-intl 🟠 L
**AC:**
- `next-intl` configurado
- 3 locales: `pt`, `en`, `es`
- `messages/pt.json`, `messages/en.json`, `messages/es.json` populados com todas as strings da UI
- URLs com prefix de locale: `/`, `/en/`, `/es/`
- Toggle de idioma na navbar funcional + persistente em cookie

## S5-02 — Geolocalização → idioma default 🟡 M
**AC:**
- Middleware lê `geo` do header (Vercel/Cloudflare) ou IP via API
- Mapeia país → locale (BR/PT/AO → pt; ES/AR/MX/CL/UY/PE/CO → es; demais → en)
- Redirect na primeira visita; respeita cookie em visitas seguintes
- Fallback: pt

## S5-03 — SEO técnico 🟡 M
**AC:**
- `sitemap.xml` gerado dinamicamente (`app/sitemap.ts`)
- `robots.txt` (`app/robots.ts`)
- Meta tags Open Graph + Twitter Card em todas as páginas
- Schema.org JSON-LD:
  - `Organization` no root layout
  - `Product` em página de produto
  - `Article` em post de blog
  - `Event` em página de evento
  - `BreadcrumbList` onde aplicável
- Canonical URLs

## S5-04 — Core Web Vitals 🟡 M
**AC:**
- LCP ≤ 2.5s mobile
- CLS ≤ 0.1
- FID/INP ≤ 200ms
- Imagens otimizadas com `next/image` (responsive, AVIF/WebP, lazy)
- Fontes com `font-display: swap` + preload de pesos críticos
- Code splitting agressivo (dynamic imports para admin)

## S5-05 — LGPD básica 🟢 S
**AC:**
- Banner cookies com opções (aceitar todos, só essenciais, configurar)
- Página `/politica-privacidade`
- Página `/termos-de-uso`
- Checkbox de consentimento em todos os formulários

## S5-06 — Acessibilidade 🟡 M
**AC:**
- Skip-link no topo
- ARIA labels onde necessário
- Contraste WCAG AA mínimo
- Navegação por teclado em todos os interactives
- Alt text em todas as imagens
- Foco visível custom (não default azul)
- Audit com axe-core

## S5-07 — Polish e revisão 🟡 M
**AC:**
- Auditoria visual comparativa (site Conecta vs referência IDEXX)
- Microinterações Framer Motion onde fizer sentido (scroll reveal, count-up, page transition sutil)
- Loading states e empty states em todas as listagens
- 404 customizada (`app/not-found.tsx`)
- Error boundary global

---

# 🗄️ SPRINT 6 — Integração com banco real (5 dias) 🚫 BLOQUEADO

> Aguarda Matheus receber acesso ao servidor do cliente.

## S6-01 — Discovery do servidor 🟢 S
**AC:**
- Conexão SSH funcional
- Inventário: OS, PostgreSQL versão, Node versão, espaço em disco, RAM
- Decisão: ORM (Drizzle ou Prisma) + auth (Auth.js ou Lucia)

## S6-02 — Provisionamento PostgreSQL 🟢 S
**AC:**
- Banco `conecta_prod` criado
- Usuário com privilégios apropriados
- Backup automático configurado
- Connection string em `.env`

## S6-03 — Migrations + schema real 🟡 M
**AC:**
- Migrations em `db/migrations/` aplicando o schema completo
- Tabelas: users, categorias, produtos, formularios, blog_posts, eventos, conteudo_site, configuracoes
- Índices em colunas de busca/filtro
- Foreign keys + cascade rules

## S6-04 — Substituir MockRepository por PostgresRepository 🟠 L
**AC:**
- Implementação `src/lib/repositories/postgres/` usando ORM escolhido
- Mesma interface — páginas não mudam
- Seed inicial das 8 categorias reais + admin Erwing
- Migração de dados de mock JSON → banco real (script único)

## S6-05 — Auth real (Auth.js ou Lucia) 🟡 M
**AC:**
- Login funcional com PostgreSQL
- Hash bcrypt/argon2
- Sessão httpOnly
- Rate limit no login (anti brute-force)

## S6-06 — Storage de uploads 🟡 M
**AC:**
- Filesystem local (`/var/www/conecta/uploads`) OU S3-compat
- API route de upload com validação (tipo, tamanho)
- URLs de servir as imagens otimizadas

## S6-07 — Email SMTP 🟢 S
**AC:**
- Envio de email funcional (Nodemailer + SMTP do servidor)
- Templates: novo formulário recebido (notifica admin), post aprovado (notifica autor)

---

# 🚀 SPRINT 7 — QA + Go-live (2 dias) 🚫 BLOQUEADO

## S7-01 — Treinamento Erwing 🟢 S
**AC:**
- Sessão remota gravada (1h)
- Tutorial em vídeo dos principais fluxos
- Documentação `docs/manual-admin.md`

## S7-02 — Deploy produção 🟡 M
**AC:**
- Build de produção otimizado
- PM2 + Nginx OU Docker configurados
- HTTPS com Certbot/Let's Encrypt
- Domínio do cliente apontado
- Logs e monitoramento

## S7-03 — Smoke test pós-go-live 🟢 S
**AC:**
- Checklist de 50+ itens executado
- Performance Lighthouse ≥ 90 mobile
- Sem erros JS no console
- Formulários gravando no banco
- Email saindo

---

# 📊 Resumo macro

| Sprint | Duração | Status | Pode rodar? |
|---|---|---|---|
| Sprint 0 — Setup | 3 dias | ✅ | **Sim, agora** |
| Sprint 1 — Visual Premium | 5 dias | ✅ | **Sim, depois da S0** |
| Sprint 2 — Blog | 5 dias | ✅ | **Sim, depois da S0** |
| Sprint 3 — Eventos | 4 dias | ✅ | **Sim, depois da S0** |
| Sprint 4 — Admin completo | 6 dias | ✅ | **Sim, depois da S0** |
| Sprint 5 — i18n + SEO | 5 dias | ✅ | **Sim, depois da S1+S2+S3+S4** |
| Sprint 6 — Banco real | 5 dias | 🚫 | **Bloqueado: acesso servidor** |
| Sprint 7 — Go-live | 2 dias | 🚫 | **Bloqueado: S6 concluída** |

**Sprints executáveis agora (sem banco):** 0–5 = **28 dias úteis** (~6 semanas)
**Sprints aguardando servidor:** 6–7 = **7 dias úteis** (~1.5 semana)
**Folga dentro dos 60 dias corridos do contrato:** ~14 dias úteis (margem segura)

---

# 🎯 Ordem recomendada de execução

1. **Sprint 0** (setup, fundação técnica) — bloqueador de tudo
2. **Sprint 1** (visual premium + logo) — primeiro impacto visível
3. Em paralelo:
   - **Sprint 2** (Blog) e **Sprint 3** (Eventos) podem rodar simultâneos
4. **Sprint 4** (Admin completo) — completa a operação interna
5. **Sprint 5** (i18n + SEO + polish) — qualidade final
6. ⏸️ Pausa para receber acesso ao servidor
7. **Sprint 6** (banco real) + **Sprint 7** (go-live) — em sequência

---

# 🧪 Definition of Done (DoD) global

Toda história só é considerada concluída quando:
- [ ] Tipo-checagem passa (`tsc --noEmit` sem `any`)
- [ ] Lint passa (`bun run lint`)
- [ ] Build passa (`bun run build`)
- [ ] Testada manualmente em mobile + desktop
- [ ] Sem warnings no console
- [ ] Componentes ≤ 200 linhas
- [ ] Strings de UI passíveis de tradução (não hardcoded)
- [ ] Validação Zod em todos os formulários
- [ ] AC do PRD atendidos
- [ ] Commit convencional (feat/fix/chore/refactor/style)
