import { useEffect, useRef, useState } from 'react'
import CtaButton from '../components/CtaButton.jsx'

// Três capítulos de uma OS (balcão, bancada, entrega), cada um com uma tela grande do
// sistema. As telas são interfaces de exemplo: números de OS, aparelhos, nomes, datas
// e horários são ilustrativos, não dados de clientes reais.

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

const Check = ({ className }) => (
  <Icone className={className}>
    <path d="m5 12 5 5 9-10" />
  </Icone>
)

// Relógio de uma tela: conta passos enquanto `ativo` (tela à vista). Desligado com
// prefers-reduced-motion (volta ao passo 0, que é sempre um estado completo) e com a aba oculta.
function useRelogio(intervaloMs, ativo) {
  const [passo, setPasso] = useState(0)

  useEffect(() => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer

    const sincronizar = () => {
      clearInterval(timer)
      if (ativo && !reduzir.matches && !document.hidden) {
        timer = setInterval(() => setPasso((p) => p + 1), intervaloMs)
      }
    }
    const aoMudarMovimento = () => {
      if (reduzir.matches) setPasso(0)
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
  }, [intervaloMs, ativo])

  return passo
}

// O relógio só anda com a tela visível: a primeira troca acontece diante do visitante.
function useNaTela(ref) {
  const [naTela, setNaTela] = useState(false)

  useEffect(() => {
    const observador = new IntersectionObserver(([entrada]) => setNaTela(entrada.isIntersecting), {
      threshold: 0.3,
    })
    observador.observe(ref.current)
    return () => observador.disconnect()
  }, [ref])

  return naTela
}

// Todas as variantes empilhadas na mesma célula do grid; só a atual aparece. O bloco tem
// o tamanho da maior (nada pula) e a troca é um crossfade, só de opacidade.
const variante = 'col-start-1 row-start-1 min-w-0 transition-opacity duration-700 ease-in-out'

function Alterna({ valores, atual, className = '', children = (v) => v }) {
  return (
    <span className={`grid ${className}`}>
      {[...new Set(valores)].map((v) => (
        <span key={v} className={`${variante} ${v === atual ? 'opacity-100' : 'opacity-0'}`}>
          {children(v)}
        </span>
      ))}
    </span>
  )
}

const suave = 'duration-700 ease-in-out'

// Cor do status só no ponto; o rótulo é sempre texto em fg.
function Chip({ rotulo, ponto }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-bg px-2.5 py-1 text-xs font-medium text-fg">
      <span className={`size-2 shrink-0 rounded-full ${ponto}`} />
      {rotulo}
    </span>
  )
}

// Moldura de app, na mesma linguagem do painel do Hero.
function Moldura({ titulo, rotulo, children }) {
  return (
    <div role="img" aria-label={rotulo} className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </span>
        <span className="flex-1 truncate rounded-button bg-bg px-3 py-1 text-xs text-fg-muted">{titulo}</span>
      </div>
      <div className="p-4 md:p-5">{children}</div>
    </div>
  )
}

const rotuloCampo = 'block text-xs text-fg-muted'
const bloco = 'rounded-card border border-border bg-bg p-3 md:p-4'

// ——— Capítulo 1: abertura da OS no balcão ———

const camposEntrada = [
  ['Cliente', 'Ana P. · WhatsApp (11) 9••••-4821'],
  ['Aparelho', 'iPhone 13 · 128 GB'],
  ['Defeito relatado', 'Tela trincada, toque falhando'],
  ['Acessórios', 'Capa, sem chip'],
]
const checklistEntrada = [
  ['Liga e carrega', 'Ok'],
  ['Tela', 'Trinca no canto superior'],
  ['Câmeras', 'Ok'],
  ['Carcaça', 'Riscos na lateral'],
  ['Botões', 'Ok'],
]
const PENDENTE = 'a verificar'

