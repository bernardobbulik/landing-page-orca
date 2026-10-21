# Brandkit — Exotek

Fonte da verdade da marca para a landing page. As cores daqui estão
implementadas em `src/styles/tokens.css`; use sempre os tokens, nunca o hex.

Referência visual: `docs/brand/brandkit-referencia.png` (prancha de logo,
símbolo, variações e ícone). **A paleta dessa prancha NÃO é a oficial**: vale a
paleta abaixo.

## 1. Direção

A Exotek não parece uma assistência técnica: parece **o sistema profissional
que organiza uma assistência técnica**.

- Três ideias: **tecnologia + precisão + fluxo**.
- Visual: industrial moderno + software B2B + eletrônica.
- Conceito: a assistência como uma linha de produção digital:
  balcão → QR → bancada → orçamento → aprovação → reparo → entrega.
- Personalidade: precisão, controle, velocidade.

## 2. Paleta

Cores sólidas, praticamente nenhum efeito.

| Nome              | Hex       | Token (claro)          | Uso                                              |
|-------------------|-----------|------------------------|--------------------------------------------------|
| Exo Blue          | `#2563EB` | `accent`, `focus`      | botão principal, links, estados ativos, destaques |
| Azul de destaque  | `#3B82F6` | `highlight`            | ilustrações, gráficos, detalhes. **Só decorativo** |
| Preto Exotek      | `#09090B` | `fg`, `accent-hover`   | títulos, texto, fundos escuros                   |
| Grafite           | `#18181B` | `surface` (escuro)     | cards em seção escura                            |
| Cinza de interface| `#71717A` | `fg-muted`             | texto secundário, ícones                         |
| Cinza claro       | `#E4E4E7` | `border`               | bordas, divisores                                |
| Off-white         | `#FAFAFA` | `bg`, `on-accent`      | fundo da página                                  |
| Branco            | `#FFFFFF` | `surface`              | cards em seção clara                             |

### Ajustes de acessibilidade (diferem da proposta original)

| Proposta original                          | Problema                     | O que fizemos                          |
|--------------------------------------------|------------------------------|----------------------------------------|
| Hover do botão em `#3B82F6`                | texto claro fica em 3,7:1    | hover escurece para `#09090B` (19:1)   |
| `#71717A` como texto secundário no escuro  | 3,7:1 sobre `#18181B`        | no escuro, `fg-muted` = `#E4E4E7`      |
| `#3B82F6` como texto em fundo claro        | 3,7:1                        | `highlight` nunca é cor de texto       |

Em seção escura (`data-surface="dark"`) os tokens são remapeados: fundo
`#09090B`, cards `#18181B`, texto `#FAFAFA`, destaque `#3B82F6` com texto
`#09090B` no botão.

### Estados da OS

Cores operacionais do produto: não devem dominar a identidade. Na landing,
usar só como indicador (ponto, barra, borda) **ao lado de um rótulo em
texto**, nunca como cor de texto nem como único sinal do estado.

| Estado             | Hex       | Token                    |
|--------------------|-----------|--------------------------|
| Recebido           | `#64748B` | `status-recebido`        |
| Diagnóstico        | `#3B82F6` | `status-diagnostico`     |
| Aguardando cliente | `#F59E0B` | `status-aguardando`      |
| Aprovado           | `#8B5CF6` | `status-aprovado`        |
| Em reparo          | `#2563EB` | `status-reparo`          |
| Testes             | `#06B6D4` | `status-testes`          |
| Pronto             | `#22C55E` | `status-pronto`          |
| Cancelado/Recusado | `#EF4444` | `status-cancelado`       |
| Entregue           | `#18181B` | `status-entregue`        |

## 3. Tipografia

- **Sora**: títulos, números grandes, headings (`font-display`, já aplicado
  em h1–h3).
- **Inter**: todo o resto (`font-sans`, padrão do body).

As duas são servidas localmente (`@fontsource-variable`), sem chamada ao
Google Fonts.

## 4. Logo e símbolo

Arquivos otimizados em `src/assets/brand/` (gerados com `npm run brand:images`
a partir de `docs/brand/originais/`):

