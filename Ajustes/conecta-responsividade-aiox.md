# Conecta — Brief de Responsividade para AIOX
**Escopo:** painel admin + site público + as 9 landing pages do projeto.
**Alvos de tela:** desktop, tablet e celular.
**Alvo de execução:** SynkraAI AIOX Agentic-Agile + ADE · Claude Code (Opus 4.8).
**Relação:** transversal a `conecta-brief-aiox.md` e `conecta-admin-brief-aiox.md`. Define **um sistema único de responsividade** aplicado a todas as superfícies — não 11 soluções avulsas.

---

## 0. Orquestração

```
@architect *map-codebase     # ENUMERA todas as rotas (site + admin + as 9 LPs) e o stack
@ux-expert                   # define o design system responsivo (breakpoints, grids, type scale)
@architect *create-plan      # define tokens de breakpoint e primitivos compartilhados
@dev *execute-subtask <id>   # aplica por superfície
@qa *review-build <STORY>    # roda a matriz de testes da Seção 6
```

> `@architect *map-codebase` lista as 9 LPs (Matheus não precisa enumerar). A responsividade é entregue via **primitivos compartilhados** (mesmo container, grid, type scale), garantindo consistência entre todas.

---

## 1. Filosofia (padrão de mercado 2026)

- **Mobile-first.** CSS base = mobile; breakpoints adicionam complexidade pra cima.
- **Breakpoints por conteúdo, não por device.** Quebra-se onde o layout pede, não em larguras de aparelho específicas.
- **Fluido > fixo.** Tipografia e espaços que interpolam com `clamp()`; nada de altura fixa em px.
- **Container queries** para componentes que aparecem em contextos de largura diferente (card de produto na home vs. na grid, sidebar do admin).
- **Zero scroll horizontal** em qualquer largura de 320px a 1920px.

---

## 2. Sistema de breakpoints (alinhado ao Tailwind do projeto)

| Token | Largura | Device típico | Comportamento-chave |
|-------|---------|---------------|---------------------|
| base | < 640px | celular | layout em coluna única; nav em drawer; sidebar admin off-canvas |
| `sm` | ≥ 640px | celular grande / paisagem | grids de 2 colunas começam a aparecer |
| `md` | ≥ 768px | tablet retrato | tablet layout; grids 2 col; sidebar admin pode virar rail |
| `lg` | ≥ 1024px | tablet paisagem / laptop | layout desktop; sidebar full; mega-menu hover |
| `xl` | ≥ 1280px | desktop | largura máxima de conteúdo; mais respiro |
| `2xl` | ≥ 1536px | monitor grande | container centralizado com max-width, não esticar |

**Larguras de teste obrigatórias:** 320, 360, 375, 414, 768, 834, 1024, 1280, 1440, 1920.

---

## 3. Especificação por superfície

### 3.1 Painel admin
- **Sidebar:** full no `lg+`; rail só-ícones opcional no `md`; **off-canvas drawer** com hambúrguer + overlay no `< md`. Fecha ao navegar.
- **Cards de resumo:** 1 coluna (base) → 2 (`sm`/`md`) → 3 (`lg+`).
- **Tabelas (produtos, orçamentos, formulários):** container com scroll horizontal **ou** transformar em cards empilhados abaixo de `md` (preferir cards para leitura). Nunca espremer colunas.
- **Header/saudação:** título com `clamp()`; toast reposiciona pra não cobrir ações no mobile.
- **Forms do admin:** inputs full-width no mobile, `font-size ≥16px`.

### 3.2 Site público
- **Nav:** hambúrguer + drawer no `< lg`; **mega-menu vira accordion** dentro do drawer no mobile (não hover).
- **Hero:** empilha (texto acima, mídia abaixo) no mobile; `<picture>` com art direction (crop diferente mobile vs desktop).
- **Grid de produtos:** `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))` — colunas se ajustam sozinhas.
- **CTA WhatsApp fixo:** respeita `env(safe-area-inset-bottom)`; não cobre conteúdo nem o rodapé.
- **Seções dark/glow:** reduzir/desligar efeitos pesados no mobile (orçamento de performance).

