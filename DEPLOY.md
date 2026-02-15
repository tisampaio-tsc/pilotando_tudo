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
6. Clique em **Save and Deploy**.

Após o primeiro deploy, o site ficará em um endereço como:  
`https://nome-do-projeto.pages.dev`.

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
