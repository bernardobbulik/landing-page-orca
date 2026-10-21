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
      {/* key troca o ponto a cada passo para ele "acender" de novo (só opacity/scale). */}
      <span
        key={rotulo}
        aria-hidden="true"
        className={`size-2.5 rounded-full ${classe} transition-[opacity,scale] duration-300 starting:scale-50 starting:opacity-0`}
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

// Avançar: o conteúdo atual sai pela direita e o novo entra pela esquerda. Voltar: o contrário.
// Só transform/opacity; o reset global de prefers-reduced-motion zera as durações.
const MOVIMENTO = {
  frente: {
    entra: 'starting:-translate-x-8 starting:opacity-0',
    sai: 'translate-x-8 opacity-0 starting:translate-x-0 starting:opacity-100',
  },
  tras: {
    entra: 'starting:translate-x-8 starting:opacity-0',
    sai: '-translate-x-8 opacity-0 starting:translate-x-0 starting:opacity-100',
  },
}

const TRANSICAO = 'transition-[opacity,translate] ease-out'
const SAIDA_MS = 150

function Seta({ className = '' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`size-4 ${className}`}
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  )
}

function NavPassos({ indice, aoNavegar }) {
  const ultimo = indice === ULTIMO
  return (
    <div className="flex flex-wrap items-center gap-3">
      {indice > 0 && (
        <button
          type="button"
          data-nav="anterior"
          onClick={() => aoNavegar(indice - 1, 'anterior')}
          className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-button border border-border bg-surface px-4 text-sm font-medium text-fg-muted hover:border-fg hover:text-fg"
        >
          <Seta className="rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Anterior
        </button>
      )}
      <button
        type="button"
        data-nav="proxima"
        onClick={() => aoNavegar(ultimo ? 0 : indice + 1, 'proxima')}
        className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-button border-2 border-accent bg-surface px-4 text-sm font-semibold text-accent"
      >
        {ultimo ? 'Ver de novo desde a entrada' : `Próxima: ${PASSOS[indice + 1].titulo}`}
        <Seta className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  )
}

function Painel({ indice, movimento, saindo = false, comTitulo = false, nav = null, className = '' }) {
  const passo = PASSOS[indice]
  const anim = saindo
    ? `${TRANSICAO} duration-150 ${MOVIMENTO[movimento].sai}`
    : `${TRANSICAO} duration-200 ${MOVIMENTO[movimento].entra}`
  return (
    <div className={`gap-6 lg:grid-cols-2 lg:items-center ${className}`}>
      <div>
        <div key={`texto-${indice}`} className={`${anim} ${saindo ? '' : 'delay-100'}`}>
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
        {comTitulo && nav && <div className="mt-6">{nav}</div>}
      </div>
      <div key={`tela-${indice}`} className={`${anim} ${saindo ? '' : 'delay-150'}`}>
        <MiniTela passo={passo} />
      </div>
      {!comTitulo && nav}
    </div>
  )
}

const visivel = (el) => el.offsetParent !== null

