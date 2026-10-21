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

const painel = 'rounded-card border border-border bg-bg p-3 sm:p-4'

const itensEntrada = [
  { item: 'Liga e carrega', obs: 'Ok' },
  { item: 'Tela', obs: 'Trinca no canto superior' },
  { item: 'Câmeras', obs: 'Ok' },
  { item: 'Carcaça', obs: 'Riscos na lateral' },
]

function DetalheChecklist() {
  return (
    <div
      role="img"
      aria-label="Exemplo de checklist de entrada: itens verificados no balcão, observações e fotos do aparelho."
      className={painel}
    >
      <div className="flex items-center justify-between gap-2 text-xs text-fg-muted">
        <span className="font-mono font-semibold text-fg">OS #1043</span>
        <span>Entrada · Galaxy S22</span>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {itensEntrada.map(({ item, obs }) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-sm border border-border bg-surface text-accent">
              <Icone className="size-3">
                <path d="m5 12 5 5 9-10" />
              </Icone>
            </span>
            <span>
              <span className="font-medium">{item}</span>
              <span className="text-fg-muted"> · {obs}</span>
            </span>
          </li>
        ))}
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
  { etapa: 'Diagnóstico', barra: 'bg-status-diagnostico', ordens: [['1047', 'iPhone 11'], ['1045', 'Moto G54']] },
  { etapa: 'Em reparo', barra: 'bg-status-reparo', ordens: [['1041', 'Galaxy A54']] },
  { etapa: 'Testes', barra: 'bg-status-testes', ordens: [['1040', 'Moto G84'], ['1038', 'iPhone 12']] },
]

const tecnicos = [
  { nome: 'Bruno', total: 5, ativo: true },
  { nome: 'Lia', total: 3, ativo: false },
]