| Arquivo                    | O que é                                   |
|----------------------------|-------------------------------------------|
| `logo-{320,640}.{avif,webp}`    | logo horizontal, versão fundo claro  |
| `logo-negativo-{320,640}.{avif,webp}` | logo horizontal, versão fundo escuro ("Exo" em `#FAFAFA`) |
| `simbolo-{256,512}.{avif,webp}` | símbolo isolado                      |
| `public/favicon-32.png`, `public/apple-touch-icon.png` | ícones do site |

- Use o componente `src/components/Logo.jsx`, não importe os arquivos direto.
- Fundo claro: `<Logo />`. Fundo escuro (`data-surface="dark"`):
  `<Logo tone="dark" />`. Nunca use a versão clara no escuro: o "Exo" grafite
  some em `#09090B` (1,7:1).
- A versão negativa é derivada do `logo.png` pelo script (o grafite vira
  `#FAFAFA`; símbolo e "tek" ficam iguais). Se o designer entregar um arquivo
  negativo oficial, substitua em `docs/brand/originais/` e ajuste o script.
- O símbolo é um monograma abstrato E/X: fluxo, conexão, circuito, passagem
  de estado. Não colocar dentro de moldura de celular, engrenagem etc.

## 5. Conceito visual

Evitar os clichês do setor: chave inglesa, engrenagem, chave de fenda,
smartphone dentro do logo, monitor. Eles fazem a Exotek parecer uma pequena
assistência, não uma empresa de software para assistências.

- Sem gradiente, sem glow, sem blur na interface (o logo é exceção).
- Bordas discretas.
- Ícones outline simples.
- Fotografia: bancada, técnicos, aparelhos, eletrônica. Fotos reais da
  operação são [PREENCHER]; não usar banco de imagens genérico como se fosse
  cliente.

## 6. Voz

**Curta, técnica e segura.** Fala como quem conhece o cotidiano da
assistência.

- Evitar: "Revolucione sua assistência técnica com a melhor solução inovadora
  do mercado."
- Preferir: "Sua assistência. Em fluxo." / "Do balcão à bancada."

## 7. Frases aprovadas

| Papel          | Frase                                                          |
|----------------|----------------------------------------------------------------|
| Tagline        | **Tecnologia para quem conserta tecnologia.**                  |
| Headline (Hero)| **Sua assistência. Em fluxo.**                                 |
| Operação       | Do balcão à bancada. Da bancada ao cliente.                    |
| Benefício      | Menos confusão. Mais aparelhos entregues.                      |
| Controle       | Cada aparelho. Cada etapa. Tudo sob controle.                  |
| QR             | Recebeu. Escaneou. Resolveu.                                   |
| Comercial      | Organize sua assistência como uma operação profissional.       |
| Provocativa    | Sua assistência não precisa de mais planilhas.                 |
| Landing        | Todo o fluxo da sua assistência em um só lugar.                |
| Posicionamento | A operação da sua assistência começa aqui.                     |

Hero aplicado em `Hero.jsx` (revisão de UX de vendas: promessa mais específica
sobre o benefício):

> Gestão para assistências técnicas de celulares
> **Sua assistência organizada, do primeiro atendimento até a entrega.**
> Chega de procurar ordens de serviço, perguntar ao técnico sobre um aparelho ou
> perder informações no balcão. Com a Exotek, você acompanha cada etapa em um só
> lugar.
> [Agendar demonstração] · Conhecer o sistema

"Sua assistência. Em fluxo." continua aprovada como frase de apoio.

O botão é sempre **"Agendar demonstração"** (ação única definida no
`CLAUDE.md`). A sugestão original "Começar agora" foi descartada.

## 8. Resumo

| Elemento   | Definição                                     |
|------------|-----------------------------------------------|
| Marca      | Exotek                                        |
| Tagline    | Tecnologia para quem conserta tecnologia.     |
| Headline   | Sua assistência. Em fluxo.                    |
| Primária   | `#2563EB`                                     |
| Preto      | `#09090B`                                     |
| Background | `#FAFAFA`                                     |
| Títulos    | Sora                                          |
| Interface  | Inter                                         |
| Estilo     | técnico, minimalista, B2B                     |
| Símbolo    | monograma abstrato E/X                        |
| Efeitos    | nenhum ou mínimos                             |
| Ícones     | outline simples                               |
