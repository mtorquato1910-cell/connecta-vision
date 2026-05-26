# Validação de QA — Projeto Conecta

**Versão:** 1.0
**Data:** 2026-05-26
**Autor:** @qa (Quinn)
**Referência:** [PRD](../prd/conecta-prd.md), [Sprints](../sprints/conecta-sprints.md), [Architecture](../architecture/conecta-architecture.md)
**Status:** Aprovado com gaps anotados — DoD reforçado

---

## 1. Objetivo desta revisão

Validar criticamente os **acceptance criteria** das histórias de cada sprint, identificar **gaps de testabilidade**, propor **cenários de teste** (golden path + edge cases) e fortalecer o **Definition of Done** global.

A premissa é simples: **se não pode ser testado, não pode ser entregue**. AC vagos viram retrabalho.

---

## 2. Gaps gerais identificados no PRD / Sprints

### G-01 ⚠️ AC sem critério mensurável
Várias histórias usam termos subjetivos ("polish", "premium", "editorial").
- **Ex.:** S1-02 "Navbar editorial" — não diz como mensurar "editorial"
- **Correção QA:** adicionar referência visual concreta + medições (altura px, espaçamento, fontes específicas)

### G-02 ⚠️ Faltam testes automatizados
PRD/Sprints não preveem suite de testes (unit, integration, e2e).
- **Recomendação:**
  - Unit: **Vitest** (já comum em projetos Vite/Next)
  - E2E: **Playwright** (cobertura crítica em fluxos chave)
  - Componentes: **Testing Library**
  - Suite mínima MVP: ~30 testes E2E (logon admin, criar produto, submeter blog, aprovar blog, enviar formulário, alternar idioma)

### G-03 ⚠️ Sem critério de regressão visual
Mudanças de tema/design podem quebrar UI silenciosamente.
- **Recomendação:** Chromatic ou Percy opcional, OU snapshots de Playwright em pontos-chave (5 telas)

### G-04 ⚠️ Acessibilidade citada mas não testada
RNF-02 pede WCAG AA, mas nenhuma sprint tem step de auditoria.
- **Correção:** adicionar **`bun run a11y`** com `@axe-core/cli` em CI; bloquear merge com erros sev=critical

### G-05 ⚠️ Performance citada mas não mede continuamente
RNF-01 pede Lighthouse ≥90, mas nada na sprint mede.
- **Correção:** **`bun run lighthouse`** via `@lhci/cli` em cada PR

### G-06 ⚠️ Tradução PT/EN/ES sem cobertura de teste
- Sprint 5 entrega i18n mas não tem AC verificando: "se idioma X selecionado, textos da home em X"
- **Correção:** adicionar AC explícito por locale

### G-07 ⚠️ LGPD/segurança superficial
Banner de cookies é citado mas sem fluxo claro de remoção de dados (direito à exclusão LGPD Art. 18)
- **Correção:** adicionar história S5-08 "Direitos LGPD do titular"

### G-08 ⚠️ Não há critério de "rollback" em deploy
Sprint 7 deploy direto na produção sem strategy.
- **Correção:** Blue-green deploy ou pelo menos backup PG + tag git antes de cada deploy

---

## 3. AC refinados por Sprint (delta crítico)

> Lista apenas as histórias que precisaram de reforço/adendo de QA.

### Sprint 0 — Setup

#### S0-01 Migrar para Next.js — **AC adicionais**
- [ ] **Branch separada** `feat/nextjs-migration` criada
- [ ] `git tag pre-nextjs-migration` aplicado antes do início
- [ ] **Smoke E2E**: home, catálogo, página produto, admin/login carregam sem erro 500
- [ ] Lighthouse não regride mais que 5 pontos vs baseline atual

#### S0-03 Mock Repository — **AC adicionais**
- [ ] **Cobertura unitária ≥ 80%** nos repositórios (CRUD básico)
- [ ] Testes de **edge cases**: slug duplicado, FK inexistente, paginação vazia, busca sem resultado
- [ ] Mock client+server alinhados (mesmo retorno para mesma entrada em SSR e CSR)

#### S0-05 Auth mock — **AC adicionais**
- [ ] **Senha errada 5x em sequência** → bloqueio por 5 min (rate limit local mesmo no mock)
- [ ] Logout limpa cookie + redireciona para `/admin/login`
- [ ] Acesso a `/admin/*` sem cookie → redirect para `/admin/login?from=...`
- [ ] Após login, redirect para `from` se válido (não open redirect)

---

### Sprint 1 — Visual Premium

#### S1-01 Processar logo — **AC adicionais**
- [ ] Logo PNG transparente **validada visualmente** em bg claro E escuro
- [ ] Tamanho do arquivo < 100KB
- [ ] Alt text definido: "Conecta Equipamentos Veterinários"
- [ ] Favicon 32×32, 16×16 e Apple Touch 180×180 gerados

