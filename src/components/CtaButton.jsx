import { CTA } from '../config.js'

const sizes = {
  md: 'px-5 py-3 text-base',
  sm: 'px-4 py-2 text-sm',
}

// Props extras (ex.: aria-describedby) vão para o <a>; rótulo e link são sempre os de config.js.
export default function CtaButton({ size = 'md', className = '', ...props }) {
  return (
    <a
      {...props}
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
