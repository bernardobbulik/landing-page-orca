import { useEffect, useRef, useState } from 'react'

// Status por passo: tokens --color-status-* de tokens.css. A cor fica só no ponto; o rótulo vai em texto.
const PASSOS = [
  {
    id: 'entrada',
    titulo: 'Entrada',
    frase: 'No balcão, aparelho, defeito relatado e acessórios entram na OS antes de o cliente sair da loja.',
    status: { rotulo: 'Recebido', classe: 'bg-status-recebido' },
    tela: [
      ['Aparelho', 'Smartphone'],
      ['Defeito relatado', 'Tela trincada, toque falhando'],
      ['Acessórios', 'Capa, sem chip'],
      ['Atendimento', 'Balcão'],
    ],
  },
  {
    id: 'orcamento',
    titulo: 'Orçamento',
    frase: 'O técnico registra o diagnóstico e monta o orçamento na própria OS, com peça e serviço.',
    status: { rotulo: 'Diagnóstico', classe: 'bg-status-diagnostico' },
    tela: [
      ['Diagnóstico', 'Display e touch danificados'],
      ['Peça', 'Tela frontal'],
      ['Serviço', 'Troca de tela'],
      ['Técnico', 'Bancada 1'],
    ],
  },
  {
    id: 'aprovacao',
    titulo: 'Aprovação do cliente',
    frase: 'A resposta do cliente fica registrada. Nada vai para a bancada sem aprovação.',
    status: { rotulo: 'Aprovado', classe: 'bg-status-aprovado' },
    tela: [
      ['Orçamento', 'Enviado ao cliente'],
      ['Resposta', 'Aprovado'],
      ['Registro', 'Data, hora e canal'],
      ['Próxima etapa', 'Bancada'],
    ],
  },
  {
    id: 'bancada',
    titulo: 'Bancada',
    frase: 'Cada aparelho tem um responsável e uma etapa. O balcão vê o andamento sem precisar perguntar.',
    status: { rotulo: 'Em reparo', classe: 'bg-status-reparo' },
    tela: [
      ['Responsável', 'Técnico da bancada 1'],
      ['Peça', 'Separada para a OS'],
      ['Etapa', 'Troca de tela'],
      ['Pendências', 'Nenhuma'],
    ],
  },
  {
    id: 'teste',
    titulo: 'Teste',
    frase: 'Antes de liberar, o aparelho passa pelo checklist. O que foi testado fica na OS.',
    status: { rotulo: 'Testes', classe: 'bg-status-testes' },
    tela: [
      ['Tela e toque', 'OK'],
      ['Câmeras', 'OK'],
      ['Carga', 'OK'],
      ['Áudio e microfone', 'OK'],
    ],
  },
  {
    id: 'retirada',
    titulo: 'Retirada',
    frase: 'Pronto, avisado e entregue. A retirada fecha a OS com o histórico completo.',
    status: { rotulo: 'Pronto', classe: 'bg-status-pronto' },
    tela: [
      ['Situação', 'Pronto para retirada'],
      ['Cliente', 'Avisado pelo balcão'],
      ['Garantia', 'Registrada na OS'],
      ['Entrega', 'Data e hora registradas'],
    ],
  },
]

const ULTIMO = PASSOS.length - 1

const TECLAS = {
  ArrowRight: (i) => i + 1,
  ArrowDown: (i) => i + 1,
  ArrowLeft: (i) => i - 1,
  ArrowUp: (i) => i - 1,
  Home: () => 0,
  End: () => ULTIMO,
}

function ChipStatus({ rotulo, classe }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm font-medium">
      {/* key troca o ponto a cada passo para ele "acender" de novo (só opacity/transform). */}
      <span
        key={rotulo}
        aria-hidden="true"
        className={`size-2.5 rounded-full ${classe} transition-[opacity,transform] duration-300 starting:scale-50 starting:opacity-0`}
      />
      <span>
        <span className="sr-only">Status: </span>
        {rotulo}
      </span>
    </span>
  )
}

