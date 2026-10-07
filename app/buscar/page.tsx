import type { Metadata } from "next"
import Link from "next/link"
import { connection } from "next/server"
import { ArrowLeft } from "lucide-react"

import { SearchExplorer } from "@/components/search-explorer"
import { buildMetadata } from "@/lib/metadata"
import { getTools } from "@/lib/tools"

export const metadata: Metadata = buildMetadata({
  title: "Buscar",
  description:
    "Busca entre todas las herramientas de Stackly y filtra por categoría, nivel y precio.",
  path: "/buscar",
})

export default async function SearchPage() {
  await connection()
  const tools = await getTools()

  return (
    <main className="container-page py-16">
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

      <SearchExplorer tools={tools} />
    </main>
  )
}
