import { LEVEL_STEPS } from "@/lib/labels"
import type { Tool } from "@/lib/types"

export type PlannerTool = Pick<
  Tool,
  "slug" | "name" | "category" | "pricing" | "level" | "pairsWith"
>

export function toPlannerTool(tool: Tool): PlannerTool {
  const { slug, name, category, pricing, level, pairsWith } = tool

  return { slug, name, category, pricing, level, pairsWith }
}

type RoutePreset = {
  id: string
  name: string
  summary: string
  stations: string[]
}

export const ROUTE_PRESETS: RoutePreset[] = [
  {
    id: "app",
    name: "App con usuarios y datos",
    summary: "Login, base de datos y panel, lista para crecer.",
    stations: ["nextjs", "shadcn-ui", "tailwindcss", "supabase", "vercel"],
  },
  {
    id: "contenido",
    name: "Blog o web de contenido",
    summary: "Rápida, buena para Google y casi sin JavaScript.",
    stations: ["astro", "tailwindcss", "lucide", "netlify"],
  },
  {
    id: "primera",
    name: "Mi primera app",
    summary: "Para aprender sin pelearte con la configuración.",
    stations: ["vue", "tailwindcss", "heroicons", "firebase", "netlify"],
  },
  {
    id: "landing",
    name: "Landing con animaciones",
    summary: "Una página que se luce al hacer scroll.",
    stations: ["awwwards", "astro", "tailwindcss", "gsap", "lenis", "netlify"],
  },
  {
    id: "api",
    name: "API con panel",
    summary: "Backend en Python y un panel en React.",
    stations: ["react", "fastapi", "neon", "render"],
  },
]

type Pairable = Pick<Tool, "slug" | "pairsWith">

export function combines(a: Pairable, b: Pairable): boolean {
  return a.pairsWith.includes(b.slug) || b.pairsWith.includes(a.slug)
}

export function sortByLevel<T extends Pick<Tool, "level">>(tools: T[]): T[] {
  return tools
    .map((tool, index) => ({ tool, index }))
    .sort(
      (a, b) =>
        LEVEL_STEPS[a.tool.level] - LEVEL_STEPS[b.tool.level] ||
        a.index - b.index
    )
    .map(({ tool }) => tool)
}
