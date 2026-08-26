"use client"

import { useMemo, useRef, useState } from "react"
import { Search, X } from "lucide-react"

import { trackSpotlight } from "@/components/spotlight"
import { ToolCard } from "@/components/tool-card"
import { badgeVariants } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORIES } from "@/lib/categories"
import {
  collectTags,
  EMPTY_FILTERS,
  filterTools,
  hasActiveFilters,
  type Filters,
} from "@/lib/search"
import type { Tool } from "@/lib/types"
import { cn } from "@/lib/utils"

const MAX_TAGS = 10

const PAGE_SIZE = 15

const PAGE_WINDOW = 1

const LEVEL_ITEMS: Record<string, string> = {
  todos: "Todos los niveles",
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
}

const PRICING_ITEMS: Record<string, string> = {
  todos: "Todos los precios",
  gratis: "Gratis",
  freemium: "Freemium",
  pago: "De pago",
}

const CATEGORY_ITEMS: Record<string, string> = {
  todas: "Todas las categorías",
  ...Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.name])),
}

export function ToolExplorer({
  tools,
  showCategoryFilter = false,
  initialQuery = "",
}: {
  tools: Tool[]
  showCategoryFilter?: boolean
  initialQuery?: string
}) {
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    query: initialQuery,
  })
  const [page, setPage] = useState(1)
  const resultsRef = useRef<HTMLDivElement>(null)

  const tags = useMemo(() => collectTags(tools, MAX_TAGS), [tools])
  const results = useMemo(() => filterTools(tools, filters), [tools, filters])
  const isFiltered = hasActiveFilters(filters)

  const pageCount = Math.ceil(results.length / PAGE_SIZE)
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function update(patch: Partial<Filters>) {
    setFilters((current) => ({ ...current, ...patch }))
    setPage(1)
  }

  function clear() {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  function goToPage(next: number) {
    setPage(next)
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function toggleTag(tag: string) {
    update({
      tags: filters.tags.includes(tag)
        ? filters.tags.filter((t) => t !== tag)
        : [...filters.tags, tag],
    })
  }

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={filters.query}
            onChange={(event) => update({ query: event.target.value })}
            placeholder="Buscar por nombre o tecnología…"
            aria-label="Buscar herramientas"
            className="pl-8"
          />
        </div>

        {showCategoryFilter ? (
          <Select
            items={CATEGORY_ITEMS}
            value={filters.category}
            onValueChange={(value) =>
              update({ category: value as Filters["category"] })
            }
          >
            <SelectTrigger aria-label="Categoría" className="w-full sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_ITEMS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <Select
          items={LEVEL_ITEMS}
          value={filters.level}
          onValueChange={(value) =>
            update({ level: value as Filters["level"] })
          }
        >
          <SelectTrigger aria-label="Nivel" className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LEVEL_ITEMS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={PRICING_ITEMS}
          value={filters.pricing}
          onValueChange={(value) =>
            update({ pricing: value as Filters["pricing"] })
          }
        >
          <SelectTrigger aria-label="Precio" className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PRICING_ITEMS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => {
            const active = filters.tags.includes(tag)

            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-pressed={active}
                className={cn(
                  badgeVariants({ variant: active ? "default" : "outline" }),
                  "cursor-pointer transition-colors",
                  !active && "text-muted-foreground hover:bg-muted"
                )}
              >
                {tag}
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          {results.length}{" "}
          {results.length === 1 ? "herramienta" : "herramientas"}
          {pageCount > 1 ? ` · página ${page} de ${pageCount}` : null}
        </p>
        {isFiltered ? (
          <Button variant="ghost" size="sm" onClick={clear}>
            <X />
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No hay herramientas que encajen con esos filtros. Prueba a quitar
          alguno.
        </p>
      ) : (
        <div
          ref={resultsRef}
          onPointerMove={trackSpotlight}
          className="mt-4 grid scroll-mt-8 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              showCategory={showCategoryFilter}
            />
          ))}
        </div>
      )}

      {pageCount > 1 ? (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
              />
            </PaginationItem>

            {getPageItems(page, pageCount).map((item, index) =>
              item === null ? (
                <PaginationItem key={`hueco-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={item === page}
                    aria-label={`Ir a la página ${item}`}
                    onClick={() => goToPage(item)}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                disabled={page === pageCount}
                onClick={() => goToPage(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </section>
  )
}

function getPageItems(current: number, total: number): (number | null)[] {
  const items: (number | null)[] = []
  let previous = 0

  for (let page = 1; page <= total; page++) {
    const isEdge = page === 1 || page === total
    const isNear = Math.abs(page - current) <= PAGE_WINDOW

    if (!isEdge && !isNear) {
      continue
    }

    if (previous && page - previous > 1) {
      items.push(null)
    }

    items.push(page)
    previous = page
  }

  return items
}
