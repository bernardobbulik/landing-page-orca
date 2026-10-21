import { useEffect, useState } from 'react'
import CtaButton from '../components/CtaButton.jsx'

// Dados ilustrativos do painel (interface de exemplo, não são clientes reais).
// Listas com tamanhos primos entre si (11, 9, 13): nenhuma linha repete o valor do
// tick anterior e a mesma combinação só volta depois de centenas de ordens.
const aparelhos = [
  'Redmi Note 12', 'Moto G84', 'Galaxy A54', 'iPhone 13', 'Galaxy S23', 'iPhone 11',
  'Moto E22', 'Redmi 13C', 'iPhone 14 Pro', 'Galaxy A15', 'Poco X6',
]
const defeitos = [
  'Não liga', 'Conector de carga', 'Bateria', 'Troca de tela', 'Face ID', 'Alto-falante',
  'Câmera traseira', 'Tela trincada', 'Microfone',
]
const clientes = [
  'Rafael S.', 'Juliana R.', 'Carlos M.', 'Ana P.', 'Marcos T.', 'Beatriz L.', 'Pedro H.',
  'Larissa F.', 'Thiago A.', 'Camila N.', 'Bruno C.', 'Fernanda O.', 'Lucas V.',
]

// Etapas da OS, na ordem. Cor do status só no ponto; o rótulo é sempre texto em fg.
const etapas = [
  { rotulo: 'Recebido', ponto: 'bg-status-recebido' },
  { rotulo: 'Diagnóstico', ponto: 'bg-status-diagnostico' },
  { rotulo: 'Em orçamento', ponto: 'bg-status-aguardando' },
  { rotulo: 'Aprovado', ponto: 'bg-status-aprovado' },
  { rotulo: 'Em reparo', ponto: 'bg-status-reparo' },
  { rotulo: 'Testes', ponto: 'bg-status-testes' },
  { rotulo: 'Pronto', ponto: 'bg-status-pronto' },
]
// Etapa inicial de cada linha (de cima para baixo); a cada tick todas avançam uma.
const etapaInicial = [2, 4, 5, 6]

const LINHAS = etapaInicial.length

// Ordens visíveis no tick n. A ordem k vira a OS #(1039 + k); cada tick traz 4 novas.
function ordensNoTick(n) {
  return etapaInicial.map((etapa, linha) => {
    const k = LINHAS * n + (LINHAS - 1 - linha)
    return {
      numero: String(1039 + k),
      aparelho: aparelhos[k % aparelhos.length],
      defeito: defeitos[k % defeitos.length],
      cliente: clientes[k % clientes.length],
      etapa: etapas[(etapa + n) % etapas.length],
    }
  })
}

// Relógio único do painel: conta ticks em laço lento. Desligado com
// prefers-reduced-motion e com a aba oculta.
function useRelogio(intervaloMs) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer

    const sincronizar = () => {
      clearInterval(timer)
      if (!reduzir.matches && !document.hidden) {
        timer = setInterval(() => setTick((t) => t + 1), intervaloMs)
      }
    }
    const aoMudarMovimento = () => {
      if (reduzir.matches) setTick(0)
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

  return tick
}

// Duas camadas na mesma célula do grid: a que estava escondida recebe o valor novo e
// aparece enquanto a outra some com o valor antigo. Só opacidade, sem layout shift.
const camada = 'col-start-1 row-start-1 transition-opacity duration-500'

function Troca({ a, b, mostrarB, className = '' }) {
  return (
    <span className={`grid ${className}`}>
      <span className={`${camada} ${mostrarB ? 'opacity-0' : 'opacity-100'}`}>{a}</span>
      <span className={`${camada} ${mostrarB ? 'opacity-100' : 'opacity-0'}`}>{b}</span>
    </span>
  )
}

function Chip({ etapa }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg">
      <span className={`size-2 shrink-0 rounded-full ${etapa.ponto}`} />
      {etapa.rotulo}
    </span>
  )
}

function PainelOrdens() {
  const tick = useRelogio(3500)
  // Camada A guarda o último tick par; B, o último ímpar (antes do 1º tick, o próximo).
  const mostrarB = tick % 2 === 1
  const ordensA = ordensNoTick(mostrarB ? tick - 1 : tick)
  const ordensB = ordensNoTick(mostrarB ? tick : Math.max(tick - 1, 1))

  return (
    <div
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

      <ul className="divide-y divide-border">
        {ordensA.map((a, linha) => {
          const b = ordensB[linha]
          return (
            <li
              key={linha}
              className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 px-4 py-3 text-sm sm:grid-cols-[4.5rem_1fr_6.5rem_8.5rem] sm:items-center"
            >
              <Troca mostrarB={mostrarB} className="font-mono font-semibold" a={`#${a.numero}`} b={`#${b.numero}`} />
              <span className="col-start-1 sm:col-start-auto">
                <Troca mostrarB={mostrarB} className="font-medium" a={a.aparelho} b={b.aparelho} />
                <Troca mostrarB={mostrarB} className="text-fg-muted" a={a.defeito} b={b.defeito} />
              </span>
              <Troca
                mostrarB={mostrarB}
                className="col-start-1 text-fg-muted sm:col-start-auto"
                a={a.cliente}
                b={b.cliente}
              />
              <Troca
                mostrarB={mostrarB}
                className="col-start-2 row-start-1 justify-items-end sm:col-start-auto sm:row-start-auto sm:justify-items-start"
                a={<Chip etapa={a.etapa} />}
                b={<Chip etapa={b.etapa} />}
              />
            </li>
          )
        })}
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
