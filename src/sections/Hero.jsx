import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import CtaButton from '../components/CtaButton.jsx'

// Dados ilustrativos do painel (interface de exemplo, não são clientes reais).
// O índice no pool vira o número da OS: 0 → #1039, 1 → #1040…
const pool = [
  { aparelho: 'Redmi Note 12', defeito: 'Não liga', cliente: 'Rafael S.' },
  { aparelho: 'Moto G84', defeito: 'Conector de carga', cliente: 'Juliana R.' },
  { aparelho: 'Galaxy A54', defeito: 'Bateria', cliente: 'Carlos M.' },
  { aparelho: 'iPhone 13', defeito: 'Troca de tela', cliente: 'Ana P.' },
  { aparelho: 'Galaxy S23', defeito: 'Tela trincada', cliente: 'Marcos T.' },
  { aparelho: 'iPhone 11', defeito: 'Face ID', cliente: 'Beatriz L.' },
  { aparelho: 'Moto E22', defeito: 'Alto-falante', cliente: 'Pedro H.' },
  { aparelho: 'Redmi 13C', defeito: 'Câmera traseira', cliente: 'Larissa F.' },
]

// Status pela linha (de cima para baixo): cada OS avança uma etapa ao descer.
const statusPorLinha = ['alterna', 'reparo', 'testes', 'pronto']

// Esteira: a cada passo entra uma OS nova no topo e a mais antiga (pronta) sai.
function ordensNoPasso(passo) {
  return statusPorLinha.map((status, linha) => {
    const i = passo + statusPorLinha.length - 1 - linha
    return { numero: String(1039 + i), ...pool[i % pool.length], status }
  })
}

const PX_POR_PASSO = 200 // ≈ 2 cliques da roda do mouse
const suave = 'cubic-bezier(0.22, 1, 0.36, 1)'

// Cor do status só no ponto; o rótulo é sempre texto em fg.
const estados = {
  orcamento: { rotulo: 'Em orçamento', ponto: 'bg-status-aguardando' },
  aprovado: { rotulo: 'Aprovado', ponto: 'bg-status-aprovado' },
  reparo: { rotulo: 'Em reparo', ponto: 'bg-status-reparo' },
  testes: { rotulo: 'Testes', ponto: 'bg-status-testes' },
  pronto: { rotulo: 'Pronto', ponto: 'bg-status-pronto' },
}

// Alterna true/false em laço lento. Desligado com prefers-reduced-motion e com a aba oculta.
function useAlternancia(intervaloMs) {
  const [ativo, setAtivo] = useState(false)

  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer

    const sincronizar = () => {
      clearInterval(timer)
      if (!reduzir.matches && !document.hidden) {
        timer = setInterval(() => setAtivo((v) => !v), intervaloMs)
      }
    }
    const aoMudarMovimento = () => {
      if (reduzir.matches) setAtivo(false)
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
  }, [intervaloMs])

  return ativo
}

// Conta a distância rolada (qualquer direção) enquanto o painel está na tela e avança
// um passo a cada PX_POR_PASSO. Não rouba a rolagem. Desligado com prefers-reduced-motion.
function usePassosDeRolagem(alvo) {
  const [passo, setPasso] = useState(0)

  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visivel = false
    let ultimoY = window.scrollY
    let acumulado = 0

    const observador = new IntersectionObserver(([entrada]) => {
      visivel = entrada.isIntersecting
    })
    observador.observe(alvo.current)

    const aoRolar = () => {
      const y = window.scrollY
      if (visivel && !reduzir.matches) {
        acumulado += Math.abs(y - ultimoY)
        if (acumulado >= PX_POR_PASSO) {
          acumulado -= PX_POR_PASSO
          setPasso((p) => p + 1)
        }
      }
      ultimoY = y
    }

    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => {
      observador.disconnect()
      window.removeEventListener('scroll', aoRolar)
    }
  }, [alvo])

  return passo
}

