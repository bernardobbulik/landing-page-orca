import CtaButton from '../components/CtaButton.jsx'

export default function CtaFinal() {
  return (
    <section id="cta-final" aria-labelledby="cta-final-titulo" data-surface="dark" className="section-y">
      <div className="container-page text-center">
        <h2 id="cta-final-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
          Veja a Exotek funcionando na sua rotina.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-fg-muted">
          Mostramos a Exotek com o fluxo da sua loja, do aparelho que chega no balcão até a retirada.
        </p>
        <div className="mt-8">
          <CtaButton />
        </div>
        <p className="mt-8 text-sm font-medium">Tecnologia para quem conserta tecnologia.</p>
      </div>
    </section>
  )
}