function MiniTela({ passo }) {
  return (
    <figure className="rounded-card border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <p className="font-mono text-sm text-fg-muted">OS de exemplo</p>
        <ChipStatus {...passo.status} />
      </div>
      <dl className="divide-y divide-border">
        {passo.tela.map(([termo, valor]) => (
          <div key={termo} className="flex justify-between gap-4 py-2 text-sm">
            <dt className="text-fg-muted">{termo}</dt>
            <dd className="text-right font-medium">{valor}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-3 text-xs text-fg-muted">
        Tela ilustrativa: o que a equipe vê nesta etapa.
      </figcaption>
    </figure>
  )
}

function Painel({ indice, comTitulo = false, className = '' }) {
  const passo = PASSOS[indice]
  return (
    <div className={`gap-6 lg:grid-cols-2 lg:items-center ${className}`}>
      <div>
        {comTitulo && (
          <>
            <p className="text-sm text-fg-muted">
              Passo {indice + 1} de {PASSOS.length}
            </p>
            <h3 className="mt-1 text-2xl font-semibold">{passo.titulo}</h3>
          </>
        )}
        <p className={`text-fg-muted ${comTitulo ? 'mt-3 text-lg' : ''}`}>{passo.frase}</p>
      </div>
      <MiniTela passo={passo} />
    </div>
  )
}

export default function Jornada() {
  const [ativo, setAtivo] = useState(0)
  const interagiu = useRef(false)
  const botoes = useRef([])
  const itens = useRef([])
  const quadro = useRef(null)

  // Rola até o passo só depois de uma ação do usuário; suave apenas sem prefers-reduced-motion.
  useEffect(() => {
    if (!interagiu.current) return
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 48rem)').matches
    const alvo = desktop ? quadro.current : itens.current[ativo]
    alvo?.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' })
  }, [ativo])

  function ir(indice) {
    interagiu.current = true
    setAtivo(indice)
  }

  function aoTeclar(event, indice) {
    const destino = TECLAS[event.key]
    if (!destino) return
    event.preventDefault()
    const novo = Math.min(Math.max(destino(indice), 0), ULTIMO)
    ir(novo)
    botoes.current[novo]?.focus({ preventScroll: true })
  }

  return (
    <section id="jornada" aria-labelledby="jornada-titulo" className="section-y">
      <div className="container-page">
        <h2 id="jornada-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
          Do balcão à bancada, cada etapa registrada.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">
          Da bancada ao cliente. Veja o que a equipe registra em cada etapa da ordem de serviço.
        </p>

        <div ref={quadro} className="mt-10 scroll-mt-20 scroll-mb-4">
          <ol aria-label="Etapas da ordem de serviço" className="md:grid md:grid-cols-6">
            {PASSOS.map((passo, i) => {
              const atual = i === ativo
              const feito = i < ativo
              return (
                <li
                  key={passo.id}
                  ref={(el) => {
                    itens.current[i] = el
                  }}
                  className="relative scroll-mt-20 scroll-mb-4 pb-6 last:pb-0 md:pb-0"
                >
                  {i < ULTIMO && (
                    <span
                      aria-hidden="true"
                      className="absolute top-11 bottom-1 left-[calc(1.125rem-1px)] w-0.5 bg-border md:top-[calc(1.125rem-1px)] md:right-3 md:bottom-auto md:left-12 md:h-0.5 md:w-auto"
                    >
                      <span
                        className={`absolute inset-0 origin-top bg-highlight transition-transform duration-500 md:origin-left ${
                          feito ? 'scale-100' : 'scale-y-0 md:scale-x-0 md:scale-y-100'
                        }`}
                      />
                    </span>
                  )}
                  <button
                    type="button"
                    ref={(el) => {
                      botoes.current[i] = el
                    }}
                    aria-current={atual ? 'step' : undefined}
                    tabIndex={atual ? 0 : -1}
                    onClick={() => ir(i)}
                    onKeyDown={(event) => aoTeclar(event, i)}
                    className="flex min-h-11 w-full items-center gap-3 rounded-button text-left md:w-auto md:flex-col md:items-start md:pr-3"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-semibold ${
                        atual
                          ? 'border-accent bg-accent text-on-accent'
                          : feito
                            ? 'border-accent bg-surface text-fg'
                            : 'border-border bg-surface text-fg-muted'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={`md:text-sm ${atual ? 'font-semibold text-fg' : 'text-fg-muted'}`}>
                      {passo.titulo}
                    </span>
                  </button>
                  {atual && <Painel indice={i} className="mt-4 grid pl-12 md:hidden" />}
                </li>
              )
            })}
          </ol>

          <Painel indice={ativo} comTitulo className="mt-10 hidden md:grid" />
        </div>
      </div>
    </section>
  )
}
