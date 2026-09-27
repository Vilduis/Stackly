import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { ReactNode } from "react"
import { ImageResponse } from "next/og"

export const OG_SIZE = { width: 1200, height: 630 }

export const OG_CONTENT_TYPE = "image/png"

export const OG_FALLBACK_TONE = "#7402FF"

export const OG_BRAND_GRADIENT =
  "linear-gradient(90deg, #7402FF, #973EFE, #C89DFD)"

const BACKGROUND = "#0E0619"

const MUTED = "#A99FBB"

const SERIF = "Instrument Serif"

const SANS = "Geist"

function loadFont(file: string) {
  return readFile(join(process.cwd(), "assets/fonts", file))
}

const fonts = Promise.all([
  loadFont("Geist-Regular.ttf"),
  loadFont("Geist-SemiBold.ttf"),
  loadFont("InstrumentSerif-Regular.ttf"),
]).then(([regular, semibold, serif]) => [
  { name: SANS, data: regular, weight: 400 as const, style: "normal" as const },
  {
    name: SANS,
    data: semibold,
    weight: 600 as const,
    style: "normal" as const,
  },
  { name: SERIF, data: serif, weight: 400 as const, style: "normal" as const },
])

type OgImageProps = {
  eyebrow: string
  eyebrowColor?: string
  title: string
  titleSize?: number
  titleFont?: "serif" | "sans"
  subtitle: string
  footer: ReactNode
  marker: ReactNode
  markerGap?: number
  bar: string
  overlay?: [number, number, number]
}

export function toneBar(tone: string): string {
  return `linear-gradient(90deg, ${BACKGROUND}, ${tone} 26%, ${tone} 74%, ${BACKGROUND})`
}

export function ToneDot({ tone }: { tone: string }) {
  return (
    <div
      style={{
        display: "flex",
        width: 12,
        height: 12,
        borderRadius: 999,
        background: tone,
      }}
    />
  )
}

export async function ogImage({
  eyebrow,
  eyebrowColor = MUTED,
  title,
  titleSize = 108,
  titleFont = "serif",
  subtitle,
  footer,
  marker,
  markerGap = 16,
  bar,
  overlay = [0.18, 0.1, 0.16],
}: OgImageProps): Promise<ImageResponse> {
  const [violet, purple, lilac] = overlay
  const titleStyle =
    titleFont === "serif"
      ? { fontFamily: SERIF, fontWeight: 400, letterSpacing: -2 }
      : { fontWeight: 600 }

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: BACKGROUND,
        color: "#FBFDFF",
        fontFamily: SANS,
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
          background: `linear-gradient(135deg, rgba(116,2,255,${violet}), rgba(151,62,254,${purple}) 48%, rgba(200,157,253,${lilac}))`,
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
          background: bar,
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
        <div style={{ display: "flex", fontSize: 28, color: eyebrowColor }}>
          {eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: titleSize, ...titleStyle }}>
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 36,
              color: MUTED,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: markerGap,
            fontSize: 28,
            color: MUTED,
          }}
        >
          {marker}
          {footer}
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: await fonts,
    }
  )
}
