# Landing Page - Adriana Barbosa

Landing page em Next.js + Tailwind para os cursos **Oficina da Calça Jeans** e **Pilotando Tudo**, com identidade azul marinho e dourado/bege.

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Imagens

Coloque as imagens em `public/Assets/`:

- `public/Assets/logo.png` — logo do header
- `public/Assets/Adriana/A1.jpeg` — foto Hero e cards
- `public/Assets/Adriana/A2.jpeg` — foto Autoridade e cards

Se você tinha uma pasta `Assets` na raiz, copie o conteúdo para `public/Assets/`.

## Stack

- Next.js 14 (App Router, export estático)
- React 18
- Tailwind CSS
- lucide-react
- TypeScript
- Cloudflare Pages Functions + D1 (CMS)

## Painel de administração (CMS)

Acesse `/admin` para editar textos, links, a ordem/visibilidade das seções e o tema de cores do site. As imagens não são editadas pelo painel: ficam em `public/Assets/` e são trocadas direto no projeto.

### Temas

As cores vêm de variáveis CSS declaradas em `app/globals.css` (`:root` e `[data-theme="..."]`) e são expostas ao Tailwind em `tailwind.config.ts` como `navy`, `gold`, `cream`, `cta`, `action` e `check`. O tema escolhido fica em `tema` no conteúdo e é aplicado em `<html data-theme="...">`. Para adicionar um tema novo, crie o bloco de variáveis no CSS e registre o id em `lib/theme.ts`.

- Login inicial: usuário `adriana` (senha configurada no seed do banco)
- Guia completo: [MANUAL-ADRIANA.md](MANUAL-ADRIANA.md)
- Configuração no Cloudflare: [DEPLOY.md](DEPLOY.md) seção 6

## Contato / WhatsApp

Integração WhatsApp: **11 96061-4120** (link `https://wa.me/5511960614120`).
