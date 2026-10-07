import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-medium whitespace-nowrap ring-1 ring-border transition-colors outline-none select-none not-aria-pressed:text-muted-foreground not-aria-pressed:hover:bg-muted not-aria-pressed:hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 max-sm:h-10 max-sm:px-3.5 [&>svg]:size-3.5 [&>svg]:shrink-0",
  {
    variants: {
      accent: {
        primary:
          "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:ring-primary",
        tone: "aria-pressed:bg-tone/15 aria-pressed:text-foreground aria-pressed:ring-tone/40",
      },
    },
    defaultVariants: {
      accent: "primary",
    },
  }
)

function Chip({
  className,
  accent,
  pressed,
  ...props
}: Omit<React.ComponentProps<"button">, "aria-pressed"> &
  VariantProps<typeof chipVariants> & { pressed?: boolean }) {
  return (
    <button
      type="button"
      data-slot="chip"
      aria-pressed={pressed}
      className={cn(chipVariants({ accent }), className)}
      {...props}
    />
  )
}

export { Chip, chipVariants }
