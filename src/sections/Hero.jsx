import { useEffect, useState } from 'react'
import CtaButton from '../components/CtaButton.jsx'
import { planos } from '../../content/planos.json'

// "A partir de": o menor preço mensal de content/planos.json.
const precoInicial = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
  Math.min(...planos.map((p) => p.precoMensal)),
)
const garantias = ['Ordens de serviço ilimitadas', 'Fluxo completo em todos os planos', `A partir de ${precoInicial}/mês`]

// Etapas da OS, na ordem, com o aviso que cada uma gera. Cor do status só no ponto;
// o rótulo é sempre texto em fg.
const etapas = [
  { rotulo: 'Recebido', ponto: 'bg-status-recebido', aviso: 'Nova OS registrada no balcão' },
  { rotulo: 'Diagnóstico', ponto: 'bg-status-diagnostico', aviso: 'Diagnóstico iniciado na bancada' },
  { rotulo: 'Em orçamento', ponto: 'bg-status-aguardando', aviso: 'Orçamento enviado ao cliente' },
  { rotulo: 'Aprovado', ponto: 'bg-status-aprovado', aviso: 'Orçamento aprovado pelo cliente' },
  { rotulo: 'Em reparo', ponto: 'bg-status-reparo', aviso: 'Reparo iniciado pelo técnico' },
  { rotulo: 'Testes', ponto: 'bg-status-testes', aviso: 'Aparelho em testes finais' },
  { rotulo: 'Pronto', ponto: 'bg-status-pronto', aviso: 'Aparelho pronto para retirada' },
]
// Etapa inicial de cada linha (de cima para baixo); a cada tick todas avançam uma.
const etapaInicial = [3, 4, 5, 6, 1]

// Dados ilustrativos (interface de exemplo, sem marcas nem clientes reais). Listas de
// tamanhos que não dividem 5: nenhuma linha repete o valor do tick anterior.
const equipamentos = [
  'Smartwatch', 'Smartphone 6,1″', 'Tablet 10″', 'Smartphone dobrável', 'Smartphone 6,7″',
  'Smartphone 6,5″', 'Tablet 8″', 'Smartphone compacto', 'Smartphone 6,8″', 'Fone sem fio',
  'Smartphone 6,4″',
]
const defeitos = [
  'Não liga', 'Bateria', 'Conector de carga', 'Dobradiça', 'Tela trincada', 'Câmera traseira',
  'Alto-falante', 'Microfone', 'Botão lateral',
]
const clientes = [
  'Helena C.', 'Diego S.', 'Sônia P.', 'Rogério L.', 'Marina D.', 'Fábio M.', 'Lúcia R.',
  'Otávio B.', 'Priscila N.', 'Renan T.', 'Vera A.', 'Igor F.', 'Tânia G.',
]
const tecnicos = ['Aline', 'Caio', 'Paulo', 'Bianca']

const LINHAS = etapaInicial.length

// Ordens visíveis no tick n. A ordem k vira a OS #(2314 + k); cada tick traz 5 novas.
function ordensNoTick(n) {
  return etapaInicial.map((etapa, linha) => {
    const k = LINHAS * n + (LINHAS - 1 - linha)
    return {
      numero: String(2314 + k),
      equipamento: equipamentos[k % equipamentos.length],
      defeito: defeitos[k % defeitos.length],
      cliente: clientes[k % clientes.length],
      tecnico: tecnicos[k % tecnicos.length],
      etapa: etapas[(etapa + n) % etapas.length],
    }
  })
}

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

// Duas camadas na mesma célula do grid: a que estava escondida recebe o valor novo e
// aparece enquanto a outra some com o valor antigo. Só opacidade, sem layout shift.
const camada = 'col-start-1 row-start-1 min-w-0 truncate transition-opacity duration-500'

