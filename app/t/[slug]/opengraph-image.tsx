import { getCategory } from "@/lib/categories"
import {
  OG_CONTENT_TYPE,
  OG_FALLBACK_TONE,
  OG_SIZE,
  ogImage,
  ToneDot,
  toneBar,
} from "@/lib/og"
import { toneHex } from "@/lib/tones"
import { getTool, getTools } from "@/lib/tools"

export const alt = "Ficha de herramienta en Stackly"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateStaticParams() {
  const tools = await getTools()

  return tools.map((tool) => ({ slug: tool.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = await getTool(slug)
  const category = tool ? getCategory(tool.category) : null
  const tone = tool ? toneHex(tool.category) : OG_FALLBACK_TONE

  return ogImage({
    eyebrow: category?.name ?? "Stackly",
    eyebrowColor: tone,
    title: tool?.name ?? "Stackly",
    titleFont: "sans",
    titleSize: 84,
    subtitle: tool?.tagline ?? "Catálogo de herramientas para crear tu web",
    footer: "Stackly",
    marker: <ToneDot tone={tone} />,
    bar: toneBar(tone),
  })
}
