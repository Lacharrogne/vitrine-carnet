import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Enveloppe une section pour la faire apparaître en douceur quand elle entre
 * dans le viewport (une seule fois). Respecte prefers-reduced-motion via le CSS.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-init ${shown ? 'reveal-in' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
