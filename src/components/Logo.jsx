import logoAvif320 from '../assets/brand/logo-320.avif'
import logoAvif640 from '../assets/brand/logo-640.avif'
import logoWebp320 from '../assets/brand/logo-320.webp'
import logoWebp640 from '../assets/brand/logo-640.webp'
import negativoAvif320 from '../assets/brand/logo-negativo-320.avif'
import negativoAvif640 from '../assets/brand/logo-negativo-640.avif'
import negativoWebp320 from '../assets/brand/logo-negativo-320.webp'
import negativoWebp640 from '../assets/brand/logo-negativo-640.webp'

const versoes = {
  light: { avif: [logoAvif320, logoAvif640], webp: [logoWebp320, logoWebp640] },
  dark: { avif: [negativoAvif320, negativoAvif640], webp: [negativoWebp320, negativoWebp640] },
}

const srcSet = ([w320, w640]) => `${w320} 320w, ${w640} 640w`

// tone="dark" em seções com data-surface="dark" (versão com "Exo" off-white).
export default function Logo({ tone = 'light', className = 'h-8 w-auto' }) {
  const { avif, webp } = versoes[tone]
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(avif)} sizes="135px" />
      <img
        src={webp[0]}
        srcSet={srcSet(webp)}
        sizes="135px"
        width="320"
        height="76"
        alt="Exotek"
        decoding="async"
        className={className}
      />
    </picture>
  )
}
