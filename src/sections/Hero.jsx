import { useEffect, useState } from 'react'
import CtaButton from '../components/CtaButton.jsx'

// Etapas usadas no painel. Cor do status só no ponto; o rótulo é sempre texto em fg.
const etapas = {
  diagnostico: { rotulo: 'Diagnóstico', ponto: 'bg-status-diagnostico' },
  orcamento: { rotulo: 'Em orçamento', ponto: 'bg-status-aguardando' },
  aprovado: { rotulo: 'Aprovado', ponto: 'bg-status-aprovado' },
  reparo: { rotulo: 'Em reparo', ponto: 'bg-status-reparo' },
  testes: { rotulo: 'Testes', ponto: 'bg-status-testes' },
  pronto: { rotulo: 'Pronto', ponto: 'bg-status-pronto' },
}

// Dados ilustrativos do painel (interface de exemplo, sem marcas nem clientes reais).
// A primeira OS é a que alterna entre "Aprovado" e "Em orçamento".
const ordens = [
  { numero: '2318', equipamento: 'Smartphone 6,7″', defeito: 'Tela trincada', cliente: 'Marina D.', tecnico: 'Paulo', etapa: 'alterna' },
  { numero: '2317', equipamento: 'Smartphone dobrável', defeito: 'Dobradiça', cliente: 'Rogério L.', tecnico: 'Aline', etapa: 'reparo' },
  { numero: '2316', equipamento: 'Tablet 10″', defeito: 'Conector de carga', cliente: 'Sônia P.', tecnico: 'Paulo', etapa: 'testes' },
  { numero: '2315', equipamento: 'Smartphone 6,1″', defeito: 'Bateria', cliente: 'Diego S.', tecnico: 'Caio', etapa: 'pronto' },
  { numero: '2314', equipamento: 'Smartwatch', defeito: 'Não liga', cliente: 'Helena C.', tecnico: 'Aline', etapa: 'diagnostico' },
]

const colunas = 'grid-cols-[4rem_minmax(0,1.5fr)_minmax(0,1fr)_4.5rem_7.5rem]'

// Relógio único do painel: conta ticks em laço lento. Desligado com
// prefers-reduced-motion (fica no tick 0) e com a aba oculta.
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

function Chip({ etapa }) {
  return (
    <span className="inline-flex items-center gap-1.5 justify-self-start whitespace-nowrap rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg">
      <span className={`size-2 shrink-0 rounded-full ${etapa.ponto}`} />
      {etapa.rotulo}
    </span>
  )
}

// Os dois estados ocupam a mesma célula do grid: a largura não muda, só a opacidade.
function ChipAlternado({ aprovado }) {
  const camada = 'col-start-1 row-start-1 transition-opacity duration-500'
  return (
    <span className="grid justify-items-start">
      <span className={`${camada} ${aprovado ? 'opacity-100' : 'opacity-0'}`}>
        <Chip etapa={etapas.aprovado} />
      </span>
      <span className={`${camada} ${aprovado ? 'opacity-0' : 'opacity-100'}`}>
        <Chip etapa={etapas.orcamento} />
      </span>
    </span>
  )
}

function Icone({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      {children}
    </svg>
  )
}

