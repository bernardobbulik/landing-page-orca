import CtaButton from '../components/CtaButton.jsx'

export default function CtaFinal() {
  return (
    <section id="cta-final" aria-labelledby="cta-final-titulo" data-surface="dark" className="section-y">
      <div className="container-page text-center">
        <h2 id="cta-final-titulo" className="text-3xl font-bold tracking-tight md:text-4xl">
          Veja a Exotek funcionando na sua rotina.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-fg-muted">[PREENCHER: texto de apoio do CTA final]</p>
        <div className="mt-8">
          <CtaButton />
        </div>
      </div>
    </section>
  )
}
