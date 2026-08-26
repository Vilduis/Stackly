import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { Spotlight } from "@/components/spotlight"
import { ToolCard } from "@/components/tool-card"
import { ToolMark } from "@/components/tool-mark"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getCategory } from "@/lib/categories"
import { buildMetadata } from "@/lib/metadata"
import { toneStyle } from "@/lib/tones"
import { getTool, getTools, getToolsByCategory } from "@/lib/tools"
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
  const related = (await getToolsByCategory(tool.category))
    .filter((other) => other.slug !== tool.slug)
    .slice(0, 3)

  return (
    <main
      style={toneStyle(tool.category)}
      className="mx-auto w-full max-w-3xl px-6 py-16"
    >
      {category ? (
        <Link
          href={`/c/${category.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-tone"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {category.name}
        </Link>
      ) : null}

      <header className="mt-6">
        <div className="flex items-center gap-4">
          <ToolMark tool={tool} className="size-14 rounded-xl text-xl" />
          <h1 className="min-w-0 font-heading text-title tracking-tight">
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
          <Badge variant="secondary">{tool.pricing}</Badge>
          <Badge variant="outline">{tool.level}</Badge>
        </div>
      </header>

      <Separator className="my-8" />

      <p className="text-base leading-relaxed">{tool.description}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <ActionLink href={tool.website}>
          <ExternalLink />
          Ir a la web
        </ActionLink>
        {tool.docs ? (
          <ActionLink href={tool.docs} variant="outline">
            <BookOpen />
            Documentación
          </ActionLink>
        ) : null}
      </div>

      {tool.tags.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-sm font-medium">Etiquetas</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tool.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {related.length > 0 && category ? (
        <>
          <Separator className="my-10" />
          <section>
            <h2 className="font-heading text-subsection tracking-tight">
              Otras opciones en {category.name}
            </h2>
            <Spotlight className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((other) => (
                <ToolCard key={other.slug} tool={other} />
              ))}
            </Spotlight>
          </section>
        </>
      ) : null}
    </main>
  )
}

function ActionLink({
  href,
  variant = "default",
  children,
}: {
  href: string
  variant?: "default" | "outline"
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant }))}
    >
      {children}
    </a>
  )
}