### 3.3 As 9 LPs
- Aplicar os **mesmos primitivos** (container, grid, type scale, espaçamentos) — consistência e manutenção.
- Cada LP passa pela mesma matriz de teste da Seção 6.
- Imagens hero de cada LP com `srcset`/`sizes` e `aspect-ratio` (anti-CLS).

---

## 4. Técnicas obrigatórias (como o mercado faz hoje)

- **Layout:** CSS Grid pra estrutura de página; Flexbox pra componentes; `auto-fit/minmax` pra grids fluidas.
- **Tipografia fluida:** `clamp(min, preferida-vw, max)` em headings e leads.
- **Imagens responsivas:** `<img srcset sizes>`, formatos AVIF/WebP com fallback, `loading="lazy"` abaixo da dobra, `aspect-ratio` sempre (zero CLS), `<picture>` com art direction nos heroes.
- **Container queries** nos componentes reutilizados em larguras distintas.
- **Touch:** alvos ≥ 44px, espaçamento entre alvos, nada dependente de `:hover`.
- **Safe areas:** `env(safe-area-inset-*)` pra notch/home indicator em elementos fixos.
- **Inputs:** `font-size ≥16px` (evita zoom automático no iOS), `inputmode`/`type` corretos.
- **Movimento:** `prefers-reduced-motion: reduce` desliga animações.
- **Sem alturas fixas:** usar `min-height`, `overflow` controlado pra matar scroll horizontal.
- **Performance por breakpoint:** imagens menores no mobile; adiar o que é pesado; LCP mobile no orçamento.

---

## 5. Épicos × agentes

| Épico | Dono | Apoio | Entrega |
|-------|------|-------|---------|
| RSP-1 Tokens de breakpoint + primitivos (container, grid, type scale) | `@architect` | `@ux-expert` | base compartilhada por todas as superfícies |
| RSP-2 Responsividade do admin | `@dev` | `@ux-expert`, `@qa` | Seção 3.1 |
| RSP-3 Responsividade do site | `@dev` | `@ux-expert`, `@qa` | Seção 3.2 |
| RSP-4 Responsividade das 9 LPs | `@dev` | `@qa` | Seção 3.3 |
| RSP-5 Matriz de testes | `@qa` | — | Seção 6 |

---

## 6. Matriz de testes + Definition of Done (gate do @qa)

Testar **cada rota** (site + admin + as 9 LPs) nas larguras da Seção 2. Critérios binários:

- [ ] **Zero scroll horizontal** de 320px a 1920px em toda rota
- [ ] Todos os **alvos de toque ≥ 44px** no mobile
- [ ] **CLS < 0.1** e **LCP mobile ≤ 2,5s** em toda rota
- [ ] Nav/hero/grids **reflowam corretamente** nos pontos `sm`/`md`/`lg` (checagem visual por rota)
- [ ] Inputs **não disparam zoom no iOS** (`font-size ≥16px`)
- [ ] Elementos fixos respeitam **safe-area** (sem cobrir conteúdo)
- [ ] `prefers-reduced-motion` **desliga** as animações
- [ ] **Lighthouse mobile:** Performance ≥ 80, A11y ≥ 95 em rotas representativas
- [ ] As **9 LPs enumeradas** e cada uma aprovada na matriz

**Ferramentas de validação:** DevTools device mode (larguras da Seção 2) + ao menos 1 device real iOS e 1 Android + emulação de tablet (iPad 768/834/1024).

---

*Resumo: um sistema de breakpoints e primitivos compartilhados (RSP-1) é a fundação; admin, site e as 9 LPs consomem essa base. O `@qa` só fecha quando toda rota passa na matriz da Seção 6 em desktop, tablet e celular.*