const menu = [
  { nome: 'ordens', ativo: true, desenho: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 9h6M9 13h6M9 17h4" /></> },
  { nome: 'clientes', desenho: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" /></> },
  { nome: 'agenda', desenho: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></> },
  { nome: 'relatorios', desenho: <path d="M5 20V11M12 20V4M19 20v-6" /> },
]

function BarraLateral() {
  return (
    <div className="flex flex-col items-center gap-2 border-r border-border bg-bg py-4">
      {menu.map((item) => (
        <span
          key={item.nome}
          className={`relative flex size-9 items-center justify-center rounded-button ${
            item.ativo ? 'border border-border bg-surface text-fg' : 'text-fg-muted'
          }`}
        >
          {item.ativo && <span className="absolute -left-2 h-5 w-0.5 rounded-full bg-accent" />}
          <Icone>{item.desenho}</Icone>
        </span>
      ))}
    </div>
  )
}

function PainelOrdens({ aprovado }) {
  return (
    <div
      role="img"
      aria-label="Exemplo do painel Exotek: lista de ordens de serviço com número, equipamento, cliente, técnico e status, e um aviso de orçamento aprovado pelo cliente."
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

      <div className="grid grid-cols-[3.75rem_minmax(0,1fr)]">
        <BarraLateral />

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-3">
            <p className="font-display font-semibold">
              Ordens de serviço <span className="ml-1 font-sans text-sm font-normal text-fg-muted">23 abertas</span>
            </p>
            <span className="w-40 truncate rounded-button border border-border bg-bg px-3 py-1.5 text-xs text-fg-muted">
              Buscar OS ou cliente
            </span>
          </div>

          <div className={`grid ${colunas} gap-x-3 border-y border-border px-4 py-2 text-xs font-medium text-fg-muted`}>
            <span>OS</span>
            <span>Equipamento</span>
            <span>Cliente</span>
            <span>Técnico</span>
            <span>Status</span>
          </div>

          <ul className="divide-y divide-border">
            {ordens.map((os) => (
              <li key={os.numero} className={`grid ${colunas} items-center gap-x-3 px-4 py-3 text-sm`}>
                <span className="font-mono font-semibold">#{os.numero}</span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{os.equipamento}</span>
                  <span className="block truncate text-xs text-fg-muted">{os.defeito}</span>
                </span>
                <span className="truncate">{os.cliente}</span>
                <span className="truncate text-fg-muted">{os.tecnico}</span>
                {os.etapa === 'alterna' ? <ChipAlternado aprovado={aprovado} /> : <Chip etapa={etapas[os.etapa]} />}
              </li>
            ))}
          </ul>

          {/* Rodapé à direita: o cartão flutuante cobre o lado esquerdo sem esconder dados. */}
          <p className="border-t border-border px-4 py-3 text-right text-xs text-fg-muted">
            Mostrando 5 de 23 · Atualizado agora
          </p>
        </div>
      </div>
    </div>
  )
}

// Aparece junto com o chip "Aprovado" da OS 2318. Sem sombra: o anel na cor do fundo
// destaca o cartão sobre a borda do painel.
function CartaoAprovado({ visivel }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute -bottom-8 left-0 flex items-center sm:left-4 lg:-left-8 gap-3 rounded-card border border-border bg-surface px-4 py-3 ring-4 ring-bg transition-[opacity,translate] duration-500 ${
        visivel ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-fg">
        <Icone>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </Icone>
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap text-sm font-medium">Orçamento aprovado pelo cliente</span>
        <span className="flex items-center gap-1.5 text-xs text-fg-muted">
          <span className="size-2 shrink-0 rounded-full bg-status-aprovado" />
          OS 2318 · Marina D. · agora
        </span>
      </span>
    </div>
  )
}

export default function Hero() {
  // Tick par: "Aprovado" + cartão visível (também o estado parado com reduced-motion).
  const aprovado = useRelogio(4000) % 2 === 0

  return (
    <section id="topo" aria-labelledby="hero-titulo" className="section-y overflow-x-clip">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h1 id="hero-titulo" className="text-4xl font-bold tracking-tight md:text-5xl">
            Do balcão à bancada, cada ordem de serviço sob controle.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-fg-muted">
            Registre a entrada, aprove o orçamento com o cliente e acompanhe o reparo em tempo
            real.
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
        </div>

        {/* No celular o painel mantém a largura de desktop e é recortado pela borda da tela. */}
        <div className="relative -mr-4 md:-mr-8 lg:mr-0">
          <div className="min-w-[40rem] lg:min-w-0">
            <PainelOrdens aprovado={aprovado} />
          </div>
          <CartaoAprovado visivel={aprovado} />
        </div>
      </div>
    </section>
  )
}
