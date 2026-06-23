# Plano de Execução — Conecta GO-LIVE

**Versão:** 2.0 · **Data:** 2026-06-23 · **Orquestrado por:** Orion (AIOS Master)
**Substitui:** `conecta-sprints.md` v1.0 (modelo mock/servidor próprio — descontinuado)
**Meta:** Colocar no ar **site + admin + 9 LPs** no Vercel, tudo no **Supabase**, leads caindo no painel, domínios via Registro.br→Vercel. Depois → **fechamento do site**.

---

## 📊 PROGRESSO (atualizado 2026-06-23)

- ✅ **Sprint 0 — Fundação Supabase: CONCLUÍDO.** 7 migrations aplicadas no projeto novo (`xrotxaapnkyokgebpodv`), 8 tabelas+RLS validadas, admin criado (`conectamondragon@gmail.com` + papel admin), `.env`/`.env.local`/`leads.ts` re-apontados. Pooler: `aws-1-us-east-2`.
- ✅ **Sprint 1 — Leads das LPs: código pronto** (insert testado 201). Falta só **rebuild** das 9 LPs (Sprint 4).
- ✅ **Sprint 2 — Admin real + forms no Supabase: CÓDIGO PRONTO (typecheck+build OK).** Login mock→Supabase Auth; `admin.formularios` lê do banco; forms do site (ContactSection/QuoteModal) gravam via `submitFormulario`. ⏳ Falta **teste ao vivo** (login + lead aparecendo no painel) com `npm run dev`.
- 🔄 **Sprint 3 — EM ANDAMENTO:**
  - ✅ Sprint 2 validado ao vivo (login admin OK, lê leads via RLS após `GRANT has_role`)
  - ✅ **Catálogo populado no Supabase** (8 categorias + 230 produtos via `scripts/seed-catalog.mjs`, idempotente)
  - ✅ **Catálogo público religado ao Supabase** (typecheck+build OK): rotas `produtos.index/$slug/categoria` via loaders + home (FeaturedProducts/CategoriesBanner) via useQuery, usando `catalog.functions` + novo adaptador `catalog-adapter.ts` + server-fn `homeCatalogo`. Site público agora é DB-driven.
  - ✅ **Admin Categorias migrado** (Supabase: listar/editar/reordenar/destaque; +coluna `destaque`; build OK)
  - ✅ **Admin Produtos migrado** (Supabase: CRUD completo + toggles; +colunas marca/subcategoria/configuracoes/url_fabricante; 230 produtos re-seedados; build OK). **CATÁLOGO 100% NO SUPABASE (público + admin).**
  - ✅ **Tabelas blog_posts + eventos criadas no Supabase** (migration + RLS + seed: 5 posts, 3 eventos) + server-fns público/admin (em admin.functions). **TODAS as tabelas agora no Supabase.** Home = `conteudo_site` (sem tabela nova).
  - ⏳ **Wire das telas blog/eventos** ao Supabase: admin.blog, admin.eventos, blog.index/$slug/enviar, eventos.index/$slug, admin.pagina-inicial (UI ainda em mock/localStorage). Server-fns prontas — falta plugar.
  - ⏳ blog/eventos/página-inicial: criar tabelas + server-fns + wire (decidido: criar agora)
  - 📌 Verificação runtime do catálogo fica p/ Sprint 4 (deploy Vercel com env setado); host direto IPv6 e env do dev Cloudflare serão substituídos.
- ⏳ **Sprint 4** — adapter Cloudflare→Vercel + env no Vercel + deploy + criar projeto `conecta-lps`.
- ⏳ **Sprint 5** — DNS no Registro.br (config avançada propagando ~2h) + domínios no Vercel.
- ⏳ **Sprint 6** — fechamento/QA.

---

## ⚠️ Descobertas que redefinem a base

1. **Projeto Supabase trocado.** As credenciais novas apontam para `xrotxaapnkyokgebpodv` (conta do cliente) — **projeto VAZIO** (0 tabelas). O repo hoje aponta para `htocvzfyepccvmgontfh` (scaffold Lovable, com 8 tabelas). → Vamos **migrar tudo para o projeto novo**.
2. **Rótulos de chave trocados** no `.env` enviado (corrigidos no `.env.local`):
   - A "service_role" enviada era na verdade a **anon key**.
   - O **secret real** estava em `SUPABASE_JWT_SECRET` = `sb_secret_...`.
   - O "access token" era uma **publishable key**, não um `sbp_...`.
3. **Backend do admin já existe** (`src/lib/admin.functions.ts`): server-functions de formulários/produtos/categorias/conteúdo prontas, com auth Supabase real. A UI do admin é que ainda usa **mock/localStorage**.
4. **Pipeline de leads das LPs já implementado e testado** (`leads.ts` + `QuoteForm.tsx`) — falta re-apontar para o projeto novo e rebuildar.

---

## Mapa dos 7 pontos do Matheus → Sprints