// QR decorativo 11×11: três cantos de leitura (3×3 com uma faixa vazia em volta) e um
// miolo fixo que parece aleatório.
const QR = 11
const naZona = (x, y, n) => (x < n && y < n) || (x >= QR - n && y < n) || (x < n && y >= QR - n)
const modulosQr = []
for (let y = 0; y < QR; y++) {
  for (let x = 0; x < QR; x++) {
    const ligado = naZona(x, y, 4) ? naZona(x, y, 3) : (x * 31 + y * 17 + x * y * 7) % 5 < 2
    if (ligado) modulosQr.push([x, y])
  }
}

function CodigoQr({ className }) {
  return (
    <svg viewBox={`0 0 ${QR} ${QR}`} aria-hidden="true" className={className} shapeRendering="crispEdges">
      {modulosQr.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
    </svg>
  )
}

// Ciclo de 7 passos: 0 a 5 itens conferidos, com uma pausa no fim. O passo 0 é o
// checklist completo (estado parado com prefers-reduced-motion).
function TelaEntrada({ passo }) {
  const feitos = Math.min((passo + 5) % 7, checklistEntrada.length)
  const completo = feitos === checklistEntrada.length

  return (
    <Moldura
      titulo="Nova ordem de serviço"
      rotulo="Exemplo da tela de abertura de OS: dados do cliente e do aparelho, defeito relatado, checklist de entrada com fotos e etiqueta com QR Code."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display font-semibold">
          OS <span className="font-mono">#1043</span>
        </p>
        <span className="flex items-center gap-3 text-xs text-fg-muted">
          Hoje, 09:15
          <Chip rotulo="Recebido" ponto="bg-status-recebido" />
        </span>
      </div>

      <dl className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-2">
        {camposEntrada.map(([termo, valor]) => (
          <div key={termo} className="min-w-0 rounded-button border border-border px-3 py-2">
            <dt className={rotuloCampo}>{termo}</dt>
            <dd className="truncate text-sm font-medium">{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_9.5rem]">
        <div className={bloco}>
          <p className="flex items-center justify-between text-xs text-fg-muted">
            <span className="font-medium text-fg">Checklist de entrada</span>
            <span>
              {feitos} de {checklistEntrada.length}
            </span>
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {checklistEntrada.map(([item, obs], i) => {
              const feito = i < feitos
              return (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-sm border border-border bg-surface text-accent">
                    <Check className={`size-3 transition-opacity ${suave} ${feito ? 'opacity-100' : 'opacity-0'}`} />
                  </span>
                  <span className="flex min-w-0 gap-1">
                    <span className="shrink-0 font-medium">{item}</span>
                    <span className="text-fg-muted">·</span>
                    <Alterna valores={[PENDENTE, obs]} atual={feito ? obs : PENDENTE} className="text-fg-muted" />
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 flex gap-2">
            {[0, 1, 2, 3].map((n) => (
              <span
                key={n}
                className="grid size-12 place-items-center rounded-button border border-border bg-surface text-fg-muted"
              >
                <Icone className={`size-4 transition-opacity ${suave} ${n < feitos - 1 ? 'opacity-100' : 'opacity-30'}`}>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="12" cy="12" r="3.5" />
                </Icone>
              </span>
            ))}
          </div>
        </div>

        <div className={`${bloco} flex flex-col items-center text-center`}>
          <span className="text-xs font-medium">Etiqueta</span>
          <span className="mt-3 rounded-button border border-border bg-surface p-2 text-fg">
            <CodigoQr className="size-20" />
          </span>
          <span className="mt-2 font-mono text-xs font-semibold">#1043</span>
          <span className="text-xs text-fg-muted">iPhone 13</span>
          <Alterna
            valores={['aguardando', 'impressa']}
            atual={completo ? 'impressa' : 'aguardando'}
            className="mt-3 justify-items-center text-xs"
          >
            {(v) =>
              v === 'impressa' ? (
                <span className="inline-flex items-center gap-1 font-medium">
                  <Check className="size-3.5 text-accent" />
                  Impressa
                </span>
              ) : (
                <span className="text-fg-muted">Após o checklist</span>
              )
            }
          </Alterna>
        </div>
      </div>
    </Moldura>
  )
}

// ——— Capítulo 2: quadro da bancada ———

// Cor da etapa só na barra; o nome da etapa é sempre texto em fg.
const colunasBancada = [
  { etapa: 'Diagnóstico', barra: 'bg-status-diagnostico', fixas: [['1047', 'iPhone 11', 'Não liga', 'BR']] },
  {
    etapa: 'Aguardando aprovação',
    barra: 'bg-status-aguardando',
    fixas: [['1044', 'Galaxy A54', 'Bateria', 'LI']],
  },
  {
    etapa: 'Em reparo',
    barra: 'bg-status-reparo',
    fixas: [
      ['1041', 'Redmi Note 12', 'Conector de carga', 'CA'],
      ['1039', 'iPhone 12', 'Câmera traseira', 'BR'],
    ],
  },
  { etapa: 'Testes', barra: 'bg-status-testes', fixas: [['1040', 'Moto G84', 'Tela', 'LI']] },
]
// Uma OS por vez anda pela bancada, uma coluna por passo, no fim de cada coluna.
const ordensEmFluxo = [
  ['1045', 'Moto G54', 'Tela trincada', 'BR'],
  ['1048', 'Galaxy S21', 'Alto-falante', 'CA'],
]
const VAGA_LIVRE = 'livre'
// O que o balcão vê quando a OS em fluxo chega a cada coluna.
const eventosBancada = [
  { texto: 'Diagnóstico registrado na OS', ponto: 'bg-status-diagnostico' },
  { texto: 'Orçamento enviado ao cliente por link', ponto: 'bg-status-aguardando' },
  { texto: 'Aprovado pelo cliente · peça baixada do estoque', ponto: 'bg-status-reparo' },
  { texto: 'Reparo concluído · checklist de testes iniciado', ponto: 'bg-status-testes' },
]
const tecnicosBancada = [
  { nome: 'Todos', total: 7, ativo: true },
  { nome: 'Bruno', total: 3 },
  { nome: 'Lia', total: 2 },
  { nome: 'Caio', total: 2 },
]

function CartaoOs({ numero, aparelho, defeito, tecnico }) {
  return (
    <span className="block rounded-button border border-border bg-surface px-2.5 py-2 text-xs">
      <span className="flex items-center justify-between gap-2">
        <span className="font-mono font-semibold">#{numero}</span>
        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border bg-bg text-xs font-semibold">
          {tecnico}
        </span>
      </span>
      <span className="mt-1 block truncate font-medium">{aparelho}</span>
      <span className="block truncate text-fg-muted">{defeito}</span>
    </span>
  )
}

function TelaBancada({ passo }) {
  // O passo 0 já mostra a OS no meio do caminho (aprovada), estado parado com reduced-motion.
  const s = passo + 2
  const ordem = Math.floor(s / colunasBancada.length) % ordensEmFluxo.length
  const colunaAtual = s % colunasBancada.length
  const [numero] = ordensEmFluxo[ordem]
  const chaves = ordensEmFluxo.map(([n]) => n)

  return (
    <Moldura
      titulo="Bancada"
      rotulo="Exemplo do quadro da bancada: ordens de serviço em colunas de diagnóstico, aguardando aprovação, em reparo e testes, com o técnico de cada uma; uma OS avança de coluna enquanto o aviso mostra o que aconteceu."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tecnicosBancada.map(({ nome, total, ativo }) => (
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
        <span className="text-xs text-fg-muted">Atualizado agora</span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {colunasBancada.map(({ etapa, barra, fixas }, coluna) => (
          <div key={etapa} className="min-w-0 rounded-card bg-bg p-2">
            <span className={`block h-1 rounded-full ${barra}`} />
            {/* Altura de duas linhas: "Aguardando aprovação" quebra e os cartões seguem alinhados. */}
            <p className="mt-2 flex min-h-[2.5rem] items-start justify-between gap-1 text-xs leading-snug font-medium">
              <span>{etapa}</span>
              <Alterna valores={['com', 'sem']} atual={coluna === colunaAtual ? 'com' : 'sem'} className="text-fg-muted">
                {(v) => fixas.length + (v === 'com' ? 1 : 0)}
              </Alterna>
            </p>
            <ul className="mt-2 space-y-2">
              {fixas.map(([n, aparelho, defeito, tecnico]) => (
                <li key={n}>
                  <CartaoOs numero={n} aparelho={aparelho} defeito={defeito} tecnico={tecnico} />
                </li>
              ))}
              <li>
                <Alterna valores={[VAGA_LIVRE, ...chaves]} atual={coluna === colunaAtual ? numero : VAGA_LIVRE}>
                  {(n) => {
                    if (n === VAGA_LIVRE) return null
                    const [, aparelho, defeito, tecnico] = ordensEmFluxo.find(([k]) => k === n)
                    return (
                      <span className="block rounded-button ring-2 ring-accent">
                        <CartaoOs numero={n} aparelho={aparelho} defeito={defeito} tecnico={tecnico} />
                      </span>
                    )
                  }}
                </Alterna>
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-card border border-border bg-bg px-3 py-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-surface">
          <Icone className="size-4">
            <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
            <path d="M10 20.5a2 2 0 0 0 4 0" />
          </Icone>
        </span>
        <Alterna
          valores={chaves.flatMap((n) => eventosBancada.map((_, i) => `${n}-${i}`))}
          atual={`${numero}-${colunaAtual}`}
          className="min-w-0 flex-1 text-sm"
        >
          {(chave) => {
            const [n, i] = chave.split('-')
            const { texto, ponto } = eventosBancada[i]
            return (
              <span className="flex items-center gap-2">
                <span className={`size-2 shrink-0 rounded-full ${ponto}`} />
                <span className="truncate">
                  <span className="font-medium">{texto}</span>
                  <span className="text-fg-muted"> · OS #{n} · agora</span>
                </span>
              </span>
            )
          }}
        </Alterna>
      </div>
    </Moldura>
  )
}

// ——— Capítulo 3: testes, pronto e entrega ———

const linhaDoTempo = [
  { rotulo: 'Recebido', hora: '09:15', ponto: 'bg-status-recebido' },
  { rotulo: 'Diagnóstico', hora: '10:02', ponto: 'bg-status-diagnostico' },
  { rotulo: 'Aprovado', hora: '10:42', ponto: 'bg-status-aprovado' },
  { rotulo: 'Em reparo', hora: '11:20', ponto: 'bg-status-reparo' },
  { rotulo: 'Testes', hora: '15:40', ponto: 'bg-status-testes' },
  { rotulo: 'Pronto', hora: '16:05', ponto: 'bg-status-pronto' },
  { rotulo: 'Entregue', hora: '17:30', ponto: 'bg-status-entregue' },
]
const TESTES = 4
const PRONTO = 5
const ENTREGUE = 6
// Testes → Pronto → Entregue, com pausa na entrega. O passo 0 é a OS entregue.
const sequenciaEntrega = [ENTREGUE, ENTREGUE, TESTES, PRONTO]
const testes = ['Tela e toque', 'Câmeras', 'Carga', 'Áudio']
const reparosAnteriores = [
  ['0877', 'Troca de bateria', 'abr/2026'],
  ['0512', 'Conector de carga', 'ago/2025'],
]

function TelaEntrega({ passo }) {
  const etapa = sequenciaEntrega[passo % sequenciaEntrega.length]

  return (
    <Moldura
      titulo="OS #1042"
      rotulo="Exemplo da OS na entrega: linha do tempo com o horário de cada etapa, checklist de testes, aviso de pronto enviado por WhatsApp, garantia e reparos anteriores do aparelho."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="min-w-0">
          <span className="font-display font-semibold">iPhone 13</span>
          <span className="text-sm text-fg-muted"> · Ana P. · Troca de tela</span>
        </p>
        <Alterna valores={[TESTES, PRONTO, ENTREGUE]} atual={etapa} className="justify-items-end">
          {(i) => <Chip rotulo={linhaDoTempo[i].rotulo} ponto={linhaDoTempo[i].ponto} />}
        </Alterna>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <div className={bloco}>
          <p className="text-xs font-medium">Linha do tempo</p>
          <ol className="mt-3 space-y-2.5 border-l border-border pl-4">
            {linhaDoTempo.map(({ rotulo, hora, ponto }, i) => {
              const feito = i <= etapa
              return (
                <li key={rotulo} className="relative flex items-center justify-between gap-3 text-sm">
                  <span
                    className={`absolute top-1/2 -left-[21px] size-2.5 -translate-y-1/2 rounded-full border-2 border-bg transition-opacity ${suave} ${ponto} ${
                      feito ? 'opacity-100' : 'opacity-25'
                    }`}
                  />
                  <span className={i === etapa ? 'font-semibold' : feito ? '' : 'text-fg-muted'}>{rotulo}</span>
                  <Alterna valores={['—', hora]} atual={feito ? hora : '—'} className="justify-items-end font-mono text-xs text-fg-muted"
                  />
                </li>
              )
            })}
          </ol>
        </div>

        <div className="space-y-4">
          <div className={bloco}>
            <p className="text-xs font-medium">Checklist de testes</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              {testes.map((item) => (
                <li key={item} className="flex min-w-0 items-center gap-1.5">
                  <Alterna valores={['ok', 'testando']} atual={etapa >= PRONTO ? 'ok' : 'testando'} className="shrink-0">
                    {(v) =>
                      v === 'ok' ? (
                        <Check className="size-4 text-accent" />
                      ) : (
                        <span className="mt-1 block size-2 rounded-full bg-status-testes" />
                      )
                    }
                  </Alterna>
                  <span className="truncate">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`rounded-card rounded-tl-sm border border-border bg-bg px-3 py-2.5 text-sm transition-opacity ${suave} ${
              etapa >= PRONTO ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <span className="block text-xs text-fg-muted">WhatsApp · enviado automaticamente</span>
            Ana, seu iPhone 13 está pronto para retirada.
            <span className="block text-right text-xs text-fg-muted">16:05</span>
          </div>

          <div className={bloco}>
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Icone className="size-4 text-accent">
                <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6z" />
                <path d="m9 12 2 2 4-4" />
              </Icone>
              Garantia até 19/01/2027
            </p>
            <p className="mt-2 text-xs text-fg-muted">Reparos anteriores deste aparelho</p>
            <ul className="mt-1 space-y-1 text-sm">
              {reparosAnteriores.map(([n, servico, quando]) => (
                <li key={n} className="flex justify-between gap-2">
                  <span className="truncate">
                    <span className="font-mono font-semibold">#{n}</span> · {servico}
                  </span>
                  <span className="shrink-0 text-xs text-fg-muted">{quando}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Moldura>
  )
}

// ——— Capítulos ———

const capitulos = [
  {
    id: 'balcao',
    etiqueta: 'No balcão',
    titulo: 'O aparelho chegou? Registre tudo no atendimento.',
    texto:
      'Cliente, aparelho, defeito relatado, acessórios e fotos entram na OS antes de o cliente sair da loja. A etiqueta com QR Code sai na hora e acompanha o aparelho até a bancada.',
    marcadores: ['Checklist de entrada com fotos', 'Etiqueta com QR Code e impressão térmica', 'Aviso de recebimento por WhatsApp'],
    Tela: TelaEntrada,
    intervalo: 1900,
  },
  {
    id: 'bancada',
    etiqueta: 'Na bancada',
    titulo: 'Foi para a bancada? Acompanhe sem interromper o técnico.',
    texto:
      'Diagnóstico, orçamento e aprovação ficam na OS. O cliente aprova pelo link, a peça sai do estoque e o quadro mostra cada aparelho com a etapa e o técnico responsável.',
    marcadores: ['Quadro da bancada por técnico', 'Orçamento com peças do estoque', 'Aprovação do cliente por link'],
    Tela: TelaBancada,
    intervalo: 2800,
    // Quadro de 4 colunas: no celular mantém a largura e é recortado pela borda da tela.
    larguraMinima: true,
  },
  {
    id: 'entrega',
    etiqueta: 'Na entrega',
    titulo: 'Ficou pronto? Tenha o histórico até a entrega.',
    texto:
      'Checklist de testes, aviso de pronto, garantia e retirada ficam registrados. Se o aparelho voltar, você sabe o que foi feito e quando.',
    marcadores: ['Checklist de testes', 'Link de acompanhamento para o cliente', 'Histórico e garantia por aparelho'],
    Tela: TelaEntrega,
    intervalo: 2600,
  },
]

function Capitulo({ indice, etiqueta, titulo, texto, marcadores, Tela, intervalo, larguraMinima }) {
  const ref = useRef(null)
  const naTela = useNaTela(ref)
  const passo = useRelogio(intervalo, naTela)
  // Capítulo do meio troca de lado no desktop; a tela fica sempre com a coluna larga.
  const invertido = indice % 2 === 1

  return (
    <li
      className={`grid items-center gap-8 lg:gap-14 ${
        invertido ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : 'lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]'
      }`}
    >
      <div className={invertido ? 'lg:order-2' : undefined}>
        <p className="flex items-center gap-3 text-sm font-semibold">
          <span className="font-display text-fg-muted">{String(indice + 1).padStart(2, '0')}</span>
          <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-highlight" />
          {etiqueta}
        </p>
        <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">{titulo}</h3>
        <p className="mt-4 text-lg text-fg-muted">{texto}</p>
        <ul role="list" className="mt-6 space-y-2.5">
          {marcadores.map((item) => (
            <li key={item} className="flex items-start gap-2.5 font-medium">
              <Check className="mt-0.5 size-5 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <figure ref={ref} className={`min-w-0 ${invertido ? 'lg:order-1' : ''}`}>
        <div className={larguraMinima ? '-mr-4 md:mr-0' : undefined}>
          <div className={larguraMinima ? 'min-w-[38rem] md:min-w-0' : undefined}>
            <Tela passo={passo} />
          </div>
        </div>
        <figcaption className="mt-3 text-xs text-fg-muted">Tela do sistema com dados de exemplo.</figcaption>
      </figure>
    </li>
  )
}

export default function Jornada() {
  return (
    <section id="jornada" aria-labelledby="jornada-titulo" className="section-y overflow-x-clip">
      <div className="container-page">
        <h2 id="jornada-titulo" className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          Do balcão à entrega: veja uma OS de ponta a ponta.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">
          Siga um aparelho pela assistência. Estas são as telas que o balcão e a bancada usam todos os dias.
        </p>

        <ol className="mt-12 space-y-16 lg:mt-16 lg:space-y-24">
          {capitulos.map(({ id, ...capitulo }, i) => (
            <Capitulo key={id} indice={i} {...capitulo} />
          ))}
        </ol>

        <div className="mt-16 flex flex-col gap-6 rounded-card border border-border bg-surface p-6 md:flex-row md:items-center md:justify-between md:p-8 lg:mt-24">
          <div>
            <p className="font-display text-xl font-semibold md:text-2xl">Quer ver isso com os aparelhos da sua loja?</p>
            <p className="mt-2 text-fg-muted">
              Na demonstração, a gente percorre o fluxo da sua assistência, do balcão à entrega.
            </p>
          </div>
          <CtaButton className="shrink-0" />
        </div>
      </div>
    </section>
  )
}
