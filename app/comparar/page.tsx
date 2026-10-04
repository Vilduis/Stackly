import type { Metadata } from "next"
import { Suspense } from "react"

import { Comparator } from "@/components/comparator"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { buildMetadata } from "@/lib/metadata"
import { getTools } from "@/lib/tools"

export const metadata: Metadata = buildMetadata({
  title: "Comparar",
  description:
    "Compara dos herramientas lado a lado: precio, nivel, cuándo usarlas, cuándo evitarlas y cómo empezar.",
  path: "/comparar",
})

export default async function ComparePage() {
  const tools = await getTools()

  return (
    <main className="container-page py-16">
      <header className="max-w-2xl">
        <h1 className="font-heading text-title tracking-tight">
          Comparar herramientas
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pon dos herramientas lado a lado: precio, nivel, cuándo conviene cada
          una y cómo se empieza.
        </p>
      </header>

      <Separator className="my-8" />

      <Suspense fallback={<Skeleton className="h-96" />}>
        <Comparator tools={tools} />
      </Suspense>
    </main>
  )
}
