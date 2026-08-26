import { HeroPreviewList } from "@/components/hero-preview-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORIES } from "@/lib/categories"
import { getTools } from "@/lib/tools"

export async function HeroPreview() {
  const tools = await getTools()

  const groups = CATEGORIES.map((category) => ({
    category,
    tools: tools.filter((tool) => tool.category === category.slug),
  })).filter((group) => group.tools.length > 0)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Una muestra del catálogo</CardTitle>
      </CardHeader>
      <CardContent>
        <HeroPreviewList groups={groups} />
      </CardContent>
    </Card>
  )
}
