import { Badge } from "@/components/ui/badge"
import { LEVEL_LABELS, LEVEL_STEPS, PRICING_LABELS } from "@/lib/labels"
import type { Level, Pricing } from "@/lib/types"
import { cn } from "@/lib/utils"

const PRICING_STYLES: Record<Pricing, string> = {
  gratis:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  freemium:
    "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  pago: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
}

export function PricingBadge({ pricing }: { pricing: Pricing }) {
  return (
    <Badge variant="outline" className={PRICING_STYLES[pricing]}>
      {PRICING_LABELS[pricing]}
    </Badge>
  )
}

export function LevelBadge({ level }: { level: Level }) {
  const steps = LEVEL_STEPS[level]

  return (
    <Badge variant="outline" className="gap-1.5">
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={cn(
              "size-1.5 rounded-full",
              step <= steps
                ? "bg-primary dark:bg-(--brand-purple)"
                : "bg-foreground/15"
            )}
          />
        ))}
      </span>
      {LEVEL_LABELS[level]}
    </Badge>
  )
}
