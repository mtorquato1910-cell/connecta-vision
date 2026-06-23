# Conecta — Landing Pages (9 LPs)

Site estático (Vite + React + Tailwind) que gera **9 landing pages** independentes para a
Conecta — distribuidora de equipamentos veterinários (e uma vertical de gemologia). Cada
página é um site próprio, com seu domínio, conteúdo, SEO e imagens.

---

## 📦 Para publicar (arquivos já compilados) — pasta `sites-prontos/`

Quem só precisa **servir as páginas** usa a pasta **`sites-prontos/`**. Cada subpasta é um
site **estático e autônomo** (HTML + CSS + JS + imagens já otimizadas): basta servir o
conteúdo da pasta na **raiz** do domínio correspondente. Não precisa de Node, build nem banco
de dados para servir — é HTML estático.

| Pasta em `sites-prontos/` | Domínio(s) | Página |
|---|---|---|
| `cirugiavet/` | cirugiavet.com.br · veterinariocirurgia.com.br | Material Cirúrgico Veterinário |
| `analiseveterinaria/` | analiseveterinaria.com.br | Análises Clínicas Veterinárias |
| `equipamentodentalvet/` | equipamentodentalvet.com.br | Odontologia Veterinária |
| `veterinarioultrassom/` | veterinarioultrassom.com.br | Ultrassom Veterinário |
| `ultrassomdoppler/` | ultrassomdoppler.com.br | Ultrassom Color Doppler |
| `endoscopiaveterinario/` | endoscopiaveterinario.com.br | Endoscopia Veterinária |
| `microscopiodermatologico/` | microscopiodermatologico.com.br | Microscopia Veterinária |
| `equipamentovet/` | equipamentovet.com.br · equipamentoveterinaria.com.br | Catálogo Geral de Equipamentos |
| `gemafalsa/` | gemafalsa.com.br · periciagemas.com.br | Gemologia & Perícia de Gemas |

Cada pasta contém: `index.html`, `assets/` (CSS/JS/logo), as imagens usadas (`banco/`,
`products/`), `favicon.png`, `robots.txt` e `sitemap.xml` (o sitemap já aponta para o domínio
final). Total da entrega: ~40 MB.

> Observação: alguns domínios têm uma URL alternativa (ex.: `veterinariocirurgia.com.br`).
> O ideal é que a alternativa **redirecione** (301) para a principal, para não duplicar
> conteúdo. Combinar com o time.

---

## 🛠️ Para regenerar (código-fonte) — opcional

Só é necessário para **alterar** as páginas e gerar de novo.

Pré-requisitos: **Node.js 20+**.

```bash
npm install          # instala dependências
npm run build        # compila as 9 páginas em dist/ (com SEO injetado)
npm run verify       # ⚠️ blindagem: abre cada página num navegador e falha se vier em branco
npm run package      # gera sites-prontos/ (enxuto + imagens otimizadas) a partir de dist/
```

- `npm run verify` precisa do **Google Chrome** instalado (renderiza cada página headless e
  confere que o conteúdo carregou). Existe porque o build pode, sob pressão de memória,
  entregar a última página corrompida (tela branca) com o build dizendo "sucesso" — esse passo
  pega isso antes de publicar. Se reprovar, rode o build de novo (ou só do site que falhou) e
  verifique outra vez.
- As imagens originais ficam em `public/`. A otimização (`npm run package`) acontece **só** na
  saída `sites-prontos/`, sem alterar os originais.

### Estrutura do código
- `src/sites/*.ts` — uma config por página (textos, produtos, imagens, SEO).
- `src/lib/site.ts` — resolve o site ativo via variável `VITE_SITE` no build.
- `src/components/` — componentes compartilhados (galeria, formulário, etc.).
- `scripts/build-seo.mjs` — build das 9 com SEO. `scripts/verify-build.mjs` — blindagem.
  `scripts/package-sites.mjs` — empacota a entrega enxuta.

---

## ❓ Dúvidas frequentes (handoff)
- **"Preciso de banco de dados para subir?"** Não para *servir* — são arquivos estáticos.
  Basta um servidor web (ou storage estático) servindo cada pasta de `sites-prontos/` na raiz
  do domínio.
- **"Os formulários funcionam?"** O formulário de orçamento abre o WhatsApp da Conecta com a
  mensagem preenchida (não depende de back-end).
