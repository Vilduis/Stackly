"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"

const COPIED_MS = 1600

export function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }

    const timer = setTimeout(() => setCopied(false), COPIED_MS)

    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="group/code relative flex items-center rounded-lg bg-muted/70 ring-1 ring-border">
      <pre className="min-w-0 flex-1 overflow-x-auto py-2 pr-2 pl-3 font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copiado" : "Copiar comando"}
        className="mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-500" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  )
}
