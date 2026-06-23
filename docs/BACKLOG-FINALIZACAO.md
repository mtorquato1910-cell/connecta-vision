# Backlog de Finalização — Conecta (Site + Admin + LPs)

**Levantamento completo · 2026-06-23 · Orion (AIOS Master)**
Estado: banco no Supabase ✅, deploy Vercel funcionando ✅, chaves rotacionadas ✅.
Este documento lista **TUDO que falta** para terminar. Marque `[x]` ao concluir.

---

## ✅ JÁ PRONTO (pra referência)
- Banco Supabase (10 tabelas + RLS + seeds: 8 categorias, 230 produtos, 5 posts, 3 eventos)
- **Catálogo** público (produtos/categorias) + **admin de produtos e categorias** → Supabase
- **Leads**: formulários do site (contato + orçamento) e das LPs → Supabase → painel
- **Admin** com login real (Supabase Auth: `conectamondragon@gmail.com`)
- Admin já no Supabase: **formulários, orçamentos, produtos, categorias**
- Deploy Vercel (adapter custom Node SSR) — todas as rotas HTTP 200 em **preview**
- Server-functions de **blog e eventos** já criadas (faltam as telas usarem)
- LGPD: rotas Política/Termos + CookieBanner existem
- i18n PT/EN/ES: base existe (`i18n.ts` + `useLocale`)

---

## A. ADMIN — telas ainda em mock/localStorage (ligar ao Supabase)
> As server-functions/tabelas já existem na maioria; é "plumbing".

- [ ] **Blog** (`admin.blog.tsx`) → usar `listAllPosts / approvePost / rejectPost / adminUpsertPost / deletePost` (já existem). Hoje usa `blog-data` (localStorage). Inclui o fluxo de **moderação** (aprovar/rejeitar submissões).
- [ ] **Eventos** (`admin.eventos.tsx`) → usar `listAllEventos / upsertEvento / deleteEvento` (já existem). Hoje usa `admin-eventos-repo`. Inclui **upload/galeria** de fotos.
- [ ] **Página inicial** (`admin.pagina-inicial.tsx`) → migrar `admin-home-repo` + `admin-produtos-repo` para `conteudo_site` (config de blocos/seções) + seleção de produtos em destaque via Supabase.
- [ ] **Textos do site** (`admin.conteudo.tsx`) → migrar `admin-conteudo-repo` para `conteudo_site` (server-fns `listConteudo/upsertConteudo` já existem).
- [ ] **Configurações da empresa** (`admin.configuracoes.tsx`) → migrar `admin-config-repo` para `configuracoes_empresa` (server-fns `listConfigEmpresa/upsertConfigEmpresa` já existem). **Crítico** porque controla telefone/email/WhatsApp/endereço do site.
- [ ] **Dashboard** (`admin.index.tsx`) → trocar contagens mock por `dashboardStats` (server-fn já existe) + contagens reais de blog/eventos.
- [ ] **Perfil** (`admin.perfil.tsx`) → ligar a troca de senha/dados ao Supabase Auth.
- [ ] Limpar `useSiteConfig.ts` (usa `admin-conteudo-repo` + `admin-config-repo` localStorage) → ler do Supabase.

## B. SITE PÚBLICO — telas ainda estáticas (ligar ao Supabase)
- [ ] **Blog público** (`blog.index.tsx`, `blog.$slug.tsx`) → usar `listPublishedPosts / getPostPublic` (já existem). Hoje usa `blog-data`.
- [ ] **Enviar post** (`blog.enviar.tsx`) → usar `submitBlogPost` (já existe) em vez de `blog-data` localStorage.
- [ ] **Eventos público** (`eventos.index.tsx`, `eventos.$slug.tsx`) → usar `listEventosPublic / getEventoPublic` (já existem). Hoje usa `eventos-data`.
- [ ] **Dados de contato dinâmicos**: `Footer`, `TopBar`, `contato.tsx`, `WhatsAppFab` leem de `site-data.SITE` (hardcoded). Ligar a `configuracoes_empresa` para o admin controlar.

## C. DADOS REAIS / CONTEÚDO (placeholders a corrigir)
- [ ] **Contato é PLACEHOLDER** em `site-data.ts`: telefone `(31) 9000-0000`, whatsapp `5531900000000`, email `comercial@conectavet.com.br`. → Pegar os **dados reais** do cliente e cadastrar (idealmente em `configuracoes_empresa`).
- [ ] Revisar textos institucionais (Sobre, Soluções, Home) com o cliente.
- [ ] Conferir CNPJ/endereço reais no rodapé e LGPD.

