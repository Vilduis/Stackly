import Link from "next/link"

import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const SUGGESTIONS = ["React", "Tailwind", "CSS", "Postgres", "iconos"]

export function SearchSuggestions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Prueba con</span>
      {SUGGESTIONS.map((term) => (
        <Link
          key={term}
          href={`/buscar?q=${encodeURIComponent(term)}`}
          className={cn(
            badgeVariants({ variant: "outline" }),
            "font-mono text-muted-foreground transition-colors hover:bg-muted hover:text-foreground max-sm:h-9 max-sm:px-3"
          )}
        >
          {term}
        </Link>
      ))}
    </div>
  )
}
