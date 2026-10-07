"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { ToolExplorer } from "@/components/tool-explorer"
import { readFilters, readPage, writeFilters } from "@/lib/search"
import type { Tool } from "@/lib/types"

export function SearchExplorer({ tools }: { tools: Tool[] }) {
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const [source, setSource] = useState(search)
  const [filters, setFilters] = useState(() =>
    readFilters(new URLSearchParams(search))
  )
  const [page, setPage] = useState(() => readPage(new URLSearchParams(search)))

  if (search !== source) {
    setSource(search)

    if (search !== writeFilters(filters, page)) {
      const params = new URLSearchParams(search)
      setFilters(readFilters(params))
      setPage(readPage(params))
    }
  }

  useEffect(() => {
    const next = writeFilters(filters, page)

    if (next !== window.location.search.slice(1)) {
      window.history.replaceState(null, "", next ? `?${next}` : pathname)
    }
  }, [filters, page, pathname])

  return (
    <ToolExplorer
      tools={tools}
      filters={filters}
      page={page}
      onFiltersChange={setFilters}
      onPageChange={setPage}
    />
  )
}