export default function Jornada() {
  const [ativo, setAtivo] = useState(0)
  const [explorou, setExplorou] = useState(false)
  const [movimento, setMovimento] = useState('frente')
  const [saindo, setSaindo] = useState(null)
  const botoes = useRef([])
  const itens = useRef([])
  const quadro = useRef(null)
  const focoPendente = useRef(null)

  // Rola até o passo só depois de uma ação do usuário; suave apenas sem prefers-reduced-motion.
  useEffect(() => {
    if (!explorou) return
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 48rem)').matches
    const alvo = desktop ? quadro.current : itens.current[ativo]
    alvo?.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' })
  }, [ativo, explorou])

  // No celular o painel muda de <li> e os botões Anterior/Próxima são recriados: devolve o foco a eles.
  useEffect(() => {
    const tipo = focoPendente.current
    if (!tipo || !quadro.current) return
    focoPendente.current = null
    const controles = [...quadro.current.querySelectorAll('[data-nav]')].filter(visivel)
    const alvo = controles.find((el) => el.dataset.nav === tipo) ?? controles[0]
    if (alvo && alvo !== document.activeElement) alvo.focus({ preventScroll: true })
  }, [ativo])

  // Remove a cópia que está saindo assim que a animação de saída termina.
  useEffect(() => {
    if (!saindo) return
    const timer = setTimeout(() => setSaindo(null), SAIDA_MS + 50)
    return () => clearTimeout(timer)
  }, [saindo])

  function ir(indice) {
    if (indice === ativo) return
    const sentido = indice > ativo ? 'frente' : 'tras'
    setExplorou(true)
    setMovimento(sentido)
    setSaindo({ indice: ativo, movimento: sentido })
    setAtivo(indice)
  }

  function navegarPeloPainel(indice, tipo) {
    focoPendente.current = tipo
    ir(indice)
  }

  function aoTeclar(event, indice) {
    const destino = TECLAS[event.key]
    if (!destino) return
    event.preventDefault()
    const novo = Math.min(Math.max(destino(indice), 0), ULTIMO)
    ir(novo)
    botoes.current[novo]?.focus({ preventScroll: true })
  }

  const nav = <NavPassos indice={ativo} aoNavegar={navegarPeloPainel} />

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
          <p id="jornada-dica" className="mb-6 flex items-center gap-2 text-sm text-fg-muted">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
              className="size-5 shrink-0 text-accent"
            >
              <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.9-2.6L4.6 14a1.5 1.5 0 0 1 2.4-1.8L9 14.5" />
            </svg>
            <span className="md:hidden">Toque em uma etapa ou use “Próxima” para seguir o aparelho.</span>
            <span className="hidden md:inline">
              Clique em uma etapa, use “Próxima” ou as setas do teclado para seguir o aparelho.
            </span>
          </p>

          <ol
            aria-label="Etapas da ordem de serviço"
            aria-describedby="jornada-dica"
            className="md:grid md:grid-cols-6"
          >
            {PASSOS.map((passo, i) => {
              const atual = i === ativo
              const feito = i < ativo
              const convida = !explorou && i === ativo + 1
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
                    className="group flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-button text-left md:w-auto md:flex-col md:items-start md:pr-3"
                  >
                    <span className="relative flex size-9 shrink-0">
                      {/* Pulso no próximo passo até a primeira interação: mostra onde clicar. */}
                      {convida && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 animate-ping rounded-full border-2 border-accent"
                        />
                      )}
                      <span
                        aria-hidden="true"
                        className={`relative flex size-9 items-center justify-center rounded-full border-2 font-display text-sm font-semibold transition-transform duration-200 group-hover:scale-110 ${
                          atual
                            ? 'border-accent bg-accent text-on-accent'
                            : feito
                              ? 'border-accent bg-surface text-fg'
                              : 'border-border bg-surface text-fg-muted group-hover:border-accent'
                        }`}
                      >
                        {i + 1}
                      </span>
                    </span>
                    <span
                      className={`md:text-sm ${
                        atual
                          ? 'font-semibold text-fg'
                          : 'text-fg-muted underline-offset-4 group-hover:text-fg group-hover:underline'
                      }`}
                    >
                      {passo.titulo}
                    </span>
                  </button>
                  {atual && (
                    <Painel indice={i} movimento={movimento} nav={nav} className="mt-4 grid pl-12 md:hidden" />
                  )}
                </li>
              )
            })}
          </ol>

          <div className="relative mt-10 hidden md:block">
            {saindo && (
              <div aria-hidden="true" inert className="pointer-events-none absolute inset-x-0 top-0">
                <Painel
                  key={`saindo-${saindo.indice}`}
                  indice={saindo.indice}
                  movimento={saindo.movimento}
                  saindo
                  comTitulo
                  className="grid"
                />
              </div>
            )}
            <Painel indice={ativo} movimento={movimento} comTitulo nav={nav} className="grid" />
          </div>
        </div>
      </div>
    </section>
  )
}
