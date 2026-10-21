# Landing page — Exotek

## Produto
Software (SaaS) de controle de ordens de serviço para assistências técnicas
de celulares. Acompanha o aparelho do balcão (entrada, defeito relatado,
orçamento, aprovação) até a bancada (diagnóstico, reparo, teste, retirada).

## Público
Dono da assistência técnica de celulares (decide), gerente de balcão e
técnico (usuários).
Tom: direto, confiante, linguagem do ofício, sem jargão de startup.

## Marca
Brandkit completo em docs/brandkit.md (paleta, tipografia, voz, frases
aprovadas, uso do logo). Leia antes de escrever texto ou mexer em visual.
Tagline: "Tecnologia para quem conserta tecnologia." Fontes: Sora (títulos)
e Inter (texto).

## Ação principal
Botão "Agendar demonstração" (link: https://zoftistemas.app.br). Só uma ação principal na página.

## Stack e estrutura
- Vite + React + Tailwind.
- Um componente por seção em src/sections/ (Hero, Problema, Jornada,
  Recursos, Resultados, Precos, Faq, CtaFinal).
- Estilos globais e tokens em src/styles/tokens.css. NÃO criar cores novas:
  usar apenas as variáveis de tokens.css.

## Regras de qualidade
- Mobile first; testar 360, 768 e 1280 px.
- Contraste mínimo 4,5:1; foco visível; HTML semântico (header, main,
  section, h1 único); alt em toda imagem.
- Respeitar prefers-reduced-motion.
- Imagens otimizadas (WebP/AVIF), lazy-load abaixo da dobra.
- Nenhum dado inventado: depoimentos, logos e números reais são marcados
  como [PREENCHER] no texto.

## Como trabalhar
- Edite SOMENTE os arquivos da sua seção. Se precisar mudar algo
  compartilhado (tokens, layout, App), pergunte ao coordenador.
- Ao terminar: rode o build e o lint, faça commit na sua branch e
  reporte o resultado ao coordenador.

---

## Referência rápida do esqueleto

### Comandos
- `npm run dev` — servidor local
- `npm run build` — build de produção (precisa passar antes do commit)
- `npm run lint` — ESLint (precisa passar sem erros antes do commit)

### Arquivos compartilhados (não editar sem falar com o coordenador)
- `src/styles/tokens.css` — Tailwind, tokens de cor/tipografia/espaço e estilos globais.
- `src/App.jsx` — header, ordem das seções, footer.
- `src/config.js` — URL e texto da ação principal.
- `src/components/CtaButton.jsx` — o único botão de ação principal. Use ele;
  não crie outro link/botão de conversão.
- `src/components/Logo.jsx` — logo. Em seção escura use `<Logo tone="dark" />`.
- `src/assets/brand/`, `docs/brand/`, `scripts/optimize-brand.mjs` — arquivos de marca.

### Cores (utilitários Tailwind gerados a partir dos tokens)
As cores padrão do Tailwind estão desligadas: `bg-red-500`, `text-white` etc.
não existem. Use somente:

| Token            | Uso                               | Ex. de classe        |
|------------------|-----------------------------------|----------------------|
| `bg`             | fundo da página/seção             | `bg-bg`              |
| `surface`        | cartões, blocos elevados          | `bg-surface`         |
| `fg`             | texto principal                   | `text-fg`            |
| `fg-muted`       | texto secundário (ainda ≥ 4,5:1)  | `text-fg-muted`      |
| `border`         | linhas e bordas (decorativo)      | `border-border`      |
| `accent`         | botão principal, links, destaques | `bg-accent`          |
| `accent-hover`   | hover do botão principal          | `hover:bg-accent-hover` |
| `on-accent`      | texto sobre `accent`              | `text-on-accent`     |
| `highlight`      | detalhe decorativo, NUNCA texto   | `bg-highlight`       |
| `focus`          | anel de foco (já aplicado global) | —                    |
| `status-*`       | estados da OS: só indicador ao lado de rótulo em texto, NUNCA cor de texto | `bg-status-pronto` |

Fontes: `font-display` (Sora, já aplicada em h1–h3) e `font-sans` (Inter, padrão).

Seção escura: coloque `data-surface="dark"` no `<section>`. Os mesmos tokens
são remapeados para o tema escuro com contraste verificado — não troque classes.

### Convenções de seção
- Cada seção é um `<section id="..." aria-labelledby="...-titulo">` com um `<h2>`.
  Só o Hero tem `<h1>`.
- Conteúdo dentro de `<div className="container-page">` (largura e gutter padrão).
- Imagens: arquivos em `src/assets/<secao>/`, formato WebP/AVIF, sempre com
  `width`, `height` e `alt`. Abaixo da dobra: `loading="lazy" decoding="async"`.
- Animações: só `transform`/`opacity`, e nada que não seja desligado por
  `prefers-reduced-motion` (o reset global já zera durações).
