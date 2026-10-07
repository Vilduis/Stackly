import { getLogo } from "@/lib/logos"
import { toneStyle } from "@/lib/tones"
import type { Tool } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ToolMark({
  tool,
  className,
}: {
  tool: Pick<Tool, "slug" | "name" | "category">
  className?: string
}) {
  const logo = getLogo(tool.slug)

  const initial = tool.name
    .replace(/[^a-z0-9]/gi, "")
    .charAt(0)
    .toUpperCase()

  const scale = logo && logo.ratio > 1.4 ? "w-[76%]" : "size-[62%]"
  const gradientId = logo?.gradient ? `logo-${tool.slug}` : null

  let paint: React.CSSProperties | undefined

  if (gradientId) {
    paint = {
      "--logo-fill": `url(#${gradientId})`,
      "--logo-fill-dark": `url(#${gradientId})`,
    } as React.CSSProperties
  } else if (logo?.fondo) {
    paint = {
      "--logo-fill": "#fff",
      "--logo-fill-dark": "#fff",
    } as React.CSSProperties
  } else if (logo?.light) {
    paint = {
      "--logo-fill": logo.light,
      "--logo-fill-dark": logo.dark,
    } as React.CSSProperties
  }

  return (
    <span
      aria-hidden
      style={
        logo
          ? logo.fondo
            ? { backgroundColor: logo.fondo }
            : undefined
          : toneStyle(tool.category)
      }
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-base font-medium",
        logo ? "text-muted-foreground" : "text-tone",
        className
      )}
    >
      {logo ? (
        <svg
          viewBox={logo.viewBox}
          className={cn("tool-mark-logo", scale)}
          style={paint}
          role="presentation"
        >
          {logo.gradient && gradientId ? (
            <defs>
              <linearGradient
                id={gradientId}
                x1={logo.gradient.x1}
                y1={logo.gradient.y1}
                x2={logo.gradient.x2}
                y2={logo.gradient.y2}
              >
                {logo.gradient.stops.map((stop) => (
                  <stop
                    key={stop.offset}
                    offset={stop.offset}
                    stopColor={stop.color}
                  />
                ))}
              </linearGradient>
            </defs>
          ) : null}
          <path d={logo.path} />
        </svg>
      ) : (
        initial
      )}
    </span>
  )
}
