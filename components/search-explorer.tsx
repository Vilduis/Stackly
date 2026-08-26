"use client"

import { useSearchParams } from "next/navigation"

import { ToolExplorer } from "@/components/tool-explorer"
import type { Tool } from "@/lib/types"

export function SearchExplorer({ tools }: { tools: Tool[] }) {
  const query = useSearchParams().get("q") ?? ""

  return (
    <ToolExplorer
      key={query}
      tools={tools}
      showCategoryFilter
      initialQuery={query}
    />
  )
}
