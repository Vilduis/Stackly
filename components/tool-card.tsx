import Link from "next/link"
import { BookOpen, Check, Columns2, ExternalLink } from "lucide-react"

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
import { Chip } from "@/components/ui/chip"
import { getCategory } from "@/lib/categories"
import { toneStyle } from "@/lib/tones"
import type { Tool } from "@/lib/types"

export function ToolCard({
  tool,
  showCategory = false,
  titleAs = "h3",
  comparing = false,
  onCompare,
}: {
  tool: Tool
  showCategory?: boolean
  titleAs?: "h2" | "h3"
  comparing?: boolean
  onCompare?: () => void
}) {
  const category = showCategory ? getCategory(tool.category) : null

  return (
    <Card
      data-spotlight
      style={toneStyle(tool.category)}
      className="spotlight-glow h-full transition duration-200 hover:shadow-md hover:ring-tone/35 motion-safe:hover:-translate-y-0.5"
    >
      <ToneEdge />
      <CardHeader>
        <div className="flex items-center gap-3">
          <ToolMark tool={tool} />
          <CardTitle as={titleAs} className="min-w-0 flex-1">
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
        </div>
      </CardContent>

      <CardFooter className="gap-4 text-xs">
        <ToolLink href={tool.website}>
          <ExternalLink aria-hidden />
          Web
        </ToolLink>
        {tool.docs ? (
          <ToolLink href={tool.docs}>
            <BookOpen aria-hidden />
            Docs
          </ToolLink>
        ) : null}
        {onCompare ? (
          <Chip
            accent="tone"
            pressed={comparing}
            onClick={onCompare}
            aria-label={`Comparar ${tool.name}`}
            className="relative z-10 ml-auto"
          >
            {comparing ? <Check aria-hidden /> : <Columns2 aria-hidden />}
            Comparar
          </Chip>
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
      className="relative z-10 inline-flex items-center gap-1.5 rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 max-sm:min-h-10 max-sm:px-1 [&>svg]:size-3.5"
    >
      {children}
    </a>
  )
}