#### S1-02 Navbar editorial — **AC mensuráveis**
- [ ] Logo a **exatamente 48px de altura** (medido com DevTools)
- [ ] Links em **Work Sans 14px / 500 weight**
- [ ] Espaçamento entre links: **24px** (gap-6)
- [ ] Sticky aparece após scroll > 80px (não imediato)
- [ ] `backdrop-blur-md` aplicado quando sticky
- [ ] Mobile drawer abre em < 300ms

#### S1-03 Hero — **AC mensuráveis**
- [ ] Headline em Instrument Serif **clamp(48px, 8vw, 96px)**
- [ ] Padding vertical mínimo do hero **160px** desktop, **96px** mobile
- [ ] CTA primário com cor `--conecta-orange` (#F47B20) — não outro laranja
- [ ] CTA com `min-width: 200px` desktop
- [ ] Animação de entrada com stagger de 80ms entre elementos

#### S1-09 Categoria vazia — **AC explícito**
- [ ] Mensagem visível: "Estamos preparando produtos novos para esta categoria. Fale com nosso time pelo WhatsApp."
- [ ] Botão WhatsApp visível com mensagem pré-preenchida: "Olá, gostaria de saber sobre produtos de [nome da categoria]"
- [ ] **NÃO redirecionar nem mostrar erro 404**

#### S1-10 Detalhe de produto — **AC adicionais**
- [ ] Galeria suporta **mínimo 1 e máximo 12 imagens**
- [ ] Lightbox abre com **Esc** fecha (acessibilidade)
- [ ] Formulário de orçamento valida: nome (≥3 chars), email (regex), whatsapp (com máscara BR)
- [ ] Submissão exibe toast de sucesso + reset do form
- [ ] Tab "Vídeo" só aparece se houver `video_url`

---

### Sprint 2 — Blog

#### S2-03 Submissão pública — **AC anti-spam reforçados**
- [ ] **Honeypot field** invisível (`<input name="website" tabindex="-1" autocomplete="off">` — bot preenche, humano não)
- [ ] **Time-to-submit < 3s** → bloqueio (form descartado)
- [ ] **Rate limit por IP**: máx 3 submissões/hora
- [ ] Conteúdo HTML é **sanitizado com DOMPurify** antes de salvar (anti XSS)
- [ ] Imagens upload validadas: max 5MB, MIME real (não só extensão), magic bytes check
- [ ] Slug gerado a partir do título + sufixo único (para evitar colisão)

#### S2-05 Moderação blog — **AC adicionais**
- [ ] Rejeição com motivo obrigatório (mínimo 10 chars)
- [ ] Email automático ao autor com motivo (se houver email)
- [ ] Aprovação registra `aprovado_por` + `aprovado_em`
- [ ] Audit log de cada aprovação/rejeição
- [ ] **Bulk actions**: selecionar vários pendentes e aprovar/rejeitar em massa

---

### Sprint 3 — Eventos

#### S3-04 Upload galeria de evento — **AC adicionais**
- [ ] Upload simultâneo de até **20 imagens**
- [ ] Cada imagem max 10MB
- [ ] Validação MIME real
- [ ] Reordenação drag-drop com feedback visual (placeholder durante drag)
- [ ] Salvar deve persistir ordem real (não só visual)
- [ ] Botão "remover foto" com confirmação

---

### Sprint 4 — Admin completo

#### S4-02 CRUD Produto — **AC críticos**
- [ ] Slug **único** e gerado automaticamente do nome (kebab-case, slugify pt-BR removendo acentos)
- [ ] Salvar produto sem categoria → erro de validação claro
- [ ] Salvar produto com galeria vazia → permitido (mas avisar)
- [ ] **Preview ao vivo**: alteração de descrição atualiza preview lateral
- [ ] Confirmar antes de excluir produto (modal "Tem certeza?")
- [ ] Soft delete (não DELETE físico — flag `excluido_em` para auditoria)

#### S4-06 Caixa de formulários — **AC adicionais**
- [ ] Filtro por **período** com presets (hoje, 7d, 30d, custom)
- [ ] Exportação CSV inclui **todas as colunas visíveis** + UTF-8 BOM (Excel BR abre certo)
- [ ] Drawer fecha com Esc
- [ ] Mudança de status sincroniza em tempo real (revalidate)
- [ ] **Botão "Abrir WhatsApp"** abre em nova aba com URL `https://wa.me/55<whatsapp>?text=<mensagem>`
- [ ] Mensagem WhatsApp configurável: usa template do admin com variáveis `{nome}`, `{produto}`

---

### Sprint 5 — i18n + SEO + Polish

#### S5-01 i18n — **AC mensurável**
- [ ] Toggle PT→EN → **todos os textos da página atual mudam** (mínimo: navbar, hero, footer, formulários)
- [ ] URL muda para `/en/...`
- [ ] Recarregar a página mantém o idioma selecionado
- [ ] Conteúdo do admin (textos de `conteudo_site`) tem 3 inputs (PT/EN/ES) — não obrigatório preencher os 3, fallback PT

#### S5-02 Geolocalização — **AC explícitos**
- [ ] Visitante de IP brasileiro → PT default (testado com IP fake via header)
- [ ] Visitante de IP espanhol → ES default
- [ ] Visitante de IP americano → EN default
- [ ] Visitante que escolheu EN manualmente → continua em EN nas visitas seguintes (cookie 365d)
- [ ] Falha na API de geo → fallback PT (não erro)

#### S5-03 SEO — **AC verificáveis**
- [ ] `sitemap.xml` contém **todas as URLs públicas** (home, /produtos, todas categorias, todos produtos, blog, posts, /eventos, eventos, /sobre, /contato, /solucoes)
- [ ] `robots.txt` bloqueia `/admin/`, permite resto
- [ ] Cada página tem **`<title>` único** (não duplicar)
- [ ] Schema.org JSON-LD validado em [validator.schema.org](https://validator.schema.org)
- [ ] Open Graph image presente em todas as páginas (fallback OG global)

#### S5-04 Core Web Vitals — **AC mensuráveis**
- [ ] **LCP ≤ 2.5s** em página de produto com 8 imagens
- [ ] **CLS ≤ 0.1** em home com hero + animações
- [ ] **INP ≤ 200ms** em interações de filtro
- [ ] Bundle JS inicial **< 150KB gzipped**
- [ ] Lighthouse Mobile **≥ 90** em página de produto

#### S5-05 LGPD — **AC adicionais (G-07)**
- [ ] Banner não bloqueia leitura — fica em rodapé não-modal
- [ ] Categorias de cookies: essenciais (sempre), analytics (opt-in), marketing (opt-in)
- [ ] Página `/politica-privacidade` com texto completo (não placeholder)
- [ ] **Direito de exclusão**: formulário `/lgpd/exclusao` que envia request ao admin

---

## 4. Cenários de teste E2E recomendados (Playwright)

### Suite "Visitante" (10 cenários)
1. **Home loads** — abre `/` sem erros + screenshot
2. **Catalogo navegação** — abre `/produtos`, clica em categoria, abre produto
3. **Categoria vazia** — abre categoria sem produtos → vê fallback + botão WhatsApp
4. **Formulário de orçamento na página produto** — preenche válido → toast sucesso + lead no admin
5. **Formulário com email inválido** — vê erro de validação
6. **WhatsApp link** — clica no botão flutuante → URL correta com texto pré-preenchido
7. **Toggle idioma** — PT → EN → conteúdo muda
8. **Blog: listar e abrir post** — `/blog` → click → `/blog/:slug` carrega
9. **Blog: submeter post** — `/blog/enviar` → preenche → confirmação → post aparece em `/admin/blog` pendente
10. **Eventos: lightbox** — abre evento → clica foto → lightbox abre → Esc fecha

### Suite "Admin" (12 cenários)
1. **Login válido** — credencial correta → `/admin`
2. **Login inválido** — credencial errada → erro + permanece em login
3. **Logout** — clica logout → cookie limpo + redirect login
4. **Acesso sem auth** — abre `/admin/produtos` sem login → redirect login
5. **Criar produto** — `/admin/produtos/novo` → preenche → salva → aparece na listagem
6. **Editar produto** — abre produto → muda nome → salva → vê na listagem
7. **Excluir produto** — abre → clica excluir → confirma → some
8. **Reordenar categorias** — drag-drop → nova ordem persiste no reload
9. **Aprovar post pendente** — `/admin/blog` → clica aprovar → post sai de pendente → aparece em `/blog`
10. **Rejeitar post** — clica rejeitar → motivo obrigatório → status muda
11. **Caixa de formulários** — filtro por status → resultados corretos → exporta CSV
12. **Configurações** — muda WhatsApp principal → site reflete no botão flutuante

### Suite "Acessibilidade" (axe-core)
- Home, catálogo, produto, blog, admin → cada uma com 0 violations críticas

### Suite "Performance" (Lighthouse CI)
- Home, produto, blog, admin → Performance ≥ 90 mobile

---

## 5. Definition of Done (DoD) FORTALECIDO

Substitui o DoD do PRD. Toda história só fecha se:

### Código
- [ ] TypeScript sem `any`, sem `@ts-ignore`, sem `eslint-disable` injustificado
- [ ] Componentes ≤ 200 linhas; funções ≤ 50 linhas
- [ ] Lint passa: `bun run lint` (zero warning)
- [ ] Format passa: `bun run format:check`
- [ ] Build passa: `bun run build`
- [ ] Tipo-check passa: `tsc --noEmit`

### Testes
- [ ] Cobertura unitária da lógica nova ≥ 70%
- [ ] **Mínimo 1 E2E** por história crítica (signup, CRUD, blog moderação, formulário)
- [ ] Testes locais passam: `bun run test`
- [ ] CI verde (quando configurado)

### UX/UI
- [ ] Mobile (320px+), tablet, desktop testados
- [ ] **Sem console warnings/errors** ao navegar
- [ ] Loading states presentes
- [ ] Empty states presentes
- [ ] Error states presentes (offline, falha API)
- [ ] Acessibilidade: contraste, alt text, foco visível, navegação teclado

### Segurança
- [ ] Inputs do usuário validados (Zod) **em servidor** (não só client)
- [ ] Senhas com argon2id (não plain, não md5, não sha1)
- [ ] CSRF mitigado (Server Actions ou token)
- [ ] Rate limit em endpoints públicos
- [ ] Logs **sem PII** em produção

### Performance
- [ ] Lighthouse Performance ≥ 90 mobile (auditado a cada deploy)
- [ ] Imagens com `next/image` ou equivalente (responsive + lazy)
- [ ] Bundle JS da rota < 150KB gzipped

### SEO (quando aplicável)
- [ ] `<title>` único
- [ ] Meta description única
- [ ] Schema.org JSON-LD relevante presente
- [ ] URL semântica (slug)

### Conteúdo
- [ ] **Sem hardcoded strings em PT-BR** em produção (todas via i18n)
- [ ] Sem preço em lugar nenhum (auditoria)
- [ ] Mensagens de erro amigáveis (não stack trace)

### Documentação
- [ ] README atualizado se mudou setup
- [ ] Changelog em CHANGELOG.md (opcional mas recomendado)
- [ ] Commit convencional (`feat:`, `fix:`, etc.)

### Aprovação
- [ ] Code review por outro dev (ou self-review documentado)
- [ ] QA manual em ambiente de staging
- [ ] Aprovação do Matheus antes de merge para `main`

---

## 6. Pirâmide de testes proposta

```
         /\
        /  \         E2E (Playwright) — ~30 testes
       /----\        Fluxos críticos: signup, CRUD, blog, formulário
      /      \
     /--------\      Integration (Vitest) — ~50 testes
    /          \     Repositories, hooks, validações Zod
   /------------\
  /              \   Unit (Vitest) — ~150 testes
 /                \  Utils, helpers, lógica de negócio
/__________________\
```

**Meta MVP:** ~230 testes automatizados rodando em CI em < 3 min total.

---

## 7. Bug bash pré-lançamento (Sprint 7)

Antes do go-live, **bug bash de 4 horas** com Matheus + Erwing:

### Cenários a cobrir
1. Cadastro de produto novo do zero (incluindo upload galeria)
2. Categoria recém-criada vazia
3. Tradução em produto com 12 imagens
4. Submissão de post + aprovação + visualização no /blog
5. Upload de 15 fotos em evento
6. Formulário enviado de mobile, recebido no admin
7. WhatsApp em iPhone Safari
8. Mudança de configurações (telefone) refletida no site
9. Acesso simultâneo de 2 admins editando o mesmo produto (conflito esperado: último write wins + aviso)
10. Site sem conexão — mensagens amigáveis

---

## 8. Métricas de qualidade

| Métrica | Meta MVP | Como medir |
|---|---|---|
| **Cobertura de testes** | ≥ 70% | Vitest coverage |
| **Bugs críticos pós-go-live** | 0 em 7 dias | Issue tracker |
| **Bugs médios pós-go-live** | ≤ 5 em 30 dias | Issue tracker |
| **Tempo médio de fix de bug crítico** | ≤ 24h | Tracking |
| **Lighthouse Performance mobile** | ≥ 90 | LHCI |
| **Violations axe-core (critical)** | 0 | axe CI |
| **Erros JS em produção** | < 1% das sessões | Sentry/log |

---

## 9. Aprovação final QA

✅ **Sprints 0–5 aprovadas** com os AC reforçados e gaps endereçados acima.
✅ **DoD fortalecido** torna a régua de qualidade clara e mensurável.
✅ **Suite de testes recomendada** (Vitest + Playwright + axe) cabe no escopo de 60 dias.

🚫 **Sprint 6 e 7** continuam bloqueadas até acesso ao servidor — sem isso impossível validar deploy/integração real.

### Recomendações de execução
1. **Sprint 0** inclui setup de Vitest + Playwright + axe (mais 0.5 dia de margem)
2. CI mínimo: GitHub Actions rodando `lint + typecheck + test + build` em cada PR
3. **Não merger PR sem CI verde** (regra dura)
4. Bug bash agendado **antes** do treinamento do Erwing

— @qa Quinn, garantindo que nada quebra silencioso 🧪
