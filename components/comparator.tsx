"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"
import { ArrowLeftRight, ExternalLink } from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { CodeSnippet } from "@/components/code-snippet"
import { ReasonList } from "@/components/reason-list"
import { ToneEdge } from "@/components/tone-edge"
import { LevelBadge, PricingBadge } from "@/components/tool-badges"
import { ToolCombobox } from "@/components/tool-combobox"
import { ToolMark } from "@/components/tool-mark"
import { Button } from "@/components/ui/button"
import { getCategory } from "@/lib/categories"
import { combines, type CompareOption } from "@/lib/routes"
import { toneStyle } from "@/lib/tones"
import type { Tool } from "@/lib/types"
import { cn } from "@/lib/utils"

type Row = {
  label: string
  render: (tool: Tool) => React.ReactNode
}

export function Comparator({
  options,
  a,
  b,
}: {
  options: CompareOption[]
  a: Tool
  b: Tool
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const bySlug = new Map(options.map((option) => [option.slug, option]))

  function go(nextA: string, nextB: string) {
    startTransition(() => {
      router.replace(`${pathname}?a=${nextA}&b=${nextB}`, { scroll: false })
    })
  }

  const pair = [a, b]
  const verdict =
    a.slug === b.slug
      ? "Has elegido la misma herramienta dos veces. Cambia una para comparar."
      : a.category === b.category
        ? "Son de la misma categoría: compiten por el mismo hueco en tu proyecto, así que normalmente eliges una."
        : combines(a, b)
          ? "Son de categorías distintas y suelen ir juntas: no compiten, se complementan."
          : "Son de categorías distintas: no compiten, cubren partes diferentes de tu web."

  const rows: Row[] = [
    {
      label: "En una frase",
      render: (tool) => <p className="text-sm text-pretty">{tool.tagline}</p>,
    },
    {
      label: "Precio y nivel",
      render: (tool) => (
        <div className="flex flex-wrap gap-1.5">
          <PricingBadge pricing={tool.pricing} />
          <LevelBadge level={tool.level} />
        </div>
      ),
    },
    {
      label: "Úsalo si…",
      render: (tool) => <ReasonList items={tool.useIf} positive />,
    },
    {
      label: "Mejor evítalo si…",
      render: (tool) => <ReasonList items={tool.avoidIf} positive={false} />,
    },
    {
      label: "Primer paso",
      render: (tool) => {
        const step = tool.start.find((item) => item.code) ?? tool.start[0]

        return (
          <>
            <p className="text-sm">{step?.text}</p>
            {step?.code ? (
              <div className="mt-2">
                <CodeSnippet code={step.code} />
              </div>
            ) : null}
          </>
        )
      },
    },
    {
      label: "Combina bien con",
      render: (tool) => (
        <ul className="flex flex-wrap gap-2">
          {tool.pairsWith.map((slug) => {
            const partner = bySlug.get(slug)

            return partner ? (
              <li key={slug}>
                <Link
                  href={`/t/${slug}`}
                  className="inline-flex min-h-8 items-center gap-2 rounded-lg py-1 pr-2.5 pl-1 text-sm ring-1 ring-foreground/10 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <ToolMark
                    tool={partner}
                    className="size-6 rounded-md text-[0.625rem]"
                  />
                  {partner.name}
                </Link>
              </li>
            ) : null
          })}
        </ul>
      ),
    },
    {
      label: "Enlaces",
      render: (tool) => (
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-8 items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ExternalLink aria-hidden className="size-3.5" />
          Web oficial de {tool.name}
        </a>
      ),
    },
  ]

  return (
    <div
      aria-busy={pending}
      className="transition-opacity duration-200 aria-busy:opacity-60"
    >
      <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <ToolCombobox
          label="Primera herramienta"
          value={a}
          rival={b}
          options={options}
          onChange={(slug) => go(slug, b.slug)}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => go(b.slug, a.slug)}
          aria-label="Intercambiar"
          className="size-11 justify-self-center sm:size-10"
        >
          <ArrowLeftRight />
        </Button>
        <ToolCombobox
          label="Segunda herramienta"
          value={b}
          rival={a}
          options={options}
          onChange={(slug) => go(a.slug, slug)}
        />
      </div>

      <p
        role="status"
        aria-live="polite"
        className="mt-5 max-w-prose text-sm text-pretty text-muted-foreground"
      >
        {verdict}
      </p>

      <table className="mt-8 hidden w-full table-fixed border-collapse text-left md:table">
        <caption className="sr-only">
          Comparación entre {a.name} y {b.name}
        </caption>
        <colgroup>
          <col className="w-36" />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <td />
            {pair.map((tool) => (
              <th
                key={tool.slug}
                scope="col"
                style={toneStyle(tool.category)}
                className="relative px-4 py-5 align-bottom font-normal"
              >
                <ToolHeading tool={tool} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="align-top">
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-border">
              <th
                scope="row"
                className="py-4 pr-4 text-sm font-medium text-muted-foreground"
              >
                {row.label}
              </th>
              {pair.map((tool) => (
                <td key={tool.slug} className="px-4 py-4">
                  {row.render(tool)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 md:hidden">
        <div className="grid grid-cols-2 gap-3">
          {pair.map((tool) => (
            <div
              key={tool.slug}
              style={toneStyle(tool.category)}
              className="relative pt-4"
            >
              <ToolHeading tool={tool} compact />
            </div>
          ))}
        </div>
        <dl className="mt-4">
          {rows.map((row) => (
            <div key={row.label} className="border-t border-border py-4">
              <dt className="text-sm font-medium text-muted-foreground">
                {row.label}
              </dt>
              {pair.map((tool) => (
                <dd
                  key={tool.slug}
                  style={toneStyle(tool.category)}
                  className="mt-3 border-l border-tone/40 pl-3"
                >
                  <p className="mb-1.5 text-xs font-medium text-tone">
                    {tool.name}
                  </p>
                  {row.render(tool)}
                </dd>
              ))}
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

function ToolHeading({
  tool,
  compact = false,
}: {
  tool: CompareOption
  compact?: boolean
}) {
  const category = getCategory(tool.category)

  return (
    <>
      <ToneEdge />
      <div
        className={cn(
          "flex items-center gap-3",
          compact && "flex-col items-start gap-2"
        )}
      >
        <ToolMark
          tool={tool}
          className={compact ? "size-10 rounded-lg" : "size-12 rounded-xl"}
        />
        <div className="min-w-0">
          <Link
            href={`/t/${tool.slug}`}
            className="block font-heading text-subsection hover:underline"
          >
            {tool.name}
          </Link>
          <Link
            href={`/c/${tool.category}`}
            className="mt-0.5 inline-flex items-center gap-1 text-xs text-tone hover:underline"
          >
            <CategoryIcon category={tool.category} className="size-3" />
            {category?.name}
          </Link>
        </div>
      </div>
    </>
  )
}
