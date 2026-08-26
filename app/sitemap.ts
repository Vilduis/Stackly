import type { MetadataRoute } from "next"

import { CATEGORIES } from "@/lib/categories"
import { SITE_URL } from "@/lib/site"
import { getTools } from "@/lib/tools"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getTools()

  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/buscar`, priority: 0.5 },
    ...CATEGORIES.map((category) => ({
      url: `${SITE_URL}/c/${category.slug}`,
      priority: 0.8,
    })),
    ...tools.map((tool) => ({
      url: `${SITE_URL}/t/${tool.slug}`,
      priority: 0.6,
    })),
  ]
}
