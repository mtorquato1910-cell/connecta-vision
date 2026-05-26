# PRD — Site Institucional Conecta Equipamentos Veterinários

**Versão:** 1.0
**Data:** 2026-05-26
**Autor:** @pm (Aria) — orquestrado por Orion
**Cliente:** Conecta Equipamentos Veterinários (CNPJ 54.269.525/0001-56)
**Contratada:** Adabtech (CEO Matheus / Adavio Luiz Costa Tittoni)
**Status:** Aprovado para execução (banco de dados em aberto — definido posteriormente)

---

## 1. Visão & Objetivos

### 1.1 Visão de produto
Construir o **site institucional B2B premium** da Conecta Equipamentos Veterinários — distribuidora brasileira da fabricante chinesa **Shinova** — com catálogo digital sem preços, painel admin completo de gestão de conteúdo e mecanismos de captura de lead qualificado.

O site é a **principal vitrine digital** da empresa e a porta de entrada para veterinários, clínicas, hospitais e universidades que querem solicitar orçamento de equipamentos veterinários.

### 1.2 Objetivos do MVP
| # | Objetivo | Métrica de sucesso |
|---|---|---|
| O1 | Apresentar 230+ produtos Shinova organizados em 8 categorias clínicas | 100% dos produtos navegáveis com galeria + specs |
| O2 | Capturar lead qualificado via formulário e WhatsApp | Taxa ≥ 3% de conversão visitante→lead na página de produto |
| O3 | Painel admin autônomo (cliente edita TUDO sem dev) | Erwing consegue alterar texto/foto/produto sem suporte técnico |
| O4 | Blog moderado com captura de tráfego orgânico | Estrutura SEO pronta para indexação no Google |
| O5 | Estabelecer marca premium "editorial clínico" | Visual aprovado em revisão UX comparativa com IDEXX/Mindray |

