# Plano de Melhoria — Conecta (conecta2lab.com.br)

Consolidação da auditoria (SEO + layout + copy) com o briefing de direção visual premium.
Organizado em fases por **dependência técnica**, não por gosto: as fases de cima destravam as de baixo.

---

## Princípios que regem o plano

1. **Técnica antes de polimento.** Um site lindo e invisível pro Google não vende. A base de renderização vem primeiro.
2. **Premium clínico, não startup-glow.** A linguagem visual moderna (gradiente, dark, micro-interação) é bem-vinda *na dose*. O comprador é veterinário/hospital comprando equipamento biomédico caro — confiança e seriedade clínica pesam mais que "vibe tech". Sempre escolher a versão contida.
3. **Acessível e rápido por padrão.** Toda animação respeita `prefers-reduced-motion`; todo conteúdo real existe no DOM mesmo sem JS; orçamento de performance no mobile é inegociável (LCP é ranking).

---

## Fase 0 — Base técnica (BLOQUEIA tudo · fazer ANTES de popular o catálogo)

> Por que antes de popular: hoje o catálogo renderiza via JS e não entra no HTML. Se você subir as 230 fichas com a renderização atual, elas **nascem cegas pro buscador**. A correção tem que estar pronta antes do conteúdo entrar.

| # | Ação | Detalhe técnico |
|---|------|-----------------|
| 0.1 | **SSR / SSG / prerender do catálogo** | Rotas `/produtos`, `/produtos/categoria/*` e fichas de produto têm que sair prontas no HTML. Se for Vite/React puro: prerender no build. Se migrar p/ Next: `generateStaticParams` + `generateMetadata` por produto/categoria. O `Carregando catálogo…` não pode ser o que o crawler vê. |
| 0.2 | **Meta dinâmica por página** | Corrigir o `<title>` placeholder `Categoria, Catálogo Conecta`. Cada categoria e cada produto com title + description únicos. Ex: `Equipamentos de Imagem e Diagnóstico Veterinário | Conecta`. |
| 0.3 | **Structured data (JSON-LD)** | `Organization` + `LocalBusiness` (sede Vespasiano/MG, telefone, e-mail) no layout; `Product` em cada ficha (nome, marca Shinova, categoria); `BreadcrumbList` nas categorias. |
| 0.4 | **OG image dedicada** | Trocar o `icon-512.png` por imagem social 1200×630 com produto real + claim. Idealmente uma por categoria. |
| 0.5 | **robots.txt + sitemap.xml + Search Console** | Sitemap listando as 230 fichas; subir no Google Search Console e Bing Webmaster. |
| 0.6 | **Alinhar marca/domínio** | Hoje convivem `conecta2lab.com.br` (site), `conectavet.com.br` (e-mail) e `conectavet2026` (Instagram). Unificar tudo num domínio/handle só. O "2026" no @ passa imagem temporária. |
| 0.7 | **Tirar "Acesso admin" do footer** | Login de admin não fica linkado pro público. Vira bookmark/URL direta. |

**Pronto quando:** ao buscar o HTML cru de uma categoria, os produtos e os meta tags únicos aparecem sem rodar JS.

---

## Fase 1 — Confiança e conteúdo real

A estética premium do briefing só funciona com **assets reais**. Fazer isto antes da Fase 2.

| # | Ação | Por quê |
|---|------|---------|
| 1.1 | **Foto real de produto e de instalação** | Hoje hero, "sobre" e depoimento são Unsplash. Stock genérico contradiz "premium". Esse é o upgrade visual de maior impacto que existe. |
| 1.2 | **Resolver o depoimento** | Foto de banco atribuída a "Dr. Henrique Vasconcellos" é risco sério de credibilidade. Se o depoimento é real → foto real ou só iniciais num círculo. Se ainda não tem → não atribuir nome. |
| 1.3 | **Popular catálogo SEO-ready** | Cada ficha com nome técnico do equipamento (é por aí que o vet pesquisa), descrição própria, specs, imagem com `alt`. |

---

## Fase 2 — Direção visual premium (o briefing, com restrição)

Aqui entra o documento de design — **filtrado pelos 3 princípios do topo.**

### 2.1 Sistema de design primeiro (antes de sair estilizando)
Definir tokens para não espalhar valor hardcoded:
- **Cores:** primário `#1A1F8F`; um acento sóbrio (teal/ciano **dessaturado**, clínico — não néon); dark navy `#0a0f1d` usado como seção pontual, não como tema; neutros para fundos alternados (`#f8f9fa`).
- **Tipografia:** **uma** fonte geométrica (Inter, Plus Jakarta Sans **ou** Satoshi — escolher uma), com escala definida e H1 maior/imponente.
- **Spacing, radius, sombra:** escala única.
- **Documentar** o card de produto e o botão (variantes + estados hover/disabled/loading) — inclusive o estado de loading do catálogo, que hoje aparece pro usuário e não foi desenhado.

