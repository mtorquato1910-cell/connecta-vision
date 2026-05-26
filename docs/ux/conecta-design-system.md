# Design System Editorial Premium — Conecta

**Versão:** 1.0
**Data:** 2026-05-26
**Autor:** @ux-design-expert
**Referência:** [PRD](../prd/conecta-prd.md), [Architecture](../architecture/conecta-architecture.md)
**Inspiração:** IDEXX, Mindray, Le Monde, NY Times — editorial clássico premium aplicado a B2B veterinário

---

## 1. Filosofia de design

### O QUE A CONECTA É
Catálogo digital **editorial premium** de equipamentos veterinários. Pense em **jornal médico**, não em pet shop. Pense em **galeria de arte**, não em e-commerce. Pense em **dossiê técnico**, não em landing de SaaS.

### O QUE A CONECTA NÃO É
- ❌ Pet shop fofo com pegada lúdica
- ❌ Startup tech com gradientes e ilustrações
- ❌ E-commerce com banners de promoção
- ❌ Site corporativo genérico com stock photos
- ❌ Brutalist agressivo (foi descartado pelo cliente)

### Os 5 princípios do design Conecta
1. **Editorial sobre marketing** — tipografia conta a história, não o copy berrando
2. **Branco respira** — espaço negativo generoso é o luxo
3. **Numeração editorial** — 01, 02, 03 como em revista impressa
4. **Hover discreto** — elegância em vez de animação brega
5. **Cor estratégica** — laranja Conecta apenas em momentos de decisão (CTA)

---

## 2. Tokens de design (CSS Variables)

### 2.1 Cores

```css
:root {
  /* === Background neutros === */
  --bg:                  #FAFAF7;  /* off-white principal (não branco puro) */
  --bg-elevated:         #FFFFFF;  /* cards, modals */
  --bg-subtle:           #F5F5F0;  /* hover de áreas grandes */
  --bg-overlay:          rgba(10, 10, 10, 0.4);

  /* === Texto === */
  --ink:                 #0A0A0A;  /* texto principal */
  --ink-soft:            #4A4A4A;  /* texto secundário, legendas */
  --ink-mute:            #9A9A9A;  /* placeholder, labels muted */
  --ink-inverse:         #FAFAF7;  /* texto sobre fundo escuro */

  /* === Linhas === */
  --line:                rgba(10, 10, 10, 0.08);   /* divisor padrão */
  --line-strong:         rgba(10, 10, 10, 0.16);   /* divisor visível */
  --line-subtle:         rgba(10, 10, 10, 0.04);   /* divisor muito sutil */

  /* === Marca Conecta === */
  --conecta-blue:        #1A1F8F;  /* azul institucional — uso pontual */
  --conecta-blue-soft:   #2D33A8;  /* hover azul */
  --conecta-blue-mute:   rgba(26, 31, 143, 0.08); /* fundos azuis sutis */

  --conecta-orange:      #F47B20;  /* laranja Conecta — ÚNICO accent de CTA */
  --conecta-orange-hover:#D9651A;  /* hover do laranja */
  --conecta-orange-mute: rgba(244, 123, 32, 0.08);

  /* === Semânticos === */
  --success:             #2D8A4E;
  --warning:             #C68B14;
  --danger:              #B8341E;
  --info:                #1A6FAA;

  /* === Fundo escuro (footer, marquee) === */
  --ink-bg:              #0A0A0A;  /* fundo escuro principal */
  --ink-bg-soft:         #1A1A1A;  /* sutilmente mais claro */
}
```

### 2.2 Tipografia

