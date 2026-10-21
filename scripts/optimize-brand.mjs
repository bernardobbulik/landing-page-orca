// Gera os arquivos de marca otimizados a partir de docs/brand/originais.
// Uso: npm run brand:images
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'docs/brand/originais'
const OUT = 'src/assets/brand'
const FUNDO = '#FAFAFA'
const OFF_WHITE = [0xfa, 0xfa, 0xfa]
// Pixels com saturação (max - min do RGB) abaixo disso são o grafite do "Exo";
// o azul do símbolo e do "tek" fica acima de 140.
const LIMITE_CINZA = 90

await mkdir(OUT, { recursive: true })

async function variantes(entrada, nome, larguras) {
  const base = sharp(entrada).trim()
  for (const w of larguras) {
    const img = base.clone().resize({ width: w })
    await img.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/${nome}-${w}.webp`)
    await img.clone().avif({ quality: 70 }).toFile(`${OUT}/${nome}-${w}.avif`)
  }
  const { info } = await base.clone().resize({ width: larguras[0] }).toBuffer({ resolveWithObject: true })
  console.log(`${nome}: ${larguras.join(', ')}px — proporção ${info.width}x${info.height}`)
}

// Versão para fundo escuro: troca o grafite por off-white e mantém o alfa,
// preservando o anti-aliasing das bordas. Azul e transparência não mudam.
async function negativo(entrada) {
  const { data, info } = await sharp(entrada).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const saturacao = Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2])
    if (saturacao < LIMITE_CINZA) {
      data[i] = OFF_WHITE[0]
      data[i + 1] = OFF_WHITE[1]
      data[i + 2] = OFF_WHITE[2]
    }
  }
  return sharp(data, { raw: info }).png().toBuffer()
}

await variantes(`${SRC}/logo.png`, 'logo', [320, 640])
await variantes(await negativo(`${SRC}/logo.png`), 'logo-negativo', [320, 640])
await variantes(`${SRC}/logo_img.png`, 'simbolo', [256, 512])

const simbolo = await sharp(`${SRC}/logo_img.png`).trim().toBuffer()
await sharp(simbolo).resize(32, 32, { fit: 'contain', background: '#0000' }).png().toFile('public/favicon-32.png')
await sharp(simbolo)
  .resize(140, 140, { fit: 'contain', background: FUNDO })
  .extend({ top: 20, bottom: 20, left: 20, right: 20, background: FUNDO })
  .flatten({ background: FUNDO })
  .png()
  .toFile('public/apple-touch-icon.png')
console.log('favicons gerados em public/')
