import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { LineView } from "@/components/line-view"
import { Separator } from "@/components/ui/separator"
import { CATEGORIES, getCategory } from "@/lib/categories"
import { buildMetadata } from "@/lib/metadata"
import { toneStyle } from "@/lib/tones"
import { sortByLevel } from "@/lib/routes"
import { getToolsByCategory } from "@/lib/tools"

type CategoryPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)

  if (!category) {
    return {}
  }

  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/c/${category.slug}`,
  })
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = getCategory(slug)

  if (!category) {
    notFound()
  }

  const tools = sortByLevel(await getToolsByCategory(category.slug))

  return (
    <main style={toneStyle(category.slug)} className="container-page py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-tone max-sm:-my-2 max-sm:py-2"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Categorías
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-tone/10 ring-1 ring-tone/25">
            <CategoryIcon
              category={category.slug}
              className="size-5 text-tone"
            />
          </span>
          <h1 className="font-heading text-title tracking-tight">
            {category.name}
          </h1>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {category.description}
        </p>
      </header>

      <Separator className="my-8" />

      <LineView tools={tools} />
    </main>
  )
}
