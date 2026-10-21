import { useEffect, useRef, useState } from 'react'

// Os detalhes visuais são interfaces de exemplo: números de OS, aparelhos, nomes,
// datas e quantidades são ilustrativos, não dados de clientes reais.

function Icone({ children, className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

const IconeLink = ({ className }) => (
  <Icone className={className}>
    <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
    <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
  </Icone>
)

const IconeChecklist = () => (
  <Icone>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <rect x="9" y="2.5" width="6" height="3" rx="1" />
    <path d="m9 13 2 2 4-4" />
  </Icone>
)

const IconeKanban = () => (
  <Icone>
    <rect x="3" y="4" width="5" height="12" rx="1" />
    <rect x="9.5" y="4" width="5" height="16" rx="1" />
    <rect x="16" y="4" width="5" height="8" rx="1" />
  </Icone>
)

const IconeCaixa = () => (
  <Icone>
    <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
    <path d="m3 8 9 5 9-5M12 13v8" />
  </Icone>
)

const IconeGarantia = ({ className }) => (
  <Icone className={className}>
    <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </Icone>
)

const IconeAviso = () => (
  <Icone>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icone>
)

// Relógio de um cartão: conta passos enquanto `ativo` (cartão na tela e sem hover).
// Desligado com prefers-reduced-motion (volta ao passo 0) e com a aba oculta.
function useRelogio(intervaloMs, ativo) {
  const [passo, setPasso] = useState(0)

  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer

    const sincronizar = () => {
      clearInterval(timer)
      if (ativo && !reduzir.matches && !document.hidden) {
        timer = setInterval(() => setPasso((p) => p + 1), intervaloMs)
      }
    }
    const aoMudarMovimento = () => {
      if (reduzir.matches) setPasso(0)
      sincronizar()
    }

    sincronizar()
    reduzir.addEventListener('change', aoMudarMovimento)
    document.addEventListener('visibilitychange', sincronizar)
    return () => {
      clearInterval(timer)
      reduzir.removeEventListener('change', aoMudarMovimento)
      document.removeEventListener('visibilitychange', sincronizar)
    }
  }, [intervaloMs, ativo])

  return passo
}

// O relógio só anda com o cartão visível: a primeira troca acontece diante do visitante.
function useNaTela(ref) {
  const [naTela, setNaTela] = useState(false)

  useEffect(() => {
    const observador = new IntersectionObserver(([entrada]) => setNaTela(entrada.isIntersecting), {
      threshold: 0.5,
    })
    observador.observe(ref.current)
    return () => observador.disconnect()
  }, [ref])

  return naTela
}

// Todas as variantes empilhadas na mesma célula do grid; só a atual aparece. O bloco tem
// o tamanho da maior (nada pula) e a troca é um crossfade lento, só de opacidade.
const variante = 'col-start-1 row-start-1 min-w-0 transition-opacity duration-700 ease-in-out'

function Alterna({ valores, atual, className = '', children = (v) => v }) {
  return (
    <span className={`grid ${className}`}>
      {[...new Set(valores)].map((v) => (
        <span key={v} className={`${variante} ${v === atual ? 'opacity-100' : 'opacity-0'}`}>
          {children(v)}
        </span>
      ))}
    </span>
  )
}

const painel = 'rounded-card border border-border bg-bg p-3 sm:p-4'
const suave = 'duration-700 ease-in-out'

const itensEntrada = ['Liga e carrega', 'Tela', 'Câmeras', 'Carcaça']
// Observações na ordem de itensEntrada.
const aparelhosEntrada = [
  { numero: '1043', modelo: 'Galaxy S22', obs: ['Ok', 'Trinca no canto superior', 'Ok', 'Riscos na lateral'] },
  { numero: '1044', modelo: 'iPhone 12', obs: ['Ok', 'Ok', 'Lente traseira trincada', 'Amassado na quina'] },
]
const PENDENTE = 'a verificar'

