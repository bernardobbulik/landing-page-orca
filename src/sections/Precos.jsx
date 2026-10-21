import { useState } from 'react'
import CtaButton from '../components/CtaButton.jsx'
import { planos, comparacao } from '../../content/planos.json'

// Valores comerciais vêm de content/planos.json. Só entra lá o que já existe no
// produto: recurso em desenvolvimento não aparece como disponível.

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

const IconeCheck = ({ className }) => (
  <Icone className={className}>
    <path d="m5 12 5 5 9-10" />
  </Icone>
)

function formatarPreco(valor) {
  if (typeof valor !== 'number') return `R$ ${valor}`
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: Number.isInteger(valor) ? 0 : 2,
  }).format(valor)
}

// Botão do plano em destaque: off-white sobre o cartão Preto Exotek, o maior contraste
// da paleta (fg/bg 19:1), e azul Exo no hover (on-accent/accent 5,4:1). Os outros
// planos ficam no azul padrão. O brilho é um pseudo-elemento claro atrás do texto que
// atravessa o botão já azul no hover, só com transform.
const botaoDestaque = [
  'relative isolate overflow-hidden bg-fg! text-bg! hover:bg-accent! hover:text-on-accent!',
  'before:absolute before:inset-y-0 before:left-1/4 before:-z-10 before:w-1/3 before:-skew-x-20',
  'before:bg-linear-to-r before:from-fg/0 before:via-fg/40 before:to-fg/0',
  'before:transition-transform before:duration-500 hover:before:translate-x-[300%]',
].join(' ')

const limites = [
  { campo: 'usuarios', rotulo: 'Usuários' },
  { campo: 'armazenamento', rotulo: 'Fotos e anexos' },
]

// Plano em destaque vira um cartão escuro: os tokens são remapeados pelo data-surface.
function CartaoPlano({ plano }) {
  const { id, nome, chamada, descricao, precoMensal, destaque, base, itens } = plano

  return (
    <li
      data-surface={destaque ? 'dark' : undefined}
      className={`flex flex-col rounded-card border p-5 md:p-6 ${
        destaque ? 'border-accent bg-bg text-fg lg:-my-4 lg:py-10' : 'border-border bg-surface'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={`${id}-nome`} className="text-xl font-semibold">
          {nome}
        </h3>
        {destaque && (
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-on-accent">
            Mais recomendado
          </span>
        )}
      </div>
      <p className="mt-1 text-sm font-medium">{chamada}</p>

      <p className="mt-4 font-display">
        <span className="text-3xl font-bold tracking-tight lg:text-4xl">{formatarPreco(precoMensal)}</span>
        <span className="text-fg-muted">/mês</span>
      </p>
      <p className="mt-3 text-sm text-fg-muted">{descricao}</p>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-button border border-border bg-border text-sm">
        {limites.map(({ campo, rotulo }) => (
          <div key={campo} className="bg-surface px-3 py-2">
            <dt className="text-xs text-fg-muted">{rotulo}</dt>
            <dd className="font-semibold">{plano[campo]}</dd>
          </div>
        ))}
      </dl>

      {base && <p className="mt-6 text-sm font-semibold">{base}</p>}
      <ul role="list" className={`${base ? 'mt-3' : 'mt-6'} space-y-3`}>
        {itens.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <IconeCheck className="mt-0.5 size-5 shrink-0 text-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <CtaButton aria-describedby={`${id}-nome`} className={`w-full ${destaque ? botaoDestaque : ''}`} />
      </div>
    </li>
  )
}

function Celula({ valor }) {
  if (valor === true) {
    return (
      <>
        <IconeCheck className="mx-auto size-5 text-accent" />
        <span className="sr-only">Incluso</span>
      </>
    )
  }
  if (valor === false) {
    return (
      <>
        <span aria-hidden="true" className="text-fg-muted">
          —
        </span>
        <span className="sr-only">Não incluso</span>
      </>
    )
  }
  return valor
}

const linhaPreco = {
  recurso: 'Preço mensal',
  valores: Object.fromEntries(planos.map((p) => [p.id, formatarPreco(p.precoMensal)])),
}

function LinhaRecurso({ recurso, valores }) {
  return (
    <tr className="border-b border-border">
      <th scope="row" className="sticky left-0 w-2/5 bg-surface px-4 py-3 text-left font-medium md:w-auto">
        {recurso}
      </th>
      {planos.map(({ id }) => (
        <td key={id} className="px-3 py-3 text-center">
          <Celula valor={valores[id]} />
        </td>
      ))}
    </tr>
  )
}

// No celular a tabela começa recolhida; a partir de md fica sempre aberta.
function Comparacao() {
  const [aberta, setAberta] = useState(false)
  const titulo = 'Compare os planos'

  return (
    <div className="mt-14 lg:mt-20">
      <h3 id="comparacao-titulo" className="text-xl font-semibold md:text-2xl">
        <button
          type="button"
          aria-expanded={aberta}
          aria-controls="comparacao-tabela"
          onClick={() => setAberta(!aberta)}
          className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-button border border-border bg-surface px-4 py-3 text-left md:hidden"
        >
          {titulo}
          <Icone className={`size-5 shrink-0 text-accent transition-transform ${aberta ? 'rotate-180' : ''}`}>
            <path d="m6 9 6 6 6-6" />
          </Icone>
        </button>
        <span className="hidden md:inline">{titulo}</span>
      </h3>

      <div
        id="comparacao-tabela"
        role="region"
        aria-labelledby="comparacao-titulo"
        tabIndex={0}
        className={`relative mt-4 overflow-x-auto rounded-card border border-border bg-surface md:mt-6 md:block ${
          aberta ? 'block' : 'hidden'
        }`}
      >
        <table className="w-full min-w-[34rem] border-collapse text-sm md:text-base">
          <caption className="sr-only">Comparação dos recursos e limites de cada plano</caption>
          <thead>
            <tr className="border-b border-border">
              <td className="sticky left-0 bg-surface" />
              {planos.map(({ id, nome, destaque }) => (
                <th key={id} scope="col" className="px-3 py-4 text-center align-bottom font-semibold">
                  {destaque && <span className="block text-xs font-medium text-fg-muted">Mais recomendado</span>}
                  {nome}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <LinhaRecurso {...linhaPreco} />
          </tbody>
          {comparacao.map(({ grupo, linhas }) => (
            <tbody key={grupo}>
              <tr className="border-b border-border bg-bg">
                <th
                  scope="colgroup"
                  colSpan={planos.length + 1}
                  className="sticky left-0 px-4 pt-5 pb-2 text-left text-xs font-semibold tracking-wide text-fg-muted uppercase"
                >
                  {grupo}
                </th>
              </tr>
              {linhas.map((linha) => (
                <LinhaRecurso key={linha.recurso} {...linha} />
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  )
}

export default function Precos() {
  return (
    <section id="precos" aria-labelledby="precos-titulo" className="section-y">
      <div className="container-page">
        <h2 id="precos-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
          O fluxo completo em todos os planos.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">
          Do balcão à entrega sem pagar a mais por isso: o plano acompanha o tamanho da sua equipe.
        </p>

        <ul role="list" className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3 lg:items-stretch lg:gap-6">
          {planos.map((plano) => (
            <CartaoPlano key={plano.id} plano={plano} />
          ))}
        </ul>
        <p className="mt-6 text-sm text-fg-muted lg:mt-10">
          Valores mensais para 1 unidade. Ordens de serviço ilimitadas em todos os planos.
        </p>

        <Comparacao />
      </div>
    </section>
  )
}
