import type { Category } from "@/lib/types"

export const CATEGORIES: Category[] = [
  {
    slug: "frontend",
    name: "Frontend",
    description:
      "Lo que ve y usa la persona que entra a tu web: la interfaz y la navegación.",
  },
  {
    slug: "backend",
    name: "Backend",
    description:
      "El servidor: la lógica, las rutas de la API y todo lo que no se ve.",
  },
  {
    slug: "bases-de-datos",
    name: "Bases de datos",
    description: "Dónde se guardan los datos de tu aplicación.",
  },
  {
    slug: "deploy",
    name: "Deploy",
    description:
      "Dónde publicar tu web para que esté online y cómo subir cada cambio.",
  },
  {
    slug: "componentes-ui",
    name: "Componentes UI",
    description:
      "Botones, formularios y menús ya hechos para no partir de cero.",
  },
  {
    slug: "estilos",
    name: "Estilos",
    description: "Cómo escribes el CSS y le das aspecto a tu web.",
  },
  {
    slug: "animaciones",
    name: "Animaciones",
    description:
      "Librerías para mover elementos: transiciones, scroll y efectos de entrada.",
  },
  {
    slug: "iconos",
    name: "Iconos",
    description: "Colecciones de iconos listas para usar en tu interfaz.",
  },
  {
    slug: "inspiracion",
    name: "Inspiración",
    description: "Galerías de webs reales para tomar ideas de diseño.",
  },
]

export function getCategory(slug: string): Category | null {
  return CATEGORIES.find((category) => category.slug === slug) ?? null
}
