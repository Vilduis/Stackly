import Link from "next/link"
import { BookOpen, ExternalLink } from "lucide-react"

import { ToneEdge } from "@/components/tone-edge"
import { LevelBadge, PricingBadge } from "@/components/tool-badges"
import { ToolMark } from "@/components/tool-mark"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCategory } from "@/lib/categories"
import { toneStyle } from "@/lib/tones"
import type { Tool } from "@/lib/types"

export function ToolCard({
  tool,
  showCategory = false,
}: {
  tool: Tool
  showCategory?: boolean
}) {
  const category = showCategory ? getCategory(tool.category) : null

  return (
    <Card
      data-spotlight
      style={toneStyle(tool.category)}
      className="spotlight-glow h-full transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-tone/35"
    >
      <ToneEdge />
      <CardHeader>
        <div className="flex items-center gap-3">
          <ToolMark tool={tool} />
          <CardTitle className="min-w-0 flex-1">
            <Link
              href={`/t/${tool.slug}`}
              className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
            >
              {tool.name}
            </Link>
          </CardTitle>
        </div>
        <CardDescription className="mt-3">{tool.tagline}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1.5">
          {category ? (
            <Badge variant="outline" className="border-tone/30 text-tone">
              {category.name}
            </Badge>
          ) : null}
          <PricingBadge pricing={tool.pricing} />
          <LevelBadge level={tool.level} />
          {tool.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="font-mono text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="gap-4 text-xs">
        <ToolLink href={tool.website}>
          <ExternalLink />
          Web
        </ToolLink>
        {tool.docs ? (
          <ToolLink href={tool.docs}>
            <BookOpen />
            Docs
          </ToolLink>
        ) : null}
      </CardFooter>
    </Card>
  )
}

function ToolLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground [&>svg]:size-3.5"
    >
      {children}
    </a>
  )
}
