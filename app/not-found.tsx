import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Página no encontrada",
}

export default function NotFound() {
  return (
    <main className="container-page py-24 sm:py-32">
      <h1 className="max-w-xl font-heading text-title tracking-tight text-balance">
        Esta página no está en el catálogo
      </h1>
      <p className="mt-4 max-w-lg text-pretty text-muted-foreground">
        Puede que el enlace esté mal escrito o que la herramienta haya cambiado
        de nombre. Búscala por su nombre o vuelve a las categorías.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/buscar" className={buttonVariants({ size: "lg" })}>
          <Search aria-hidden />
          Buscar herramientas
        </Link>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          <ArrowLeft aria-hidden />
          Ver categorías
        </Link>
      </div>
    </main>
  )
}
