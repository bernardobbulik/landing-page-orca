import { useEffect, useEffectEvent, useRef, useState } from 'react'

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

// Modo fixado (desktop com altura suficiente): a seção trava sob o header e cada PASSO_ROLAGEM px
// de rolagem avança uma etapa. A página só segue depois de a última etapa ficar um trecho na tela.
const PASSO_ROLAGEM = 280
const TOPO_FIXO = 64 // altura do header sticky (top-16)
const FOLGA_FIXO = 48 // py-6 da caixa fixada

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

function NavPassos({ indice, aoNavegar, fixado }) {
  const ultimo = indice === ULTIMO
  // Fixado, quem avança é a rolagem: no lugar dos botões fica a deixa, com a mesma altura.
  if (fixado) {
    return ultimo ? (
      <BotaoPlanos />
    ) : (
      <p className="inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted">
        Role para a próxima:
        <span className="font-semibold text-fg">{PASSOS[indice + 1].titulo}</span>
        <Seta className="rotate-90" />
      </p>
    )
  }
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
      {ultimo ? (
        <BotaoPlanos />
      ) : (
        <button
          type="button"
          data-nav="proxima"
          onClick={() => aoNavegar(indice + 1, 'proxima')}
          className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-button border-2 border-accent bg-surface px-4 text-sm font-semibold text-accent"
        >
          {`Próxima: ${PASSOS[indice + 1].titulo}`}
          <Seta className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      )}
    </div>
  )
}

// Fecho da Jornada. Exceções ao brandkit aprovadas para este botão: fundo âmbar (status-aguardando,
// texto fg ~9:1) e reflexo metálico. O reflexo roda via WAAPI, que o reset global não alcança,
// por isso a checagem explícita de prefers-reduced-motion.
function BotaoPlanos() {
  const brilho = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const animacao = brilho.current?.animate(
      [{ translate: '-120% 0' }, { translate: '320% 0', offset: 0.4 }, { translate: '320% 0' }],
      { duration: 2800, delay: 300, iterations: Infinity, easing: 'ease-in-out' },
    )
    return () => animacao?.cancel()
  }, [])

  return (
    <a
      href="#precos"
      data-nav="proxima"
      className="group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-button border border-status-aguardando bg-status-aguardando px-4 text-sm font-medium text-fg transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      <span
        ref={brilho}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] -skew-x-20 bg-linear-to-r from-transparent via-surface/70 to-transparent"
      />
      <span className="relative">
        Agora é com <strong className="font-bold">você</strong>.
      </span>
      <Seta className="relative transition-transform duration-200 group-hover:translate-x-1" />
    </a>
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
  const [fixado, setFixado] = useState(false)
  const botoes = useRef([])
  const trilho = useRef(null)
  const conteudo = useRef(null)
  const itens = useRef([])
  const quadro = useRef(null)
  const focoPendente = useRef(null)

  // Fixa só no desktop e quando a seção inteira cabe abaixo do header; senão fica o modo de clique.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 48rem)')
    const medir = () => {
      const altura = conteudo.current.offsetHeight + FOLGA_FIXO
      setFixado(desktop.matches && altura <= window.innerHeight - TOPO_FIXO)
    }
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(conteudo.current)
    window.addEventListener('resize', medir)
    return () => {
      observador.disconnect()
      window.removeEventListener('resize', medir)
    }
  }, [])

  // Fixado, a posição de rolagem é a fonte da verdade: cada trecho do trilho corresponde a uma etapa.
  const seguirRolagem = useEffectEvent(() => {
    const rolado = TOPO_FIXO - trilho.current.getBoundingClientRect().top
    ir(Math.min(Math.max(Math.floor(rolado / PASSO_ROLAGEM), 0), ULTIMO))
  })

  useEffect(() => {
    if (!fixado) return
    let quadroPendente = 0
    const aoRolar = () => {
      if (quadroPendente) return
      quadroPendente = requestAnimationFrame(() => {
        quadroPendente = 0
        seguirRolagem()
      })
    }
    seguirRolagem()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      window.removeEventListener('scroll', aoRolar)
      cancelAnimationFrame(quadroPendente)
    }
  }, [fixado])

  // Rola até o passo só depois de uma ação do usuário; suave apenas sem prefers-reduced-motion.
  const rolarAteAtivo = useEffectEvent(() => {
    if (!explorou || fixado) return
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia('(min-width: 48rem)').matches
    const alvo = desktop ? quadro.current : itens.current[ativo]
    alvo?.scrollIntoView({ block: 'nearest', behavior: reduzido ? 'auto' : 'smooth' })
  })

  useEffect(() => {
    rolarAteAtivo()
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

  // Fixado, clique e teclado levam a rolagem ao meio do trecho da etapa; o scroll faz o resto.
  // Sem behavior: vale o scroll-behavior do html (suave, ou instantâneo com reduced-motion).
  function irPara(indice) {
    if (!fixado) return ir(indice)
    const inicio = trilho.current.getBoundingClientRect().top + window.scrollY - TOPO_FIXO
    window.scrollTo({ top: inicio + (indice + 0.5) * PASSO_ROLAGEM })
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
    irPara(novo)
    botoes.current[novo]?.focus({ preventScroll: true })
  }

  const nav = <NavPassos indice={ativo} aoNavegar={navegarPeloPainel} fixado={fixado} />

  return (
    <section id="jornada" aria-labelledby="jornada-titulo" className={fixado ? undefined : 'section-y'}>
      <div ref={trilho}>
        <div
          className={
            fixado ? 'sticky top-16 flex min-h-[calc(100svh-4rem)] flex-col justify-center py-6' : undefined
          }
        >
          <div ref={conteudo} className="container-page">
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
                  {fixado ? (
                    <>
                      <rect x="6" y="3" width="12" height="18" rx="6" />
                      <path d="M12 7v3" />
                    </>
                  ) : (
                    <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.9-2.6L4.6 14a1.5 1.5 0 0 1 2.4-1.8L9 14.5" />
                  )}
                </svg>
                {fixado ? (
                  <span>Role a página para seguir o aparelho, ou clique em uma etapa.</span>
                ) : (
                  <>
                    <span className="md:hidden">
                      Toque em uma etapa ou use “Próxima” para seguir o aparelho.
                    </span>
                    <span className="hidden md:inline">
                      Clique em uma etapa, use “Próxima” ou as setas do teclado para seguir o aparelho.
                    </span>
                  </>
                )}
              </p>

              <ol
                aria-label="Etapas da ordem de serviço"
                aria-describedby="jornada-dica"
                className="md:grid md:grid-cols-6"
              >
                {PASSOS.map((passo, i) => {
                  const atual = i === ativo
                  const feito = i < ativo
                  const convida = !explorou && !fixado && i === ativo + 1
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
                        onClick={() => irPara(i)}
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
                        <Painel
                          indice={i}
                          movimento={movimento}
                          nav={nav}
                          className="mt-4 grid pl-12 md:hidden"
                        />
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
        </div>
        {/* Pista de rolagem: um trecho por etapa enquanto a caixa acima fica presa sob o header. */}
        {fixado && <div aria-hidden="true" style={{ height: PASSOS.length * PASSO_ROLAGEM }} />}
      </div>
    </section>
  )
}
