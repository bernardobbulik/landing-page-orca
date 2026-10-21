import CtaButton from './components/CtaButton.jsx'
import Logo from './components/Logo.jsx'
import Hero from './sections/Hero.jsx'
import Problema from './sections/Problema.jsx'
import Jornada from './sections/Jornada.jsx'
import Recursos from './sections/Recursos.jsx'
import Resultados from './sections/Resultados.jsx'
import Precos from './sections/Precos.jsx'
import Faq from './sections/Faq.jsx'
import CtaFinal from './sections/CtaFinal.jsx'

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only-focusable fixed top-2 left-2 z-50 rounded-button bg-surface px-4 py-2 font-semibold text-fg"
      >
        Pular para o conteúdo
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-bg">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <a href="#topo" className="shrink-0">
            <Logo className="h-7 w-auto sm:h-8" />
          </a>
          <CtaButton size="sm" />
        </div>
      </header>

      <main id="conteudo">
        <Hero />
        <Problema />
        <Jornada />
        <Recursos />
        <Resultados />
        <Precos />
        <Faq />
        <CtaFinal />
      </main>

      <footer className="border-t border-border">
        <div className="container-page py-8 text-sm text-fg-muted">
          <p>© {new Date().getFullYear()} Exotek. [PREENCHER: razão social / CNPJ]</p>
        </div>
      </footer>
    </>
  )
}