// Ciclo de 10 passos, 5 por aparelho: de 0 a 4 itens conferidos, um por passo.
// O passo 0 é o primeiro aparelho já conferido.
function DetalheChecklist({ passo }) {
  const s = (passo + 4) % 10
  const atual = Math.floor(s / 5)
  const feitos = s % 5
  const aparelhos = aparelhosEntrada.map((_, i) => i)

  return (
    <div
      role="img"
      aria-label="Exemplo de checklist de entrada: o balcão confere item por item do aparelho, com observações e fotos."
      className={painel}
    >
      <div className="flex items-center justify-between gap-2 text-xs text-fg-muted">
        <Alterna valores={aparelhos} atual={atual} className="font-mono font-semibold text-fg">
          {(i) => `OS #${aparelhosEntrada[i].numero}`}
        </Alterna>
        <Alterna valores={aparelhos} atual={atual} className="justify-items-end text-right">
          {(i) => `Entrada · ${aparelhosEntrada[i].modelo}`}
        </Alterna>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {itensEntrada.map((item, i) => {
          const feito = i < feitos
          return (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-sm border border-border bg-surface text-accent">
                <Icone className={`size-3 transition-opacity ${suave} ${feito ? 'opacity-100' : 'opacity-0'}`}>
                  <path d="m5 12 5 5 9-10" />
                </Icone>
              </span>
              <span className="flex min-w-0 gap-1">
                <span className="shrink-0 font-medium">{item}</span>
                <span className="text-fg-muted">·</span>
                <Alterna
                  valores={[PENDENTE, ...aparelhosEntrada.map((a) => a.obs[i])]}
                  atual={feito ? aparelhosEntrada[atual].obs[i] : PENDENTE}
                  className="text-fg-muted"
                />
              </span>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className="grid aspect-square place-items-center rounded-md border border-border bg-surface text-fg-muted"
          >
            <Icone className="size-4">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="12" cy="12" r="3.5" />
            </Icone>
          </span>
        ))}
        <span className="grid aspect-square place-items-center rounded-md border border-border bg-surface text-xs font-medium text-fg-muted">
          +3
        </span>
      </div>
    </div>
  )
}

// Cor da etapa só na barra; o nome da etapa é sempre texto em fg.
const colunasBancada = [
  { etapa: 'Diagnóstico', barra: 'bg-status-diagnostico', fixa: ['1047', 'iPhone 11'] },
  { etapa: 'Em reparo', barra: 'bg-status-reparo', fixa: ['1041', 'Galaxy A54'] },
  { etapa: 'Testes', barra: 'bg-status-testes', fixa: ['1040', 'Moto G84'] },
]
// Uma OS por vez anda pela bancada, uma coluna por passo, na segunda vaga de cada coluna.
// Ao sair dos testes, a próxima entra no diagnóstico.
const ordensEmFluxo = { 1045: 'Moto G54', 1048: 'Redmi 13C', 1050: 'iPhone 12' }
const numerosEmFluxo = Object.keys(ordensEmFluxo)
const VAGA_LIVRE = 'livre'

const tecnicos = [
  { nome: 'Bruno', total: 4, ativo: true },
  { nome: 'Lia', total: 3, ativo: false },
]

function CartaoOs({ numero, aparelho }) {
  return (
    <span className="block rounded-md border border-border bg-surface px-2 py-1.5 text-xs">
      <span className="block font-mono font-semibold">#{numero}</span>
      <span className="block truncate text-fg-muted">{aparelho}</span>
    </span>
  )
}

function DetalheKanban({ passo }) {
  const emFluxo = numerosEmFluxo[Math.floor(passo / colunasBancada.length) % numerosEmFluxo.length]
  const colunaAtual = passo % colunasBancada.length

  return (
    <div
      role="img"
      aria-label="Exemplo do kanban da bancada: ordens de serviço do técnico selecionado avançando por diagnóstico, reparo e testes."
      className={painel}
    >
      <div className="flex flex-wrap gap-2">
        {tecnicos.map(({ nome, total, ativo }) => (
          <span
            key={nome}
            className={`rounded-full border bg-surface px-2.5 py-1 text-xs ${
              ativo ? 'border-accent font-semibold text-fg' : 'border-border font-medium text-fg-muted'
            }`}
          >
            {nome} · {total}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {colunasBancada.map(({ etapa, barra, fixa: [numero, aparelho] }, coluna) => (
          <div key={etapa} className="min-w-0">
            <span className={`block h-1 rounded-full ${barra}`} />
            <p className="mt-1.5 text-[11px] font-medium sm:text-xs">{etapa}</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                <CartaoOs numero={numero} aparelho={aparelho} />
              </li>
              <li>
                <Alterna
                  valores={[VAGA_LIVRE, ...numerosEmFluxo]}
                  atual={coluna === colunaAtual ? emFluxo : VAGA_LIVRE}
                >
                  {(n) => n !== VAGA_LIVRE && <CartaoOs numero={n} aparelho={ordensEmFluxo[n]} />}
                </Alterna>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// Cor da etapa só no ponto; o nome da etapa é sempre texto em fg.
const etapasCliente = [
  { rotulo: 'Recebido', ponto: 'bg-status-recebido' },
  { rotulo: 'Diagnóstico', ponto: 'bg-status-diagnostico' },
  { rotulo: 'Aprovado', ponto: 'bg-status-aprovado' },
  { rotulo: 'Em reparo', ponto: 'bg-status-reparo' },
  { rotulo: 'Testes', ponto: 'bg-status-testes' },
  { rotulo: 'Pronto', ponto: 'bg-status-pronto' },
]
const ordensCliente = [
  { numero: '1042', aparelho: 'iPhone 13', servico: 'Troca de tela' },
  { numero: '1046', aparelho: 'Galaxy A15', servico: 'Troca de conector' },
]

// Ciclo de 12 passos: cada OS percorre as 6 etapas, uma por passo. O passo 0 é a
// primeira OS em reparo.
function DetalheStatus({ passo }) {
  const s = (passo + 3) % (ordensCliente.length * etapasCliente.length)
  const ordem = Math.floor(s / etapasCliente.length)
  const etapaAtual = s % etapasCliente.length

  return (
    <div
      role="img"
      aria-label="Exemplo da página de acompanhamento do cliente: a OS avança etapa por etapa, de recebido até pronto."
      className={painel}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 font-medium">
          <IconeLink className="size-3.5 text-accent" />
          Link de acompanhamento
        </span>
        <span className="text-fg-muted">Atualizado agora</span>
      </div>
      <Alterna valores={ordensCliente.map((_, i) => i)} atual={ordem} className="mt-4 text-sm">
        {(i) => (
          <>
            <span className="font-mono font-semibold">OS #{ordensCliente[i].numero}</span>
            <span className="text-fg-muted">
              {' '}
              · {ordensCliente[i].aparelho} · {ordensCliente[i].servico}
            </span>
          </>
        )}
      </Alterna>
      <Alterna
        valores={etapasCliente.map((_, i) => i)}
        atual={etapaAtual}
        className="mt-1 font-display text-lg font-semibold"
      >
        {(i) => (
          <span className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span
                className={`absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping ${etapasCliente[i].ponto}`}
              />
              <span className={`relative inline-flex size-2.5 rounded-full ${etapasCliente[i].ponto}`} />
            </span>
            {etapasCliente[i].rotulo}
            <span className="font-sans text-xs font-normal text-fg-muted">
              Etapa {i + 1} de {etapasCliente.length}
            </span>
          </span>
        )}
      </Alterna>
      <ol className="mt-4 grid grid-cols-6 gap-1.5">
        {etapasCliente.map(({ rotulo }, i) => (
          <li key={rotulo}>
            <span className="block h-1.5 rounded-full bg-border">
              <span
                className={`block h-full rounded-full bg-accent transition-opacity ${suave} ${
                  i <= etapaAtual ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </span>
            <span className="mt-2 hidden text-xs lg:block">
              <Alterna valores={['atual', 'outra']} atual={i === etapaAtual ? 'atual' : 'outra'}>
                {(v) => <span className={v === 'atual' ? 'font-semibold text-fg' : 'text-fg-muted'}>{rotulo}</span>}
              </Alterna>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Fila de avisos enviados, em ordem: o de baixo é o mais novo. A cada passo chega o
// próximo e o anterior sobe. A jornada de uma OS emenda na da seguinte.
const mensagens = [
  { texto: 'Olá, Ana! Recebemos seu iPhone 13 na OS #1042.', hora: '09:15' },
  { texto: 'Ana, o orçamento da OS #1042 está pronto para sua aprovação.', hora: '10:42' },
  { texto: 'Orçamento aprovado. O reparo do seu iPhone 13 começou.', hora: '11:20' },
  { texto: 'Seu iPhone 13 está pronto para retirada.', hora: '16:05' },
  { texto: 'Olá, Diego! Recebemos seu Galaxy A15 na OS #1046.', hora: '16:30' },
  { texto: 'Diego, o orçamento da OS #1046 está pronto para aprovação.', hora: '17:10' },
  { texto: 'Orçamento aprovado. O reparo do seu Galaxy A15 começou.', hora: '17:45' },
  { texto: 'Seu Galaxy A15 está pronto para retirada.', hora: '18:20' },
]
const indicesMensagens = mensagens.map((_, i) => i)

function DetalheAviso({ passo }) {
  return (
    <div
      role="img"
      aria-label="Exemplo de avisos automáticos enviados ao cliente a cada etapa: aparelho recebido, orçamento pronto, reparo iniciado e pronto para retirada."
      className={painel}
    >
      <p className="text-xs text-fg-muted">Enviado automaticamente · canal de avisos</p>
      <ul className="mt-3 space-y-2">
        {[0, 1].map((vaga) => (
          <li key={vaga} className="rounded-card rounded-tl-sm border border-border bg-surface px-3 py-2 text-sm">
            <Alterna valores={indicesMensagens} atual={(passo + vaga) % mensagens.length}>
              {(i) => (
                <span className="flex h-full flex-col">
                  {mensagens[i].texto}
                  <span className="mt-auto block pt-1 text-right text-xs text-fg-muted">{mensagens[i].hora}</span>
                </span>
              )}
            </Alterna>
          </li>
        ))}
      </ul>
    </div>
  )
}

const pecas = ['Tela iPhone 13', 'Bateria Galaxy A54', 'Conector USB-C']
const ESTOQUE_CHEIO = 12
// Quantidades na ordem de pecas, uma linha por passo. De um passo para o seguinte só
// uma peça muda (saiu para a bancada ou chegou reposição), e a última volta à primeira.
const estoque = [
  [4, 1, 12],
  [3, 1, 12],
  [3, 1, 11],
  [3, 0, 11],
  [3, 0, 10],
  [3, 2, 10],
  [4, 2, 10],
  [4, 2, 12],
]

function DetalhePecas({ passo }) {
  const atual = estoque[passo % estoque.length]

  return (
    <div
      role="img"
      aria-label="Exemplo do controle de estoque: a quantidade de cada peça na prateleira atualiza conforme sai para a bancada ou chega reposição."
      className={painel}
    >
      <div className="flex justify-between text-xs text-fg-muted">
        <span>Peça</span>
        <span>Em estoque</span>
      </div>
      <ul className="mt-3 space-y-3 text-sm">
        {pecas.map((peca, i) => (
          <li key={peca}>
            <span className="flex justify-between gap-2">
              <span className="font-medium">{peca}</span>
              <Alterna
                valores={estoque.map((linha) => linha[i])}
                atual={atual[i]}
                className="justify-items-end font-mono"
              >
                {(qtd) => `${qtd} un.`}
              </Alterna>
            </span>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-border">
              <span
                className={`block h-full origin-left rounded-full bg-highlight transition-transform ${suave}`}
                style={{ transform: `scaleX(${atual[i] / ESTOQUE_CHEIO})` }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const historico = [
  { numero: '1042', data: '21/10/2026', servico: 'Troca de tela', garantia: 'Em garantia até 19/01/2027', ativa: true },
  { numero: '0877', data: '03/04/2026', servico: 'Troca de bateria', garantia: 'Garantia encerrada', ativa: false },
  { numero: '0512', data: '15/08/2025', servico: 'Conector de carga', garantia: 'Garantia encerrada', ativa: false },
]

// A cada passo o destaque desce para a OS seguinte, como quem lê o histórico no balcão.
function DetalheHistorico({ passo }) {
  const emFoco = passo % historico.length

  return (
    <div
      role="img"
      aria-label="Exemplo do histórico de um iPhone 13: três reparos anteriores, o mais recente ainda em garantia."
      className={painel}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
        <span className="font-medium">iPhone 13 · Ana P.</span>
        <span className="text-xs text-fg-muted">{historico.length} ordens de serviço</span>
      </div>
      <ol className="mt-4 space-y-3 border-l border-border pl-4">
        {historico.map(({ numero, data, servico, garantia, ativa }, i) => (
          <li
            key={numero}
            className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm"
          >
            <span
              className={`absolute -inset-x-2 -inset-y-1.5 rounded-md bg-surface transition-opacity ${suave} ${
                i === emFoco ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <span
              className={`absolute top-1.5 -left-[21px] size-2.5 rounded-full border-2 border-bg transition-transform ${suave} ${
                ativa ? 'bg-accent' : 'bg-fg-muted'
              } ${i === emFoco ? 'scale-125' : ''}`}
            />
            <span className="relative">
              <span className="block text-xs text-fg-muted">{data}</span>
              <span className="font-mono font-semibold">#{numero}</span> · {servico}
            </span>
            <span
              className={`relative inline-flex items-center gap-1.5 text-xs ${
                ativa ? 'font-semibold text-fg' : 'text-fg-muted'
              }`}
            >
              {ativa && <IconeGarantia className="size-4 text-accent" />}
              {garantia}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Ordem segue o fluxo da assistência: balcão → bancada → cliente → pós-venda.
// No desktop, os cartões largos alternam de lado para formar a grade bento.
// Cada cartão tem seu relógio; intervalos sem múltiplo comum curto, para as trocas
// não coincidirem.
const recursos = [
  {
    titulo: 'Checklist de entrada com fotos',
    texto: 'Registre o estado do aparelho no balcão, com fotos, antes de abrir. Evita discussão na retirada.',
    icone: <IconeChecklist />,
    Detalhe: DetalheChecklist,
    intervalo: 4300,
  },
  {
    titulo: 'Kanban da bancada por técnico',
    texto: 'As OS da bancada em colunas por etapa, separadas por técnico. Cada técnico sabe o que pegar em seguida.',
    icone: <IconeKanban />,
    Detalhe: DetalheKanban,
    intervalo: 5900,
    largo: true,
  },
  {
    titulo: 'Status em tempo real',
    texto: 'O cliente recebe um link e acompanha o aparelho sozinho. Menos ligação perguntando se já ficou pronto.',
    icone: <IconeLink />,
    Detalhe: DetalheStatus,
    intervalo: 5100,
    largo: true,
  },
  {
    titulo: 'Aviso automático ao cliente',
    texto: 'O cliente recebe aviso automático do andamento da OS, sem ninguém parar a bancada para ligar.',
    icone: <IconeAviso />,
    Detalhe: DetalheAviso,
    intervalo: 6700,
  },
  {
    titulo: 'Peças e estoque sob controle',
    texto: 'Saiba quantas peças tem na prateleira antes de passar prazo ao cliente.',
    icone: <IconeCaixa />,
    Detalhe: DetalhePecas,
    intervalo: 4700,
  },
  {
    titulo: 'Histórico e garantia por aparelho',
    texto: 'Cada aparelho guarda seus reparos anteriores e o prazo de garantia. Voltou? Você sabe o que já foi feito.',
    icone: <IconeGarantia />,
    Detalhe: DetalheHistorico,
    intervalo: 5500,
    largo: true,
  },
]

// Hover com mouse pausa o relógio do cartão; toque não conta, senão o cartão ficaria
// parado até tocar em outro lugar.
function CartaoRecurso({ titulo, texto, icone, Detalhe, intervalo, largo }) {
  const ref = useRef(null)
  const [emHover, setEmHover] = useState(false)
  const naTela = useNaTela(ref)
  const passo = useRelogio(intervalo, naTela && !emHover)

  return (
    <li
      ref={ref}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setEmHover(true)}
      onPointerLeave={() => setEmHover(false)}
      className={`flex cursor-pointer flex-col rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent md:p-6 ${
        largo ? 'lg:col-span-2' : ''
      }`}
    >
      <span className="grid size-10 place-items-center rounded-button border border-border bg-bg text-accent">
        {icone}
      </span>
      <h3 className="mt-4 text-lg font-semibold">{titulo}</h3>
      <p className="mt-2 text-fg-muted">{texto}</p>
      <div className="mt-auto pt-6">
        <Detalhe passo={passo} />
      </div>
    </li>
  )
}

export default function Recursos() {
  return (
    <section id="recursos" aria-labelledby="recursos-titulo" className="section-y">
      <div className="container-page">
        <h2 id="recursos-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
          O que a Exotek faz pela sua assistência.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">Cada aparelho. Cada etapa. Tudo sob controle.</p>

        <ul role="list" className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {recursos.map((recurso) => (
            <CartaoRecurso key={recurso.titulo} {...recurso} />
          ))}
        </ul>
      </div>
    </section>
  )
}
