import { CATEGORIES, getCategory } from "@/lib/categories"
import { countLabel } from "@/lib/format"
import {
  OG_CONTENT_TYPE,
  OG_FALLBACK_TONE,
  OG_SIZE,
  ogImage,
  ToneDot,
  toneBar,
} from "@/lib/og"
import { toneHex } from "@/lib/tones"
import { getToolsByCategory } from "@/lib/tools"

export const alt = "Categoría de herramientas en Stackly"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategory(slug)
  const tools = category ? await getToolsByCategory(category.slug) : []
  const tone = category ? toneHex(category.slug) : OG_FALLBACK_TONE

  return ogImage({
    eyebrow: "Stackly",
    title: category?.name ?? "Categorías",
    subtitle:
      category?.description ?? "Catálogo de herramientas para crear tu web",
    footer: countLabel(tools.length, "herramienta"),
    marker: <ToneDot tone={tone} />,
    bar: toneBar(tone),
  })
}
