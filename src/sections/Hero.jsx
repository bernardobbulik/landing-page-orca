import CtaButton from '../components/CtaButton.jsx'

export default function Hero() {
  return (
    <section id="topo" aria-labelledby="hero-titulo" className="section-y">
      <div className="container-page">
        <h1 id="hero-titulo" className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          Sua assistência. Em fluxo.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted">
          Controle cada aparelho desde a entrada até a entrega. Recepção, diagnóstico,
          orçamento, aprovação, reparo e testes em um único fluxo.
        </p>
        <div className="mt-8">
          <CtaButton />
          <p className="mt-3 text-sm text-fg-muted">Feito para assistências técnicas de celulares.</p>
        </div>
      </div>
    </section>
  )
}
