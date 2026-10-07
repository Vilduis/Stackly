"use client"

import { useMemo, useRef } from "react"
import { Search, X } from "lucide-react"

import { trackSpotlight } from "@/components/spotlight"
import { ToolCard } from "@/components/tool-card"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
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
import { countLabel } from "@/lib/format"
import { LEVEL_LABELS, PRICING_LABELS } from "@/lib/labels"
import {
  collectTags,
  EMPTY_FILTERS,
  filterTools,
  hasActiveFilters,
  type Filters,
} from "@/lib/search"
import type { Tool } from "@/lib/types"

const MAX_TAGS = 10

const PAGE_SIZE = 15

const PAGE_WINDOW = 1

const LEVEL_ITEMS: Record<Filters["level"], string> = {
  todos: "Todos los niveles",
  ...LEVEL_LABELS,
}

const PRICING_ITEMS: Record<Filters["pricing"], string> = {
  todos: "Todos los precios",
  ...PRICING_LABELS,
}

const CATEGORY_ITEMS = {
  todas: "Todas las categorías",
  ...Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.name])),
} as Record<Filters["category"], string>

export function ToolExplorer({
  tools,
  filters,
  page,
  onFiltersChange,
  onPageChange,
}: {
  tools: Tool[]
  filters: Filters
  page: number
  onFiltersChange: (filters: Filters) => void
  onPageChange: (page: number) => void
}) {
  const resultsRef = useRef<HTMLDivElement>(null)

  const tags = useMemo(() => collectTags(tools, MAX_TAGS), [tools])
  const results = useMemo(() => filterTools(tools, filters), [tools, filters])
  const isFiltered = hasActiveFilters(filters)

  const pageCount = Math.ceil(results.length / PAGE_SIZE)
  const current = Math.min(page, Math.max(pageCount, 1))
  const visible = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  function update(patch: Partial<Filters>) {
    onFiltersChange({ ...filters, ...patch })
    onPageChange(1)
  }

  function clear() {
    onFiltersChange(EMPTY_FILTERS)
    onPageChange(1)
  }

  function goToPage(next: number) {
    onPageChange(next)

    const grid = resultsRef.current

    if (!grid) {
      return
    }

    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches

    grid.focus({ preventScroll: true })
    grid.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    })
  }

  function toggleTag(tag: string) {
    update({
      tags: filters.tags.includes(tag)
        ? filters.tags.filter((t) => t !== tag)
        : [...filters.tags, tag],
    })
  }

  return (
    <section aria-label="Explorador de herramientas">
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
            className="pl-8 max-sm:h-11"
          />
        </div>

        <FilterSelect
          label="Categoría"
          items={CATEGORY_ITEMS}
          value={filters.category}
          onChange={(category) => update({ category })}
          className="w-full max-sm:h-11 sm:w-52"
        />

        <FilterSelect
          label="Nivel"
          items={LEVEL_ITEMS}
          value={filters.level}
          onChange={(level) => update({ level })}
          className="w-full max-sm:h-11 sm:w-44"
        />

        <FilterSelect
          label="Precio"
          items={PRICING_ITEMS}
          value={filters.pricing}
          onChange={(pricing) => update({ pricing })}
          className="w-full max-sm:h-11 sm:w-44"
        />
      </div>

      {tags.length > 0 ? (
        <div
          role="group"
          aria-label="Etiquetas"
          className="mt-4 flex flex-wrap gap-1.5"
        >
          {tags.map((tag) => (
            <Chip
              key={tag}
              pressed={filters.tags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Chip>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex min-h-8 items-center gap-3">
        <p
          role="status"
          aria-live="polite"
          className="text-xs text-muted-foreground tabular-nums"
        >
          {countLabel(results.length, "herramienta")}
          {pageCount > 1 ? ` · página ${current} de ${pageCount}` : null}
        </p>
        {isFiltered ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="max-sm:h-10"
          >
            <X aria-hidden />
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="mt-8 max-w-md">
          <p className="text-sm text-muted-foreground">
            No hay herramientas que encajen con esos filtros. Quita alguno o
            busca con otras palabras.
          </p>
          <Button variant="outline" onClick={clear} className="mt-4">
            <X aria-hidden />
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div
          ref={resultsRef}
          tabIndex={-1}
          aria-label="Resultados"
          onPointerMove={trackSpotlight}
          className="mt-4 grid scroll-mt-20 gap-4 outline-none sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} showCategory titleAs="h2" />
          ))}
        </div>
      )}

      {pageCount > 1 ? (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={current === 1}
                onClick={() => goToPage(current - 1)}
              />
            </PaginationItem>

            {getPageItems(current, pageCount).map((item, index) =>
              item === null ? (
                <PaginationItem key={`hueco-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={item === current}
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
                disabled={current === pageCount}
                onClick={() => goToPage(current + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </section>
  )
}

function FilterSelect<T extends string>({
  label,
  items,
  value,
  onChange,
  className,
}: {
  label: string
  items: Record<T, string>
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => onChange(next as T)}
    >
      <SelectTrigger aria-label={label} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(items) as [T, string][]).map(([option, text]) => (
          <SelectItem key={option} value={option}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
