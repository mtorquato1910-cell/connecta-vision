# Conecta — Brief de Execução para AIOX
**Projeto:** Site conecta2lab.com.br (distribuidor Shinova / equipamentos veterinários)
**Alvo:** SynkraAI AIOX Agentic-Agile + ADE · Claude Code (Opus 4.8)
**Formato:** input para os agentes de planejamento. Não é task list de `@dev` — é o brief que vira PRD → arquitetura → stories → execução → QA.

---

## 0. Como rodar isto (orquestração)

Ativar os agentes no **Claude Code** (paridade de hooks completa; Cursor tem automação reduzida segundo o próprio AIOX). Sequência ADE sugerida:

```
# Fase de planejamento
@pm *gather-requirements        # ingere este brief
@architect *map-codebase        # DETECTA o stack real (Vite/React vs Next) → decide estratégia de render
@architect *assess-complexity
@analyst *research-deps         # libs de prerender/SSG/schema p/ o stack detectado
@pm *write-spec
@qa *critique-spec              # valida spec contra os critérios de aceite da Seção 6

# Execução por épico
@architect *create-plan
@architect *create-context
@dev *execute-subtask <id>
@qa *review-build <STORY>
@devops *merge-worktree         # devops tem autoridade exclusiva de push
```

**Regra de ouro:** o **EPIC A** (render/SEO) é pré-requisito de tudo e deve ser concluído **antes de popular o catálogo**. Catálogo populado em cima de render client-side nasce invisível pro Google.

---

## 1. Contexto do produto (para @analyst / @pm)

- **O que é:** site institucional + catálogo (230+ equipamentos veterinários importados, marca Shinova). Não é e-commerce com checkout; o CTA é orçamento via WhatsApp/form.
- **Quem compra:** clínicas, hospitais veterinários, universidades, centros de pesquisa. Decisão técnica e de alto ticket → confiança e credibilidade clínica pesam mais que estética "tech".
- **Como o cliente busca:** pelo **nome técnico do equipamento** (ex: "monitor multiparamétrico veterinário", "aparelho raio-x odontológico vet"). Por isso cada ficha de produto é um ativo de SEO.
- **Estado atual (auditado):** base limpa, copy boa, mas **catálogo 100% client-side** — `/produtos` e `/produtos/categoria/*` retornam só `Carregando catálogo…` no HTML cru. Titles de categoria com placeholder não preenchido (`Categoria, Catálogo Conecta`). Assets são stock (Unsplash). Marca fragmentada em 3 domínios.
- **Objetivo do projeto:** (1) tornar catálogo e fichas indexáveis; (2) elevar valor percebido pra "premium clínico"; (3) consolidar marca e confiança.

---

## 2. Restrições inegociáveis (constraints — para @architect e @qa)

Estas regras valem para TODOS os épicos. `@qa` reprova entrega que violar qualquer uma:

1. **Render-first:** todo conteúdo indexável (produtos, categorias, textos, números) existe no HTML **sem execução de JS**. Nada essencial pode depender de fetch client-side.
2. **Premium clínico, não startup-glow:** linguagem visual moderna é permitida **na dose**. Gradiente azul→roxo/ciano e glow: no máximo 1 seção de destaque. Dark navy como seção pontual, não tema. Acento de cor dessaturado (clínico), nunca néon.
3. **Performance budget:** LCP mobile ≤ 2,5s; nenhuma animação/backdrop-blur pode derrubar Lighthouse Performance mobile abaixo de 80.
4. **Acessibilidade:** `prefers-reduced-motion: reduce` desliga toda animação; contraste AA; `alt` em toda imagem; touch targets ≥ 44px; mega-menu acessível por teclado/focus (não só hover).
5. **Zero asset/depoimento falso:** proibido substituir foto real por stock/IA ou fabricar depoimento. Onde falta asset real → bloqueio humano (Seção 3), nunca contorno automático.

---

## 3. Inputs humanos / decisões pendentes (BLOQUEIOS — para @po acompanhar)

