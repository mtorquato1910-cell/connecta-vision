## Projeto Conecta — Site catálogo + Painel admin

Esse escopo é grande (site institucional de 7 páginas + painel admin com CRUD completo + Supabase + auth + storage + seed). Para entregar com qualidade premium, vou dividir em **4 fases** que rodam em sequência. Cada fase termina com algo funcionando que você pode revisar antes da próxima.

---

### Fase 1 — Fundação visual + Home
- Logo Conecta sem fundo (vou processar a imagem para remover o fundo branco)
- Design system: paleta azul royal #1a1f8f + laranja #f47b20, tipografia Newsreader + Inter + JetBrains Mono, tokens em `src/styles.css`
- Estrutura de rotas TanStack (home, produtos, categoria, produto, soluções, sobre, contato, admin)
- **Home completa**: top bar, navbar sticky com logo 48px, hero com foto + métricas, banner das 8 categorias (a estrela), produtos em destaque, 3 princípios, sobre, depoimento, form contato, footer, WhatsApp flutuante
- Animações Framer Motion (scroll reveal, hover states sutis)

### Fase 2 — Catálogo público
- Página `/produtos` com sidebar de filtros + grid + paginação
- Página `/produtos/categoria/:slug`
- Página `/produtos/:slug` com galeria, tabs (descrição/specs/aplicações), modal de orçamento, produtos relacionados
- Páginas Soluções, Sobre, Contato

### Fase 3 — Lovable Cloud + dados
- Ativar Lovable Cloud (Supabase)
- Tabelas: `categorias`, `produtos`, `configuracoes`, `orcamentos` com RLS apropriada
- Storage buckets: `produtos`, `categorias`, `banner`
- Seed das 8 categorias + 8 produtos exemplo
- Conectar home + catálogo + formulário de orçamento ao banco

### Fase 4 — Painel administrativo
- Auth Supabase email/senha + rotas `/admin/*` protegidas
- Layout admin com sidebar
- Dashboard com métricas
- CRUD Produtos (com upload múltiplo de imagens, drag-reorder, rich text, specs)
- CRUD Categorias
- Editor de Banner / Destaques
- Configurações (empresa, contato, redes, top bar, rodapé)
- Inbox de Orçamentos recebidos

---

### O que vou fazer agora se você aprovar

Começo pela **Fase 1** imediatamente: processo a logo (remove fundo), configuro design system, e construo a home inteira. Quando terminar, mando o link para você revisar visualmente antes de seguir para o catálogo e o admin.

### Observações técnicas

- Stack do template é **TanStack Start** (não React Router DOM puro como o brief menciona) — vou usar roteamento file-based do TanStack, que entrega o mesmo resultado com SSR/SEO superior
- E-mail de orçamento: vou gravar no banco; envio por e-mail (Resend) pode ser adicionado depois se você quiser
- Importação dos 230 produtos: na Fase 4 deixo o painel pronto. Se você enviar a planilha, faço um script de import em batch

Aprova começar pela Fase 1?