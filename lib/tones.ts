import { CATEGORIES } from "@/lib/categories"
import type { CategorySlug } from "@/lib/types"

const FIRST_HUE = 258.2

const LAST_HUE = 362.5

function categoryHue(slug: CategorySlug): number {
  const index = CATEGORIES.findIndex((category) => category.slug === slug)
  const steps = CATEGORIES.length - 1

  if (index < 0 || steps < 1) {
    return FIRST_HUE
  }

  return FIRST_HUE + ((LAST_HUE - FIRST_HUE) * index) / steps
}

export function toneStyle(slug: CategorySlug): React.CSSProperties {
  return { "--tone-h": categoryHue(slug).toFixed(1) } as React.CSSProperties
}

const DARK_TONE_L = 0.72
const DARK_TONE_C = 0.16

function oklchToHex(l: number, c: number, hue: number): string {
  const h = (hue * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)

  const long = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const medium = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const short = (l - 0.0894841775 * a - 1.291485548 * b) ** 3

  const linear = [
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  ]

  const channels = linear.map((value) => {
    const encoded =
      value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055
    const byte = Math.round(Math.min(1, Math.max(0, encoded)) * 255)

    return byte.toString(16).padStart(2, "0")
  })

  return `#${channels.join("")}`
}

export function toneHex(slug: CategorySlug): string {
  return oklchToHex(DARK_TONE_L, DARK_TONE_C, categoryHue(slug))
}
