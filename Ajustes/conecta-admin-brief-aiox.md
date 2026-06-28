# Conecta Admin — Brief de Execução para AIOX
**Escopo:** painel administrativo (`admin.conecta2lab.com.br`) — tela de login + dashboard.
**Alvo:** SynkraAI AIOX Agentic-Agile + ADE · Claude Code (Opus 4.8).
**Relação:** complementar a `conecta-brief-aiox.md`. Compartilha as **mesmas constraints e design tokens** do site (fonte única de verdade).

---

## 0. Orquestração

```
@pm *gather-requirements          # ingere este brief
@architect *map-codebase          # localiza o app do admin e o stack
@ux-expert                        # lidera EPIC ADM-A e ADM-D (design)
@architect *create-plan
@dev *execute-subtask <id>
@qa *review-build <STORY>
@devops *merge-worktree
```

**Dono de design:** `@ux-expert`. **Implementação:** `@dev`. **Gate:** `@qa`. **Push:** `@devops`.

---

## 1. Constraints (herdadas + específicas do admin)

1. **Premium clínico, não startup-glow** (igual ao site): elegante, sóbrio, com profundidade sutil — sem glow/gradiente exagerado.
2. **Tokens compartilhados com o site público:** mesma paleta (primário `#1A1F8F`), tipografia, spacing, radius, sombra. O admin não pode ter um sistema visual paralelo.
3. **Consistência tipográfica interna:** hoje o login usa título **serifado** ("Painel administrativo") e o dashboard usa **sans** ("Bem-vindo de volta"). Unificar num só sistema.
4. **Acessibilidade:** contraste AA, foco visível, navegável por teclado, `prefers-reduced-motion` desliga transições, touch targets ≥ 44px.
5. **Responsividade:** segue o `conecta-responsividade-aiox.md` (sidebar vira drawer no mobile/tablet etc.).

---

## 2. EPIC ADM-A — Redesign da tela de login
**Dono:** `@ux-expert` · **Apoio:** `@dev`, `@qa` · **Bloqueio:** asset de imagem (H3 do brief principal, se usar foto)

**Problema:** layout atual é pobre — card branco solto num fundo quase branco, sem marca, sem identidade, desconectado do dashboard (que é dark e colorido).

**Direção (escolher 1, `@ux-expert` decide):**
- **Opção 1 — Split-screen (recomendada):** painel esquerdo (~45%) com imagem clínica real OU gradiente da marca + logo colorida + uma frase de valor ("Tecnologia veterinária, gerenciada num só lugar"); à direita, o formulário num fundo limpo. Profissional e premium.
- **Opção 2 — Full-bleed:** imagem clínica de fundo (escurecida/com overlay) + card central com leve glassmorphism. Mais impactante, exige foto boa.
- **Opção 3 — Sem foto (fallback se não houver asset):** fundo com gradiente sóbrio da marca + grafismos vetoriais finos + card elevado. Não depende de H3.

**Requisitos transversais:**
- Usar a **logo colorida real** (a do dashboard), não o texto "CONECTA".
- Estados do form: erro ("E-mail ou senha incorretos." — sem revelar qual), loading no botão "Entrar", sucesso → redirect.
- Link "Esqueci minha senha".
- `autocomplete` correto (`email`, `current-password`), inputs ≥16px (anti-zoom iOS).
- Responsivo: split colapsa pra stack único no mobile.

**Aceite:** usa logo real; identidade visual conectada ao dashboard; estados de erro/loading presentes; contraste AA; zero layout shift; passa no mobile sem scroll horizontal.

---

## 3. EPIC ADM-B — Sidebar responsiva, colapsável e com bloco de usuário
**Dono:** `@dev` · **Apoio:** `@ux-expert`, `@qa`

