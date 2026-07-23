/**
 * Cadre « navigateur » élégant autour d'une capture d'écran d'un carnet.
 */
export default function BrowserFrame({
  src,
  alt,
  url,
  className = '',
}: {
  src: string
  alt: string
  url?: string
  className?: string
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-card shadow-lift ring-1 ring-bark ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-bark bg-linen px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-terracotta/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-honey/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-sage/60" />

        {url && (
          <span className="ml-3 hidden truncate rounded-full bg-white/70 px-3 py-0.5 text-xs font-semibold text-hazel ring-1 ring-bark sm:inline">
            {url}
          </span>
        )}
      </div>

      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block h-[300px] w-full object-cover object-top sm:h-[360px]"
      />
    </div>
  )
}