### 2.2 Contraste de seções (do briefing — aprovado)
Alternar fundos pra quebrar o branco de ponta a ponta: branco → cinza ultra-claro (`#f8f9fa`) → seção dark navy pontual. **Gradiente azul→roxo/ciano e glow: só em 1 seção de destaque, com parcimônia.** Não transformar o site inteiro em painel SaaS.

### 2.3 Micro-interações (do briefing — aprovado com regras)
- **Hover nos cards:** `translateY(-5px)` + sombra suave + zoom sutil na imagem. Transição ~150–200ms.
- **Contadores animados (0 → 230+ / 300):** o número final **tem que estar no DOM** (SEO/a11y); a animação é só visual e dispara no viewport.
- **Scroll reveal (fade-in + deslocamento):** suave, e o conteúdo visível mesmo sem JS.
- **Regra global:** tudo dentro de `@media (prefers-reduced-motion: reduce)` desligado; orçamento de performance respeitado (sem matar o LCP mobile).

### 2.4 Tipografia com personalidade (do briefing — aprovado)
H1 maior e imponente; **badge-labels** em caixa alta acima dos títulos de seção (`[ LINHA COMPLETA ]`) com o acento clínico — não néon.

### 2.5 Navegação do catálogo (do briefing — aprovado com ajuste)
- **Mega-menu** em "Produtos" com ícones das 8 linhas: sim no desktop, mas com suporte a **click/focus** (não só hover) e fallback decente no mobile.
- **Menu lateral retrátil** nas páginas de busca com botão de fechar e grid expandindo pra 100% — bom, desde que o estado fique acessível por teclado.

### 2.6 Hero impactante (do briefing — depende da Fase 1)
Composição com **produto real** + grafismos minimalistas (linhas finas, pontos de ancoragem) reforçando precisão/calibração/engenharia biomédica. **Não fazer com stock.**

---

## Fase 3 — Conversão e refino

| # | Ação |
|---|------|
| 3.1 | **Formulário:** revisar labels, validação e estados de erro/sucesso. Copy de sucesso: *"Solicitação enviada. Respondemos em até 4h úteis no WhatsApp/e-mail informado."* (o quê + quando + onde). |
| 3.2 | **Copy — padronizar números:** escolher um formato ("230+" e "300+") e usar em todo lugar. |
| 3.3 | **Copy — conter o itálico:** hoje quase toda ênfase é itálico, o que anula a ênfase. Máx. 1 por seção. |
| 3.4 | **CTA principal:** "Explorar catálogo" só funciona depois da Fase 0 — antes disso leva a página vazia. |
| 3.5 | **Blog:** alimentar com long-tail ("qual aparelho de raio-x veterinário comprar", "como escolher monitor multiparamétrico vet") — é o canal de tráfego orgânico de topo de funil. |
| 3.6 | **Auditoria final:** Lighthouse (perf/SEO/a11y), contraste do `#1A1F8F` em textos pequenos, `alt` em todas as imagens, touch targets no mobile. |

---

## Matriz de prioridade (impacto × esforço)

| Ação | Impacto | Esforço | Quando |
|------|:------:|:------:|:------:|
| SSR/prerender + meta dinâmica (0.1–0.2) | 🔥 Alto | Médio | **Agora** |
| Foto real + depoimento (1.1–1.2) | 🔥 Alto | Baixo–Médio | Agora |
| Alinhar marca/domínio (0.6) | Alto | Baixo | Agora |
| JSON-LD + OG + sitemap (0.3–0.5) | Alto | Baixo | Logo após 0.1 |
| Contraste de seções + tipografia (2.2, 2.4) | Médio | Baixo | Fase 2 |
| Micro-interações + scroll reveal (2.3) | Médio | Médio | Fase 2 |
| Mega-menu (2.5) | Médio | Médio | Fase 2 |
| Hero com asset real (2.6) | Alto | Médio | Depois da Fase 1 |
| Form + copy + blog (3.x) | Médio | Baixo | Contínuo |

---

## A regra de ouro

Faça a **Fase 0 antes de subir os produtos.** Tudo do briefing de design entra depois e fica melhor — mas se a base de renderização não estiver pronta, você vai ter um site lindo, premium e que ninguém encontra no Google.
