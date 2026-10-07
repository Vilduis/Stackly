"use client"

import { useId, useMemo } from "react"
import { ChevronsUpDown, Search } from "lucide-react"

import { ToolMark } from "@/components/tool-mark"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxLabel,
  ComboboxList,
  ComboboxItem,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import { CATEGORIES, getCategory } from "@/lib/categories"
import type { CompareOption } from "@/lib/routes"
import { normalize } from "@/lib/search"
import { cn } from "@/lib/utils"

type ToolGroup = {
  value: string
  label: string
  items: CompareOption[]
}

function buildGroups(
  options: CompareOption[],
  rival: CompareOption
): ToolGroup[] {
  const pool = options.filter((option) => option.slug !== rival.slug)
  const near = getCategory(rival.category)

  const groups: ToolGroup[] = near
    ? [
        {
          value: "cercanas",
          label: `${near.name} · misma categoría que ${rival.name}`,
          items: pool.filter((option) => option.category === near.slug),
        },
      ]
    : []

  for (const category of CATEGORIES) {
    if (category.slug === near?.slug) {
      continue
    }

    groups.push({
      value: category.slug,
      label: category.name,
      items: pool.filter((option) => option.category === category.slug),
    })
  }

  return groups.filter((group) => group.items.length > 0)
}

function matches(option: CompareOption, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  const haystack = normalize(
    `${option.name} ${getCategory(option.category)?.name ?? ""}`
  )

  return terms.every((term) => haystack.includes(term))
}

export function ToolCombobox({
  label,
  value,
  rival,
  options,
  onChange,
}: {
  label: string
  value: CompareOption
  rival: CompareOption
  options: CompareOption[]
  onChange: (slug: string) => void
}) {
  const labelId = useId()
  const groups = useMemo(() => buildGroups(options, rival), [options, rival])

  return (
    <div className="grid min-w-0 gap-1.5">
      <span id={labelId} className="text-sm text-muted-foreground">
        {label}
      </span>
      <Combobox
        items={groups}
        value={value}
        onValueChange={(next: CompareOption | null) => {
          if (next && next.slug !== value.slug) {
            onChange(next.slug)
          }
        }}
        itemToStringLabel={(option: CompareOption) => option.name}
        isItemEqualToValue={(a: CompareOption, b: CompareOption) =>
          a.slug === b.slug
        }
        filter={matches}
      >
        <ComboboxTrigger
          aria-labelledby={labelId}
          className="group flex h-11 w-full min-w-0 items-center gap-2.5 rounded-md border border-input bg-transparent pr-2.5 pl-1.5 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-ring sm:h-10 dark:bg-input/30 dark:hover:bg-input/50 [&>svg:last-child]:hidden"
        >
          <ToolMark tool={value} className="size-7 rounded-md text-xs" />
          <span className="min-w-0 flex-1 truncate font-medium">
            {value.name}
          </span>
          <span className="hidden truncate text-xs text-muted-foreground sm:block">
            {getCategory(value.category)?.name}
          </span>
          <ChevronsUpDown
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
        </ComboboxTrigger>

        <ComboboxContent className="min-w-(--anchor-width)">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <ComboboxInput
              showTrigger={false}
              placeholder="Buscar herramienta…"
              aria-label={`Buscar ${label.toLowerCase()}`}
              className="pl-7 max-sm:h-11!"
            />
          </div>
          <ComboboxEmpty>No hay herramientas con ese nombre.</ComboboxEmpty>
          <ComboboxList>
            {(group: ToolGroup) => (
              <ComboboxGroup
                key={group.value}
                items={group.items}
                className="not-first:mt-1"
              >
                <ComboboxLabel
                  className={cn(
                    "sticky top-0 z-10 bg-popover",
                    group.value === "cercanas" && "text-foreground"
                  )}
                >
                  {group.label}
                </ComboboxLabel>
                <ComboboxCollection>
                  {(option: CompareOption) => (
                    <ComboboxItem
                      key={option.slug}
                      value={option}
                      className="gap-2.5 max-sm:min-h-11"
                    >
                      <ToolMark
                        tool={option}
                        className="size-6 rounded-md text-[0.625rem]"
                      />
                      {option.name}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
