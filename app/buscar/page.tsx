import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"

import { SearchExplorer } from "@/components/search-explorer"
import { Skeleton } from "@/components/ui/skeleton"
import { buildMetadata } from "@/lib/metadata"
import { getTools } from "@/lib/tools"

export const metadata: Metadata = buildMetadata({
  title: "Buscar",
  description:
    "Busca entre todas las herramientas de Stackly y filtra por categoría, nivel y precio.",
  path: "/buscar",
})

export default async function SearchPage() {
  const tools = await getTools()

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Categorías
      </Link>

      <header className="mt-6 mb-8">
        <h1 className="font-heading text-title tracking-tight">
          Buscar herramientas
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Todas las herramientas del catálogo, filtrables por categoría, nivel y
          precio.
        </p>
      </header>

      <Suspense fallback={<ExplorerSkeleton />}>
        <SearchExplorer tools={tools} />
      </Suspense>
    </main>
  )
}

function ExplorerSkeleton() {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 sm:w-52" />
        <Skeleton className="h-9 sm:w-44" />
        <Skeleton className="h-9 sm:w-44" />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-48" />
        ))}
      </div>
    </div>
  )
}
