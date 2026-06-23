# Guia de Domínios — Conecta no Vercel

**Data:** 2026-06-23 · **Por:** Orion (AIOS Master)
**Registrador:** Registro.br · **Hospedagem:** Vercel · **Conta Vercel:** time `Conecta` (`conecta2`)

---

## Resposta direta: precisa de Cloudflare?

**NÃO.** Você pode ir **direto do Registro.br para o Vercel.** O Vercel já entrega:
- SSL/HTTPS automático (Let's Encrypt)
- CDN global (rede de borda própria)
- Renovação de certificado automática

Cloudflare seria uma **camada extra opcional** (cache/WAF/analytics) que dá pra adicionar depois, sem retrabalho. Para subir agora, **direto Registro.br → Vercel é mais simples** (menos lugares pra errar). → **Recomendo ir direto.**

> Isso reverte a escolha anterior ("Cloudflare como DNS"). Como você está reconsiderando e o caminho direto é mais limpo, seguimos sem Cloudflare por enquanto.

---

## Como funciona (o conceito)

Para cada domínio são **2 lados**:
1. **No Vercel:** você adiciona o domínio ao projeto (Project → Settings → Domains → Add).
2. **No Registro.br:** você cria os registros de DNS que o Vercel pedir, apontando o domínio pro Vercel.

Os registros são **sempre os mesmos**:

| Tipo de domínio | Registro DNS | Valor |
|---|---|---|
| **Apex** (ex.: `cirugiavet.com.br`, `conecta2lab.com.br`) | **A** | `76.76.21.21` |
| **www / subdomínio** (ex.: `www.conecta2lab.com.br`, `admin.conecta2lab.com.br`) | **CNAME** | `cname.vercel-dns.com` |

💡 **Todos os domínios apex usam o MESMO registro A (`76.76.21.21`).** Você pode configurar o DNS de todos de uma vez no Registro.br.

---

## Arquitetura dos projetos no Vercel

| Projeto Vercel | Serve | Domínios |
|---|---|---|
| **`connecta-vision`** (já existe) | Site institucional + painel admin | `www.conecta2lab.com.br`, `conecta2lab.com.br`, `admin.conecta2lab.com.br` |
| **`conecta-lps`** (criar no Sprint 4) | As 9 Landing Pages estáticas | os 11 domínios das LPs (abaixo) |

As 9 LPs ficam **num projeto único**, e eu configuro o roteamento por domínio (rewrites) — cada domínio abre a LP certa. **Domínios duplos abrem a MESMA LP** (sem redirect), exatamente como você pediu.

---

## Tabela completa — todos os domínios

### Site principal → projeto `connecta-vision`
| Domínio | Tipo | Registro no Registro.br |
|---|---|---|
| `conecta2lab.com.br` | apex | A → `76.76.21.21` |
| `www.conecta2lab.com.br` | www | CNAME → `cname.vercel-dns.com` |
| `admin.conecta2lab.com.br` | subdomínio | CNAME → `cname.vercel-dns.com` |

### Landing Pages → projeto `conecta-lps`
| Domínio(s) | LP | Registro |
|---|---|---|
| `cirugiavet.com.br` · `veterinariocirurgia.com.br` | Material Cirúrgico | A → `76.76.21.21` (ambos) |
| `analiseveterinaria.com.br` | Análises Clínicas | A → `76.76.21.21` |
| `equipamentodentalvet.com.br` | Odontologia | A → `76.76.21.21` |
| `veterinarioultrassom.com.br` | Ultrassom | A → `76.76.21.21` |
| `ultrassomdoppler.com.br` | Color Doppler | A → `76.76.21.21` |
| `endoscopiaveterinario.com.br` | Endoscopia | A → `76.76.21.21` |
| `microscopiodermatologico.com.br` | Microscopia | A → `76.76.21.21` |
| `equipamentovet.com.br` · `equipamentoveterinaria.com.br` | Catálogo Geral | A → `76.76.21.21` (ambos) |
| `gemafalsa.com.br` · `periciagemas.com.br` | Gemologia | A → `76.76.21.21` (ambos) |

**Domínios duplos** (cirugiavet, equipamentovet, gemafalsa): os dois domínios são adicionados no Vercel ao mesmo projeto e **ambos servem a mesma LP**.

---

## Passo a passo no Registro.br (o que VOCÊ faz)

Para cada domínio:
1. Entre em https://registro.br → **Painel** → clique no domínio.
2. Vá em **DNS** (usar o DNS do próprio Registro.br — opção padrão, gratuita).
3. Em **Editar Zona**, adicione:
   - **Apex:** Tipo `A`, Nome em branco (ou `@`), Valor `76.76.21.21`
   - **www** (se o domínio tiver): Tipo `CNAME`, Nome `www`, Valor `cname.vercel-dns.com`
4. Salve. Propagação: minutos a algumas horas.

> Para o site: `conecta2lab.com.br` (A), `www` (CNAME), `admin` (CNAME → mesmo valor).

---

## Passo a passo no Vercel (eu faço, ou você no painel)

Para cada domínio:
1. Abrir o projeto (`connecta-vision` ou `conecta-lps`) → **Settings → Domains**.
2. **Add Domain** → digitar o domínio → Add.
3. O Vercel mostra os registros DNS esperados (os mesmos da tabela acima).
4. Quando o DNS propagar, o Vercel valida e emite o SSL sozinho.

> Eu consigo fazer essa parte via CLI (`vercel domains add ...`) assim que os projetos estiverem prontos para deploy (Sprint 4).

---

## ⚠️ Sequência importante

1. **Você JÁ PODE** configurar todo o DNS no Registro.br agora (o valor `76.76.21.21` é o mesmo para todos os apex). A propagação roda em paralelo enquanto preparamos o deploy.
2. Os domínios só **mostram conteúdo** depois que os projetos forem deployados (Sprint 4). Antes disso, podem exibir erro/404 do Vercel — normal, pois ainda não há build.
3. Ordem ideal: **deploy pronto (Sprint 4) → adicionar domínio no Vercel → DNS já apontando → SSL automático → no ar.**

---

## Resumo do que falta de você
- ⬜ Configurar o DNS no Registro.br (pode começar agora — tabela acima)
- ⬜ Confirmar que seguimos **sem Cloudflare** (direto)
- ✅ Conta Vercel conectada (time Conecta)
- ✅ Credenciais do admin recebidas
