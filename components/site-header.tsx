import Link from "next/link"
import { Columns2, Layers, Search } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50">
      <div className="container-page flex h-14 items-center gap-2">
        <Link
          href="/"
          className="mr-auto inline-flex items-center gap-2 font-heading text-lg tracking-tight"
        >
          <Layers className="size-5" aria-hidden />
          Stackly
        </Link>

        <Link
          href="/comparar"
          aria-label="Comparar"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <Columns2 />
          <span className="max-sm:sr-only">Comparar</span>
        </Link>

        <Link
          href="/buscar"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <Search />
          Buscar
        </Link>

        <ThemeToggle />
      </div>
    </header>
  )
}
