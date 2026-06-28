# Passo-a-passo: Domínios + DNS (executar no painel)

**Conta Vercel:** `conectamondragon-byte` · time `conecta2` · projeto do site `connecta-vision`.
**Domínio principal:** `conecta2lab.com.br` (site) + `admin.conecta2lab.com.br` (admin).
**IP apex da Vercel:** `76.76.21.21` · **CNAME da Vercel:** `cname.vercel-dns.com`

> Propagação de DNS leva de minutos a ~2h. O SSL é emitido automático pela Vercel após o DNS apontar certo.

---

## 1) Site principal — projeto `connecta-vision`

### 1.1 Promover para produção
Antes dos domínios, garanta uma build de produção no ar:
1. No projeto, rode local: `npm run build && node scripts/build-vercel.mjs`
2. Depois: `vercel deploy --prebuilt --prod` (ou use o painel se preferir).

### 1.2 Adicionar domínios (Vercel ▸ Project `connecta-vision` ▸ Settings ▸ Domains)
Adicione os 3:
- `conecta2lab.com.br` (apex)
- `www.conecta2lab.com.br`
- `admin.conecta2lab.com.br`

A Vercel vai mostrar, pra cada um, qual registro DNS criar. Use a tabela abaixo.

### 1.3 DNS no Registro.br (painel do domínio ▸ "Editar zona DNS" / DNS avançado)
| Host / Nome | Tipo | Valor |
|---|---|---|
| `@` (apex) | A | `76.76.21.21` |
| `www` | CNAME | `cname.vercel-dns.com` |
| `admin` | CNAME | `cname.vercel-dns.com` |

> No Registro.br, o apex (`@`) usa **A**. `www` e `admin` usam **CNAME**.
> Defina `www` ou o apex como **Primary** na Vercel (o outro vira redirect 308 — recomendo `www` → apex ou apex → `www`, tanto faz; padrão Vercel sugere redirecionar pro que você marcar como principal).

---

## 2) Landing Pages — 1 projeto Vercel separado (`conecta-lps`)

As 9 LPs são **estáticas** (pasta `sites-prontos/<site>/` após o build). Recomendado: **1 projeto Vercel** servindo todas, com cada domínio apontando para o respectivo build.

> Como cada LP é uma pasta estática independente, a forma mais simples é **1 projeto Vercel por LP** (deploy da pasta `sites-prontos/<site>`) OU 1 projeto com rewrites por host. Para 9 LPs, **9 deploys estáticos** (um por pasta) é o mais direto e à prova de erro. Decida com base no esforço; ambos funcionam.

### 2.1 Domínios das LPs (11 domínios, 3 são duplos → redirect 308 pro principal)
| LP (build) | Domínio principal | Alias (redirect) |
|---|---|---|
| cirugiavet | `cirugiavet.com.br` | `veterinariocirurgia.com.br` |
| analiseveterinaria | `analiseveterinaria.com.br` | — |
| equipamentodentalvet | `equipamentodentalvet.com.br` | — |
| veterinarioultrassom | `veterinarioultrassom.com.br` | — |
| ultrassomdoppler | `ultrassomdoppler.com.br` | — |
| endoscopiaveterinario | `endoscopiaveterinario.com.br` | — |
| microscopiodermatologico | `microscopiodermatologico.com.br` | — |
| equipamentovet | `equipamentovet.com.br` | `equipamentoveterinaria.com.br` |
| gemafalsa | `gemafalsa.com.br` | `periciagemas.com.br` |

### 2.2 DNS de CADA domínio de LP no Registro.br (mesmo padrão)
| Host | Tipo | Valor |
|---|---|---|
| `@` | A | `76.76.21.21` |
| `www` | CNAME | `cname.vercel-dns.com` |

---

## 3) Checklist final pós-DNS
- [ ] Cada domínio mostra "Valid Configuration" na Vercel + cadeado SSL no navegador.
- [ ] `conecta2lab.com.br` e `www` abrem o site; `admin.` abre o login do admin.
- [ ] Cada LP abre no seu domínio e os aliases redirecionam (308).
- [ ] Enviar 1 formulário em CADA LP e ver caindo em `admin ▸ Formulários` (tipo `orcamento_lp`).
- [ ] Enviar 1 contato + 1 orçamento no site principal e ver caindo no admin.