```css
:root {
  /* === Famílias === */
  --font-display:  'Instrument Serif', Georgia, serif;
  --font-body:     'Work Sans', system-ui, -apple-system, sans-serif;
  --font-mono:     'JetBrains Mono', 'SF Mono', Menlo, monospace;

  /* === Escala fluida (clamp para responsividade) === */
  --text-xs:       0.75rem;                              /* 12px - labels micro */
  --text-sm:       0.875rem;                             /* 14px - body small */
  --text-base:     1rem;                                 /* 16px - body */
  --text-lg:       1.125rem;                             /* 18px - body destaque */
  --text-xl:       clamp(1.25rem, 1.5vw, 1.5rem);        /* 20-24px */
  --text-2xl:      clamp(1.5rem, 2vw, 2rem);             /* 24-32px */
  --text-3xl:      clamp(2rem, 3vw, 2.75rem);            /* 32-44px */
  --text-4xl:      clamp(2.75rem, 5vw, 4rem);            /* 44-64px */
  --text-display:  clamp(3rem, 8vw, 6rem);               /* 48-96px hero */

  /* === Pesos === */
  --weight-regular:    400;
  --weight-medium:     500;
  --weight-semibold:   600;
  --weight-bold:       700;

  /* === Tracking (letter-spacing) === */
  --track-tight:       -0.02em;  /* display Instrument Serif */
  --track-normal:      0;
  --track-wide:        0.04em;   /* labels ALL CAPS */
  --track-wider:       0.08em;   /* numeração editorial */

  /* === Line height === */
  --leading-tight:     1.1;      /* headlines display */
  --leading-snug:      1.25;     /* H2/H3 */
  --leading-normal:    1.5;      /* body */
  --leading-relaxed:   1.65;     /* parágrafos longos editoriais */
}
```

### 2.3 Espaçamento

```css
:root {
  /* === Escala em rem (8px base) === */
  --space-1:   0.25rem;   /* 4px */
  --space-2:   0.5rem;    /* 8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px */
  --space-24:  6rem;      /* 96px */
  --space-32:  8rem;      /* 128px */
  --space-40:  10rem;     /* 160px */

  /* === Verticais de seção === */
  --section-py-sm:   clamp(3rem, 6vw, 5rem);    /* 48-80px */
  --section-py-md:   clamp(5rem, 10vw, 8rem);   /* 80-128px */
  --section-py-lg:   clamp(6rem, 14vw, 10rem);  /* 96-160px */

  /* === Container === */
  --container-max:   1280px;
  --container-px:    clamp(1rem, 4vw, 2rem);    /* 16-32px */
}
```

### 2.4 Bordas e raios

```css
:root {
  --radius-none:   0;
  --radius-sm:     0.25rem;    /* 4px - inputs, small buttons */
  --radius-md:     0.5rem;     /* 8px - cards */
  --radius-lg:     0.75rem;    /* 12px - modals */
  --radius-xl:     1rem;       /* 16px - hero elements */
  --radius-full:   9999px;     /* pills */

  /* CONECTA usa raios sutis — quase quadrado */
  /* Componentes principais: radius-sm ou radius-md NO MÁXIMO */
}
```

### 2.5 Sombras (sutis, editorial)

```css
:root {
  --shadow-none:    none;
  --shadow-sm:      0 1px 2px 0 rgba(10, 10, 10, 0.04);
  --shadow-md:      0 4px 12px -2px rgba(10, 10, 10, 0.06), 0 2px 4px -1px rgba(10, 10, 10, 0.03);
  --shadow-lg:      0 12px 32px -4px rgba(10, 10, 10, 0.08), 0 4px 12px -2px rgba(10, 10, 10, 0.04);
  --shadow-xl:      0 24px 64px -8px rgba(10, 10, 10, 0.12), 0 8px 24px -4px rgba(10, 10, 10, 0.06);

  /* Hover de card: aumenta sutilmente */
  --shadow-card-rest: var(--shadow-sm);
  --shadow-card-hover: var(--shadow-md);
}
```

### 2.6 Transições

```css
:root {
  --ease-out:       cubic-bezier(0.16, 1, 0.3, 1);     /* hover, entradas */
  --ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1);    /* movimentos balanceados */
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1); /* uso pontual */

  --duration-fast:  150ms;   /* hover, foco */
  --duration-base:  250ms;   /* a maioria */
  --duration-slow:  400ms;   /* page transitions, drawers */
  --duration-slower: 700ms;  /* stagger animations */
}
```

---

## 3. Sistema tipográfico

### 3.1 Hierarquia editorial