| # | Tarefa | Aceite |
|---|--------|--------|
| B1 | **Botão de logout** (hoje não existe) | Bloco de usuário no rodapé da sidebar (avatar + nome de exibição + e-mail + "Sair"); logout funcional |
| B2 | **Colapsar/expandir** a sidebar no desktop | Toggle alterna full (~260px) ↔ rail só-ícones (~72px); preferência persiste |
| B3 | **Accordion por grupo** | Clicar num grupo (CATÁLOGO, CONTEÚDO…) abre/fecha seus itens; o grupo da seção ativa já vem expandido |
| B4 | **Estado ativo refinado** | Item ativo com destaque consistente com os tokens (pill laranja atual ok, mas padronizado) |
| B5 | **Drawer no mobile/tablet** | Vira off-canvas com hambúrguer + overlay (detalhe no doc de responsividade) |

**Aceite do épico:** existe logout acessível; sidebar colapsa no desktop e vira drawer no mobile; accordion abre na seção selecionada; transições sob `prefers-reduced-motion`.

---

## 4. EPIC ADM-C — Header / saudação / correções
**Dono:** `@dev` · **Apoio:** `@ux-expert`, `@qa`

| # | Tarefa | Aceite |
|---|--------|--------|
| C1 | **Nome de exibição** | Campo "Nome de exibição" em *Meu perfil*; saudação lê "Bem-vindo de volta, {nome}." — parar de usar o handle do e-mail. Valor inicial: `conecta, mondragon` (Matheus pode trocar pelo nome real) |
| C2 | **Corrigir sobreposição** | O toast verde "Bem-vindo ao painel" NÃO pode cobrir o botão "2 posts aguardam moderação". Toast auto-some (~4s) e não ocupa o espaço de ação persistente; z-index e empilhamento corretos |
| C3 | **Logout no topo (opcional)** | Menu de conta no canto superior direito (avatar → "Meu perfil", "Sair"), além do bloco da sidebar |

**Aceite:** saudação nunca mostra o handle cru; nenhum elemento sobreposto; logout acessível em ≥1 lugar óbvio.

---

## 5. EPIC ADM-D — Polish premium geral
**Dono:** `@ux-expert` · **Apoio:** `@dev`, `@qa`

Matheus gosta do dashboard atual — objetivo é **elevar**, não refazer.

- **Tokens compartilhados** com o site (constraint 2) — maior alavanca de "premium" e consistência.
- **Sistema de cards unificado:** padding/radius/sombra iguais; suavizar os gradientes pastel "candy" pra um tint mais refinado + tile de ícone nítido; números com `tabular-nums`.
- **Profundidade sutil:** elevação leve e consistente, não sombra pesada.
- **Micro-interações:** hover nos cards e itens de nav, transição suave no colapso da sidebar — tudo sob `prefers-reduced-motion`.
- **Estados de dados:** skeleton/loading e empty states pros blocos "dados em tempo real" (Orçamentos 0, Formulários etc.).
- **Iconografia e espaçamento** consistentes em toda tela.

**Aceite:** admin usa os tokens do site; cards consistentes; estados de loading/empty presentes; Lighthouse A11y ≥ 95 nas telas do admin.

---

## 6. Definition of Done (gate do @qa)

- [ ] Login redesenhado com logo real, identidade conectada ao dashboard, estados de erro/loading (ADM-A)
- [ ] Logout existe e funciona (ADM-B1)
- [ ] Sidebar colapsa no desktop e vira drawer no mobile; accordion na seção ativa (ADM-B)
- [ ] Saudação usa nome de exibição, nunca o handle (ADM-C1)
- [ ] Toast não sobrepõe o botão de moderação (ADM-C2)
- [ ] Admin usa os mesmos design tokens do site (constraint 2)
- [ ] `prefers-reduced-motion` desliga animações; contraste AA; touch ≥44px
- [ ] Sem scroll horizontal de 320px a 1920px

---

## 7. Log de pedidos (Matheus anexa prints aqui)

À medida que você manda prints, cada pedido vira um EPIC ADM-x com o mesmo formato (tarefa + aceite). Template:

```
### EPIC ADM-x — <título>
Print: <referência da imagem>
Quero: <o que mudar>
Aceite: <como saber que ficou pronto>
```

> Itens já na fila a partir dos prints 1 e 2: ADM-A (login), ADM-B (sidebar+logout), ADM-C (saudação+overlap), ADM-D (polish).
