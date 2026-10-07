"use client"

import { Check, Copy } from "lucide-react"

import { useCopy } from "@/hooks/use-copy"

export function CodeSnippet({ code }: { code: string }) {
  const { copied, copy } = useCopy()

  return (
    <div className="group/code relative flex items-center rounded-lg bg-muted/70 ring-1 ring-border">
      <pre
        tabIndex={0}
        className="min-w-0 flex-1 [scrollbar-width:thin] overflow-x-auto rounded-l-lg [mask-image:linear-gradient(to_right,#000_calc(100%-1.5rem),transparent)] py-2 pr-6 pl-3 font-mono text-xs leading-relaxed outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() => copy(code)}
        aria-label={copied ? "Copiado" : "Copiar comando"}
        className="mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-background hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 max-sm:size-10"
      >
        {copied ? (
          <Check aria-hidden className="size-3.5 text-positive" />
        ) : (
          <Copy aria-hidden className="size-3.5" />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Comando copiado al portapapeles" : ""}
      </span>
    </div>
  )
}