Os agentes NÃO resolvem estes itens sozinhos. Marcar como bloqueio e seguir o resto em paralelo:

| ID | Bloqueio | Quem resolve | Trava qual épico |
|----|----------|--------------|------------------|
| H1 | Stack real do projeto | `@architect *map-codebase` detecta; confirma com Matheus | EPIC A |
| H2 | Domínio/e-mail/Instagram unificados (hoje: conecta2lab / conectavet / conectavet2026) | Matheus | EPIC B |
| H3 | Fotos reais de produto e de instalação | Matheus (assets) | EPIC C (hero) |
| H4 | Depoimento real (texto + autorização de foto/nome) ou remover | Matheus | EPIC B |
| H5 | Fonte definitiva (Inter / Plus Jakarta Sans / Satoshi — escolher 1) | Matheus ou `@ux-expert` propõe | EPIC C |

> Recomendação técnica do brief para H1: se `map-codebase` achar Vite/React puro → prerender no build (ex: `vite-plugin-ssg` ou prerender de rotas). Se achar Next → `generateStaticParams` + `generateMetadata` por rota. `@architect` tem a palavra final.

---

## 4. Épicos × agentes × critério de aceite

### EPIC A — Render & SEO base · 🔴 bloqueia tudo
**Dono:** `@architect` · **Apoio:** `@dev`, `@data-engineer`, `@qa`, `@devops`

| # | Tarefa | Aceite binário |
|---|--------|----------------|
| A1 | SSR/SSG/prerender em `/produtos`, `/produtos/categoria/*` e fichas | `curl` da rota retorna nomes dos produtos no HTML sem JS |
| A2 | Meta dinâmica por rota (corrigir placeholder `Categoria`) | title + meta description únicos por categoria/produto; zero placeholder |
| A3 | JSON-LD | `Organization`+`LocalBusiness` no layout, `Product` por ficha, `BreadcrumbList` em categoria; Rich Results Test passa |
| A4 | OG image dedicada 1200×630 | `og:image` deixa de ser `icon-512.png`; preview válido no validador |
| A5 | robots.txt + sitemap.xml + Search Console/Bing | sitemap lista todas as fichas; submetido nos webmasters |
| A6 | Modelo de dados do catálogo (`@data-engineer`) | schema de produto com campos SEO (nome técnico, categoria, specs, slug, alt) |

**DoD do épico:** Lighthouse SEO ≥ 95 nas rotas de catálogo; categoria e ficha indexáveis sem JS.

### EPIC B — Conteúdo & confiança
**Dono:** `@pm`/`@po` · **Apoio:** `@dev` · **Bloqueios:** H2, H4

| # | Tarefa | Aceite |
|---|--------|--------|
| B1 | Unificar marca/domínio/e-mail/Instagram (H2) | um único domínio em todo o site, e-mail e footer |
| B2 | Remover "Acesso admin" do footer público | link de admin não aparece pra visitante |
| B3 | Resolver depoimento (H4) | depoimento real com foto/nome autorizados, ou bloco sem foto, ou removido |
| B4 | Popular catálogo SEO-ready (depende de A1/A6) | cada ficha com nome técnico, descrição própria, specs, `alt` |

### EPIC C — Camada visual premium
**Dono:** `@ux-expert` · **Apoio:** `@dev`, `@qa` · **Bloqueios:** H3, H5
*(Detalhe de direção na Seção 7. Sujeito às constraints da Seção 2.)*

| # | Tarefa | Aceite |
|---|--------|--------|
| C1 | Design tokens (cor/tipo/spacing/radius/sombra) | nenhum valor hardcoded nos componentes novos |
| C2 | Componentes documentados: card de produto, botão, estado de loading | variantes + estados (hover/disabled/loading) definidos |
| C3 | Contraste de seções (branco → `#f8f9fa` → dark pontual) | alternância aplicada; glow só em 1 seção |
| C4 | Micro-interações: hover card (`translateY(-5px)`+sombra+zoom), counters, scroll-reveal | número final no DOM; tudo desligável via reduced-motion |
| C5 | Tipografia: H1 imponente, badge-labels `[ LINHA COMPLETA ]` | escala aplicada; fonte única (H5) |
| C6 | Mega-menu das 8 linhas + menu lateral retrátil | acessível por teclado/focus; ok no mobile |
| C7 | Hero composto com produto real + grafismos (H3) | usa foto real, não stock |

