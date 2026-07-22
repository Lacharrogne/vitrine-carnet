type SectionHeaderProps = {
  eyebrow: string
  title: string
  subtitle?: string
  eyebrowClassName?: string
  centered?: boolean
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  eyebrowClassName = 'text-terracotta',
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : ''}>
      <span
        className={`inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] shadow-soft ring-1 ring-bark ${eyebrowClassName}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {eyebrow}
      </span>

      <h2 className="mt-4 font-display text-3xl font-black leading-tight text-espresso sm:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-3 leading-7 text-cacao/80 sm:text-lg ${
            centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
