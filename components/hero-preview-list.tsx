"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"

import { ToolMark } from "@/components/tool-mark"
import type { Category, Tool } from "@/lib/types"

const VISIBLE = 6
const ROTATION_MS = 2500

type Group = { category: Category; tools: Tool[] }

type Rotation = {
  slots: number[]
  queue: number[]
  steps: number[]
  cursor: number
}

function initRotation(groups: Group[]): Rotation {
  const shown = Math.min(VISIBLE, groups.length)

  return {
    slots: Array.from({ length: shown }, (_, index) => index),
    queue: Array.from(
      { length: groups.length - shown },
      (_, index) => shown + index
    ),
    steps: groups.map(() => 0),
    cursor: 0,
  }
}

function advance(state: Rotation): Rotation {
  const outgoing = state.slots[state.cursor]
  const cursor = (state.cursor + 1) % state.slots.length

  const steps = state.steps.map((step, index) =>
    index === outgoing ? step + 1 : step
  )

  if (state.queue.length === 0) {
    return { ...state, steps, cursor }
  }

  const [incoming, ...waiting] = state.queue

  return {
    slots: state.slots.map((slot, index) =>
      index === state.cursor ? incoming : slot
    ),
    queue: [...waiting, outgoing],
    steps,
    cursor,
  }
}

export function HeroPreviewList({ groups }: { groups: Group[] }) {
  const [rotation, setRotation] = useState(() => initRotation(groups))
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (paused || reduced.matches) {
      return
    }

    const timer = setInterval(() => setRotation(advance), ROTATION_MS)

    return () => clearInterval(timer)
  }, [paused])

  return (
    <ul
      className="space-y-0.5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {rotation.slots.map((group, slot) => {
        const { category, tools } = groups[group]
        const tool = tools[rotation.steps[group] % tools.length]

        return (
          <li key={slot}>
            <Link
              href={`/t/${tool.slug}`}
              className="group -mx-2 flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span
                key={tool.slug}
                className="flex min-w-0 flex-1 animate-in items-center gap-3 duration-500 fade-in slide-in-from-bottom-1 motion-reduce:animate-none"
              >
                <ToolMark tool={tool} className="size-9 text-sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {tool.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {category.name}
                  </span>
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