function Troca({ a, b, mostrarB, className = '' }) {
  return (
    <span className={`grid min-w-0 ${className}`}>
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

function PainelOrdens({ ordensA, ordensB, mostrarB }) {
  return (
    <div
      role="img"
      aria-label="Exemplo do painel Exotek: lista de ordens de serviço com número, equipamento, cliente, técnico e status, e um aviso da última atualização."
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
            {ordensA.map((a, linha) => {
              const b = ordensB[linha]
              return (
                <li key={linha} className={`grid ${colunas} items-center gap-x-3 px-4 py-3 text-sm`}>
                  <Troca mostrarB={mostrarB} className="font-mono font-semibold" a={`#${a.numero}`} b={`#${b.numero}`} />
                  <span className="min-w-0">
                    <Troca mostrarB={mostrarB} className="font-medium" a={a.equipamento} b={b.equipamento} />
                    <Troca mostrarB={mostrarB} className="text-xs text-fg-muted" a={a.defeito} b={b.defeito} />
                  </span>
                  <Troca mostrarB={mostrarB} a={a.cliente} b={b.cliente} />
                  <Troca mostrarB={mostrarB} className="text-fg-muted" a={a.tecnico} b={b.tecnico} />
                  <Troca
                    mostrarB={mostrarB}
                    className="justify-items-start"
                    a={<Chip etapa={a.etapa} />}
                    b={<Chip etapa={b.etapa} />}
                  />
                </li>
              )
            })}
          </ul>

          {/* Rodapé à direita: o aviso flutuante cobre o lado esquerdo sem esconder dados. */}
          <p className="border-t border-border px-4 py-3 text-right text-xs text-fg-muted">
            Mostrando 5 de 23 · Atualizado agora
          </p>
        </div>
      </div>
    </div>
  )
}

function Aviso({ os }) {
  return (
    <>
      <span className="block truncate text-sm font-medium">{os.etapa.aviso}</span>
      <span className="flex items-center gap-1.5 text-xs text-fg-muted">
        <span className={`size-2 shrink-0 rounded-full ${os.etapa.ponto}`} />
        <span className="truncate">
          OS {os.numero} · {os.cliente} · agora
        </span>
      </span>
    </>
  )
}

// Aviso da OS do topo, trocado no mesmo tick da tabela. Largura fixa para não pular
// entre mensagens. Sem sombra: o anel na cor do fundo destaca o cartão sobre o painel.
function AvisoFlutuante({ a, b, mostrarB }) {
  return (
    <div
      aria-hidden="true"
      className="absolute -bottom-8 left-0 flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 ring-4 ring-bg sm:left-4 lg:-left-8"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-fg">
        <Icone>
          <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
          <path d="M10 20.5a2 2 0 0 0 4 0" />
        </Icone>
      </span>
      <Troca mostrarB={mostrarB} className="flex-1" a={<Aviso os={a} />} b={<Aviso os={b} />} />
    </div>
  )
}

export default function Hero() {
  const tick = useRelogio(4000)
  // Camada A guarda o último tick par; B, o último ímpar (antes do 1º tick, o próximo).
  const mostrarB = tick % 2 === 1
  const ordensA = ordensNoTick(mostrarB ? tick - 1 : tick)
  const ordensB = ordensNoTick(mostrarB ? tick : Math.max(tick - 1, 1))

  return (
    <section id="topo" aria-labelledby="hero-titulo" className="section-y overflow-x-clip">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <p className="text-sm font-semibold text-accent">Gestão para assistências técnicas de celulares</p>
          <h1 id="hero-titulo" className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Sua assistência organizada, do primeiro atendimento até a entrega.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-fg-muted">
            Chega de procurar ordens de serviço, perguntar ao técnico sobre um aparelho ou perder
            informações no balcão. Com a Exotek, você acompanha cada etapa em um só lugar.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <CtaButton />
            <a
              href="#jornada"
              className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4"
            >
              Conhecer o sistema
            </a>
          </div>
          <ul role="list" className="mt-8 space-y-2 text-sm text-fg-muted">
            {garantias.map((texto) => (
              <li key={texto} className="flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-4 shrink-0 text-accent"
                >
                  <path d="m5 12 5 5 9-10" />
                </svg>
                {texto}
              </li>
            ))}
          </ul>
        </div>

        {/* No celular o painel mantém a largura de desktop e é recortado pela borda da tela. */}
        <div className="relative -mr-4 md:-mr-8 lg:mr-0">
          <div className="min-w-[40rem] lg:min-w-0">
            <PainelOrdens ordensA={ordensA} ordensB={ordensB} mostrarB={mostrarB} />
          </div>
          <AvisoFlutuante a={ordensA[0]} b={ordensB[0]} mostrarB={mostrarB} />
        </div>
      </div>
    </section>
  )
}
