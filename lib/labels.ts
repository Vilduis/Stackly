import type { Level, Pricing } from "@/lib/types"

export const PRICING_LABELS: Record<Pricing, string> = {
  gratis: "Gratis",
  freemium: "Freemium",
  pago: "De pago",
}

export const LEVEL_LABELS: Record<Level, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
}

export const LEVEL_STEPS: Record<Level, number> = {
  principiante: 1,
  intermedio: 2,
  avanzado: 3,
}
