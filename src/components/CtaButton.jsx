import { CTA } from '../config.js'

const sizes = {
  md: 'px-5 py-3 text-base',
  sm: 'px-4 py-2 text-sm',
}

export default function CtaButton({ size = 'md', className = '' }) {
  return (
    <a
      href={CTA.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center whitespace-nowrap justify-center rounded-button bg-accent font-semibold text-on-accent transition-colors hover:bg-accent-hover ${sizes[size]} ${className}`}
    >
      {CTA.label}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}