```
H1 — Display Hero          → Instrument Serif, --text-display (48-96px), weight 400, leading 1.1, tracking -0.02em
H2 — Section Headline      → Instrument Serif, --text-4xl (44-64px), weight 400, leading 1.15, tracking -0.015em
H3 — Card Title / Subhead  → Work Sans, --text-2xl (24-32px), weight 600, leading 1.25
H4 — Small Headline        → Work Sans, --text-xl (20-24px), weight 600, leading 1.3
Body Lg — Lead paragraph   → Work Sans, --text-lg (18px), weight 400, leading 1.65
Body — Default             → Work Sans, --text-base (16px), weight 400, leading 1.6
Body Sm — Caption/Meta     → Work Sans, --text-sm (14px), weight 400, leading 1.5
Micro — Label/Tag          → Work Sans, --text-xs (12px), weight 500, ALL CAPS, tracking 0.08em
Number — Editorial         → JetBrains Mono, --text-sm (14px), weight 500, tracking 0.04em  ("01", "02", "03")
Code — Technical           → JetBrains Mono, --text-sm (14px), weight 400
```

### 3.2 Exemplo CSS

```css
.h1-hero {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: var(--weight-regular);
  line-height: var(--leading-tight);
  letter-spacing: var(--track-tight);
  color: var(--ink);
}

.editorial-number {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  letter-spacing: var(--track-wider);
  color: var(--ink-mute);
  text-transform: uppercase;
}
```

---

## 4. Componentes-chave (especificação visual)

### 4.1 Botão

#### Variantes
```
Primary    — Fundo laranja Conecta, texto branco, peso 500
              USO: APENAS CTAs primários ("Solicitar orçamento", "Enviar")
              MÁXIMO 1 por viewport

Secondary  — Borda 1px ink, fundo transparente, texto ink
              USO: ações secundárias ("Explorar catálogo")

Ghost      — Sem borda, texto ink-soft, hover bg-subtle
              USO: ações terciárias, links em lista

Whatsapp   — Fundo verde WhatsApp (#25D366), texto branco
              USO: APENAS botão WhatsApp
```

#### Especificações
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0 var(--space-6);            /* 24px horizontal */
  height: 48px;                         /* desktop */
  border-radius: var(--radius-sm);      /* 4px - quase quadrado */
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  letter-spacing: 0.01em;
  transition: all var(--duration-base) var(--ease-out);
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary {
  background: var(--conecta-orange);
  color: white;
}
.btn-primary:hover {
  background: var(--conecta-orange-hover);
  transform: translateY(-1px);          /* hover sutil — NÃO scale */
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--ink);
  color: var(--ink);
}
.btn-secondary:hover {
  background: var(--ink);
  color: var(--ink-inverse);
}

/* Mobile: altura 44px (touch target mínimo) */
@media (max-width: 768px) {
  .btn { height: 44px; }
}
```

### 4.2 Card (produto, categoria, blog, evento)

```css
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);      /* 8px */
  overflow: hidden;
  transition: all var(--duration-base) var(--ease-out);
  cursor: pointer;
}

.card:hover {
  border-color: var(--line-strong);
  box-shadow: var(--shadow-card-hover);
  /* NÃO usar scale(1.05) — fica brega */
  transform: translateY(-2px);
}

.card__image {
  aspect-ratio: 4 / 3;                  /* padrão produto */
  object-fit: cover;                    /* 100% container — sem padding excessivo */
  width: 100%;
}

.card__body {
  padding: var(--space-6);
}

.card__category-label {
  /* Tag editorial em cima do título */
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--track-wider);
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: var(--space-2);
}

.card__title {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--ink);
  line-height: var(--leading-snug);
}
```

### 4.3 Hero

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  01 — CATÁLOGO PREMIUM                                            │  ← número editorial mono
│                                                                   │
│  Equipamentos                                                     │  ← Instrument Serif gigante
│  veterinários que                                                 │
│  elevam sua clínica.                                              │
│                                                                   │
│  Distribuidor oficial Shinova no Brasil. Tecnologia               │  ← Work Sans 18px
│  comprovada para clínicas, hospitais e universidades.             │
│                                                                   │
│  [ Solicitar orçamento → ]   [ Explorar catálogo ]                │  ← Primary + Secondary
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓ marquee infinito
```

```css
.hero {
  padding-top: var(--space-40);          /* 160px desktop */
  padding-bottom: var(--space-32);
  background: var(--bg);
}

.hero__eyebrow {
  /* Numeração editorial */
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: var(--track-wider);
  text-transform: uppercase;
  color: var(--ink-mute);
  margin-bottom: var(--space-8);
}

.hero__title {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: var(--weight-regular);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-bottom: var(--space-8);
  max-width: 18ch;                       /* limita linha para impacto */
}

@media (max-width: 768px) {
  .hero { padding-top: var(--space-24); padding-bottom: var(--space-16); }
}
```