### EPIC D — Conversão & refino
**Dono:** `@pm` · **Apoio:** `@dev`, `@qa`

| # | Tarefa | Aceite |
|---|--------|--------|
| D1 | Form: labels, validação, estados de erro/sucesso | copy de sucesso "o quê + quando + onde"; erros acionáveis |
| D2 | Copy: padronizar números ("230+"/"300+") e conter itálico (máx 1 ênfase/seção) | consistência em todas as seções |
| D3 | Blog para long-tail (SEO topo de funil) | estrutura de post + 1 pauta-piloto |
| D4 | Auditoria final | Lighthouse Perf mobile ≥ 80, A11y ≥ 95, SEO ≥ 95 |

---

## 5. Sequência recomendada

```
EPIC A  →  EPIC B (B4 depende de A)  →  EPIC C  →  EPIC D
                ↑ B1/B2/B3 rodam em paralelo a A
```

`@architect` cria worktrees isolados por épico (`*create-worktree`); `@devops` faz o merge (autoridade exclusiva de push); `@qa` roda `*review-build` ao fim de cada story contra a Seção 6.

---

## 6. Definition of Done global (gate do @qa)

A entrega só fecha se TODOS passarem:

- [ ] Rotas de catálogo entregam produtos no HTML sem JS (A1)
- [ ] Zero title/description placeholder; todos únicos (A2)
- [ ] JSON-LD válido no Rich Results Test (A3)
- [ ] Lighthouse: SEO ≥ 95, A11y ≥ 95, Performance mobile ≥ 80 (D4)
- [ ] `prefers-reduced-motion` desliga todas as animações (constraint 4)
- [ ] Nenhuma foto de stock em hero/sobre/depoimento; nenhum depoimento fabricado (constraint 5)
- [ ] Marca unificada em domínio/e-mail/social (B1)
- [ ] "Acesso admin" fora do footer público (B2)
- [ ] Glow/gradiente/dark restritos conforme constraint 2

---

## 7. Briefing visual (para @ux-expert)

Direção: sair do "branco corporativo frio" para **premium clínico vibrante**, sem virar SaaS genérico.

- **Contraste de seções:** alternar branco / cinza ultra-claro (`#f8f9fa`) / dark navy pontual (`#0a0f1d` ou `#0B132B`). Gradiente e glow (backdrop-blur) só em 1 seção-herói de destaque.
- **Cor:** primário `#1A1F8F`; acento clínico dessaturado (teal/ciano sóbrio), nunca néon.
- **Micro-interações:** hover nos cards (subir + sombra + zoom sutil, ~150–200ms); contadores 0→valor disparando no viewport (número real no DOM); scroll-reveal fade-in suave. Tudo sob `prefers-reduced-motion`.
- **Tipografia:** H1 maior e imponente; fonte geométrica única (Inter/Plus Jakarta/Satoshi); badge-labels caixa-alta `[ LINHA COMPLETA ]` acima dos títulos de seção.
- **Navegação:** mega-menu elegante das 8 linhas clínicas com ícones minimalistas (estilo Stripe/RD), com fallback acessível; menu lateral retrátil nas buscas com grid expandindo a 100%.
- **Hero:** composição com produto real + grafismos vetoriais finos (linhas, pontos de ancoragem) reforçando precisão/calibração/engenharia biomédica. **Depende de foto real (H3).**

---

*Companion opcional: `plano-melhoria-conecta.md` traz o "porquê" narrativo de cada decisão. Este brief é o input executável; o roadmap é o contexto.*
