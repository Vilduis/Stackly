import Link from "next/link"
import { Layers } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { CATEGORIES } from "@/lib/categories"
import { getTools } from "@/lib/tools"

export async function SiteFooter() {
  const tools = await getTools()

  const year = new Date().getFullYear()

  return (
    <footer className="brand-edge brand-edge-top mt-16 border-t border-border">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-heading text-lg tracking-tight"
            >
              <Layers className="size-5" aria-hidden />
              Stackly
            </Link>
            <p className="mt-3 max-w-xs text-sm text-pretty text-muted-foreground">
              Catálogo de herramientas para crear páginas web. Para cuando sabes
              qué quieres construir, pero no con qué.
            </p>
            <p className="mt-5 font-mono text-xs tracking-tight text-muted-foreground tabular-nums">
              {tools.length} herramientas · {CATEGORIES.length} categorías
            </p>
          </div>

          <FooterColumn title="Categorías" className="lg:col-span-4">
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
              {CATEGORIES.map((category) => (
                <FooterLink key={category.slug} href={`/c/${category.slug}`}>
                  {category.name}
                </FooterLink>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Explorar" className="lg:col-span-3">
            <ul className="mt-3 space-y-2">
              <FooterLink href="/">Inicio</FooterLink>
              <FooterLink href="/buscar">Buscar herramientas</FooterLink>
            </ul>
          </FooterColumn>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Stackly. Todos los enlaces llevan a las webs oficiales de
            cada herramienta.
          </p>
          <p>Hecho con Next.js, Tailwind CSS y shadcn/ui.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <h2 className="text-sm font-medium">{title}</h2>
      {children}
    </div>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  )
}
