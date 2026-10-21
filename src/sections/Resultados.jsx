import dados from '../../content/resultados.json'

// Tudo que é real (números, nomes, depoimentos, fotos) vem de content/resultados.json.
// Campo vazio ou com [PREENCHER] = rascunho: aparece marcado só em desenvolvimento.
// No build de produção o item não é exibido, e a seção some se nada estiver pronto.

const MARCADOR = '[PREENCHER]'
const DEV = import.meta.env.DEV

// O JSON guarda só o nome do arquivo; as fotos ficam em src/assets/resultados/.
const fotos = import.meta.glob('../assets/resultados/*.{webp,avif}', { eager: true, import: 'default' })
const urlFoto = (arquivo) => fotos[`../assets/resultados/${arquivo}`]

const vazio = (valor) => typeof valor !== 'string' || valor.trim() === '' || valor.includes(MARCADOR)

function pendencias(item, obrigatorios, opcionais = []) {
  return [
    ...obrigatorios.filter((campo) => vazio(item[campo])),
    ...opcionais.filter((campo) => typeof item[campo] === 'string' && item[campo].includes(MARCADOR)),
  ]
}

const numeros = (dados.numeros ?? []).map((numero) => ({
  ...numero,
  pendentes: pendencias(numero, ['valor', 'rotulo'], ['fonte']),
}))

const depoimentos = (dados.depoimentos ?? []).map((depoimento) => ({
  ...depoimento,
  pendentes: [
    ...pendencias(depoimento, ['citacao', 'nome', 'funcao', 'empresa']),
    ...(vazio(depoimento.foto) || !urlFoto(depoimento.foto) ? ['foto'] : []),
  ],
}))

const exibir = (lista) => (DEV ? lista : lista.filter(({ pendentes }) => pendentes.length === 0))
const temRascunho = [...numeros, ...depoimentos].some(({ pendentes }) => pendentes.length > 0)

function SeloRascunho({ pendentes }) {
  return (
    <span className="inline-flex w-fit rounded-full bg-accent px-2.5 py-0.5 font-sans text-xs font-semibold text-on-accent">
      Rascunho · falta: {pendentes.join(', ')}
    </span>
  )
}

function Foto({ arquivo, nome }) {
  const src = urlFoto(arquivo)

  if (!src) {
    return (
      <span className="grid size-14 shrink-0 place-items-center rounded-full border border-dashed border-accent bg-bg text-fg-muted">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-6"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      </span>
    )
  }

  const avif = arquivo.endsWith('.webp') ? urlFoto(arquivo.replace(/\.webp$/, '.avif')) : undefined

  return (
    <picture className="shrink-0">
      {avif && <source srcSet={avif} type="image/avif" />}
      <img
        src={src}
        alt={`Foto de ${nome}`}
        width="56"
        height="56"
        loading="lazy"
        decoding="async"
        className="size-14 rounded-full border border-border object-cover"
      />
    </picture>
  )
}

export default function Resultados() {
  const numerosVisiveis = exibir(numeros)
  const depoimentosVisiveis = exibir(depoimentos)

  if (numerosVisiveis.length === 0 && depoimentosVisiveis.length === 0) return null

  return (
    <section id="resultados" aria-labelledby="resultados-titulo" className="section-y">
      <div className="container-page">
        <h2 id="resultados-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
          O que muda na rotina da assistência.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">Menos confusão. Mais aparelhos entregues.</p>

        {DEV && temRascunho && (
          <p
            role="note"
            className="mt-8 rounded-card border border-dashed border-accent bg-surface p-4 text-sm"
          >
            <strong className="font-semibold">Rascunho (visível só em desenvolvimento).</strong>{' '}
            <span className="text-fg-muted">
              Preencha <code className="font-mono text-fg">content/resultados.json</code> com dados reais.
              No build de produção, itens incompletos não aparecem.
            </span>
          </p>
        )}

        {numerosVisiveis.length > 0 && (
          <dl className="mt-10 flex flex-col divide-y divide-border rounded-card border border-border bg-surface sm:flex-row sm:divide-x sm:divide-y-0 lg:mt-12">
            {numerosVisiveis.map(({ valor, rotulo, fonte, pendentes }, i) => (
              <div
                key={i}
                className={`flex min-w-0 flex-col gap-2 p-6 sm:flex-1 md:p-8 ${
                  pendentes.length ? 'outline-2 -outline-offset-2 outline-accent outline-dashed' : ''
                }`}
              >
                <dt className="text-fg-muted">{rotulo}</dt>
                <dd className="order-first font-display text-4xl font-bold tracking-tight break-words md:text-5xl">
                  {valor}
                </dd>
                {fonte && <dd className="text-xs text-fg-muted">{fonte}</dd>}
                {DEV && pendentes.length > 0 && (
                  <dd>
                    <SeloRascunho pendentes={pendentes} />
                  </dd>
                )}
              </div>
            ))}
          </dl>
        )}

        {depoimentosVisiveis.length > 0 && (
          <ul role="list" className="mt-6 grid gap-4 md:grid-cols-2">
            {depoimentosVisiveis.map(({ citacao, nome, funcao, empresa, foto, pendentes }, i) => (
              <li key={i}>
                <figure
                  className={`flex h-full flex-col rounded-card border bg-surface p-6 md:p-8 ${
                    pendentes.length ? 'border-dashed border-accent' : 'border-border'
                  }`}
                >
                  <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-highlight" />
                  {DEV && pendentes.length > 0 && (
                    <span className="mt-4">
                      <SeloRascunho pendentes={pendentes} />
                    </span>
                  )}
                  <blockquote className="mt-5 text-lg">
                    <p>“{citacao}”</p>
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-4 pt-6">
                    <Foto arquivo={foto} nome={nome} />
                    <span className="min-w-0">
                      <span className="block font-semibold">{nome}</span>
                      <span className="block text-sm text-fg-muted">
                        {funcao} · {empresa}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