### 1.3 Princípios não-negociáveis (vindos do briefing)
- ❌ **NUNCA mostrar preço** (sem R$, "comprar", "adicionar ao carrinho")
- ✅ CTA é sempre **"Solicitar orçamento"** ou **WhatsApp**
- ❌ Sem ícones lucide com fundo lilás, sem gradientes coloridos, sem stock photos óbvios
- ✅ Visual **editorial clássico premium** (tipo IDEXX/jornal médico). Não é pet-shop, não é SaaS, não é e-commerce
- ✅ Tipografia: **Instrument Serif** (display) + **Work Sans** (body) + **JetBrains Mono** (técnico)
- ✅ Paleta: off-white (#FAFAF7) + tinta (#0A0A0A) + azul Conecta (#1A1F8F) + laranja Conecta (#F47B20)
- ✅ Logo Conecta com **48px de altura na navbar** (fundo transparente, sem branco)

---

## 2. Personas

### P1 — Veterinário(a) autônomo(a)
- Idade: 28–55 anos. Trabalha em clínica pequena ou consultório próprio.
- **Necessidade:** Encontrar equipamento específico (ex.: monitor multiparâmetro), ver specs técnicas, pedir orçamento rápido.
- **Comportamento:** Acessa pelo mobile entre consultas. Usa WhatsApp para tudo.
- **Dor:** Sites de fornecedor com preço inflacionado e checkout que não funciona.

### P2 — Comprador(a) de hospital veterinário
- Decisor de compra B2B. Compra em volume.
- **Necessidade:** Comparar specs, baixar ficha técnica, agendar conversa com vendedor.
- **Comportamento:** Acessa desktop, abre várias abas, faz spreadsheet de comparação.
- **Dor:** Falta de transparência técnica, dificuldade de obter ficha em PDF.

### P3 — Coordenador(a) universitário
- Compra para laboratório de ensino. Precisa de justificativa técnica documentada.
- **Necessidade:** Material técnico denso, certificações, estudos de aplicação.
- **Comportamento:** Pesquisa demorada, e-mail formal.

### P4 — Erwing Mondragon (cliente / admin)
- Fundador da Conecta. Decisor sobre conteúdo do site.
- **Necessidade:** Editar tudo sozinho (texto, foto, produto, blog, eventos) sem chamar dev.
- **Dor:** Painéis admin confusos e tecnicamente travados.

---

## 3. Escopo (IN / OUT)

### 3.1 IN — entregue no MVP

**Site público (10 áreas/páginas):**
- `/` Home
- `/produtos` Catálogo geral com filtros
- `/produtos/categoria/:slug` Categoria
- `/produtos/:slug` Detalhe de produto
- `/solucoes` Segmentos atendidos
- `/sobre` História + valores + time
- `/contato` Formulário + dados da empresa
- `/blog` Listagem + `/blog/:slug` Post individual
- `/blog/enviar` Submissão pública de post (com moderação)
- `/eventos` Galeria de feiras e eventos

**Painel admin (10 áreas):**
- `/admin/login`
- `/admin` Dashboard com estatísticas + atalhos
- `/admin/produtos` CRUD produtos + galeria + specs + descrição rich text
- `/admin/categorias` CRUD categorias + ícone (SVG/PNG 200×200)
- `/admin/pagina-inicial` Toggle seções + drag-drop + destaque
- `/admin/conteudo` Editor de todos os textos (Home/Sobre/Contato/Global/Footer)
- `/admin/formularios` Caixa de entrada (contato + orçamento + blog submissions)
- `/admin/blog` Moderação de posts + criação direta pelo admin
- `/admin/eventos` Upload/gestão de galeria de feiras e eventos
- `/admin/configuracoes` Tabs (Empresa, Contato, Redes, SEO, Admin)

**Features cross-site:**
- 🌐 Tradução automática **PT/EN/ES** por geolocalização do visitante
- 💬 Botão **WhatsApp flutuante** em todas as páginas (com mensagem pré-preenchida no admin)
- 📧 Todos os formulários (contato, orçamento, blog) **caem no painel admin**
- 🔍 SEO técnico completo (meta tags, sitemap, schema.org, Core Web Vitals)
- 🍪 Conformidade LGPD básica (banner cookies + política de privacidade)

### 3.2 OUT — fora do MVP (não entregue)
- ❌ 10 Landing Pages com domínios próprios (decisão do Matheus em 2026-05-26)
- ❌ Funcionalidades de e-commerce (carrinho, checkout, pagamento)
- ❌ Tráfego pago (Google/Meta Ads)
- ❌ Produção de fotos/vídeos profissionais

---

## 4. Requisitos Funcionais (RF)

### 4.1 Site público

#### RF-01 — Home
- Hero com headline editorial + CTA primário ("Solicitar orçamento") + secundário ("Explorar catálogo")
- Marquee de marca/mensagem entre seções
- Grid de 8 categorias com ícone + nome + descrição curta + link
- Seção "Produtos em destaque" (configurável pelo admin)
- Seção "Sobre a Conecta" (resumo + link `/sobre`)
- Depoimento de cliente (configurável)
- CTA de fechamento (WhatsApp + formulário)
- Hover states sutis, animações Framer Motion (scroll reveal staggered, count-up de números)

#### RF-02 — Catálogo `/produtos`
- Listagem grid responsivo (mobile: 1 col, tablet: 2 col, desktop: 3–4 col)
- Filtros laterais: categoria, subcategoria, busca textual
- Ordenação: destaque, alfabético, mais recentes
- Card de produto: imagem (object-cover 100%), modelo, nome, badge categoria, hover sutil

#### RF-03 — Página de categoria `/produtos/categoria/:slug`
- Header com nome + descrição da categoria + número editorial
- Listagem de produtos da categoria
- **Fallback amigável**: se categoria vazia, mensagem editorial + CTA WhatsApp
- Breadcrumb

#### RF-04 — Página de produto `/produtos/:slug`
- Galeria de imagens com navegação (thumb + main, lightbox opcional)
- Modelo + nome + categoria + descrição curta
- Tabs: **Descrição** | **Especificações** | **Aplicações** | **Vídeo** (se houver URL YouTube)
- Especificações como tabela chave/valor (campos opcionais não aparecem)
- **Formulário de orçamento** lateral/inferior com pré-preenchimento do produto
- Botão WhatsApp com mensagem pré-preenchida (nome + modelo + link)
- Produtos relacionados (mesma categoria)

#### RF-05 — Soluções `/solucoes`
- Cards por segmento: Clínica veterinária, Hospital, Universidade, Pet shop
- Cada card: descrição + equipamentos típicos + CTA "Solicitar consultoria"

#### RF-06 — Sobre `/sobre`
- Bloco "história" editorial
- Valores (3–4 pilares)
- Time / fundador (Erwing) opcional
- Galeria de bastidores (configurável)

#### RF-07 — Contato `/contato`
- Formulário (nome, email, whatsapp, tipo de estabelecimento, mensagem)
- Mapa estático com endereço Vespasiano/MG
- Telefones / e-mails / redes sociais
- Botão WhatsApp em destaque

#### RF-08 — Blog `/blog` e `/blog/:slug`
- Listagem com cards (capa + título + resumo + data + autor + tag)
- Paginação ou scroll infinito
- Filtro por tag/categoria de blog
- Post individual com:
  - Capa + título + autor + data + tempo de leitura
  - Conteúdo rich text (markdown ou HTML)
  - Compartilhamento (WhatsApp, LinkedIn, copy link)
  - CTA de orçamento no rodapé

#### RF-09 — Submissão pública de post `/blog/enviar`
- Qualquer visitante pode submeter
- Formulário: nome do autor, email, título, conteúdo, capa opcional, tags
- Após envio, status = `pendente` (NÃO aparece no `/blog` público)
- Aparece em `/admin/blog` com badge "Aguardando moderação"
- Admin aprova → status `publicado` → aparece no `/blog`
- Admin pode editar antes de aprovar (correções editoriais)
- Admin pode rejeitar com motivo (envia email opcional)

#### RF-10 — Galeria de eventos `/eventos`
- Listagem cronológica de feiras/eventos
- Cada evento: capa + nome + data + local + galeria de fotos + descrição curta
- Lightbox para visualizar fotos em tela cheia
- Filtro por ano

#### RF-11 — WhatsApp Flutuante
- Botão fixo no canto inferior direito em TODAS as páginas
- Mensagem pré-preenchida configurável no admin
- Em página de produto: inclui modelo automaticamente
- Número configurável no admin

#### RF-12 — Tradução automática PT/EN/ES
- Detecta país do visitante por IP (geolocalização)
- Mapeia: BR/PT/AO → pt, ES/AR/MX/CL/UY/PE/CO → es, demais → en
- Permite usuário trocar idioma manualmente (persistente em cookie)
- Conteúdo traduzível: textos do site (`conteudo_site`), specs de produto (campos `_pt`, `_en`, `_es` opcionais), nomes de categoria
- Conteúdo dinâmico (blog, eventos) usa o idioma do post original + indicador visual

### 4.2 Painel admin

#### RF-13 — Autenticação
- Login email/senha
- Sessão persistente (cookie httpOnly)
- Logout
- Recuperação de senha por email (fase 2)
- Apenas usuários com role `admin` podem acessar

#### RF-14 — Dashboard `/admin`
- Cards de estatística: produtos cadastrados, formulários novos (24h/7d), posts pendentes, eventos publicados
- Atalhos rápidos: "Novo produto", "Moderar blog", "Ver formulários"
- Últimos 5 formulários recebidos
- Últimos 5 posts pendentes

#### RF-15 — CRUD Produtos `/admin/produtos`
- Listagem com busca + filtro categoria + filtro publicado/rascunho
- Criar/editar produto com:
  - Modelo, nome, slug (gerado automaticamente)
  - Categoria + subcategoria
  - Marca (default: SHINOVA)
  - Descrição curta + descrição longa (rich text)
  - Especificações: editor chave/valor dinâmico (adicionar/remover linhas)
  - Aplicações: lista
  - Diferenciais: lista
  - Galeria de imagens: upload múltiplo + reordenação drag-drop + alt text
  - Vídeo: URL do YouTube
  - Meta título + meta descrição (SEO)
  - Toggle destaque (aparece na home)
  - Toggle publicado/rascunho
- Importação em lote via planilha XLSX (Sprint futura)

#### RF-16 — CRUD Categorias `/admin/categorias`
- Listagem com drag-drop para reordenar
- Criar/editar categoria com:
  - Nome, slug, descrição curta, descrição longa
  - Ícone (upload SVG/PNG 200×200) — **NÃO foto grande**
  - Cor de destaque (default azul Conecta)
  - Toggle destaque
  - Ordem

#### RF-17 — Página Inicial `/admin/pagina-inicial`
- Controle visual da home:
  - Toggle ON/OFF de cada seção (Hero, Categorias, Destaques, Sobre, Depoimento, CTA)
  - Reordenação drag-drop das seções
  - Seleção de quais produtos aparecem em "Produtos em destaque"
  - Editor do depoimento (texto, autor, cargo, foto)

#### RF-18 — Editor de Conteúdo `/admin/conteudo`
- Tabs por escopo: **Home** | **Sobre** | **Contato** | **Global** | **Footer**
- Cada conteúdo tem chave (ex.: `home.hero.title`) + valor + tipo (texto/html/url)
- Edição inline (sem modal pesado)
- Preview lateral (opcional)

#### RF-19 — Caixa de Formulários `/admin/formularios`
- Listagem com colunas: data, tipo (contato/orçamento/blog), nome, status, ações
- Filtros: status (novo/em_contato/qualificado/convertido/perdido), tipo, período
- Busca por nome/email/whatsapp
- Drawer lateral com detalhes completos do formulário
- Campo de **notas internas** (admin escreve)
- Botão **"Abrir WhatsApp"** com mensagem pré-preenchida
- Botão **"Marcar como respondido"**, "Arquivar"
- Exportação CSV

#### RF-20 — Blog admin `/admin/blog`
- Listagem com filtro status (todos / pendente / publicado / rascunho / rejeitado)
- Badge visual em pendentes
- Ações por post:
  - **Aprovar** (vai para publicado)
  - **Rejeitar** (com motivo opcional)
  - **Editar** (corrige antes de aprovar)
  - **Excluir**
- Criação direta pelo admin: post já nasce como `publicado` (sem moderação)
- Editor rich text com upload de imagens

#### RF-21 — Eventos admin `/admin/eventos`
- Listagem cronológica
- Criar/editar evento:
  - Nome, data, local, descrição curta
  - Capa
  - Galeria de fotos: upload múltiplo + reordenação + alt text + caption opcional
  - Toggle publicado
  - Ordem (default: data desc)

#### RF-22 — Configurações `/admin/configuracoes`
- Tabs:
  - **Empresa:** nome, CNPJ, endereço, descrição institucional
  - **Contato:** telefones, emails, WhatsApp principal, mensagem WhatsApp pré-preenchida
  - **Redes sociais:** Instagram, Facebook, LinkedIn, YouTube
  - **SEO:** título global, descrição global, OG image, sitemap config
  - **Admin:** gestão de usuários admin (criar, alterar senha, remover)

### 4.3 Camada de dados (deixada em aberto)

> ⚠️ **Decisão arquitetural:** o banco de dados real será definido quando Matheus tiver acesso ao servidor do cliente (PostgreSQL provável). O PRD define as **entidades** e suas relações, mas NÃO o DDL específico.

#### Entidades e atributos esperados

**Categoria**
- id, slug, nome, descrição_curta, descrição_longa, icone_url, cor, destaque, ordem, traduções

**Produto**
- id, slug, modelo, nome, categoria_id, subcategoria, marca, descrição_curta, descrição_longa, galeria (lista), video_url, especificações (chave/valor), aplicações (lista), diferenciais (lista), destaque, publicado, meta_título, meta_descrição, traduções

**Formulário**
- id, tipo (contato/orcamento_geral/orcamento_produto), nome, email, whatsapp, telefone, tipo_estabelecimento, nome_estabelecimento, cidade, estado, cargo, produto_id (FK opcional), produto_modelo (snapshot), mensagem, status, notas_internas, origem_página, IP, user_agent, criado_em

**BlogPost**
- id, slug, título, resumo, conteúdo, capa_url, autor_nome, autor_email, tags (lista), status (pendente/publicado/rascunho/rejeitado), motivo_rejeição, origem (publico/admin), publicado_em, criado_em, atualizado_em

**Evento**
- id, slug, nome, data, local, descrição, capa_url, galeria (lista de {url, ordem, alt, caption}), publicado, ordem

**ConteudoSite**
- chave (PK), valor, tipo (texto/html/url/numero), pagina, ordem, traduções

**ConfiguracaoEmpresa**
- chave (PK), valor (JSON)

**Usuario (admin)**
- id, email, senha_hash, nome, role, criado_em

#### Estratégia provisória (Sprint 0 → 5)
- Implementar **camada de repositório** (`src/lib/repositories/*`) com interface tipada
- Adapter inicial: **`MockRepository`** que lê/escreve em `src/data/*.json` ou memória
- Quando banco real estiver pronto: trocar adapter por **`PostgresRepository`** sem mexer nas páginas
- Migrations em SQL versionado dentro de `db/migrations/`

---

## 5. Requisitos Não-Funcionais (RNF)

| # | Requisito | Critério |
|---|---|---|
| RNF-01 | Performance | Lighthouse ≥ 90 mobile / 95 desktop |
| RNF-02 | Acessibilidade | WCAG 2.1 AA mínimo (contraste, alt text, landmarks) |
| RNF-03 | SEO | Sitemap XML, robots.txt, schema.org Product+Article, meta OG |
| RNF-04 | Responsivo | Mobile-first; breakpoints 640/768/1024/1280 |
| RNF-05 | Segurança | OWASP Top 10; senhas com bcrypt/argon2; CSRF; rate limit em formulários |
| RNF-06 | LGPD | Banner cookies, política de privacidade, opt-in para newsletter |
| RNF-07 | Compatibilidade | Chrome/Edge/Firefox/Safari (2 últimas versões) |
| RNF-08 | i18n | Locales PT/EN/ES com fallback PT |
| RNF-09 | Manutenibilidade | TypeScript estrito (`any` banido), componentes ≤ 200 linhas |
| RNF-10 | Observabilidade | Log estruturado de erros + dashboard de status |

---

## 6. Arquitetura técnica resumida

### 6.1 Stack confirmada
- **Frontend/SSR:** Next.js 15 (App Router) — substitui o TanStack Start atual
- **UI:** Tailwind CSS 4 + shadcn/ui (Radix) + Framer Motion 12
- **Validação:** Zod
- **Forms:** React Hook Form
- **Server state:** TanStack Query
- **Tipografia:** Instrument Serif + Work Sans + JetBrains Mono (via @fontsource ou Google Fonts)
- **i18n:** next-intl (compatível com App Router + tradução por geolocalização)

### 6.2 Stack a definir (depende de acesso ao servidor)
- **Banco:** PostgreSQL (provável) — em aberto
- **ORM/Query builder:** Drizzle (preferência) ou Prisma — a decidir
- **Auth:** Auth.js (next-auth v5) ou Lucia — a decidir
- **Storage:** filesystem local ou S3-compatible (MinIO) — depende do servidor
- **Deploy:** Node + PM2 + Nginx OU Docker — depende do servidor
- **Email:** Nodemailer + SMTP do servidor OU Resend (a decidir)

### 6.3 Pasta esperada
```
src/
├── app/                       # Next.js App Router
│   ├── (site)/                # rotas públicas
│   │   ├── page.tsx           # Home
│   │   ├── produtos/
│   │   ├── solucoes/
│   │   ├── sobre/
│   │   ├── contato/
│   │   ├── blog/
│   │   └── eventos/
│   ├── (admin)/admin/         # rotas admin
│   │   ├── produtos/
│   │   ├── categorias/
│   │   ├── pagina-inicial/
│   │   ├── conteudo/
│   │   ├── formularios/
│   │   ├── blog/
│   │   ├── eventos/
│   │   └── configuracoes/
│   └── api/                   # API routes
├── components/
│   ├── ui/                    # shadcn primitives
│   ├── site/                  # componentes do site público
│   ├── admin/                 # componentes admin
│   └── shared/                # Logo, Footer, Navbar
├── lib/
│   ├── repositories/          # camada de dados (mock + futuro postgres)
│   ├── utils.ts
│   ├── constants.ts
│   └── i18n/
├── hooks/
├── types/
└── messages/                  # i18n (pt.json, en.json, es.json)
data/                          # mock JSON (sprint atual)
db/                            # migrations SQL (futuro)
public/
└── logo-conecta.png           # logo sem fundo
```

---

## 7. Identidade visual & marca

### 7.1 Logo
- **Atual:** `Logo Conecta.jpeg` (fundo branco, palavra "conecta" em azul marinho com pontos laranja + ícone de erlenmeyer azul na letra "c")
- **Necessário:** versão **PNG transparente** sem fundo branco
- **Caminho final:** `public/logo-conecta.png`
- **Uso:** Navbar (48px altura), Footer (32px altura), favicon (derivado)
- **Tarefa:** processar com `rembg` (Python) ou remove.bg para gerar PNG transparente

### 7.2 Paleta
```css
--bg:             #FAFAF7;  /* off-white principal */
--paper:          #FFFFFF;  /* cards */
--ink:            #0A0A0A;  /* texto principal */
--ink-soft:       #4A4A4A;  /* texto secundário */
--ink-mute:       #9A9A9A;  /* texto muted */
--line:           rgba(10, 10, 10, 0.08);
--conecta-blue:   #1A1F8F;  /* destaque institucional */
--conecta-orange: #F47B20;  /* CTA primário, accent */
```

### 7.3 Tipografia
```css
--font-display: 'Instrument Serif', serif;  /* H1, H2, hero */
--font-body:    'Work Sans', sans-serif;    /* parágrafos, UI */
--font-mono:    'JetBrains Mono', monospace; /* códigos, números editoriais */
```

### 7.4 Tom
- **Editorial clássico premium** (referência: IDEXX, jornal médico)
- ALL CAPS em headlines com numeração editorial (01, 02, 03)
- Espaço negativo generoso
- Hover states sutis (sem `scale-110` brega)
- Marquee infinito entre seções como detalhe editorial

---

## 8. Métricas de sucesso

| Métrica | Meta MVP | Como medir |
|---|---|---|
| Taxa de conversão visitante → lead (formulário) | ≥ 3% | Analytics |
| Tempo médio de carregamento mobile (LCP) | ≤ 2.5s | Lighthouse, PageSpeed |
| Lighthouse Performance | ≥ 90 mobile / 95 desktop | Auditoria pré go-live |
| Posts de blog moderados em ≤ 48h | 100% | Painel admin |
| Erros JS em produção | < 1% sessões | Sentry/log |

---

## 9. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Acesso ao servidor do cliente demora | Alta | Alto | Trabalhar frontend + admin com mock data; integração de banco é Sprint final |
| Stack atual (TanStack/Cloudflare) já está implementada | Alta | Médio | Sprint 0 migra para Next.js — aproveita componentes/markup do Lovable |
| Cliente não fornece textos/fotos finais | Média | Alto | Admin permite cliente editar tudo posteriormente |
| Tradução automática (geolocalização) tem limites técnicos | Média | Baixo | Permitir override manual; fallback PT |
| Marca d'água "SHINOVA" nas fotos de produto | Alta | Médio | Tarefa futura: script Python + Pillow inpainting (não bloqueador) |
| LGPD: lead com dado pessoal sem consentimento explícito | Média | Alto | Banner cookies + checkbox consentimento + política privacidade |

---

## 10. Cronograma macro

| Fase | Sprint | Duração | Entregável |
|---|---|---|---|
| **Setup** | Sprint 0 | 3 dias | Migração Next.js, mock data layer, design tokens |
| **Visual premium** | Sprint 1 | 5 dias | Logo nova, paleta, tipografia, polish home/produtos/categorias |
| **Blog** | Sprint 2 | 5 dias | Blog público + submissão pública + admin moderação |
| **Eventos** | Sprint 3 | 4 dias | Galeria pública + admin de upload |
| **Admin completo** | Sprint 4 | 6 dias | Editor conteúdo, formulários, configurações, dashboard |
| **i18n + SEO + polish** | Sprint 5 | 5 dias | Tradução PT/EN/ES, sitemap, schema, Core Web Vitals |
| **Banco real** | Sprint 6 | 5 dias | Migra MockRepo → PostgresRepo, deploy no servidor (BLOQUEADO até acesso) |
| **QA + Go-live** | Sprint 7 | 2 dias | Treinamento Erwing, ajustes finais, lançamento |

**Total Sprints 0–5 (sem banco):** ~28 dias úteis (~6 semanas)
**Sprint 6–7 (após acesso):** ~7 dias úteis (~1.5 semanas)
**Total geral:** ~35 dias úteis dentro dos 60 dias corridos do contrato ✅

---

## 11. Critérios de aceitação do PRD (DoD do MVP)

- [ ] Todas as 10 áreas do site público navegáveis
- [ ] Todas as 10 abas do admin funcionais
- [ ] Blog com fluxo de moderação completo testado (submeter → admin aprovar → publicado)
- [ ] Galeria de eventos administrável
- [ ] Tradução automática PT/EN/ES funcionando com override manual
- [ ] Todos os formulários do site caem no admin
- [ ] Logo nova (transparente) em navbar e footer
- [ ] Lighthouse Performance ≥ 90 mobile
- [ ] Sem preço em lugar nenhum (auditoria visual)
- [ ] Admin Erwing consegue cadastrar 1 produto do zero sem ajuda (teste de treinamento)
- [ ] Banco PostgreSQL ativo no servidor do cliente (Sprint 6)
- [ ] Site no ar no domínio do cliente (Sprint 7)

---

## 12. Apêndices

### 12.1 Glossário
- **Lead qualificado:** visitante que preencheu formulário com dados de contato
- **Moderação:** ação do admin de aprovar/rejeitar post enviado por visitante
- **Mock data:** dados fictícios em JSON usados durante desenvolvimento (Sprint 0–5)
- **Repository pattern:** camada que abstrai onde os dados ficam guardados

### 12.2 Referências
- Briefing técnico (BRIEFING_CLAUDE_CODE.md.pdf)
- Contrato (Contrato conecta especificações do site.pdf)
- Logo (Logo Conecta.jpeg)