## D. LANDING PAGES (9 LPs)
- [ ] **Rebuild das 9 LPs** com o formulário ligado ao Supabase: `npm run build && npm run verify && npm run package` (na pasta `LP's/conecta-lp-push-main`). Hoje os `sites-prontos/` são de antes da alteração do `leads.ts`.
- [ ] Testar 1 envio real de cada LP caindo no painel.
- [ ] Decidir hospedagem: **1 projeto Vercel** servindo as 9 (rewrites por domínio) OU 9 projetos. (Decisão anterior: 1 projeto único.)
- [ ] Deploy das LPs no Vercel.

## E. DEPLOY & DOMÍNIOS
- [ ] **Promover o site para produção** (`vercel deploy --prebuilt --prod`) quando aprovado.
- [ ] **DNS** no Registro.br → Vercel (config avançada estava propagando ~2h). Apex → A `76.76.21.21`; www/subdomínio → CNAME `cname.vercel-dns.com`. Guia: `docs/guides/dominios-vercel.md`.
- [ ] Adicionar domínios no Vercel: `www.conecta2lab.com.br` + apex + `admin.conecta2lab.com.br`.
- [ ] Adicionar os **11 domínios das LPs** (9 LPs, 3 com domínio duplo) no projeto das LPs.
- [ ] SSL automático + validar cada domínio no ar.
- [ ] **Automatizar o build Vercel**: configurar `buildCommand` do projeto pra rodar `npm run build && node scripts/build-vercel.mjs` (hoje o deploy é `--prebuilt` manual). Assim o push no GitHub deploya sozinho.

## F. SEO
- [ ] **Meta das páginas de produto**: com o catálogo client-side, o título/descrição ficou genérico. Recuperar (server-fn no `head`, ou pré-render, ou voltar SSR quando resolver o adapter).
- [ ] `sitemap.xml` do site principal incluir produtos/categorias/blog/eventos reais (rota `sitemap[.]xml.tsx` existe — revisar).
- [ ] `robots.txt`, Open Graph, schema.org por página.
- [ ] Core Web Vitals / performance (bundle do router está grande ~1MB).

## G. LGPD
- [ ] Revisar conteúdo de **Política de Privacidade** e **Termos de Uso** (rotas existem) com dados reais do cliente.
- [ ] Validar **CookieBanner** (consentimento, opt-out).
- [ ] Registrar consentimento dos formulários (campo aceite + data) se exigido.

## H. i18n / TRADUÇÃO (PT/EN/ES)
- [ ] Validar que a tradução automática por **geolocalização** funciona (escopo do contrato).
- [ ] Conferir cobertura: hoje parece cobrir "chrome" (menus/CTAs). Definir se conteúdo dinâmico (produtos/blog) também traduz.

## I. QA / TESTES FINAIS (ao vivo)
- [ ] Login no admin em produção + navegar todas as telas.
- [ ] Enviar formulário de cada origem (site contato, site orçamento, 9 LPs) e ver caindo no painel.
- [ ] CRUD completo no admin (criar/editar/excluir produto, categoria, post, evento).
- [ ] Catálogo público carregando (lista, produto, categoria) com dados do banco.
- [ ] Blog (submissão → moderação → publicação) e Eventos (galeria) ponta a ponta.
- [ ] Testar em mobile.

## J. LIMPEZA TÉCNICA
- [ ] Remover código morto: `auth-mock.ts`, repos localStorage não usados (`admin-categorias-repo`, `admin-produtos-repo`, `blog-data`, `eventos-data`, `admin-*-repo`) após migração.
- [ ] `data/*.json` de mock (formularios.json etc.) — manter só o que serve de seed.
- [ ] Endpoints de debug do adapter Vercel já removidos ✅.
- [ ] Conferir `wrangler.jsonc` / deps Cloudflare — remover se não for usar Cloudflare.

## K. SEGURANÇA (pendências)
- [ ] **Revogar a chave secreta ANTIGA** no Supabase (ainda funciona — só criamos a nova). Settings ▸ API Keys ▸ revoke `sb_secret_yOH9...`.
- [ ] Confirmar que `.claude/settings.local.json` segue **fora do Git** (já gitignorado ✅).
- [ ] Criar usuários admin adicionais se o cliente precisar (hoje só `conectamondragon@gmail.com`).

---

## Ordem sugerida pra terminar
1. **B + A (blog/eventos)** — telas já têm API pronta, fecha o Sprint 3.
2. **A (conteúdo/config/home/dashboard)** — completa o admin 100%.
3. **C** — dados reais de contato do cliente.
4. **D** — rebuild + hospedar as 9 LPs.
5. **E** — promover produção + domínios (depende do DNS).
6. **F + G + H** — SEO, LGPD, i18n.
7. **I + J** — QA final + limpeza.
8. **K** — revogar chave antiga (pode fazer já).