function DetalheKanban() {
  return (
    <div
      role="img"
      aria-label="Exemplo do kanban da bancada: ordens de serviço do técnico selecionado em colunas de diagnóstico, reparo e testes."
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
        {colunasBancada.map(({ etapa, barra, ordens }) => (
          <div key={etapa} className="min-w-0">
            <span className={`block h-1 rounded-full ${barra}`} />
            <p className="mt-1.5 text-[11px] font-medium sm:text-xs">{etapa}</p>
            <ul className="mt-2 space-y-1.5">
              {ordens.map(([numero, aparelho]) => (
                <li key={numero} className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs">
                  <span className="block font-mono font-semibold">#{numero}</span>
                  <span className="block truncate text-fg-muted">{aparelho}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const etapasCliente = ['Recebido', 'Diagnóstico', 'Aprovado', 'Em reparo', 'Testes', 'Pronto']
const etapaAtual = 3

function DetalheStatus() {
  return (
    <div
      role="img"
      aria-label="Exemplo da página de acompanhamento do cliente: OS 1042, iPhone 13, etapa 4 de 6, em reparo."
      className={painel}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 font-medium">
          <IconeLink className="size-3.5 text-accent" />
          Link de acompanhamento
        </span>
        <span className="text-fg-muted">Atualizado agora</span>
      </div>
      <p className="mt-4 text-sm">
        <span className="font-mono font-semibold">OS #1042</span>
        <span className="text-fg-muted"> · iPhone 13 · Troca de tela</span>
      </p>
      <p className="mt-1 flex items-center gap-2 font-display text-lg font-semibold">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full rounded-full bg-status-reparo opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-2.5 rounded-full bg-status-reparo" />
        </span>
        {etapasCliente[etapaAtual]}
        <span className="font-sans text-xs font-normal text-fg-muted">
          Etapa {etapaAtual + 1} de {etapasCliente.length}
        </span>
      </p>
      <ol className="mt-4 grid grid-cols-6 gap-1.5">
        {etapasCliente.map((etapa, i) => (
          <li key={etapa}>
            <span className={`block h-1.5 rounded-full ${i <= etapaAtual ? 'bg-accent' : 'bg-border'}`} />
            <span
              className={`mt-2 hidden text-xs lg:block ${
                i === etapaAtual ? 'font-semibold text-fg' : 'text-fg-muted'
              }`}
            >
              {etapa}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

const mensagens = [
  { texto: 'Olá, Ana! O orçamento da OS #1042 está pronto para sua aprovação.', hora: '10:42' },
  { texto: 'Seu iPhone 13 está pronto para retirada.', hora: '16:05' },
]

function DetalheAviso() {
  return (
    <div
      role="img"
      aria-label="Exemplo de avisos automáticos enviados ao cliente: orçamento pronto e aparelho pronto para retirada."
      className={painel}
    >
      <p className="text-xs text-fg-muted">Enviado automaticamente · [PREENCHER: canal do aviso]</p>
      <ul className="mt-3 space-y-2">
        {mensagens.map(({ texto, hora }) => (
          <li key={hora} className="rounded-card rounded-tl-sm border border-border bg-surface px-3 py-2 text-sm">
            {texto}
            <span className="mt-1 block text-right text-xs text-fg-muted">{hora}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const pecas = [
  { peca: 'Tela iPhone 13', qtd: 4, barra: 'w-1/3' },
  { peca: 'Bateria Galaxy A54', qtd: 1, barra: 'w-1/12' },
  { peca: 'Conector USB-C', qtd: 12, barra: 'w-full' },
]

function DetalhePecas() {
  return (
    <div
      role="img"
      aria-label="Exemplo do controle de estoque: peças com a quantidade disponível na prateleira."
      className={painel}
    >
      <div className="flex justify-between text-xs text-fg-muted">
        <span>Peça</span>
        <span>Em estoque</span>
      </div>
      <ul className="mt-3 space-y-3 text-sm">
        {pecas.map(({ peca, qtd, barra }) => (
          <li key={peca}>
            <span className="flex justify-between gap-2">
              <span className="font-medium">{peca}</span>
              <span className="font-mono">{qtd} un.</span>
            </span>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-border">
              <span className={`block h-full rounded-full bg-highlight ${barra}`} />
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

function DetalheHistorico() {
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
        {historico.map(({ numero, data, servico, garantia, ativa }) => (
          <li
            key={numero}
            className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm"
          >
            <span
              className={`absolute top-1.5 -left-[21px] size-2.5 rounded-full border-2 border-bg ${
                ativa ? 'bg-accent' : 'bg-fg-muted'
              }`}
            />
            <span>
              <span className="block text-xs text-fg-muted">{data}</span>
              <span className="font-mono font-semibold">#{numero}</span> · {servico}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs ${
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
const recursos = [
  {
    titulo: 'Checklist de entrada com fotos',
    texto: 'Registre o estado do aparelho no balcão, com fotos, antes de abrir. Evita discussão na retirada.',
    icone: <IconeChecklist />,
    detalhe: <DetalheChecklist />,
  },
  {
    titulo: 'Kanban da bancada por técnico',
    texto: 'As OS da bancada em colunas por etapa, separadas por técnico. Cada técnico sabe o que pegar em seguida.',
    icone: <IconeKanban />,
    detalhe: <DetalheKanban />,
    largo: true,
  },
  {
    titulo: 'Status em tempo real',
    texto: 'O cliente recebe um link e acompanha o aparelho sozinho. Menos ligação perguntando se já ficou pronto.',
    icone: <IconeLink />,
    detalhe: <DetalheStatus />,
    largo: true,
  },
  {
    titulo: 'Aviso automático ao cliente',
    texto: 'O cliente recebe aviso automático do andamento da OS, sem ninguém parar a bancada para ligar.',
    icone: <IconeAviso />,
    detalhe: <DetalheAviso />,
  },
  {
    titulo: 'Peças e estoque sob controle',
    texto: 'Saiba quantas peças tem na prateleira antes de passar prazo ao cliente.',
    icone: <IconeCaixa />,
    detalhe: <DetalhePecas />,
  },
  {
    titulo: 'Histórico e garantia por aparelho',
    texto: 'Cada aparelho guarda seus reparos anteriores e o prazo de garantia. Voltou? Você sabe o que já foi feito.',
    icone: <IconeGarantia />,
    detalhe: <DetalheHistorico />,
    largo: true,
  },
]

export default function Recursos() {
  return (
    <section id="recursos" aria-labelledby="recursos-titulo" className="section-y">
      <div className="container-page">
        <h2 id="recursos-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
          O que a Exotek faz pela sua assistência.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">Cada aparelho. Cada etapa. Tudo sob controle.</p>

        <ul role="list" className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {recursos.map(({ titulo, texto, icone, detalhe, largo }) => (
            <li
              key={titulo}
              className={`flex cursor-pointer flex-col rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent md:p-6 ${
                largo ? 'lg:col-span-2' : ''
              }`}
            >
              <span className="grid size-10 place-items-center rounded-button border border-border bg-bg text-accent">
                {icone}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{titulo}</h3>
              <p className="mt-2 text-fg-muted">{texto}</p>
              <div className="mt-auto pt-6">{detalhe}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
