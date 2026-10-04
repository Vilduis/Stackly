"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeftRight, Check, Copy, Link2, RotateCcw } from "lucide-react"

import { CategoryIcon } from "@/components/category-icon"
import { ToneEdge } from "@/components/tone-edge"
import { PricingBadge } from "@/components/tool-badges"
import { ToolMark } from "@/components/tool-mark"
import { Card } from "@/components/ui/card"
import { getCategory } from "@/lib/categories"
import { LEVEL_LABELS, LEVEL_STEPS, PRICING_LABELS } from "@/lib/labels"
import { combines, ROUTE_PRESETS, sortByLevel } from "@/lib/routes"
import { toneStyle } from "@/lib/tones"
import type { Level, Pricing } from "@/lib/types"
import type { PlannerTool } from "@/lib/routes"
import { cn } from "@/lib/utils"

const COPIED_MS = 1600

export function RoutePlanner({ tools }: { tools: PlannerTool[] }) {
  const bySlug = useMemo(
    () => new Map(tools.map((tool) => [tool.slug, tool])),
    [tools]
  )
  const [presetId, setPresetId] = useState(ROUTE_PRESETS[0].id)
  const [route, setRoute] = useState<string[]>(ROUTE_PRESETS[0].stations)
  const [open, setOpen] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const preset =
    ROUTE_PRESETS.find((item) => item.id === presetId) ?? ROUTE_PRESETS[0]
  const stack = route
    .map((slug) => bySlug.get(slug))
    .filter((tool): tool is PlannerTool => tool !== undefined)
  const edited = route.join() !== preset.stations.join()

  function choose(id: string) {
    const next = ROUTE_PRESETS.find((item) => item.id === id)

    if (!next) {
      return
    }

    setPresetId(id)
    setRoute(next.stations)
    setOpen(null)
  }

  function swap(index: number, slug: string) {
    setRoute((current) =>
      current.map((item, position) => (position === index ? slug : item))
    )
    setOpen(null)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        stack.map((tool) => tool.name).join(" + ")
      )
      setCopied(true)
      setTimeout(() => setCopied(false), COPIED_MS)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card size="sm" className="relative gap-0 py-0">
      <ToneEdge />

      <div className="border-b border-border p-4 sm:p-5">
        <h2 className="font-heading text-subsection tracking-tight">
          ¿Qué vas a construir?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elige un proyecto y te proponemos un stack que combina entre sí.
        </p>
        <div
          role="group"
          aria-label="Tipo de proyecto"
          className="mt-4 flex flex-wrap gap-1.5"
        >
          {ROUTE_PRESETS.map((item) => {
            const active = item.id === presetId

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(item.id)}
                className={cn(
                  "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ring-1 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 max-sm:h-10 max-sm:px-3.5",
                  active
                    ? "bg-primary text-primary-foreground ring-primary"
                    : "text-muted-foreground ring-border hover:bg-muted hover:text-foreground"
                )}
              >
                {item.name}
              </button>
            )
          })}
        </div>
      </div>

      <p className="px-4 pt-4 text-sm text-pretty sm:px-5">{preset.summary}</p>

      <ol key={presetId} className="px-2 py-2 sm:px-3 lg:min-h-[20.5rem]">
        {stack.map((tool, index) => {
          const partner = stack
            .slice(0, index)
            .find((other) => combines(other, tool))
          const category = getCategory(tool.category)
          const alternatives = sortByLevel(
            tools.filter(
              (other) =>
                other.category === tool.category &&
                !route.some(
                  (slug, position) => slug === other.slug && position !== index
                )
            )
          )

          return (
            <li
              key={index}
              style={
                {
                  ...toneStyle(tool.category),
                  "--step": index,
                } as React.CSSProperties
              }
              className="stack-row rounded-lg p-2"
            >
              <div className="flex items-center gap-3">
                <ToolMark tool={tool} className="size-9 text-sm" />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/t/${tool.slug}`}
                    className="block truncate text-sm font-medium hover:underline"
                  >
                    {tool.name}
                  </Link>
                  <span className="flex items-center gap-1 text-xs text-tone">
                    <CategoryIcon category={tool.category} className="size-3" />
                    {category?.name}
                    {partner ? (
                      <span className="ml-1.5 inline-flex items-center gap-1 text-muted-foreground">
                        <Link2 aria-hidden className="size-3" />
                        combina con {partner.name}
                      </span>
                    ) : null}
                  </span>
                </div>
                <PricingBadge pricing={tool.pricing} />
                <button
                  type="button"
                  aria-expanded={open === index}
                  aria-controls={`cambiar-${index}`}
                  aria-label={`Cambiar ${tool.name}`}
                  title="Cambiar"
                  onClick={() => setOpen(open === index ? null : index)}
                  disabled={alternatives.length < 2}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-40 aria-expanded:bg-muted aria-expanded:text-foreground max-sm:size-10"
                >
                  <ArrowLeftRight className="size-3.5" />
                </button>
              </div>

              {open === index ? (
                <div
                  id={`cambiar-${index}`}
                  className="mt-2 ml-12 flex flex-wrap gap-1.5"
                >
                  {alternatives.map((other) => {
                    const current = other.slug === tool.slug

                    return (
                      <button
                        key={other.slug}
                        type="button"
                        aria-pressed={current}
                        onClick={() => swap(index, other.slug)}
                        className={cn(
                          "inline-flex h-7 items-center gap-1.5 rounded-full pr-2.5 pl-1 text-xs font-medium ring-1 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 max-sm:h-10 max-sm:pl-2",
                          current
                            ? "bg-tone/15 ring-tone/40"
                            : "ring-border hover:bg-muted"
                        )}
                      >
                        <ToolMark
                          tool={other}
                          className="size-5 rounded-full text-[0.625rem]"
                        />
                        {other.name}
                        {current ? (
                          <Check aria-hidden className="size-3" />
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>

      <StackSummary
        stack={stack}
        edited={edited}
        copied={copied}
        onReset={() => choose(preset.id)}
        onCopy={copy}
      />
    </Card>
  )
}

function StackSummary({
  stack,
  edited,
  copied,
  onReset,
  onCopy,
}: {
  stack: PlannerTool[]
  edited: boolean
  copied: boolean
  onReset: () => void
  onCopy: () => void
}) {
  const prices = (["gratis", "freemium", "pago"] as Pricing[])
    .map((pricing) => ({
      pricing,
      count: stack.filter((tool) => tool.pricing === pricing).length,
    }))
    .filter((item) => item.count > 0)

  const top = stack.reduce<Level>(
    (max, tool) =>
      LEVEL_STEPS[tool.level] > LEVEL_STEPS[max] ? tool.level : max,
    "principiante"
  )

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-4 py-3 sm:px-5">
      <p className="flex-1 font-mono text-xs text-muted-foreground tabular-nums">
        {prices
          .map(
            ({ pricing, count }) =>
              `${count} ${PRICING_LABELS[pricing].toLowerCase()}`
          )
          .join(" · ")}{" "}
        · nivel {LEVEL_LABELS[top].toLowerCase()}
      </p>
      <div className="flex gap-1">
        {edited ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 max-sm:h-10 max-sm:px-3"
          >
            <RotateCcw aria-hidden className="size-3.5" />
            Restaurar
          </button>
        ) : null}
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 max-sm:h-10 max-sm:px-3"
        >
          {copied ? (
            <Check aria-hidden className="size-3.5 text-positive" />
          ) : (
            <Copy aria-hidden className="size-3.5" />
          )}
          {copied ? "Copiado" : "Copiar stack"}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? "Stack copiado al portapapeles" : ""}
        </span>
      </div>
    </div>
  )
}
