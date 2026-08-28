# Publicar no Cloudflare Pages com domínio .com.br

O projeto já está configurado para **export estático** (pasta `out/`). Siga os passos abaixo.

---

## 1. Subir o código para um repositório Git

Se ainda não tiver o projeto no GitHub (ou GitLab):

1. Crie um repositório novo no [GitHub](https://github.com/new).
2. No terminal, na pasta do projeto:

```bash
git init
git add .
git commit -m "Site pronto para deploy"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

**Importante:** Não suba a pasta `out/` nem `node_modules/`. Se existir `.gitignore`, ela já deve ignorar isso.

---

## 2. Cloudflare Pages – conectar o repositório

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) e faça login.
2. Menu lateral: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Escolha o provedor (ex.: GitHub) e autorize o Cloudflare.
4. Selecione o repositório do projeto.
5. Configure o build:
   - **Framework preset:** None (ou Static)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Root directory:** (deixe em branco)
   - Se existir **Deploy command** (comando de deploy separado), use: `npx wrangler pages deploy` (e não `npx wrangler deploy`). Se a opção for “deixar em branco”, deixe em branco para o Cloudflare usar só a pasta `out`.
6. Clique em **Save and Deploy**.

Após o primeiro deploy, o site ficará em um endereço como:  
`https://nome-do-projeto.pages.dev`.

---

### Se der erro "Missing entry-point to Worker script or to assets directory"

O projeto inclui um `wrangler.toml` que aponta a saída para a pasta `out`. Se o Cloudflare estiver usando um **Deploy command** como `npx wrangler deploy`, troque para:

```bash
npx wrangler pages deploy
```

Assim o Wrangler faz deploy como **Pages** (site estático) usando a pasta `out`, e não como Worker. Se na configuração do projeto não houver campo “Deploy command”, remova qualquer comando de deploy customizado e deixe apenas **Build command** e **Build output directory** (`out`).

---

## 3. Comprar e configurar o domínio .com.br no dominio.br

1. Acesse [dominio.br](https://dominio.br) (registro.br para .com.br).
2. Pesquise o nome desejado (ex.: `adrianabarbosa`, `pilotandotudo`).
3. Compre o domínio e conclua o registro (siga o fluxo do site).
4. No painel do dominio.br, anote onde ficam as **DNS** (nameservers ou registros DNS). Você vai precisar apontar o domínio para o Cloudflare.

---

## 4. Adicionar o domínio no Cloudflare Pages

1. No Cloudflare: **Workers & Pages** → clique no seu projeto **Pages**.
2. Aba **Custom domains** → **Set up a custom domain**.
3. Digite o domínio (ex.: `seusite.com.br` ou `www.seusite.com.br`).
4. O Cloudflare vai mostrar os registros DNS que você deve criar.

**Se o domínio estiver no Cloudflare (nameservers do Cloudflare):**  
O próprio Cloudflare pode criar os registros; basta seguir a tela.

**Se o domínio estiver no dominio.br (ou outro registrador):**  
Você precisa criar manualmente no painel do dominio.br os registros que o Cloudflare pedir, por exemplo:

- **Tipo A** ou **CNAME** (o que o Cloudflare indicar):
  - Nome: `@` (para raiz) ou `www`
  - Valor: o que o Cloudflare mostrar (ex.: endereço do Pages ou `nome-do-projeto.pages.dev`)

Salve os registros e aguarde a propagação (pode levar de alguns minutos a 48 horas).

---

## 5. HTTPS (SSL)

No Cloudflare, o SSL para domínios customizados no Pages costuma ser ativado automaticamente. Se aparecer “Pending” ou “Initializing”, espere alguns minutos.

---

## Resumo rápido

| Onde            | O quê |
|-----------------|--------|
| **Build command** | `npm run build` |
| **Build output**  | `out` |
| **Domínio**       | Comprar em dominio.br e apontar DNS para o Cloudflare Pages conforme o painel do Cloudflare. |

Se quiser usar **www** e **sem www** (raiz), adicione os dois como custom domains no mesmo projeto Pages e configure no dominio.br um registro para `@` e outro para `www`, conforme as instruções do Cloudflare.

---

## 6. Configurar o CMS (painel /admin)

O painel de administração usa **Cloudflare D1** (banco) e **Pages Functions** (API). Faça estes passos **uma única vez** após o primeiro deploy.

O painel edita apenas textos, listas, links e a ordem/visibilidade das seções. As imagens do site ficam em `public/Assets/` e são trocadas direto no projeto.

### 6.1 Criar banco D1

1. Cloudflare Dashboard → **Workers & Pages** → **D1 SQL Database** → **Create**
2. Nome: `adriana-cms`
3. Copie o **Database ID** e substitua em `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "adriana-cms"
database_id = "SEU-DATABASE-ID-AQUI"
```

4. No terminal, na pasta do projeto:

```bash
npm run db:setup
```

Isso cria as tabelas (`users`, `content`, `versions`, etc.).

### 6.2 Vincular D1 ao projeto Pages

1. **Workers & Pages** → seu projeto → **Settings** → **Functions**
2. Em **D1 database bindings**, adicione: variable name `DB` → database `adriana-cms`

> Alternativa: faça commit do `wrangler.toml` atualizado — o Cloudflare pode aplicar o binding automaticamente.

### 6.3 Variáveis de ambiente

Em **Settings** → **Environment variables** (Production):

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `SESSION_SECRET` | string aleatória longa (32+ chars) | Assina cookies de sessão |
| `DEPLOY_HOOK_URL` | URL do Deploy Hook | Rebuild automático ao publicar |
| `SITE_URL` | `https://seusite.com.br` | Usado no build para baixar conteúdo |

Para gerar `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6.4 Criar Deploy Hook

1. **Workers & Pages** → seu projeto → **Settings** → **Deploy Hooks**
2. **Add hook** → nome: `cms-publish` → branch: `main`
3. Copie a URL gerada e cole em `DEPLOY_HOOK_URL`

### 6.5 Popular banco (usuário + conteúdo inicial)

```bash
npm run db:seed
```

Isso cria:
- Usuário `adriana` (senha definida no seed — troque após primeiro login)
- Conteúdo inicial copiado de `content/site.json`

### 6.6 Redeploy

Faça um novo deploy (push no Git ou **Retry deployment**). Depois acesse:

- Site: `https://seusite.com.br`
- Painel: `https://seusite.com.br/admin`

Consulte também [MANUAL-ADRIANA.md](MANUAL-ADRIANA.md) — guia para a Adriana usar o painel.

---

## Resumo CMS

| Recurso | Função |
|---------|--------|
| `/admin` | Painel de edição (PWA instalável) |
| `/api/content/published` | Conteúdo público (usado no build) |
| `/api/content/draft` | Rascunho (autenticado) |
| D1 | Rascunho, publicado, versões, login |
| Deploy Hook | Rebuild ao clicar em Publicar |

As imagens ficam em `public/Assets/` e são versionadas junto com o código.
