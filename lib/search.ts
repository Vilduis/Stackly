import { CATEGORIES } from "@/lib/categories"
import { LEVEL_LABELS, PRICING_LABELS } from "@/lib/labels"
import type { CategorySlug, Level, Pricing, Tool } from "@/lib/types"

export type Filters = {
  query: string
  category: CategorySlug | "todas"
  level: Level | "todos"
  pricing: Pricing | "todos"
  tags: string[]
}

export const EMPTY_FILTERS: Filters = {
  query: "",
  category: "todas",
  level: "todos",
  pricing: "todos",
  tags: [],
}

const DIACRITICS = new RegExp(String.raw`[\u0300-\u036f]`, "g")

export function normalize(text: string): string {
  return text.normalize("NFD").replace(DIACRITICS, "").toLowerCase().trim()
}

export function filterTools(tools: Tool[], filters: Filters): Tool[] {
  const terms = normalize(filters.query).split(/\s+/).filter(Boolean)

  return tools.filter((tool) => {
    if (filters.category !== "todas" && tool.category !== filters.category) {
      return false
    }

    if (filters.level !== "todos" && tool.level !== filters.level) {
      return false
    }

    if (filters.pricing !== "todos" && tool.pricing !== filters.pricing) {
      return false
    }
    if (
      filters.tags.length > 0 &&
      !filters.tags.some((tag) => tool.tags.includes(tag))
    ) {
      return false
    }

    if (terms.length === 0) {
      return true
    }

    const haystack = normalize(
      [tool.name, tool.tagline, tool.description, ...tool.tags].join(" ")
    )

    return terms.every((term) => haystack.includes(term))
  })
}

export function collectTags(tools: Tool[], limit?: number): string[] {
  const counts = new Map<string, number>()

  for (const tool of tools) {
    for (const tag of tool.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  const tags = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)

  return limit ? tags.slice(0, limit) : tags
}

export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.category !== "todas" ||
    filters.level !== "todos" ||
    filters.pricing !== "todos" ||
    filters.tags.length > 0
  )
}

type ParamReader = Pick<URLSearchParams, "get">

function pick<T extends string>(value: string | null, allowed: string[]) {
  return value !== null && allowed.includes(value) ? (value as T) : null
}

export function readFilters(params: ParamReader): Filters {
  return {
    query: params.get("q") ?? "",
    category:
      pick<CategorySlug>(
        params.get("categoria"),
        CATEGORIES.map((category) => category.slug)
      ) ?? "todas",
    level:
      pick<Level>(params.get("nivel"), Object.keys(LEVEL_LABELS)) ?? "todos",
    pricing:
      pick<Pricing>(params.get("precio"), Object.keys(PRICING_LABELS)) ??
      "todos",
    tags: (params.get("etiquetas") ?? "").split(",").filter(Boolean),
  }
}

export function readPage(params: ParamReader): number {
  const page = Number.parseInt(params.get("pagina") ?? "", 10)

  return Number.isInteger(page) && page > 1 ? page : 1
}

export function writeFilters(filters: Filters, page: number): string {
  const params = new URLSearchParams()

  if (filters.query) {
    params.set("q", filters.query)
  }

  if (filters.category !== "todas") {
    params.set("categoria", filters.category)
  }

  if (filters.level !== "todos") {
    params.set("nivel", filters.level)
  }

  if (filters.pricing !== "todos") {
    params.set("precio", filters.pricing)
  }

  if (filters.tags.length > 0) {
    params.set("etiquetas", filters.tags.join(","))
  }

  if (page > 1) {
    params.set("pagina", String(page))
  }

  return params.toString()
}
