import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

export function ReasonList({
  items,
  positive,
}: {
  items: string[]
  positive: boolean
}) {
  const Icon = positive ? Check : X

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
          <span
            aria-hidden
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
              positive
                ? "border-positive/25 bg-positive/10 text-positive"
                : "border-negative/25 bg-negative/10 text-negative"
            )}
          >
            <Icon className="size-3.5" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}
