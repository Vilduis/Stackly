import Link from "next/link"

import { chipVariants } from "@/components/ui/chip"

const SUGGESTIONS = ["React", "Tailwind", "CSS", "Postgres", "iconos"]

export function SearchSuggestions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Prueba con</span>
      {SUGGESTIONS.map((term) => (
        <Link
          key={term}
          href={`/buscar?q=${encodeURIComponent(term)}`}
          className={chipVariants()}
        >
          {term}
        </Link>
      ))}
    </div>
  )
}
