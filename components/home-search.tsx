"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HomeSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        const trimmed = query.trim()
        router.push(
          trimmed ? `/buscar?q=${encodeURIComponent(trimmed)}` : "/buscar"
        )
      }}
      className="flex gap-2"
    >
      <div className="brand-ring relative flex-1 rounded-md">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar herramientas…"
          aria-label="Buscar herramientas"
          className="pl-8"
        />
      </div>
      <Button type="submit" variant="secondary">
        Buscar
      </Button>
    </form>
  )
}
