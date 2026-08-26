import { ImageResponse } from "next/og"

import { CATEGORIES } from "@/lib/categories"
import { getTools } from "@/lib/tools"

export const alt = "Stackly, catálogo de herramientas para crear tu web"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const tools = await getTools()

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
            "linear-gradient(135deg, rgba(0,112,243,0.20), rgba(121,40,202,0.10) 48%, rgba(255,0,128,0.18))",
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
          background: "linear-gradient(90deg, #0070F3, #7928CA, #FF0080)",
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
          Catálogo de herramientas
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 600 }}>
            Stackly
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
            Para cuando sabes qué quieres construir, pero no con qué.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 28,
            color: "#a1a1a1",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 5,
              borderRadius: 999,
              background: "linear-gradient(90deg, #0070F3, #7928CA, #FF0080)",
            }}
          />
          {tools.length} herramientas · {CATEGORIES.length} categorías
        </div>
      </div>
    </div>,
    size
  )
}
