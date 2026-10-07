import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Columns2,
  ExternalLink,
} from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { CodeSnippet } from "@/components/code-snippet"
import { ReasonList } from "@/components/reason-list"
import { ToneEdge } from "@/components/tone-edge"
import { LevelBadge, PricingBadge } from "@/components/tool-badges"
import { ToolMark } from "@/components/tool-mark"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCategory } from "@/lib/categories"
import { sortByLevel } from "@/lib/routes"
import { buildMetadata } from "@/lib/metadata"
import { toneStyle } from "@/lib/tones"
import {
  getTool,
  getTools,
  getToolsBySlugs,
  getToolsByCategory,
} from "@/lib/tools"
import type { Tool } from "@/lib/types"
import { cn } from "@/lib/utils"

type ToolPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const tools = await getTools()

  return tools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)

  if (!tool) {
    return {}
  }

  const category = getCategory(tool.category)

  return buildMetadata({
    title: tool.name,
    socialTitle: category ? `${tool.name} — ${category.name}` : tool.name,
    description: tool.tagline,
    path: `/t/${tool.slug}`,
    type: "article",
    keywords: tool.tags,
  })
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = await getTool(slug)

  if (!tool) {
    notFound()
  }

  const category = getCategory(tool.category)
  const [siblings, pairs] = await Promise.all([
    getToolsByCategory(tool.category),
    getToolsBySlugs(tool.pairsWith),
  ])
  const alternatives = sortByLevel(siblings).filter(
    (other) => other.slug !== tool.slug
  )

  return (
    <main style={toneStyle(tool.category)} className="container-page py-16">
      {category ? (
        <Link
          href={`/c/${category.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-tone max-sm:-my-2 max-sm:py-2"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {category.name}
        </Link>
      ) : null}

      <header className="mt-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <ToolMark tool={tool} className="size-14 rounded-xl text-xl" />
          <h1 className="min-w-0 font-heading text-title tracking-tight">
            {tool.name}
          </h1>
        </div>
        <p className="mt-5 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
          {tool.tagline}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {category ? (
            <Badge
              variant="outline"
              className="border-tone/30 text-tone [a]:hover:bg-tone/10"
              render={
                <Link href={`/c/${category.slug}`} className="gap-1.5">
                  <CategoryIcon category={category.slug} />
                  {category.name}
                </Link>
              }
            />
          ) : null}
          <PricingBadge pricing={tool.pricing} />
          <LevelBadge level={tool.level} />
        </div>
      </header>

      <Separator className="my-8" />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <div className="min-w-0 max-lg:order-1 lg:col-start-1 lg:row-start-1">
          <FitSection tool={tool} />
        </div>

        <div className="min-w-0 space-y-14 max-lg:order-3 lg:col-start-1 lg:row-start-2">
          <section>
            <h2 className="font-heading text-subsection">Qué es</h2>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-pretty">
              {tool.description}
            </p>

            {tool.tags.length > 0 ? (
              <ul
                className="mt-6 flex flex-wrap gap-1.5"
                aria-label="Etiquetas"
              >
                {tool.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="outline" className="text-muted-foreground">
                      {tag}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {pairs.length > 0 ? <PairsSection pairs={pairs} /> : null}

          {alternatives.length > 0 && category ? (
            <section>
              <h2 className="font-heading text-subsection">
                Alternativas en {category.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ordenadas de principiante a avanzado. Compáralas con {tool.name}{" "}
                lado a lado.
              </p>
              <ol className="mt-5 divide-y divide-border overflow-hidden rounded-xl ring-1 ring-foreground/10">
                {alternatives.map((other) => (
                  <AlternativeRow key={other.slug} tool={other} base={tool} />
                ))}
              </ol>
            </section>
          ) : null}
        </div>

        <aside className="min-w-0 max-lg:order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-20">
            <StartPanel tool={tool} />
          </div>
        </aside>
      </div>

      <ClosingBanner tool={tool} rival={alternatives[0]} />
    </main>
  )
}

function StartPanel({ tool }: { tool: Tool }) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <ToneEdge />
      <h2 className="font-heading text-subsection">Cómo empezar</h2>

      <ol className="mt-5 space-y-5">
        {tool.start.map((step, index) => (
          <li key={step.text} className="flex gap-3">
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-tone/12 text-xs font-medium text-tone tabular-nums ring-1 ring-tone/25"
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm leading-snug">{step.text}</p>
              {step.code ? (
                <div className="mt-2">
                  <CodeSnippet code={step.code} />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <Separator className="my-5" />

      <div className="grid gap-2">
        <ActionLink href={tool.website} className="w-full">
          <ExternalLink />
          Ir a la web
        </ActionLink>
        {tool.docs ? (
          <ActionLink href={tool.docs} variant="outline" className="w-full">
            <BookOpen />
            Documentación
          </ActionLink>
        ) : null}
      </div>
    </section>
  )
}

function FitSection({ tool }: { tool: Tool }) {
  return (
    <section>
      <h2 className="font-heading text-subsection">¿Es para ti?</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <FitList title="Úsalo si…" items={tool.useIf} positive />
        <FitList
          title="Mejor evítalo si…"
          items={tool.avoidIf}
          positive={false}
        />
      </div>
    </section>
  )
}

function FitList({
  title,
  items,
  positive,
}: {
  title: string
  items: string[]
  positive: boolean
}) {
  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-4">
        <ReasonList items={items} positive={positive} />
      </div>
    </div>
  )
}

function PairsSection({ pairs }: { pairs: Tool[] }) {
  return (
    <section>
      <h2 className="font-heading text-subsection">Combina bien con</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Herramientas de otras categorías que suelen ir juntas en un mismo
        proyecto.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {pairs.map((pair) => (
          <li key={pair.slug} style={toneStyle(pair.category)}>
            <Link
              href={`/t/${pair.slug}`}
              className="group flex items-center gap-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 transition outline-none hover:ring-tone/40 focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:hover:-translate-y-0.5"
            >
              <ToolMark tool={pair} className="size-9 text-sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {pair.name}
                </span>
                <span className="block truncate text-xs text-tone">
                  {getCategory(pair.category)?.name}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function AlternativeRow({ tool, base }: { tool: Tool; base: Tool }) {
  return (
    <li className="flex items-center">
      <Link
        href={`/t/${tool.slug}`}
        className="group flex min-w-0 flex-1 items-center gap-4 p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
      >
        <ToolMark tool={tool} className="size-9 text-sm" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{tool.name}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {tool.tagline}
          </span>
        </span>
        <span className="hidden shrink-0 gap-1.5 sm:flex">
          <PricingBadge pricing={tool.pricing} />
          <LevelBadge level={tool.level} />
        </span>
        <ArrowRight
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover:translate-x-0.5"
        />
      </Link>
      <Link
        href={`/comparar?a=${base.slug}&b=${tool.slug}`}
        aria-label={`Comparar ${base.name} con ${tool.name}`}
        title="Comparar"
        className="mr-2 flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:mr-3 sm:size-8"
      >
        <Columns2 aria-hidden className="size-4" />
      </Link>
    </li>
  )
}

function ClosingBanner({ tool, rival }: { tool: Tool; rival?: Tool }) {
  const verb = tool.category === "inspiracion" ? "explorar" : "probar"

  if (rival) {
    return (
      <section className="relative mt-20 overflow-hidden rounded-2xl bg-card p-8 ring-1 ring-tone/25 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-tone/20 via-transparent to-(--brand-violet)/15"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <h2 className="font-heading text-section tracking-tight text-balance">
              ¿Dudas entre {tool.name} y {rival.name}?
            </h2>
            <p className="mt-3 text-sm text-pretty text-muted-foreground">
              Ponlas lado a lado: precio, nivel, cuándo conviene cada una y cómo
              se empieza.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/comparar?a=${tool.slug}&b=${rival.slug}`}
              className={buttonVariants()}
            >
              <Columns2 aria-hidden />
              Comparar con {rival.name}
            </Link>
            <Link
              href={`/c/${tool.category}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Ver la categoría
              <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative mt-20 overflow-hidden rounded-2xl bg-card p-8 ring-1 ring-tone/25 sm:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-tone/20 via-transparent to-(--brand-violet)/15"
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md">
          <h2 className="font-heading text-section tracking-tight text-balance">
            ¿Listo para {verb} {tool.name}?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {tool.docs
              ? "Empieza por la documentación oficial: en unos minutos tendrás algo funcionando."
              : "Entra en su web y guarda lo que te inspire para tu próximo proyecto."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tool.docs ? (
            <ActionLink href={tool.docs}>
              <BookOpen />
              Ver documentación
            </ActionLink>
          ) : null}
          <ActionLink
            href={tool.website}
            variant={tool.docs ? "outline" : "default"}
          >
            <ExternalLink />
            Ir a la web
          </ActionLink>
        </div>
      </div>
    </section>
  )
}

function ActionLink({
  href,
  variant = "default",
  className,
  children,
}: {
  href: string
  variant?: "default" | "outline"
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant }), className)}
    >
      {children}
    </a>
  )
}
