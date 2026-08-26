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

function normalize(text: string): string {
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
