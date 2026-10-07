import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Comparator } from "@/components/comparator"
import { Separator } from "@/components/ui/separator"
import { buildMetadata } from "@/lib/metadata"
import { toCompareOption } from "@/lib/routes"
import { getTool, getTools } from "@/lib/tools"

const DEFAULT_PAIR = ["nextjs", "astro"] as const

export const metadata: Metadata = buildMetadata({
  title: "Comparar",
  description:
    "Compara dos herramientas lado a lado: precio, nivel, cuándo usarlas, cuándo evitarlas y cómo empezar.",
  path: "/comparar",
})

type ComparePageProps = {
  searchParams: Promise<{ a?: string | string[]; b?: string | string[] }>
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams
  const [tools, a, b] = await Promise.all([
    getTools(),
    getTool(first(params.a) ?? DEFAULT_PAIR[0]).then(
      (tool) => tool ?? getTool(DEFAULT_PAIR[0])
    ),
    getTool(first(params.b) ?? DEFAULT_PAIR[1]).then(
      (tool) => tool ?? getTool(DEFAULT_PAIR[1])
    ),
  ])

  if (!a || !b) {
    notFound()
  }

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

      <Comparator options={tools.map(toCompareOption)} a={a} b={b} />
    </main>
  )
}
