import { useState } from 'react'

// Respostas dependem de informação comercial/técnica que ainda não temos:
// tudo o que é fato sobre o produto fica como [PREENCHER].
const perguntas = [
  {
    id: 'migracao',
    pergunta: 'Dá para trazer os dados da planilha ou do sistema que uso hoje?',
    resposta:
      '[PREENCHER: o que pode ser importado (clientes, aparelhos, histórico de OS), de quais formatos ou sistemas e quem faz a importação.]',
  },
  {
    id: 'treinamento',
    pergunta: 'Minha equipe precisa de treinamento para usar?',
    resposta:
      'O sistema segue o caminho que o aparelho já faz na sua loja: entrada no balcão, diagnóstico, orçamento, aprovação, reparo, testes e retirada. [PREENCHER: formato do treinamento (online, presencial, vídeos), duração e se está incluso no plano.]',
  },
  {
    id: 'documentos',
    pergunta: 'Quais documentos o sistema emite?',
    resposta:
      '[PREENCHER: documentos emitidos (OS de entrada, orçamento, termo de garantia, recibo) e se emite nota fiscal de serviço.]',
  },
  {
    id: 'suporte',
    pergunta: 'Como funciona o suporte?',
    resposta: '[PREENCHER: canais de atendimento, horário e tempo de resposta.]',
  },
  {
    id: 'seguranca',
    pergunta: 'Meus dados e os dos meus clientes ficam seguros?',
    resposta:
      '[PREENCHER: onde os dados ficam hospedados, frequência de backup, controle de acesso por usuário e adequação à LGPD.]',
  },
  {
    id: 'cancelamento',
    pergunta: 'Posso cancelar quando quiser?',
    resposta:
      '[PREENCHER: fidelidade, multa, aviso prévio e como exportar os dados ao cancelar.]',
  },
]

function ItemFaq({ id, pergunta, resposta }) {
  const [aberto, setAberto] = useState(false)
  const botaoId = `faq-${id}-botao`
  const painelId = `faq-${id}-resposta`

  return (
    <li className="border-b border-border">
      <h3 className="text-base font-semibold md:text-lg">
        <button
          type="button"
          id={botaoId}
          aria-expanded={aberto}
          aria-controls={painelId}
          onClick={() => setAberto(!aberto)}
          className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent"
        >
          {pergunta}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`size-5 shrink-0 text-accent transition-transform ${aberto ? 'rotate-45' : ''}`}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </h3>
      <div id={painelId} role="region" aria-labelledby={botaoId} hidden={!aberto}>
        <p className="max-w-2xl pb-6 text-fg-muted">{resposta}</p>
      </div>
    </li>
  )
}

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-titulo" className="section-y">
      <div className="container-page grid gap-8 lg:grid-cols-3 lg:gap-12">
        <div>
          <h2 id="faq-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
            Perguntas frequentes.
          </h2>
          <p className="mt-4 text-lg text-fg-muted">O que o dono da assistência pergunta antes de trocar de sistema.</p>
        </div>

        <ul role="list" className="border-t border-border lg:col-span-2">
          {perguntas.map((item) => (
            <ItemFaq key={item.id} {...item} />
          ))}
        </ul>
      </div>
    </section>
  )
}
