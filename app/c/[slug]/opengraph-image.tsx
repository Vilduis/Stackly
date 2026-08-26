import { ImageResponse } from "next/og"

import { CATEGORIES, getCategory } from "@/lib/categories"
import { toneHex } from "@/lib/tones"
import { getToolsByCategory } from "@/lib/tools"

export const alt = "Categoría de herramientas en Stackly"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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
  const tone = category ? toneHex(category.slug) : "#0070F3"

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          background:
            "linear-gradient(135deg, rgba(0,112,243,0.18), rgba(121,40,202,0.10) 48%, rgba(255,0,128,0.16))",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          height: 8,
          display: "flex",
          background: `linear-gradient(90deg, #0a0a0a, ${tone} 26%, ${tone} 74%, #0a0a0a)`,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#a1a1a1" }}>
          Stackly
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 600 }}>
            {category?.name ?? "Categorías"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 36,
              color: "#a1a1a1",
              lineHeight: 1.3,
            }}
          >
            {category?.description ??
              "Catálogo de herramientas para crear tu web"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            color: "#a1a1a1",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: tone,
            }}
          />
          {tools.length} {tools.length === 1 ? "herramienta" : "herramientas"}
        </div>
      </div>
    </div>,
    size
  )
}
