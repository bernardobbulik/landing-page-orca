const iconeProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
  className: 'size-6 text-fg-muted',
}

const DORES = [
  {
    titulo: 'O papel se perde.',
    texto:
      'Ficha no caderno, recibo na gaveta. Quando o cliente volta, ninguém acha o que foi combinado.',
    icone: (
      <svg {...iconeProps}>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    titulo: 'O cliente liga para saber do aparelho.',
    texto: 'O telefone toca e alguém larga a bancada para ir conferir na prateleira.',
    icone: (
      <svg {...iconeProps}>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
      </svg>
    ),
  },
  {
    titulo: 'Peça parada, sem responsável.',
    texto: 'O aparelho espera peça ou aprovação e ninguém sabe quem tem que cobrar.',
    icone: (
      <svg {...iconeProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
]

export default function Problema() {
  return (
    <section id="problema" aria-labelledby="problema-titulo" className="section-y">
      <div className="container-page">
        <h2 id="problema-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
          O equipamento entra, e depois ninguém sabe onde está.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">
          Sem um fluxo registrado, a assistência funciona na memória de quem está no balcão.
        </p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {DORES.map(({ titulo, texto, icone }) => (
            <li
              key={titulo}
              className="group relative cursor-pointer rounded-card border border-border bg-surface p-6 transition-transform duration-200 ease-out hover:-translate-y-1"
            >
              {/* Borda azul do hover: aparece por opacidade (animação só em transform/opacity). */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-card border-2 border-accent opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
              />
              {icone}
              <h3 className="mt-4 text-lg font-semibold">{titulo}</h3>
              <p className="mt-2 text-fg-muted">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
