"use client"

const pending = new Map<HTMLElement, { clientX: number; clientY: number }>()

export function trackSpotlight(event: React.PointerEvent<HTMLElement>) {
  const card = (event.target as Element).closest<HTMLElement>(
    "[data-spotlight]"
  )

  if (!card) {
    return
  }

  const { clientX, clientY } = event

  if (pending.has(card)) {
    pending.set(card, { clientX, clientY })
    return
  }

  pending.set(card, { clientX, clientY })

  requestAnimationFrame(() => {
    const point = pending.get(card)
    pending.delete(card)

    if (!point) {
      return
    }

    const rect = card.getBoundingClientRect()

    card.style.setProperty("--mx", `${point.clientX - rect.left}px`)
    card.style.setProperty("--my", `${point.clientY - rect.top}px`)
  })
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