### 4.4 Marquee infinito

```
─────────────────────────────────────────────────────────────────────
  EQUIPAMENTOS VETERINÁRIOS PREMIUM • DISTRIBUIDORA OFICIAL SHINOVA •
─────────────────────────────────────────────────────────────────────
```

```css
.marquee {
  width: 100%;
  overflow: hidden;
  background: var(--ink-bg);
  color: var(--ink-inverse);
  padding: var(--space-4) 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.marquee__track {
  display: inline-flex;
  white-space: nowrap;
  animation: marquee 40s linear infinite;
}
.marquee__item {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: var(--track-wide);
  text-transform: uppercase;
  padding: 0 var(--space-12);
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

### 4.5 Input/textarea de formulário

```css
.input {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-4);
  height: 48px;
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--ink);
  transition: all var(--duration-fast) var(--ease-out);
}
.input::placeholder { color: var(--ink-mute); }
.input:focus {
  outline: none;
  border-color: var(--ink);
  box-shadow: 0 0 0 4px var(--conecta-blue-mute);
}
.input--error {
  border-color: var(--danger);
}
.input-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--ink-soft);
  margin-bottom: var(--space-2);
  display: block;
}
.input-helper {
  font-size: var(--text-xs);
  color: var(--ink-mute);
  margin-top: var(--space-2);
}
.input-error-msg {
  font-size: var(--text-xs);
  color: var(--danger);
  margin-top: var(--space-2);
}
```

### 4.6 Numeração editorial (selo)

Usar em seções para reforçar pegada editorial:

```jsx
<header className="section-header">
  <span className="editorial-number">01 — Categorias</span>
  <h2 className="h2-section">Soluções por especialidade clínica.</h2>
</header>
```

```css
.editorial-number {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: var(--track-wider);
  text-transform: uppercase;
  color: var(--ink-mute);
  display: block;
  margin-bottom: var(--space-4);
}
```

---

## 5. Padrões de layout

### 5.1 Grid de container

```css
.container {
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding-left: var(--container-px);
  padding-right: var(--container-px);
}

.grid-categorias {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}
@media (min-width: 768px) {
  .grid-categorias { grid-template-columns: repeat(4, 1fr); }
}

.grid-produtos {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}
@media (min-width: 640px) { .grid-produtos { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .grid-produtos { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .grid-produtos { grid-template-columns: repeat(4, 1fr); } }
```

### 5.2 Página de produto — layout

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Categorias / Imagem & Diagnóstico                              │  breadcrumb
│                                                                   │
│  ┌───────────────────────┐  ┌──────────────────────────────────┐ │
│  │                       │  │ MODELO M-5000                    │ │
│  │     [main image]      │  │                                  │ │
│  │                       │  │ Monitor Multiparâmetros          │ │
│  │                       │  │ Veterinário 12.1"                │ │
│  │                       │  │                                  │ │
│  └───────────────────────┘  │ Curtinha descrição em 2 linhas.. │ │
│  [thumb][thumb][thumb]      │                                  │ │
│                             │ [ Solicitar orçamento → ]        │ │
│                             │ [ Falar no WhatsApp ]            │ │
│                             └──────────────────────────────────┘ │
│                                                                   │
│  ─── DESCRIÇÃO ─── ESPECIFICAÇÕES ─── APLICAÇÕES ─── VÍDEO ───   │  tabs
│                                                                   │
│  [conteúdo da tab ativa]                                          │
│                                                                   │
│  ─── Produtos relacionados                                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. Animações

### 6.1 Princípios
- **Sutil > exagerado** — ninguém quer ver scale(1.2) num site sério
- **Função > decoração** — animação serve para guiar olho, não impressionar
- **Performance > beleza** — 60fps sempre, GPU-accelerated (transform/opacity)

### 6.2 Padrões reutilizáveis (Framer Motion)

```tsx
// Scroll reveal staggered
export const revealStagger = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  })
};

// Hero entrance
export const heroFade = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

// Card hover
export const cardHover = {
  rest: { y: 0, boxShadow: 'var(--shadow-sm)' },
  hover: { y: -2, boxShadow: 'var(--shadow-md)', transition: { duration: 0.25 } }
};

