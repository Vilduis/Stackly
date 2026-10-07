"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Columns2, X } from "lucide-react"

import { trackSpotlight } from "@/components/spotlight"
import { ToolCard } from "@/components/tool-card"
import { buttonVariants } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { countLabel } from "@/lib/format"
import { LEVEL_LABELS, PRICING_LABELS } from "@/lib/labels"
import type { Level, Pricing, Tool } from "@/lib/types"

const LEVELS: Level[] = ["principiante", "intermedio", "avanzado"]

const PRICINGS: Pricing[] = ["gratis", "freemium", "pago"]

export function LineView({ tools }: { tools: Tool[] }) {
  const [pricing, setPricing] = useState<Pricing | null>(null)
  const [compare, setCompare] = useState<string[]>([])

  const prices = PRICINGS.filter((item) =>
    tools.some((tool) => tool.pricing === item)
  )
  const visible = tools.filter(
    (tool) => pricing === null || tool.pricing === pricing
  )
  const groups = LEVELS.map((level) => ({
    level,
    tools: visible.filter((tool) => tool.level === level),
  })).filter((group) => group.tools.length > 0)
  const selected = compare
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is Tool => tool !== undefined)

  function toggleCompare(slug: string) {
    setCompare((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug].slice(-2)
    )
  }

  return (
    <section>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {prices.length > 1 ? (
          <div
            role="group"
            aria-label="Filtrar por precio"
            className="flex flex-wrap gap-1.5"
          >
            <Chip pressed={pricing === null} onClick={() => setPricing(null)}>
              Todos los precios
            </Chip>
            {prices.map((item) => (
              <Chip
                key={item}
                pressed={pricing === item}
                onClick={() => setPricing(pricing === item ? null : item)}
              >
                {PRICING_LABELS[item]}
              </Chip>
            ))}
          </div>
        ) : null}
        <p
          role="status"
          aria-live="polite"
          className="text-xs text-muted-foreground tabular-nums"
        >
          {countLabel(visible.length, "herramienta")} · de principiante a
          avanzado
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No hay herramientas con ese precio en esta categoría.{" "}
          <button
            type="button"
            onClick={() => setPricing(null)}
            className="inline-flex min-h-10 items-center rounded-sm font-medium text-foreground underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:min-h-0"
          >
            Ver todas
          </button>
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section key={group.level} aria-labelledby={`nivel-${group.level}`}>
              <div className="flex items-baseline gap-3">
                <h2
                  id={`nivel-${group.level}`}
                  className="font-heading text-subsection"
                >
                  {LEVEL_LABELS[group.level]}
                </h2>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {countLabel(group.tools.length, "herramienta")}
                </span>
              </div>
              <div
                onPointerMove={trackSpotlight}
                className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {group.tools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    comparing={compare.includes(tool.slug)}
                    onCompare={() => toggleCompare(tool.slug)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {selected.length > 0 ? (
        <div className="sticky bottom-4 z-40 mt-10 flex flex-wrap items-center gap-3 rounded-xl bg-popover/90 px-4 py-3 shadow-lg ring-1 ring-foreground/10 backdrop-blur-md">
          <Columns2
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
          <p
            role="status"
            aria-live="polite"
            className="min-w-0 flex-1 text-sm"
          >
            {selected.length === 1 ? (
              <>
                <span className="font-medium">{selected[0].name}</span>: elige
                otra para comparar
              </>
            ) : (
              <>
                <span className="font-medium">{selected[0].name}</span> frente a{" "}
                <span className="font-medium">{selected[1].name}</span>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={() => setCompare([])}
            aria-label="Quitar selección"
            className={buttonVariants({
              variant: "ghost",
              size: "icon-sm",
              className: "max-sm:size-10",
            })}
          >
            <X />
          </button>
          {selected.length === 2 ? (
            <Link
              href={`/comparar?a=${selected[0].slug}&b=${selected[1].slug}`}
              className={buttonVariants({
                size: "sm",
                className: "max-sm:h-10",
              })}
            >
              Comparar
              <ArrowRight />
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
