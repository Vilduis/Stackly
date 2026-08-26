import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { HeroPreview } from "@/components/hero-preview"
import { HomeSearch } from "@/components/home-search"
import { SearchSuggestions } from "@/components/search-suggestions"
import { Spotlight } from "@/components/spotlight"
import { ToolMark } from "@/components/tool-mark"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CATEGORIES } from "@/lib/categories"
import { countToolsByCategory, getTools } from "@/lib/tools"
import { toneStyle } from "@/lib/tones"
import type { Tool } from "@/lib/types"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const PREVIEW = 4

export default async function HomePage() {
  const [counts, tools] = await Promise.all([
    countToolsByCategory(),
    getTools(),
  ])

  const preview = new Map<string, Tool[]>()

  for (const tool of tools) {
    const shown = preview.get(tool.category) ?? []

    if (shown.length < PREVIEW) {
      preview.set(tool.category, [...shown, tool])
    }
  }

  return (
    <main className="hero-grid">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-24">
        <section className="relative grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <h1 className="max-w-xl font-heading text-hero tracking-tight text-balance">
              Elige las herramientas de tu <span className="italic">próxima</span> web
            </h1>
            <p className="mt-6 max-w-lg text-base text-pretty text-muted-foreground sm:text-lg">
              Si sabes qué quieres construir pero no con qué, aquí tienes las
              opciones ordenadas por categoría, con qué hace cada una y cuándo
              conviene.
            </p>

            <div className="mt-8">
              <HomeSearch />
            </div>

            <div className="mt-4">
              <SearchSuggestions />
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              {tools.length} herramientas en {CATEGORIES.length} categorías.
            </p>
          </div>

          <div className="lg:col-span-2">
            <HeroPreview />
          </div>
        </section>

        <section className="mt-20 sm:mt-28">
          <h2 className="font-heading text-section tracking-tight">
            Categorías
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Nueve áreas en las que se divide construir una web. Entra en la que
            te toque ahora.
          </p>
          <Spotlight className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/c/${category.slug}`}
                style={toneStyle(category.slug)}
                className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Card
                  data-spotlight
                  className="spotlight-glow h-full transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-tone/35"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CategoryIcon
                        category={category.slug}
                        className="size-5 text-muted-foreground transition-colors group-hover:text-tone"
                      />
                      <CardTitle className="flex-1">{category.name}</CardTitle>
                      <ArrowRight
                        aria-hidden
                        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                    <CardDescription className="mt-2">
                      {category.description}
                    </CardDescription>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {(preview.get(category.slug) ?? []).map((tool) => (
                          <ToolMark
                            key={tool.slug}
                            tool={tool}
                            className="size-8 rounded-lg text-xs ring-2 ring-card"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {counts[category.slug] ?? 0} herramientas
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </Spotlight>
        </section>
      </div>
    </main>
  )
}
