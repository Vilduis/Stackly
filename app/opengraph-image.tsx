import { CATEGORIES } from "@/lib/categories"
import { OG_BRAND_GRADIENT, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og"
import { getTools } from "@/lib/tools"

export const alt = "Stackly, catálogo de herramientas para crear tu web"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  const tools = await getTools()

  return ogImage({
    eyebrow: "Catálogo de herramientas",
    title: "Stackly",
    titleSize: 128,
    subtitle: "Para cuando sabes qué quieres construir, pero no con qué.",
    footer: `${tools.length} herramientas · ${CATEGORIES.length} categorías`,
    marker: (
      <div
        style={{
          display: "flex",
          width: 56,
          height: 5,
          borderRadius: 999,
          background: OG_BRAND_GRADIENT,
        }}
      />
    ),
    markerGap: 20,
    bar: OG_BRAND_GRADIENT,
    overlay: [0.2, 0.1, 0.18],
  })
}
