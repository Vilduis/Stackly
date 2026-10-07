import Link from "next/link"
import { Columns2, Layers, Search } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const NAV_LINK = cn(
  buttonVariants({ variant: "ghost", size: "sm" }),
  "max-sm:h-11 max-sm:min-w-11"
)

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50">
      <a
        href="#contenido"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "absolute top-3 left-4 z-10 -translate-y-16 bg-background focus-visible:translate-y-0"
        )}
      >
        Saltar al contenido
      </a>
      <div className="container-page flex h-14 items-center gap-2">
        <Link
          href="/"
          className="mr-auto inline-flex min-h-11 items-center gap-2 rounded-md font-heading text-lg tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Layers className="size-5" aria-hidden />
          Stackly
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-1">
          <Link href="/comparar" aria-label="Comparar" className={NAV_LINK}>
            <Columns2 aria-hidden />
            <span className="max-sm:sr-only">Comparar</span>
          </Link>

          <Link href="/buscar" className={NAV_LINK}>
            <Search aria-hidden />
            Buscar
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
