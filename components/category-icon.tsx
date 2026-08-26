import {
  Component,
  Database,
  LayoutDashboard,
  Lightbulb,
  Palette,
  Rocket,
  Server,
  Shapes,
  Sparkles,
  type LucideProps,
} from "lucide-react"

import type { CategorySlug } from "@/lib/types"

const ICONS: Record<CategorySlug, React.ComponentType<LucideProps>> = {
  frontend: LayoutDashboard,
  backend: Server,
  "bases-de-datos": Database,
  deploy: Rocket,
  "componentes-ui": Component,
  estilos: Palette,
  animaciones: Sparkles,
  iconos: Shapes,
  inspiracion: Lightbulb,
}

export function CategoryIcon({
  category,
  ...props
}: LucideProps & { category: CategorySlug }) {
  const Icon = ICONS[category]

  return <Icon aria-hidden {...props} />
}
