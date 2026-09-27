import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  X,
} from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { CodeSnippet } from "@/components/code-snippet"
import { ToneEdge } from "@/components/tone-edge"
import { LevelBadge, PricingBadge } from "@/components/tool-badges"
import { ToolMark } from "@/components/tool-mark"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCategory } from "@/lib/categories"
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

const MAX_ALTERNATIVES = 4

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
  const alternatives = siblings
    .filter((other) => other.slug !== tool.slug)
    .slice(0, MAX_ALTERNATIVES)

  return (
    <main style={toneStyle(tool.category)} className="container-page py-16">
      {category ? (
        <Link
          href={`/c/${category.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-tone"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {category.name}
        </Link>
      ) : null}

      <header className="mt-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <ToolMark tool={tool} className="size-14 rounded-xl text-xl" />
          <h1 className="min-w-0 text-title font-semibold tracking-tight">
            {tool.name}
          </h1>
        </div>
        <p className="mt-5 text-muted-foreground">{tool.tagline}</p>

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
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <p className="text-base leading-relaxed">{tool.description}</p>

          {tool.tags.length > 0 ? (
            <div className="mt-8">
              <h2 className="eyebrow">Etiquetas</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="font-mono text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-20">
            <StartPanel tool={tool} />
          </div>
        </aside>

        <div className="min-w-0 space-y-14 lg:col-start-1 lg:row-start-2">
          <FitSection tool={tool} />

          {pairs.length > 0 ? <PairsSection pairs={pairs} /> : null}

          {alternatives.length > 0 && category ? (
            <section>
              <h2 className="font-heading text-subsection tracking-tight">
                Alternativas en {category.name}
              </h2>
              <ol className="mt-5 divide-y divide-border overflow-hidden rounded-xl ring-1 ring-foreground/10">
                {alternatives.map((other, index) => (
                  <AlternativeRow key={other.slug} tool={other} index={index} />
                ))}
              </ol>
            </section>
          ) : null}
        </div>
      </div>

      <ClosingBanner tool={tool} />
    </main>
  )
}

function StartPanel({ tool }: { tool: Tool }) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <ToneEdge />
      <h2 className="eyebrow">Cómo empezar</h2>

      <ol className="mt-5 space-y-5">
        {tool.start.map((step, index) => (
          <li key={step.text} className="flex gap-3">
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-tone/12 font-mono text-xs text-tone ring-1 ring-tone/25"
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
      <h2 className="font-heading text-subsection tracking-tight">
        ¿Es para ti?
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <FitList
          title="Úsalo si…"
          items={tool.useIf}
          icon={<Check className="size-3.5" />}
          tone="border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        />
        <FitList
          title="Mejor evítalo si…"
          items={tool.avoidIf}
          icon={<X className="size-3.5" />}
          tone="border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300"
        />
      </div>
    </section>
  )
}

function FitList({
  title,
  items,
  icon,
  tone,
}: {
  title: string
  items: string[]
  icon: React.ReactNode
  tone: string
}) {
  return (
    <div className="rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
            <span
              aria-hidden
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                tone
              )}
            >
              {icon}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PairsSection({ pairs }: { pairs: Tool[] }) {
  return (
    <section>
      <h2 className="font-heading text-subsection tracking-tight">
        Combina bien con
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Herramientas de otras categorías que suelen ir juntas en un mismo
        proyecto.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {pairs.map((pair) => (
          <li key={pair.slug} style={toneStyle(pair.category)}>
            <Link
              href={`/t/${pair.slug}`}
              className="group flex items-center gap-3 rounded-xl bg-card p-3 ring-1 ring-foreground/10 transition outline-none hover:-translate-y-0.5 hover:ring-tone/40 focus-visible:ring-3 focus-visible:ring-ring/50"
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

function AlternativeRow({ tool, index }: { tool: Tool; index: number }) {
  return (
    <li>
      <Link
        href={`/t/${tool.slug}`}
        className="group flex items-center gap-4 p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50"
      >
        <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
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
          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </li>
  )
}

function ClosingBanner({ tool }: { tool: Tool }) {
  const verb = tool.category === "inspiracion" ? "explorar" : "probar"

  return (
    <section className="relative mt-20 overflow-hidden rounded-2xl bg-card p-8 ring-1 ring-tone/25 sm:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-tone/20 via-transparent to-(--brand-violet)/15"
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md">
          <p className="eyebrow">Siguiente paso</p>
          <h2 className="mt-3 font-heading text-section tracking-tight text-balance">
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
