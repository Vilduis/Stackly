export type CategorySlug =
  | "frontend"
  | "backend"
  | "bases-de-datos"
  | "deploy"
  | "componentes-ui"
  | "estilos"
  | "animaciones"
  | "iconos"
  | "inspiracion"

export type Pricing = "gratis" | "freemium" | "pago"

export type Level = "principiante" | "intermedio" | "avanzado"

export type Category = {
  slug: CategorySlug
  name: string
  description: string
}

type StartStep = {
  text: string
  code?: string
}

export type Tool = {
  slug: string
  name: string
  category: CategorySlug
  tagline: string
  description: string
  website: string
  docs?: string
  tags: string[]
  pricing: Pricing
  level: Level
  start: StartStep[]
  useIf: string[]
  avoidIf: string[]
  pairsWith: string[]
}
