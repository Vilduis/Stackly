import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"

import "./globals.css"
import { Aurora } from "@/components/aurora"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { SITE_NAME } from "@/lib/metadata"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-heading",
})

const TITLE = "Stackly — Catálogo de herramientas para crear tu web"
const DESCRIPTION =
  "Catálogo de herramientas para crear páginas web, organizado por categorías: frontend, backend, bases de datos, componentes UI, estilos, iconos e inspiración."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Stackly",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "es_ES",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      style={{ colorScheme: "dark" }}
      className={cn(
        "dark antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable,
        instrumentSerif.variable
      )}
    >
      <body>
        <ThemeProvider>
          <div className="relative flex min-h-svh flex-col">
            <Aurora />
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
