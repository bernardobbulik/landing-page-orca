// Recursos contados pela situação que resolvem: a pergunta de balcão em destaque, a
// resposta logo abaixo. Seção escura para dar contraste depois das telas da Jornada.

function Icone({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      {children}
    </svg>
  )
}

const recursos = [
  {
    recurso: 'Link de acompanhamento',
    situacao: 'O cliente ligou perguntando se ficou pronto?',
    resposta:
      'Ele recebe um link e acompanha o aparelho sozinho. Se ligar mesmo assim, você busca a OS e responde sem sair do balcão.',
    icone: (
      <>
        <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
        <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
      </>
    ),
  },
  {
    recurso: 'Aviso automático por WhatsApp',
    situacao: 'Ficou pronto e ninguém avisou?',
    resposta: 'A cada etapa, o cliente recebe o aviso no WhatsApp. Ninguém para a bancada para ligar.',
    icone: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
  },
  {
    recurso: 'Checklist de entrada com fotos',
    situacao: '“Esse risco não estava aí.”',
    resposta: 'Fotos e checklist da entrada ficam na OS, com data e hora. A conversa na retirada acaba rápido.',
    icone: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="12" cy="12" r="3.5" />
      </>
    ),
  },
  {
    recurso: 'Etiqueta com QR Code',
    situacao: 'Prateleira cheia de aparelho parecido?',
    resposta: 'Recebeu. Escaneou. Resolveu. A etiqueta sai impressa na entrada e abre a OS certa na hora.',
    icone: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18v2M18 14h2" />
      </>
    ),
  },
  {
    recurso: 'Peças e estoque',
    situacao: 'Prometeu o prazo e faltou a peça?',
    resposta: 'Veja quantas peças tem na prateleira antes de passar o prazo ao cliente. A peça usada sai do estoque pela OS.',
    icone: (
      <>
        <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
        <path d="m3 8 9 5 9-5M12 13v8" />
      </>
    ),
  },
  {
    recurso: 'Histórico e garantia por aparelho',
    situacao: 'Voltou com o mesmo defeito?',
    resposta: 'O histórico mostra o que foi trocado, o que foi testado e se o aparelho ainda está na garantia.',
    icone: (
      <>
        <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
]

export default function Recursos() {
  return (
    <section id="recursos" aria-labelledby="recursos-titulo" data-surface="dark" className="section-y">
      <div className="container-page">
        <h2 id="recursos-titulo" className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          Feito para o que acontece no balcão todo dia.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">As perguntas de sempre, respondidas na própria OS.</p>

        <ul role="list" className="mt-10 grid gap-x-8 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-x-12">
          {recursos.map(({ recurso, situacao, resposta, icone }) => (
            <li key={recurso} className="border-t border-fg-muted/25 py-8">
              <p className="flex items-center gap-2.5 text-sm font-medium text-fg-muted">
                <span className="text-accent">
                  <Icone>{icone}</Icone>
                </span>
                {recurso}
              </p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight md:text-2xl">{situacao}</h3>
              <p className="mt-3 text-fg-muted">{resposta}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
