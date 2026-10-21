import { useEffect, useState } from 'react'
import CtaButton from '../components/CtaButton.jsx'

// Dados ilustrativos do painel (interface de exemplo, não são clientes reais).
const ordens = [
  { numero: '1042', aparelho: 'iPhone 13', defeito: 'Troca de tela', cliente: 'Ana P.', status: 'alterna' },
  { numero: '1041', aparelho: 'Galaxy A54', defeito: 'Bateria', cliente: 'Carlos M.', status: 'reparo' },
  { numero: '1040', aparelho: 'Moto G84', defeito: 'Conector de carga', cliente: 'Juliana R.', status: 'testes' },
  { numero: '1039', aparelho: 'Redmi Note 12', defeito: 'Não liga', cliente: 'Rafael S.', status: 'pronto' },
]

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
  const aprovado = useAlternancia(3500)

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
        {ordens.map((os) => (
          <li
            key={os.numero}
            className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 px-4 py-3 text-sm sm:grid-cols-[4.5rem_1fr_6.5rem_8.5rem] sm:items-center"
          >
            <span className="font-mono font-semibold">#{os.numero}</span>
            <span className="col-start-1 sm:col-start-auto">
              <span className="font-medium">{os.aparelho}</span>
              <span className="block text-fg-muted">{os.defeito}</span>
            </span>
            <span className="col-start-1 text-fg-muted sm:col-start-auto">{os.cliente}</span>
            <span className="col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto">
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
