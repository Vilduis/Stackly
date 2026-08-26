"use client"

export function trackSpotlight(event: React.PointerEvent<HTMLElement>) {
  const card = (event.target as Element).closest<HTMLElement>(
    "[data-spotlight]"
  )

  if (!card) {
    return
  }

  const rect = card.getBoundingClientRect()

  card.style.setProperty("--mx", `${event.clientX - rect.left}px`)
  card.style.setProperty("--my", `${event.clientY - rect.top}px`)
}

export function Spotlight({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className} onPointerMove={trackSpotlight}>
      {children}
    </div>
  )
}