| Ponto do Matheus | Onde entra |
|---|---|
| 1. Ler README das LPs | ✅ feito (levantamento) |
| 2. Tudo no Supabase | Sprint 0 (migrar p/ projeto novo) |
| 3. Vercel (conta + GitHub vinculados) | Sprint 4 |
| 4. Formulários dos leads no admin | Sprint 1 + Sprint 2 |
| 5. Domínios Cloudflare + Vercel (Registro.br) | Sprint 5 |
| 6. Pasta LPs + domínios; site conecta2lab; admin subdomínio | Sprint 4 + 5 |
| 7. Levantar tudo / LPs só faltam hospedar + ligar form | Sprint 1, 4, 5 |
| + Credenciais Supabase | Sprint 0 |

---

## SPRINT 0 — Fundação Supabase (projeto novo) 🔴 BLOQUEANTE
> Sem isso, nada funciona. É o alicerce.
- [ ] Confirmar projeto alvo = `xrotxaapnkyokgebpodv` (decisão do Matheus)
- [ ] Re-apontar env do app principal (`.env`/build) para o projeto novo
- [ ] Re-apontar `LP's/.../src/lib/leads.ts` para o projeto novo
- [ ] Aplicar as **7 migrations** (`supabase/migrations/`) no projeto novo via psql/CLI → cria as 8 tabelas + RLS + roles + triggers
- [ ] Validar tabelas, RLS e função `has_role`
- [ ] Criar **usuário admin real** no Supabase Auth + promover a `role=admin` (server fn `promoverPrimeiroAdmin` já existe)
- [ ] Seeds iniciais (categorias/produtos/conteúdo) se necessário

## SPRINT 1 — Leads das LPs no banco 🟢 (quase pronto)
- [x] `leads.ts` (insert anon na tabela `formularios`)
- [x] `QuoteForm.tsx` salva no Supabase **+** abre WhatsApp
- [ ] Re-testar insert contra o projeto novo (após Sprint 0)
- [ ] **Rebuild das 9 LPs** (`npm run build && verify && package`)

## SPRINT 2 — Admin real (mock → Supabase) 🟡
- [ ] Migrar login do admin: `auth-mock` → **Supabase Auth** (`admin.login.tsx`, guard em `admin.tsx`)
- [ ] Ligar `admin.formularios.tsx` às server-fns (`listFormularios`/`updateFormulario`/`deleteFormulario`) — mapear `payload` jsonb ↔ UI
- [ ] Ligar `admin.orcamentos.tsx` ao Supabase
- [ ] Migrar demais repos do localStorage → Supabase: produtos, categorias, conteúdo, eventos, página inicial, configurações, perfil

## SPRINT 3 — Site público no Supabase 🟡
- [ ] Catálogo público (produtos/categorias) lendo do Supabase
- [ ] Blog (com moderação) + Eventos lendo/gravando no Supabase
- [ ] Textos/configurações do site (conteudo_site/configuracoes_empresa)
- [ ] Formulário de contato do site → `submitFormulario`

## SPRINT 4 — Deploy Vercel 🟡
- [ ] Trocar adapter **Cloudflare → Vercel** no app principal (vite config / target)
- [ ] Configurar env vars no Vercel (todas as chaves do `.env.local`)
- [ ] Deploy do site principal + admin (`conecta2lab.com.br`)
- [ ] Projeto Vercel das **9 LPs** (1 projeto, múltiplos domínios, build estático)
- [ ] Smoke test em preview URLs

## SPRINT 5 — Domínios + DNS (Cloudflare) 🟡
- [ ] Apontar nameservers do Registro.br → Cloudflare (todos os domínios)
- [ ] DNS no Cloudflare apontando para o Vercel
- [ ] Adicionar domínios no Vercel: site (`www.conecta2lab.com.br`), **admin** (`admin.conecta2lab.com.br`), 9 LPs + alias 301
- [ ] SSL/TLS + validar cada domínio no ar

## SPRINT 6 — Fechamento / QA final 🟢
- [ ] SEO por domínio (sitemap, robots, meta, schema)
- [ ] LGPD (cookie banner, política, termos — rotas já existem)
- [ ] Teste E2E: cada formulário (site + 9 LPs) → cai no admin
- [ ] Performance / Core Web Vitals
- [ ] Checklist de fechamento + entrega ao cliente

---

## Caminho crítico
**Sprint 0 → 1 → 2 → (3) → 4 → 5 → 6.** Sprints 0–3 são código/banco (não dependem de você além das credenciais). Sprints 5 depende de você apontar os nameservers no Registro.br.

## O que ainda falta de você
- ✅ Credenciais Supabase (recebidas — projeto novo)
- ⬜ Confirmar que o alvo é o projeto novo `xrotxaapnkyokgebpodv`
- ⬜ (opcional) `SUPABASE_ACCESS_TOKEN` real (`sbp_...`) — ou rodo migrations via psql com a senha do banco
- ⬜ `VERCEL_TOKEN` (ou faz pelo painel)
- ⬜ Apontar nameservers Registro.br → Cloudflare (Sprint 5)
