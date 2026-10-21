import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
// Imports nomeados: o build leva só as chaves usadas (as instruções do JSON ficam de fora).
import { numeros as numerosReais, depoimentos as depoimentosReais } from '../../content/resultados.json'
import { numeros as numerosDuble, depoimentos as depoimentosDuble } from '../../content/resultados.dubles.json'

// Tudo que é real (números, nomes, funções, empresas, depoimentos) vem de
// content/resultados.json. Campo vazio ou com [PREENCHER] = pendente.
// Só itens reais completos aparecem, e a seção some se nada estiver pronto. Número
// só entra com fonte: indicador sem origem verificável tira mais confiança do que dá.
// Para ver o layout com os dublês de content/resultados.dubles.json (dados fictícios,
// marcados "Dublê" na tela), abra o dev com ?dubles na URL. Sem o parâmetro, o dev
// mostra o mesmo que a produção. No build os dublês nem entram no bundle.

const MARCADOR = '[PREENCHER]'
const DEV = import.meta.env.DEV && new URLSearchParams(window.location.search).has('dubles')
const INTERVALO_MS = 6000

const vazio = (valor) => typeof valor !== 'string' || valor.trim() === '' || valor.includes(MARCADOR)

function completo(item, obrigatorios, opcionais = []) {
  return (
    obrigatorios.every((campo) => !vazio(item[campo])) &&
    opcionais.every((campo) => !(typeof item[campo] === 'string' && item[campo].includes(MARCADOR)))
  )
}

const numeroCompleto = (numero) => completo(numero, ['valor', 'rotulo', 'fonte'])
const depoimentoCompleto = (depoimento) => completo(depoimento, ['citacao', 'nome', 'funcao', 'empresa'], ['cidade'])

function escolher(reais = [], doDuble, estaCompleto) {
  const pendentes = reais.filter((item) => !estaCompleto(item)).length
  if (DEV && pendentes > 0) return { itens: doDuble, duble: true, pendentes }
  return { itens: reais.filter(estaCompleto), duble: false, pendentes }
}

// O `DEV ? … : []` fica na chamada para o Vite descartar o JSON de dublês no build.
const numeros = escolher(numerosReais, DEV ? numerosDuble : [], numeroCompleto)
const depoimentos = escolher(depoimentosReais, DEV ? depoimentosDuble : [], depoimentoCompleto)

const assinarReduzir = (avisar) => {
  const midia = window.matchMedia('(prefers-reduced-motion: reduce)')
  midia.addEventListener('change', avisar)
  return () => midia.removeEventListener('change', avisar)
}
const lerReduzir = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const assinarAba = (avisar) => {
  document.addEventListener('visibilitychange', avisar)
  return () => document.removeEventListener('visibilitychange', avisar)
}
const lerAbaOculta = () => document.hidden

function Icone({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      {children}
    </svg>
  )
}

function SeloDuble() {
  return (
    <span className="inline-flex w-fit rounded-full bg-accent px-2.5 py-0.5 font-sans text-xs font-semibold text-on-accent">
      Dublê · dado fictício
    </span>
  )
}