// FLIP com Web Animations API: linhas que ficam deslizam da posição antiga, a nova
// entra de cima com fade e o chip que mudou de status aparece suavemente.
function useEsteira(passo, ordens) {
  const linhas = useRef(new Map())
  const anterior = useRef(new Map())

  useLayoutEffect(() => {
    const atual = new Map()
    for (const os of ordens) {
      const el = linhas.current.get(os.numero)
      if (el) atual.set(os.numero, { topo: el.offsetTop, status: os.status, el })
    }
    const antes = anterior.current
    anterior.current = atual
    if (passo === 0) return

    atual.forEach(({ topo, status, el }, numero) => {
      const velho = antes.get(numero)
      el.getAnimations().forEach((a) => a.cancel())

      if (!velho) {
        el.animate(
          [
            { opacity: 0, transform: 'translateY(-1rem)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 600, delay: 120, easing: suave, fill: 'backwards' },
        )
        return
      }

      if (velho.topo !== topo) {
        el.animate([{ transform: `translateY(${velho.topo - topo}px)` }, { transform: 'none' }], {
          duration: 650,
          easing: suave,
        })
      }

      const chip = el.querySelector('[data-chip]')
      if (chip && velho.status !== status) {
        chip.animate(
          [
            { opacity: 0, transform: 'translateY(0.375rem) scale(0.96)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 450, delay: 100, easing: suave, fill: 'backwards' },
        )
      }
    })
  }, [passo, ordens])

  return (numero) => (el) => {
    if (el) linhas.current.set(numero, el)
    else linhas.current.delete(numero)
  }
}

const chip =
  'whitespace-nowrap rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg'

function Rotulo({ estado }) {
  const { rotulo, ponto } = estados[estado]
  return (
    <>
      <span className={`size-2 shrink-0 rounded-full ${ponto}`} />
      {rotulo}
    </>
  )
}

function StatusChip({ status, aprovado }) {
  if (status !== 'alterna') {
    return (
      <span className={`${chip} inline-flex items-center gap-1.5`}>
        <Rotulo estado={status} />
      </span>
    )
  }

  // Os dois estados ocupam a mesma célula: a largura não muda, só a opacidade.
  const camada = 'col-start-1 row-start-1 inline-flex items-center gap-1.5 transition-opacity duration-500'
  return (
    <span className={`${chip} inline-grid`}>
      <span className={`${camada} ${aprovado ? 'opacity-0' : 'opacity-100'}`}>
        <Rotulo estado="orcamento" />
      </span>
      <span className={`${camada} ${aprovado ? 'opacity-100' : 'opacity-0'}`}>
        <Rotulo estado="aprovado" />
      </span>
    </span>
  )
}

function PainelOrdens() {
  const painel = useRef(null)
  const aprovado = useAlternancia(3500)
  const passo = usePassosDeRolagem(painel)
  const ordens = useMemo(() => ordensNoPasso(passo), [passo])
  const refLinha = useEsteira(passo, ordens)

  return (
    <div
      ref={painel}
      role="img"
      aria-label="Exemplo do painel Exotek: lista de ordens de serviço com número, aparelho, cliente e status."
      className="overflow-hidden rounded-card border border-border bg-surface"
    >
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </span>
        <span className="flex-1 truncate rounded-button bg-bg px-3 py-1 text-xs text-fg-muted">
          Ordens de serviço
        </span>
      </div>

      <div className="hidden grid-cols-[4.5rem_1fr_6.5rem_8.5rem] gap-x-3 border-b border-border px-4 py-2 text-xs font-medium text-fg-muted sm:grid">
        <span>OS</span>
        <span>Aparelho</span>
        <span>Cliente</span>
        <span>Status</span>
      </div>

      <ul className="relative divide-y divide-border overflow-hidden">
        {ordens.map((os) => (
          <li
            key={os.numero}
            ref={refLinha(os.numero)}
            className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 px-4 py-3 text-sm sm:grid-cols-[4.5rem_1fr_6.5rem_8.5rem] sm:items-center"
          >
            <span className="font-mono font-semibold">#{os.numero}</span>
            <span className="col-start-1 sm:col-start-auto">
              <span className="font-medium">{os.aparelho}</span>
              <span className="block text-fg-muted">{os.defeito}</span>
            </span>
            <span className="col-start-1 text-fg-muted sm:col-start-auto">{os.cliente}</span>
            <span data-chip className="col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto">
              <StatusChip status={os.status} aprovado={aprovado} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="topo" aria-labelledby="hero-titulo" className="section-y">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 id="hero-titulo" className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Do balcão à bancada, cada ordem de serviço sob controle.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-fg-muted">
            Registre a entrada do aparelho, aprove o orçamento com o cliente e acompanhe cada
            reparo em tempo real.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <CtaButton />
            <a
              href="#jornada"
              className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4"
            >
              Ver como funciona
            </a>
          </div>
          <p className="mt-3 text-sm text-fg-muted">Feito para assistências técnicas de celulares.</p>
        </div>

        <PainelOrdens />
      </div>
    </section>
  )
}
