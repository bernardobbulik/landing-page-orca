// Situações do dia a dia do balcão: a fala que todo dono de assistência já ouviu
// e o que acontece hoje, sem um fluxo registrado.
const SITUACOES = [
  {
    fala: 'Já ficou pronto?',
    texto: 'O telefone toca, alguém larga a bancada e vai conferir na prateleira. O reparo para enquanto isso.',
  },
  {
    fala: 'Esse risco não estava aí.',
    texto: 'Sem foto na entrada, é a palavra do cliente contra a do balcão. E quem perde é a loja.',
  },
  {
    fala: 'Com quem está esse aparelho?',
    texto: 'A peça chegou e o orçamento foi aprovado, mas a OS ficou parada porque ninguém era o responsável.',
  },
]

export default function Problema() {
  return (
    <section id="problema" aria-labelledby="problema-titulo" className="section-y">
      <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-6">
        <div>
          <h2 id="problema-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
            O aparelho entra. Depois, ninguém sabe onde está.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-fg-muted">
            Sem um fluxo registrado, a assistência funciona na memória de quem está no balcão. Você já
            ouviu estas três frases esta semana.
          </p>
        </div>

        <ol className="border-t border-border lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {SITUACOES.map(({ fala, texto }, i) => (
            <li
              key={fala}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-border py-6 md:grid-cols-[3.5rem_minmax(0,1fr)] md:py-8"
            >
              <span aria-hidden="true" className="font-display text-sm font-semibold text-fg-muted md:text-base">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">“{fala}”</h3>
                <p className="mt-2 max-w-xl text-fg-muted">{texto}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Depois da lista no celular; no desktop, sob o título (mesma ordem de leitura). */}
        <p className="text-lg font-semibold lg:col-start-1 lg:row-start-2">Com a Exotek, a resposta está na OS.</p>
      </div>
    </section>
  )
}