// Number count-up (use react-countup)
<CountUp end={230} duration={2} suffix="+" />
```

### 6.3 NÃO usar
- ❌ `scale(1.05)` em cards (brega)
- ❌ Bounce effects em CTAs
- ❌ Confetti, parallax exagerado
- ❌ Cursor customizado
- ❌ Page transitions com fade longo (irrita)

---

## 7. Iconografia

### 7.1 Estilo
- **SVG outline 1.5px stroke** (não ícone preenchido)
- **Sem fundo lilás arredondado bonitinho** ❌
- Cor: `currentColor` (herda do texto)
- Tamanhos padrão: 16, 20, 24 px

### 7.2 Biblioteca
- **Lucide React** já está no projeto — usar com estilo outline
- Em alguns lugares: **substituir ícone por número editorial** (01, 02, 03)
- Em alguns lugares: **substituir ícone por texto puro** (ex.: "Saiba mais →")

### 7.3 Ícone de categoria (admin upload)
- SVG ou PNG transparente
- 200×200 px máximo
- Cor única (cinza escuro ou azul Conecta)
- Linha 1.5–2 pt
- **Não usar emoji nem ilustração colorida**

---

## 8. Tom de voz

### 8.1 Princípios
- **Técnico mas humano** — fala com veterinário, não com leigo
- **Direto** — sem floreio, sem "vamos transformar sua clínica!"
- **Confiante mas não arrogante** — "tecnologia comprovada", não "a melhor do mundo"

### 8.2 Comparativo

| ❌ NÃO escrever | ✅ Escrever |
|---|---|
| "Equipamentos veterinários incríveis e revolucionários" | "Equipamentos veterinários que elevam o padrão da sua clínica" |
| "Compre agora!" | "Solicitar orçamento" |
| "Os melhores preços do mercado" | (não falar de preço — proibido) |
| "Clique aqui!" | "Ver catálogo →" |
| "Atendimento 5 estrelas" | "Suporte técnico especializado" |
| "Família pet feliz" | "Clínicas que confiam na Conecta" |
| "Nossos produtos são top!" | "230+ equipamentos Shinova prontos para sua operação" |

---

## 9. Estados de UI

### 9.1 Loading
- **Skeleton** em listagens (linhas cinza animadas)
- **Spinner** apenas em botões durante ação curta (< 3s)
- **Mensagem** em ações longas: "Enviando..." / "Carregando produtos..."

### 9.2 Empty
- Ilustração SVG editorial **mínima** (linha fina, sem cor)
- Headline em Instrument Serif: "Nada por aqui ainda."
- Sub: explicação + CTA
- **Exemplo categoria vazia:**
  ```
  Estamos preparando produtos novos
  para esta categoria.
  
  Fale com nosso time para uma cotação personalizada.
  
  [ Falar no WhatsApp ]
  ```

### 9.3 Erro
- Não usar termos técnicos ("500 Internal Server Error" ❌)
- **Exemplo:**
  ```
  Algo não saiu como esperávamos.
  
  Tente recarregar a página. Se persistir,
  fale conosco no WhatsApp.
  
  [ Recarregar ]   [ WhatsApp ]
  ```

### 9.4 Sucesso
- **Toast** discreto top-right (Sonner já está no projeto)
- **Mensagem de orçamento enviado:**
  ```
  ✓ Recebemos seu pedido de orçamento.
  Em até 1 dia útil entraremos em contato.
  ```

---

## 10. Acessibilidade (WCAG 2.1 AA)

| Categoria | Padrão |
|---|---|
| **Contraste texto** | ≥ 4.5:1 (body) / 3:1 (large text 18px+) — testado |
| **Contraste UI** | ≥ 3:1 para bordas e ícones críticos |
| **Foco visível** | Ring custom (não default azul): `0 0 0 3px var(--conecta-blue-mute)` |
| **Skip link** | "Pular para conteúdo principal" no topo |
| **Alt text** | Obrigatório em toda `<img>` (produto: "Modelo M-5000 visto de frente") |
| **Heading hierarchy** | 1 H1 por página, ordem lógica |
| **Navegação teclado** | Tab/Shift+Tab em tudo, Enter ativa, Esc fecha modais |
| **ARIA** | Modais com `role="dialog"` + `aria-labelledby`; loading com `aria-live="polite"` |
| **Forms** | Label associado, mensagem de erro `aria-describedby` |
| **Touch target** | ≥ 44×44 px mínimo (mobile) |

---

## 11. Mobile-first

### 11.1 Breakpoints (Tailwind defaults)
```
sm:  640px     /* phone landscape */
md:  768px     /* tablet portrait */
lg:  1024px    /* tablet landscape */
xl:  1280px    /* desktop */
2xl: 1536px    /* large desktop */
```

### 11.2 Decisões mobile
- Mobile: navbar com **hamburger drawer**
- Hero: padding reduzido + título menor mas ainda impactante
- Grid de categorias: 2 colunas em mobile
- Grid de produtos: 1 coluna mobile, 2 sm, 3 lg, 4 xl
- Página de produto: galeria empilhada acima do detalhe
- Tabs em mobile: scroll horizontal das abas
- WhatsApp flutuante: ainda mais proeminente em mobile (touch target maior)

---

## 12. Componentes a construir (lista para Sprint 1)

| Componente | Status atual | Refazer? |
|---|---|---|
| `<Navbar>` | Existe (Lovable) | **Sim, alinhar padrão editorial** |
| `<Footer>` | Existe (Lovable) | **Sim, layout 4 colunas premium** |
| `<Hero>` | Existe (Lovable) | **Sim, tipografia + numeração + CTAs corretos** |
| `<CategoryCard>` | Existe (Lovable) | **Sim, ícone outline + hover sutil** |
| `<ProductCard>` | Existe (Lovable) | **Sim, image cover 100% + meta editorial** |
| `<Marquee>` | Componente Reveal existe | **Sim, criar Marquee infinito específico** |
| `<EditorialNumber>` | Não existe | **Criar (`01`, `02`, `03`)** |
| `<SectionHeader>` | Não existe | **Criar (number + headline)** |
| `<ContactForm>` | Componente QuoteModal existe | **Refatorar com Zod + estados** |
| `<WhatsAppFab>` | Existe | **Polish: animação pulse sutil** |
| `<Tabs>` | shadcn | Usar primitive |
| `<Dialog>` | shadcn | Usar primitive |
| `<Toaster>` | sonner | Usar primitive |

---

## 13. Checklist de aprovação de cada tela

Antes de marcar AC como done, validar visualmente:

- [ ] Logo a 48px na navbar (medido)
- [ ] Cores apenas das variáveis CSS (nenhum hex hardcoded fora do token)
- [ ] Tipografia: H1/H2 em Instrument Serif, body em Work Sans, números em JetBrains Mono
- [ ] Espaçamento vertical de seção mínimo 80px desktop / 48px mobile
- [ ] Apenas 1 CTA Primary visível por viewport
- [ ] Sem ícone com fundo lilás/colorido
- [ ] Sem gradiente colorido
- [ ] Hover de card: translateY(-2px) + sombra (sem scale)
- [ ] Imagens com object-cover preenchendo 100% do container
- [ ] Alt text em todas as imagens
- [ ] Foco visível custom em todos os interactives
- [ ] Mobile: testado em 320px de largura mínimo

---

## 14. Recursos prontos

### 14.1 Fontes (Google Fonts)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Ou via `@fontsource` (preferido em Next.js):
```bash
bun add @fontsource/instrument-serif @fontsource/work-sans @fontsource/jetbrains-mono
```

### 14.2 Tokens em Tailwind config

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-mute': 'var(--ink-mute)',
        'conecta-blue': 'var(--conecta-blue)',
        'conecta-orange': 'var(--conecta-orange)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      maxWidth: {
        container: 'var(--container-max)',
      }
    }
  }
}
```

---

## 15. Próximos passos UX

1. **Sprint 0/1:** aplicar os tokens em CSS globals + Tailwind config
2. **Sprint 1:** refazer componentes-chave (Navbar, Hero, Cards, Footer) com padrão editorial
3. **Sprint 1:** processar logo (remover fundo) e gerar variantes
4. **Sprint 2-3:** componentes de Blog (post layout) e Galeria (lightbox) seguindo princípios
5. **Sprint 4:** UI do admin = mais utilitário, menos editorial — pode ser mais "tabela densa" no estilo Notion/Linear, mas mantendo a tipografia
6. **Sprint 5:** auditoria visual comparativa final (Conecta vs IDEXX)

— @ux-design-expert, vestindo a marca em pixel perfeito 🎨