function CartaoDepoimento({ citacao, nome, funcao, empresa, cidade, duble }) {
  return (
    <figure
      className={`flex h-full flex-col rounded-card border bg-surface p-6 md:p-10 ${
        duble ? 'border-dashed border-accent' : 'border-border'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-highlight" />
        {DEV && duble && <SeloDuble />}
      </div>
      <blockquote className="mt-6 max-w-3xl font-display text-xl leading-snug font-medium md:text-2xl">
        <p>“{citacao}”</p>
      </blockquote>
      <figcaption className="mt-auto pt-8">
        <span className="block font-semibold">{nome}</span>
        <span className="block text-sm text-fg-muted">
          {funcao} · {empresa}
          {cidade && ` · ${cidade}`}
        </span>
      </figcaption>
    </figure>
  )
}

const botaoSeta =
  'grid size-11 place-items-center rounded-full border border-border bg-surface text-fg transition-colors hover:border-accent hover:text-accent'

// Carrossel que avança sempre para a esquerda. O trilho tem clones nas pontas
// ([último, ...depoimentos, primeiro]); ao parar num clone, salta sem transição
// para o slide real equivalente. Navegação manual pelas setas < >; depois dela o
// tempo recomeça e o carrossel volta a andar sozinho. Pausa só enquanto o mouse está
// sobre o cartão (leitura), com foco de teclado dentro e com a aba oculta.
// Com prefers-reduced-motion não avança sozinho.
function CarrosselDepoimentos({ itens, duble }) {
  const total = itens.length
  const loop = total > 1
  const slides = loop ? [itens[total - 1], ...itens, itens[0]] : itens

  const [posicao, setPosicao] = useState(loop ? 1 : 0)
  const [comTransicao, setComTransicao] = useState(true)
  const [emHover, setEmHover] = useState(false)
  const [emFoco, setEmFoco] = useState(false)
  const reduzir = useSyncExternalStore(assinarReduzir, lerReduzir)
  const abaOculta = useSyncExternalStore(assinarAba, lerAbaOculta)

  const movendo = useRef(false)
  const inicioToque = useRef(null)
  const barra = useRef(null)
  const animacao = useRef(null)

  const autoplay = loop && !reduzir
  const rodando = autoplay && !emHover && !emFoco && !abaOculta
  const atual = loop ? (posicao - 1 + total) % total : 0

  const mover = useCallback((passo) => {
    if (movendo.current) return
    movendo.current = true
    setPosicao((p) => p + passo)
  }, [])

  function irPara(indice) {
    if (indice === atual || movendo.current) return
    movendo.current = true
    setPosicao(indice + 1)
  }

  function aoTerminarTransicao(evento) {
    if (evento.target !== evento.currentTarget) return
    if (posicao === 0 || posicao === total + 1) {
      setComTransicao(false)
      setPosicao(posicao === 0 ? total : 1)
    } else {
      movendo.current = false
    }
  }

  // Religa a transição depois do salto; dois frames para o salto ser pintado antes.
  useEffect(() => {
    if (comTransicao) return
    let quadro = requestAnimationFrame(() => {
      quadro = requestAnimationFrame(() => {
        setComTransicao(true)
        movendo.current = false
      })
    })
    return () => cancelAnimationFrame(quadro)
  }, [comTransicao])

  // O tempo de cada slide é a própria animação da barra do indicador ativo: a barra
  // e a troca de slide andam juntas, e pausar congela as duas no mesmo ponto.
  useEffect(() => {
    if (!autoplay || !barra.current) return
    const anim = barra.current.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: INTERVALO_MS,
      easing: 'linear',
      fill: 'forwards',
    })
    anim.pause()
    anim.onfinish = () => mover(1)
    animacao.current = anim
    return () => {
      anim.cancel()
      animacao.current = null
    }
  }, [atual, autoplay, mover])

  useEffect(() => {
    const anim = animacao.current
    if (!anim) return
    if (rodando) anim.play()
    else anim.pause()
  }, [rodando, atual, autoplay])

  // Celular: cartão em cima e "< pontos >" embaixo. Desktop: setas nas laterais do cartão.
  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Depoimentos de clientes"
      className="mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-4 [grid-template-areas:'cartao_cartao_cartao'_'anterior_pontos_proximo'] md:gap-x-4 md:[grid-template-areas:'anterior_cartao_proximo'_'._pontos_.']"
      onFocus={(e) => e.target.matches(':focus-visible') && setEmFoco(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setEmFoco(false)}
      onKeyDown={(e) => {
        if (!loop) return
        if (e.key === 'ArrowRight') mover(1)
        if (e.key === 'ArrowLeft') mover(-1)
      }}
    >
      {loop && (
        <button
          type="button"
          onClick={() => mover(-1)}
          aria-label="Depoimento anterior"
          className={`${botaoSeta} [grid-area:anterior]`}
        >
          <Icone>
            <path d="m15 18-6-6 6-6" />
          </Icone>
        </button>
      )}

      <div
        className="overflow-hidden rounded-card [grid-area:cartao]"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setEmHover(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setEmHover(false)}
      >
        <div
          aria-live={rodando ? 'off' : 'polite'}
          className={`flex touch-pan-y ${comTransicao ? 'transition-transform duration-700 ease-out' : ''}`}
          style={{ transform: `translateX(-${posicao * 100}%)` }}
          onTransitionEnd={aoTerminarTransicao}
          onPointerDown={(e) => {
            inicioToque.current = e.clientX
          }}
          onPointerCancel={() => {
            inicioToque.current = null
          }}
          onPointerUp={(e) => {
            if (!loop || inicioToque.current === null) return
            const deslocamento = e.clientX - inicioToque.current
            inicioToque.current = null
            if (Math.abs(deslocamento) > 50) mover(deslocamento < 0 ? 1 : -1)
          }}
        >
          {slides.map((depoimento, i) => {
            const clone = loop && (i === 0 || i === total + 1)
            const oculto = i !== posicao
            return (
              <div
                key={i}
                role={clone ? undefined : 'group'}
                aria-roledescription={clone ? undefined : 'slide'}
                aria-label={clone ? undefined : `${loop ? i : i + 1} de ${total}`}
                aria-hidden={clone || oculto || undefined}
                inert={clone || oculto || undefined}
                className="w-full shrink-0"
              >
                <CartaoDepoimento {...depoimento} duble={duble} />
              </div>
            )
          })}
        </div>
      </div>

      {loop && (
        <button
          type="button"
          onClick={() => mover(1)}
          aria-label="Próximo depoimento"
          className={`${botaoSeta} [grid-area:proximo]`}
        >
          <Icone>
            <path d="m9 18 6-6-6-6" />
          </Icone>
        </button>
      )}

      {loop && (
        <div className="flex items-center justify-self-center [grid-area:pontos]">
          {itens.map((depoimento, i) => (
            <button
              key={i}
              type="button"
              onClick={() => irPara(i)}
              aria-label={`Mostrar depoimento ${i + 1} de ${total}`}
              aria-current={i === atual || undefined}
              className="group grid h-11 place-items-center px-1.5"
            >
              {i === atual ? (
                <span className="block h-1.5 w-10 overflow-hidden rounded-full bg-border">
                  <span
                    ref={barra}
                    className="block h-full origin-left rounded-full bg-accent"
                    style={autoplay ? { transform: 'scaleX(0)' } : undefined}
                  />
                </span>
              ) : (
                <span className="block h-1.5 w-4 rounded-full bg-fg-muted transition-colors group-hover:bg-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Resultados() {
  if (numeros.itens.length === 0 && depoimentos.itens.length === 0) return null

  return (
    <section id="resultados" aria-labelledby="resultados-titulo" className="section-y">
      <div className="container-page">
        <h2 id="resultados-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
          Quem já usa a Exotek.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">
          Assistências que organizaram o balcão e a bancada com a Exotek.
        </p>

        {DEV && (numeros.duble || depoimentos.duble) && (
          <p role="note" className="mt-8 rounded-card border border-dashed border-accent bg-surface p-4 text-sm">
            <strong className="font-semibold">Dublês (só em desenvolvimento, com ?dubles na URL).</strong>{' '}
            <span className="text-fg-muted">
              <code className="font-mono text-fg">content/resultados.json</code> ainda tem{' '}
              {numeros.pendentes} número(s) e {depoimentos.pendentes} depoimento(s) pendentes, então esta seção
              mostra os dados fictícios de <code className="font-mono text-fg">content/resultados.dubles.json</code>.
              No build de produção os dublês nunca aparecem.
            </span>
          </p>
        )}

        {numeros.itens.length > 0 && (
          <dl className="mt-10 flex flex-col divide-y divide-border rounded-card border border-border bg-surface sm:flex-row sm:divide-x sm:divide-y-0 lg:mt-12">
            {numeros.itens.map(({ valor, rotulo, fonte }, i) => (
              <div
                key={i}
                className={`flex min-w-0 flex-col gap-2 p-6 sm:flex-1 md:p-8 ${
                  numeros.duble ? 'outline-2 -outline-offset-2 outline-accent outline-dashed' : ''
                }`}
              >
                <dt className="text-fg-muted">{rotulo}</dt>
                <dd className="order-first font-display text-4xl font-bold tracking-tight break-words md:text-5xl">
                  {valor}
                </dd>
                {fonte && <dd className="text-xs text-fg-muted">{fonte}</dd>}
                {DEV && numeros.duble && (
                  <dd>
                    <SeloDuble />
                  </dd>
                )}
              </div>
            ))}
          </dl>
        )}

        {depoimentos.itens.length > 0 && <CarrosselDepoimentos itens={depoimentos.itens} duble={depoimentos.duble} />}
      </div>
    </section>
  )
}
