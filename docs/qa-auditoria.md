# Auditoria de QA — página integrada

Data: 21/10/2026 · Branch: `bernardobbulik/lp-qa-e-ajustes` · Base: `94f75bd`

Como foi feito: build de produção (`vite preview`) aberto no Edge headless em
360×760, 768×1024, 1280×800, 1280×1080 e 1600×900. Contraste calculado texto a
texto com as cores computadas, ordem de tabulação percorrida com Tab, CLS
medido com `PerformanceObserver` rolando a página inteira, peso real de rede
lido em `performance.getEntriesByType('resource')`.

Severidade: **Crítica** (quebra acessibilidade ou conversão) · **Alta** ·
**Média** · **Baixa** · **Info**.

## Resumo

| Área             | Resultado |
|------------------|-----------|
| Contraste        | 1 falha crítica (CTA final), **corrigida**. Depois da correção: 0 falhas em 360 e 1280 px. |
| Foco             | Visível em todos os elementos interativos (3px `focus`). |
| Ordem de Tab     | Lógica e completa: pular conteúdo → header → Hero → Jornada → Preços → FAQ → CTA final. |
| Landmarks / h1   | `header`, `main#conteudo`, `footer`; um único `h1`; toda `section` com `aria-labelledby` válido; sem ids duplicados nem referências ARIA quebradas. |
| Alt              | Única `<img>` (logo) com `alt`, `width` e `height`. |
| Overflow lateral | Nenhum em 360, 768 e 1280 px. |
| Peso             | ~180 KB transferidos: JS 82 KB, CSS 8 KB, Inter latin 47 KB, Sora latin 33 KB, logo AVIF 6 KB. LCP (h1) 276 ms. |
| CLS              | 360 px: 0,001 · 1280 px: 0,004 · **768 px: 0,135** (Jornada, ver J-1). |
| Tokens           | Nenhuma cor fora de `tokens.css` nas seções. |

## Corrigido nesta branch (arquivos compartilhados, baixo risco)

