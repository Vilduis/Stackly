import toolsData from "@/content/tools.json"
import type { CategorySlug, Tool } from "@/lib/types"


const tools = toolsData as Tool[]

export async function getTools(): Promise<Tool[]> {
  return tools
}

export async function getToolsByCategory(
  category: CategorySlug
): Promise<Tool[]> {
  return tools.filter((tool) => tool.category === category)
}

export async function getTool(slug: string): Promise<Tool | null> {
  return tools.find((tool) => tool.slug === slug) ?? null
}

export async function countToolsByCategory(): Promise<
  Record<CategorySlug, number>
> {
  const counts = {} as Record<CategorySlug, number>

  for (const tool of tools) {
    counts[tool.category] = (counts[tool.category] ?? 0) + 1
  }

  return counts
}
