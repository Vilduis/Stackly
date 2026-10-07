"use client"

import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="container-page py-24 sm:py-32">
      <h1 className="max-w-xl font-heading text-title tracking-tight text-balance">
        No hemos podido cargar esta página
      </h1>
      <p className="mt-4 max-w-lg text-pretty text-muted-foreground">
        Ha fallado algo al prepararla. Vuelve a intentarlo; si sigue sin cargar,
        empieza de nuevo desde las categorías.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button size="lg" onClick={reset}>
          <RotateCcw aria-hidden />
          Reintentar
        </Button>
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