| # | Sev. | Arquivo:linha | Problema | Correção |
|---|------|---------------|----------|----------|
| G-1 | Crítica | `src/styles/tokens.css:133` | `[data-surface]` usava `var(--color-bg)`/`var(--color-fg)`, que o Tailwind resolve no `:root`. Resultado: a seção escura do CTA final saía com fundo **claro** (#FAFAFA) e o texto `fg-muted` remapeado (#E4E4E7) ficava com **1,22:1**, praticamente invisível. | Regra base passa a usar `--exo-bg`/`--exo-fg`, que são de fato remapeadas pelo `data-surface`. CTA final volta a ser escuro como projetado. |
| G-2 | Baixa | `src/styles/tokens.css:161` | Mesmo mecanismo no `:focus-visible`: em seção escura o anel ficava #2563EB (3,9:1) em vez do `focus` escuro #3B82F6. | `outline` usa `--exo-focus`. |
| G-3 | Baixa | `src/App.jsx:22` | Header com `backdrop-blur` e fundo 95%: o brandkit proíbe blur na interface (§5). | Fundo sólido `bg-bg`, sem blur. |
| G-4 | Média (UX) | `src/styles/tokens.css:85-88, 101, 171` | Página "desconectada": 192 px de vazio entre seções no desktop (128 px no celular), todas no mesmo fundo, e conteúdo limitado a 1088 px. | Ver "Ritmo e largura" abaixo. |

### Ritmo e largura (G-4)

- `--spacing-section` 4rem → **3rem** e `--spacing-section-lg` 6rem → **4,5rem**:
  vão entre seções de 128 → 96 px (celular) e 192 → 144 px (desktop).
- `--container-page` 72rem → **80rem**, com gutter de 2,5rem a partir de `lg`:
  conteúdo de 1088 → 1200 px em 1280 px (margem lateral de 96 → 40 px).
- Faixas alternadas: seções claras de posição par ganham fundo `surface` e
  borda `border` de ponta a ponta. Como usa `nth-of-type`, a alternância se
  ajusta sozinha quando Resultados some no build de produção. Seções com
  `data-surface` mantêm o próprio fundo.
- Resultado: página 2% mais curta no celular (9.981 → 9.763 px) e 4% no
  desktop (7.241 → 6.943 px), com as seções visualmente encadeadas.

## Devolvido aos donos das seções

### Jornada (`src/sections/Jornada.jsx`)

| # | Sev. | Linha | Problema | Sugestão |
|---|------|-------|----------|----------|
| J-1 | Alta | 434 | Em 768 px o modo fixado está ativo e a caixa presa usa `justify-center`. Como a altura do painel muda a cada etapa, o conteúdo recentraliza e gera **CLS 0,13** (acima do limite de 0,1 do Core Web Vitals). | Usar `justify-start`, ou dar ao painel a altura da maior etapa (pilha em grid, como Recursos já faz). |
| J-2 | Média | 342-358 | A roda do mouse é interceptada (`preventDefault`) enquanto a seção está presa. Trackpad e usuários de roda rápida sentem a página "travar"; é o padrão de scroll-jacking que mais gera abandono. | Avaliar com o coordenador se o travamento compensa; no mínimo, liberar a rolagem depois de um tempo parado na etapa. |
| J-3 | Baixa | 299-313 | `fixado` é decidido em `useEffect`, depois da primeira pintura: a seção é pintada com `section-y` e sem trilho e depois muda de altura. Hoje cai abaixo da dobra, mas em telas baixas e largas entraria no CLS. | `useLayoutEffect` para a primeira medição. |
| J-4 | Baixa | 434 | No modo fixado, `min-h-[calc(100svh-4rem)]` + centralização deixa até ~100 px de vazio acima do título ao entrar na seção (é parte do "espaço em branco" percebido). | Mesma correção de J-1. |

### Problema (`src/sections/Problema.jsx`) e Recursos (`src/sections/Recursos.jsx`)

| # | Sev. | Arquivo:linha | Problema | Sugestão |
|---|------|---------------|----------|----------|
| P-1 | Baixa | `Problema.jsx:62` | Cartões com `cursor-pointer` e elevação no hover, mas não são clicáveis: promessa falsa de interação. | Tirar `cursor-pointer` (manter o hover se quiser). |
| R-1 | Baixa | `Recursos.jsx:581` | Mesmo caso: `cursor-pointer` em `<li>` sem ação. | Tirar `cursor-pointer`. |
| R-2 | Baixa | `Recursos.jsx:259` | `text-[11px]` nos nomes das colunas do kanban no celular: abaixo do mínimo de 12 px do resto da página. | `text-xs`. |
| R-3 | Baixa | `Recursos.jsx:169, 191, 199, 226, 488` | `rounded-sm`/`rounded-md` em vez dos raios do tema (`rounded-card`, `rounded-button`). | Trocar pelos tokens ou registrar como exceção. |
| R-4 | Info | `Recursos.jsx:590` | Nos cartões largos o `mt-auto` empurra o detalhe para baixo e deixa um vão grande entre texto e ilustração em 1280 px. | Alinhar o detalhe ao topo ou equilibrar a altura dos cartões vizinhos. |

### Preços (`src/sections/Precos.jsx`)

| # | Sev. | Linha | Problema | Sugestão |
|---|------|-------|----------|----------|
| PR-1 | Baixa | 68, 102 | Três botões "Agendar demonstração" iguais na lista de links do leitor de tela, sem dizer de qual plano são. O `h3` já tem `id={`${id}-nome`}`, mas nada o referencia. | Ligar o botão ao nome do plano com `aria-describedby`; precisa que `CtaButton` repasse props (mudança compartilhada, falar com o coordenador). |

### CTA final (`src/sections/CtaFinal.jsx`)

| # | Sev. | Linha | Problema | Sugestão |
|---|------|-------|----------|----------|
| C-1 | Info | 10 | Texto de apoio ainda `[PREENCHER]`. Com G-1 corrigido ele passou a aparecer de verdade (antes estava invisível). | Preencher com o texto aprovado. |

### Resultados (`src/sections/Resultados.jsx`)

| # | Sev. | Linha | Problema | Sugestão |
|---|------|-------|----------|----------|
| RS-1 | Info | 305 | No build de produção a seção não aparece, porque `content/resultados.json` ainda não tem dados reais. A página vai ao ar sem prova social. | Preencher `content/resultados.json`. |

## Pendente no compartilhado (não alterei, médio risco)

| # | Sev. | Arquivo | Problema | Sugestão |
|---|------|---------|----------|----------|
| G-5 | Baixa | `index.html` | Fontes sem `preload`: a Sora do h1 (o LCP) só é descoberta depois do CSS. Em 768 px o CLS de carga do Hero é 0,035, a maior parte vinda da troca de fonte. | Pré-carregar `sora-latin-wght-normal` e `inter-latin-wght-normal` (precisa importar a URL com hash via Vite). |
